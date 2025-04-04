'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentData } from '@/app/types/editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ComponentRendererProps {
  type: ComponentData['type'];
  content: string;
  props?: ComponentData['props'];
}

const componentRenderers: Record<ComponentData['type'], React.FC<ComponentRendererProps>> = {
  heading: ({ content, props }) => (
    <h2 className="heading text-2xl font-bold">{content}</h2>
  ),
  paragraph: ({ content }) => (
    <p className="paragraph">{content}</p>
  ),
  image: ({ content, props }) => (
    <img src={content} alt={props?.alt || ''} className="image w-full h-auto" />
  ),
  button: ({ content, props }) => (
    <button className={`button ${
      props?.style === 'primary' ? 'button-primary' :
      props?.style === 'secondary' ? 'button-secondary' :
      'button-accent'
    }`}>
      {content}
    </button>
  ),
  form: ({ content }) => (
    <div className="form p-4">{content}</div>
  ),
  pricing: ({ content }) => (
    <div className="pricing p-4">{content}</div>
  ),
  testimonial: ({ content }) => (
    <div className="testimonial p-4">{content}</div>
  ),
  features: ({ content }) => (
    <div className="features p-4">{content}</div>
  ),
  hero: ({ content }) => (
    <div className="hero p-4">{content}</div>
  ),
  cta: ({ content }) => (
    <div className="cta p-4">{content}</div>
  ),
  spacer: ({ content, props }) => (
    <div style={{ height: props?.height || 20 }} />
  ),
};

interface SortableComponentProps {
  component: ComponentData;
  onSelect: (component: ComponentData) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function SortableComponent({ component, onSelect, onDelete, index }: SortableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id || `component-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    if (component.id) {
      onDelete(component.id);
    }
  };

  const ComponentRenderer = componentRenderers[component.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'relative group cursor-move',
        isDragging && 'opacity-50'
      )}
    >
      <Card className="p-4 mb-2 relative group-hover:shadow-md transition-shadow">
        <ComponentRenderer
          type={component.type}
          content={component.content}
          props={component.props}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={() => onSelect(component)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
} 