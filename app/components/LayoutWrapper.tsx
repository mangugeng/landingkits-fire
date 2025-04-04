'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import FooterWrapper from './FooterWrapper';
import { Toaster } from 'react-hot-toast';
import { LayoutSettings } from '@/app/types/editor';

interface LayoutWrapperProps {
  children: React.ReactNode;
  layout?: LayoutSettings;
}

export default function LayoutWrapper({ children, layout }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isDashboardPage = pathname === '/dashboard';

  // Default layout settings
  const defaultLayout: LayoutSettings = {
    type: 'container',
    width: 'medium',
    spacing: 'comfortable',
    sidebarPosition: 'left',
    showSidebar: true,
    showHeader: false,
    showFooter: true,
    backgroundType: 'none',
    backgroundColor: '#ffffff',
    backgroundImage: '',
    patternType: 'dots',
    patternColor: '#000000',
    patternOpacity: 0.1,
  };

  // Merge default layout with provided layout
  const currentLayout = layout || defaultLayout;

  // Generate background style based on layout settings
  const getBackgroundStyle = () => {
    switch (currentLayout.backgroundType) {
      case 'color':
        return { backgroundColor: currentLayout.backgroundColor };
      case 'image':
        return { 
          backgroundImage: `url(${currentLayout.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      case 'pattern':
        return {
          backgroundColor: currentLayout.backgroundColor,
          backgroundImage: getPatternStyle(currentLayout.patternType),
          backgroundSize: '20px 20px',
          opacity: currentLayout.patternOpacity,
        };
      case 'gradient':
        return {
          background: `linear-gradient(${currentLayout.gradientDirection || 'to right'}, ${currentLayout.gradientStartColor || '#ffffff'}, ${currentLayout.gradientEndColor || '#f3f4f6'})`,
        };
      default:
        return {};
    }
  };

  // Get pattern style based on pattern type
  const getPatternStyle = (patternType: string) => {
    switch (patternType) {
      case 'dots':
        return `radial-gradient(${currentLayout.patternColor} 1px, transparent 1px)`;
      case 'lines':
        return `linear-gradient(90deg, ${currentLayout.patternColor} 1px, transparent 1px)`;
      case 'grid':
        return `linear-gradient(90deg, ${currentLayout.patternColor} 1px, transparent 1px),
                linear-gradient(${currentLayout.patternColor} 1px, transparent 1px)`;
      case 'waves':
        return `repeating-linear-gradient(45deg, ${currentLayout.patternColor} 0, ${currentLayout.patternColor} 1px, transparent 1px, transparent 10px)`;
      case 'zigzag':
        return `linear-gradient(135deg, ${currentLayout.patternColor} 25%, transparent 25%) -10px 0,
                linear-gradient(225deg, ${currentLayout.patternColor} 25%, transparent 25%) -10px 0,
                linear-gradient(315deg, ${currentLayout.patternColor} 25%, transparent 25%),
                linear-gradient(45deg, ${currentLayout.patternColor} 25%, transparent 25%)`;
      default:
        return '';
    }
  };

  // Get container width based on layout settings
  const getContainerWidth = () => {
    switch (currentLayout.width) {
      case 'narrow':
        return 'max-w-3xl';
      case 'medium':
        return 'max-w-5xl';
      case 'wide':
        return 'max-w-7xl';
      default:
        return 'max-w-5xl';
    }
  };

  // Get spacing based on layout settings
  const getSpacing = () => {
    switch (currentLayout.spacing) {
      case 'compact':
        return 'space-y-4';
      case 'comfortable':
        return 'space-y-8';
      case 'spacious':
        return 'space-y-12';
      default:
        return 'space-y-8';
    }
  };

  // Render content based on layout type
  const renderContent = () => {
    if (currentLayout.type === 'full') {
      return (
        <div className="w-full" style={getBackgroundStyle()}>
          {currentLayout.showHeader && (
            <header className="w-full">
              <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
                {/* Header content */}
              </div>
            </header>
          )}

          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex">
              {currentLayout.showSidebar && currentLayout.sidebarPosition === 'left' && (
                <aside className="w-64 mr-8">
                  {/* Sidebar content */}
                </aside>
              )}

              <main className="flex-1">
                {children}
              </main>

              {currentLayout.showSidebar && currentLayout.sidebarPosition === 'right' && (
                <aside className="w-64 ml-8">
                  {/* Sidebar content */}
                </aside>
              )}
            </div>
          </div>

          {currentLayout.showFooter && (
            <footer className="w-full">
              <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Footer content */}
              </div>
            </footer>
          )}
        </div>
      );
    } else if (currentLayout.type === 'boxed') {
      return (
        <div className="w-full" style={getBackgroundStyle()}>
          {currentLayout.showHeader && (
            <header>
              <div className={`${getContainerWidth()} mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
                {/* Header content */}
              </div>
            </header>
          )}

          <div className={`${getContainerWidth()} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
            <div className="flex">
              {currentLayout.showSidebar && currentLayout.sidebarPosition === 'left' && (
                <aside className="w-64 mr-8">
                  {/* Sidebar content */}
                </aside>
              )}

              <main className="flex-1">
                {children}
              </main>

              {currentLayout.showSidebar && currentLayout.sidebarPosition === 'right' && (
                <aside className="w-64 ml-8">
                  {/* Sidebar content */}
                </aside>
              )}
            </div>
          </div>

          {currentLayout.showFooter && (
            <footer>
              <div className={`${getContainerWidth()} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
                {/* Footer content */}
              </div>
            </footer>
          )}
        </div>
      );
    } else {
      // Default container layout
      return (
        <div className="w-full" style={getBackgroundStyle()}>
          {currentLayout.showHeader && (
            <header>
              <div className={`${getContainerWidth()} mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
                {/* Header content */}
              </div>
            </header>
          )}

          <div className={`${getContainerWidth()} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
            <div className="flex">
              {currentLayout.showSidebar && currentLayout.sidebarPosition === 'left' && (
                <aside className="w-64 mr-8">
                  {/* Sidebar content */}
                </aside>
              )}

              <main className="flex-1">
                {children}
              </main>

              {currentLayout.showSidebar && currentLayout.sidebarPosition === 'right' && (
                <aside className="w-64 ml-8">
                  {/* Sidebar content */}
                </aside>
              )}
            </div>
          </div>

          {currentLayout.showFooter && (
            <footer>
              <div className={`${getContainerWidth()} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
                {/* Footer content */}
              </div>
            </footer>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
      <Toaster />
    </div>
  );
} 