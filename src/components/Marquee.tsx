'use client';

import Image from 'next/image';

export type MarqueeItem = { src: string; alt: string };

/** Infinite horizontal scroller: the list is duplicated once and the whole
 *  track slides by exactly half its width, so the loop point is invisible. */
export default function Marquee({ items }: { items: MarqueeItem[] }) {
  const track = [...items, ...items];

  return (
    <div className="group relative overflow-hidden border-y border-white/10 bg-ink py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-white/5 transition-transform duration-300 hover:z-10 hover:scale-110 sm:h-24 sm:w-24"
          >
            <Image src={item.src} alt={item.alt} fill sizes="96px" className="object-cover" unoptimized />
          </div>
        ))}
      </div>
    </div>
  );
}
