import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/common/Button";
import { Starfield } from "@/components/common/Starfield";
import { useCrossfadeVideoLoop } from "@/hooks/useCrossfadeVideoLoop";
import heroVideo from "@/assets/videos/hero-galaxy.mp4";

const headlineLines = ["Two skies.", "One club."];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 1.1 },
  },
} as const;

const line = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

const cornerBase = "absolute h-10 w-10 border-metallic-silver/60 sm:h-14 sm:w-14";

// Fades the video out at the very edges so the starfield layer behind it
// bleeds through — the feed reads as floating inside space, not a flat rectangle.
const edgeFadeMask =
  "radial-gradient(ellipse at center, black 72%, transparent 100%)";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  useCrossfadeVideoLoop(videoARef, videoBRef);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const exitVignette = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

  return (
    <section
      ref={heroRef}
      className="relative h-[calc(100svh-5rem)] min-h-[560px] w-full overflow-hidden bg-space-black"
    >
      {/* Ambient depth layer — only visible through the video's edge fade and the vignette */}
      <div className="absolute inset-0">
        <Starfield density={60} />
      </div>

      {/* Iris reveal: the feed "opens" onto the page like a shutter, rather than fading in */}
      <motion.div
        className="absolute inset-0"
        initial={prefersReducedMotion ? false : { clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(150% at 50% 50%)" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maskImage: edgeFadeMask,
          WebkitMaskImage: edgeFadeMask,
        }}
      >
        <motion.video
          ref={videoARef}
          className="absolute inset-0 h-full w-full object-cover opacity-100"
          style={{
            scale: prefersReducedMotion ? 1 : videoScale,
            filter: "saturate(1.3) contrast(1.08) brightness(1.05)",
          }}
          src={heroVideo}
          autoPlay
          muted
          playsInline
        />
        <motion.video
          ref={videoBRef}
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          style={{
            scale: prefersReducedMotion ? 1 : videoScale,
            filter: "saturate(1.3) contrast(1.08) brightness(1.05)",
          }}
          src={heroVideo}
          muted
          playsInline
        />

        {/* Instrument-feed texture — reinforces "live feed", not decorative space */}
        <div className="effect-scanlines pointer-events-none absolute inset-0 opacity-[0.04]" />
        <div className="effect-grain pointer-events-none absolute inset-0 opacity-[0.05]" />
      </motion.div>

      {/* Vignette so nav + copy stay legible over the footage — kept light so the nebula's color still reads */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-space-black/50 via-space-black/5 to-space-black" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-space-black/50 via-transparent to-transparent" />
      {/* Deepens as the user scrolls out, cueing the exit into the Telemetry Bar */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-space-black"
        style={{ opacity: prefersReducedMotion ? 0 : exitVignette }}
      />

      {/* Soft instrument-glow accents, echoing the nebula's own palette */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl sm:h-96 sm:w-96"
        style={{
          background:
            "radial-gradient(circle, rgba(0,242,254,0.35) 0%, transparent 70%)",
        }}
        animate={prefersReducedMotion ? { opacity: 0.2 } : { opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full blur-3xl sm:h-[28rem] sm:w-[28rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
        }}
        animate={prefersReducedMotion ? { opacity: 0.15 } : { opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Full-viewport corner brackets — the viewfinder motif, scaled up */}
      <span className={`${cornerBase} left-4 top-4 border-l-2 border-t-2 sm:left-6 sm:top-6`} />
      <span className={`${cornerBase} right-4 top-4 border-r-2 border-t-2 sm:right-6 sm:top-6`} />
      <span className={`${cornerBase} bottom-4 left-4 border-b-2 border-l-2 sm:bottom-6 sm:left-6`} />
      <span className={`${cornerBase} bottom-4 right-4 border-b-2 border-r-2 sm:bottom-6 sm:right-6`} />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute right-6 top-6 hidden font-mono text-[11px] uppercase tracking-[0.15em] text-tertiary-cyan sm:block"
      >
        Feed // Observatory-01
      </motion.span>

      <motion.div
        className="container-astra absolute inset-x-0 bottom-16 flex flex-col gap-5 sm:bottom-20"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={line}
          className="font-mono text-xs uppercase tracking-[0.25em] text-tertiary-cyan"
        >
          Astra — Model Engineering College
        </motion.span>

        <h1 className="font-display text-5xl font-bold leading-[1.05] text-starlight-white drop-shadow-[0_2px_20px_rgba(3,7,18,0.8)] sm:text-7xl">
          {headlineLines.map((text) => (
            <motion.span key={text} variants={line} className="block">
              {text}
            </motion.span>
          ))}
        </h1>

        <motion.p variants={line} className="max-w-md text-lg text-metallic-silver">
          We track what's above us and build what gets there — from
          telescope nights to student-built flight software.
        </motion.p>

        <motion.div variants={line} className="flex flex-wrap gap-4 pt-2">
          <Button to="/events" variant="primary">
            Explore Events
          </Button>
          <Button to="/contact" variant="ghost">
            Join the Crew
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metallic-silver">
          Scroll
        </span>
        <motion.span
          aria-hidden="true"
          className="h-6 w-px bg-metallic-silver/60"
          animate={prefersReducedMotion ? {} : { scaleY: [0.3, 1, 0.3] }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
