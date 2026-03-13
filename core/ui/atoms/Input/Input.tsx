'use client';

import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightElement?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightElement,
            fullWidth = true,
            className = '',
            id,
            disabled,
            ...props
        },
        ref,
    ) => {
        const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
        const hasError = !!error;


        const containerStyles = fullWidth ? 'w-full' : 'w-fit';

        const labelStyles = [
            'block text-sm font-semibold mb-1 transition-colors duration-150 text-start',
            hasError ? 'text-red-500' : 'text-gris-800',
        ].join(' ');

        const wrapperStyles = [
            'relative flex items-center justify-center rounded-[8px] border-[1.5px] bg-white transition-all duration-150',
            hasError
                ? 'border-red-500 focus-within:ring-red-200'
                : 'border-gris-200 focus-within:border-primary-600  focus-within:ring-primary-100',
            disabled ? 'bg-gris-50 opacity-60 cursor-not-allowed' : '',
        ].join(' ');

        const inputStyles = [
            'w-full bg-transparent py-[14px] text-sm text-gris-900',
            'placeholder:text-gris-400 placeholder:font-normal font-normal',
            'focus:outline-none disabled:cursor-not-allowed',
            leftIcon ? 'pl-3 pr-4' : 'px-4',
            rightElement ? 'pr-10' : '',
            className,
        ].join(' ');

        return (
            <div className={containerStyles}>

                {label && (
                    <label htmlFor={inputId} className={labelStyles}>
                        {label}
                    </label>
                )}

                <div className={wrapperStyles}>

                    {leftIcon && (
                        <div className="pl-4 text-gris-400 shrink-0">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        aria-invalid={hasError}
                        aria-describedby={
                        hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
                        }
                        className={inputStyles}
                        {...props}
                    />

                    {rightElement && (
                        <div className="pr-3 shrink-0 text-gris-400">
                            {rightElement}
                        </div>
                    )}
                </div>

                {hasError && (
                    <p
                        id={`${inputId}-error`}
                        role="alert"
                        className="mt-1.5 text-[14px] text-start font-medium text-red-500"
                    >
                        {error}
                    </p>
                )}

                {!hasError && hint && (
                    <p
                        id={`${inputId}-hint`}
                        className="mt-1.5 text-xs text-start font-light text-gris-500"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';