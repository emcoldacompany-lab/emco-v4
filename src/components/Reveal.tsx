'use client';

import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/utils';

/**
 * Fades and lifts its children in the moment they scroll into view.
 * Pure CSS animation triggered by an IntersectionObserver — no animation
 * library needed, and it respects prefers-reduced-motion via globals.css.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      className={cx(className, visible ? 'animate-fade-up' : 'opacity-0')}
    >
      {children}
    </div>
  );
}
