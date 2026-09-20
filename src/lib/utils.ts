export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Mozambican Metical, formatted for either language's locale. */
export function formatMZN(value?: number | null, lang: 'en' | 'pt' = 'en') {
  if (value == null) return lang === 'pt' ? 'Preço sob consulta' : 'Price on request';
  return new Intl.NumberFormat(lang === 'pt' ? 'pt-MZ' : 'en-GB', {
    style: 'currency',
    currency: 'MZN',
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP || '258872005200';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}
