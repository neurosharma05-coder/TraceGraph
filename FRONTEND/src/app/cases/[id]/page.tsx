'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import CaseShell from '../../../components/CaseShell';
import { useCaseStore } from '../../../store/useCaseStore';
import { useToastStore } from '../../../components/common/useToastStore';
import { fetchKnowledgeGraph } from '../../../api/backendClient';
import {
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Layers,
  Activity,
  FileText,
  Users,
  Compass,
} from 'lucide-react';

export interface ReviewLinkItem {
  id: string;
  source: string;
  sourceType: string;
  sourceLabel?: string;
  target: string;
  targetType: string;
  targetLabel?: string;
  relation: string;
  confidence: number;
  reason: string;
  hasConflict: boolean;
  conflictType?: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

export interface InvestigationGap {
  id: string;
  category: 'cctv' | 'cdr' | 'bank' | 'cloud';
  title: string;
  description: string;
  agency: string;
  urgency: 'high' | 'medium' | 'low';
  requested: boolean;
  legalBasis: string;
  expectedScoreGain?: number;
  suggestedSource?: string;
}

export default function CaseDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const { caseMeta, files } = useCaseStore();
  const { addToast } = useToastStore();

  const [reviewLinks, setReviewLinks] = useState<ReviewLinkItem[]>([]);
  const [gaps, setGaps] = useState<InvestigationGap[]>([]);

  useEffect(() => {
    fetchKnowledgeGraph(caseId).then((kg) => {
      if (kg?.links && Array.isArray(kg.links)) {
        const transformed: ReviewLinkItem[] = kg.links.map((l: any, i: number) => ({
          id: `link_${i + 1}`,
          source: l.source,
          sourceType: 'entity',
          target: l.target,
          targetType: 'entity',
          relation: l.relation || 'Associated With',
          confidence: Math.round((l.confidence || 0.9) * 100),
          reason: l.reason || 'Forensic graph association derived from evidence extractions',
          hasConflict: false,
          status: l.state === 'rejected' ? 'rejected' : l.state === 'confirmed' ? 'confirmed' : 'pending',
        }));
        setReviewLinks(transformed);
      }
    });
  }, [caseId]);

  const newlyConfirmed = reviewLinks.filter((l) => l.status === 'confirmed').length;
  const newlyRejected = reviewLinks.filter((l) => l.status === 'rejected').length;
  const activeConflicts = reviewLinks.filter((l) => l.hasConflict && l.status === 'pending').length;

  const totalLinks = 74;
  const confirmedLinksCount = 48 + newlyConfirmed;
  const rejectedLinksCount = 2 + newlyRejected;
  const reviewCandidateCount = Math.max(18 - newlyConfirmed - newlyRejected, 0);
  const conflictsCount = activeConflicts;

  const confirmedPct = Math.round((confirmedLinksCount / totalLinks) * 100);
  const reviewPct = Math.round((reviewCandidateCount / totalLinks) * 100);
  const conflictsPct = Math.round((conflictsCount / totalLinks) * 100);
  const rejectedPct = Math.max(100 - confirmedPct - reviewPct - conflictsPct, 0);

