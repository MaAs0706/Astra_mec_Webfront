import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DepartmentSection } from "@/components/team/DepartmentSection";
import { getDepartments } from "@/services/teamService";
import { siteConfig } from "@/constants/site";
import type { Department } from "@/types/Department";

function RosterStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metallic-silver">
        {label}
      </span>
      <span className="font-mono text-lg text-starlight-white sm:text-xl">{value}</span>
    </div>
  );
}

export function Team() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    getDepartments().then(setDepartments);
  }, []);

  const openSeats = departments.reduce((sum, dept) => sum + dept.placeholderCount, 0);

  return (
    <div className="container-astra flex flex-col gap-16 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-4"
      >
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-tertiary-cyan">
          Crew Manifest
        </span>
        <h1 className="font-display text-5xl font-bold text-starlight-white sm:text-6xl">
          Team
        </h1>
        <p className="max-w-xl text-metallic-silver">
          The people running Astra day to day — across engineering, creative,
          outreach, and operations. Rosters below are opening up soon.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="glass-panel flex flex-wrap gap-8 rounded-lg px-6 py-5"
      >
        <RosterStat label="Departments" value={departments.length} />
        <RosterStat label="Open Seats" value={openSeats} />
        <RosterStat label="Est." value={siteConfig.foundedYear} />
      </motion.div>

      <div className="flex flex-col gap-14">
        {departments.map((department) => (
          <DepartmentSection key={department.id} department={department} />
        ))}
      </div>
    </div>
  );
}
