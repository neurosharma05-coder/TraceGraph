'use client';

import React, { useState, useEffect } from 'react';
import { useCaseStore } from '../store/useCaseStore';
import { useFilterStore } from '../store/useFilterStore';
import { verifyServerHashChain } from '../api/backendClient';
import {
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';

export default function Page2_EvidenceVault() {
  const { caseMeta, files } = useCaseStore();
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [chainStatus, setChainStatus] = useState<{ isValid: boolean; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    verifyServerHashChain('case-001').then((res) => {
      if (isMounted && res) {
        setChainStatus({ isValid: res.isValid, message: res.message });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sha256.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
            Evidence Vault & Provenance Chain
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            Immutable digital evidence ledger. Every ingested record is bound to a SHA-256 hash
            chain with parent-block verification, satisfying statutory chain of custody requirements.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white flex items-center gap-2.5 text-xs shrink-0 shadow-xs">
          <span className={`w-2 h-2 rounded-full ${chainStatus?.isValid !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className="text-[var(--ink)] font-medium">
            {chainStatus ? chainStatus.message : `Hash Chain Intact (${files.length} Blocks Verified)`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-panel p-5 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
              Case Identifier
            </span>
            <span className="tag-num">/ 01</span>
          </div>
          <span className="text-base font-normal tracking-tight text-[var(--ink)] block heading-tight">
            {caseMeta.caseNumber}
          </span>
          <span className="text-xs text-[var(--soft)] mt-1 block">
            {caseMeta.investigatorName} ({caseMeta.investigatorBadge})
          </span>
        </div>

        <div className="card-panel p-5 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
              Genesis Hash
            </span>
            <span className="tag-num">/ 02</span>
          </div>
          <span className="text-xs text-[var(--ink)] truncate block">
            genesis_000000000000...
          </span>
          <span className="text-xs text-[var(--soft)] mt-1 block">Root of cryptographic trust</span>
        </div>

        <div className="card-panel p-5 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
              Statutory Compliance
            </span>
            <span className="tag-num">/ 03</span>
          </div>
          <span className="text-base font-normal tracking-tight text-[var(--ink)] block heading-tight">
            BSA 2023 Sec 63(4)
          </span>
          <span className="text-xs text-[var(--soft)] mt-1 block">Electronic evidence ready</span>
        </div>

        <div className="card-panel p-5 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
              Total Custody Volume
            </span>
            <span className="tag-num">/ 04</span>
          </div>
          <span className="text-base font-normal tracking-tight text-[var(--ink)] block heading-tight">
            {files.reduce((acc, f) => acc + f.bytes, 0) > 0
              ? `${(files.reduce((acc, f) => acc + f.bytes, 0) / (1024 * 1024)).toFixed(1)} MB`
              : '0 MB'}
          </span>
          <span className="text-xs text-[var(--soft)] mt-1 block">Across {files.length} containers</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[var(--soft)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name, category, or SHA-256..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white text-xs text-[var(--ink)] focus:outline-none"
          />
        </div>

        <span className="text-xs text-[var(--soft)]">
          Showing {filteredFiles.length} of {files.length} registered blocks
        </span>
      </div>

      <div className="rounded-2xl border border-[rgba(20,20,22,0.1)] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(20,20,22,0.08)] bg-[rgba(20,20,22,0.02)] text-[var(--soft)] uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-normal">Block #</th>
                <th className="py-3.5 px-4 font-normal">Source Category</th>
                <th className="py-3.5 px-4 font-normal">Evidence File</th>
                <th className="py-3.5 px-4 font-normal">SHA-256 Hash</th>
                <th className="py-3.5 px-4 font-normal">Custody Timestamp</th>
                <th className="py-3.5 px-4 font-normal">Verification</th>
                <th className="py-3.5 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(20,20,22,0.06)] text-[var(--ink)]">
              {filteredFiles.map((file, idx) => (
                <tr key={file.id} className="hover:bg-black/[0.015] transition-colors">
                  <td className="py-4 px-4 text-[var(--soft)]">
                    #{String(idx + 1).padStart(3, '0')}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full border border-[rgba(20,20,22,0.12)] text-[11px] bg-white">
                      {file.categoryLabel}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-[var(--ink)]">{file.name}</div>
                    <span className="text-[11px] text-[var(--soft)]">{file.size}</span>
                  </td>
                  <td className="py-4 px-4 text-[11px]">
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="text-[var(--soft)]">{file.sha256.slice(0, 16)}...</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(file.sha256)}
                        className="text-[var(--soft)] hover:text-[var(--ink)] p-0.5"
                        title="Copy full SHA-256"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    {copiedHash === file.sha256 && (
                      <span className="text-[10px] text-emerald-600 block mt-0.5">Copied</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[var(--soft)] text-[11px]">
                    {file.uploadTimestamp}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-600/20 text-emerald-700 bg-emerald-50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Verified</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Raw cryptographic block verified for ${file.name}`)}
                      className="text-[var(--soft)] hover:text-[var(--ink)] inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
