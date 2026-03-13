'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Dropdown } from '@/core/ui/molecules/Dropdown';

export interface SelectFieldOption {
      value: string;
      label: string;
      disabled?: boolean;
}

export interface SelectFieldProps {
      label?: string;
      options: SelectFieldOption[];
      value?: string;
      defaultValue?: string;
      onChange?: (value: string) => void;
      placeholder?: string;
      error?: string;
      hint?: string;
      disabled?: boolean;
      fullWidth?: boolean;
      align?: 'left' | 'right';
      name?: string;
      id?: string;
      className?: string;
}

export interface SelectFieldHandle {
      focus: () => void;
}

export const SelectField = forwardRef<SelectFieldHandle, SelectFieldProps>(
  (
      {
            label,
            options,
            value,
            defaultValue,
            onChange,
            placeholder = 'Select',
            error,
            hint,
            disabled = false,
            fullWidth = true,
            align = 'left',
            name,
            id,
            className = '',
      },
      ref,
  ) => {
      const triggerRef = useRef<HTMLDivElement>(null);
      const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
      const hasError = !!error;

      const [internalValue, setInternalValue] = useState(defaultValue ?? '');
      const selectedValue = value !== undefined ? value : internalValue;
      const selectedOption = options.find((o) => o.value === selectedValue);

      useImperativeHandle(ref, () => ({
            focus: () => triggerRef.current?.focus(),
      }));

      const handleSelect = (optionValue: string) => {
            if (value === undefined) setInternalValue(optionValue);
            onChange?.(optionValue);
      };


      const trigger = (
            <div
                  ref={triggerRef}
                  id={fieldId}
                  aria-invalid={hasError}
                  className={[
                        'flex items-center justify-between gap-2',
                        'rounded-lg border-[1.5px] bg-white',
                        'pl-4 pr-3 py-3.5',
                        'transition-all duration-150',
                        hasError
                              ? 'border-red-500'
                              : 'border-gris-200',
                        disabled
                              ? 'bg-gris-50 opacity-60 cursor-not-allowed pointer-events-none'
                              : 'cursor-pointer hover:border-gris-300',
                        fullWidth ? 'w-full' : 'w-fit',
                        className,
                  ].join(' ')}
            >
                  <span className={[
                              'text-sm truncate',
                              selectedOption ? 'text-gris-900 font-normal' : 'text-gris-400',
                        ].join(' ')}>
                        {selectedOption ? selectedOption.label : placeholder}
                  </span>

                  <ChevronDown 
                        size={14} 
                  />
            </div>
      );

    return (
      <div className={fullWidth ? 'w-full' : 'w-fit'}>

        {label && (
          <label
            htmlFor={fieldId}
            className={[
              'block text-sm font-semibold mb-1 text-start transition-colors duration-150',
              hasError ? 'text-red-500' : 'text-gris-800',
            ].join(' ')}
          >
            {label}
          </label>
        )}

        <Dropdown trigger={trigger} align={align} fullWidth={fullWidth}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => !option.disabled && handleSelect(option.value)}
              className={[
                'flex items-center px-4 py-2.5 text-sm transition-all',
                option.value === selectedValue
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gris-700 hover:bg-gris-50 hover:text-gris-900',
                option.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : 'cursor-pointer',
              ].join(' ')}
            >
              {option.label}
            </div>
          ))}
        </Dropdown>

        <input type="hidden" name={name} value={selectedValue} />

        {hasError && (
          <p
            id={`${fieldId}-error`}
            role="alert"
            className="mt-1.5 text-xs text-start font-medium text-red-500"
          >
            {error}
          </p>
        )}

        {!hasError && hint && (
          <p
            id={`${fieldId}-hint`}
            className="mt-1.5 text-xs text-start text-gris-500"
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';