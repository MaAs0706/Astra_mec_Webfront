import { useReducedMotion } from "framer-motion";

/**
 * A barely-visible, slow-drifting strip of mono "telemetry" text behind a
 * section — reinforces the mission-control voice at near-zero visual cost.
 * Static (no drift) when the user prefers reduced motion.
 */
export function DataTicker({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute overflow-hidden whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-metallic-silver/10 ${className}`}
    >
      <span className={prefersReducedMotion ? "inline-block" : "inline-block animate-data-ticker"}>
        {text} &nbsp;&nbsp;&nbsp;&nbsp; {text}
      </span>
    </div>
  );
}
