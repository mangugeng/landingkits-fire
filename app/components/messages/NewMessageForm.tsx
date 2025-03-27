'use client';

import { useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function NewMessageForm() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    receiverId: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        senderId: user.uid,
        sender: user.displayName || user.email,
        receiverId: formData.receiverId,
        content: formData.content,
        timestamp: serverTimestamp(),
        isRead: false,
        avatar: user.photoURL || '',
      });

      toast.success('Pesan berhasil dikirim!');
      setFormData({ receiverId: '', content: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusIcon className="h-5 w-5 mr-2" />
          Kirim Pesan Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kirim Pesan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="receiverId" className="text-sm font-medium">
              ID Penerima
            </label>
            <Input
              id="receiverId"
              value={formData.receiverId}
              onChange={(e) => setFormData({ ...formData, receiverId: e.target.value })}
              placeholder="Masukkan ID penerima"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Isi Pesan
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Tulis pesan Anda di sini..."
              required
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim Pesan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 