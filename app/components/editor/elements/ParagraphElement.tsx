'use client';

import { ComponentData } from '@/app/types/editor';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface ParagraphElementProps {
  component: ComponentData;
  onSelect: () => void;
  onDelete: () => void;
  isEditor?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function ParagraphElement({
  component,
  onSelect,
  onDelete,
  isEditor = false,
  onMoveUp,
  onMoveDown
}: ParagraphElementProps) {
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
        <p className={`text-lg mb-4 ${
          component.props?.alignment === 'center' ? 'text-center' : 
          component.props?.alignment === 'right' ? 'text-right' : 'text-left'
        }`}>
          {component.content}
        </p>
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