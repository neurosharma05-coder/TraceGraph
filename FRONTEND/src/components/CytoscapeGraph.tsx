'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core } from 'cytoscape';
import { GraphNode, GraphLink } from '../types/forensics';
import { useSelectionStore } from '../store/useSelectionStore';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Map as MapIcon, Expand } from 'lucide-react';

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  layoutName?: 'cose' | 'concentric' | 'circle' | 'breadthfirst' | 'grid';
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onNodeSelect?: (node: GraphNode) => void;
  onEdgeSelect?: (link: GraphLink) => void;
}

export default function CytoscapeGraph({
  nodes,
  links,
  layoutName = 'cose',
  isFullscreen = false,
  onToggleFullscreen,
  onNodeSelect,
  onEdgeSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const selectedNode = useSelectionStore((s) => s.selectedNode);
  const setSelectedNode = useSelectionStore((s) => s.setSelectedNode);
  const setSelectedLink = useSelectionStore((s) => s.setSelectedLink);
  const setGraphSnapshotUrl = useSelectionStore((s) => s.setGraphSnapshotUrl);
  const snapshotCapturedRef = useRef(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<'cose' | 'concentric' | 'circle' | 'breadthfirst'>('cose');
  const [minimapNodes, setMinimapNodes] = useState<{ id: string; x: number; y: number; category: string }[]>([]);
  const [minimapBounds, setMinimapBounds] = useState({ minX: 0, maxX: 1000, minY: 0, maxY: 600 });

  const truncateLabel = (text: string, maxLen: number = 16) => {
    if (!text) return '';
    return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Filter out any dangling links
    const nodeIds = new Set(nodes.map((n) => n.id));
    const safeLinks = links.filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target));

    // Convert domain nodes to Cytoscape elements with prominent labels
    const nodeElements = nodes.map((n) => {
      const short = truncateLabel(n.label, 15);
      return {
        data: {
          id: n.id,
          label: short,
          fullLabel: n.label,
          category: n.category,
          confidence: n.confidence,
          details: n.details,
          sourceFile: n.sourceFile,
          riskScore: n.riskScore || Math.round(n.confidence * 100),
        },
        position: n.x && n.y ? { x: n.x, y: n.y } : undefined,
      };
    });

    const edgeElements = safeLinks.map((l, idx) => ({
      data: {
        id: `edge_${idx}`,
        source: l.source,
        target: l.target,
        label: l.relation,
        verified: l.verified,
        confidence: l.confidence,
        state: l.state || (l.verified ? 'confirmed' : 'scored'),
      },
    }));

    const elements = [...nodeElements, ...edgeElements];

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      minZoom: 0.25,
      maxZoom: 3.5,
      style: [
        // Base Node Style - Bold, large, highly visible on white background
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-size': '12px',
            'font-weight': 700,
            color: '#09090B',
            'text-valign': 'bottom',
            'text-margin-y': 7,
            'text-outline-color': '#FFFFFF',
            'text-outline-width': 3,
            'text-outline-opacity': 1,
            width: 44,
            height: 44,
            'background-color': '#FFFFFF',
            'border-width': 3,
            'border-color': '#52525B',
            'overlay-opacity': 0,
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': 0.2,
          },
        },
        // Category-Specific Badges (Large & High Contrast)
        {
          selector: 'node[category = "suspect"]',
          style: {
            'background-color': '#FFE4E6',
            'border-color': '#E11D48', // Vivid Crimson Red
            'border-width': 4,
            color: '#881337',
            width: 54,
            height: 54,
            'font-size': '13px',
          },
        },
        {
          selector: 'node[category = "phone"]',
          style: {
            'background-color': '#D1FAE5',
            'border-color': '#059669', // Rich Emerald Green
            'border-width': 3.5,
            color: '#064E3B',
            width: 44,
            height: 44,
          },
        },
        {
          selector: 'node[category = "bank"]',
          style: {
            'background-color': '#FEF3C7',
            'border-color': '#D97706', // Rich Amber Gold
            'border-width': 4,
            color: '#78350F',
            width: 48,
            height: 48,
          },
        },
        {
          selector: 'node[category = "ip"]',
          style: {
            'background-color': '#EDE9FE',
            'border-color': '#7C3AED', // Deep Royal Violet
            'border-width': 3.5,
            color: '#4C1D95',
            width: 40,
            height: 40,
          },
        },
        {
          selector: 'node[category = "cctv"]',
          style: {
            'background-color': '#FCE7F3',
            'border-color': '#DB2777', // Hot Pink
            'border-width': 4,
            color: '#831843',
            width: 48,
            height: 48,
          },
        },
        {
          selector: 'node[category = "location"]',
          style: {
            'background-color': '#CFFAFE',
            'border-color': '#0891B2', // Deep Cyan
            'border-width': 3.5,
            color: '#164E63',
            width: 44,
            height: 44,
          },
        },
        // Active Selection Styling
        {
          selector: 'node:selected',
          style: {
            'border-color': '#000000',
            'border-width': 5,
            width: 60,
            height: 60,
            'underlay-color': '#000000',
            'underlay-padding': 10,
            'underlay-opacity': 0.15,
          },
        },
        // Edge styling — prominent, crisp dark lines
        {
          selector: 'edge',
          style: {
            width: 2.5,
            'line-color': 'rgba(20, 20, 22, 0.35)',
            'curve-style': 'bezier',
            'target-arrow-shape': 'none',
            'overlay-opacity': 0,
            'transition-property': 'line-color, width',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'edge[!verified]',
          style: {
            'line-style': 'dashed',
            'line-dash-pattern': [6, 4],
            'line-color': 'rgba(20, 20, 22, 0.25)',
          },
        },
        // Relation label on selected edge
        {
          selector: 'edge:selected',
          style: {
            width: 4,
            'line-color': '#000000',
            label: 'data(label)',
            'font-family': 'Inter, sans-serif',
            'font-size': '11px',
            'font-weight': 700,
            color: '#000000',
            'text-background-opacity': 1,
            'text-background-color': '#FFFFFF',
            'text-background-padding': '5px',
            'text-background-shape': 'roundrectangle',
            'text-border-color': '#000000',
            'text-border-width': 1.5,
            'text-border-opacity': 0.9,
          },
        },
        {
          selector: '.edge-connected',
          style: {
            'line-color': 'rgba(0, 0, 0, 0.85)',
            width: 3.5,
          },
        },
      ],
      layout: getLayoutOptions(currentLayout, nodes.length),
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    cyRef.current = cy;

    cy.ready(() => {
      // Fit initially, but guarantee minimum zoom so nodes are large & clear
      cy.fit(undefined, 50);
      const initialZoom = cy.zoom();
      
      // If fit zoomed out too far, scale up so nodes are prominently visible
      if (initialZoom < 0.90) {
        cy.zoom({
          level: 0.95,
          renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
        });
        cy.center();
      }

      // Update minimap nodes
      const rendered = cy.nodes().map((n) => ({
        id: n.id(),
        x: n.position('x'),
        y: n.position('y'),
        category: n.data('category'),
      }));
      setMinimapNodes(rendered);

      if (rendered.length > 0) {
        const xs = rendered.map((n) => n.x);
        const ys = rendered.map((n) => n.y);
        setMinimapBounds({
          minX: Math.min(...xs) - 60,
          maxX: Math.max(...xs) + 60,
          minY: Math.min(...ys) - 60,
          maxY: Math.max(...ys) + 60,
        });
      }

      // Snapshot for court certificate
      if (!snapshotCapturedRef.current) {
        try {
          const snapshot = cy.png({ output: 'base64uri', bg: '#FFFFFF', scale: 1.5 });
          if (snapshot) {
            snapshotCapturedRef.current = true;
            setGraphSnapshotUrl(snapshot);
          }
        } catch {}
      }
    });

    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const nodeData = node.data();
      const matched = nodes.find((n) => n.id === nodeData.id);
      
      cy.edges().removeClass('edge-connected');
      node.connectedEdges().addClass('edge-connected');

      if (matched) {
        setSelectedNode(matched);
        setSelectedLink(null);
        if (onNodeSelect) onNodeSelect(matched);
      }
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        cy.edges().removeClass('edge-connected');
      }
    });

    cy.on('tap', 'edge', (evt) => {
      const edgeData = evt.target.data();
      const matchedLink = links.find(
        (l) => l.source === edgeData.source && l.target === edgeData.target
      );
      if (matchedLink) {
        setSelectedLink(matchedLink);
        if (onEdgeSelect) onEdgeSelect(matchedLink);
      }
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [nodes, links, currentLayout, onNodeSelect, onEdgeSelect, setSelectedNode, setSelectedLink, setGraphSnapshotUrl]);

  useEffect(() => {
    if (cyRef.current) {
      const timer = setTimeout(() => {
        cyRef.current?.resize();
        cyRef.current?.fit(undefined, 50);
        if (cyRef.current && cyRef.current.zoom() < 0.90) {
          cyRef.current.zoom({ level: 0.95, renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 } });
          cyRef.current.center();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen]);

  function getLayoutOptions(layout: string, nodeCount: number): any {
    if (layout === 'concentric') {
      return {
        name: 'concentric',
        concentric: (node: any) => {
          const cat = node.data('category');
          if (cat === 'suspect') return 4;
          if (cat === 'bank' || cat === 'cctv') return 3;
          if (cat === 'phone') return 2;
          return 1;
        },
        levelWidth: () => 1,
        padding: 40,
        startAngle: (3 / 2) * Math.PI,
        sweep: undefined,
        clockwise: true,
        equidistant: false,
        minNodeSpacing: 55,
        animate: false,
      };
    }

    if (layout === 'circle') {
      return {
        name: 'circle',
        padding: 40,
        radius: Math.max(220, nodeCount * 7.0),
        animate: false,
      };
    }

    if (layout === 'breadthfirst') {
      return {
        name: 'breadthfirst',
        directed: true,
        padding: 40,
        spacingFactor: 1.6,
        animate: false,
      };
    }

    // Default: Cohesive COSE layout with strong centering gravity
    return {
      name: 'cose',
      animate: false,
      nodeRepulsion: (node: any) => 350000,
      idealEdgeLength: (edge: any) => 100,
      edgeElasticity: (edge: any) => 120,
      nestingFactor: 5,
      gravity: 90, // Strong pull towards center so nodes don't fly off
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      nodeOverlap: 60,
      componentSpacing: 100,
      padding: 40,
    };
  }

  const handleZoomIn = () => cyRef.current?.zoom({ level: cyRef.current.zoom() * 1.35, renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 } });
  const handleZoomOut = () => cyRef.current?.zoom({ level: cyRef.current.zoom() * 0.75, renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 } });
  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 50);
      if (cyRef.current.zoom() < 0.90) {
        cyRef.current.zoom({
          level: 0.95,
          renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 },
        });
        cyRef.current.center();
      }
    }
  };
  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.layout(getLayoutOptions(currentLayout, nodes.length)).run();
      cyRef.current.fit(undefined, 50);
      if (cyRef.current.zoom() < 0.90) {
        cyRef.current.zoom({ level: 0.95, renderedPosition: { x: cyRef.current.width() / 2, y: cyRef.current.height() / 2 } });
        cyRef.current.center();
      }
    }
  };

  const switchLayout = (layout: 'cose' | 'concentric' | 'circle' | 'breadthfirst') => {
    setCurrentLayout(layout);
  };

  return (
    <div className="relative w-full h-full min-h-[560px] flex flex-col justify-between bg-[#FAFAFA]">
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 p-1 rounded-full bg-white/95 backdrop-blur-md border border-[rgba(20,20,22,0.12)] shadow-md text-xs">
        <span className="px-2.5 text-[var(--soft)] text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">
          Layout
        </span>
        <button
          type="button"
          onClick={() => switchLayout('cose')}
          className={`px-3 py-1.5 rounded-full transition-all text-xs ${
            currentLayout === 'cose'
              ? 'bg-[#18181B] text-white font-semibold shadow-xs'
              : 'text-[var(--soft)] hover:text-[var(--ink)]'
          }`}
          title="Force-Directed Physics Layout (Best for Organic Networks)"
        >
          Organic Force
        </button>
        <button
          type="button"
          onClick={() => switchLayout('concentric')}
          className={`px-3 py-1.5 rounded-full transition-all text-xs ${
            currentLayout === 'concentric'
              ? 'bg-[#18181B] text-white font-semibold shadow-xs'
              : 'text-[var(--soft)] hover:text-[var(--ink)]'
          }`}
          title="Concentric Circles by Entity Category"
        >
          Concentric
        </button>
        <button
          type="button"
          onClick={() => switchLayout('circle')}
          className={`px-3 py-1.5 rounded-full transition-all text-xs ${
            currentLayout === 'circle'
              ? 'bg-[#18181B] text-white font-semibold shadow-xs'
              : 'text-[var(--soft)] hover:text-[var(--ink)]'
          }`}
          title="Radial Ring Layout"
        >
          Radial
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-full min-h-[560px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-[#FAFAFA]"
      />

      {showMinimap && (
        <div className="absolute bottom-16 left-4 z-20 w-48 p-3 rounded-xl border border-[rgba(20,20,22,0.12)] bg-white/95 shadow-xl">
          <div className="flex items-center justify-between text-[11px] text-[var(--soft)] mb-1.5">
            <span className="font-semibold text-[var(--ink)]">Radar View</span>
            <button
              type="button"
              onClick={() => setShowMinimap(false)}
              className="hover:text-[var(--ink)] text-sm font-bold"
              title="Close minimap"
            >
              ×
            </button>
          </div>

          <svg className="w-full h-20 rounded-lg bg-[#F4F4F5] border border-[rgba(20,20,22,0.06)] overflow-hidden" viewBox="0 0 100 60">
            {minimapNodes.map((mn) => {
              const rangeX = Math.max(minimapBounds.maxX - minimapBounds.minX, 1);
              const rangeY = Math.max(minimapBounds.maxY - minimapBounds.minY, 1);
              const cx = ((mn.x - minimapBounds.minX) / rangeX) * 90 + 5;
              const cyCoord = ((mn.y - minimapBounds.minY) / rangeY) * 50 + 5;
              let fill = '#71717A';
              if (mn.category === 'suspect') fill = '#E11D48';
              else if (mn.category === 'phone') fill = '#059669';
              else if (mn.category === 'bank') fill = '#D97706';
              else if (mn.category === 'ip') fill = '#7C3AED';
              else if (mn.category === 'cctv') fill = '#DB2777';
              return <circle key={mn.id} cx={cx} cy={cyCoord} r={3} fill={fill} />;
            })}
          </svg>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[rgba(20,20,22,0.12)] shadow-lg">
        {!showMinimap && (
          <button
            type="button"
            onClick={() => setShowMinimap(true)}
            className="p-2 rounded-full text-[var(--soft)] hover:text-[var(--ink)] hover:bg-black/5 transition-colors"
            title="Radar Minimap"
            aria-label="Radar Minimap"
          >
            <MapIcon className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 rounded-full text-[var(--soft)] hover:text-[var(--ink)] hover:bg-black/5 transition-colors"
          title="Zoom in (Large view)"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 rounded-full text-[var(--soft)] hover:text-[var(--ink)] hover:bg-black/5 transition-colors"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleFit}
          className="p-2 rounded-full text-[var(--soft)] hover:text-[var(--ink)] hover:bg-black/5 transition-colors"
          title="Fit view"
          aria-label="Fit view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-full text-[var(--soft)] hover:text-[var(--ink)] hover:bg-black/5 transition-colors"
          title="Reset & Center"
          aria-label="Reset & Center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 rounded-full text-[var(--ink)] hover:bg-black/10 transition-colors border-l border-[rgba(20,20,22,0.1)] ml-0.5"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Graph View'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Graph View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-600" /> : <Expand className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
