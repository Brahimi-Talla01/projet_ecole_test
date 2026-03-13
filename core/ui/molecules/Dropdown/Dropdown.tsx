'use client';

import { useState, ReactNode, useRef, useEffect } from 'react';

interface DropdownProps {
      trigger: ReactNode;
      children: ReactNode;
      align?: 'left' | 'right';
      fullWidth?: boolean;
}

export function Dropdown({
      trigger,
      children,
      align = 'right',
      fullWidth = false,
}: DropdownProps) {
      const [isOpen, setIsOpen] = useState(false);
      const dropdownRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                        setIsOpen(false);
                  }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                  if (e.key === 'Escape') setIsOpen(false);
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
      }, []);

      return (
            <div
                  className={[
                        'relative cursor-pointer',
                        fullWidth ? 'w-full' : 'inline-block',
                        'text-left',
                  ].join(' ')}
                  ref={dropdownRef}
            >
                  <div 
                        onClick={() => setIsOpen((prev) => !prev)}
                  >
                        {trigger}
                  </div>

                  {isOpen && (
                        <div
                              className={[
                                    'absolute z-50 mt-1',
                                    'rounded-lg bg-white',
                                    'border border-gris-100 shadow-lg',
                                    'overflow-hidden',
                                    'animate-in fade-in slide-in-from-top-2 duration-150',
                                    align === 'right' ? 'right-0' : 'left-0',
                                    fullWidth ? 'w-full' : 'min-w-40',
                              ].join(' ')}
                        >
                              <div onClick={() => setIsOpen(false)}>
                                    {children}
                              </div>
                        </div>
                  )}
            </div>
      );
}



