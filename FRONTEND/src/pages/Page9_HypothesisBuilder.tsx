'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { TheoryModel } from '../types/forensics';
import { fetchHypotheses } from '../api/backendClient';

export const THEORIES: TheoryModel[] = [];

export default function Page9_HypothesisBuilder() {
  const [theories, setTheories] = useState<TheoryModel[]>([]);
  const [selectedTheory, setSelectedTheory] = useState<TheoryModel | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchHypotheses('case-001').then((res) => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setTheories(res);
        setSelectedTheory(res[0]);
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
            Hypothesis & Theory Builder
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            Construct and test competing prosecution versus defense theories. Every piece of
            evidence mathematically adjusts Bayesian confidence scores, exposing corroborations and
            falsifications.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white flex items-center gap-2.5 text-xs shrink-0 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[var(--ink)] font-medium">Theory Alpha Dominant ({((theories[0]?.probability || 0.88) * 100).toFixed(1)}%)</span>
        </div>
      </div>

      {theories.length === 0 ? (
        <div className="card-panel p-12 text-center text-[var(--soft)] space-y-2">
          <p className="text-sm font-medium text-[var(--ink)]">
            No competing hypotheses synthesized yet.
          </p>
          <p className="text-xs">
            Run the pipeline on Page 1 to generate scored competing hypotheses based on ingested forensic evidence.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {theories.map((th, idx) => {
            const isSelected = selectedTheory?.id === th.id;
            return (
              <div
                key={th.id}
                onClick={() => setSelectedTheory(th)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#141416] bg-white shadow-xs'
                    : 'border-[rgba(20,20,22,0.1)] bg-white/60 hover:bg-white hover:border-[rgba(20,20,22,0.22)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="tag-num">/ 0{idx + 1} {th.tag}</span>
                  <span className="text-xs font-medium text-[var(--ink)]">
                    {Math.round(th.probability * 100)}% Likelihood
                  </span>
                </div>
                <h3 className="text-base font-normal text-[var(--ink)] heading-tight">{th.name}</h3>
                <p className="text-xs text-[var(--soft)] mt-2 line-clamp-2 leading-relaxed">
                  {th.corePremise}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {selectedTheory && (
      <div className="card-panel p-6 md:p-8 space-y-6 relative">
        <div className="border-b border-[rgba(20,20,22,0.08)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[var(--soft)]">
              Theory Evaluation Model
            </span>
            <h3 className="text-2xl font-normal text-[var(--ink)] mt-1 heading-tight">
              {selectedTheory.name}
            </h3>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs border border-[rgba(20,20,22,0.14)] text-[var(--ink)] bg-white">
            Bayesian Probability: {Math.round(selectedTheory.probability * 100)}%
          </span>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/80">
          <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block mb-1">
            Core Investigatory Premise
          </span>
          <p className="text-xs text-[var(--ink)] leading-relaxed">
            {selectedTheory.corePremise}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--soft)]">
              Corroborating Evidentiary Points ({selectedTheory.corroboratingEvidence.length})
            </h4>

            <div className="space-y-2">
              {selectedTheory.corroboratingEvidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center text-[11px] text-[var(--soft)] mb-0.5">
                    <span>{ev.source}</span>
                    <span className="text-[var(--soft)]">Supporting Trace</span>
                  </div>
                  <p className="text-[var(--ink)] leading-relaxed font-normal">{ev.point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--soft)]">
              Refuting Evidentiary Points ({selectedTheory.refutingEvidence.length})
            </h4>

            <div className="space-y-2">
              {selectedTheory.refutingEvidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center text-[11px] text-[var(--soft)] mb-0.5">
                    <span>{ev.source}</span>
                    <span className="text-[var(--soft)]">Counter Trace</span>
                  </div>
                  <p className="text-[var(--ink)] leading-relaxed font-normal">{ev.point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/80 space-y-1 text-xs">
          <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">
            Falsification Criterion (Karl Popper Standard)
          </span>
          <p className="text-[var(--ink)] leading-relaxed">
            {selectedTheory.falsificationCondition}
          </p>
        </div>
      </div>
      )}
    </div>
  );
}
