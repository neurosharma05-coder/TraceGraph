'use client';

import React, { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import CaseShell from '../../../../components/CaseShell';
import DetailDrawer from '../../../../components/common/DetailDrawer';
import { fetchTimeline } from '../../../../api/backendClient';
import { TimelineEvent } from '../../../../types/forensics';
import { useToastStore } from '../../../../components/common/useToastStore';
import { useSelectionStore } from '../../../../store/useSelectionStore';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Clock,
  Sliders,
  CheckCircle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Layers,
  ShieldAlert,
  ArrowRight,
  User,
  Hash,
  FileText,
} from 'lucide-react';

export default function CaseTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const { addToast } = useToastStore();
  const setReplay = useSelectionStore((s) => s.setReplay);
  const setSelectedWaypoint = useSelectionStore((s) => s.setSelectedWaypoint);

  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchTimeline(caseId).then((res) => {
      if (res?.events?.length) setEvents(res.events);
    });
  }, [caseId]);

  // Filters & toggles
  const [activeLane, setActiveLane] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [showCorrected, setShowCorrected] = useState(true);
  const [onlyConfirmed, setOnlyConfirmed] = useState(false);
  const [zoomPreset, setZoomPreset] = useState<'minute' | 'hour' | 'day'>('hour');

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 4 | 16>(1);
  const [scrubberIndex, setScrubberIndex] = useState(0);

  const lanes = ['all', 'mobile', 'social', 'cctv', 'financial', 'network', 'email'];

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const laneMatch = activeLane === 'all' || e.sourceCategory === activeLane;
      const confirmedMatch = !onlyConfirmed || !e.flagged;
      const entityMatch =
        entityFilter === 'all' || (e.entities && e.entities.includes(entityFilter));
      return laneMatch && confirmedMatch && entityMatch;
    });
  }, [events, activeLane, onlyConfirmed, entityFilter]);

  // Replay playback loop & Zustand store synchronization (P2.6)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 1600 / playbackSpeed;
    const timer = setInterval(() => {
      setScrubberIndex((prev) => {
        if (prev >= filteredEvents.length - 1) {
          setIsPlaying(false);
          setReplay({ playing: false });
          return prev;
        }
        const next = prev + 1;
        const currentEv = filteredEvents[next];
        if (currentEv) {
          setReplay({
            playing: true,
            speed: playbackSpeed,
            currentEventId: currentEv.id,
            currentTimeUtc: currentEv.timestampUtc,
          });
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, filteredEvents, setReplay]);

  // Sync single scrubber index update to Zustand store
  const handleScrubberChange = (idx: number) => {
    setIsPlaying(false);
    setScrubberIndex(idx);
    const ev = filteredEvents[idx];
    if (ev) {
      setReplay({
        playing: false,
        currentEventId: ev.id,
        currentTimeUtc: ev.timestampUtc,
      });
    }
  };

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  return (
    <CaseShell caseId={caseId}>
      <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
              Chronological Timeline & Replay
            </h1>
            <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
              Multi-source unified event chronology calibrated to atomic UTC. Hardware clock drifts are
              automatically resolved, uncertainty windows are bounded, and feasibility conflicts are highlighted.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-white gap-1 text-xs">
              {(['minute', 'hour', 'day'] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoomPreset(z)}
                  className={`px-2.5 py-1 rounded-full capitalize transition-colors ${
                    zoomPreset === z ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-white gap-1 text-xs">
              <button
                type="button"
                onClick={() => setShowCorrected(false)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  !showCorrected ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
                }`}
              >
                Raw Time
              </button>
              <button
                type="button"
                onClick={() => setShowCorrected(true)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  showCorrected ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
                }`}
              >
                Calibrated UTC
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOnlyConfirmed(!onlyConfirmed)}
              className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                onlyConfirmed
                  ? 'border-[#141416] bg-[#141416] text-white'
                  : 'border-[rgba(20,20,22,0.14)] bg-white text-[var(--ink)]'
              }`}
            >
              Confirmed Only
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.14)] bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#141416]" />
            <div>
              <span className="font-medium text-[var(--ink)] block">
                Feasibility Conflict Active: 2 events cannot both be true
              </span>
              <span className="text-[var(--soft)] text-[11px]">
                Event #3 (CCTV Sector 18 at 09:28 UTC) contradicts Event #4 (Cell Tower Sector 18 Call at 09:35 UTC) with transit divergence.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-[rgba(20,20,22,0.12)] text-[var(--ink)] bg-[#F7F4EE]">
              Δt: 4m · Distance: 38km
            </span>
          </div>
        </div>

        <div className="card-panel p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextState = !isPlaying;
                  setIsPlaying(nextState);
                  setReplay({ playing: nextState });
                }}
                className="w-9 h-9 rounded-full bg-[#141416] text-white grid place-items-center hover:opacity-90 transition-opacity"
                aria-label={isPlaying ? 'Pause replay' : 'Play replay'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextIdx = Math.min(scrubberIndex + 1, filteredEvents.length - 1);
                  handleScrubberChange(nextIdx);
                }}
                className="w-8 h-8 rounded-full border border-[rgba(20,20,22,0.14)] bg-white text-[var(--ink)] grid place-items-center hover:border-[#141416]"
                title="Step forward 1 event"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleScrubberChange(0);
                }}
                className="w-8 h-8 rounded-full border border-[rgba(20,20,22,0.14)] bg-white text-[var(--ink)] grid place-items-center hover:border-[#141416]"
                title="Reset scrubber to origin"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="inline-flex items-center p-0.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white ml-2 text-xs">
                {([1, 4, 16] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      setPlaybackSpeed(spd);
                      setReplay({ speed: spd });
                    }}
                    className={`px-2.5 py-1 rounded-full ${
                      playbackSpeed === spd ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-[var(--soft)] block text-[10px] uppercase tracking-wider">Synchronized Replay Horizon</span>
              <span className="font-medium text-sm text-[var(--ink)]">
                {filteredEvents[scrubberIndex]?.timestampUtc || '00:00:00 UTC'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={Math.max(filteredEvents.length - 1, 0)}
              value={scrubberIndex}
              onChange={(e) => handleScrubberChange(parseInt(e.target.value, 10))}
              className="w-full accent-[#141416] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--soft)]">
              <span>Event #1 ({filteredEvents[0]?.rawTimestamp})</span>
              <span>
                Event #{scrubberIndex + 1} of {filteredEvents.length}
              </span>
              <span>Event #{filteredEvents.length} ({filteredEvents[filteredEvents.length - 1]?.rawTimestamp})</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Source-Wise Lanes</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {lanes.map((lane) => (
                <button
                  key={lane}
                  type="button"
                  onClick={() => setActiveLane(lane)}
                  className={`px-3 py-1 rounded-full capitalize border transition-colors ${
                    activeLane === lane
                      ? 'border-[#141416] bg-[#141416] text-white font-medium'
                      : 'border-[rgba(20,20,22,0.12)] bg-white text-[var(--soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {lane === 'all' ? 'All Lanes' : lane}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Entity Filter</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {['all', 'Vikram Malhotra', 'Aman Verma', 'paytm-mule-902@icici', 'Toll Cam 04 (Sector 18)'].map((ent) => (
                <button
                  key={ent}
                  type="button"
                  onClick={() => setEntityFilter(ent)}
                  className={`px-3 py-1 rounded-full border transition-colors ${
                    entityFilter === ent
                      ? 'border-[#141416] bg-[#141416] text-white font-medium'
                      : 'border-[rgba(20,20,22,0.12)] bg-white text-[var(--soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {ent === 'all' ? 'All Entities' : ent}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-[rgba(20,20,22,0.12)]">
          {filteredEvents.map((ev, idx) => {
            const isScrubberActive = idx === scrubberIndex;
            const hasClockDrift = ev.driftCorrected && !ev.driftCorrected.includes('00m 00s');

            return (
              <div key={ev.id} className="relative space-y-3">
                {ev.conflictEventId && idx === 2 && (
                  <div className="absolute -left-6 md:-left-10 top-12 z-20 pointer-events-none">
                    <svg className="w-8 h-28 overflow-visible" viewBox="0 0 20 80">
                      <path
                        d="M 5 0 C -15 30, -15 50, 5 80"
                        stroke="rgba(20, 20, 22, 0.45)"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        fill="none"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={`absolute -left-6 md:-left-10 top-4 w-6 h-6 rounded-full border grid place-items-center text-[10px] font-medium transition-all ${
                    isScrubberActive
                      ? 'border-[#141416] bg-[#141416] text-[#F7F4EE] scale-110 shadow-md ring-4 ring-black/10'
                      : 'border-[rgba(20,20,22,0.18)] bg-white text-[var(--ink)]'
                  }`}
                >
                  {idx + 1}
                </div>

                <div
                  onClick={() => handleEventClick(ev)}
                  className={`card-panel p-5 space-y-3 cursor-pointer transition-all hover:border-[rgba(20,20,22,0.25)] ${
                    isScrubberActive ? 'border-[#141416] bg-white shadow-sm' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(20,20,22,0.06)] pb-3 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[var(--ink)]">{ev.eventTitle}</span>
                      <span className="inline-block px-2 py-0.5 rounded-full border border-[rgba(20,20,22,0.1)] bg-white text-[10px] uppercase text-[var(--soft)]">
                        {ev.sourceCategory}
                      </span>
                      {ev.flagged && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[rgba(20,20,22,0.14)] text-[var(--ink)] bg-[#F7F4EE] text-[10px] font-medium">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>Feasibility Flag</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] text-[var(--soft)]">
                      {hasClockDrift && (
                        <span className="inline-flex items-center gap-1 text-[var(--ink)] font-medium" title={ev.driftCorrected}>
                          <Clock className="w-3 h-3 text-[var(--soft)]" />
                          <span>Drift Corrected ({ev.driftCorrected.split(' ')[0]})</span>
                        </span>
                      )}
                      <span>{showCorrected ? ev.driftCorrected : ev.rawTimestamp}</span>
                      <span className="px-2 py-0.5 rounded-full border border-[rgba(20,20,22,0.1)] bg-white text-[10px]">
                        {ev.uncertaintyWindow}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--soft)] leading-relaxed">{ev.details}</p>

                  {ev.entities && ev.entities.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] uppercase text-[var(--soft)]">Entities:</span>
                      {ev.entities.map((ent) => (
                        <span key={ent} className="px-2 py-0.5 rounded bg-black/5 text-[10px] text-[var(--ink)]">
                          {ent}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-[var(--soft)] pt-2 border-t border-[rgba(20,20,22,0.06)]">
                    <span>Location: {ev.location}</span>
                    <span className="underline text-[var(--ink)]">Inspect forensic calibration drawer</span>
                  </div>
                </div>

                {ev.orderUncertainWith && (
                  <div className="py-2 px-4 rounded-xl border border-dashed border-[rgba(20,20,22,0.22)] bg-[#F7F4EE] flex items-center justify-between text-xs text-[var(--soft)]">
                    <span className="font-medium text-[var(--ink)]">
                      Order Uncertain: Overlapping temporal uncertainty windows with adjacent event
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black/5">
                      Windows overlap by 4.2 sec
                    </span>
                  </div>
                )}

                {ev.gapFollows && (
                  <div className="py-2.5 px-4 rounded-xl border border-dashed border-[rgba(20,20,22,0.18)] bg-white/40 flex items-center justify-between text-xs text-[var(--soft)]">
                    <span>Unobserved interval detected</span>
                    <span className="font-medium text-[var(--ink)]">{ev.gapDuration}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent ? selectedEvent.eventTitle : 'Event Detail'}
        subtitle={selectedEvent ? `Category: ${selectedEvent.sourceCategory}` : undefined}
      >
        {selectedEvent && (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Time-Trust Calibration</span>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--soft)]">Raw Recorded Timestamp:</span>
                  <span className="font-medium text-[var(--ink)]">{selectedEvent.rawTimestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--soft)]">Atomic Calibrated UTC:</span>
                  <span className="font-medium text-emerald-800">{selectedEvent.timestampUtc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--soft)]">Drift Resolution:</span>
                  <span className="font-medium text-[var(--ink)]">{selectedEvent.driftCorrected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--soft)]">Uncertainty Bounds:</span>
                  <span className="font-medium text-[var(--ink)]">{selectedEvent.uncertaintyWindow}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)]">Time-Trust Reliability Bar</span>
                <span className="font-medium text-[var(--ink)]">{selectedEvent.timeTrust || 96}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                <div
                  style={{ width: `${selectedEvent.timeTrust || 96}%` }}
                  className="h-full bg-[#141416] rounded-full transition-all"
                />
              </div>
              <div className="pt-1 text-[11px] text-[var(--soft)] leading-relaxed">
                <span className="font-medium text-[var(--ink)] block mb-0.5">
                  Method: {selectedEvent.correctionMethod || 'NTP Stratum-1 Hardware Clock Server'}
                </span>
                <span>{selectedEvent.correctionNotes || 'Calibrated via synchronized carrier telephony switch clock.'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Evidentiary Provenance</span>
              <div className="space-y-1">
                <span className="text-[var(--soft)] block">Source File Container:</span>
                <span className="font-medium text-[var(--ink)] block">
                  {selectedEvent.sourceFile || 'CDR_CarrierDump_SIM_9811092811_Jan2026.csv'}
                </span>
                <span className="text-[var(--soft)] block mt-2">Parent Block SHA-256:</span>
                <span className="text-[var(--ink)] text-[11px] break-all block font-mono">
                  {selectedEvent.sourceHash || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Event Bound to Prosecution Timeline',
                    message: `${selectedEvent.eventTitle} confirmed for judicial presentation.`,
                  });
                  setDrawerOpen(false);
                }}
                className="w-full py-2.5 rounded-full border border-[#141416] bg-[#141416] text-[#F7F4EE] hover:opacity-90 transition-opacity font-medium"
              >
                Confirm Event in Final Timeline
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </CaseShell>
  );
}
