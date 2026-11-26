import React, { useId } from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      name,
      label,
      options,
      error,
      helperText,
      placeholder = 'Select an option',
      disabled = false,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || name || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const descriptionIds = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full text-left">
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-ink mb-1.5"
        >
          {label}
          {required && <span className="text-status-error ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only"> (required)</span>}
        </label>

        <div className="relative rounded-md shadow-sm">
          <select
            ref={ref}
            id={selectId}
            name={name}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={descriptionIds}
            className={`
              block w-full rounded-md border text-ink bg-surface text-base md:text-sm
              transition-colors duration-150 py-2.5 px-3.5 pr-10 appearance-none
              ${
                error
                  ? 'border-status-error focus-visible:ring-status-error'
                  : 'border-border-subtle hover:border-brand/60 focus-ring'
              }
              ${disabled ? 'bg-surface-muted text-ink-light cursor-not-allowed border-border-subtle/80' : ''}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-ink-light">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

Select.displayName = 'Select';
