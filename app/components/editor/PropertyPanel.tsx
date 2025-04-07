'use client';

import { ComponentData } from '@/app/types/editor';
import { useState, useEffect, useRef } from 'react';

interface PropertyPanelProps {
  selectedComponent: ComponentData | null;
  onUpdate: (component: ComponentData) => void;
}

export default function PropertyPanel({ selectedComponent, onUpdate }: PropertyPanelProps) {
  const [text, setText] = useState('');
  const [level, setLevel] = useState<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>('h1');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [textColor, setTextColor] = useState('#000000');
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedComponent?.type === 'heading') {
      setText(selectedComponent.content || 'Judul');
      setLevel(selectedComponent.props?.level || 'h1');
      setAlignment(selectedComponent.props?.alignment || 'left');
      setTextColor(selectedComponent.props?.textColor || '#000000');
      
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
          const length = textInputRef.current.value.length;
          textInputRef.current.setSelectionRange(length, length);
        }
      }, 0);
    } else {
      setText(selectedComponent?.content || '');
    }
  }, [selectedComponent]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);

    if (selectedComponent) {
      onUpdate({
        ...selectedComponent,
        content: newText
      });
    }
  };

  useEffect(() => {
    if (textInputRef.current) {
      const length = textInputRef.current.value.length;
      textInputRef.current.focus();
      textInputRef.current.setSelectionRange(length, length);
    }
  }, [text]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = e.target.value as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    setLevel(newLevel);

    if (selectedComponent?.type === 'heading') {
      onUpdate({
        ...selectedComponent,
        props: {
          ...selectedComponent.props,
          level: newLevel
        }
      });
    }
  };

  const handleAlignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAlignment = e.target.value as 'left' | 'center' | 'right';
    setAlignment(newAlignment);

    if (selectedComponent?.type === 'heading') {
      onUpdate({
        ...selectedComponent,
        props: {
          ...selectedComponent.props,
          alignment: newAlignment
        }
      });
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setTextColor(newColor);

    if (selectedComponent?.type === 'heading') {
      onUpdate({
        ...selectedComponent,
        props: {
          ...selectedComponent.props,
          textColor: newColor
        }
      });
    }
  };

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <p className="text-gray-500">Pilih komponen untuk mengedit propertinya</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Properti</h2>
      
      {selectedComponent?.type === 'heading' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teks
            </label>
            <input
              ref={textInputRef}
              type="text"
              value={text}
              onChange={handleTextChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level Heading
            </label>
            <select
              value={level}
              onChange={handleLevelChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="h5">Heading 5</option>
              <option value="h6">Heading 6</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Perataan Teks
            </label>
            <select
              value={alignment}
              onChange={handleAlignmentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Kiri</option>
              <option value="center">Tengah</option>
              <option value="right">Kanan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warna Teks
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={textColor}
                onChange={handleTextColorChange}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={handleTextColorChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text
          </label>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
} 