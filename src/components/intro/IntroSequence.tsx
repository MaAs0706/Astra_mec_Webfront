import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/images/astra-logo.png";
import { siteConfig } from "@/constants/site";
import { INTRO_TIMING } from "@/constants/intro";
import { Starfield } from "@/components/common/Starfield";
import { markIntroPlayed } from "@/utils/introSession";

type Phase = "logo" | "title" | "morphing";

const {
  logoAnimationMs: LOGO_ANIMATION_MS,
  crossfadeMs: CROSSFADE_MS,
  titleHoldMs: TITLE_HOLD_MS,
  flightMs: FLIGHT_MS,
  overlayFadeDelayMs: OVERLAY_FADE_DELAY_MS,
  overlayFadeMs: OVERLAY_FADE_MS,
} = INTRO_TIMING;

const pingRings = [0, 1, 2];

interface IntroSequenceProps {
  /** Fires the instant the title starts flying into the navbar — parent mounts the site and flips morphing=true. */
  onFlightStart: () => void;
  /** Fires once the flight/morph itself has settled — parent flips morphing=false. */
  onFlightEnd: () => void;
  /** Fires once the overlay has fully faded and can be unmounted. */
  onComplete: () => void;
}

/**
 * Full-screen intro, built entirely in React/Framer Motion (no video asset):
 * a code-driven logo reveal crossfades into a text-only title card, which
 * holds briefly, then flies to the navbar's logo position while cross-fading
 * into the logo mid-flight (see Navbar.tsx's "astra-brand" layoutId, which
 * is what actually renders the two overlapping states this component leaves
 * behind — Framer Motion computes the flight itself from that shared id).
 */
export function IntroSequence({ onFlightStart, onFlightEnd, onComplete }: IntroSequenceProps) {
  const [phase, setPhase] = useState<Phase>("logo");
  const phaseRef = useRef<Phase>("logo");
  // Separate from `phase` so the backdrop can start dissolving slightly
  // *after* the flight begins, instead of everything cutting at once.
  const [overlayDimming, setOverlayDimming] = useState(false);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  // Only ever called from timers or the Skip button's onClick — never during
  // render — so plain state reads/writes are safe (no functional-updater
  // side-effect trap here).
  function goToMorphing() {
    if (phaseRef.current === "morphing") return;
    clearTimers();
    markIntroPlayed();
    phaseRef.current = "morphing";
    setPhase("morphing");
    onFlightStart();

    const dimStart = window.setTimeout(() => setOverlayDimming(true), OVERLAY_FADE_DELAY_MS);
    const flightDone = window.setTimeout(onFlightEnd, FLIGHT_MS);
    const overlayDone = window.setTimeout(
      onComplete,
      OVERLAY_FADE_DELAY_MS + OVERLAY_FADE_MS,
    );
    timers.current.push(dimStart, flightDone, overlayDone);
  }

  function goToTitle() {
    if (phaseRef.current !== "logo") return;
    clearTimers();
    phaseRef.current = "title";
    setPhase("title");
    const t = window.setTimeout(goToMorphing, TITLE_HOLD_MS);
    timers.current.push(t);
  }

  useEffect(() => {
    const t = window.setTimeout(goToTitle, LOGO_ANIMATION_MS);
    timers.current.push(t);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showTitle = phase === "title" || phase === "morphing";
  const morphing = phase === "morphing";

  return (
    <div
      className="fixed inset-0 z-[999] overflow-hidden bg-space-black"
      style={{
        opacity: overlayDimming ? 0 : 1,
        // Stop intercepting clicks the instant the flight begins, well
        // before the visual fade catches up.
        pointerEvents: morphing ? "none" : "auto",
        transition: `opacity ${OVERLAY_FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="absolute inset-0">
        <Starfield density={50} />
      </div>

      {/* Logo reveal and title crossfade over each other — no hard cut between them. */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: phase === "logo" ? 1 : 0 }}
        transition={{ duration: CROSSFADE_MS / 1000, ease: "easeInOut" }}
      >
        <div className="relative flex items-center justify-center">
          {pingRings.map((i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute h-28 w-28 rounded-full border border-tertiary-cyan/40 sm:h-36 sm:w-36"
              initial={{ scale: 0.7, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          ))}

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute h-56 w-56 rounded-full blur-3xl sm:h-72 sm:w-72"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          <motion.div
            className="relative h-28 w-28 overflow-hidden rounded-full sm:h-36 sm:w-36"
            initial={{ clipPath: "circle(0% at 50% 50%)", scale: 0.85 }}
            animate={{ clipPath: "circle(75% at 50% 50%)", scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <img src={logo} alt={siteConfig.name} className="h-full w-full object-cover" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: showTitle ? 1 : 0 }}
        transition={{ duration: CROSSFADE_MS / 1000, ease: "easeInOut" }}
      >
        {showTitle && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute h-64 w-64 rounded-full blur-3xl sm:h-80 sm:w-80"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: morphing ? 0 : 1 }}
            transition={{ duration: morphing ? FLIGHT_MS / 1000 : 0.6 }}
          />
        )}

        {/* Only the title flies — see Navbar's matching "astra-brand" layoutId,
            which is where the crossfade into the logo actually happens. */}
        {phase === "title" && (
          <motion.div
            layoutId="astra-brand"
            transition={{ duration: FLIGHT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center overflow-hidden rounded-full px-10 py-6 sm:px-14 sm:py-8"
          >
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="whitespace-nowrap font-display text-4xl font-bold tracking-wide text-starlight-white sm:text-6xl lg:text-7xl"
            >
              {siteConfig.name}
            </motion.span>
          </motion.div>
        )}
      </motion.div>

      {phase !== "morphing" && (
        <button
          type="button"
          onClick={goToMorphing}
          className="absolute bottom-6 right-6 z-10 font-mono text-xs uppercase tracking-[0.15em] text-metallic-silver/70 transition-colors hover:text-tertiary-cyan"
        >
          Skip →
        </button>
      )}
    </div>
  );
}
