'use client';

import React from 'react';
import { useToastStore } from './useToastStore';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto p-4 rounded-xl border border-[rgba(20,20,22,0.14)] bg-white text-[var(--ink)] shadow-lg flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          {t.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info className="w-4 h-4 text-[var(--soft)] shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-medium heading-tight">{t.title}</h5>
            {t.message && (
              <p className="text-[11px] text-[var(--soft)] mt-0.5 leading-relaxed">{t.message}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="text-[var(--soft)] hover:text-[var(--ink)] p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

