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
const systemChecks = [
  { label: "ORBITAL TRAJECTORY", value: "LOCKED" },
  { label: "PROPULSION / FUEL", value: "NOMINAL" },
  { label: "AI NAVIGATION CORE", value: "READY" },
  { label: "DEEP SPACE UPLINK", value: "CONNECTED" },
];

interface IntroSequenceProps {
  /** Fires the instant the title starts flying into the navbar — parent mounts the site and flips morphing=true. */
  onFlightStart: () => void;
  /** Fires once the flight/morph itself has settled — parent flips morphing=false. */
  onFlightEnd: () => void;
  /** Fires once the overlay has fully faded and can be unmounted. */
  onComplete: () => void;
}

/**
 * Full-screen mission-control boot sequence. A scanning orbital display first
 * establishes the club's space/robotics identity, then resolves into the logo
 * and finally hands the brand off to the navbar with a shared layout animation.
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
        <Starfield density={55} shootingStars />
      </div>

      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-tertiary-cyan/65 sm:inset-x-8 sm:top-8 sm:text-[10px]">
        <motion.span initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          ASTRA // MISSION CONTROL
        </motion.span>
        <motion.span initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="hidden sm:block">
          10° 01′ N · 76° 19′ E
        </motion.span>
      </div>

      <div className="pointer-events-none absolute inset-x-5 bottom-6 flex items-end justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-metallic-silver/60 sm:inset-x-8 sm:bottom-8 sm:text-[10px]">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          Signal // 98.4%
        </motion.span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          MEC · EST. 2023
        </motion.span>
      </div>

      <motion.aside
        aria-label="System boot checks"
        className="pointer-events-none absolute left-1/2 top-[15%] w-[17rem] -translate-x-1/2 border border-tertiary-cyan/20 bg-space-black/45 p-3 font-mono text-[9px] uppercase tracking-[0.13em] backdrop-blur-sm sm:left-8 sm:top-1/2 sm:w-52 sm:-translate-x-0 sm:-translate-y-1/2"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.45 }}
      >
        <div className="mb-3 flex items-center justify-between border-b border-tertiary-cyan/20 pb-2 text-tertiary-cyan/75">
          <span>BOOT SEQUENCE</span>
          <span>v 01.26</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {systemChecks.map((check, index) => (
            <motion.div
              key={check.label}
              className="flex items-center justify-between gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.52, duration: 0.32 }}
            >
              <span className="text-metallic-silver/70">{check.label}</span>
              <span className="shrink-0 text-tertiary-cyan">✓ {check.value}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-3 h-px origin-left bg-tertiary-cyan"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.9, duration: 0.55, ease: "easeOut" }}
        />
      </motion.aside>

      {/* Logo reveal and title crossfade over each other — no hard cut between them. */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: phase === "logo" ? 1 : 0 }}
        transition={{ duration: CROSSFADE_MS / 1000, ease: "easeInOut" }}
      >
        <div className="relative flex items-center justify-center">
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            className="pointer-events-none absolute h-[20rem] w-[20rem] sm:h-[29rem] sm:w-[29rem]"
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 0.8, rotate: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <motion.circle
              cx="200"
              cy="200"
              r="132"
              fill="none"
              stroke="rgba(0,242,254,0.3)"
              strokeWidth="1"
              strokeDasharray="5 10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.35, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx="200"
              cy="200"
              rx="180"
              ry="76"
              fill="none"
              stroke="rgba(139,92,246,0.34)"
              strokeWidth="1"
              strokeDasharray="2 8"
              transform="rotate(-28 200 200)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
            />
            <motion.circle
              cx="326"
              cy="156"
              r="4"
              fill="#00f2fe"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.65], scale: 1 }}
              transition={{ duration: 0.55, delay: 0.9 }}
            />
          </motion.svg>
          {pingRings.map((i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute h-28 w-28 rounded-full border border-tertiary-cyan/40 sm:h-36 sm:w-36"
              initial={{ scale: 0.7, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{
                duration: 1.8,
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

          <motion.div
            className="absolute left-1/2 top-[calc(100%+1.5rem)] flex -translate-x-1/2 flex-col items-center gap-2 whitespace-nowrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.15, duration: 0.45 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-tertiary-cyan">System online</span>
            <span className="h-px w-20 bg-gradient-to-r from-transparent via-tertiary-cyan to-transparent" />
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
          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              layoutId="astra-brand"
              transition={{ duration: FLIGHT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center overflow-hidden rounded-full px-8 py-3 sm:px-14 sm:py-5"
            >
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="whitespace-nowrap font-display text-4xl font-bold tracking-wide text-starlight-white sm:text-6xl lg:text-7xl"
              >
                {siteConfig.name}
              </motion.span>
            </motion.div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="font-mono text-[10px] uppercase tracking-[0.24em] text-metallic-silver sm:text-xs">
              Astronomy · Robotics · Flight Systems
            </motion.span>
          </div>
        )}
      </motion.div>

      {phase !== "morphing" && (
        <motion.span
          className="pointer-events-none absolute bottom-14 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.16em] text-metallic-silver/55 sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
        >
          All research systems verified
        </motion.span>
      )}

      {phase !== "morphing" && (
        <button
          type="button"
          onClick={goToMorphing}
          className="absolute right-5 top-14 z-10 rounded-sm border border-metallic-silver/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-metallic-silver/70 transition-colors hover:border-tertiary-cyan/70 hover:text-tertiary-cyan sm:right-8 sm:top-16"
        >
          Skip →
        </button>
      )}
    </div>
  );
}
