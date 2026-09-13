import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/constants/site";
import { INTRO_TIMING } from "@/constants/intro";
import { markIntroPlayed } from "@/utils/introSession";

type Phase = "boot" | "launchCode" | "robotCode" | "checks" | "title" | "morphing";

const { crossfadeMs: CROSSFADE_MS, flightMs: FLIGHT_MS, overlayFadeDelayMs: OVERLAY_FADE_DELAY_MS, overlayFadeMs: OVERLAY_FADE_MS } = INTRO_TIMING;
const launchCode = ["const mission = await orbital.launch({", '  vehicle: "ASTRA-01",', '  target: "LOW_EARTH_ORBIT",', "  clearance: true", "});"];
const robotCode = ["robot.arm.calibrate();", "await robot.navigate({", '  destination: "MEC_RESEARCH_LAB",', "  mode: AUTONOMOUS", "});"];
const checkpoints = [["ORBIT CHECK", "LOCKED"], ["FUEL CHECK", "NOMINAL"], ["AI CORE", "ONLINE"], ["ROBOTICS LINK", "CONNECTED"]] as const;

interface IntroSequenceProps {
  onFlightStart: () => void;
  onFlightEnd: () => void;
  onComplete: () => void;
}

function TypedCode({ code, label }: { code: string[]; label: string }) {
  let wordIndex = 0;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="w-[min(92vw,42rem)] overflow-hidden rounded border border-[#39ff88]/35 bg-[#03130a]/95 shadow-[0_0_50px_rgba(57,255,136,0.08)]">
      <div className="flex items-center justify-between border-b border-[#39ff88]/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#72ffa7]/75 sm:px-4 sm:text-[10px]">
        <span>{label}</span><span>● SECURE SHELL</span>
      </div>
      <div className="min-h-56 p-4 font-mono text-xs leading-7 text-[#b8ffd0] sm:min-h-64 sm:p-6 sm:text-sm sm:leading-8">
        {code.map((line, lineIndex) => {
          const words = line.split(/(\s+)/);
          return <div key={lineIndex} className="min-h-7 whitespace-pre-wrap"><span className="mr-2 text-[#39ff88]/55">›</span>{words.map((word, index) => {
            if (/^\s+$/.test(word)) return word;
            const delay = 0.18 + wordIndex * 0.065;
            wordIndex += 1;
            return <motion.span key={`${lineIndex}-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.01, delay }}>{word}</motion.span>;
          })}</div>;
        })}
        <motion.div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#39ff88]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.38 }}>
          <span className="rounded border border-[#39ff88]/50 px-1.5 py-0.5">↵ ENTER</span><span>Command accepted</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** A research-computer startup that hands off to the hero through Framer's shared layout. */
export function IntroSequence({ onFlightStart, onFlightEnd, onComplete }: IntroSequenceProps) {
  const [phase, setPhase] = useState<Phase>("boot");
  const phaseRef = useRef<Phase>("boot");
  const [overlayDimming, setOverlayDimming] = useState(false);
  const timers = useRef<number[]>([]);

  function clearTimers() { timers.current.forEach((id) => window.clearTimeout(id)); timers.current = []; }
  function advance(next: Exclude<Phase, "morphing">) { phaseRef.current = next; setPhase(next); }
  function goToMorphing() {
    if (phaseRef.current === "morphing") return;
    clearTimers(); markIntroPlayed(); phaseRef.current = "morphing"; setPhase("morphing"); onFlightStart();
    const dimStart = window.setTimeout(() => setOverlayDimming(true), OVERLAY_FADE_DELAY_MS);
    const flightDone = window.setTimeout(onFlightEnd, FLIGHT_MS);
    const overlayDone = window.setTimeout(onComplete, OVERLAY_FADE_DELAY_MS + OVERLAY_FADE_MS);
    timers.current.push(dimStart, flightDone, overlayDone);
  }

  useEffect(() => {
    const schedule = (afterMs: number, callback: () => void) => timers.current.push(window.setTimeout(callback, afterMs));
    schedule(1800, () => advance("launchCode"));
    schedule(3700, () => advance("robotCode"));
    schedule(5600, () => advance("checks"));
    schedule(7400, () => advance("title"));
    schedule(9100, goToMorphing);
    return clearTimers;
    // The sequence is scheduled once; Skip cancels the remaining timeline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showTitle = phase === "title" || phase === "morphing";
  const morphing = phase === "morphing";
  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-[#010703]" style={{ opacity: overlayDimming ? 0 : 1, pointerEvents: morphing ? "none" : "auto", transition: `opacity ${OVERLAY_FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)` }}>
      {phase === "boot" && <motion.div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[#39ff88]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}>
        <motion.span className="text-xs uppercase tracking-[0.34em] sm:text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>System starting</motion.span>
        <div className="mt-5 h-px w-48 overflow-hidden bg-[#39ff88]/20 sm:w-64"><motion.div className="h-full bg-[#39ff88] shadow-[0_0_12px_#39ff88]" initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.55, duration: 0.9, ease: "easeInOut" }} /></div>
        <motion.span className="mt-3 text-[9px] uppercase tracking-[0.2em] text-[#8cffb1]/65" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>Astra research operating environment</motion.span>
      </motion.div>}

      {(phase === "launchCode" || phase === "robotCode") && <div className="absolute inset-0 flex items-center justify-center px-4"><TypedCode code={phase === "launchCode" ? launchCode : robotCode} label={phase === "launchCode" ? "LAUNCH_PROTOCOL.ts" : "ROBOTICS_CONTROLLER.ts"} /></div>}

      {phase === "checks" && <motion.section aria-label="Research systems checkpoints" className="absolute inset-0 flex items-center justify-center px-5 font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="w-[min(92vw,34rem)] border border-[#39ff88]/30 bg-[#03130a]/90 p-5 shadow-[0_0_55px_rgba(57,255,136,0.08)] sm:p-7">
          <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#39ff88]">Research systems diagnostic</p>
          <div className="flex flex-col gap-4">{checkpoints.map(([name, state], index) => <motion.div key={name} className="flex items-center justify-between gap-4 border-b border-[#39ff88]/15 pb-3 text-[10px] uppercase tracking-[0.14em] sm:text-xs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 + index * 0.28 }}><span className="text-[#c7ffda]/75">{name}</span><span className="shrink-0 text-[#39ff88]">✓ {state}</span></motion.div>)}</div>
          <motion.div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#39ff88]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45 }}><span className="h-2 w-2 rounded-full bg-[#39ff88] shadow-[0_0_10px_#39ff88]" /> System online</motion.div>
        </div>
      </motion.section>}

      <motion.div className="absolute inset-0 flex items-center justify-center" animate={{ opacity: showTitle ? 1 : 0 }} transition={{ duration: CROSSFADE_MS / 1000, ease: "easeInOut" }}>
        {phase === "title" && <div className="relative flex flex-col items-center gap-4 text-center">
          <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#39ff88] sm:text-xs">Mission log // system online</motion.span>
          <motion.div layoutId="astra-brand" transition={{ duration: FLIGHT_MS / 1000, ease: [0.16, 1, 0.3, 1] }} className="relative flex items-center justify-center overflow-hidden rounded-full px-8 py-3 sm:px-14 sm:py-5"><motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.14, ease: "easeOut" }} className="whitespace-nowrap font-display text-5xl font-bold tracking-[0.12em] text-starlight-white sm:text-7xl">ASTRA</motion.span></motion.div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="font-mono text-[10px] uppercase tracking-[0.2em] text-metallic-silver sm:text-xs">{siteConfig.fullName}</motion.span>
        </div>}
      </motion.div>

      {phase !== "morphing" && <button type="button" onClick={goToMorphing} className="absolute right-5 top-5 z-10 rounded-sm border border-[#39ff88]/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#8cffb1]/70 transition-colors hover:border-[#39ff88] hover:text-[#39ff88] sm:right-8 sm:top-8">Skip →</button>}
    </div>
  );
}
