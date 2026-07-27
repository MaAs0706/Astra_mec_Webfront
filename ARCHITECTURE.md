# Astra MEC Website — Frontend Architecture

This document defines the project structure, conventions, and architectural decisions for the Astra (Astronomy & Space-Tech Club, Model Engineering College) website. It is written for the student developers who will build and maintain this project over multiple academic years — the primary design goal is **clarity and low onboarding cost**, not cleverness.

**Tech stack:** React + TypeScript + Vite + Tailwind CSS v4 + React Router + Framer Motion.

**Status:** Home and Team pages are built and live. Events, Gallery, Reports, and Contact are routed but currently render a shared placeholder (`src/pages/ComingSoon.tsx`) until their content is designed. See section 13 for the full rundown.

---

## 1. Guiding Principles

1. **A new contributor should be able to find any file within 30 seconds** by guessing its folder from the file's purpose.
2. **Mock data today, real API tomorrow** — every data-consuming component is written so that swapping a mock data source for a real API call touches as few files as possible.
3. **Flat before nested.** Don't create a subfolder until there are at least 3 files that belong together.
4. **No premature abstraction.** Duplication of 2-3 similar lines is acceptable; a shared component/hook is only introduced once a pattern repeats 3+ times.
5. **Club membership turns over every year.** Every non-obvious decision must be documented in-place (comments, or this file) rather than living only in one person's head.

---

## 2. Folder Structure

This is the actual current tree, not a proposal:

```text
astra-mec-website/
├── public/
│   └── favicon.png
├── src/
│   ├── assets/
│   │   ├── images/               # astra-logo.png
│   │   └── videos/                # hero-galaxy.mp4
│   ├── components/
│   │   ├── common/                # Generic, reused across pages (see below)
│   │   ├── home/                  # Home-page-only sections
│   │   ├── team/                  # Team-page-only pieces
│   │   ├── layout/                # Navbar, Footer — persistent site chrome
│   │   └── intro/                 # The one-time landing intro sequence
│   ├── pages/                     # Home.tsx, Team.tsx, ComingSoon.tsx
│   ├── layouts/                   # MainLayout.tsx
│   ├── data/                      # Mock content: events, teamMembers, departments
│   ├── services/                  # Data-access layer (mock now, API later)
│   ├── hooks/                     # useCountUp, useCountdown, useCrossfadeVideoLoop
│   ├── context/                   # IntroContext (see section 3)
│   ├── routes/                    # AppRoutes.tsx — the route table
│   ├── utils/                     # introSession.ts
│   ├── types/                     # Event.ts, TeamMember.ts, Department.ts
│   ├── constants/                 # site.ts, intro.ts
│   ├── styles/                    # index.css — Tailwind + design tokens
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json
├── README.md
└── ARCHITECTURE.md
```

Everything from the original plan (`services/`, `context/`, `routes/`, `constants/`) held up in practice. One folder was added that wasn't originally planned — `components/intro/` — see section 3 for why, and section 13 for what it does.

---

## 3. Folder-by-Folder Breakdown

### `src/assets/`
- **Purpose:** Static media imported directly into components (club logo, hero footage).
- **Current contents:** `images/astra-logo.png` (the club emblem — used in the Navbar and the intro sequence), `videos/hero-galaxy.mp4` (Home hero background, played via a crossfade loop — see `hooks/useCrossfadeVideoLoop.ts`).
- **Growth:** Subdivide further only once a subfolder gets crowded (e.g. team photos would go in a new `assets/images/team/`).

### `src/components/common/`
- **Purpose:** Reusable, domain-agnostic UI and visual-effect pieces used across multiple pages.
- **Current contents:**
  - `Button.tsx`, `SectionHeading.tsx` — plain reusable UI.
  - `Starfield.tsx` — canvas-based ambient starfield with optional shooting stars and constellations; `ParallaxStars.tsx` composes three depth layers of it for the site-wide background (wired into `MainLayout`).
  - `SectionGlow.tsx`, `DataTicker.tsx`, `Constellation.tsx` — small decorative accents used by individual Home sections.
- **Growth:** Once a pattern repeats 3+ times (rule of three), pull it in here from wherever it was inline.

### `src/components/home/`, `src/components/team/`
- **Purpose:** Components specific to one page, not reused elsewhere. Exists because Home alone has 7 distinct sections (`Hero`, `TelemetryBar`, `Mission`, `RecentEvents`, `GalleryTeaser`, `TeamTeaser`, `JoinCta`) — grouping them by page keeps `pages/Home.tsx` itself thin (just composes these in order) and keeps page-specific pieces out of `common/`.
- **Growth:** When Events/Gallery/Reports/Contact get built, they'll each likely get their own `components/<page>/` folder the same way, unless a page turns out simple enough to not need one.

