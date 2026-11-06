'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCaseMeta } from '../../api/backendClient';
import { Search, ShieldCheck, ArrowRight, FolderOpen, Plus, SlidersHorizontal } from 'lucide-react';
import Cursor from '../../components/Cursor';
import { EmptyState } from '../../components/common/CommonStates';

interface CaseListItem {
  id: string; caseNumber: string; title: string; agency: string; investigator: string;
  date: string; status: 'sealed' | 'active' | 'review' | 'admitted';
  counts: { evidence: number; events: number; entities: number; links: number };
  rootHash: string; topHypothesis: { title: string; score: number };
  conflictsCount: number; crossCaseHits: number; modelVersion: string;
}

export default function CasesListPage() {
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sealed' | 'active' | 'review' | 'admitted'>('all');

  useEffect(() => {
    fetchCaseMeta('case-001').then((meta) => {
      if (meta) {
        setCases([{
          id: 'case-001',
          caseNumber: meta.caseNumber || 'CR-2026-0942',
          title: meta.title || 'Operation Mule Trail — NCR Extortion Syndicate',
          agency: meta.agency || 'Delhi Police Cyber Cell, IFSO',
          investigator: meta.investigatorName || 'ACP Vikramaditya Singh',
          date: meta.dateOpened || '2026-02-14',
          status: (meta.status as CaseListItem['status']) || 'sealed',
          counts: { evidence: 7, events: 12, entities: 3, links: 4 },
          rootHash: meta.sealedHash || '',
          topHypothesis: { title: 'Coordinated Extortion via Mule Network', score: 88 },
          conflictsCount: 2,
          crossCaseHits: 4,
          modelVersion: 'v3.4.1',
        }]);
      }
    });
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.agency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLoadDemo = () => {};

  return (
    <>
      <Cursor />
      <div className="frame">
        <header className="top" style={{ position: 'relative', marginBottom: '8px' }}>
          <Link href="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i aria-hidden="true" />
            <span>TraceGraph</span>
          </Link>

          <div className="right flex items-center gap-3">
            <span className="text-xs text-[var(--on-frame)] hidden sm:inline-block">
              Forensic Investigation Registry
            </span>
            <Link href="/" className="btn" style={{ textDecoration: 'none' }}>
              <b>‹</b>
              <span>Landing</span>
            </Link>
          </div>
        </header>

        <section className="console-panel">
          <main className="console-main p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
                  Investigation Cases
                </h1>
                <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
                  Cryptographically sealed criminal and cyber forensics case dossiers. Select an active
                  case to access the multi-modal evidence graph, unified chronology, and court report.
                </p>
              </div>

              <Link
                href="/console"
                className="btn shrink-0"
                style={{ textDecoration: 'none' }}
              >
                <b>+</b>
                <span>New Case Dossier</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-[var(--soft)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by FIR, title, agency, or officer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white text-xs text-[var(--ink)] focus:outline-none"
                />
              </div>

              <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-[rgba(20,20,22,0.03)] gap-1 overflow-x-auto shrink-0">
                {(['all', 'sealed', 'active', 'admitted'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors capitalize ${
                      statusFilter === st
                        ? 'bg-white text-[var(--ink)] shadow-xs font-medium'
                        : 'text-[var(--soft)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredCases.length === 0 ? (
              <EmptyState
                title="No Investigation Cases Found"
                description="No forensic case matching your active search query or filter criteria was found in the local ledger."
                actionLabel="Reload Demo Dossiers"
                onAction={handleLoadDemo}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCases.map((c) => (
                  <div
                    key={c.id}
                    className="card-panel p-6 sm:p-7 space-y-5 hover:border-[rgba(20,20,22,0.25)] transition-all relative"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(20,20,22,0.08)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-medium text-[var(--ink)] heading-tight">
                          {c.caseNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[11px] bg-white text-[var(--ink)]">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span className="capitalize">{c.status}</span>
                        </span>
                        <span className="text-xs text-[var(--soft)]">
                          Model {c.modelVersion}
                        </span>
                      </div>

                      <div className="text-xs text-[var(--soft)] flex items-center gap-4">
                        <span>Logged: {c.date}</span>
                        <span>{c.agency}</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-normal text-[var(--ink)] heading-tight">
                        {c.title}
                      </h2>
                      <p className="text-xs text-[var(--soft)] mt-1">
                        Assigned Officer: <span className="text-[var(--ink)] font-medium">{c.investigator}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70">
                        <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Evidence Files</span>
                        <span className="text-sm font-medium text-[var(--ink)]">{c.counts.evidence} containers</span>
                      </div>
                      <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70">
                        <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Correlated Events</span>
                        <span className="text-sm font-medium text-[var(--ink)]">{c.counts.events} records</span>
                      </div>
                      <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70">
                        <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Identities & Links</span>
                        <span className="text-sm font-medium text-[var(--ink)]">{c.counts.entities} nodes · {c.counts.links} links</span>
                      </div>
                      <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70">
                        <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Signals</span>
                        <span className="text-sm font-medium text-[var(--ink)]">{c.conflictsCount} conflicts · {c.crossCaseHits} cross-hits</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-[rgba(20,20,22,0.06)] text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-[var(--soft)]">Leading Hypothesis:</span>
                        <div className="text-xs font-medium text-[var(--ink)] flex items-center gap-2">
                          <span>{c.topHypothesis.title}</span>
                          <span className="inline-block px-2 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white text-[10px]">
                            {c.topHypothesis.score}% Bayesian Score
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden lg:block">
                          <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Root SHA-256</span>
                          <span className="text-[11px] text-[var(--soft)]">{c.rootHash.slice(0, 20)}...</span>
                        </div>

                        <Link
                          href={`/cases/${c.id}`}
                          className="btn"
                          style={{ textDecoration: 'none' }}
                        >
                          <b>›</b>
                          <span>Open Case Console</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </section>
      </div>
    </>
  );
}

