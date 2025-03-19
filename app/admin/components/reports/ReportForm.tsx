'use client';

import { useState } from 'react';
import { ReportTemplate } from '../../types/report';

interface ReportFormProps {
  templates: ReportTemplate[];
  onSubmit: (data: {
    templateId: string;
    dateRange: {
      start: string;
      end: string;
    };
  }) => void;
  onCancel: () => void;
}

export default function ReportForm({ templates, onSubmit, onCancel }: ReportFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      templateId: selectedTemplate,
      dateRange,
    });
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="template" className="block text-sm font-medium text-gray-700">
          Template Laporan
        </label>
        <select
          id="template"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        >
          <option value="">Pilih template...</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.format.toUpperCase()})
            </option>
          ))}
        </select>
        {selectedTemplateData && (
          <p className="mt-1 text-sm text-gray-500">{selectedTemplateData.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
          Periode Laporan
        </label>
        <div className="mt-1 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-xs text-gray-500">
              Tanggal Mulai
            </label>
            <input
              type="date"
              id="startDate"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-xs text-gray-500">
              Tanggal Selesai
            </label>
            <input
              type="date"
              id="endDate"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Buat Laporan
        </button>
      </div>
    </form>
  );
} 