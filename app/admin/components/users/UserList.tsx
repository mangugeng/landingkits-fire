'use client';

import { User } from '../../types/user';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: 'active' | 'inactive') => void;
  editingUser: User | null;
  onSaveEdit: (user: User) => void;
  onCancelEdit: () => void;
}

export default function UserList({ 
  users, 
  onEdit, 
  onDelete, 
  onStatusChange,
  editingUser,
  onSaveEdit,
  onCancelEdit
}: UserListProps) {
  const [editedUser, setEditedUser] = useState<User | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (user: User) => {
    setEditedUser({ ...user });
    onEdit(user);
  };

  const handleSave = () => {
    if (editedUser) {
      onSaveEdit(editedUser);
      setEditedUser(null);
    }
  };

  const handleCancel = () => {
    setEditedUser(null);
    onCancelEdit();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pengguna
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Langganan
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Terdaftar
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Login Terakhir
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    {editingUser?.id === user.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editedUser?.name || ''}
                          onChange={(e) => setEditedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <input
                          type="email"
                          value={editedUser?.email || ''}
                          onChange={(e) => setEditedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUser?.id === user.id ? (
                  <select
                    value={editedUser?.role || ''}
                    onChange={(e) => setEditedUser(prev => prev ? { ...prev, role: e.target.value as 'admin' | 'user' } : null)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">Pengguna</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' ? 'Admin' : 'Pengguna'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                  {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUser?.id === user.id ? (
                  <div className="space-y-2">
                    <select
                      value={editedUser?.subscription?.plan || 'starter'}
                      onChange={(e) => setEditedUser(prev => prev ? {
                        ...prev,
                        subscription: {
                          ...prev.subscription,
                          plan: e.target.value as 'starter' | 'professional' | 'premium' | 'enterprise'
                        }
                      } : null)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="starter">Starter</option>
                      <option value="professional">Professional</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                    <select
                      value={editedUser?.subscription?.status || 'active'}
                      onChange={(e) => setEditedUser(prev => prev ? {
                        ...prev,
                        subscription: {
                          ...prev.subscription,
                          status: e.target.value as 'active' | 'expired' | 'cancelled'
                        }
                      } : null)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="active">Aktif</option>
                      <option value="expired">Kadaluarsa</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-900">
                      {user.subscription?.plan === 'starter' ? 'Starter' : 
                       user.subscription?.plan === 'professional' ? 'Professional' :
                       user.subscription?.plan === 'premium' ? 'Premium' : 'Enterprise'}
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.subscription?.status || 'active')}`}>
                      {user.subscription?.status === 'active' ? 'Aktif' : 
                       user.subscription?.status === 'expired' ? 'Kadaluarsa' : 'Dibatalkan'}
                    </span>
                  </>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: id })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.lastLogin ? format(new Date(user.lastLogin), 'dd MMMM yyyy', { locale: id }) : 'Belum login'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingUser?.id === user.id ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-900"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                      className={`${
                        user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 