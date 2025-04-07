'use client';

import { ComponentData } from '@/app/types/editor';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface HeroElementProps {
  component: ComponentData;
  onSelect: () => void;
  onDelete: () => void;
  isEditor?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function HeroElement({
  component,
  onSelect,
  onDelete,
  isEditor = false,
  onMoveUp,
  onMoveDown
}: HeroElementProps) {
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
        <div 
          className="w-full"
          style={{
            marginTop: component.props?.isSticky ? '80px' : '0',
            ...(component.props?.backgroundType === 'color' && {
              backgroundColor: component.props?.backgroundColor || '#ffffff'
            }),
            ...(component.props?.backgroundType === 'image' && {
              backgroundImage: `url(${component.props?.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }),
            ...(component.props?.backgroundType === 'gradient' && {
              background: `linear-gradient(${component.props?.gradientDirection || 'to right'}, ${component.props?.gradientStartColor || '#3c87d3'}, ${component.props?.gradientEndColor || '#23853c'})`
            })
          }}
        >
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{component.props?.title}</h1>
              <p className="text-xl mb-8">{component.props?.description}</p>
              {component.props?.ctaButton && (
                <a
                  href={component.props.ctaButton.href}
                  className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                    component.props.ctaButton.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : component.props.ctaButton.variant === 'secondary'
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {component.props.ctaButton.text}
                </a>
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