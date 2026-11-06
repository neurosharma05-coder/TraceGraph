import type {Metadata} from 'next';
import './globals.css';

import { Inter, Inter_Tight } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});

export const metadata: Metadata = {
  title: 'TraceGraph: every trace connects',
  description:
    'TraceGraph connects mobile, social, CCTV, cloud, financial, email and network evidence into one verifiable time-trusted knowledge graph.',
  openGraph: {
    title: 'TraceGraph: every trace connects',
    description:
      'TraceGraph connects mobile, social, CCTV, cloud, financial, email and network evidence into one verifiable time-trusted knowledge graph.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TraceGraph: every trace connects',
    description:
      'TraceGraph connects mobile, social, CCTV, cloud, financial, email and network evidence into one verifiable time-trusted knowledge graph.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" data-theme="ref" className={`${inter.variable} ${interTight.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
