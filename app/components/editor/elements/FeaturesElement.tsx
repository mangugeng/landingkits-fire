'use client';

import { ComponentData } from '@/app/types/editor';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface FeaturesElementProps {
  component: ComponentData;
  onSelect: () => void;
  onDelete: () => void;
  isEditor?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function FeaturesElement({
  component,
  onSelect,
  onDelete,
  isEditor = false,
  onMoveUp,
  onMoveDown
}: FeaturesElementProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="w-full relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        onClick={onSelect}
        className={`cursor-pointer ${
          isEditor ? 'hover:bg-gray-50 p-2 rounded transition-colors' : ''
        }`}
      >
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props?.features?.map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isEditor && isHovered && (
        <div className="absolute top-0 right-0 flex items-center space-x-2 bg-white shadow-sm rounded-lg p-1">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-1 text-gray-400 hover:text-blue-500 rounded"
              title="Pindahkan ke atas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 text-gray-400 hover:text-blue-500 rounded"
              title="Pindahkan ke bawah"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          <button
            onClick={onSelect}
            className="p-1 text-gray-400 hover:text-blue-500 rounded"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500 rounded"
            title="Hapus"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
} 