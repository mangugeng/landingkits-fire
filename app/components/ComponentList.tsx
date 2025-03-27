'use client';

import React from 'react';
import { ComponentData } from '../types/editor';

interface ComponentListProps {
  onAddComponent: (type: ComponentData['type']) => void;
}

const components = [
  { type: 'heading', label: 'Heading', icon: 'M5 5h14M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { type: 'paragraph', label: 'Paragraph', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { type: 'image', label: 'Image', icon: 'M4 16l4-4m0 0L20 4m-4 4l4-4M4 8v12a2 2 0 002 2h12a2 2 0 002-2V8M4 8l4-4h8l4 4M8 12a2 2 0 100-4 2 2 0 000 4z' },
  { type: 'button', label: 'Button', icon: 'M15 7v6a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z' },
  { type: 'form', label: 'Form', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { type: 'cta', label: 'CTA', icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' },
  { type: 'features', label: 'Features', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { type: 'testimonial', label: 'Testimonial', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { type: 'pricing', label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { type: 'spacer', label: 'Spacer', icon: 'M8 7h12m0 0L16 3m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
];

export default function ComponentList({ onAddComponent }: ComponentListProps) {
  return (
    <div className="flex flex-col space-y-2">
      {components.map((component) => (
        <button
          key={component.type}
          onClick={() => onAddComponent(component.type as ComponentData['type'])}
          className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors w-40 text-left"
          title={component.type.charAt(0).toUpperCase() + component.type.slice(1)}
        >
          <div className="w-5 h-5 flex items-center justify-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d={component.icon} />
            </svg>
          </div>
          <span className="text-sm text-gray-700">{component.label}</span>
        </button>
      ))}
    </div>
  );
} 