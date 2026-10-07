import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DepartmentSection } from "@/components/team/DepartmentSection";
import { DriftWall } from "@/components/team/DriftWall";
import { getDepartments, getTeamMembers } from "@/services/teamService";
import { siteConfig } from "@/constants/site";
import type { Department } from "@/types/Department";
import type { TeamMember } from "@/types/TeamMember";

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
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    getDepartments().then(setDepartments);
    getTeamMembers().then(setMembers);
  }, []);

  const openSeats = departments.reduce((sum, dept) => sum + dept.placeholderCount, 0);
  const driftItems = departments.map((department, index) => ({
    id: department.id,
    title: department.name,
    detail: `${department.placeholderCount} open ${department.placeholderCount === 1 ? "seat" : "seats"}`,
    tone: ["from-secondary-blue/70 to-space-black", "from-primary-purple/70 to-deep-nebula", "from-tertiary-cyan/40 to-space-black"][index % 3],
  }));

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
        <p className="max-w-xl text-metallic-silver">The people running Astra day to day — across engineering, creative, outreach, and operations.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="glass-panel flex flex-wrap gap-8 rounded-lg px-6 py-5"
      >
        <RosterStat label="Crew listed" value={members.length} />
        <RosterStat label="Departments" value={departments.length} />
        <RosterStat label="Roster capacity" value={`${openSeats}+`} />
        <RosterStat label="Est." value={siteConfig.foundedYear} />
      </motion.div>

      <section className="flex flex-col gap-6" aria-labelledby="crew-manifest-title">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary-cyan">Core command</span>
            <h2 id="crew-manifest-title" className="mt-2 font-display text-3xl font-semibold text-starlight-white">Crew manifest</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-metallic-silver/65">More members can be added to the roster as the crew grows</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member, index) => (
            <motion.article key={member.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.38, delay: Math.min(index * 0.05, 0.25) }} className="group relative overflow-hidden rounded-xl border border-metallic-silver/20 bg-space-black/55 p-5">
              <div aria-hidden="true" className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-tertiary-cyan/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-tertiary-cyan/55 bg-deep-nebula font-display text-lg font-semibold text-tertiary-cyan">{member.initials}</div><div><h3 className="font-display text-xl font-semibold text-starlight-white">{member.name}</h3><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.13em] text-metallic-silver">{member.role}</p></div></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5" aria-labelledby="crew-field-title">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary-cyan">Live crew field</span>
          <h2 id="crew-field-title" className="mt-2 font-display text-3xl font-semibold text-starlight-white">Departments in motion</h2>
        </div>
        <DriftWall items={driftItems} />
      </section>

      <div className="flex flex-col gap-14">
        {departments.map((department) => (
          <DepartmentSection key={department.id} department={department} />
        ))}
      </div>
    </div>
  );
}
