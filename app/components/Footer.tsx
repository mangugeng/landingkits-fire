'use client';

import { usePathname } from 'next/navigation';
import { ComponentData } from '../types/editor';

interface FooterProps {
  component?: ComponentData;
}

export default function Footer({ component }: FooterProps) {
  const pathname = usePathname();
  
  const getBackgroundStyle = () => {
    if (!component?.props?.backgroundType || component.props.backgroundType === 'none') {
      return { backgroundColor: '#ffffff' }; // Default background color
    }

    const styles: React.CSSProperties = {};

    switch (component.props.backgroundType) {
      case 'color':
        styles.backgroundColor = component.props.backgroundColor || '#ffffff';
        break;
      case 'image':
        if (component.props.backgroundImage) {
          styles.backgroundImage = `url(${component.props.backgroundImage})`;
          styles.backgroundSize = 'cover';
          styles.backgroundPosition = 'center';
          styles.backgroundRepeat = 'no-repeat';
        }
        break;
      case 'gradient':
        styles.background = `linear-gradient(${component.props.gradientDirection || 'to right'}, ${component.props.gradientStartColor || '#ffffff'}, ${component.props.gradientEndColor || '#f3f4f6'})`;
        break;
    }

    return styles;
  };

  return (
    <footer 
      className="border-t border-gray-200"
      style={getBackgroundStyle()}
    >
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-center text-gray-500">
          © {new Date().getFullYear()} LandingKits. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 