import Image from 'next/image';
import Link from 'next/link';
import { formatMZN } from '@/lib/utils';

export type ProductCardData = {
  _id: string;
  name: string;
  slug: string;
  brand?: string;
  summary?: string;
  price?: number | null;
  unit?: string;
  images?: string[];
  inStock?: boolean;
  category?: { name?: string; slug?: string } | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-lift group flex flex-col border border-ink/10 bg-white hover:border-brand/40"
    >
      <div className="hover-zoom relative aspect-[4/3] bg-concrete">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-mist">No image yet</div>
        )}
        {!product.inStock && (
          <span className="absolute left-0 top-3 bg-ink px-3 py-1 text-xs font-semibold text-paper">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && <p className="text-xs font-medium text-mist">{product.brand}</p>}
        <h3 className="font-narrow text-lg font-bold leading-snug transition-colors group-hover:text-brandDark">
          {product.name}
        </h3>
        {product.summary && (
          <p className="line-clamp-2 text-sm leading-relaxed text-steel">{product.summary}</p>
        )}
        <div className="mt-auto flex items-baseline gap-1.5 pt-3">
          <span className="font-narrow text-lg font-bold">{formatMZN(product.price)}</span>
          {product.price != null && (
            <span className="text-xs text-mist">per {product.unit || 'piece'}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
