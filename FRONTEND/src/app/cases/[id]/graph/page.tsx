'use client';

import React, { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import CaseShell from '../../../../components/CaseShell';
import CytoscapeGraph from '../../../../components/CytoscapeGraph';
import DetailDrawer from '../../../../components/common/DetailDrawer';
import { useSelectionStore } from '../../../../store/useSelectionStore';
import { useToastStore } from '../../../../components/common/useToastStore';
import { GraphNode, GraphLink } from '../../../../types/forensics';
import { fetchKnowledgeGraph } from '../../../../api/backendClient';
import {
  Search,
  Filter,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  ShieldAlert,
  Info,
  Layers,
  Sliders,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Video,
  MessageSquare,
  FileText,
} from 'lucide-react';

export default function CaseGraphPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const { addToast } = useToastStore();

  const { selectedNode, selectedLink, setSelectedNode, setSelectedLink } = useSelectionStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [investigatorNote, setInvestigatorNote] = useState('');
  const [allNodes, setAllNodes] = useState<GraphNode[]>([]);
  const [allLinks, setAllLinks] = useState<GraphLink[]>([]);

  useEffect(() => {
    fetchKnowledgeGraph(caseId).then((res) => {
      if (res?.nodes) setAllNodes(res.nodes);
      if (res?.links) setAllLinks(res.links);
    });
  }, [caseId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [linkStateFilter, setLinkStateFilter] = useState<'all' | 'confirmed' | 'proposed' | 'rejected'>('all');
  const [sourceTypeFilter, setSourceTypeFilter] = useState('all');
  const [confidenceMin, setConfidenceMin] = useState(0.5);
  const [conflictsOnly, setConflictsOnly] = useState(false);
  const [hideRejected, setHideRejected] = useState(true);
  const [crossCaseOnly, setCrossCaseOnly] = useState(false);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [stressTestMode, setStressTestMode] = useState(false);
  const [graphLayout, setGraphLayout] = useState<'cose' | 'concentric' | 'circle' | 'breadthfirst'>('cose');

  // Generate synthetic stress-test nodes if enabled
  const baseNodes = React.useMemo(() => {
    if (!stressTestMode) return allNodes;
    const extraNodes: GraphNode[] = [];
    for (let i = 1; i <= 50; i++) {
      extraNodes.push({
        id: `stress_node_${i}`,
        label: `Co-conspirator Endpoint #${i}`,
        category: i % 2 === 0 ? 'phone' : 'bank',
        details: `Synthetically scaled telecommunication node #${i} for load validation.`,
        confidence: 0.75 + (i % 20) * 0.01,
        sourceFile: 'Bulk_CDR_Stress_Corpus.csv',
        x: 100 + (i * 35) % 800,
        y: 120 + (i * 25) % 500,
        caseCount: (i % 3) + 1,
        riskScore: 60 + (i % 35),
      });
    }
    return [...allNodes, ...extraNodes];
  }, [stressTestMode]);

  // Filtered nodes: when a category is selected, include matching nodes PLUS their 1-hop neighbors
  // so edges always render and the graph stays connected (memoized to prevent render loops)
  const filteredNodes = useMemo(() => {
    const baseFiltered = baseNodes.filter((n) => {
      const matchesSearch =
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesConfidence = n.confidence >= confidenceMin;
      const matchesRisk = !highRiskOnly || (n.category === 'suspect' || n.confidence >= 0.9);
      const matchesCrossCase = !crossCaseOnly || ((n.caseCount || 1) > 1);
      const matchesSourceType =
        sourceTypeFilter === 'all' ||
        n.sourceFile.toLowerCase().includes(sourceTypeFilter.toLowerCase());
      return matchesSearch && matchesConfidence && matchesRisk && matchesCrossCase && matchesSourceType;
    });

    if (categoryFilter === 'all') return baseFiltered;

    // Category filter: get primary matches + their 1-hop neighbors (connected via any link)
    const primaryIds = new Set(baseFiltered.filter((n) => n.category === categoryFilter).map((n) => n.id));
    const neighborIds = new Set<string>();
    allLinks.forEach((l) => {
      if (primaryIds.has(l.source)) neighborIds.add(l.target);
      if (primaryIds.has(l.target)) neighborIds.add(l.source);
    });
    return baseFiltered.filter((n) => primaryIds.has(n.id) || neighborIds.has(n.id));
  }, [baseNodes, searchQuery, confidenceMin, highRiskOnly, crossCaseOnly, sourceTypeFilter, categoryFilter]);

  const filteredLinks = useMemo(() => {
    const filteredNodeIds = new Set(filteredNodes.map((n: GraphNode) => n.id));
    return allLinks.filter((l) => {
      const matchesConf = l.confidence >= confidenceMin;
      const matchesConflicts = !conflictsOnly || !l.verified;
      const matchesHideRejected = !hideRejected || l.state !== 'rejected';
      const matchesState = linkStateFilter === 'all' || l.state === linkStateFilter;
      // Only include links where BOTH endpoints are in the visible node set
      const matchesNodes = filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target);
      return matchesConf && matchesConflicts && matchesHideRejected && matchesState && matchesNodes;
    });
  }, [filteredNodes, confidenceMin, conflictsOnly, hideRejected, linkStateFilter]);

  // Review Queue (links that need review: unverified or conflicts)
  const reviewQueue = allLinks.filter((l) => !l.verified || (l.conflicts && l.conflicts.length > 0));
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  const handleCategorySelect = (cat: string) => {
    setCategoryFilter(cat);
    if (cat === 'all') {
      setSelectedNode(allNodes[0]);
      setSelectedLink(null);
    } else {
      const match = allNodes.find((n) => n.category === cat);
      if (match) {
        setSelectedNode(match);
        setSelectedLink(null);
        setDrawerOpen(true);
      }
    }
  };

  const cycleReviewLinks = (direction: 'next' | 'prev') => {
    if (reviewQueue.length === 0) return;
    const nextIdx =
      direction === 'next'
        ? (currentReviewIdx + 1) % reviewQueue.length
        : (currentReviewIdx - 1 + reviewQueue.length) % reviewQueue.length;
    setCurrentReviewIdx(nextIdx);
    const targetLink = reviewQueue[nextIdx];
    setSelectedLink(targetLink);
    setSelectedNode(null);
    setDrawerOpen(true);
  };

  // Keyboard Shortcuts: C (Confirm), R (Reject), Esc (Close), ArrowLeft/ArrowRight (Cycle review links)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'c' || e.key === 'C') {
        if (selectedLink) {
          addToast({
            type: 'success',
            title: 'Link Confirmed via Shortcut [C]',
            message: `${selectedLink.relation} verified in active graph.`,
          });
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (selectedLink) {
          addToast({
            type: 'info',
            title: 'Link Rejected via Shortcut [R]',
            message: `${selectedLink.relation} excluded from active graph.`,
          });
        }
      } else if (e.key === 'Escape') {
        setDrawerOpen(false);
        setSelectedNode(null);
        setSelectedLink(null);
      } else if (e.key === 'ArrowRight') {
        cycleReviewLinks('next');
      } else if (e.key === 'ArrowLeft') {
        cycleReviewLinks('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLink, selectedNode, addToast, setSelectedNode, setSelectedLink, currentReviewIdx, reviewQueue]);

  return (
    <CaseShell caseId={caseId}>
      <div className="w-full max-w-7xl mx-auto space-y-6 px-2 sm:px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[var(--ink)] heading-tight">
              Forensic Knowledge Graph Explorer
            </h1>
            <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-1 leading-relaxed">
              Multi-modal graph correlating phone identifiers, CCTV facial crops, UPI accounts, and physical drop points.
              Keyboard shortcuts: <span className="font-medium text-[var(--ink)]">C</span> confirm,{' '}
              <span className="font-medium text-[var(--ink)]">R</span> reject,{' '}
              <span className="font-medium text-[var(--ink)]">← / →</span> cycle review queue,{' '}
              <span className="font-medium text-[var(--ink)]">Esc</span> close.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-white gap-1 text-xs">
              <span className="text-[10px] text-[var(--soft)] px-2 font-medium">
                Review: {currentReviewIdx + 1}/{reviewQueue.length}
              </span>
              <button
                type="button"
                onClick={() => cycleReviewLinks('prev')}
                className="p-1 rounded-full hover:bg-black/5"
                title="Previous link (ArrowLeft)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => cycleReviewLinks('next')}
                className="p-1 rounded-full hover:bg-black/5"
                title="Next link (ArrowRight)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-white gap-1 text-xs">
              <button
                type="button"
                onClick={() => setGraphLayout('cose')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  graphLayout === 'cose' ? 'bg-[#141416] text-white' : 'text-[var(--soft)]'
                }`}
              >
                Organic Force
              </button>
              <button
                type="button"
                onClick={() => setGraphLayout('circle')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  graphLayout === 'circle' ? 'bg-[#141416] text-white' : 'text-[var(--soft)]'
                }`}
              >
                Circle
              </button>
              <button
                type="button"
                onClick={() => setGraphLayout('breadthfirst')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  graphLayout === 'breadthfirst' ? 'bg-[#141416] text-white' : 'text-[var(--soft)]'
                }`}
              >
                Hierarchical
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 card-panel p-5 space-y-4 text-xs">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Graph Filters</span>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('all');
                  setLinkStateFilter('all');
                  setSourceTypeFilter('all');
                  setConfidenceMin(0.5);
                  setConflictsOnly(false);
                  setCrossCaseOnly(false);
                  setHighRiskOnly(false);
                  setSearchQuery('');
                  setStressTestMode(false);
                }}
                className="text-[11px] text-[var(--ink)] underline hover:opacity-80"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Search Entities</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--soft)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Suspect, phone, UPI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[rgba(20,20,22,0.12)] bg-white text-xs text-[var(--ink)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Entity Kind</label>
              <div className="flex flex-wrap gap-1">
                {['all', 'suspect', 'phone', 'cctv', 'bank', 'ip', 'location'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleCategorySelect(k)}
                    className={`px-2.5 py-1 rounded-md text-[11px] capitalize border transition-colors ${
                      categoryFilter === k
                        ? 'border-[#141416] bg-[#141416] text-white font-medium'
                        : 'border-[rgba(20,20,22,0.1)] bg-white text-[var(--soft)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[rgba(20,20,22,0.06)]">
              <label className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Link State</label>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { id: 'all', label: 'All States' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'proposed', label: 'Proposed' },
                  { id: 'rejected', label: 'Rejected' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setLinkStateFilter(st.id as any)}
                    className={`px-2 py-1 rounded-md text-[11px] border transition-colors ${
                      linkStateFilter === st.id
                        ? 'border-[#141416] bg-[#141416] text-white font-medium'
                        : 'border-[rgba(20,20,22,0.1)] bg-white text-[var(--soft)]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[rgba(20,20,22,0.06)]">
              <label className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Source Evidence Type</label>
              <select
                value={sourceTypeFilter}
                onChange={(e) => setSourceTypeFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[rgba(20,20,22,0.12)] bg-white text-xs text-[var(--ink)] focus:outline-none"
              >
                <option value="all">All Evidence Types</option>
                <option value="CDR">Carrier CDR Dumps</option>
                <option value="CCTV">ANPR / CCTV Video</option>
                <option value="HDFC">UPI & Bank Ledgers</option>
                <option value="Telegram">Social & Chat Escrow</option>
                <option value="PaloAlto">Firewall & Netflow Logs</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-[rgba(20,20,22,0.06)]">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-wider text-[var(--soft)]">Min Confidence</label>
                <span className="font-medium text-[var(--ink)]">{Math.round(confidenceMin * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceMin}
                onChange={(e) => setConfidenceMin(parseFloat(e.target.value))}
                className="w-full accent-[#141416] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--soft)]">
                <span>50% (Loose)</span>
                <span>95% (Strict)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[rgba(20,20,22,0.06)]">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={conflictsOnly}
                  onChange={(e) => setConflictsOnly(e.target.checked)}
                  className="rounded text-[#141416] focus:ring-0"
                />
                <span className="text-[var(--ink)]">Conflicts & Gaps Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={hideRejected}
                  onChange={(e) => setHideRejected(e.target.checked)}
                  className="rounded text-[#141416] focus:ring-0"
                />
                <span className="text-[var(--ink)]">Hide Rejected Links</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={crossCaseOnly}
                  onChange={(e) => setCrossCaseOnly(e.target.checked)}
                  className="rounded text-[#141416] focus:ring-0"
                />
                <span className="text-[var(--ink)]">Cross-Case Hits Only (x3)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={highRiskOnly}
                  onChange={(e) => setHighRiskOnly(e.target.checked)}
                  className="rounded text-[#141416] focus:ring-0"
                />
                <span className="text-[var(--ink)]">High Risk & Mule Entities</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs pt-1 text-[var(--soft)]">
                <input
                  type="checkbox"
                  checked={stressTestMode}
                  onChange={(e) => setStressTestMode(e.target.checked)}
                  className="rounded text-[#141416] focus:ring-0"
                />
                <span>Scale Stress Test (50+ Nodes)</span>
              </label>
            </div>

            <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/60 space-y-1 text-[11px]">
              <div className="flex justify-between text-[var(--soft)]">
                <span>Visible Nodes:</span>
                <span className="font-medium text-[var(--ink)]">{filteredNodes.length}</span>
              </div>
              <div className="flex justify-between text-[var(--soft)]">
                <span>Visible Edges:</span>
                <span className="font-medium text-[var(--ink)]">{filteredLinks.length}</span>
              </div>
              <div className="flex justify-between text-[var(--soft)]">
                <span>Score Method:</span>
                <span className="font-medium text-[var(--ink)]">Bayesian Posteriori</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 rounded-2xl border border-[rgba(243,241,236,0.18)] bg-[#141416] p-3 relative overflow-hidden flex flex-col min-h-[580px] shadow-sm">
            <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-[#1B1B1D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--line)] text-xs text-[var(--on-frame)] shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Canvas Active · {filteredNodes.length} Entities</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="ml-2 text-[11px] underline text-[#F7F4EE] hover:opacity-80"
              >
                Inspect Selection
              </button>
            </div>

            <div className="w-full flex-1 min-h-[540px]">
              <CytoscapeGraph
                nodes={filteredNodes}
                links={filteredLinks}
                layoutName={graphLayout}
                onNodeSelect={(node) => {
                  setSelectedNode(node);
                  setSelectedLink(null);
                  setDrawerOpen(true);
                }}
                onEdgeSelect={(edge) => {
                  setSelectedLink(edge);
                  setSelectedNode(null);
                  setDrawerOpen(true);
                }}
              />
            </div>

            <div className="p-3 border-t border-[rgba(243,241,236,0.12)] flex flex-wrap items-center justify-between text-xs text-[#a1a1aa] z-10 mt-1">
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#FFFFFF]" />
                  <span>Solid: Confirmed Link</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-b border-dashed border-[#F28A2E]" />
                  <span>Dashed: AI Hypothesis Link</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>Double-click node to isolate neighbors</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#a1a1aa]">Click any node or link to inspect</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedNode(null);
          setSelectedLink(null);
        }}
        title={selectedNode ? selectedNode.label : selectedLink ? selectedLink.relation : 'Entity Inspector'}
        subtitle={selectedNode ? `Category: ${selectedNode.category}` : selectedLink ? 'Evidentiary Relationship' : undefined}
      >
        {selectedNode && (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Entity Summary</span>
              <p className="text-[var(--ink)] leading-relaxed text-sm font-normal">
                {selectedNode.details}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white">
                <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Risk Score Badge</span>
                <span className="text-base font-medium text-[var(--ink)] mt-0.5 block">
                  {selectedNode.riskScore || Math.round(selectedNode.confidence * 100)}% Risk
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white">
                <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Cross-Case Hits (x3)</span>
                <span className="text-base font-medium text-emerald-800 mt-0.5 block">
                  {selectedNode.caseCount && selectedNode.caseCount > 1 ? `x${selectedNode.caseCount} Recidivist` : '1 Case'}
                </span>
              </div>
            </div>

            {selectedNode.otherCases && selectedNode.otherCases.length > 0 && (
              <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-2">
                <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Inter-State FIR Nexus</span>
                <div className="space-y-1">
                  {selectedNode.otherCases.map((c) => (
                    <div key={c} className="flex items-center justify-between p-2 rounded-lg bg-[#F7F4EE] text-[11px]">
                      <span className="font-medium text-[var(--ink)]">{c}</span>
                      <Link href="/cases" className="text-[10px] text-[var(--soft)] hover:text-black underline flex items-center gap-0.5">
                        <span>View</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-1">
              <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider block">Originating Container</span>
              <span className="text-[var(--ink)] text-[11px] break-all block">{selectedNode.sourceFile}</span>
            </div>

            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Merged Identifiers (Disambiguation)</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(selectedNode.mergedFrom || ['Aadhaar PAN: Verified', 'Phone SIM: Linked']).map((m) => (
                  <span key={m} className="px-2.5 py-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-[#F7F4EE] text-[11px]">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedLink && (
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Why this link?</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] font-medium bg-[#F7F4EE]">
                  {Math.round(selectedLink.confidence * 100)}% Bayesian Conf
                </span>
              </div>
              <p className="text-[var(--ink)] leading-relaxed text-xs">
                {selectedLink.reason}
              </p>
              <div className="pt-2 border-t border-[rgba(20,20,22,0.06)] flex flex-wrap items-center justify-between gap-2 text-[10px] text-[var(--soft)]">
                <span>Method: <strong className="text-[var(--ink)] font-medium">{selectedLink.scoreMethod || 'Bayesian Posteriori'}</strong></span>
                <span>Model: <strong className="text-[var(--ink)] font-medium">{selectedLink.modelVersion || 'TraceGraph Core v3.4.1'}</strong></span>
              </div>
            </div>

            {selectedLink.sourceEvents && selectedLink.sourceEvents.length > 0 && (
              <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">
                  Source Chronology Events
                </span>
                <div className="space-y-1.5">
                  {selectedLink.sourceEvents.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/cases/${caseId}/timeline`}
                      className="p-2.5 rounded-lg border border-[rgba(20,20,22,0.08)] bg-[#F7F4EE] hover:border-[#141416] transition-colors flex items-center justify-between gap-2 text-[11px] text-[var(--ink)] no-underline block"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[var(--soft)] shrink-0" />
                        <span className="font-medium truncate">{ev.title}</span>
                      </div>
                      <span className="text-[10px] text-[var(--soft)] shrink-0">{ev.time}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {selectedLink.conflicts && selectedLink.conflicts.length > 0 && (
              <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.12)] bg-white space-y-2">
                <div className="flex items-center gap-1.5 text-[var(--ink)] font-medium text-xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Conflicting Relationship Flags</span>
                </div>
                {selectedLink.conflicts.map((c, i) => (
                  <div key={i} className="text-[11px] space-y-0.5">
                    <span className="font-medium text-[var(--ink)] block">{c.relation}</span>
                    <p className="text-[var(--soft)] leading-relaxed">{c.reason}</p>
                  </div>
                ))}
              </div>
            )}

            {(selectedLink.nerSnippet || selectedLink.cctvThumbnail) && (
              <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Supporting Evidence Snippets</span>
                
                {selectedLink.nerSnippet && (
                  <div className="p-3 rounded-lg border border-[rgba(20,20,22,0.06)] bg-[#F7F4EE] space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--soft)] uppercase">
                      <MessageSquare className="w-3 h-3" />
                      <span>Hinglish Chat Extraction</span>
                    </div>
                    <blockquote className="text-[11px] italic text-[var(--ink)]">
                      &quot;{selectedLink.nerSnippet.text}&quot;
                    </blockquote>
                    <span className="inline-block text-[10px] font-medium text-[#141416] bg-black/5 px-2 py-0.5 rounded">
                      Span: {selectedLink.nerSnippet.span}
                    </span>
                  </div>
                )}

                {selectedLink.cctvThumbnail && (
                  <div className="p-3 rounded-lg border border-[rgba(20,20,22,0.06)] bg-[#141416] text-[#F3F1EC] space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#a1a1aa]">
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>{selectedLink.cctvThumbnail.camera}</span>
                      </span>
                      <span>{selectedLink.cctvThumbnail.time}</span>
                    </div>
                    <div className="h-16 rounded bg-[#27272A] border border-[rgba(255,255,255,0.15)] grid place-items-center text-center p-2">
                      <span className="text-[10px] text-white font-medium block">
                        Optical Crop: {selectedLink.cctvThumbnail.frameId}
                      </span>
                      <span className="text-[9px] text-[#a1a1aa]">
                        Biometric Facial ArcFace: {selectedLink.cctvThumbnail.matchScore}% Match
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Feature Weight Attribution</span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[var(--soft)]">Spatial Co-location Frequency</span>
                    <span className="font-medium text-[var(--ink)]">+42%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
                    <div style={{ width: '84%' }} className="h-full bg-[#141416]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[var(--soft)]">Temporal Proximity (Δt ≤ 4m)</span>
                    <span className="font-medium text-[var(--ink)]">+36%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
                    <div style={{ width: '72%' }} className="h-full bg-[#141416]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[var(--soft)]">Direct Linguistic Mentions</span>
                    <span className="font-medium text-[var(--ink)]">+20%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
                    <div style={{ width: '40%' }} className="h-full bg-[#141416]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Investigator Field Note</label>
              <textarea
                rows={2}
                placeholder="Add corroboration note for Section 63(4) court annexure..."
                value={investigatorNote}
                onChange={(e) => setInvestigatorNote(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[rgba(20,20,22,0.14)] bg-white text-xs text-[var(--ink)] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Link Formally Confirmed [Shortcut: C]',
                    message: `${selectedLink.relation} verified in active evidentiary dossier.`,
                  });
                  setDrawerOpen(false);
                }}
                className="flex-1 py-2 rounded-full border border-[#141416] bg-[#141416] text-[#F7F4EE] hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Link Excluded [Shortcut: R]',
                    message: `${selectedLink.relation} removed from final prosecution timeline.`,
                  });
                  setDrawerOpen(false);
                }}
                className="flex-1 py-2 rounded-full border border-[rgba(20,20,22,0.16)] bg-white text-[var(--ink)] hover:border-[#141416] transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject Link</span>
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </CaseShell>
  );
}
