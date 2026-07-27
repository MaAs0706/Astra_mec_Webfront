import { motion } from "framer-motion";

/**
 * An open, unfilled roster slot. No name/photo/role — once a real
 * TeamMember exists for this seat, DepartmentSection swaps this out for an
 * actual member card; nothing else about the layout changes.
 */
export function PlaceholderCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-metallic-silver/25 bg-deep-nebula/10 text-center transition-colors duration-300 hover:border-tertiary-cyan/50 hover:bg-deep-nebula/20"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-metallic-silver/30 font-mono text-lg text-metallic-silver/50">
        ?
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-metallic-silver/50">
        Open Seat
      </span>
    </motion.div>
  );
}
