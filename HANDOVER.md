# Handover — Eylure Eye Shape Scanner

Read this before making changes. Written 14 Aug 2026 for continuing on a new Mac / Cursor.

## Setup on the new machine

```bash
git clone https://github.com/adamlpdc/Eyeshape-scanner.git
cd Eyeshape-scanner
npm install
npm run dev
```

- Repo: `https://github.com/adamlpdc/Eyeshape-scanner.git`
- Branch: `main`
- Last known HEAD: `fb55357` — *Capture results preview when hold-still countdown begins.*
- App: Next.js 16.2.6 (breaking APIs vs older Next — read `node_modules/next/dist/docs/` and `AGENTS.md`)
- Dev: http://localhost:3000 (if busy, Next picks another port — check the terminal)
- Camera only works on **localhost or HTTPS**
- Results QA without scanning: http://localhost:3000/preview?screen=results
- `/preview` is **blocked in production** unless `ENABLE_PREVIEW=true` (`middleware.ts`)

`npm install` copies MediaPipe WASM via `postinstall` → `scripts/copy-mediapipe-wasm.mjs`. WASM is gitignored (`public/mediapipe/wasm`).

Push from Cursor agents often fails (`could not read Username for https://github.com`). Commit locally, then `git push origin main` in the user’s terminal.

## What this product is

Mobile-first **Eylure** web scanner. User scans their face, gets an eye-shape result, then Boots product recommendations.

Flow: `idle` → `aligning` → `countdown` → `scanning` → `fetching` → `unlock` → `results`

This live build is the **Boots / general retailer version**. Superdrug is **not built** — discussed only (see below).

## Architecture (source of truth)

| Area | Path |
|------|------|
| Entry | `app/page.tsx` → `components/scanner/CameraScanner.tsx` |
| Scan state | `hooks/use-scan-session.ts` |
| MediaPipe | `lib/mediapipe/face-landmarker.ts`, `constants/mediapipe.ts` |
| Eye landmarks | `constants/eye-landmarks.ts` |
| Measurements | `lib/measurements/` |
| Classification | `lib/classification/classify-eye-shape.ts` |
| Product pick | `lib/recommendations/pick-product-recommendations.ts` |
| Boots catalog | `constants/boots-product-catalog.ts` from `data/boots-product-catalog.csv` |
| Pack shots | `public/products/{SKU}.jpg` |
| Copy / brand | `constants/copy.ts`, `constants/brand.ts`, `constants/lash-recommendation-engine.ts` |
| Preview/QA | `app/preview/page.tsx`, `components/scanner/ScannerScreenPreview.tsx` |

**Ignore / do not use:** `app/components/` and `app/lib/` — leftover untracked prototype. Real app lives in `components/`, `hooks/`, `lib/`.

Also untracked junk (do not commit unless asked): `eyeshape-scanner-screenshots.zip`, `public/eyelure-hero.png`, `public/eylure-hero.png`, `scripts/trim-product-images.mjs`.

## MediaPipe (how it links, how it is maintained)

On-device Face Landmarker in the browser. It **does not** classify eye shape or pick lashes.

1. Camera stream starts
2. `getFaceLandmarker()` loads `@mediapipe/tasks-vision`
3. Each frame: `detectForVideo` → landmarks
4. Our code measures eyes → classifies shape → recommends products

- Package: `@mediapipe/tasks-vision@^0.10.35`
- WASM: copied to `/mediapipe/wasm` on install; fallback CDN in `constants/mediapipe.ts`
- Model: Google CDN `face_landmarker.task` URL in `constants/mediapipe.ts`
- GPU first, CPU fallback; `releaseFaceLandmarker()` when scan ends
- Upgrade: bump npm package **and** `MEDIAPIPE_WASM_VERSION`, reinstall, retest scan

Face video/landmarks stay in the browser. No `/api` routes process faces.

## Current product behaviour (Boots)

- Catalog: 49 Boots SKUs, SKU-led, retailer = Boots
- Pick: products tagged for scanned shape **or** `isAll`
- Results tabs: **Strip lashes** vs **Clusters** (name contains `"cluster"` → clusters)
- Per tab: 2 random shape-matched + 1 random All last (max 3), then **Load more**
- Buttons: Virtual try-on (if URL) + Buy at Boots (if URL); hide if missing
- Image: white card area, `object-contain`, stacked buttons, `h-48`
- Results preview photo is captured **when “Hold still” / countdown starts**, not at end of the 3s scan. If countdown aborts, preview is cleared.

Catalog scripts:

```bash
npm run catalog:generate        # CSV → constants/boots-product-catalog.ts
npm run catalog:verify-images
npm run catalog:verify-links
npm run catalog:sync-images -- /path/to/folder
```

## Deferred (do not assume they exist)

- Email capture **API** — unlock stores email + newsletter opt-in in **session memory only**
- Newsletter platform
- GA4 — `lib/analytics/` exists; adapter is a stub; dev `console.debug` only
- Superdrug retailer variant

Legal one-pager was drafted in chat (on-device processing, no face upload). Privacy/T&Cs on unlock: PDC privacy + Eylure T&Cs in `UNLOCK_COPY`.

## Superdrug (discussed, not implemented)

Need a **copy of the scanner** on a **different URL** with **different products**. Do **not** fork the repo.

Agreed approach: **one codebase, two deploys, retailer config**.

```
NEXT_PUBLIC_RETAILER=boots | superdrug
```

Two hosting projects (e.g. Vercel) from the **same GitHub repo**, different env + custom domain. Different URLs are DNS/hosting, not a code fork.

What would differ: catalog, pack images, “Buy at …” copy, product URLs, site URL / OG / legal links if needed.  
What stays shared: MediaPipe, scan, classification, most UI.

Do not hardcode Boots in pick logic forever — cards already use generic `productUrl`.

Before building Superdrug, get: CSV (SKU, name, shapes, All, try-on, Superdrug URL), pack shots, CTA wording, domain, legal/email owner.

## Copy / UX conventions

- UK spelling, sentence case; START button all caps
- User rules: branded, not generic AI layout; no extra cards; don’t add README fluff
- Next.js 16 may warn that `middleware` should become `proxy` — still works
- If `.next` is deleted while `next dev` is running, restart after `rm -rf .next`

## Suggested first tasks on the new Mac

1. Clone, `npm install`, `npm run dev`, open `/` and `/preview?screen=results`
2. Confirm camera scan on a phone (LAN URL) or laptop webcam
3. When Superdrug is ready: add retailer config + second deploy, don’t duplicate the scanner
4. Email API + GA4 only when product/legal sign off
