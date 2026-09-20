'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { cx } from '@/lib/utils';

const options = [
  { code: 'en' as const, flag: '🇬🇧', label: 'English' },
  { code: 'pt' as const, flag: '🇲🇿', label: 'Português' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.code === lang)!;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-sm border border-ink/15 px-2.5 py-1.5 text-sm transition-colors hover:border-ink/40"
      >
        <span aria-hidden>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span aria-hidden className={cx('transition-transform', open && 'rotate-180')}>▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-sm border border-ink/10 bg-white shadow-lift"
        >
          {options.map((o) => (
            <li key={o.code}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setLang(o.code);
                  setOpen(false);
                }}
                className={cx(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-concrete',
                  o.code === lang && 'font-semibold text-brandDark'
                )}
              >
                <span aria-hidden>{o.flag}</span>
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
