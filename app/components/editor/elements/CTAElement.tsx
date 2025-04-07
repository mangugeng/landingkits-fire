'use client';

import { ComponentData } from '@/app/types/editor';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface CTAElementProps {
  component: ComponentData;
  onSelect: () => void;
  onDelete: () => void;
  isEditor?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function CTAElement({
  component,
  onSelect,
  onDelete,
  isEditor = false,
  onMoveUp,
  onMoveDown
}: CTAElementProps) {
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
        <div className={`w-full py-16 px-4 ${
          component.props?.backgroundType === 'image' 
            ? 'bg-cover bg-center' 
            : component.props?.backgroundType === 'gradient'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
            : 'bg-blue-600'
        }`} style={
          component.props?.backgroundType === 'image' 
            ? { backgroundImage: `url(${component.props?.backgroundImage})` }
            : {}
        }>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {component.props?.title}
            </h2>
            <p className="text-lg text-white/90 mb-8">
              {component.props?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {component.props?.primaryButton && (
                <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  {component.props.primaryButton.text}
                </button>
              )}
              {component.props?.secondaryButton && (
                <button className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                  {component.props.secondaryButton.text}
                </button>
              )}
            </div>
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