import { motion } from "framer-motion";
import { PlaceholderCard } from "@/components/team/PlaceholderCard";
import type { Department } from "@/types/Department";

/**
 * Renders one team/department as a labeled, self-contained unit. The grid
 * uses auto-fill/minmax so any seat count — 1 or 12 — lays out correctly
 * with no per-department breakpoint tuning.
 */
export function DepartmentSection({ department }: { department: Department }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center gap-4">
        <h2 className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-tertiary-cyan">
          {department.name}
        </h2>
        <div className="h-px flex-1 bg-metallic-silver/15" />
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-metallic-silver/50">
          {department.placeholderCount} {department.placeholderCount === 1 ? "seat" : "seats"}
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
        {Array.from({ length: department.placeholderCount }).map((_, index) => (
          <PlaceholderCard key={index} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
