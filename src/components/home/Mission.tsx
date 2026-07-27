import { motion } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionGlow } from "@/components/common/SectionGlow";

export function Mission() {
  return (
    <section className="container-astra relative grid gap-10 py-20 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <SectionGlow
        color="rgba(139, 92, 246, 0.28)"
        className="-left-40 -top-20 h-[28rem] w-[28rem]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col gap-5"
      >
        <SectionHeading
          eyebrow="Our Mission"
          title="Two disciplines, one lab bench"
          description="Astra exists for students who want to point a telescope at the sky one week and solder a flight controller the next. We run observation nights, robotics builds, and workshops that turn coursework into something that actually flies, launches, or looks back at the stars."
        />
        <p className="max-w-xl text-metallic-silver">
          Membership is open to any MEC student, regardless of year or
          department — most of what we teach, we learned by building it
          ourselves first.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-panel relative flex flex-col gap-4 rounded-lg p-6"
      >
        <p className="font-display text-xl leading-snug text-starlight-white">
          "We don't wait for the syllabus to catch up — if a mission needs a
          skill we don't have yet, we build the workshop for it."
        </p>
        <div className="flex items-center gap-3 border-t border-metallic-silver/15 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary-blue to-primary-purple font-mono text-xs text-starlight-white">
            AM
          </div>
          <div>
            <p className="font-mono text-sm text-starlight-white">Ananya Menon</p>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-metallic-silver">
              Chairperson
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
