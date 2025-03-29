'use client';

import React from 'react';
import { ComponentType } from '@/app/types/editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ComponentListProps {
  onAddComponent: (type: ComponentType) => void;
}

export function ComponentList({ onAddComponent }: ComponentListProps) {
  const components: Array<{
    type: ComponentType;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      type: 'heading',
      label: 'Heading',
      icon: <span className="text-xl">H</span>,
    },
    {
      type: 'paragraph',
      label: 'Paragraph',
      icon: <span className="text-xl">¶</span>,
    },
    {
      type: 'image',
      label: 'Image',
      icon: <span className="text-xl">🖼️</span>,
    },
    {
      type: 'button',
      label: 'Button',
      icon: <span className="text-xl">🔘</span>,
    },
    {
      type: 'form',
      label: 'Form',
      icon: <span className="text-xl">📝</span>,
    },
    {
      type: 'pricing',
      label: 'Pricing',
      icon: <span className="text-xl">💰</span>,
    },
    {
      type: 'testimonial',
      label: 'Testimonial',
      icon: <span className="text-xl">💬</span>,
    },
    {
      type: 'features',
      label: 'Features',
      icon: <span className="text-xl">✨</span>,
    },
    {
      type: 'hero',
      label: 'Hero',
      icon: <span className="text-xl">🦸</span>,
    },
    {
      type: 'cta',
      label: 'Call to Action',
      icon: <span className="text-xl">📢</span>,
    },
    {
      type: 'spacer',
      label: 'Spacer',
      icon: <span className="text-xl">↕️</span>,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {components.map(({ type, label, icon }) => (
        <Card
          key={type}
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onAddComponent(type)}
        >
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">{icon}</div>
            <div className="text-sm font-medium">{label}</div>
          </div>
        </Card>
      ))}
    </div>
  );
} 