'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { ConflictItem } from '../types/forensics';
import { fetchConflicts } from '../api/backendClient';

export default function Page6_ConflictEngine() {
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchConflicts('case-001').then((res) => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setConflicts(res);
        setSelectedConflict(res[0]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleResolveConflict = (id: string, theoryTitle: string) => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'resolved',
              resolutionNote: `Resolved by investigator: Adopted ${theoryTitle}`,
            }
          : c
      )
    );
    if (selectedConflict && selectedConflict.id === id) {
      setSelectedConflict((prev) => prev ? ({
        ...prev,
        status: 'resolved',
        resolutionNote: `Resolved by investigator: Adopted ${theoryTitle}`,
      }) : prev);
    }
  };

  const flaggedCount = conflicts.filter((c) => c.status === 'flagged').length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
            Feasibility & Conflict Engine
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            TraceGraph evaluates spatio-temporal trajectories against physical constraints.
            Impossible movements across locations trigger conflict flags and ranked hypotheses.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white flex items-center gap-2.5 text-xs shrink-0 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
          <span className="text-[var(--ink)] font-medium">{flaggedCount} Active Conflicts Flagged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-wider text-[var(--soft)] block">
            Detected Anomaly Incidents ({conflicts.length})
          </span>

          {conflicts.map((c, idx) => {
            const isSelected = selectedConflict?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedConflict(c)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#141416] bg-white shadow-xs'
                    : 'border-[rgba(20,20,22,0.1)] bg-white/60 hover:bg-white hover:border-[rgba(20,20,22,0.22)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="tag-num">/ 0{idx + 1}</span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                      c.status === 'resolved'
                        ? 'border-emerald-600/20 text-emerald-700 bg-emerald-50'
                        : 'border-[rgba(20,20,22,0.14)] text-[var(--ink)] bg-white'
                    }`}
                  >
                    {c.status === 'resolved' ? 'Resolved' : 'Velocity Conflict'}
                  </span>
                </div>

                <h4 className="text-sm font-medium text-[var(--ink)] heading-tight">{c.title}</h4>
                <div className="mt-2 text-xs text-[var(--soft)]">
                  Required Speed: {c.requiredVelocityKmh} km/h (Jet benchmark: ~850 km/h)
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2 card-panel p-5 sm:p-6 space-y-6">
          {!selectedConflict ? (
            <div className="flex items-center justify-center h-full min-h-[300px] text-xs text-[var(--soft)]">
              Select a conflict from the list to view analysis.
            </div>
          ) : (<>
          <div className="border-b border-[rgba(20,20,22,0.08)] pb-4">
            <span className="text-[11px] uppercase tracking-wider text-[var(--soft)]">
              Conflict Analysis
            </span>
            <h3 className="text-xl font-normal text-[var(--ink)] mt-1 heading-tight">
              {selectedConflict.title}
            </h3>
            {selectedConflict.resolutionNote && (
              <span className="inline-block px-3 py-1 rounded-full text-xs text-[var(--ink)] border border-[rgba(20,20,22,0.14)] bg-white mt-2">
                {selectedConflict.resolutionNote}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/80 space-y-2">
              <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">
                Origin Event (Event A)
              </span>
              <h4 className="text-sm font-medium text-[var(--ink)]">
                {selectedConflict.eventA.label}
              </h4>
              <div className="text-xs text-[var(--soft)] space-y-1">
                <div>Location: <span className="text-[var(--ink)]">{selectedConflict.eventA.location}</span></div>
                <div>Time: <span className="text-[var(--ink)]">{selectedConflict.eventA.time}</span></div>
                <div>Source: <span className="text-[var(--ink)]">{selectedConflict.eventA.source}</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/80 space-y-2">
              <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">
                Destination Event (Event B)
              </span>
              <h4 className="text-sm font-medium text-[var(--ink)]">
                {selectedConflict.eventB.label}
              </h4>
              <div className="text-xs text-[var(--soft)] space-y-1">
                <div>Location: <span className="text-[var(--ink)]">{selectedConflict.eventB.location}</span></div>
                <div>Time: <span className="text-[var(--ink)]">{selectedConflict.eventB.time}</span></div>
                <div>Source: <span className="text-[var(--ink)]">{selectedConflict.eventB.source}</span></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.12)] bg-white/70 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[var(--ink)]">
              <span className="font-medium">
                Physical Inconsistency Analysis
              </span>
              <span className="text-[var(--soft)]">Velocity: v = d / Δt</span>
            </div>
            <p className="text-[var(--ink)] leading-relaxed">
              Between {selectedConflict.eventA.time} and {selectedConflict.eventB.time} (elapsed
              window of <strong>{selectedConflict.timeDiffMinutes} minutes</strong>
              ), the geographic distance between {selectedConflict.eventA.location} and{' '}
              {selectedConflict.eventB.location} is{' '}
              <strong>{selectedConflict.distanceKm} kilometers</strong>. This
              would require a sustained speed of{' '}
              <strong>
                {selectedConflict.requiredVelocityKmh} km/h
              </strong>
              , which is physically impossible for a single individual without commercial flight logs.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-[rgba(20,20,22,0.08)]">
            <span className="text-xs uppercase tracking-wider text-[var(--soft)] block">
              Ranked Competing Hypotheses
            </span>

            {selectedConflict.competingHypotheses.map((hyp) => (
              <div
                key={hyp.id}
                className="p-4 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-[var(--ink)]">{hyp.title}</h5>
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.14)] text-[var(--ink)] bg-white">
                    {Math.round(hyp.probability * 100)}% Probability
                  </span>
                </div>
                <p className="text-xs text-[var(--soft)] leading-relaxed">{hyp.explanation}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleResolveConflict(selectedConflict.id, hyp.title)}
                    className="btn"
                  >
                    <b>›</b>
                    <span>Adopt Hypothesis</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
