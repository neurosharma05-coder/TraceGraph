'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export default function DetailDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-md',
}: DetailDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap and Escape key listener (P7.4)
  useEffect(() => {
    if (!isOpen) return;

    // Trap focus inside drawer
    const drawerEl = drawerRef.current;
    if (drawerEl) {
      const focusableElements = drawerEl.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      const handleTrapTab = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab') {
          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener('keydown', handleTrapTab);
      return () => window.removeEventListener('keydown', handleTrapTab);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        className={`relative z-10 w-full ${width} bg-[#F7F4EE] border-l border-[rgba(20,20,22,0.14)] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200`}
      >
        <div className="p-5 border-b border-[rgba(20,20,22,0.08)] flex items-start justify-between gap-4 bg-white/40">
          <div>
            <h3 className="text-lg font-normal text-[var(--ink)] heading-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[var(--soft)] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--soft)] hover:text-[var(--ink)] hover:bg-black/5"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
}

