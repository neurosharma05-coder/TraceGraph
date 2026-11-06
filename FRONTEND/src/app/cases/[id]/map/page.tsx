'use client';

import React, { useState, useEffect, use } from 'react';
import dynamic from 'next/dynamic';
import CaseShell from '../../../../components/CaseShell';
import { fetchWaypoints } from '../../../../api/backendClient';
import { GeoWaypoint } from '../../../../types/forensics';
import { useSelectionStore } from '../../../../store/useSelectionStore';
import { MapPin, Navigation, AlertTriangle, Eye, Video, Radio, Layers } from 'lucide-react';

const LeafletMap = dynamic(() => import('../../../../components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[520px] rounded-xl bg-[#141416] border border-[rgba(243,241,236,0.15)] grid place-items-center text-xs text-[#a1a1aa]">
      Initializing CartoDB Dark Matter GIS Map Engine...
    </div>
  ),
});

export default function CaseMapPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;

  const [waypoints, setWaypoints] = useState<GeoWaypoint[]>([]);
  const selectedWaypoint = useSelectionStore((s) => s.selectedWaypoint);
  const setSelectedWaypoint = useSelectionStore((s) => s.setSelectedWaypoint);
  const currentEventId = useSelectionStore((s) => s.replay.currentEventId);
  const [timeSliderVal, setTimeSliderVal] = useState(100);

  useEffect(() => {
    fetchWaypoints(caseId).then((res) => {
      if (res && Array.isArray(res) && res.length > 0) {
        setWaypoints(res);
        setSelectedWaypoint(res[0]);
      }
    });
  }, [caseId, setSelectedWaypoint]);

  // Sync replay state from Timeline (P2.6)
  React.useEffect(() => {
    if (!currentEventId) return;
    let target = null;
    if (currentEventId === 'ev_1') target = waypoints[0];
    else if (currentEventId === 'ev_3') target = waypoints[1];
    else if (currentEventId === 'ev_4') target = waypoints[2];
    else if (currentEventId === 'ev_6') target = waypoints[3];
    if (target && target.id !== selectedWaypoint?.id) {
      setSelectedWaypoint(target);
    }
  }, [currentEventId, waypoints, selectedWaypoint?.id, setSelectedWaypoint]);

  const activeWaypoint: GeoWaypoint = selectedWaypoint || waypoints[0] || {
    id: 'wp_active',
    name: 'Sector-18 Toll ANPR Camera',
    time: '09:28:12 UTC',
    type: 'cctv',
    lat: 28.5708,
    lng: 77.3261,
    uncertaintyRadius: '150m',
    source: 'National Highway Authority ANPR Feed',
    description: 'Vehicle DL-3C-AZ-9912 optical identification coordinate.',
  };

  return (
    <CaseShell caseId={caseId}>
      <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
              Geospatial Corridor & Travel Feasibility
            </h1>
            <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
              CartoDB vector map charting ANPR highway cameras, cell tower coverage perimeters, and physical
              cash drop waypoints. Highlights impossible physical trajectories across time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white text-xs font-medium text-[var(--ink)] shadow-xs">
              4 Physical Waypoints Calibrated
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.14)] bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#141416]" />
            <div>
              <span className="font-medium text-[var(--ink)] block">
                Impossible-Travel Violation Flagged: Delhi to Lucknow
              </span>
              <span className="text-[var(--soft)] text-[11px]">
                Reported transit window: 14 minutes (Requires ~2,140 km/h sustained velocity, Impossible for motor vehicle).
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full border border-[rgba(20,20,22,0.14)] bg-white text-[11px] font-medium text-[var(--ink)] shrink-0">
            Velocity Flag #VF-01
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-panel p-3 space-y-3">
            <div className="w-full h-[520px] rounded-xl overflow-hidden">
              <LeafletMap waypoints={waypoints} />
            </div>

            <div className="p-3 border-t border-[rgba(20,20,22,0.08)] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider">
                  Timeline Spatial Scrubber
                </span>
                <span className="text-xs font-medium text-[var(--ink)]">
                  {timeSliderVal}% Horizon Active
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={timeSliderVal}
                onChange={(e) => setTimeSliderVal(parseInt(e.target.value, 10))}
                className="w-full accent-[#141416] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--soft)]">
                <span>02:14 UTC (First Tower Ping)</span>
                <span>04:12 UTC (Terminal Metro Surveillance)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-panel p-5 space-y-4">
              <div className="border-b border-[rgba(20,20,22,0.08)] pb-3">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">
                  Selected Geo-Waypoint
                </span>
                <h3 className="text-lg font-normal text-[var(--ink)] mt-0.5 heading-tight">
                  {activeWaypoint.name}
                </h3>
                <span className="text-xs text-[var(--soft)] block mt-0.5">
                  Logged: {activeWaypoint.time}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg border border-[rgba(20,20,22,0.08)] bg-white/70">
                  <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">WGS-84 Coordinates</span>
                  <span className="font-medium text-[var(--ink)] text-[11px]">
                    {activeWaypoint.lat.toFixed(5)}° N, {activeWaypoint.lng.toFixed(5)}° E
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-[rgba(20,20,22,0.08)] bg-white/70">
                  <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Uncertainty Radius</span>
                  <span className="font-medium text-[var(--ink)] text-[11px]">
                    {activeWaypoint.uncertaintyRadius} (Bounding circle)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-[rgba(20,20,22,0.08)] bg-white/70">
                  <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Evidentiary Source</span>
                  <span className="font-medium text-[var(--ink)] text-[11px]">
                    {activeWaypoint.source}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--soft)] leading-relaxed pt-1">
                {activeWaypoint.description}
              </p>
            </div>

            <div className="card-panel p-4 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block px-1">
                Visible Correlated Points
              </span>
              <div className="space-y-1.5">
                {waypoints.map((wp, idx) => {
                  const isSelected = activeWaypoint.id === wp.id;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => setSelectedWaypoint(wp)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#141416] bg-white shadow-xs font-medium text-[var(--ink)]'
                          : 'border-[rgba(20,20,22,0.08)] bg-white/60 text-[var(--soft)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-current grid place-items-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="truncate max-w-[170px]">{wp.name}</span>
                      </div>
                      <span className="text-[10px]">{wp.time.slice(11, 16)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CaseShell>
  );
}

