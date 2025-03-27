'use client';

import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface DroppableContainerProps {
  children: ReactNode;
}

export function DroppableContainer({ children }: DroppableContainerProps) {
  const { setNodeRef } = useDroppable({
    id: 'droppable'
  });

  return (
    <div
      ref={setNodeRef}
      className="min-h-[200px] space-y-4 p-4 rounded-lg bg-white"
    >
      {children}
    </div>
  );
} 