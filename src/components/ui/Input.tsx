import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled = false,
      required = false,
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const descriptionIds = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full text-left">
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          {label}
          {required && <span className="text-status-error ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only"> (required)</span>}
        </label>
        
        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-light">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={descriptionIds}
            className={`
              block w-full rounded-md border text-ink bg-surface text-base md:text-sm
              transition-colors duration-150
              py-2.5 px-3.5
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${
                error
                  ? 'border-status-error focus-visible:ring-status-error focus-visible:border-status-error text-status-error'
                  : 'border-border-subtle hover:border-brand/60 focus-ring'
              }
              ${disabled ? 'bg-surface-muted text-ink-light cursor-not-allowed border-border-subtle/80' : ''}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-ink-light">
              {rightIcon}
            </div>
          )}
        </div>

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

Input.displayName = 'Input';
