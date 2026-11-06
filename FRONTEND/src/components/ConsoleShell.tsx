'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCaseStore } from '../store/useCaseStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { I18N_DICTIONARY } from '../i18n/dictionary';
import Page1_NewCaseUpload from '../pages/Page1_NewCaseUpload';
import Page2_EvidenceVault from '../pages/Page2_EvidenceVault';
import Page3_KnowledgeGraph from '../pages/Page3_KnowledgeGraph';
import Page4_UnifiedTimeline from '../pages/Page4_UnifiedTimeline';
import Page5_GeospatialMap from '../pages/Page5_GeospatialMap';
import Page6_ConflictEngine from '../pages/Page6_ConflictEngine';
import Page7_EntityResolution from '../pages/Page7_EntityResolution';
import Page8_CrossCaseIntel from '../pages/Page8_CrossCaseIntel';
import Page9_HypothesisBuilder from '../pages/Page9_HypothesisBuilder';
import Page10_CourtCertificate from '../pages/Page10_CourtCertificate';
import Cursor from './Cursor';
import { Lock } from 'lucide-react';

export type ConsoleModule =
  | 'upload'
  | 'vault'
  | 'graph'
  | 'timeline'
  | 'map'
  | 'conflicts'
  | 'entities'
  | 'crosscase'
  | 'hypotheses'
  | 'court';

interface NavItem {
  id: ConsoleModule;
  num: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'upload',     num: '01', label: 'New Case' },
  { id: 'vault',      num: '02', label: 'Evidence Vault' },
  { id: 'graph',      num: '03', label: 'Knowledge Graph' },
  { id: 'timeline',   num: '04', label: 'Timeline' },
  { id: 'map',        num: '05', label: 'Geospatial' },
  { id: 'conflicts',  num: '06', label: 'Feasibility' },
  { id: 'entities',   num: '07', label: 'Entities' },
  { id: 'crosscase',  num: '08', label: 'Cross-Case' },
  { id: 'hypotheses', num: '09', label: 'Hypotheses' },
  { id: 'court',      num: '10', label: 'Court Certificate' },
];

export default function ConsoleShell({ initialModule = 'upload' }: { initialModule?: ConsoleModule }) {
  const [activeModule, setActiveModule] = useState<ConsoleModule>(initialModule);
  const { caseMeta, isLiveConnected, syncFromBackend } = useCaseStore();
  const { language, setLanguage } = useLanguageStore();
  const t = I18N_DICTIONARY[language] || I18N_DICTIONARY.en;

  useEffect(() => {
    syncFromBackend('case-001');
  }, [syncFromBackend]);

  const handlePipelineComplete = () => setActiveModule('graph');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'upload':     return <Page1_NewCaseUpload onPipelineComplete={handlePipelineComplete} />;
      case 'vault':      return <Page2_EvidenceVault />;
      case 'graph':      return <Page3_KnowledgeGraph />;
      case 'timeline':   return <Page4_UnifiedTimeline />;
      case 'map':        return <Page5_GeospatialMap />;
      case 'conflicts':  return <Page6_ConflictEngine />;
      case 'entities':   return <Page7_EntityResolution />;
      case 'crosscase':  return <Page8_CrossCaseIntel />;
      case 'hypotheses': return <Page9_HypothesisBuilder />;
      case 'court':      return <Page10_CourtCertificate />;
      default:           return <Page1_NewCaseUpload onPipelineComplete={handlePipelineComplete} />;
    }
  };

  return (
    <>
      <Cursor />

      <div className="frame">

        <header className="top" style={{ position: 'relative', marginBottom: '8px' }}>
          <Link href="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i aria-hidden="true" />
            <span>TraceGraph</span>
          </Link>

          <div className="right">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid var(--line)',
                fontSize: '0.78rem',
                color: 'var(--on-frame)',
                background: 'transparent',
              }}
            >
              <Lock className="w-3 h-3" style={{ color: 'var(--accent)' }} />
              <span>{caseMeta.caseNumber}</span>
              <span style={{ color: 'var(--accent)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sealed</span>
            </span>

            <select
              className="lang"
              aria-label="Language selector"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>

            <Link href="/cases" className="btn" style={{ textDecoration: 'none' }}>
              <b>›</b>
              <span>Cases</span>
            </Link>

            <Link href="/" className="btn" style={{ textDecoration: 'none' }}>
              <b>‹</b>
              <span>Landing</span>
            </Link>
          </div>
        </header>

        <section className="console-panel">
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(20, 20, 22, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModule(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: isActive ? 500 : 400,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isActive ? '1px solid #141416' : '1px solid rgba(20, 20, 22, 0.12)',
                    background: isActive ? '#141416' : 'transparent',
                    color: isActive ? '#F7F4EE' : '#55555a',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#141416';
                      e.currentTarget.style.borderColor = 'rgba(20, 20, 22, 0.25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#55555a';
                      e.currentTarget.style.borderColor = 'rgba(20, 20, 22, 0.12)';
                    }
                  }}
                >
                  <span style={{ opacity: isActive ? 0.7 : 0.45, fontSize: '0.68rem' }}>{item.num}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <main className="console-main">
            {renderActiveModule()}
          </main>
        </section>

      </div>
    </>
  );
}
