import type { AppProps } from 'next/app';
import { Inter, Inter_Tight } from 'next/font/google';
import '@/src/app/globals.css';
import '@/src/styles/variables.css';
import Cursor from '@/src/components/Cursor';

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${interTight.variable}`} style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
      <Cursor />
      <div className="frame min-h-screen bg-[var(--frame)] text-[var(--on-frame)] p-3 sm:p-5 md:p-6">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
