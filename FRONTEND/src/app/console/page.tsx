import React from 'react';
import ConsoleShell from '@/src/components/ConsoleShell';

export const metadata = {
  title: 'TraceGraph Console: Multi-Modal Forensic Investigation',
  description:
    'Forensic evidence correlation, 7-source multi-modal ingestion, SHA-256 hash chains, and Section 63(4) BSA compliance.',
};

export default function ConsolePage() {
  return <ConsoleShell initialModule="upload" />;
}