### `src/components/layout/`
- **Purpose:** Persistent site chrome, rendered once regardless of route.
- **Current contents:** `Navbar.tsx` (scroll-direction hide/show, mobile menu, and the shared `layoutId="astra-brand"` that the intro sequence flies into — see below) and `Footer.tsx`.

### `src/components/intro/`
- **Purpose:** The one-time landing sequence (logo reveal → title card → flies into the Navbar's logo). Not in the original plan — it emerged as a distinct enough feature (its own timing state machine, its own React Context, code-driven Framer Motion animation) to warrant a dedicated folder rather than living in `layout/` or `common/`. This is exactly the kind of organic folder growth section 1's guiding principles anticipate.
- **How it works, briefly:** `App.tsx` decides once (before first render, no flash) whether to show it — skipped if the user prefers reduced motion, or if `sessionStorage` shows it already played this session (see `utils/introSession.ts`). While active, it sits above the real site (`z-[999]`) and coordinates with `Navbar.tsx` through `context/IntroContext.tsx`'s `morphing` flag, so the Navbar's logo can render the mid-flight crossfade state on cue. Timing constants live in `constants/intro.ts` so the sequence and the Navbar's animation durations can never drift out of sync.

### `src/pages/`
- **Purpose:** Top-level views that map 1:1 to a route. Kept thin — they compose section/domain components and fetch via `services/`, not render detailed markup themselves.
- **Current contents:** `Home.tsx`, `Team.tsx`, and `ComingSoon.tsx` (a shared placeholder rendered for every not-yet-built route, parameterized by a `title` prop).
- **Growth:** When Events/Gallery/Reports/Contact are ready, each gets its own file here (e.g. `Events.tsx`), and its route in `routes/AppRoutes.tsx` swaps from `<ComingSoon title="Events" />` to `<Events />`.

### `src/layouts/`
- **Purpose:** Structural wrapper shared by every page.
- **Current contents:** `MainLayout.tsx` — renders the site-wide `ParallaxStars` background, then `Navbar` + `<Outlet />` + `Footer`.

### `src/data/` + `src/services/`
- **Purpose:** `data/` holds placeholder content; `services/` is the only thing pages/components import from — never `data/` directly. This is *the* seam for backend integration (see section 10).
- **Current contents:** `data/events.ts` + `services/eventService.ts` (`getEvents`, `getNextEvent`, `getRecentEvents`); `data/teamMembers.ts` + `data/departments.ts`, both served through `services/teamService.ts` (`getTeamMembers`, `getFeaturedTeamMembers`, `getDepartments`).
- **Note on the Team page specifically:** `departments.ts` holds seat *counts* per department (derived from the club's actual org structure), not member data yet — `components/team/DepartmentSection.tsx` renders that many placeholder "open seat" cards. Once real members exist, giving a `Department` entry a `members: TeamMember[]` array is a data-only change; no component rewrite needed.

### `src/hooks/`
- **Purpose:** Reusable stateful logic extracted out of components.
- **Current contents:** `useCountUp.ts` / `useCountdown.ts` (drive the Home Telemetry Bar's numbers), `useCrossfadeVideoLoop.ts` (loops the hero background video by crossfading two `<video>` elements rather than a hard cut or a reverse-seek, which compressed video can't do smoothly without re-encoding — see the hook's own comments for why).

### `src/context/`
- **Purpose:** Cross-cutting state shared deeply across the tree.
- **Current contents:** `IntroContext.tsx` — exposes a single `morphing` boolean so `Navbar.tsx` knows when to render its brand mark's mid-flight crossfade state versus its normal static logo. First real use of this folder ended up being the intro sequence, not auth — a reminder that these folders are for *whatever* cross-cutting state shows up, not only the examples originally imagined for them.

### `src/routes/`
- **Purpose:** Single source of truth for the route table.
- **Current contents:** `AppRoutes.tsx`. Current routes:
  ```text
  /            → Home
  /events      → ComingSoon ("Events")
  /team        → Team
  /gallery     → ComingSoon ("Gallery")
  /reports     → ComingSoon ("Reports")
  /contact     → ComingSoon ("Contact")
  *            → ComingSoon ("Page not found")
  ```
  All routes nest under `MainLayout` so Navbar/Footer render once.

### `src/utils/`
- **Purpose:** Small, pure, framework-agnostic helpers.
- **Current contents:** `introSession.ts` — `hasIntroPlayed()` / `markIntroPlayed()` (sessionStorage, fails open if storage is unavailable) and `prefersReducedMotionNow()`.

### `src/types/`
- **Purpose:** Shared TypeScript interfaces.
- **Current contents:** `Event.ts`, `TeamMember.ts`, `Department.ts` — each matches the shape of its corresponding `data/` file and `services/` return type exactly, so a future API response only needs to satisfy the same interface.

### `src/constants/`
- **Purpose:** Fixed values used in multiple places.
- **Current contents:** `site.ts` (`siteConfig` — name, tagline, founded year, social links; `navLinks` — the Navbar's link list) and `intro.ts` (`INTRO_TIMING` — every duration the intro sequence and Navbar animation share).

### `src/styles/index.css`
- **Purpose:** Tailwind entry point + the site's design tokens.
- **What's there:** The "Astra Cosmic Technical" token set, defined once under `@theme` and used everywhere via Tailwind utilities (`bg-space-black`, `font-display`, etc.) rather than hardcoded hex values or font names in components:
  - **Colors:** `space-black`, `deep-nebula`, `primary-purple`, `secondary-blue`, `tertiary-cyan`, `metallic-silver`, `starlight-white`.
  - **Fonts:** `--font-display` (Chakra Petch — headings), `--font-body` (Geist — running copy), `--font-mono` (JetBrains Mono — labels, data readouts, telemetry).
  - Also: the `.container-astra` / `.glass-panel` component classes, scanline/grain texture effects, and the reduced-motion global override (forces near-zero animation duration for anyone with `prefers-reduced-motion` set).
- **Why token-based:** Changing the accent palette or swapping the display font (already done once — see git history) is a one-file edit, not a find-and-replace across every component.

### `App.tsx` / `main.tsx`
- **`main.tsx`:** Vite's entry point — mounts `<App />`, imports `styles/index.css`.
- **`App.tsx`:** Decides whether to show the intro sequence, provides `IntroContext`, wraps everything in `BrowserRouter`, and defers mounting `<AppRoutes />` until the intro hands off — kept deliberately small; the actual page logic lives in `routes/` and `pages/`.

---

## 4. Reusable Component Strategy

- **Two tiers, as originally planned:** `components/common/` for domain-agnostic pieces, `components/<page>/` for page-specific sections. Both tiers are in active use (see section 3).
- **Props over duplication, composition over configuration, rule of three** — all still the operating rules; nothing here needed revisiting once real components existed.

---

## 5. Mock Data Strategy & Future API Migration

Unchanged from the original plan, and validated in practice: pages/components call a `services/` function (e.g. `getEvents()`); nothing outside `services/` imports from `data/` directly. `services/eventService.ts` and `services/teamService.ts` are today's two concrete examples — each function returns a `Promise` of the shape defined in `types/`, so a future real backend only requires changing the function body, not any caller.

---

## 6. Naming Conventions

**Files & folders:**
- Components: `PascalCase.tsx` — `Hero.tsx`, `DepartmentSection.tsx`.
- Hooks: `camelCase.ts`, prefixed `use` — `useCountdown.ts`.
- Services, utils, data: `camelCase.ts` — `teamService.ts`, `introSession.ts`.
- Types: `PascalCase.ts` matching the entity — `TeamMember.ts`, `Department.ts`.
- Folders: `lowercase`, plural for collections.

**Components:**
- `PascalCase`, function declarations (not anonymous default exports).
- One component per file; file name matches the exported component name.

**CSS/Tailwind:**
- Tailwind utilities inline; custom CSS in `styles/index.css` reserved for things Tailwind can't express directly (the `@theme` tokens, `@font-face`-adjacent imports, keyframes not driven by Framer Motion).

---

## 7. Coding Standards

- **TypeScript strict mode on**, including `noUnusedLocals`/`noUnusedParameters` — this catches unused imports/variables at compile time, which is why the codebase hasn't accumulated much dead code on its own; it still can't catch a whole file that stops being imported, which is a periodic manual check (last done: removed `components/common/ViewportFrame.tsx`, superseded early on when the Hero video's framing moved to inline corner brackets).
- **No `any`.**
- **Absolute imports** via the `@/` alias (`vite.config.ts` + `tsconfig.app.json`).
- **Functional components + hooks only.**
- **Props destructured in the function signature.**
- **`npm run lint`** runs `oxlint`; keep it clean before committing.

---

## 8. Documentation Strategy

- **`README.md`:** Quick start + where-things-live pointer into this file.
- **`ARCHITECTURE.md`:** This file — updated when a folder's purpose changes or a new one is added (e.g. `components/intro/` getting documented here once it existed).
- **Inline comments:** Reserved for *why*, not *what*. The codebase leans on this especially in `hooks/useCrossfadeVideoLoop.ts` and `components/intro/IntroSequence.tsx`, where a couple of non-obvious bugs were found and fixed during development — the comments there explain the failure mode, not just the fix, so it doesn't get accidentally reintroduced.

---

## 9. Future Backend Integration Map

| Feature | Types | Mock today | Service | Consumed by | Backend integration point |
|---|---|---|---|---|---|
| **Events** | `Event.ts` | `events.ts` | `eventService.ts` | `Home.tsx` (teaser), future `Events.tsx` | `getEvents()` / `getNextEvent()` switch to `GET /api/events` |
| **Team Members** | `TeamMember.ts` | `teamMembers.ts` | `teamService.ts` | `Home.tsx` (teaser) | `getTeamMembers()` switches to `GET /api/team` |
| **Departments/Roster** | `Department.ts` | `departments.ts` | `teamService.ts` | `Team.tsx` | `getDepartments()` switches to `GET /api/departments`; add `members: TeamMember[]` to the type once rosters exist |
| **Gallery** | new `GalleryItem.ts` | new `galleryImages.ts` | new `galleryService.ts` | future `Gallery.tsx` | `getGalleryItems()` → `GET /api/gallery`; likely CDN-hosted images rather than `assets/` |
| **Reports** | new `Report.ts` | new `reports.ts` | new `reportService.ts` | future `Reports.tsx` | `getReports()` → `GET /api/reports` |
| **Contact Form** | new `ContactFormData.ts` | — (write-only) | new `contactService.ts` | future `Contact.tsx` | `submitContactForm(data)` → `POST /api/contact` |
| **User Authentication** | new `User.ts` | — | new `authService.ts` | future admin login | New `AuthContext` alongside the existing `IntroContext` pattern |
| **Admin Dashboard** | reuses domain types above | — | extends existing services with create/update/delete | new `pages/admin/*` | `ProtectedRoute` in `routes/`, authenticated variants of existing service functions |

**Key point, unchanged:** because every page already depends on `services/`, introducing a real backend is additive — new/updated service function bodies and a new `apiClient.ts` — not a rewrite of any existing page or component.

---

## 10. What This Architecture Deliberately Avoids

- No state management library — Context (`IntroContext`) + component state has been sufficient so far.
- No CSS-in-JS — Tailwind + the `@theme` token block covers it.
- No premature `admin/`/`api/` folders — still true; not created until actually needed.
- No test folder yet — still true; colocate `Component.test.tsx` next to `Component.tsx` when tests are introduced.

---

## 11. Summary for New Contributors

- Building a new page? → `pages/`, register the route in `routes/AppRoutes.tsx`, swap it in for the matching `ComingSoon` entry.
- Building a reusable UI piece? → `components/common/` (generic) or `components/<page>/` (specific to one page).
- Need placeholder content? → `data/`, accessed through a matching function in `services/`.
- Defining the shape of something? → `types/`.
- Extracting repeated logic? → `hooks/` (stateful) or `utils/` (pure functions).
- Adding a link, config value, or timing constant? → `constants/`.
- Need state shared deeply across the tree (not just prop-drilled)? → `context/` — `IntroContext` is the existing example to follow.

If you're unsure where something goes, that's usually a sign the task doesn't fit cleanly into an existing folder — worth a quick discussion before adding a new one, same as it was before any code existed.

---

## 12. Design Reference

The visual identity ("Astra Cosmic Technical") — full color palette, typography rationale, spacing rhythm, and component treatment (glassmorphism, glow accents, the corner-bracket "viewfinder" motif used in the Hero and Team page) — is implemented as CSS tokens in `src/styles/index.css` (section 3 above). There is no separate design-system document beyond this file; the token block *is* the source of truth, kept deliberately close to the code it styles so the two can't drift apart.

---

## 13. Implementation Status

A snapshot, kept roughly current:

- ✅ **Home** — hero (crossfading looped video, iris reveal, scroll-linked parallax), Telemetry Bar, Mission, Recent Events, Gallery teaser, Team teaser, Join CTA.
- ✅ **Team** — full department/roster structure, placeholder "open seat" cards, ready for real member data.
- ✅ **Intro sequence** — plays once per session, skips for `prefers-reduced-motion`.
- ✅ **Site-wide background** — parallax starfield with shooting stars and constellations.
- ⏳ **Events, Gallery, Reports, Contact** — routed, currently placeholders (`ComingSoon`).
- ⏳ **Backend** — not started; see section 9 for the planned integration seam.
- ⏳ **Tests** — none yet; see section 10.
