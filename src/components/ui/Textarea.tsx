import React, { useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      name,
      label,
      error,
      helperText,
      disabled = false,
      required = false,
      rows = 4,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || name || generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const descriptionIds = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full text-left">
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          {label}
          {required && <span className="text-status-error ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only"> (required)</span>}
        </label>

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={descriptionIds}
          className={`
            block w-full rounded-md border text-ink bg-surface text-base md:text-sm
            transition-colors duration-150 py-2.5 px-3.5
            ${
              error
                ? 'border-status-error focus-visible:ring-status-error focus-visible:border-status-error'
                : 'border-border-subtle hover:border-brand/60 focus-ring'
            }
            ${disabled ? 'bg-surface-muted text-ink-light cursor-not-allowed border-border-subtle/80' : ''}
            ${className}
          `}
          {...props}
        />

        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-status-error flex items-center gap-1 font-medium" role="alert">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="mt-1.5 text-xs text-ink-light">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
