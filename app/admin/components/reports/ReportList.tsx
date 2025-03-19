'use client';

import { Report } from '../../types/report';
import { FiDownload, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface ReportListProps {
  reports: Report[];
  onDownload: (report: Report) => void;
}

export default function ReportList({ reports, onDownload }: ReportListProps) {
  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <FiClock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <FiXCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Sedang Diproses';
      case 'failed':
        return 'Gagal';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Riwayat Laporan</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Format
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{report.title}</div>
                  <div className="text-sm text-gray-500">{report.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{report.format.toUpperCase()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(report.dateRange.start).toLocaleDateString('id-ID')} -{' '}
                    {new Date(report.dateRange.end).toLocaleDateString('id-ID')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(report.status)}
                    <span className="ml-2 text-sm text-gray-900">
                      {getStatusText(report.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.status === 'completed' && report.downloadUrl && (
                    <button
                      onClick={() => onDownload(report)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Download"
                    >
                      <FiDownload className="inline-block" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 