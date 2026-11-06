'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Cursor from '@/src/components/Cursor';
import { EVIDENCE_SOURCES } from '@/src/lib/evidenceSources';
import { I18N_DICTIONARY } from '@/src/i18n/dictionary';
import { useLanguageStore } from '@/src/store/useLanguageStore';
import { useTraceStore } from '@/src/store/useTraceStore';

export default function HomePage() {
  const { language: lang, setLanguage: setLang } = useLanguageStore();
  const { traceMode, setTraceMode } = useTraceStore();
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const t = I18N_DICTIONARY[lang] || I18N_DICTIONARY.en;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const qs = new URLSearchParams(window.location.search);
      const urlTheme = qs.get('theme');
      if (urlTheme === 'indigo' || urlTheme === 'dark') {
        document.documentElement.dataset.theme = urlTheme;
      }
    }
  }, []);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      setVideoLoaded(true);
    }
  }, []);

  return (
    <>
      <Cursor />

      <div className="frame">
        <header className="top">
          <a className="logo" href="#top">
            <i aria-hidden="true" />
            <span>TraceGraph</span>
          </a>

          <nav className="navtab" aria-label="Main">
            <div className="pill">
              <a href="#sources">{t.n1}</a>
              <a href="#help">{t.n2}</a>
              <a href="#sources">{t.n3}</a>
              <a href="#foot">{t.n4}</a>
            </div>
          </nav>

          <div className="right">

            <select
              className="lang"
              id="lang"
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'hi')}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>

            <a
              href="/console"
              className="btn"
              aria-label={t.open}
            >
              <b>›</b>
              <span>{t.open}</span>
            </a>
          </div>
        </header>

        <section className="hero" id="top">
          <div>
            <h1>
              <span>{t.h1}</span>
              <span>
                <svg className="stack" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    d="M24 4 44 14 24 24 4 14Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4 22 24 32 44 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4 22l20 10 20-10 0 4-20 10L4 26Z"
                    fill="var(--warm)"
                  />
                  <path
                    d="M4 32 24 42 44 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
                <em style={{ fontStyle: 'normal' }}>{t.h2}</em>
              </span>
              <span>{t.h3}</span>
            </h1>

            <a
              href="/console"
              className="cta"
              aria-label={t.cta}
            >
              <b>›</b>
              <span>{t.cta}</span>
            </a>

            <p>{t.s1p}</p>
          </div>

          <div
            className={`stage ${traceMode ? 'trace' : ''} ${videoLoaded ? 'hasvid' : ''}`}
            id="stage"
          >
            <video
              ref={videoRef}
              className="vid"
              id="vid"
              src="https://cdn.dribbble.com/userupload/5426300/file/original-ac360df9513feded06e4effa294ee544.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={handleVideoLoaded}
              onCanPlay={handleVideoLoaded}
              onPlay={handleVideoLoaded}
              aria-label="Layered evidence sheets with an investigation lens"
            >
              <source
                src="https://cdn.dribbble.com/userupload/5426300/file/original-ac360df9513feded06e4effa294ee544.mp4"
                type="video/mp4"
              />
              <source src="/hero-trace.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="mode">
            <span>{t.traceMode}</span>
            <div className="tg" role="group" aria-label={t.traceMode}>
              <button
                type="button"
                id="on"
                aria-pressed={traceMode}
                onClick={() => setTraceMode(true)}
              >
                {t.on}
              </button>
              <button
                type="button"
                id="off"
                aria-pressed={!traceMode}
                onClick={() => setTraceMode(false)}
              >
                {t.off}
              </button>
            </div>
          </div>
        </section>

        <section className="dark" id="sources">
          <h2>{t.s1}</h2>
          <div className="lead">
            <span>{t.s1p}</span>
            <a
              href="/console"
              className="cta text-white"
              style={{ color: 'var(--on-frame)' }}
              aria-label={t.cta}
            >
              <b>›</b>
              <span>{t.cta}</span>
            </a>
          </div>

          <div className="marq">
            <div className="track" id="track">
              {[...EVIDENCE_SOURCES, ...EVIDENCE_SOURCES].map((src, i) => (
                <div key={`${src.id}-${i}`} className="src">
                  <svg
                    viewBox="0 0 24 24"
                    dangerouslySetInnerHTML={{ __html: src.iconSvg }}
                  />
                  <span>{src.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dark" id="help">
          <h2>{t.s2}</h2>
          <div className="lead">
            <span>{t.s2p}</span>
            <a href="#top">
              <b>›</b>
              <span>Learn more</span>
            </a>
          </div>

          <div className="cards">
            <article className="card" tabIndex={0}>
              <span className="n">/ 01</span>
              <Image
                src="/assets/forensic/image_4b4f48a8.png"
                alt="CCTV surveillance evidence camera"
                width={160}
                height={160}
                className="pic object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
              <h3>{t.c1}</h3>
              <div className="more">
                <div>
                  <p>{t.c1_desc1}</p>
                  <p className="flex items-start gap-2.5">
                    <span>{t.c1_desc2}</span>
                    <Image
                      src="/assets/forensic/image_4b4f48a8.png"
                      alt="CCTV camera thumbnail"
                      width={42}
                      height={42}
                      className="shrink-0 rounded-md object-contain p-0.5 bg-black/10 border border-black/15 shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                  </p>
                </div>
                <a
                  href="#sources"
                  className="flex items-center gap-2 font-medium text-xs text-inherit no-underline"
                >
                  <b>›</b>
                  <span>Learn more</span>
                </a>
              </div>
            </article>

            <article className="card" tabIndex={0}>
              <span className="n">/ 02</span>
              <Image
                src="/assets/forensic/image_dcc92373.png"
                alt="Timeline graph reconstruction"
                width={160}
                height={160}
                className="pic object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
              <h3>{t.c2}</h3>
              <div className="more">
                <div>
                  <p>{t.c2_desc1}</p>
                  <p className="flex items-start gap-2.5">
                    <span>{t.c2_desc2}</span>
                    <Image
                      src="/assets/forensic/image_dcc92373.png"
                      alt="Timeline graph thumbnail"
                      width={42}
                      height={42}
                      className="shrink-0 rounded-md object-contain p-0.5 bg-black/10 border border-black/15 shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                  </p>
                </div>
                <a
                  href="#help"
                  className="flex items-center gap-2 font-medium text-xs text-inherit no-underline"
                >
                  <b>›</b>
                  <span>Learn more</span>
                </a>
              </div>
            </article>

            <article className="card" tabIndex={0}>
              <span className="n">/ 03</span>
              <svg className="pic" viewBox="0 0 160 160" aria-hidden="true">
                <path
                  d="M80 14 130 34v42c0 32-22 56-50 70C52 132 30 108 30 76V34Z"
                  fill="#D9DCE1"
                />
                <path
                  d="M80 24 120 40v36c0 26-17 46-40 58-23-12-40-32-40-58V40Z"
                  fill="#F4F3F0"
                  stroke="var(--warm)"
                  strokeWidth="7"
                />
                <path
                  d="M60 78 76 94 104 62"
                  fill="none"
                  stroke="#2b2b2e"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3>{t.c3}</h3>
              <div className="more">
                <div>
                  <p>{t.c3_desc1}</p>
                  <p>{t.c3_desc2}</p>
                </div>
                <a
                  href="#foot"
                  className="flex items-center gap-2 font-medium text-xs text-inherit no-underline"
                >
                  <b>›</b>
                  <span>Learn more</span>
                </a>
              </div>
            </article>
          </div>
        </section>

        <div id="foot" />
      </div>
    </>
  );
}
