/** Shared timing between IntroSequence and Navbar so the flight/crossfade never drifts out of sync. */
export const INTRO_TIMING = {
  logoAnimationMs: 3000,
  crossfadeMs: 800,
  titleHoldMs: 2200,
  flightMs: 1300,
  /** Delay before the backdrop starts dissolving, so the flight gets a beat to register first. */
  overlayFadeDelayMs: 200,
  overlayFadeMs: 1800,
} as const;
