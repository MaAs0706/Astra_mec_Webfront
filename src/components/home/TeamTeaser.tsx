import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionGlow } from "@/components/common/SectionGlow";
import { Constellation } from "@/components/common/Constellation";
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

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="glass-panel group relative flex min-h-44 flex-row items-center gap-4 overflow-hidden rounded-lg p-5 text-left transition-colors hover:border-tertiary-cyan/50 sm:min-h-56 sm:flex-col sm:justify-center sm:gap-3 sm:p-6 sm:text-center"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tertiary-cyan/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-tertiary-cyan/30 bg-gradient-to-br from-secondary-blue to-primary-purple font-mono text-lg text-starlight-white shadow-[0_0_22px_rgba(18,62,234,0.3)]">
                {member.initials}
              </div>
              <div>
                <p className="font-display text-base text-starlight-white">{member.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-metallic-silver">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
