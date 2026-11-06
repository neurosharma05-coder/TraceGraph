'use client';

import React, { useState, useMemo, useEffect } from 'react';
import CytoscapeGraph from '../components/CytoscapeGraph';
import FinancialFlowChart from '../components/FinancialFlowChart';
import { useCaseStore } from '../store/useCaseStore';
import { useSelectionStore } from '../store/useSelectionStore';
import { GraphNode, GraphLink } from '../types/forensics';
import { fetchKnowledgeGraph } from '../api/backendClient';
import { Maximize2, Minimize2, X } from 'lucide-react';

export default function Page3_KnowledgeGraph() {
  const { files, isLiveConnected } = useCaseStore();
  const selectedNode = useSelectionStore((s) => s.selectedNode);
  const setSelectedNode = useSelectionStore((s) => s.setSelectedNode);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    let isMounted = true;
    fetchKnowledgeGraph('case-001').then((res) => {
      if (isMounted && res && res.nodes && res.links) {
        setNodes(res.nodes);
        setLinks(res.links);
        if (res.nodes.length > 0) {
          setSelectedNode(res.nodes[0]);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [setSelectedNode, files]);

  const handleCategorySelect = (cat: string) => {
    setCategoryFilter(cat);
    if (cat === 'all') {
      setSelectedNode(nodes[0]);
    } else {
      const match = nodes.find((n) => n.category === cat);
      if (match) {
        setSelectedNode(match);
      }
    }
  };

  // When a category is selected, include matching nodes PLUS their 1-hop neighbors
  // so edges always render and the graph stays connected (memoized to prevent render loops)
  const filteredNodes = useMemo(() => {
    if (categoryFilter === 'all') return nodes;
    const primaryIds = new Set(
      nodes.filter((n) => n.category === categoryFilter).map((n) => n.id)
    );
    const neighborIds = new Set<string>();
    links.forEach((l) => {
      if (primaryIds.has(l.source)) neighborIds.add(l.target);
      if (primaryIds.has(l.target)) neighborIds.add(l.source);
    });
    return nodes.filter((n) => primaryIds.has(n.id) || neighborIds.has(n.id));
  }, [categoryFilter, nodes, links]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
            Correlated Evidence Graph
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            Interactive graph canvas showing extracted identities (phones, IMEIs, CCTV faces,
            UPI handles). Every edge displays Bayesian confidence scoring and evidentiary provenance.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-[rgba(20,20,22,0.03)] gap-1 overflow-x-auto shrink-0">
          {['all', 'suspect', 'phone', 'cctv', 'bank', 'ip'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-normal capitalize transition-all ${categoryFilter === cat
                  ? 'bg-[#141416] text-[#F7F4EE] shadow-xs'
                  : 'text-[var(--soft)] hover:text-[var(--ink)]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`${
            isFullscreen
              ? 'fixed inset-0 z-50 p-4 sm:p-6 bg-[#FAFAFA] flex flex-col justify-between overflow-hidden shadow-2xl'
              : 'card-panel lg:col-span-2 rounded-[var(--r)] border border-[rgba(20,20,22,0.1)] bg-white p-4 sm:p-6 relative min-h-[640px] flex flex-col justify-between overflow-hidden shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[var(--soft)] z-10 mb-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm text-[var(--ink)]">Graph View: {filteredNodes.length} Nodes</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Verified Engine</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(20,20,22,0.12)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[#141416] hover:text-white transition-all shadow-xs"
                title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand to Fullscreen'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={`flex-1 w-full rounded-xl overflow-hidden relative bg-[#FAFAFA] border border-[rgba(20,20,22,0.06)] ${isFullscreen ? 'min-h-[calc(100vh-140px)]' : 'min-h-[560px]'}`}>
            {isFullscreen && selectedNode && (
              <div className="absolute top-4 left-4 z-30 max-w-sm p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[rgba(20,20,22,0.12)] shadow-xl space-y-2 text-xs animate-in fade-in">
                <div className="flex justify-between items-center border-b border-[rgba(20,20,22,0.06)] pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--soft)]">Inspecting Node</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/5 text-[var(--ink)]">{selectedNode.category}</span>
                </div>
                <h4 className="text-sm font-bold text-[var(--ink)] break-all">{selectedNode.label}</h4>
                <p className="text-[11px] text-[var(--soft)] leading-relaxed">{selectedNode.details}</p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[rgba(20,20,22,0.06)]">
                  <span className="text-[var(--soft)] truncate max-w-[180px]">{selectedNode.sourceFile}</span>
                  <span className="text-emerald-700 font-bold">{Math.round(selectedNode.confidence * 100)}% Confidence</span>
                </div>
              </div>
            )}

            {filteredNodes.length === 0 ? (
              <div className="flex-1 w-full min-h-[420px] rounded-xl flex flex-col items-center justify-center text-center text-[var(--soft)]">
                <div className="text-4xl mb-3">🔗</div>
                <p className="text-sm font-medium text-[var(--ink)]">No Evidence Graph Generated Yet</p>
                <p className="text-xs mt-1 max-w-xs text-[var(--soft)]">Upload forensic evidence files from the Evidence Vault to auto-generate the correlated knowledge graph.</p>
              </div>
            ) : (
              <CytoscapeGraph
                nodes={filteredNodes}
                links={links}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                onNodeSelect={(node) => setSelectedNode(node)}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--soft)] border-t border-[rgba(20,20,22,0.08)] pt-3 mt-2 z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                <span className="text-[var(--ink)] font-medium">Suspect</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                <span className="text-[var(--ink)] font-medium">Phone</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                <span className="text-[var(--ink)] font-medium">Bank</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                <span className="text-[var(--ink)] font-medium">IP / Cloud</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DB2777]" />
                <span className="text-[var(--ink)] font-medium">CCTV</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[var(--soft)]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[var(--ink)] opacity-70" />
                <span>Confirmed</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 border-b border-dashed border-[var(--ink)] opacity-50" />
                <span>Hypothesis</span>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-panel p-5 space-y-4 relative">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)]">
                  Entity Inspector
                </span>
                <span className="tag-num">/ 01</span>
              </div>
              <h3 className="text-xl font-normal text-[var(--ink)] heading-tight">
                {selectedNode?.label || 'Select an Entity Node'}
              </h3>
              <span className="inline-block px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-xs text-[var(--ink)] mt-2 capitalize">
                Category: {selectedNode?.category || 'None'}
              </span>
            </div>

            {!selectedNode && nodes.length === 0 && (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-[var(--soft)]">No entities detected yet</p>
              </div>
            )}
            {selectedNode && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-1">
                  <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Summary</span>
                  <p className="text-[var(--ink)] leading-relaxed">{selectedNode.details}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70">
                    <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Confidence</span>
                    <span className="text-[var(--ink)] font-medium text-sm">
                      {Math.round(selectedNode.confidence * 100)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70">
                    <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Provenance</span>
                    <span className="text-emerald-700 font-medium text-xs">{files.length} sources verified</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-1">
                  <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Source Container</span>
                  <span className="text-[var(--ink)] text-[11px] break-all">
                    {selectedNode.sourceFile}
                  </span>
                </div>
              </div>
            )}
          </div>

          <FinancialFlowChart />
        </div>
      </div>
    </div>
  );
}
