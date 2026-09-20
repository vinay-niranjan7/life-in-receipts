# Life, In Receipts

An interactive reconstruction of eight months of one person's digital life, assembled from 53 small records — searches, purchases, playlists, places, photos, messages, events and notes.

**Live demo:** https://life-in-receipts-zeta.vercel.app/

**GitHub:** https://github.com/vinay-niranjan7/life-in-receipts

> A frontend-only hackathon project that turns disconnected digital-life receipts into **Insights → Connections → Story**.

## Problem

A digital life is stored as fragments. A search for a DSA roadmap, a ₹120 notebook, a study playlist, a library check-in and a photo of semester notes are five unrelated rows in five different services. Read together they are one habit forming.

The app moves that data through four stages:

**RAW DATA → INSIGHTS → CONNECTIONS → STORY**

- **Raw data** — 53 receipts across 9 categories, January–August 2026.
- **Insights** — a pattern engine that counts threads, months, chapters and receipt types at runtime and writes its observations from the result.
- **Connections** — a chain builder that links receipts by shared thread, shared vocabulary, chapter and date proximity.
- **Story** — six chapters, plus a month-by-month reading of what changed between them.

Every number, month and thread list in the interface is derived from the dataset at runtime. Editing `js/data.js` rewrites the insights. There are no hardcoded claims and no psychological conclusions — only what the receipts support.

## Project structure

```text
/
├── index.html            semantic shell: intro, header, tabs, main, footer
├── README.md
├── vercel.json           static deployment config (no build step)
│
├── assets/
│   └── favicon.svg
│
├── css/
│   ├── styles.css        design tokens, theme variables, typography, layout, intro, header
│   ├── components.css    receipt cards, chips, timeline spine, insight cards, chains, map
│   └── responsive.css    breakpoint behaviour (320px → 1440px), loaded last
│
└── js/
    ├── data.js           CHAPTERS, DATA, TYPES, TYPE_LABEL, TYPE_NOUN, TYPE_ICON
    ├── state.js          app state, localStorage persistence, theme, saved moments
    ├── utils.js          formatting, lookups, grouping, validation (fmtDate, byTag, monthGroups…)
    ├── insights.js       life signals, discovered patterns, what-changed calculations
    ├── connections.js    relationship scoring, chain walking, link explanations, surprise-me
    ├── ui.js             receipt cards, receipt detail, tabs, DOM helpers
    ├── story.js          chapter narrative view
    ├── patterns.js       discovery view (signals, patterns, what changed, connect the dots)
    ├── explore.js        search, filters, saved moments
    ├── map.js            Life Map view
    └── app.js            entry point: boot, render dispatch, all event handling
```

Native ES modules (`<script type="module" src="./js/app.js">`) with `import` / `export`. No bundler, no framework, no npm dependency, no backend.

## Features

- **The Story** — six chapters on a two-sided timeline spine; badges mark new vs. continuing threads; arrow keys move between chapters.
- **Patterns** — the discovery layer:
  - *Life signals* — receipts matched to Learning, Participation, Development, College & exams and Downtime, with counts and month spread. Selecting one lists its receipts.
  - *Discovered patterns* — six generated evidence cards: the longest-running thread, one thread appearing in many formats, a thread that starts mid-story, the turning-point month, the convergence month, and the thread that survives every phase. Each opens its own evidence receipts.
  - *What changed* — each month compared with the month immediately before it, split into new / returns / continuing / quiet threads. Selecting a month opens its chapter.
  - *Connect the dots* — pick a starting receipt and walk a chain. Each step is chosen against the **current** receipt, so the reason printed on every connector (for example, "same thread · DSA · 16 days later") is true of the pair it sits between.
- **Surprise me** — jumps to a receipt whose chain crosses several threads, explains why, marks it "you are here" and starts the chain from it.
- **Explore** — full-text search, nine category filters, thread filters, saved moments.
- **Life Map** — every month with a density bar, receipt count, dominant threads and chapter, plus recurring-thread and receipt-type overviews.
- **Receipt detail** — thread, chapter, same-format receipts, nearby-in-time neighbours, and its own connection chain.
- Dark/light theme, saved moments and last tab persisted to `localStorage`.
- Responsive from 320px; `prefers-reduced-motion` respected; skip link, visible focus rings, `aria-live` announcements, labelled controls, no colour-only signalling.

## Dataset

53 fictional receipts, January–August 2026, over 8 months and 6 chapters, across nine categories: Music, Movies & Entertainment, Places, Purchases, Photos, Messages, Searches, Events, Personal Notes.

Six recurring threads: **DSA** (9 receipts, Jan–Aug), **Events** (10), **Spring Boot** (6), **Volunteering** (3), **Core Java** (2), **Suspense / Thriller** (2).

The data is fictional and contains no personal information.

## Design philosophy

Archival, not dashboard. Warm paper, receipt stock, perforated edges, typewriter display type and monospace body text. A red stamp accent marks findings; a teal accent marks connections between them. Restrained motion, no gradients, no glass — it should read like an evidence board someone kept carefully.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript with native ES modules
- `localStorage` for saved moments, theme and last-tab state
- Vercel for static production deployment
- No framework, backend, database, API, bundler or npm dependency

## Run locally

ES modules need to be served over HTTP (opening the file directly will block imports):

```bash
python3 -m http.server 5173
# then open http://localhost:5173
```

On Windows, you can also use:

```bash
py -m http.server 5173
```

## Deployment (Vercel)

Static, no build step.

- Framework preset: **Other**
- Root directory: **./**
- Build command: *(empty)*
- Output directory: *(default)*

```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

`vercel.json` sets clean URLs, security headers and asset caching.

### GitHub deployment workflow

The production project is connected to the GitHub `main` branch. New commits pushed to `main` trigger a new Vercel deployment automatically.

```bash
git add .
git commit -m "update project"
git push origin main
```

## Project status

**Production deployed — September 2026.**

The current production build includes the full Story, Patterns, Connect the Dots, Surprise Me, Explore and Life Map experience.
