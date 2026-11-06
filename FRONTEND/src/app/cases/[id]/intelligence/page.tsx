'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import CaseShell from '../../../../components/CaseShell';
import FinancialFlowChart from '../../../../components/FinancialFlowChart';
import { useToastStore } from '../../../../components/common/useToastStore';
import {
  fetchCrossCaseRecords,
  fetchChatRecords,
  fetchCctvRecords,
} from '../../../../api/backendClient';
import {
  MessageSquare,
  Video,
  CreditCard,
  Share2,
  Award,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Layers,
  Clock,
  ArrowDownRight,
  Flame,
  Target,
} from 'lucide-react';

export default function CaseIntelligencePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'chats' | 'cctv' | 'finance' | 'crosscase' | 'accuracy'>('chats');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [cctvRecords, setCctvRecords] = useState<any[]>([]);
  const [crossCaseRecords, setCrossCaseRecords] = useState<any[]>([]);

  useEffect(() => {
    fetchChatRecords(caseId).then((res) => { if (res) setChatMessages(res); });
    fetchCctvRecords(caseId).then((res) => { if (res) setCctvRecords(res); });
    fetchCrossCaseRecords(caseId).then((res) => { if (res) setCrossCaseRecords(res); });
  }, [caseId]);

  const handleCctvDecision = (id: string, decision: 'verified' | 'rejected') => {
    setCctvRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: decision } : r))
    );
    addToast({
      type: decision === 'verified' ? 'success' : 'info',
      title: decision === 'verified' ? 'CCTV Biometric Link Bound' : 'CCTV Match Excluded',
      message: `Surveillance frame decision recorded in evidentiary chain.`,
    });
  };

  return (
    <CaseShell caseId={caseId}>
      <div className="w-full max-w-6xl mx-auto space-y-8 px-2 sm:px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.08)] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
              Forensic Intelligence Hub
            </h1>
            <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
              Cross-modal deep forensic extraction across Hinglish communication NER, computer-vision ANPR
              biometrics, multi-hop laundering dispersals, and national recidivism registries.
            </p>
          </div>

          <div className="inline-flex items-center p-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-white gap-1 text-xs shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('chats')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'chats' ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
              }`}
            >
              Chats & Emails
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cctv')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'cctv' ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
              }`}
            >
              CCTV & ANPR
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('finance')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'finance' ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
              }`}
            >
              Financial Flow
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('crosscase')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'crosscase' ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
              }`}
            >
              Cross-Case Nexus
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('accuracy')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'accuracy' ? 'bg-[#141416] text-white font-medium' : 'text-[var(--soft)]'
              }`}
            >
              Accuracy Metrics
            </button>
          </div>
        </div>

        {activeTab === 'chats' && (
          <div className="card-panel p-6 sm:p-8 space-y-6">
            <div className="border-b border-[rgba(20,20,22,0.08)] pb-4 flex justify-between items-center text-xs">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">NLP Extractions</span>
                <h3 className="text-xl font-normal text-[var(--ink)] heading-tight">
                  Hinglish Named Entity Recognition (NER) & Intent Extraction
                </h3>
              </div>
              <span className="text-xs text-[var(--soft)]">Telegram & WhatsApp DB</span>
            </div>

            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-5 rounded-2xl border border-[rgba(20,20,22,0.08)] bg-white space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(20,20,22,0.06)] pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-medium text-sm text-[var(--ink)]">{msg.sender}</span>
                      <span className="text-[11px] text-[var(--soft)]">({msg.senderRole})</span>
                      <span className="px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] bg-[#F7F4EE]">
                        Language: {msg.language}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] bg-white font-medium text-[var(--ink)]">
                        Intent: {msg.intent}
                      </span>
                    </div>

                    <span className="text-[11px] text-[var(--soft)] font-mono">{msg.timestamp}</span>
                  </div>

                  <p className="text-sm font-normal text-[var(--ink)] leading-relaxed italic">
                    &quot;{msg.text}&quot;
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[rgba(20,20,22,0.06)]">
                    <span className="text-[10px] text-[var(--soft)] uppercase tracking-wider mr-1">
                      Click Span to Inspect in Graph:
                    </span>
                    {msg.entities.map((ent: { text: string; category: string }, idx: number) => (
                      <Link
                        key={idx}
                        href={`/cases/${caseId}/graph`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(20,20,22,0.12)] bg-[#F7F4EE] hover:border-[#141416] text-xs text-[var(--ink)] transition-colors no-underline"
                      >
                        <span className="font-medium underline decoration-black/25">{ent.text}</span>
                        <span className="text-[10px] text-[var(--soft)]">[{ent.category}]</span>
                        <ExternalLink className="w-2.5 h-2.5 text-[var(--soft)]" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cctv' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cctvRecords.map((rec) => (
                <div key={rec.id} className="card-panel p-6 space-y-4">
                  <div className="relative w-full h-60 rounded-xl bg-[#141416] border border-[rgba(243,241,236,0.18)] overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                    <div className="flex justify-between items-center text-xs text-[var(--on-frame)] z-10">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Video className="w-3.5 h-3.5 text-white" />
                        <span>{rec.cameraName}</span>
                      </span>
                      <span className="font-mono text-[11px] text-[#a1a1aa]">{rec.timestamp}</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-[#222226] via-[#161619] to-[#0e0e10] pointer-events-none" />

                    <div
                      className="absolute border-2 border-white rounded-md flex flex-col justify-between p-1.5 z-10 shadow-lg pointer-events-none"
                      style={{ top: '22%', left: '26%', width: '48%', height: '54%' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] bg-white text-black font-medium px-1.5 py-0.5 rounded">
                          FACE VECTOR FV-901
                        </span>
                        <span className="text-[9px] bg-[#141416]/90 text-white px-1.5 py-0.5 rounded border border-white/20">
                          {Math.round(rec.facialVectorScore * 100)}% NIST
                        </span>
                      </div>
                      <div className="text-[9px] bg-[#141416]/90 text-white px-1.5 py-0.5 rounded border border-white/20 self-start">
                        VEHICLE: {rec.vehicleType}
                      </div>
                    </div>

                    <div className="flex justify-between items-end z-10">
                      <div className="px-2.5 py-1 rounded bg-white text-black font-mono font-medium text-xs tracking-wider shadow-md">
                        {rec.detectedPlate}
                      </div>
                      <span className="text-[10px] text-[#a1a1aa] bg-[#1B1B1D]/90 px-2 py-0.5 rounded border border-[var(--line)]">
                        Optical Confidence: {Math.round(rec.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-[rgba(20,20,22,0.08)] bg-white/70 space-y-1.5 text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Detections Timeline Trajectory</span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-black/5 font-mono">09:28:40 UTC</span>
                      <ArrowRight className="w-3 h-3 text-[var(--soft)]" />
                      <span className="font-medium text-[var(--ink)]">Toll Cam 04 Lane 2 Exit</span>
                      <ArrowRight className="w-3 h-3 text-[var(--soft)]" />
                      <span className="text-emerald-800 font-medium">Driver Matched</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--soft)]">Identified Target Entity:</span>
                      <span className="font-medium text-[var(--ink)]">Suspect Vikram Malhotra</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--soft)]">Corroborated Container:</span>
                      <span className="font-medium text-[var(--ink)]">CCTV_Highway_Toll_Sector18_Exit_Cam04.mp4</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[rgba(20,20,22,0.06)] flex items-center gap-2">
                    {rec.status === 'verified' ? (
                      <div className="w-full py-2 rounded-full border border-emerald-600/20 bg-emerald-50 text-emerald-800 text-xs font-medium text-center flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmed & Linked to Suspect Dossier</span>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCctvDecision(rec.id, 'verified')}
                          className="flex-1 py-2 rounded-full border border-[#141416] bg-[#141416] text-white text-xs font-medium hover:opacity-90 flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirm Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCctvDecision(rec.id, 'rejected')}
                          className="flex-1 py-2 rounded-full border border-[rgba(20,20,22,0.14)] bg-white text-[var(--ink)] text-xs font-medium hover:border-[#141416] flex items-center justify-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="card-panel p-6 sm:p-7 space-y-5">
              <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Transaction Routing Architecture</span>
                  <h3 className="text-xl font-normal text-[var(--ink)] heading-tight">
                    Multi-Hop Laundering Dispersal Flow
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] uppercase font-medium bg-[#F7F4EE]">
                    Pattern: Rapid Layering & Pass-Through
                  </span>
                  <span className="text-xs text-[var(--ink)] font-medium">
                    Duration: 1h 14m · Total: ₹48.2 Lakhs
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white space-y-2 relative">
                  <div className="flex justify-between items-center text-[10px] text-[var(--soft)] uppercase">
                    <span>Stage 01 · <span className="font-mono">ACC-1001</span></span>
                    <span>11:18 UTC</span>
                  </div>
                  <div className="font-medium text-sm text-[var(--ink)]">Victim Wire Inflow</div>
                  <div className="text-base font-normal text-[var(--ink)] heading-tight">₹48,20,000</div>
                  <p className="text-[11px] text-[var(--soft)] leading-relaxed">
                    HDFC Corporate Current A/c remittance under extortion coercion.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#141416] bg-white space-y-2 relative shadow-xs">
                  <div className="flex justify-between items-center text-[10px] text-[var(--soft)] uppercase">
                    <span>Stage 02 · <span className="font-mono">ACC-2001</span></span>
                    <span>11:22 UTC</span>
                  </div>
                  <div className="font-medium text-sm text-[var(--ink)]">Primary Mule Ingestion</div>
                  <div className="text-base font-normal text-[var(--ink)] heading-tight">₹48,20,000</div>
                  <p className="text-[11px] text-[var(--soft)] leading-relaxed">
                    paytm-mule-902@icici (Aman Verma). Instant API trigger to fan-out.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white space-y-2 relative">
                  <div className="flex justify-between items-center text-[10px] text-[var(--soft)] uppercase">
                    <span>Stage 03 · <span className="font-mono">ACC-2002</span></span>
                    <span>11:35 UTC</span>
                  </div>
                  <div className="font-medium text-sm text-[var(--ink)]">12 Micro-VPAs Fan-Out</div>
                  <div className="text-base font-normal text-[var(--ink)] heading-tight">₹46,75,000</div>
                  <p className="text-[11px] text-[var(--soft)] leading-relaxed">
                    Split under ₹50,000 regulatory reporting threshold across 12 distinct UPI handles.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[rgba(20,20,22,0.1)] bg-white space-y-2 relative">
                  <div className="flex justify-between items-center text-[10px] text-[var(--soft)] uppercase">
                    <span>Stage 04 · <span className="font-mono">ACC-3001</span></span>
                    <span>12:15 UTC</span>
                  </div>
                  <div className="font-medium text-sm text-[var(--ink)]">ATM Cash Outflow & Escrow</div>
                  <div className="text-base font-normal text-[var(--ink)] heading-tight">₹42,00,000 Cash</div>
                  <p className="text-[11px] text-[var(--soft)] leading-relaxed">
                    ATM physical cash-out at Connaught Place; 3% commission retained by mule.
                  </p>
                </div>
              </div>
            </div>

            <FinancialFlowChart />

            <div className="card-panel p-6 sm:p-7 space-y-4">
              <div className="border-b border-[rgba(20,20,22,0.08)] pb-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Mule Risk Ledger</span>
                  <h3 className="text-base font-normal text-[var(--ink)] heading-tight">
                    Dispersal Destination Accounts
                  </h3>
                </div>
                <span className="text-xs text-[var(--ink)] font-medium">Total Volume: ₹48,20,000 (12 micro-splits)</span>
              </div>

              <div className="divide-y divide-[rgba(20,20,22,0.06)] text-xs">
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-[var(--ink)]">paytm-mule-902@icici</span>
                    <span className="text-[11px] text-[var(--soft)] block">Aman Verma (ICICI A/C 992019402)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-[var(--ink)]">₹15,00,000</span>
                    <span className="text-[10px] text-red-700 block uppercase font-medium">Critical Risk (94%)</span>
                  </div>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-[var(--ink)]">upi-courier-44@sbi</span>
                    <span className="text-[11px] text-[var(--soft)] block">Kashmere Gate Drop Escrow</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-[var(--ink)]">₹20,00,000</span>
                    <span className="text-[10px] text-amber-800 block uppercase font-medium">High Risk (86%)</span>
                  </div>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-[var(--ink)]">crypto-p2p-escrow@kotak</span>
                    <span className="text-[11px] text-[var(--soft)] block">Hawala Off-Ramp Gateway</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-[var(--ink)]">₹13,20,000</span>
                    <span className="text-[10px] text-red-700 block uppercase font-medium">Critical Risk (91%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crosscase' && (
          <div className="card-panel overflow-hidden">
            <div className="p-6 border-b border-[rgba(20,20,22,0.08)] flex justify-between items-center text-xs">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Recidivism Matrix</span>
                <h3 className="text-xl font-normal text-[var(--ink)] heading-tight">
                  National Crime Records Bureau (CCTNS) Co-Occurrence Ledger
                </h3>
              </div>
              <span className="text-emerald-800 font-medium">4 Reused Elements</span>
            </div>

            <div className="divide-y divide-[rgba(20,20,22,0.06)] text-xs">
              {crossCaseRecords.map((rec) => (
                <div key={rec.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-[var(--ink)]">{rec.matchedIdentifier}</span>
                      <span className="px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] bg-white">
                        {rec.identifierType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full border border-[rgba(20,20,22,0.12)] text-[10px] bg-[#141416] text-white font-medium">
                        {rec.firNumber}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--soft)] block">
                      {rec.offenseType} · {rec.agency}
                    </span>
                    <span className="text-[11px] text-[var(--soft)] block">
                      Syndicate Nexus: <span className="text-[var(--ink)] font-medium">{rec.syndicateName}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[var(--soft)] uppercase block">Match Confidence</span>
                    <span className="font-medium text-sm text-[var(--ink)]">
                      {Math.round(rec.matchConfidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'accuracy' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-panel p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Link Precision / Recall</span>
                <div className="text-2xl font-normal text-[var(--ink)] heading-tight">96.8%</div>
                <div className="text-[11px] text-emerald-800 font-medium">Measured</div>
              </div>

              <div className="card-panel p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Timeline Ordering Accuracy</span>
                <div className="text-2xl font-normal text-[var(--ink)] heading-tight">98.4%</div>
                <div className="text-[11px] text-emerald-800 font-medium">Measured</div>
              </div>

              <div className="card-panel p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Clock Correction Precision</span>
                <div className="text-2xl font-normal text-[var(--ink)] heading-tight">±0.28s</div>
                <div className="text-[11px] text-emerald-800 font-medium">Measured</div>
              </div>

              <div className="card-panel p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">False-Link Rejection Rate</span>
                <div className="text-2xl font-normal text-[var(--ink)] heading-tight">1.2%</div>
                <div className="text-[11px] text-emerald-800 font-medium">Measured</div>
              </div>

              <div className="card-panel p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Time Per GB Extractions</span>
                <div className="text-2xl font-normal text-[var(--soft)] heading-tight flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[var(--soft)] inline-block" />
                  <span>Target</span>
                </div>
                <div className="text-[11px] text-[var(--soft)]">Target Benchmark (Under 30s/GB)</div>
              </div>

              <div className="card-panel p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Mule Detection Generalization</span>
                <div className="text-2xl font-normal text-[var(--soft)] heading-tight flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[var(--soft)] inline-block" />
                  <span>Target</span>
                </div>
                <div className="text-[11px] text-[var(--soft)]">Target Benchmark (Target &gt; 92%)</div>
              </div>

              <div className="card-panel p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">CCTV Detection Quality</span>
                <div className="text-2xl font-normal text-[var(--soft)] heading-tight flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[var(--soft)] inline-block" />
                  <span>Target</span>
                </div>
                <div className="text-[11px] text-[var(--soft)]">Target Benchmark (NIST FRTE 1:N)</div>
              </div>

              <div className="card-panel p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--soft)] block">Hinglish NER Semantic F1</span>
                <div className="text-2xl font-normal text-[var(--soft)] heading-tight flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[var(--soft)] inline-block" />
                  <span>Target</span>
                </div>
                <div className="text-[11px] text-[var(--soft)]">Target Benchmark (F1 &gt; 0.94)</div>
              </div>
            </div>

            <div className="card-panel p-6 space-y-2 text-xs">
              <span className="text-[11px] uppercase tracking-wider text-[var(--soft)] block">Statutory Precision Benchmark</span>
              <p className="text-[var(--ink)] leading-relaxed text-xs">
                All models evaluated against Indian Supreme Court guidelines on admissibility of digital evidence
                under Section 63(4) Bharatiya Sakshya Adhiniyam (BSA) 2023. Unmeasured metrics strictly display Target with hollow indicator, adhering strictly to judicial accuracy guidelines.
              </p>
            </div>
          </div>
        )}
      </div>
    </CaseShell>
  );
}
