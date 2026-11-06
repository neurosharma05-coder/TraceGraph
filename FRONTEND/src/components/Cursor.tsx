'use client';

import { useEffect, useRef } from 'react';
import { useTraceStore } from '../store/useTraceStore';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const setTilt = useTraceStore((state) => state.setTilt);

  useEffect(() => {
    const cur = cursorRef.current;
    if (!cur) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const handleMouseMove = (e: MouseEvent) => {
      cur.style.opacity = '1';
      cur.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 15}px)`;

      if (!prefersReducedMotion) {
        const x = e.clientX / window.innerWidth - 0.5;
        y = e.clientY / window.innerHeight - 0.5;
        setTilt(x * -22, y * -14);
        const art = document.getElementById('stage');
        if (art) {
          art.style.setProperty('--px', `${x * -22}px`);
          art.style.setProperty('--py', `${y * -14}px`);
        }
      }
    };

    let y = 0;

    const handleMouseLeave = () => {
      cur.style.opacity = '0';
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('a, button, select, .card, [role="button"], input')) {
        cur.classList.add('big');
      } else {
        cur.classList.remove('big');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [setTilt]);

  return <div id="cur" ref={cursorRef} aria-hidden="true" style={{ opacity: 0 }} />;
}
