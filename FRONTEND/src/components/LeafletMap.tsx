'use client';

import React, { useEffect, useRef } from 'react';
import { GeoWaypoint } from '../types/forensics';
import { useSelectionStore } from '../store/useSelectionStore';

interface Props {
  waypoints: GeoWaypoint[];
  selectedWaypoint?: GeoWaypoint | null;
}

export default function LeafletMap({ waypoints, selectedWaypoint = null }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const { setSelectedWaypoint } = useSelectionStore();

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet to avoid SSR window errors
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Initialize map centered at Delhi NCR
        const map = L.map(mapContainerRef.current, {
          center: [28.6139, 77.269],
          zoom: 11,
          zoomControl: true,
          attributionControl: false,
        });

        // Use clean CartoDB Dark Matter / Positron tiles matching the obsidian landing page palette
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 19,
            subdomains: 'abcd',
          }
        ).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add polyline corridor
      const latlngs = waypoints.map((wp) => [wp.lat, wp.lng] as [number, number]);
      const polyline = L.polyline(latlngs, {
        color: '#FFFFFF',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.85,
      }).addTo(map);
      markersRef.current.push(polyline);

      // Add markers and uncertainty circles for each waypoint
      waypoints.forEach((wp, idx) => {
        const isSelected = selectedWaypoint?.id === wp.id;

        // Custom HTML DivIcon
        const customIcon = L.divIcon({
          className: 'custom-geo-pin',
          html: `
            <div style="
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background: ${isSelected ? '#F7F4EE' : '#1B1B1D'};
              border: 2px solid ${isSelected ? '#FFFFFF' : 'rgba(243, 241, 236, 0.4)'};
              color: ${isSelected ? '#141416' : '#F3F1EC'};
              display: grid;
              place-items: center;
              font-family: Inter, sans-serif;
              font-size: 11px;
              font-weight: 600;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
              cursor: pointer;
            ">
              ${idx + 1}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([wp.lat, wp.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedWaypoint(wp);
        });

        // Uncertainty Circle
        const radiusMeters = wp.type === 'cctv' ? 80 : wp.type === 'cell_tower' ? 650 : 200;
        const circle = L.circle([wp.lat, wp.lng], {
          radius: radiusMeters,
          color: isSelected ? '#FFFFFF' : 'rgba(243, 241, 236, 0.35)',
          fillColor: isSelected ? '#FFFFFF' : '#F7F4EE',
          fillOpacity: isSelected ? 0.18 : 0.06,
          weight: 1,
        }).addTo(map);

        markersRef.current.push(marker);
        markersRef.current.push(circle);
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [waypoints, selectedWaypoint, setSelectedWaypoint]);

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-xl overflow-hidden border border-[var(--line)]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] bg-[#141416]" />
      <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-full bg-black/80 border border-[var(--line)] text-[11px] font-sans text-[var(--on-frame)]">
        CartoDB Dark Vector • Section 63(4) GIS Attestation
      </div>
    </div>
  );
}
