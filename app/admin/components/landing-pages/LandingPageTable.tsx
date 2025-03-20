'use client';

import { LandingPage } from '../../types/landing-page';
import { FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiArchive } from 'react-icons/fi';

interface LandingPageTableProps {
  landingPages: LandingPage[];
  onEdit: (page: LandingPage) => void;
  onDelete: (pageId: string) => void;
  onPreview: (page: LandingPage) => void;
  onPublish: (pageId: string) => void;
  onUnpublish: (pageId: string) => void;
  onArchive: (pageId: string) => void;
}

export default function LandingPageTable({
  landingPages,
  onEdit,
  onDelete,
  onPreview,
  onPublish,
  onUnpublish,
  onArchive,
}: LandingPageTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Judul
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pembuat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Views
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal Dibuat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {landingPages.map((page) => (
            <tr key={page.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{page.title}</div>
                <div className="text-sm text-gray-500">{page.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{page.userName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  page.status === 'published' 
                    ? 'bg-green-100 text-green-800'
                    : page.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {page.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {page.analytics?.visitors || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {page.analytics?.conversionRate ? `${page.analytics.conversionRate}%` : '0%'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(page.createdAt).toLocaleDateString('id-ID')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onPreview(page)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                  title="Preview"
                >
                  <FiEye className="inline-block" />
                </button>
                <button
                  onClick={() => onEdit(page)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                  title="Edit"
                >
                  <FiEdit2 className="inline-block" />
                </button>
                {page.status === 'draft' && (
                  <button
                    onClick={() => onPublish(page.id)}
                    className="text-green-600 hover:text-green-900 mr-4"
                    title="Publish"
                  >
                    <FiCheckCircle className="inline-block" />
                  </button>
                )}
                {page.status === 'published' && (
                  <button
                    onClick={() => onUnpublish(page.id)}
                    className="text-yellow-600 hover:text-yellow-900 mr-4"
                    title="Unpublish"
                  >
                    <FiXCircle className="inline-block" />
                  </button>
                )}
                <button
                  onClick={() => onArchive(page.id)}
                  className="text-gray-600 hover:text-gray-900 mr-4"
                  title="Archive"
                >
                  <FiArchive className="inline-block" />
                </button>
                <button
                  onClick={() => onDelete(page.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
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