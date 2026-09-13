/** Shared timing between IntroSequence and Navbar so the flight/crossfade never drifts out of sync. */
export const INTRO_TIMING = {
  crossfadeMs: 650,
  flightMs: 1200,
  /** Delay before the backdrop starts dissolving, so the flight gets a beat to register first. */
  overlayFadeDelayMs: 120,
  overlayFadeMs: 1200,
} as const;
