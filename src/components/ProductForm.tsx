'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Cat = { _id: string; name: string };
type Spec = { label: string; value: string };

export default function ProductForm({
  categories,
  product,
}: {
  categories: Cat[];
  product?: any;
}) {
  const router = useRouter();
  const [specs, setSpecs] = useState<Spec[]>(product?.specs?.length ? product.specs : [{ label: '', value: '' }]);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [pasteUrl, setPasteUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError('');

    const form = new FormData();
    Array.from(fileList).forEach((f) => form.append('files', f));

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed.');
      setImages((prev) => [...prev, ...json.urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function addPastedUrl() {
    const url = pasteUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setPasteUrl('');
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      sku: form.get('sku'),
      brand: form.get('brand'),
      summary: form.get('summary'),
      description: form.get('description'),
      price: form.get('price'),
      unit: form.get('unit'),
      category: form.get('category'),
      inStock: form.get('inStock') === 'on',
      featured: form.get('featured') === 'on',
      images,
      specs: specs.filter((s) => s.label && s.value),
    };

    const res = await fetch(product ? `/api/products/${product._id}` : '/api/products', {
      method: product ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error || 'Could not save this product.');
      setBusy(false);
      return;
    }
    router.push('/admin/products');
    router.refresh();
  }

  async function onDelete() {
    if (!product || !confirm(`Delete “${product.name}” from the catalogue?`)) return;
    await fetch(`/api/products/${product._id}`, { method: 'DELETE' });
    router.push('/admin/products');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">Product name</label>
          <input id="name" name="name" required defaultValue={product?.name} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="category">Department</label>
          <select id="category" name="category" required defaultValue={product?.category?._id || product?.category} className="field">
            <option value="">Choose one</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="brand">Brand</label>
          <input id="brand" name="brand" defaultValue={product?.brand} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="sku">Item code</label>
          <input id="sku" name="sku" defaultValue={product?.sku} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="unit">Sold per</label>
          <input id="unit" name="unit" defaultValue={product?.unit || 'piece'} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="price">Price in MZN</label>
          <input id="price" name="price" type="number" defaultValue={product?.price ?? ''} className="field" placeholder="Leave empty for price on request" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="summary">Short line for the card</label>
          <input id="summary" name="summary" defaultValue={product?.summary} className="field" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Full description</label>
          <textarea id="description" name="description" rows={5} defaultValue={product?.description} className="field resize-y" />
        </div>
        <div className="sm:col-span-2">
          <span className="label">Product photos</span>

          {images.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {images.map((src, i) => (
                <div key={src + i} className="hover-zoom group relative aspect-square overflow-hidden rounded-sm border border-ink/10 bg-concrete">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/80 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove this photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <label
            htmlFor="file-upload"
            className="btn-ghost inline-flex cursor-pointer"
          >
            {uploading ? 'Uploading…' : 'Upload photos'}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              onFilesSelected(e.target.files);
              e.target.value = '';
            }}
          />
          <p className="mt-1.5 text-xs text-mist">
            Uploads go straight to Cloudflare R2. JPG, PNG, WebP or GIF, up to 8MB each.
          </p>

          <div className="mt-3 flex gap-2">
            <input
              value={pasteUrl}
              onChange={(e) => setPasteUrl(e.target.value)}
              placeholder="Or paste an image URL"
              className="field text-xs"
            />
            <button type="button" onClick={addPastedUrl} className="btn-ghost shrink-0">
              Add
            </button>
          </div>
        </div>
      </div>

      <fieldset>
        <legend className="label">Specifications</legend>
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="field"
                placeholder="Power"
                value={s.label}
                onChange={(e) => {
                  const next = [...specs];
                  next[i] = { ...next[i], label: e.target.value };
                  setSpecs(next);
                }}
              />
              <input
                className="field"
                placeholder="750W"
                value={s.value}
                onChange={(e) => {
                  const next = [...specs];
                  next[i] = { ...next[i], value: e.target.value };
                  setSpecs(next);
                }}
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                className="btn-ghost shrink-0"
                aria-label="Remove this specification"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setSpecs([...specs, { label: '', value: '' }])} className="btn-ghost mt-3">
          Add a row
        </button>
      </fieldset>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="inStock" defaultChecked={product ? product.inStock : true} className="h-4 w-4" />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4" />
          Show on the home page
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-3 border-t border-ink/10 pt-6">
        <button className="btn-signal" disabled={busy}>
          {busy ? 'Saving' : product ? 'Save changes' : 'Publish product'}
        </button>
        {product && (
          <button type="button" onClick={onDelete} className="btn-ghost">
            Delete product
          </button>
        )}
      </div>
    </form>
  );
}
