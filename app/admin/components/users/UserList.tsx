'use client';

import { User } from '../../types/user';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';

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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Login Terakhir
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('id-ID') : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(user)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                  title="Edit"
                >
                  <FiEdit2 className="inline-block" />
                </button>
                {user.status === 'active' ? (
                  <button
                    onClick={() => onStatusChange(user.id, 'inactive')}
                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                    title="Nonaktifkan"
                  >
                    <FiUserX className="inline-block" />
                  </button>
                ) : (
                  <button
                    onClick={() => onStatusChange(user.id, 'active')}
                    className="text-green-600 hover:text-green-900 mr-4"
                    title="Aktifkan"
                  >
                    <FiUserCheck className="inline-block" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Hapus"
                >
                  <FiTrash2 className="inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 