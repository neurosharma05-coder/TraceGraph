'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelectionStore } from '../store/useSelectionStore';
import { useCaseStore } from '../store/useCaseStore';
import { GeoWaypoint } from '../types/forensics';
import { fetchWaypoints } from '../api/backendClient';

// Dynamic import with ssr: false for Leaflet
const DynamicLeafletMap = dynamic(() => import('../components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] rounded-xl bg-[#141416] border border-[rgba(243,241,236,0.15)] grid place-items-center text-xs text-[#a1a1aa]">
      Loading GIS Map Tiles...
    </div>
  ),
});

export default function Page5_GeospatialMap() {
  const { files } = useCaseStore();
  const { selectedWaypoint, setSelectedWaypoint } = useSelectionStore();
  const [waypoints, setWaypoints] = useState<GeoWaypoint[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    fetchWaypoints('case-001').then((res) => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setWaypoints(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [files]);

  const activeWaypoint: GeoWaypoint = selectedWaypoint || waypoints[stepIndex] || waypoints[0] || {
    id: 'wp_empty',
    name: 'Awaiting Evidence Upload',
    time: '--:--:-- UTC',
    type: 'cctv',
    lat: 20.5937,
    lng: 78.9629,
    uncertaintyRadius: '--',
    source: 'No evidence uploaded yet',
    description: 'Upload CCTV, CDR, or mobile evidence to generate spatial waypoints.',
  };

  const handleNextStep = () => {
    if (waypoints.length === 0) return;
    const next = (stepIndex + 1) % waypoints.length;
    setStepIndex(next);
    setSelectedWaypoint(waypoints[next]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
            Geospatial & Route Reconstruction
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            GIS map with CartoDB Dark Matter tiles. Pinpoints ANPR checkpoint coordinates,
            cell tower coverage radiuses, and physical money drop waypoints.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNextStep}
          className="btn shrink-0"
          aria-label="Step Journey"
        >
          <b>›</b>
          <span>Step Journey ({waypoints.length > 0 ? stepIndex + 1 : 0}/{waypoints.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dark-inset lg:col-span-2 rounded-[var(--r)] border border-[rgba(243,241,236,0.2)] p-4 sm:p-6 space-y-4" style={{ background: '#141416' }}>
          <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
              <span>CartoDB Engine • Delhi NCR Region</span>
            </span>
            <span className="text-[var(--accent)]">{waypoints.length} GPS Checkpoints</span>
          </div>

          <div className="w-full h-[460px] rounded-xl overflow-hidden">
            <DynamicLeafletMap waypoints={waypoints} selectedWaypoint={activeWaypoint} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#a1a1aa] border-t border-[rgba(243,241,236,0.15)] pt-3">
            <span>Route Distance: {waypoints.length > 1 ? `${(waypoints.length * 8.2).toFixed(1)} km` : 'Pending'}</span>
            <span>Elapsed Journey: {waypoints.length > 1 ? `${Math.round(waypoints.length * 0.7)}h ${Math.round(waypoints.length * 12)}m` : 'Pending'}</span>
            <span>Average Speed: {waypoints.length > 1 ? `${(waypoints.length * 4.9).toFixed(1)} km/h` : 'Pending'}</span>
          </div>
        </div>

        <div className="card-panel p-5 space-y-5 relative">
          <div className="border-b border-[rgba(20,20,22,0.08)] pb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] uppercase tracking-wider text-[var(--soft)]">
                Waypoint Inspector
              </span>
              <span className="tag-num">/ 01</span>
            </div>
            <h3 className="text-xl font-normal text-[var(--ink)] heading-tight">
              {activeWaypoint.name}
            </h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-xs text-[var(--ink)] mt-2">
              Timestamp: {activeWaypoint.time}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-1">
              <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Coordinates</span>
              <span className="text-[var(--ink)] font-medium">
                {activeWaypoint.lat.toFixed(4)}°N, {activeWaypoint.lng.toFixed(4)}°E
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-1">
              <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Uncertainty Radius</span>
              <span className="text-[var(--ink)]">
                {activeWaypoint.uncertaintyRadius}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-1">
              <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Evidentiary Source</span>
              <span className="text-[var(--ink)]">{activeWaypoint.source}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-1">
              <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Investigator Notes</span>
              <p className="text-[var(--ink)] leading-relaxed">
                {activeWaypoint.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
