# Astra MEC Website

Official website of Astra — the astronomy & space-tech club of Model Engineering College.

## Stack

React + TypeScript + Vite + Tailwind CSS v4 + React Router + Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

## Where things live

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full folder-by-folder guide, naming conventions, and how pages will connect to a future backend. Quick reference:

- New page → `src/pages/`, register the route in `src/routes/AppRoutes.tsx`
- Reusable UI → `src/components/common/` (generic) or `src/components/<domain>/`
- Placeholder content → `src/data/`, accessed through `src/services/`
- Shared types → `src/types/`

## Status

Home and Team pages are built, including a one-time landing intro sequence (skips automatically on repeat visits or if the visitor prefers reduced motion — see `src/components/intro/`). Events, Gallery, Reports, and Contact are routed but currently show a placeholder — see `src/pages/ComingSoon.tsx`.

See [ARCHITECTURE.md](./ARCHITECTURE.md#13-implementation-status) for the fuller rundown.
