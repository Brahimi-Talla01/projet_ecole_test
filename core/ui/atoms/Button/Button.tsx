import React from 'react';

export interface ButtonProps {
      children: React.ReactNode;
      onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
      variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
      disabled?: boolean;
      type?: 'button' | 'submit' | 'reset';
      className?: string;
      loading?: boolean;
      fullWidth?: boolean;
}

export function Button({
      children,
      onClick,
      variant = 'primary',
      disabled = false,
      type = 'button',
      className = '',
      loading = false,
      fullWidth = false,
}: ButtonProps) {
  
      const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed";

      const variantStyles = {
            primary: "bg-primary-800 text-white hover:bg-primary-900 py-[14px] px-[24px]",
            secondary: "bg-secondary-500 text-white hover:bg-secondary-600 py-[14px] px-[24px]",
            danger: "bg-error-500 text-white hover:bg-error-600 py-[14px] px-[24px]",
            success: "bg-success-500 text-white hover:bg-success-600 py-[14px] px-[24px]",
            ghost: "bg-transparent border-2 border-gris-200 text-gris-700 hover:bg-gris-50 py-[12px] px-[22px]", 
      };

      const disabledStyles = "disabled:bg-[#DDDFE5] disabled:text-[#75839A]";

      // const widthStyles = fullWidth ? "w-full" : "w-[392px] max-w-full";
      const widthStyles = fullWidth ? "w-full" : "max-w-full";

      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (loading || disabled) return;
            onClick?.(e);
      };

      return (
            <button
                  type={type}
                  onClick={handleClick}
                  disabled={disabled || loading}
                  className={`
                        ${baseStyles} 
                        ${variantStyles[variant]} 
                        ${disabledStyles}
                        ${widthStyles}
                        ${className}
                        `.trim()
                  }
            >
                  {loading ? (
                        <div className="btn-loader " />
                  ) : (
                        <span className="flex items-center gap-2">
                              {children}
                        </span>
                  )}
            </button>
      );
}