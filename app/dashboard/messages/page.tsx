"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, where, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiSearch, FiFilter, FiMail, FiTrash2, FiStar, FiX, FiSend, FiCornerUpLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface Message {
  id: string;
  sender: string;
  email: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  starred: boolean;
  recipients?: string[];
  isBroadcast?: boolean;
  replyTo?: string;
  originalSubject?: string;
  threadId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    recipients: [] as string[],
    isBroadcast: false,
    replyTo: '',
    originalSubject: '',
    threadId: ''
  });
  const [activeContacts, setActiveContacts] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth');
        return;
      }

      try {
        await Promise.all([fetchMessages(), fetchUsers()]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    setActiveContacts(getActiveContacts());
  }, [messages, users]);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    setNewMessage({
      subject: `Re: ${message.subject}`,
      content: '',
      recipients: [message.sender],
      isBroadcast: false,
      replyTo: message.id,
      originalSubject: message.subject,
      threadId: message.threadId || message.id
    });
    setShowNewMessageDialog(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      const messageData = {
        sender: currentUser.displayName || 'Admin',
        email: currentUser.email,
        subject: newMessage.subject,
        content: newMessage.content,
        date: new Date().toISOString(),
        read: false,
        starred: false,
        recipients: newMessage.isBroadcast ? users.map(user => user.id) : newMessage.recipients,
        isBroadcast: newMessage.isBroadcast,
        replyTo: newMessage.replyTo,
        originalSubject: newMessage.originalSubject,
        threadId: newMessage.threadId
      };

      await addDoc(collection(db, 'messages'), messageData);
      
      // Reset form
      setNewMessage({
        subject: '',
        content: '',
        recipients: [],
        isBroadcast: false,
        replyTo: '',
        originalSubject: '',
        threadId: ''
      });
      
      setShowNewMessageDialog(false);
      setReplyingTo(null);
      toast.success('Pesan berhasil dikirim!');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan');
    }
  };

  const handleRecipientToggle = (userId: string) => {
    setNewMessage(prev => ({
      ...prev,
      recipients: prev.recipients.includes(userId)
        ? prev.recipients.filter(id => id !== userId)
        : [...prev.recipients, userId]
    }));
  };

  const handleBroadcastToggle = () => {
    setNewMessage(prev => ({
      ...prev,
      isBroadcast: !prev.isBroadcast,
      recipients: !prev.isBroadcast ? users.map(user => user.id) : []
    }));
  };

  const handleStarMessage = async (messageId: string, currentStarred: boolean) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        starred: !currentStarred
      });
      
      // Update local state
      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { ...message, starred: !currentStarred }
          : message
      ));
      
      toast.success(currentStarred ? 'Pesan dihapus dari penting' : 'Pesan ditandai sebagai penting');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Gagal memperbarui status pesan');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'messages', messageId));
      
      // Update local state
      setMessages(prev => prev.filter(message => message.id !== messageId));
      
      toast.success('Pesan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Gagal menghapus pesan');
    }
  };

  const handleMarkAsRead = async (messageId: string, currentRead: boolean) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        read: !currentRead
      });
      
      // Update local state
      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { ...message, read: !currentRead }
          : message
      ));
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Gagal memperbarui status pesan');
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' ? true :
                         filter === 'unread' ? !message.read :
                         filter === 'starred' ? message.starred : true;
    
    return matchesSearch && matchesFilter;
  });

  const groupMessagesByThread = (messages: Message[]) => {
    const threads: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const threadId = message.threadId || message.id;
      if (!threads[threadId]) {
        threads[threadId] = [];
      }
      threads[threadId].push(message);
    });

    Object.keys(threads).forEach(threadId => {
      threads[threadId].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return threads;
  };

  const getActiveContacts = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return [];

    const contactIds = new Set<string>();
    messages.forEach(message => {
      if (message.sender === currentUser.displayName) {
        message.recipients?.forEach(recipientId => contactIds.add(recipientId));
      } else if (message.recipients?.includes(currentUser.uid)) {
        contactIds.add(message.sender);
      }
    });

    return users.filter(user => contactIds.has(user.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar Kontak */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Kontak</h2>
            <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <FiMail className="mr-2 h-4 w-4" />
                  Pesan Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {replyingTo ? 'Balas Pesan' : 'Pesan Baru'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input
                      id="subject"
                      required
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Konten</Label>
                    <Textarea
                      id="content"
                      required
                      rows={4}
                      value={newMessage.content}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  {!replyingTo && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="broadcast"
                          checked={newMessage.isBroadcast}
                          onCheckedChange={handleBroadcastToggle}
                        />
                        <Label htmlFor="broadcast">Kirim ke semua pengguna</Label>
                      </div>
                      {!newMessage.isBroadcast && (
                        <div className="space-y-2">
                          <Label>Pilih Penerima</Label>
                          <ScrollArea className="h-[200px] border rounded-md p-4">
                            <div className="space-y-2">
                              {users.map(user => (
                                <div key={user.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={user.id}
                                    checked={newMessage.recipients.includes(user.id)}
                                    onCheckedChange={() => handleRecipientToggle(user.id)}
                                  />
                                  <Label htmlFor={user.id}>{user.name} ({user.email})</Label>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewMessageDialog(false);
                        setReplyingTo(null);
                      }}
                    >
                      Batal
                    </Button>
                    <Button type="submit">
                      <FiSend className="mr-2 h-5 w-5" />
                      Kirim
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              className="pl-10"
              placeholder="Cari kontak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="p-2">
            {activeContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiMail className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Belum ada percakapan</p>
              </div>
            ) : (
              activeContacts
                .filter(user => 
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(user => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setNewMessage(prev => ({
                        ...prev,
                        recipients: [user.id]
                      }));
                      setShowNewMessageDialog(true);
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 rounded-full p-0 bg-gray-100"
                    >
                      <FiMail className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Area Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pesan</h2>
            <div className="relative">
              <select
                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Semua Pesan</option>
                <option value="unread">Belum Dibaca</option>
                <option value="starred">Pesan Penting</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {Object.entries(groupMessagesByThread(filteredMessages)).map(([threadId, threadMessages]) => (
              <div key={threadId} className="space-y-2">
                {threadMessages.map((message, index) => {
                  const isCurrentUser = message.sender === auth.currentUser?.displayName;
                  return (
                    <div 
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${
                        index > 0 ? 'mt-2' : ''
                      }`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className="flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(message.id, message.read)}
                            className={`h-10 w-10 rounded-full p-0 ${
                              message.read ? 'bg-gray-100' : 'bg-indigo-100'
                            }`}
                          >
                            <FiMail className={`h-6 w-6 ${
                              message.read ? 'text-gray-400' : 'text-indigo-600'
                            }`} />
                          </Button>
                        </div>
                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs text-gray-500">
                              {message.sender}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(message.date).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className={`relative group rounded-lg p-3 ${
                            isCurrentUser 
                              ? 'bg-blue-500 text-white rounded-br-none' 
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          }`}>
                            <div className="text-sm">
                              {message.content}
                            </div>
                            {message.replyTo && (
                              <div className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                Balasan untuk: {message.originalSubject}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReply(message)}
                                  className={`h-6 w-6 p-0 ${
                                    isCurrentUser ? 'text-blue-100 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  <FiCornerUpLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStarMessage(message.id, message.starred)}
                                  className={`h-6 w-6 p-0 ${
                                    message.starred 
                                      ? 'text-yellow-500' 
                                      : isCurrentUser 
                                        ? 'text-blue-100 hover:text-white' 
                                        : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  <FiStar className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className={`h-6 w-6 p-0 ${
                                    isCurrentUser 
                                      ? 'text-blue-100 hover:text-white' 
                                      : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Form Pengiriman Pesan */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Ketik pesan..."
                value={newMessage.content}
                onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                className="w-full"
              />
            </div>
            <Button type="submit">
              <FiSend className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 