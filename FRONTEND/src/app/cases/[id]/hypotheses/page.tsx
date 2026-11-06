'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import CaseShell from '../../../../components/CaseShell';
import { useToastStore } from '../../../../components/common/useToastStore';
import { TheoryModel } from '../../../../types/forensics';
import { fetchHypotheses } from '../../../../api/backendClient';
import {
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Layers,
  Split,
  Compass,
  MapPin,
  ShieldAlert,
  Clock,
  Video,
  CreditCard,
  Radio,
  Cloud,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

interface InvestigationGapItem {
  id: string;
  gap?: string;
  priority?: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  severityLevel?: number;
  expectedScoreGain: number;
  description: string;
  suggestedSource: string;
  suggestedSourceIcon?: string;
  relatedEntities?: string[];
  requested: boolean;
}

export default function CaseHypothesesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'theories' | 'compare' | 'gaps'>('theories');
  const [theories, setTheories] = useState<TheoryModel[]>([]);
  const [selectedTheory, setSelectedTheory] = useState<TheoryModel | null>(null);
  const [compareTheoryA, setCompareTheoryA] = useState<TheoryModel | null>(null);
  const [compareTheoryB, setCompareTheoryB] = useState<TheoryModel | null>(null);
  const [gaps, setGaps] = useState<InvestigationGapItem[]>([]);

  useEffect(() => {
    fetchHypotheses(caseId).then((res) => {
      if (res && res.length > 0) {
        setTheories(res);
        setSelectedTheory(res[0]);
        setCompareTheoryA(res[0]);
        setCompareTheoryB(res[1] || res[0]);
      }
    });
  }, [caseId]);

  const [allLinksConfirmed, setAllLinksConfirmed] = useState(true);

  const handleToggleGap = (id: string) => {
    setGaps((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = !g.requested;
          addToast({
            type: 'info',
            title: next ? 'Evidentiary Subpoena Dispatched' : 'Subpoena Request Reverted',
            message: `Section 91 CrPC notice for ${g.suggestedSource} marked as ${next ? 'active' : 'pending'}.`,
          });
          return { ...g, requested: next };
        }
        return g;
      })
    );
  };

  const getSourceIcon = (iconType: string) => {
    switch (iconType) {
      case 'cctv':
        return <Video className="w-3.5 h-3.5" />;
      case 'telecom':
        return <Radio className="w-3.5 h-3.5" />;
      case 'bank':
        return <CreditCard className="w-3.5 h-3.5" />;
      default:
        return <Cloud className="w-3.5 h-3.5" />;
    }
  };

  return (
    <CaseShell caseId={caseId}>
      <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
              Hypothesis Matrix & Evidence Gaps
            </h1>
            <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
              Construct, falsify, and contrast competing prosecution versus defense hypotheses.
              Evaluate mathematical Bayesian corroborations, inspect isolated conflicts, and requisition missing evidence.
            </p>
          </div>

          <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-white gap-1 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('theories')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'theories' ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
              }`}
            >
              Ranked Theories
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'compare' ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
              }`}
            >
              Compare Mode (Side-by-Side)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gaps')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'gaps' ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
              }`}
            >
              Evidence Gaps ({gaps.length})
            </button>
          </div>
        </div>

        {activeTab === 'theories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider text-[var(--soft)] block">
                Competing Formulations
              </span>

              {theories.map((theory, idx) => {
                const isSelected = selectedTheory?.id === theory.id;
                return (
                  <div
                    key={theory.id}
                    onClick={() => setSelectedTheory(theory)}
                    className={`card-panel p-5 cursor-pointer transition-all space-y-3 ${
                      isSelected ? 'border-[#141416] bg-white shadow-xs' : 'hover:border-[rgba(20,20,22,0.25)]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="tag-num">/ 0{idx + 1}</span>
                      <span className="px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[11px] bg-white font-medium text-[var(--ink)]">
                        {theory.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-normal text-[var(--ink)] heading-tight">
                      {theory.name}
                    </h3>

                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(20,20,22,0.06)] text-xs">
                      <span className="text-[var(--soft)]">Bayesian Posteriori</span>
                      <span className="font-medium text-sm text-[var(--ink)]">
                        {Math.round(theory.probability * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-2 card-panel p-6 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-5">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
                    Active Formulation Inspection
                  </span>
                  <h2 className="text-2xl font-normal text-[var(--ink)] mt-1 heading-tight">
                    {selectedTheory?.name}
                  </h2>
                  <p className="text-xs text-[var(--soft)] mt-1.5 leading-relaxed max-w-xl">
                    {selectedTheory?.corePremise}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full border-2 border-[#141416] grid place-items-center text-lg font-medium text-[var(--ink)] shrink-0 bg-white">
                  {selectedTheory ? Math.round((selectedTheory.probability ?? 0) * 100) : 0}%
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/cases/${caseId}/graph`}
                  className="px-3.5 py-2 rounded-full border border-[rgba(20,20,22,0.14)] bg-white text-xs text-[var(--ink)] hover:border-[#141416] flex items-center gap-1.5 no-underline"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Highlight in Graph</span>
                </Link>

                <Link
                  href={`/cases/${caseId}/map`}
                  className="px-3.5 py-2 rounded-full border border-[rgba(20,20,22,0.14)] bg-white text-xs text-[var(--ink)] hover:border-[#141416] flex items-center gap-1.5 no-underline"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Replay on Map</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    if (!allLinksConfirmed) {
                      addToast({
                        type: 'error',
                        title: 'Action Blocked',
                        message: 'All constituent evidentiary links must be confirmed before reconstruction admission.',
                      });
                      return;
                    }
                    addToast({
                      type: 'success',
                      title: 'Theory Admitted to Case Reconstruction',
                      message: `${selectedTheory?.name} promoted to primary Section 63(4) court dossier.`,
                    });
                  }}
                  className="px-4 py-2 rounded-full border border-[#141416] bg-[#141416] text-[#F7F4EE] hover:opacity-90 transition-opacity text-xs font-medium"
                >
                  Add to Reconstruction
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
                    Mathematical Score Breakdown (Posteriori Drivers)
                  </span>
                  <span className="text-[10px] text-[var(--soft)]">Log-Likelihood Attribution</span>
                </div>
                <div className="divide-y divide-[rgba(20,20,22,0.06)] rounded-xl border border-[rgba(20,20,22,0.08)] bg-white p-3 space-y-2 text-xs">
                  {(selectedTheory?.scoreBreakdown || []).map((sb) => {
                    const isPositive = sb.delta > 0;
                    return (
                      <div key={sb.linkId} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-medium text-[var(--ink)] block">{sb.label}</span>
                          <span className="text-[11px] text-[var(--soft)] block">{sb.reason}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-600/20'
                              : 'bg-red-50 text-red-800 border border-red-600/20'
                          }`}
                        >
                          {isPositive ? `+${sb.delta}` : `${sb.delta}`} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">
                  Ordered Event Sequence (Hypothesis Trajectory)
                </span>
                <div className="space-y-2">
                  {(selectedTheory?.eventSequence || []).map((seq, idx) => (
                    <div
                      key={seq.id}
                      className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#141416] text-white grid place-items-center text-[10px] shrink-0 font-medium">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-medium text-[var(--ink)] block">{seq.title}</span>
                          <span className="text-[10px] text-[var(--soft)] uppercase">{seq.lane} Lane</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-[var(--soft)] shrink-0 font-mono">{seq.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-[var(--ink)] font-medium uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Isolated Feasibility Conflicts & Contradictions</span>
                </div>
                <div className="space-y-2">
                  {(selectedTheory?.conflictsBlock || []).map((conf) => (
                    <div
                      key={conf.id}
                      className="p-4 rounded-xl border border-[rgba(20,20,22,0.12)] bg-white space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[var(--ink)]">{conf.title}</span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded border border-[rgba(20,20,22,0.14)] text-[var(--ink)] bg-[#F7F4EE]">
                          {conf.type}
                        </span>
                      </div>
                      <p className="text-[var(--soft)] leading-relaxed text-[11px]">{conf.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white space-y-1 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">
                  Strict Falsification Condition (Popperian Criterion)
                </span>
                <p className="text-[var(--ink)] leading-relaxed text-xs">
                  {selectedTheory?.falsificationCondition}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white text-xs flex items-center justify-between text-[var(--soft)]">
              <span>Comparing 2 competing formulations side-by-side. Differing links and hypotheses highlighted with an accent border.</span>
              <span className="px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] bg-[#F7F4EE]">
                Diff Highlight Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-panel p-6 space-y-4">
                <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Hypothesis A</span>
                  <select
                    value={compareTheoryA?.id}
                    onChange={(e) => {
                      const t = theories.find((x) => x.id === e.target.value);
                      if (t) setCompareTheoryA(t);
                    }}
                    className="p-1.5 rounded-lg border border-[rgba(20,20,22,0.14)] bg-white text-xs text-[var(--ink)]"
                  >
                    {theories.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-sm font-medium text-[var(--ink)]">
                    <span>{compareTheoryA?.name}</span>
                    <span className="text-base">{compareTheoryA ? Math.round((compareTheoryA.probability ?? 0) * 100) : 0}%</span>
                  </div>
                  <p className="text-[var(--soft)] leading-relaxed">{compareTheoryA?.corePremise}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[rgba(20,20,22,0.06)] text-xs">
                  <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Key Evidence Matches & Differing Links</span>
                  {compareTheoryA?.corroboratingEvidence.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[rgba(20,20,22,0.1)] bg-white/70"
                    >
                      <span className="font-medium text-[var(--ink)] block">{c.point}</span>
                      <div className="flex justify-between text-[11px] text-[var(--soft)] mt-1">
                        <span>Source: {c.source}</span>
                        <span className="font-medium text-[var(--ink)]">{c.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-panel p-6 space-y-4">
                <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Hypothesis B</span>
                  <select
                    value={compareTheoryB?.id}
                    onChange={(e) => {
                      const t = theories.find((x) => x.id === e.target.value);
                      if (t) setCompareTheoryB(t);
                    }}
                    className="p-1.5 rounded-lg border border-[rgba(20,20,22,0.14)] bg-white text-xs text-[var(--ink)]"
                  >
                    {theories.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-sm font-medium text-[var(--ink)]">
                    <span>{compareTheoryB?.name}</span>
                    <span className="text-base">{compareTheoryB ? Math.round((compareTheoryB.probability ?? 0) * 100) : 0}%</span>
                  </div>
                  <p className="text-[var(--soft)] leading-relaxed">{compareTheoryB?.corePremise}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[rgba(20,20,22,0.06)] text-xs">
                  <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Key Evidence Matches & Differing Links</span>
                  {compareTheoryB?.corroboratingEvidence.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[rgba(20,20,22,0.14)] bg-white/90"
                    >
                      <span className="font-medium text-[var(--ink)] block">{c.point}</span>
                      <div className="flex justify-between text-[11px] text-[var(--soft)] mt-1">
                        <span>Source: {c.source}</span>
                        <span className="font-medium text-[var(--ink)]">{c.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="card-panel p-6 sm:p-8 space-y-6">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-4 flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Investigation Completeness</span>
                <h3 className="text-xl font-normal text-[var(--ink)] heading-tight">
                  Identified Evidentiary Gaps & Subpoena Targets
                </h3>
              </div>
              <span className="text-xs text-[var(--soft)]">
                {gaps.filter((g) => g.requested).length} of {gaps.length} Requisitioned
              </span>
            </div>

            <div className="divide-y divide-[rgba(20,20,22,0.06)]">
              {gaps.map((gap) => {
                const dotsCount = gap.severityLevel || (gap.severity === 'critical' ? 3 : gap.severity === 'high' ? 2 : 1);

                return (
                  <div
                    key={gap.id}
                    className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="flex items-center gap-1" title={`Severity ${dotsCount}/3`}>
                          {[1, 2, 3].map((dot) => (
                            <span
                              key={dot}
                              className={`w-2 h-2 rounded-full ${
                                dot <= dotsCount ? 'bg-[#141416]' : 'bg-black/15'
                              }`}
                            />
                          ))}
                        </div>

                        <span className="font-medium text-sm text-[var(--ink)]">{gap.title}</span>
                        <span className="px-2 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] uppercase bg-white">
                          {gap.severity}
                        </span>
                        <span className="text-[11px] text-emerald-800 font-medium">
                          +{gap.expectedScoreGain}% Expected Score Gain
                        </span>
                      </div>

                      <p className="text-[var(--soft)] leading-relaxed text-xs">
                        {gap.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-[var(--soft)]">
                        <span className="p-1 rounded bg-black/5 text-[var(--ink)]">
                          {getSourceIcon(gap.suggestedSourceIcon || 'cloud')}
                        </span>
                        <span>
                          Suggested Requisition: <strong className="text-[var(--ink)] font-medium">{gap.suggestedSource}</strong>
                        </span>
                      </div>

                      {gap.relatedEntities && gap.relatedEntities.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-[var(--soft)] uppercase">Related Entities:</span>
                          {gap.relatedEntities.map((ent) => (
                            <span key={ent} className="px-2 py-0.5 rounded bg-[#F7F4EE] border border-[rgba(20,20,22,0.08)] text-[10px] text-[var(--ink)]">
                              {ent}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleGap(gap.id)}
                      className={`px-4 py-2 rounded-full border text-xs font-medium transition-colors shrink-0 ${
                        gap.requested
                          ? 'border-emerald-600/30 text-emerald-800 bg-emerald-50'
                          : 'border-[#141416] bg-[#141416] text-[#F7F4EE] hover:opacity-90'
                      }`}
                    >
                      {gap.requested ? 'Section 91 Notice Active' : 'Mark as Requested'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CaseShell>
  );
}
