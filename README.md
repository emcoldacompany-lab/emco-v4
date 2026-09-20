# EMCO LDA

A production-shaped supplier catalogue site for a Mozambique-based hardware and construction
supplier: bilingual (English/Portuguese) storefront, searchable product catalogue, quote-request
capture, and an admin dashboard the business owner runs without touching code.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + MongoDB (Mongoose)**.

---

## Get it running in 5 minutes

```bash
npm install
cp .env.example .env      # then edit .env
npm run seed              # loads 5 departments, 12 products, 1 admin user
npm run dev               # http://localhost:3000
```

### What to put in `.env`

| Variable | What it is |
|---|---|
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/emcolda` locally, or your MongoDB Atlas string |
| `JWT_SECRET` | Any long random string. Generate one: `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | The admin account `npm run seed` creates (defaults to `Garawan1@gmail.com` / `Garawan@1122` if left unset) |
| `NEXT_PUBLIC_SITE_URL` | Used by sitemap.xml and Open Graph tags |
| `NEXT_PUBLIC_WHATSAPP` | Number in international form, no `+` — `258872005200` |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL` | Shown in the header and footer |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Cloudflare R2 — see below |

#### Setting up Cloudflare R2 (product photo uploads)

The admin dashboard uploads product photos straight to Cloudflare R2 — no code changes needed, just five environment variables:

1. Go to **dash.cloudflare.com → R2** (free tier: 10GB storage, no egress fees).
2. **Create bucket** — name it e.g. `emco-lda-products`. That name goes in `R2_BUCKET_NAME`.
3. Open the bucket → **Settings → Public Access → Allow Access**. Cloudflare gives you a public URL like `https://pub-xxxxxxxx.r2.dev` — that goes in `R2_PUBLIC_URL`. (You can attach your own domain here later instead.)
4. Go to **R2 → Manage API Tokens → Create API Token**, scoped to this bucket, with **Object Read & Write** permission.
5. Copy the **Account ID**, **Access Key ID** and **Secret Access Key** it gives you into `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.

That's it — the "Upload photos" button in Admin → Products now saves directly to that bucket.

No MongoDB yet? Create a free cluster at mongodb.com/atlas, click **Connect → Drivers**, and
paste the string into `MONGODB_URI`. Remember to replace `<password>` and allow access from
anywhere (0.0.0.0/0) while developing.

Admin dashboard: **http://localhost:3000/admin** — sign in with the seeded email and password.

---

## What's in the box

**Public site**
- Home page with a working catalogue search, department grid, featured products, quote form
- Catalogue with keyword search, department filter and pagination
- Product pages with image gallery, specification table, related items
- `Product` JSON-LD structured data on every product page (Google rich results)
- Auto-generated `sitemap.xml` and `robots.txt`
- Floating WhatsApp button that pre-fills the product name
- Responsive, keyboard-focusable, respects `prefers-reduced-motion`

**Admin dashboard** (`/admin`, protected by middleware)
- Overview counters and the five latest requests
- Full product CRUD: create, edit, delete, feature on the home page, mark out of stock
- Quote request inbox with a status pipeline: new → contacted → quoted → won / lost
- One-click WhatsApp reply to whoever submitted the form

---

## How the pieces fit

```
src/
├── app/
│   ├── page.tsx                  Home (server component, reads MongoDB directly)
│   ├── products/                 Catalogue + [slug] detail page
│   ├── admin/                    Dashboard — protected by src/middleware.ts
│   ├── api/                      REST endpoints (products, categories, quotes, auth)
│   ├── sitemap.ts, robots.ts     Generated from live data
│   └── layout.tsx, globals.css   Shell, fonts, design tokens
├── components/                   Header, footer, cards, forms, admin tables
├── lib/
│   ├── db.ts                     Cached Mongoose connection (survives hot reload)
│   ├── auth.ts                   JWT sessions in an httpOnly cookie (jose)
│   ├── queries.ts                Server-side data helpers — never throw, degrade to empty
│   └── utils.ts                  slugify, MZN formatting, WhatsApp links
├── models/                       Category, Product, Quote, User schemas
└── middleware.ts                 Guards every /admin route at the edge
```

Two deliberate decisions worth knowing:

1. **Pages read MongoDB directly, not through `fetch('/api/...')`.** Server components can query
   the database in the same process, so you skip a network hop. The `/api` routes exist for the
   admin UI (which is client-side) and for any mobile app you add later.
2. **`lib/queries.ts` never throws.** If the database is unreachable the site renders an empty
   state instead of a 500. A down database should not take down your client's homepage.

---

## Deploying

**Vercel + MongoDB Atlas** (free to start):

1. Push this folder to a GitHub repo.
2. On vercel.com → New Project → import the repo.
3. Add every variable from `.env` to Vercel → Settings → Environment Variables.
4. Deploy. Add your custom domain under Settings → Domains.
5. In Atlas → Network Access, allow `0.0.0.0/0` (Vercel's IPs are dynamic).

After the first deploy: submit `https://yourdomain.com/sitemap.xml` in Google Search Console.

---

## Things to change before you hand this to a client

- [ ] Replace the seeded products with real stock and real photographs — use the "Upload photos" button in Admin → Products, now backed by Cloudflare R2
- [ ] Fill in the real `R2_*` environment variables before the first upload (see the Cloudflare R2 section above)
- [ ] Change `ADMIN_PASSWORD` and re-run the seed, or add a user manually
- [ ] Put the real address, phone, email and opening hours in `.env` and `SiteFooter.tsx`
- [ ] Add email notification on new quote requests (see `src/app/api/quotes/route.ts`)
- [ ] Rewrite the copy on the home page and About page in the client's own voice

See `LEARN.md` for how to extend it, with exercises.


---

## What's new in this version (EMCO LDA rebrand)

- **Bilingual storefront** — a language switcher (🇬🇧 English / 🇲🇿 Português) in the header lets
  visitors flip the whole marketing shell (nav, hero, about page, footer) between languages. The
  choice is remembered in the browser via `localStorage`. Product and quote data are stored once,
  in whichever language the admin typed them — translating live catalogue content is a further
  step (a `nameEn`/`namePt` field pair, or a translation API call at save time).
- **Currency** switched from UGX to **MZN** (Mozambican Metical) — see `formatMZN` in `src/lib/utils.ts`.
- **Hover-zoom images** everywhere via a `.hover-zoom` utility class (globals.css) — product cards,
  the hero collage, and the about-page photos all gently scale on hover.
- **Scroll-reveal animation** — `src/components/Reveal.tsx` fades and lifts sections into view the
  moment they scroll on screen, using an `IntersectionObserver` (no animation library needed).
- **Infinite scrolling marquee** — `src/components/Marquee.tsx`, a duplicated-track CSS animation
  that loops seamlessly and pauses on hover. Used under the homepage hero.
- Admin login defaults to **Garawan1@gmail.com / Garawan@1122** — change this before going live.
