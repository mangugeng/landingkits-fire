'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentData } from './EditorComponents';

interface ComponentListProps {
  onAddComponent: (type: ComponentData['type']) => void;
  isMobile?: boolean;
}

const ComponentItem = ({ component, onAddComponent }: { component: { type: string; label: string; icon: string }, onAddComponent: (type: ComponentData['type']) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `sidebar-${component.type}`,
    disabled: false
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onAddComponent(component.type as ComponentData['type'])}
      className={`flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={component.icon}
        />
      </svg>
      <span className="text-sm font-medium text-gray-700">{component.label}</span>
    </div>
  );
};

export function ComponentList({ onAddComponent, isMobile = false }: ComponentListProps) {
  const components = [
    { 
      type: 'heading', 
      label: 'Heading', 
      icon: 'M5 5h14M5 12h14M5 19h14' 
    },
    { 
      type: 'paragraph', 
      label: 'Paragraph', 
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' 
    },
    { 
      type: 'image', 
      label: 'Image', 
      icon: 'M4 16l4-4m0 0L20 4m-4 4l4-4M4 8v12a2 2 0 002 2h12a2 2 0 002-2V8M4 8l4-4h8l4 4M8 12a2 2 0 100-4 2 2 0 000 4z' 
    },
    { 
      type: 'button', 
      label: 'Button', 
      icon: 'M15 7v6a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z' 
    },
    { 
      type: 'form', 
      label: 'Form', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' 
    },
    { 
      type: 'cta', 
      label: 'CTA', 
      icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' 
    },
    { 
      type: 'features', 
      label: 'Features', 
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' 
    },
    { 
      type: 'testimonial', 
      label: 'Testimonial', 
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' 
    },
    { 
      type: 'pricing', 
      label: 'Pricing', 
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      type: 'spacer', 
      label: 'Spacer', 
      icon: 'M8 7h12m0 0L16 3m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' 
    }
  ];

  return (
    <div className={isMobile ? 'flex space-x-4' : 'p-4 space-y-2'}>
      {components.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => onAddComponent(type)}
          className={`
            ${isMobile 
              ? 'flex-shrink-0 flex flex-col items-center p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 w-20'
              : 'flex items-center w-full p-2 text-left hover:bg-gray-50 rounded-lg group'
            }
          `}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`
              ${isMobile ? 'h-8 w-8 mb-1' : 'h-5 w-5 mr-3'} 
              text-gray-400 group-hover:text-blue-500
            `} 
            fill="none"
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
          <span className={`
            ${isMobile ? 'text-xs' : 'text-sm'} 
            text-gray-600 group-hover:text-blue-500
          `}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
} 