'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { CrossCaseRecord } from '../types/forensics';
import { fetchCrossCaseRecords } from '../api/backendClient';

export const CROSS_CASE_RECORDS: CrossCaseRecord[] = [];

export default function Page8_CrossCaseIntel() {
  const [records, setRecords] = useState<CrossCaseRecord[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchCrossCaseRecords('case-001').then((res) => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setRecords(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
            Cross-Case Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            TraceGraph automatically cross-references state and national police archives for
            co-occurring phone numbers, mule accounts, vehicle license plates, and device IMEIs.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white flex items-center gap-2.5 text-xs shrink-0 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
          <span className="text-[var(--ink)] font-medium">{records.length} Cross-Case Links Detected</span>
        </div>
      </div>

      <div className="card-panel overflow-hidden">
        <div className="p-5 border-b border-[rgba(20,20,22,0.08)] flex justify-between items-center text-xs">
          <span className="text-[var(--soft)] uppercase tracking-wider text-[11px]">
            National Crime Records Bureau (CCTNS) Co-Occurrence Ledger
          </span>
          <span className="text-emerald-700 font-medium">Real-Time Cross-Index Active</span>
        </div>

        <div className="divide-y divide-[rgba(20,20,22,0.06)]">
          {records.length === 0 ? (
            <div className="text-center text-[var(--soft)] py-16 px-4">
              <p className="text-sm font-medium text-[var(--ink)]">
                No cross-case matches found in the national database for current evidence profile.
              </p>
              <p className="text-xs mt-2 opacity-70">
                Upload more evidence or run the full pipeline to trigger similarity scoring against national archives.
              </p>
            </div>
          ) : (
            records.map((rec) => (
            <div
              key={rec.id}
              className="p-5 hover:bg-black/[0.015] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[var(--ink)] bg-white">
                    {rec.identifierType}
                  </span>
                  <span className="text-sm font-medium text-[var(--ink)] heading-tight">
                    {rec.matchedIdentifier}
                  </span>
                </div>
                <div className="text-xs text-[var(--soft)]">
                  Linked to <strong className="text-[var(--ink)] font-medium">{rec.firNumber}</strong> •{' '}
                  {rec.agency}
                </div>
                <p className="text-xs text-[var(--ink)] leading-relaxed">
                  Offense: {rec.offenseType} • Logged: {rec.dateLogged}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs">
                <div className="text-right">
                  <span className="text-[var(--ink)] font-medium block">
                    {Math.round(rec.matchConfidence * 100)}% Match
                  </span>
                  <span className="text-[11px] text-[var(--soft)]">Syndicate Nexus</span>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Pulling certified docket for ${rec.firNumber}`)}
                  className="btn"
                >
                  <b>›</b>
                  <span>Pull Certified Docket</span>
                </button>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}
