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
    <section className="container-astra relative py-20">
      <SectionGlow
        color="rgba(139, 92, 246, 0.22)"
        className="-right-40 -top-16 h-[26rem] w-[26rem]"
      />
      <Constellation className="right-4 top-0 hidden w-64 opacity-70 sm:block" />

      <div className="relative flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Crew Roster" title="Meet the core" />
          <Link
            to="/team"
            className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary-cyan hover:underline"
          >
            Meet the full crew →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="glass-panel flex flex-col items-center gap-3 rounded-lg p-6 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary-blue to-primary-purple font-mono text-lg text-starlight-white">
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
