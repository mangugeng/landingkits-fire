'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserFormData } from '../types/user';
import UserTable from '../components/users/UserTable';
import UserForm from '../components/users/UserForm';
import { db } from '../../../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Gagal memuat data pengguna');
    }
  };

  const handleAddUser = async (userData: UserFormData) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const newUser: User = {
        id: docRef.id,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setUsers([...users, newUser]);
      setShowForm(false);
      toast.success('Pengguna berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Gagal menambahkan pengguna');
    }
  };

  const handleUpdateUser = async (updatedUser: UserFormData) => {
    if (!selectedUser) return;

    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        ...updatedUser,
        updatedAt: new Date().toISOString()
      });
      
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...updatedUser, updatedAt: new Date().toISOString() }
          : user
      ));
      setSelectedUser(null);
      toast.success('Pengguna berhasil diperbarui');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Gagal memperbarui pengguna');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Pengguna berhasil dihapus');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Gagal menghapus pengguna');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Tambah Pengguna
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <UserForm
            onSubmit={handleAddUser}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {selectedUser && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <UserForm
            user={selectedUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setSelectedUser(null)}
          />
        </div>
      )}

      <UserTable
        users={users}
        onEdit={setSelectedUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
} 