'use client';

import { ComponentData } from '@/app/types/editor';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface HeaderElementProps {
  component: ComponentData;
  onSelect: () => void;
  onDelete: () => void;
  isEditor?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function HeaderElement({
  component,
  onSelect,
  onDelete,
  isEditor = false,
  onMoveUp,
  onMoveDown
}: HeaderElementProps) {
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
        <header 
          className={`w-full ${
            component.props?.isSticky ? 'fixed top-0 left-0 right-0 z-50' : ''
          }`}
          style={{
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
            }),
            boxShadow: component.props?.isSticky ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {component.props?.logo && (
                <a href="/" className="flex items-center">
                  <img
                    src={component.props.logo.src}
                    alt={component.props.logo.alt}
                    width={component.props.logo.width || 200}
                    height={component.props.logo.height || 50}
                    className="h-8 w-auto"
                  />
                </a>
              )}
              
              <nav className="hidden md:flex space-x-8">
                {component.props?.navigation?.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        e.preventDefault();
                        const targetElement = document.querySelector(item.href);
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    style={{
                      color: item.textColor || component.props?.textColor || '#4B5563',
                      transition: 'color 0.2s ease'
                    }}
                    className="font-medium hover:opacity-80"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {component.props?.ctaButton && (
                <a
                  href={component.props.ctaButton.href}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
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
        </header>
        {component.props?.isSticky && (
          <div style={{ height: '80px' }} />
        )}
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