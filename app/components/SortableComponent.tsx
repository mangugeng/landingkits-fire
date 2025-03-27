'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentData } from '../types/editor';
import { componentMap } from './EditorComponents';

interface SortableComponentProps {
  component: ComponentData;
  onSelect: (component: ComponentData) => void;
  onDelete: (id: string) => void;
}

export function SortableComponent({ component, onSelect, onDelete }: SortableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(component.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {React.createElement(componentMap[component.type], {
        content: component.content,
        props: component.props,
      })}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
} 