  const handleConfirmLink = (id: string) => {
    setReviewLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'confirmed' } : l))
    );
    addToast({
      type: 'success',
      title: 'Link Confirmed',
      message: 'Evidentiary relation verified and promoted to active prosecution graph. Stat cards updated.',
    });
  };

  const handleRejectLink = (id: string) => {
    setReviewLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l))
    );
    addToast({
      type: 'info',
      title: 'Link Rejected',
      message: 'Relation flagged as false positive and excluded from timeline reconstruction. Stat cards updated.',
    });
  };

  const handleToggleGapRequested = (id: string) => {
    setGaps((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = !g.requested;
          addToast({
            type: 'info',
            title: next ? 'Subpoena / Section 91 Notice Drafted' : 'Request Cancelled',
            message: `Evidentiary gap marked as ${next ? 'requisitioned' : 'pending'}.`,
          });
          return { ...g, requested: next };
        }
        return g;
      })
    );
  };

  // 6 Stat cards data (Reactively updated on Confirm/Reject)
  const statCards = [
    {
      title: 'Evidence Files',
      value: `${files.length} Files`,
      secondary: '18.4 MB total storage',
      tag: '/ 01',
    },
    {
      title: 'Timeline Events',
      value: '142 Events',
      secondary: '94.2% corrected time',
      tag: '/ 02',
    },
    {
      title: 'Resolved Entities',
      value: '38 Profiles',
      secondary: 'Avg uncertainty ±1.4s',
      tag: '/ 03',
    },
    {
      title: 'Graph Links',
      value: `${confirmedLinksCount} Confirmed`,
      secondary: `${conflictsCount} active conflicts`,
      tag: '/ 04',
    },
    {
      title: 'Hypotheses',
      value: '3 Theories',
      secondary: '4 cross-case matches',
      tag: '/ 05',
    },
    {
      title: 'Evidence Gaps',
      value: `${gaps.length} Gaps`,
      secondary: `${gaps.filter((g) => !g.requested).length} pending subpoena`,
      tag: '/ 06',
    },
  ];

  const histogram = [
    { range: '50-60%', count: 8, height: '35%' },
    { range: '60-70%', count: 14, height: '55%' },
    { range: '70-80%', count: 18, height: '70%' },
    { range: '80-90%', count: 24, height: '88%' },
    { range: '90-100%', count: 32, height: '100%', autoConfirm: true },
  ];

  return (
    <CaseShell caseId={caseId}>
      <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
              Case Investigation Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
              Multi-source evidentiary status for {caseMeta.caseNumber || caseId}. Aggregates
              cross-modal forensic inputs, time-trust calibration, Bayesian confidence distributions, and
              actionable reviewer checkpoints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/cases/${caseId}/report`}
              className="btn shrink-0"
              style={{ textDecoration: 'none' }}
            >
              <b>›</b>
              <span>Export Court Report</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {statCards.map((sc) => (
            <div key={sc.title} className="card-panel p-4 relative space-y-2">
              <div className="flex items-center justify-between text-[10px] text-[var(--soft)] uppercase tracking-wider">
                <span>{sc.title}</span>
                <span className="tag-num">{sc.tag}</span>
              </div>
              <div className="text-xl sm:text-2xl font-normal text-[var(--ink)] heading-tight">
                {sc.value}
              </div>
              <div className="text-[11px] text-[var(--soft)] pt-1 border-t border-[rgba(20,20,22,0.06)] truncate">
                {sc.secondary}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-panel p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(20,20,22,0.08)] pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
                  Link State Composition
                </span>
                <h3 className="text-base font-normal text-[var(--ink)] mt-0.5 heading-tight">
                  74 Evidentiary Connections
                </h3>
              </div>
              <span className="text-xs text-[var(--soft)]">Total: 74</span>
            </div>

            <div className="space-y-2">
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-black/10 border border-[rgba(20,20,22,0.1)]">
                <div style={{ width: `${confirmedPct}%` }} className="bg-[#141416] transition-all" title={`Confirmed: ${confirmedLinksCount} (${confirmedPct}%)`} />
                <div style={{ width: `${reviewPct}%` }} className="bg-[#787880] transition-all" title={`Review: ${reviewCandidateCount} (${reviewPct}%)`} />
                <div style={{ width: `${conflictsPct}%` }} className="bg-[#c2c2c8] transition-all" title={`Conflicts: ${conflictsCount} (${conflictsPct}%)`} />
                <div style={{ width: `${rejectedPct}%` }} className="bg-[#e4e4e7] transition-all" title={`Rejected: ${rejectedLinksCount} (${rejectedPct}%)`} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#141416]" />
                  <span className="text-[var(--ink)] font-medium">{confirmedLinksCount} Confirmed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#787880]" />
                  <span className="text-[var(--soft)]">{reviewCandidateCount} Review</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c2c2c8]" />
                  <span className="text-[var(--soft)]">{conflictsCount} Conflicts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e4e4e7]" />
                  <span className="text-[var(--soft)]">{rejectedLinksCount} Rejected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-panel p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(20,20,22,0.08)] pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
                  Bayesian Confidence Distribution
                </span>
                <h3 className="text-base font-normal text-[var(--ink)] mt-0.5 heading-tight">
                  Auto-Confirm Threshold: ≥ 90%
                </h3>
              </div>
              <span className="text-xs text-emerald-800 font-medium">32 Auto-Accepted</span>
            </div>

            <div className="h-28 flex items-end justify-between gap-3 pt-4 px-2">
              {histogram.map((b) => (
                <div key={b.range} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] text-[var(--soft)]">{b.count}</span>
                  <div
                    style={{ height: b.height }}
                    className={`w-full rounded-t-md transition-all ${
                      b.autoConfirm ? 'bg-[#141416]' : 'bg-[#787880]'
                    }`}
                  />
                  <span className="text-[10px] text-[var(--soft)] mt-1 whitespace-nowrap">{b.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card-panel p-6 space-y-4">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Financial Dispersal</span>
                <h3 className="text-base font-normal text-[var(--ink)] mt-0.5 heading-tight">Laundering Flow</h3>
              </div>
              <span className="text-xs text-[var(--ink)] font-medium">₹48.2 Lakhs</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 flex justify-between items-center">
                <span className="text-[var(--soft)]">Identified Mule VPAs</span>
                <span className="font-medium text-[var(--ink)]">12 Accounts</span>
              </div>
              <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 flex justify-between items-center">
                <span className="text-[var(--soft)]">Highest Risk Entity</span>
                <span className="font-medium text-[var(--ink)]">Aman Verma (94% mule risk)</span>
              </div>
              <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 flex justify-between items-center">
                <span className="text-[var(--soft)]">Primary Extortion Mode</span>
                <span className="font-medium text-[var(--ink)]">Encrypted Telegram + UPI Micro-splits</span>
              </div>
            </div>

            <Link
              href={`/cases/${caseId}/intelligence`}
              className="text-xs text-[var(--ink)] font-medium underline flex items-center gap-1 pt-1"
            >
              <span>View full financial intelligence</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="card-panel p-6 space-y-4">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Unified Chronology</span>
                <h3 className="text-base font-normal text-[var(--ink)] mt-0.5 heading-tight">Anchor Event Horizon</h3>
              </div>
              <Link href={`/cases/${caseId}/timeline`} className="text-xs text-[var(--ink)] underline">
                Open
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="border-l-2 border-[#141416] pl-3 py-1 space-y-0.5">
                <span className="text-[10px] text-[var(--soft)] block">02:14:00 UTC · Ransom Call</span>
                <span className="font-medium text-[var(--ink)] block">VolP Extortion Demand Generated</span>
              </div>
              <div className="border-l-2 border-[#141416] pl-3 py-1 space-y-0.5">
                <span className="text-[10px] text-[var(--soft)] block">03:00:22 UTC · ANPR Toll Cam 04</span>
                <span className="font-medium text-[var(--ink)] block">White Swift DL-3C-AZ-9912 Spotted</span>
              </div>
              <div className="border-l-2 border-dashed border-[rgba(20,20,22,0.25)] pl-3 py-1 space-y-0.5">
                <span className="text-[10px] text-[var(--soft)] block">03:45:00 UTC · Unobserved Interval</span>
                <span className="text-[var(--soft)] block">45 min spatial gap flagged</span>
              </div>
            </div>
          </div>

          <div className="card-panel p-6 space-y-4">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">GIS Tracking</span>
                <h3 className="text-base font-normal text-[var(--ink)] mt-0.5 heading-tight">Route Waypoints</h3>
              </div>
              <Link href={`/cases/${caseId}/map`} className="text-xs text-[var(--ink)] underline">
                Open
              </Link>
            </div>

            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--soft)]">Corridor</span>
                <span className="font-medium text-[var(--ink)]">Sector 18 → Kashmere Gate</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--soft)]">Travel Feasibility</span>
                <span className="font-medium text-emerald-800">42 km in 58m (Plausible)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--soft)]">Active Flag</span>
                <span className="font-medium text-[var(--ink)]">1 Impossible Travel Arcs</span>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href={`/cases/${caseId}/map`}
                className="text-xs text-[var(--ink)] font-medium underline flex items-center gap-1"
              >
                <span>Inspect GIS corridor triangulation</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="card-panel p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(20,20,22,0.08)] pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
                Investigator Action Queue
              </span>
              <h3 className="text-xl font-normal text-[var(--ink)] mt-0.5 heading-tight">
                Needs Your Review: Low Confidence & Conflict Links
              </h3>
            </div>
            <span className="text-xs text-[var(--soft)]">
              {reviewLinks.filter((l) => l.status === 'pending').length} items awaiting manual determination
            </span>
          </div>

          <div className="divide-y divide-[rgba(20,20,22,0.06)]">
            {reviewLinks.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--ink)]">
                      {item.sourceLabel || item.source}
                    </span>
                    <span className="text-[var(--soft)]">→</span>
                    <span className="font-medium text-[var(--ink)]">
                      {item.targetLabel || item.target}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white text-[10px]">
                      {item.relation}
                    </span>
                    {item.hasConflict && (
                      <span className="inline-block px-2 py-0.5 rounded-full border border-[rgba(20,20,22,0.14)] text-[var(--ink)] bg-white text-[10px]">
                        Spatial Conflict
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--soft)] leading-relaxed text-[11px]">
                    {item.reason}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-[var(--soft)] block uppercase">Bayesian Prob.</span>
                    <span className="font-medium text-sm text-[var(--ink)]">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>

                  {item.status === 'pending' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleConfirmLink(item.id)}
                        className="px-3 py-1.5 rounded-full border border-[#141416] bg-[#141416] text-[#F7F4EE] hover:opacity-90 transition-opacity flex items-center gap-1 font-medium"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirm</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectLink(item.id)}
                        className="px-3 py-1.5 rounded-full border border-[rgba(20,20,22,0.14)] bg-white text-[var(--ink)] hover:border-[rgba(20,20,22,0.3)] transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === 'confirmed'
                          ? 'border-emerald-600/20 text-emerald-800 bg-emerald-50'
                          : 'border-black/15 text-[var(--soft)] bg-black/5'
                      }`}
                    >
                      {item.status === 'confirmed' ? 'Confirmed' : 'Rejected'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-panel p-6 sm:p-7 space-y-4">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Primary Theory</span>
                <h3 className="text-lg font-normal text-[var(--ink)] mt-0.5 heading-tight">
                  Coordinated Extortion & Mule Dispersal
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#141416] grid place-items-center text-xs font-medium text-[var(--ink)]">
                91%
              </div>
            </div>

            <p className="text-xs text-[var(--soft)] leading-relaxed">
              Suspect Vikram Malhotra coordinated extortion communications using an encrypted VoIP trunk and a burner SIM,
              while instructing courier Aman Verma to distribute ransom payments into micro-dispersal accounts.
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs pt-2">
              <div className="p-2.5 rounded-lg border border-[rgba(20,20,22,0.08)] bg-white/70 text-center">
                <span className="text-[10px] text-[var(--soft)] block">CDR Corroboration</span>
                <span className="font-medium text-[var(--ink)]">98% match</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[rgba(20,20,22,0.08)] bg-white/70 text-center">
                <span className="text-[10px] text-[var(--soft)] block">ANPR Plate</span>
                <span className="font-medium text-[var(--ink)]">92% match</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[rgba(20,20,22,0.08)] bg-white/70 text-center">
                <span className="text-[10px] text-[var(--soft)] block">UPI Ledger</span>
                <span className="font-medium text-[var(--ink)]">99% match</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/cases/${caseId}/hypotheses`}
                className="text-xs text-[var(--ink)] font-medium underline flex items-center gap-1"
              >
                <span>Compare competing defense hypotheses</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="card-panel p-6 sm:p-7 space-y-4">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Missing Evidence</span>
                <h3 className="text-lg font-normal text-[var(--ink)] mt-0.5 heading-tight">
                  Top 3 Evidentiary Gaps
                </h3>
              </div>
              <span className="text-xs text-[var(--soft)]">Subpoena Readiness</span>
            </div>

            <div className="space-y-3 text-xs">
              {gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 max-w-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--ink)]">{gap.title}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full border border-[rgba(20,20,22,0.12)] bg-white text-[var(--soft)] uppercase">
                        +{gap.expectedScoreGain || 15}% score gain
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--soft)] block truncate">
                      Source: {gap.suggestedSource || gap.agency}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleGapRequested(gap.id)}
                    className={`px-3 py-1 rounded-full text-[11px] border transition-colors shrink-0 ${
                      gap.requested
                        ? 'border-emerald-600/30 text-emerald-800 bg-emerald-50'
                        : 'border-[rgba(20,20,22,0.14)] text-[var(--ink)] bg-white hover:border-[#141416]'
                    }`}
                  >
                    {gap.requested ? 'Notice Requested' : 'Mark as requested'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-[rgba(20,20,22,0.12)] bg-white/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--soft)]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
            <span className="text-[var(--ink)] font-medium">TraceGraph Core v3.4.1-rc2</span>
            <span>·</span>
            <span>Method: Bayesian Multi-Modal Ensemble (Graph + Time-Trust)</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Last Run: 12 minutes ago</span>
            <span className="text-[var(--ink)] font-medium">Zero Monospace · Section 63(4) BSA Sealed</span>
          </div>
        </div>
      </div>
    </CaseShell>
  );
}

