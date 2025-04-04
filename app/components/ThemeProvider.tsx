import React from 'react';
import { ThemeConfig, ThemeType } from '../types/editor';
import { themeConfigs } from '../lib/themes';

interface ThemeProviderProps {
  theme: ThemeType;
  children: React.ReactNode;
}

export default function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const config = themeConfigs[theme];

  const themeStyles = {
    '--color-primary': config.colors.primary,
    '--color-secondary': config.colors.secondary,
    '--color-accent': config.colors.accent,
    '--color-background': config.colors.background,
    '--color-text': config.colors.text,
    '--font-heading': config.typography.headingFont,
    '--font-body': config.typography.bodyFont,
    '--spacing-section': config.spacing.section,
    '--spacing-component': config.spacing.component,
    '--border-radius': config.borderRadius,
    '--shadow-small': config.shadows.small,
    '--shadow-medium': config.shadows.medium,
    '--shadow-large': config.shadows.large,
  } as React.CSSProperties;

  return (
    <div style={themeStyles} className="theme-provider">
      <style jsx global>{`
        :root {
          --color-primary: ${config.colors.primary};
          --color-secondary: ${config.colors.secondary};
          --color-accent: ${config.colors.accent};
          --color-background: ${config.colors.background};
          --color-text: ${config.colors.text};
          --font-heading: ${config.typography.headingFont};
          --font-body: ${config.typography.bodyFont};
          --spacing-section: ${config.spacing.section};
          --spacing-component: ${config.spacing.component};
          --border-radius: ${config.borderRadius};
          --shadow-small: ${config.shadows.small};
          --shadow-medium: ${config.shadows.medium};
          --shadow-large: ${config.shadows.large};
        }

        .theme-provider {
          font-family: var(--font-body);
          color: var(--color-text);
          background-color: var(--color-background);
        }

        .theme-provider h1,
        .theme-provider h2,
        .theme-provider h3,
        .theme-provider h4,
        .theme-provider h5,
        .theme-provider h6 {
          font-family: var(--font-heading);
          color: var(--color-text);
        }

        .theme-provider .btn-primary {
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-small);
        }

        .theme-provider .btn-secondary {
          background-color: var(--color-secondary);
          color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-small);
        }

        .theme-provider .btn-accent {
          background-color: var(--color-accent);
          color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-small);
        }

        .theme-provider .card {
          background-color: var(--color-background);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-medium);
          padding: var(--spacing-component);
        }

        .theme-provider .section {
          padding: var(--spacing-section) 0;
        }

        /* Tambahan untuk komponen-komponen landing page */
        .theme-provider .heading {
          font-family: var(--font-heading);
          color: var(--color-text);
        }

        .theme-provider .paragraph {
          font-family: var(--font-body);
          color: var(--color-text);
        }

        .theme-provider .button {
          font-family: var(--font-body);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-small);
        }

        .theme-provider .button-primary {
          background-color: var(--color-primary);
          color: white;
        }

        .theme-provider .button-secondary {
          background-color: var(--color-secondary);
          color: white;
        }

        .theme-provider .button-accent {
          background-color: var(--color-accent);
          color: white;
        }

        .theme-provider .image {
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-small);
        }

        .theme-provider .form {
          background-color: var(--color-background);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-medium);
          padding: var(--spacing-component);
        }

        .theme-provider .form input,
        .theme-provider .form textarea {
          border-radius: var(--border-radius);
          border: 1px solid var(--color-text);
          padding: 0.5rem;
          font-family: var(--font-body);
        }

        .theme-provider .form button {
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-small);
          padding: 0.5rem 1rem;
          font-family: var(--font-body);
        }

        .theme-provider .cta {
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-medium);
          padding: var(--spacing-component);
        }

        .theme-provider .features {
          background-color: var(--color-background);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-medium);
          padding: var(--spacing-component);
        }

        .theme-provider .testimonial {
          background-color: var(--color-background);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-medium);
          padding: var(--spacing-component);
        }

        .theme-provider .pricing {
          background-color: var(--color-background);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-medium);
          padding: var(--spacing-component);
        }

        .theme-provider .pricing-popular {
          border: 2px solid var(--color-primary);
          box-shadow: var(--shadow-large);
        }

        .theme-provider .pricing-button {
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-small);
          padding: 0.5rem 1rem;
          font-family: var(--font-body);
        }
      `}</style>
      {children}
    </div>
  );
} 