'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import UserList from '../components/users/UserList';
import { User } from '../types/user';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Cek status login
    const isLoggedIn = Cookies.get('admin_login');
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    // Ambil data pengguna dari Firebase
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleEdit = async (user: User) => {
    setEditingUser(user);
  };

  const handleSaveEdit = async (updatedUser: User) => {
    try {
      const userRef = doc(db, 'users', updatedUser.id);
      await updateDoc(userRef, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscription: updatedUser.subscription
      });
      
      setUsers(users.map(user => 
        user.id === updatedUser.id 
          ? updatedUser
          : user
      ));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleStatusChange = async (userId: string, status: 'active' | 'inactive') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: status
      });
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status }
          : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pengguna</h1>
        <button
          onClick={() => console.log('Add new user')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Tambah Pengguna
        </button>
      </div>
      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        editingUser={editingUser}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={() => setEditingUser(null)}
      />
    </div>
  );
} 