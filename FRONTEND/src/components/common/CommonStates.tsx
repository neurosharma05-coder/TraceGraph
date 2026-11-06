'use client';

import React from 'react';

export function LoadingSkeleton({ rows = 3, height = 'h-16' }: { rows?: number; height?: string }) {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`w-full ${height} rounded-xl border border-[rgba(20,20,22,0.06)] bg-black/[0.04]`}
        />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="card-panel p-8 sm:p-12 text-center space-y-3 my-6">
      <div className="w-10 h-10 rounded-full border border-[rgba(20,20,22,0.12)] bg-white mx-auto grid place-items-center text-xs text-[var(--soft)] font-medium">
        00
      </div>
      <h3 className="text-lg font-normal text-[var(--ink)] heading-tight">{title}</h3>
      <p className="text-xs text-[var(--soft)] max-w-md mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <button type="button" onClick={onAction} className="btn">
            <b>›</b>
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Failed to load forensic data',
  message = 'An unexpected verification error occurred while parsing the evidentiary ledger.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card-panel p-8 text-center space-y-3 border-red-900/10 bg-red-500/[0.02] my-6">
      <div className="w-8 h-8 rounded-full border border-red-300 bg-white mx-auto grid place-items-center text-xs text-red-700 font-medium">
        !
      </div>
      <h3 className="text-base font-normal text-[var(--ink)] heading-tight">{title}</h3>
      <p className="text-xs text-[var(--soft)] max-w-sm mx-auto leading-relaxed">{message}</p>
      {onRetry && (
        <div className="pt-2">
          <button type="button" onClick={onRetry} className="btn">
            <span>Retry Operation</span>
          </button>
        </div>
      )}
    </div>
  );
}

