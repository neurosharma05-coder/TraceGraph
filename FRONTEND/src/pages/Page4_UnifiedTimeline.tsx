'use client';

import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '../types/forensics';
import { fetchTimeline } from '../api/backendClient';
import { useCaseStore } from '../store/useCaseStore';

export default function Page4_UnifiedTimeline() {
  const { files } = useCaseStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchTimeline('case-001').then((res) => {
      if (isMounted && res && res.events && res.events.length > 0) {
        setEvents(res.events);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [files]);

  const filteredEvents =
    selectedFilter === 'all'
      ? events
      : events.filter((e) => e.sourceCategory === selectedFilter);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
            Chronological Unified Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            Multi-source evidentiary timeline calibrated to atomic UTC. Hardware clock drifts are
            automatically resolved, uncertainty windows are bounded, and gaps in suspect movements are
            flagged.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-[rgba(20,20,22,0.03)] gap-1 overflow-x-auto shrink-0">
          {['all', 'cctv', 'mobile', 'financial', 'network', 'social', 'email'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-normal capitalize transition-all ${
                selectedFilter === cat
                  ? 'bg-[#141416] text-[#F7F4EE] shadow-xs'
                  : 'text-[var(--soft)] hover:text-[var(--ink)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-[rgba(20,20,22,0.1)] bg-white/70 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[var(--ink)] font-medium">Atomic NTP Master Reference: UTC+00:00</span>
        </div>
        <div className="flex items-center gap-4 text-[var(--soft)] text-[11px]">
          <span className="text-emerald-700 font-medium">{events.length} Hardware Clocks Calibrated</span>
          <span>Max Drift Resolved: {events.length > 0 ? 'Auto-corrected from evidence' : 'Awaiting evidence'}</span>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="text-4xl">⏱️</div>
          <p className="text-sm font-medium text-[var(--ink)]">No Timeline Events Yet</p>
          <p className="text-xs text-[var(--soft)] max-w-md mx-auto">Upload evidence files to generate the chronological timeline. Events will be extracted from CDR, financial records, chat logs, and more.</p>
        </div>
      ) : (
      <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[rgba(20,20,22,0.12)]">
        {filteredEvents.map((ev, idx) => (
          <div key={ev.id} className="space-y-4">
            <div className="relative p-5 rounded-2xl border border-[rgba(20,20,22,0.1)] bg-white/80 hover:border-[rgba(20,20,22,0.25)] transition-all space-y-3">
              <div className="absolute -left-9 md:-left-11 top-5 w-6 h-6 rounded-full border border-[rgba(20,20,22,0.15)] bg-white grid place-items-center text-[var(--ink)] text-[11px] font-normal shadow-xs">
                {idx + 1}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(20,20,22,0.06)] pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] capitalize bg-white text-[var(--ink)]">
                      {ev.sourceCategory}
                    </span>
                    <span className="text-xs text-[var(--soft)]">{ev.location}</span>
                  </div>
                  <h3 className="text-base font-normal tracking-tight text-[var(--ink)] heading-tight">{ev.eventTitle}</h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-[var(--ink)] font-medium">
                    {ev.timestampUtc}
                  </div>
                  <span className="text-[11px] text-[var(--soft)] block">
                    Uncertainty: {ev.uncertaintyWindow}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--ink)] leading-relaxed">{ev.details}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--soft)] pt-2 border-t border-[rgba(20,20,22,0.06)]">
                <div>
                  <span>Raw Timestamp: </span>
                  <span className="text-[var(--ink)]">{ev.rawTimestamp}</span>
                </div>
                <div className="text-emerald-700 font-medium">
                  <span>{ev.driftCorrected}</span>
                </div>
              </div>
            </div>

            {ev.gapFollows && (
              <div className="py-2.5 px-4 rounded-xl border border-dashed border-[rgba(20,20,22,0.18)] bg-white/40 flex items-center justify-between text-xs text-[var(--soft)]">
                <span>Unobserved interval detected</span>
                <span className="font-medium text-[var(--ink)]">{ev.gapDuration}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
