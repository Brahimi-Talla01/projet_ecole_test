"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
      trigger: ReactNode;
      children: ReactNode;
      align?: "left" | "right";
}

export function Dropdown({ trigger, children, align = "right" }: DropdownProps) {
      const [isOpen, setIsOpen] = useState(false);
      const dropdownRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                        setIsOpen(false);
                  }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      return (
            <div 
                  className="relative inline-block text-left" 
                  ref={dropdownRef}
            >
                  <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                        <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                              {trigger}
                              <ChevronDown 
                                    size={14} 
                                    className={`transition-transform mr-2 ${isOpen ? "rotate-180" : ""}`} 
                              />
                        </div>
                  </div>

                  {isOpen && (
                        <div className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-1 w-40 rounded-lg bg-white border border-gray-100 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>
                              <div 
                                    className="" 
                                    onClick={() => setIsOpen(false)}
                              >
                                    {children}
                              </div>
                        </div>
                  )}
            </div>
      );
}