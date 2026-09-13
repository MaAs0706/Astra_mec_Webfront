import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionGlow } from "@/components/common/SectionGlow";
import { Constellation } from "@/components/common/Constellation";
import { CrewAccordion } from "@/components/team/CrewAccordion";
import { getFeaturedTeamMembers } from "@/services/teamService";
import type { TeamMember } from "@/types/TeamMember";

export function TeamTeaser() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    getFeaturedTeamMembers(4).then(setMembers);
  }, []);

  return (
    <section className="container-astra relative py-16 sm:py-24" aria-labelledby="core-team-title">
      <SectionGlow
        color="rgba(139, 92, 246, 0.22)"
        className="-right-40 -top-16 h-[26rem] w-[26rem]"
      />
      <Constellation className="right-4 top-0 hidden w-64 opacity-70 sm:block" />

      <div className="relative flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id="core-team-title" eyebrow="Crew roster" title="Meet the core" />
          <Link
            to="/team"
            className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary-cyan hover:underline"
          >
            Meet the full crew →
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
          <CrewAccordion members={members} />
        </motion.div>
      </div>
    </section>
  );
}
