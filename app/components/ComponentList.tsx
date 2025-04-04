'use client';

import React from 'react';
import { ComponentType, ComponentData } from '@/app/types/editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

interface ComponentListProps {
  onAddComponent: (component: ComponentType | ComponentData) => void;
}

export function ComponentList({ onAddComponent }: ComponentListProps) {
  const handleAddComponent = (type: ComponentType) => {
    // Tambahkan nilai default untuk header dan footer
    if (type === 'header') {
      const defaultHeader: ComponentData = {
        id: uuidv4(),
        type: 'header',
        content: '',
        props: {
          logo: {
            src: 'https://placehold.co/200x50',
            alt: 'Logo',
            width: 200,
            height: 50
          },
          navigation: [
            { label: 'Beranda', href: '/' },
            { label: 'Tentang', href: '/about' },
            { label: 'Layanan', href: '/services' },
            { label: 'Kontak', href: '/contact' }
          ],
          ctaButton: {
            text: 'Hubungi Kami',
            href: '/contact',
            variant: 'primary'
          },
          isSticky: true
        }
      };
      onAddComponent(defaultHeader);
    } else if (type === 'footer') {
      const defaultFooter: ComponentData = {
        id: uuidv4(),
        type: 'footer',
        content: '',
        props: {
          footerLinks: [
            {
              title: 'Perusahaan',
              links: [
                { label: 'Tentang Kami', href: '/about' },
                { label: 'Karir', href: '/careers' },
                { label: 'Blog', href: '/blog' }
              ]
            },
            {
              title: 'Layanan',
              links: [
                { label: 'Produk', href: '/products' },
                { label: 'Solusi', href: '/solutions' },
                { label: 'Pricing', href: '/pricing' }
              ]
            },
            {
              title: 'Dukungan',
              links: [
                { label: 'FAQ', href: '/faq' },
                { label: 'Kontak', href: '/contact' },
                { label: 'Bantuan', href: '/help' }
              ]
            }
          ],
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' }
          ],
          copyright: '© 2024 Nama Perusahaan. All rights reserved.'
        }
      };
      onAddComponent(defaultFooter);
    } else if (type === 'anchor') {
      const defaultAnchor: ComponentData = {
        id: uuidv4(),
        type: 'anchor',
        content: '',
        props: {
          anchorId: 'section-1'
        }
      };
      onAddComponent(defaultAnchor);
    } else {
      onAddComponent(type);
    }
  };

  const components: Array<{
    type: ComponentType;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      type: 'header',
      label: 'Header',
      icon: <span className="text-xl">🏷️</span>,
    },
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
    {
      type: 'footer',
      label: 'Footer',
      icon: <span className="text-xl">👣</span>,
    },
    {
      type: 'anchor',
      label: 'Anchor',
      icon: <span className="text-xl">🔗</span>,
    },
  ];

  return (
    <div className="flex flex-col space-y-2">
      {components.map(({ type, label, icon }) => (
        <Card
          key={type}
          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleAddComponent(type)}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">{icon}</div>
            <div className="text-sm font-medium">{label}</div>
          </div>
        </Card>
      ))}
    </div>
  );
} 