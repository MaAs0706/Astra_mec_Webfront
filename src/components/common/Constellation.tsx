import { motion, useReducedMotion } from "framer-motion";

const points: Array<[number, number]> = [
  [10, 80],
  [55, 35],
  [115, 55],
  [165, 12],
  [225, 45],
];

const pathD = points
  .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`)
  .join(" ");

/**
 * A small hand-placed constellation that "draws in" once as it scrolls into
 * view — one on-theme, one-time reveal rather than a continuous effect.
 */
export function Constellation({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 240 100"
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
    >
      <motion.path
        d={pathD}
        fill="none"
        stroke="rgba(0, 242, 254, 0.35)"
        strokeWidth={1}
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      {points.map(([x, y], index) => (
        <motion.circle
          key={index}
          cx={x}
          cy={y}
          r={2}
          fill="rgba(226, 232, 240, 0.6)"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.25 }}
        />
      ))}
    </svg>
  );
}
