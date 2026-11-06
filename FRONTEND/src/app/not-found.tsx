import React from 'react';
import Link from 'next/link';
import Cursor from '../components/Cursor';

export default function NotFound() {
  return (
    <>
      <Cursor />
      <div className="frame min-h-screen flex flex-col justify-between">
        <header className="top">
          <Link href="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i aria-hidden="true" />
            <span>TraceGraph</span>
          </Link>
          <div className="right">
            <Link href="/" className="btn" style={{ textDecoration: 'none' }}>
              <b>‹</b>
              <span>Landing</span>
            </Link>
          </div>
        </header>

        <section className="console-panel my-auto p-8 sm:p-16 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full border border-[rgba(20,20,22,0.14)] bg-white mx-auto grid place-items-center text-sm font-medium text-[var(--ink)]">
            404
          </div>
          <h1 className="text-3xl font-normal text-[var(--ink)] heading-tight">
            Dossier or Route Not Found
          </h1>
          <p className="text-xs text-[var(--soft)] max-w-md mx-auto leading-relaxed">
            The requested investigation case, forensic route, or evidentiary annexure does not exist
            in the local cryptographic ledger.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <Link href="/cases" className="btn" style={{ textDecoration: 'none' }}>
              <b>›</b>
              <span>Return to Cases</span>
            </Link>
            <Link href="/" className="btn" style={{ textDecoration: 'none' }}>
              <b>‹</b>
              <span>Home</span>
            </Link>
          </div>
        </section>

        <div className="p-4 text-center text-xs text-[var(--soft)]">
          TraceGraph Forensic Suite • Section 63(4) BSA 2023 Compliant
        </div>
      </div>
    </>
  );
}

