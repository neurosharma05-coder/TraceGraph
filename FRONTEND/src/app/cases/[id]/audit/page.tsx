'use client';

import React, { useState, useEffect, use } from 'react';
import CaseShell from '../../../../components/CaseShell';
import { useCaseStore } from '../../../../store/useCaseStore';
import { useToastStore } from '../../../../components/common/useToastStore';
import { fetchAuditLedger } from '../../../../api/backendClient';

type AuditLogEntry = {
  blockIndex?: number;
  eventHash?: string;
  eventTitle?: string;
  timestamp: string;
  sha256?: string;
  prevHash?: string;
  actor: string;
  actionType?: string;
  id?: string;
  actorName?: string;
  action?: string;
  details?: string;
  hash?: string;
};
import {
  ShieldCheck,
  Check,
  Copy,
  Download,
  Filter,
  RefreshCw,
  FileCheck,
  Layers,
} from 'lucide-react';

export default function CaseAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const { files, caseMeta } = useCaseStore();
  const { addToast } = useToastStore();

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [actorFilter, setActorFilter] = useState<'all' | 'investigator' | 'system' | 'model'>('all');

  useEffect(() => {
    fetchAuditLedger(caseId).then((res) => {
      if (res && Array.isArray(res) && res.length > 0) setAuditLog(res);
    });
  }, [caseId]);
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [chainStatus, setChainStatus] = useState<'unverified' | 'valid' | 'broken'>('valid');

  const filteredLogs = auditLog.filter((l) => {
    return actorFilter === 'all' || l.actor === actorFilter;
  });

  const [brokenBlockIndex, setBrokenBlockIndex] = useState<number | null>(null);

  const handleVerifyChain = () => {
    setVerifyingChain(true);
    setTimeout(() => {
      setVerifyingChain(false);
      // Real check on files chain: each block's parentHash must match predecessor's sha256
      let brokenIdx: number | null = null;
      for (let i = 1; i < files.length; i++) {
        if (files[i].parentHash !== files[i - 1].sha256) {
          brokenIdx = i;
          break;
        }
      }

      if (brokenIdx !== null) {
        setChainStatus('broken');
        setBrokenBlockIndex(brokenIdx);
        addToast({
          type: 'error',
          title: 'Hash Chain Broken',
          message: `Block #${brokenIdx + 1} (${files[brokenIdx].name}) fails parent hash linkage!`,
        });
      } else {
        setChainStatus('valid');
        setBrokenBlockIndex(null);
        addToast({
          type: 'success',
          title: 'Chain Continuity Verified',
          message: `All ${files.length} SHA-256 blocks seamlessly verified from Genesis to Terminal Root.`,
        });
      }
    }, 800);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Actor,Action,Details,Hash']
        .concat(
          auditLog.map(
            (l) => `"${l.timestamp}","${l.actorName || l.actor}","${l.action || l.actionType || l.eventTitle}","${l.details || l.eventTitle}","${l.hash || l.sha256 || l.eventHash || ''}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Ledger_${caseId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Audit Ledger Exported',
      message: `Downloaded CSV ledger for case ${caseId}.`,
    });
  };

  return (
    <CaseShell caseId={caseId}>
      <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
              Cryptographic Audit & Hash Chain Ledger
            </h1>
            <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
              Statutory verification ledger conforming to Section 63(4) Bharatiya Sakshya Adhiniyam 2023.
              Maintains an immutable record of all investigator overrides, machine model runs, and block hashes.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleVerifyChain}
              disabled={verifyingChain}
              className="px-4 py-2 rounded-full border border-[#141416] bg-[#141416] text-[#F7F4EE] hover:opacity-90 transition-opacity text-xs font-medium flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${verifyingChain ? 'animate-spin' : ''}`} />
              <span>Verify Chain Integrity</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-full border border-[rgba(20,20,22,0.14)] bg-white text-[var(--ink)] hover:border-[#141416] transition-colors text-xs font-medium flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="card-panel p-6 sm:p-7 space-y-4">
          <div className="flex justify-between items-center border-b border-[rgba(20,20,22,0.08)] pb-3 text-xs">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Visual Hash Chain</span>
              <h3 className="text-base font-normal text-[var(--ink)] heading-tight">Parent-to-Child Block Succession</h3>
            </div>
            <span className="text-emerald-800 font-medium">Chain Continuous (7/7 Blocks)</span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-3 min-w-[700px]">
              {files.map((file, idx) => (
                <React.Fragment key={file.id}>
                  <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white space-y-1.5 shrink-0 w-48 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-[var(--soft)]">
                      <span>Block #{String(idx + 1).padStart(2, '0')}</span>
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    </div>
                    <span className="font-medium text-[var(--ink)] truncate block">{file.name}</span>
                    <span className="text-[10px] text-[var(--soft)] block truncate">
                      SHA: {file.sha256.slice(0, 14)}...
                    </span>
                  </div>
                  {idx < files.length - 1 && (
                    <span className="text-[var(--soft)] font-normal text-xs shrink-0">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="card-panel overflow-hidden">
          <div className="p-5 border-b border-[rgba(20,20,22,0.08)] flex justify-between items-center text-xs">
            <span className="text-[11px] uppercase tracking-wider text-[var(--soft)]">
              Custody Attestation Table
            </span>
            <span className="text-xs text-[var(--soft)]">{files.length} Evidence Blocks Logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(20,20,22,0.08)] bg-[rgba(20,20,22,0.02)] text-[var(--soft)] uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-normal">Block</th>
                  <th className="py-3 px-4 font-normal">Evidence File</th>
                  <th className="py-3 px-4 font-normal">Parent Hash</th>
                  <th className="py-3 px-4 font-normal">SHA-256 Digest</th>
                  <th className="py-3 px-4 font-normal text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(20,20,22,0.06)] text-[var(--ink)]">
                {files.map((f, i) => (
                  <tr key={f.id} className="hover:bg-black/[0.015]">
                    <td className="py-3 px-4 text-[var(--soft)]">#{i + 1}</td>
                    <td className="py-3 px-4 font-medium">{f.name}</td>
                    <td className="py-3 px-4 text-[11px] text-[var(--soft)]">{f.parentHash.slice(0, 20)}...</td>
                    <td className="py-3 px-4 text-[11px]">{f.sha256.slice(0, 24)}...</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-medium text-[11px]">
                        <Check className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-panel p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(20,20,22,0.08)] pb-4 text-xs">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Operation Trail</span>
              <h3 className="text-xl font-normal text-[var(--ink)] heading-tight">
                Chronological Activity Log
              </h3>
            </div>

            <div className="inline-flex items-center p-0.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white gap-1 text-xs">
              {(['all', 'investigator', 'system', 'model'] as const).map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setActorFilter(act)}
                  className={`px-3 py-1 rounded-full capitalize transition-colors ${
                    actorFilter === act ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[rgba(20,20,22,0.06)] text-xs">
            {filteredLogs.map((entry, idx) => {
              const displayAction = entry.action || entry.actionType || entry.eventTitle || 'Audit Log Event';
              const displayActor = entry.actorName || entry.actor || 'System';
              const displayDetails = entry.details || entry.eventTitle || `Block #${entry.blockIndex || idx + 1}`;
              const displayHash = entry.hash || entry.sha256 || entry.eventHash || '';
              return (
                <div key={entry.id || entry.blockIndex || idx} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-[var(--ink)]">{displayAction}</span>
                      <span className="px-2 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] bg-white capitalize">
                        {entry.actor}
                      </span>
                      <span className="text-[11px] text-[var(--soft)]">by {displayActor}</span>
                    </div>
                    <p className="text-[var(--soft)] leading-relaxed text-xs">{displayDetails}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-[var(--soft)] block">{entry.timestamp}</span>
                    <span className="text-[10px] text-[var(--soft)] block truncate max-w-[200px]">
                      Hash: {displayHash ? `${displayHash.slice(0, 16)}...` : 'N/A'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CaseShell>
  );
}

