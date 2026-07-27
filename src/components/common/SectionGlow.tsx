import { motion } from "framer-motion";

interface SectionGlowProps {
  /** CSS color (rgba/hex) used at the center of the radial glow. */
  color: string;
  /** Positioning + size utility classes, e.g. "-left-32 -top-24 h-[28rem] w-[28rem]". */
  className?: string;
}

/**
 * A large, soft, blurred radial glow placed as the first child of a section
 * so later siblings paint over it naturally (no z-index needed). Fades in
 * once as the section scrolls into view, giving each section its own
 * ambient tint instead of one flat background throughout the page.
 */
export function SectionGlow({ color, className = "" }: SectionGlowProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    />
  );
}
