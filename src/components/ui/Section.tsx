import React from 'react';
import { Badge } from './Badge';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  badge?: string;
  badgeVariant?: 'brand' | 'accent' | 'success' | 'warning' | 'neutral' | 'navy';
  title?: string;
  subtitle?: string;
  bgVariant?: 'surface' | 'surface-light' | 'navy' | 'muted';
  containerSize?: 'default' | 'narrow' | 'wide' | 'full';
}

export const Section: React.FC<SectionProps> = ({
  id,
  badge,
  badgeVariant = 'brand',
  title,
  subtitle,
  bgVariant = 'surface',
  containerSize = 'default',
  children,
  className = '',
  ...props
}) => {
  const bgStyles = {
    surface: 'bg-surface text-ink',
    'surface-light': 'bg-surface-light text-ink border-y border-border-subtle/50',
    muted: 'bg-surface-muted text-ink border-y border-border-subtle',
    navy: 'bg-navy-dark text-ink-inverse',
  }[bgVariant];

  const containerWidths = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'w-full',
  }[containerSize];

  const titleId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={title ? titleId : undefined}
      className={`py-12 md:py-20 px-4 sm:px-6 lg:px-8 ${bgStyles} ${className}`}
      {...props}
    >
      <div className={`mx-auto ${containerWidths}`}>
        {(badge || title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            {badge && (
              <div className="mb-3">
                <Badge variant={badgeVariant}>{badge}</Badge>
              </div>
            )}
            {title && (
              <h2
                id={titleId}
                className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
                  bgVariant === 'navy' ? 'text-white' : 'text-ink'
                }`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={`mt-3 text-base md:text-lg leading-relaxed ${
                  bgVariant === 'navy' ? 'text-slate-300' : 'text-ink-muted'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
