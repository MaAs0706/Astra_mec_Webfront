import { useEffect } from "react";

const CROSSFADE_SECONDS = 0.8;

/**
 * Loops between two <video> elements playing the same clip, crossfading
 * shortly before each one ends so the loop point is masked by a dissolve
 * instead of a hard cut. Both videos only ever play forward — no seeking —
 * so there's no seek-performance ceiling to fight (compressed video can
 * only seek instantly to keyframes; reverse playback via manual seeking
 * will always be choppy without re-encoding the source with far denser
 * keyframes).
 *
 * The fade itself is a native CSS opacity transition, not a manual
 * requestAnimationFrame loop — a rAF-driven fade can get permanently stuck
 * (swap bookkeeping never completes) if even one frame is skipped, e.g. a
 * throttled/backgrounded tab. A CSS transition runs on the compositor and
 * can't get stuck that way; a plain setTimeout (not tied to rendering)
 * handles the "fade is done, do the bookkeeping" step instead.
 */
export function useCrossfadeVideoLoop(
  primaryRef: React.RefObject<HTMLVideoElement | null>,
  secondaryRef: React.RefObject<HTMLVideoElement | null>,
) {
  useEffect(() => {
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    if (!primary || !secondary) return;

    let active = primary;
    let standby = secondary;
    let swapping = false;
    let swapTimeoutId = 0;

    for (const video of [primary, secondary]) {
      video.style.transition = `opacity ${CROSSFADE_SECONDS}s ease`;
    }
    active.style.opacity = "1";
    standby.style.opacity = "0";

    function beginCrossfade() {
      swapping = true;
      const fadingOut = active;
      const fadingIn = standby;

      fadingIn.currentTime = 0;
      fadingIn.play().catch(() => {});

      fadingOut.style.opacity = "0";
      fadingIn.style.opacity = "1";

      swapTimeoutId = window.setTimeout(() => {
        fadingOut.pause();
        fadingOut.currentTime = 0;
        active = fadingIn;
        standby = fadingOut;
        swapping = false;
      }, CROSSFADE_SECONDS * 1000);
    }

    function handleTimeUpdate() {
      if (swapping || !active.duration) return;
      if (active.duration - active.currentTime <= CROSSFADE_SECONDS) {
        beginCrossfade();
      }
    }

    primary.addEventListener("timeupdate", handleTimeUpdate);
    secondary.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      primary.removeEventListener("timeupdate", handleTimeUpdate);
      secondary.removeEventListener("timeupdate", handleTimeUpdate);
      window.clearTimeout(swapTimeoutId);
    };
  }, [primaryRef, secondaryRef]);
}
