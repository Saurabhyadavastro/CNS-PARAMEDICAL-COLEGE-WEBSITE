import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-surface-muted/90 rounded';

  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'h-64 w-full rounded-xl border border-border-subtle',
  }[variant];

  return (
    <div
      role="status"
      aria-label="Loading content"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
