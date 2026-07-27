const SESSION_KEY = "astra-intro-shown";

/** True once the intro has played this browser session, or if storage is unavailable (fail open). */
export function hasIntroPlayed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return true;
  }
}

export function markIntroPlayed(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // Non-fatal if storage is unavailable (e.g. private browsing).
  }
}

export function prefersReducedMotionNow(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
