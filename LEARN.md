# Understanding and extending the EMCO LDA codebase

Work through these in order. Each one is a real feature you would build for a paying client,
and each one teaches a concept you will reuse on every project after this.

---

## First, read the code in this order

1. `src/models/Product.ts` — what a product *is*. Everything else follows from the schema.
2. `src/lib/db.ts` — why the connection is cached on `globalThis`. Comment out the cache, run
   `npm run dev`, save a file ten times, and watch the connection count climb in Atlas.
3. `src/lib/queries.ts` — server-side data access. Note that every helper is wrapped in `safe()`.
4. `src/app/products/[slug]/page.tsx` — a server component that queries, renders, and emits
   structured data. No `useEffect`, no loading spinner, no client-side fetch.
5. `src/middleware.ts` — route protection that runs before the page does.

**The one idea that matters most:** in the App Router, a component is a *server* component unless
the file starts with `'use client'`. Server components run on the server, can `await` a database
query directly, and ship zero JavaScript to the browser. That is why this site is fast and why
Google sees your product text. Open the page source in the browser and search for a product name
— it is in the HTML. Do the same on a Create React App site and you will find an empty `<div>`.

---

## Exercise 1 — Add a "Brands" filter (easy, ~1 hour)

The catalogue filters by department. Add a second filter by brand.

- In `src/lib/queries.ts`, add a `brand` option to `getProducts` and push it into the Mongo filter.
- In `src/components/CatalogueControls.tsx`, add a `<select>` of brands that calls `push({ brand })`.
- Get the brand list with `Product.distinct('brand')` in a new query helper.

**What you learn:** how URL search params drive server-rendered state. Notice you never store the
filter in React state — the URL *is* the state, so filtered pages are shareable and bookmarkable.

## Exercise 2 — Real image uploads (medium, ~2 hours)

Right now an admin pastes image URLs. Replace that with a file picker.

- Sign up at cloudinary.com, create an unsigned upload preset.
- In `ProductForm.tsx`, add an `<input type="file">` that POSTs to
  `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload` with the preset.
- Push the returned `secure_url` into the `images` array.

**What you learn:** why you never proxy uploads through your own server when a CDN will take them
directly, and why unsigned presets are safe for public upload but need a size/format restriction.

## Exercise 3 — Email the sales desk on every request (medium, ~1 hour)

- Sign up at resend.com, get an API key, add `RESEND_API_KEY` to `.env`.
- In `src/app/api/quotes/route.ts`, after `Quote.create(...)`, send an email to the sales address.
- Do **not** `await` it in a way that blocks the response if the email provider is slow — return
  the response first, or catch and log the failure.

**What you learn:** a form submission has two jobs — store the lead (must never fail) and notify
someone (nice to have). Never let job two break job one.

## Exercise 4 — Bill of quantities upload (harder, ~4 hours)

Contractors have their list in Excel. Let them upload it.

- Add a file input to the quote form accepting `.csv` and `.xlsx`.
- Parse it in the browser with `papaparse` (CSV) or `xlsx` (Excel).
- Show the parsed rows back for confirmation, then submit them as a `lineItems` array on `Quote`.
- Render the line items in the admin quote card.

**What you learn:** schema design for nested data, and the pattern of parse → preview → confirm,
which is how every serious import flow works.

## Exercise 5 — Make it measurably faster than the competition (medium, ~2 hours)

- Run the deployed site through PageSpeed Insights. Note the LCP number.
- Add `loading="lazy"` awareness: check which images use `priority` and whether that's correct.
- Add `export const revalidate = 60` to the catalogue page instead of `force-dynamic`, so pages are
  cached for a minute rather than rebuilt per request. Measure again.
- Trade-off to reason about: a newly added product now takes up to 60 seconds to appear. Is that
  acceptable for this client? Write down your answer — this is the kind of judgement clients pay for.

## Exercise 6 — Multi-user staff accounts (harder, ~3 hours)

Today there is one admin role. Add a `sales` role that can see quotes but cannot edit products.

- Add `role` to the JWT payload in `src/lib/auth.ts`.
- Write `requireRole('admin')` alongside `requireAdmin()`.
- Hide the product links in `AdminNav.tsx` for sales users — and still block the API, because
  hiding a button is not security.

**What you learn:** authorisation belongs on the server. The UI only reflects it.

---

## Pitching this to a business

When you show this to a shop owner, do not demo the home page first. Demo the dashboard.

Open `/admin`, change a price, refresh the storefront, and show the new price. Then open the quote
inbox and show a lead with a WhatsApp reply button. The owner is not buying a website; they are
buying control of their own prices and a record of every customer who asked for one.

Then load their current site and yours side by side on a phone with mobile data. The load-time
difference is your whole argument, and it needs no explanation.
