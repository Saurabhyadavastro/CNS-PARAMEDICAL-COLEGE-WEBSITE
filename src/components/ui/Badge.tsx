import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'accent' | 'success' | 'warning' | 'neutral' | 'navy';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full tracking-wide';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  }[size];

  // Colors strictly follow semantic AA compliant pairs (no white text on light yellow)
  const variantStyles = {
    brand: 'bg-brand-faint text-brand-dark border border-brand/30',
    accent: 'bg-accent-soft text-accent-ink border border-accent-rust/40',
    rust: 'bg-accent-soft text-accent-rust border border-accent-rust/50',
    success: 'bg-status-success-soft text-status-success border border-status-success/30',
    warning: 'bg-status-warning-soft text-status-warning border border-status-warning/30',
    neutral: 'bg-surface-muted text-ink-muted border border-border-subtle',
    navy: 'bg-navy-surface text-ink-inverse border border-navy-border',
  }[variant];

  return (
    <span className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </span>
  );
};
