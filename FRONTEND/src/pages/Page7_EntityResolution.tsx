'use client';

import React, { useState, useEffect } from 'react';
import { GitMerge } from 'lucide-react';
import { EntityCluster } from '../types/forensics';
import { fetchEntityClusters } from '../api/backendClient';

export default function Page7_EntityResolution() {
  const [clusters, setClusters] = useState<EntityCluster[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchEntityClusters('case-001').then((res) => {
      if (isMounted && res && Array.isArray(res) && res.length > 0) {
        setClusters(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleMerge = (id: string) => {
    setClusters((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === 'merged' ? 'candidate' : 'merged',
            }
          : c
      )
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
            Entity Resolution & Identity Matrix
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            Consolidate disparate phone numbers, WhatsApp aliases, bank KYC names, and CCTV facial
            vectors into unified master subject profiles with Bayesian match probability.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white flex items-center gap-2.5 text-xs shrink-0 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[var(--ink)]" />
          <span className="text-[var(--ink)] font-medium">
            {clusters.filter((c) => c.status === 'merged').length} Resolved Profiles
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {clusters.map((cluster, idx) => (
          <div
            key={cluster.id}
            className="card-panel p-6 sm:p-8 space-y-6 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(20,20,22,0.08)] pb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="tag-num mr-1">/ 0{idx + 1}</span>
                  <h3 className="text-xl font-normal text-[var(--ink)] heading-tight">
                    {cluster.canonicalName}
                  </h3>
                  <span
                    className="text-[11px] px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.14)] text-[var(--ink)] bg-white"
                  >
                    {cluster.status === 'merged' ? 'Cluster Merged' : 'Review Candidate'}
                  </span>
                </div>
                <span className="text-xs text-[var(--soft)]">{cluster.role}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--ink)] border border-[rgba(20,20,22,0.12)] px-3 py-1 rounded-full bg-white">
                  Match Score: {Math.round(cluster.matchScore * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() => toggleMerge(cluster.id)}
                  className="btn"
                >
                  <b>›</b>
                  <span>{cluster.status === 'merged' ? 'Split Cluster' : 'Confirm & Merge'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cluster.identifiers.map((ident, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-[var(--soft)]">
                    <span className="uppercase tracking-wider">{ident.type}</span>
                    <span>{ident.source}</span>
                  </div>
                  <div className="font-medium text-[var(--ink)]">{ident.label}</div>
                  <div className="text-[11px] text-[var(--ink)] font-normal break-all">
                    {ident.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
