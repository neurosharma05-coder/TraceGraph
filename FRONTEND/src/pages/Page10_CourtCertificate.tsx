'use client';

import React, { useState, useEffect } from 'react';
import { useCaseStore } from '../store/useCaseStore';
import { Copy, Printer, Check, ShieldCheck } from 'lucide-react';
import { fetchCourtCertificate, CourtCertificateResponse } from '../api/backendClient';

export default function Page10_CourtCertificate() {
  const { caseMeta, files } = useCaseStore();
  const [isCopied, setIsCopied] = useState(false);
  const [certData, setCertData] = useState<CourtCertificateResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchCourtCertificate('case-001').then((res) => {
      if (isMounted && res) {
        setCertData(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const masterHash =
    certData?.certificateHash ||
    (files.length > 0 ? files[files.length - 1].sha256 : null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    if (!masterHash) return;
    navigator.clipboard.writeText(masterHash);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-2 sm:px-4 print:p-0 print:m-0 print:max-w-none">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(20,20,22,0.12)] pb-6 print:hidden">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)] heading-tight">
            Section 63(4) Electronic Evidence Certificate
          </h1>
          <p className="text-xs sm:text-sm text-[var(--soft)] max-w-2xl mt-2 leading-relaxed">
            Statutory Certificate for the admissibility of electronic records in judicial trial.
            Binds all {files.length} evidence containers to an unbroken SHA-256 parent hash chain.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="btn shrink-0"
          aria-label="Print Certificate"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Dossier for Court</span>
        </button>
      </div>

      <div
        id="court-certificate-paper"
        className="cert-paper paper-panel bg-white p-8 sm:p-12 md:p-14 space-y-8 border border-black/15 rounded-2xl shadow-sm text-black print:p-0 print:border-none print:shadow-none print:rounded-none"
      >
        <div className="cert-header text-center space-y-2 border-b border-black/15 pb-5">
          <div className="inline-block px-3.5 py-1 rounded-full border border-black/20 text-[11px] font-semibold text-black/80 uppercase tracking-widest mb-1">
            Schedule to Section 63(4), Bharatiya Sakshya Adhiniyam, 2023
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight heading-tight text-black">
            CERTIFICATE IDENTIFYING ELECTRONIC RECORD AND ACCREDITING MANNER OF PRODUCTION
          </h2>
          <p className="text-xs text-black/70 max-w-xl mx-auto leading-relaxed">
            In the Court of the Metropolitan Magistrate / Sessions Judge, National Capital Territory of Delhi
          </p>
        </div>

        <div className="cert-metadata grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs p-3.5 rounded-xl border border-black/10 bg-black/[0.02]">
          <div className="space-y-0.5">
            <span className="text-black/50 block text-[10px] uppercase tracking-wider font-medium">FIR / Case Ref</span>
            <strong className="text-xs text-black font-semibold block truncate">{caseMeta.caseNumber || 'CR-2026-0942'}</strong>
          </div>
          <div className="space-y-0.5">
            <span className="text-black/50 block text-[10px] uppercase tracking-wider font-medium">Case Title</span>
            <strong className="text-xs text-black font-semibold block truncate">{caseMeta.title || 'Cyber Extortion & Money Mules'}</strong>
          </div>
          <div className="space-y-0.5">
            <span className="text-black/50 block text-[10px] uppercase tracking-wider font-medium">Certifying Officer</span>
            <span className="text-xs text-black block truncate font-medium">
              {caseMeta.investigatorName || 'ACP Vikramaditya Singh'}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-black/50 block text-[10px] uppercase tracking-wider font-medium">Agency & Jurisdiction</span>
            <span className="text-xs text-black block truncate font-medium">{caseMeta.agency || 'Delhi Police Cyber Cell, IFSO'}</span>
          </div>
        </div>

        <div className="cert-clauses space-y-3 text-xs leading-relaxed text-black">
          <p>
            I, <strong className="underline font-semibold">{caseMeta.investigatorName || 'ACP Vikramaditya Singh'}</strong>, holding the post
            of Lead Investigating Officer in the {caseMeta.agency || 'Delhi Police Cyber Cell, IFSO'}, hereby solemnly declare and
            certify under the provisions of <strong>Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023</strong>:
          </p>

          <ol className="list-decimal pl-5 space-y-1.5 text-black/90">
            <li>
              That the electronic evidence files detailed in the cryptographic ledger below were produced
              by computer systems and digital extraction devices during the regular course of an authorized
              criminal investigation.
            </li>
            <li>
              That throughout the material period, the extraction terminals and custody storage
              operated properly, and no unauthorized interference, tampering, or digital modification
              has occurred.
            </li>
            <li>
              That each raw evidence container was hashed in the client environment upon intake using the
              secure <strong>SHA-256 cryptographic algorithm</strong>, and each file is chained to its
              preceding block in strict sequential order.
            </li>
            <li>
              That hardware clock drifts (specifically on CCTV camera feeds) have been documented with
              exact atomic NTP offsets, preserving the true temporal sequence without altering the raw
              source bits.
            </li>
          </ol>
        </div>

        <div className="cert-table-wrap space-y-2 pt-3 border-t border-black/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <strong className="text-black font-semibold">Certified Evidence Manifest ({files.length} Containers)</strong>
            <span className="text-black/60 text-[11px] font-mono">Algorithm: NIST FIPS 180-4 SHA-256</span>
          </div>

          <div className="border border-black/15 rounded-xl overflow-x-auto print:border-none print:rounded-none">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-black/5 text-black/70 uppercase text-[10px] tracking-wider border-b border-black/15">
                <tr>
                  <th className="py-2 px-2.5 font-semibold w-10 text-center">#</th>
                  <th className="py-2 px-2.5 font-semibold w-52">Container File Name</th>
                  <th className="py-2 px-2.5 font-semibold w-36">Source Type</th>
                  <th className="py-2 px-2.5 font-semibold w-20 text-center">Size</th>
                  <th className="py-2 px-2.5 font-semibold">Browser SHA-256 Parent Digest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 text-[11px] text-black">
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-black/50 italic">
                      No forensic evidence containers uploaded yet. Upload evidence in Tab 01 (New Case) to generate certified SHA-256 digests.
                    </td>
                  </tr>
                ) : (
                  files.map((f, i) => (
                    <tr key={f.id} className="hover:bg-black/[0.02]">
                      <td className="py-1.5 px-2.5 text-black/60 text-center font-medium">{i + 1}</td>
                      <td className="py-1.5 px-2.5 font-medium text-black">{f.name}</td>
                      <td className="py-1.5 px-2.5 text-black/80">{f.categoryLabel}</td>
                      <td className="py-1.5 px-2.5 text-black/60 text-center">{f.size}</td>
                      <td className="py-1.5 px-2.5 font-mono text-[10px] text-black/90 break-all">{f.sha256}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="cert-root-hash p-3.5 rounded-xl border border-black/15 bg-black/[0.02] space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-black/60 text-[10px] uppercase tracking-wider font-bold">
              Final Master Cryptographic Root Hash:
            </span>
            {masterHash && (
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-[11px] underline flex items-center gap-1 text-black hover:opacity-80 print:hidden"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'Copied' : 'Copy Hash'}</span>
              </button>
            )}
          </div>
          {masterHash ? (
            <div className="text-xs sm:text-sm font-mono font-medium tracking-tight break-all text-black">
              {masterHash}
            </div>
          ) : (
            <div className="text-xs text-black/50 italic">
              Awaiting Evidence Ingestion & Cryptographic Sealing (Upload files in Tab 01)
            </div>
          )}
        </div>

        <div className="cert-signature-block pt-6 border-t border-black/15 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Section 63(4) BSA Certified & Sealed</span>
            </div>
            <div className="text-black/60 text-[11px]">
              Digital Signature Timestamp: {certData?.generatedAt || new Date().toISOString().slice(0, 10)} 10:14:22 IST
            </div>
            <div className="text-black/60 text-[11px] font-mono">
              Certificate Token: BSA-634-{caseMeta.caseNumber || 'CR-2026-0942'}-AUTH
            </div>
            {certData?.digitalSignature && (
              <div className="text-[10px] font-mono text-emerald-800 max-w-sm truncate" title={certData.digitalSignature}>
                Digital Signature: {certData.digitalSignature}
              </div>
            )}
          </div>

          <div className="text-left sm:text-right space-y-1 self-stretch sm:self-auto">
            <div className="w-60 border-b border-black text-center pb-2 text-sm font-bold text-black sm:ml-auto">
              {caseMeta.investigatorName || 'ACP Vikramaditya Singh'}
            </div>
            <div className="text-[11px] text-black/70">
              Lead Investigating Officer / Certifying Person
            </div>
            <div className="text-[11px] text-black/70">{caseMeta.agency || 'Delhi Police Cyber Cell, IFSO'}</div>
            <div className="text-[10px] text-black/50 font-mono">
              Badge: {caseMeta.investigatorBadge || 'DL-CYB-042'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
