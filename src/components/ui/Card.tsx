import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface-light' | 'bordered' | 'interactive' | 'navy';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-lg transition-all duration-200';

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 md:p-6',
    lg: 'p-6 md:p-8',
  }[padding];

  const variantStyles = {
    default: 'bg-surface border border-border-subtle shadow-card',
    'surface-light': 'bg-surface-light border border-border-subtle shadow-sm',
    bordered: 'bg-surface border-2 border-border-subtle',
    interactive:
      'bg-surface border border-border-subtle shadow-card hover:shadow-card-hover hover:border-brand/50 cursor-pointer',
    navy: 'bg-navy-surface text-ink-inverse border border-navy-border shadow-card',
  }[variant];

  return (
    <div className={`${baseStyles} ${paddingStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => <div className={`mb-4 ${className}`} {...props}>{children}</div>;

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`text-lg md:text-xl font-bold text-ink leading-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => <div className={`text-ink-muted text-sm md:text-base leading-relaxed ${className}`} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => <div className={`mt-5 pt-4 border-t border-border-subtle flex items-center justify-between ${className}`} {...props}>{children}</div>;
