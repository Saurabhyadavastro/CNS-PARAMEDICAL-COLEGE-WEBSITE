import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const isFirstOpenRef = useRef(true);

  const titleId = useId();
  const descId = useId();

  // Close on Escape key and manage body overflow & initial focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCloseRef.current();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Only focus the close button ONCE on initial open, NEVER on re-render / typing!
      if (isFirstOpenRef.current) {
        isFirstOpenRef.current = false;
        setTimeout(() => {
          closeButtonRef.current?.focus();
        }, 50);
      }
    } else {
      document.body.style.overflow = '';
      isFirstOpenRef.current = true;
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-dark/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          ref={modalRef}
          className={`relative transform overflow-hidden rounded-lg bg-surface text-left shadow-2xl transition-all sm:my-8 w-full ${sizeStyles} border border-border-subtle`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-surface px-6 pt-5 pb-4 sm:p-6 border-b border-border-subtle flex items-start justify-between">
            <div>
              <h3 id={titleId} className="text-xl font-bold text-ink leading-tight">
                {title}
              </h3>
              {description && (
                <p id={descId} className="mt-1 text-sm text-ink-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-md p-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted focus-ring transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 sm:p-6 text-ink">{children}</div>
        </div>
      </div>
    </div>
  );
};
