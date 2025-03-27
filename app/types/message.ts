import { Timestamp } from 'firebase/firestore';

export type MessageType = 'text' | 'image' | 'file';

export interface Message {
  id: string;
  senderId: string;
  sender: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  isRead: boolean;
  avatar?: string;
  type: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  conversationId?: string;
}

export interface Reply extends Omit<Message, 'id'> {
  parentMessageId: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 