import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionGlow } from "@/components/common/SectionGlow";
import { getEvents } from "@/services/eventService";
import type { AstraEvent } from "@/types/Event";

const categoryLabels: Record<AstraEvent["category"], string> = {
  hackathon: "Buildathon",
  workshop: "Workshop",
  observation: "Observation",
  talk: "Talk",
};

export function Events() {
  const [events, setEvents] = useState<AstraEvent[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const ethereal = events.find((event) => event.id === "ethereal-2025");
  const archive = events.filter((event) => event.id !== "ethereal-2025").reverse();

  return (
    <div className="container-astra relative flex flex-col gap-16 py-20 sm:gap-24">
      <SectionGlow color="rgba(147, 51, 234, 0.25)" className="-left-36 top-16 h-80 w-80" />
      <SectionGlow color="rgba(0, 242, 254, 0.14)" className="-right-28 top-[28rem] h-80 w-80" />

      <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-tertiary-cyan">Mission archive</span>
        <h1 className="mt-3 font-display text-5xl font-bold text-starlight-white sm:text-6xl">Events</h1>
        <p className="mt-5 text-base leading-7 text-metallic-silver sm:text-lg">Builds, observations, workshops, and the experiments that bring Astra MEC to life.</p>
      </motion.header>

      {ethereal && (
        <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-2xl border border-primary-purple/40 bg-deep-nebula/80 p-6 shadow-[0_20px_80px_rgba(89,38,168,0.18)] sm:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(0,242,254,0.16),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(147,51,234,0.3),transparent_38%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <span className="inline-flex rounded-sm border border-tertiary-cyan/50 bg-space-black/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-tertiary-cyan">Flagship event · 2025</span>
              <h2 className="mt-5 font-display text-4xl font-bold text-starlight-white sm:text-6xl">Ethereal</h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-metallic-silver sm:text-base">{ethereal.description}</p>
            </div>
            <div className="grid gap-3 font-mono text-[11px] uppercase tracking-[0.15em] sm:grid-cols-2 lg:grid-cols-1">
              {["Freshers only", "Overnight build", "Halloween × Cyberpunk", "RoboWar finale"].map((detail) => <div key={detail} className="border-l-2 border-tertiary-cyan/70 bg-space-black/35 px-4 py-3 text-starlight-white">{detail}</div>)}
            </div>
          </div>
          <div className="relative mt-10 grid gap-3 border-t border-metallic-silver/15 pt-6 sm:grid-cols-4">
            {["Design", "Assemble", "Program", "Enter the arena"].map((step, index) => <div key={step} className="flex items-center gap-3"><span className="font-mono text-xs text-tertiary-cyan">0{index + 1}</span><span className="font-mono text-[11px] uppercase tracking-[0.14em] text-starlight-white">{step}</span></div>)}
          </div>
        </motion.article>
      )}

      <section aria-labelledby="archive-title">
        <div className="mb-7 flex items-end justify-between gap-4"><div><span className="font-mono text-xs uppercase tracking-[0.2em] text-tertiary-cyan">More transmissions</span><h2 id="archive-title" className="mt-2 font-display text-3xl font-semibold text-starlight-white">Event archive</h2></div><span className="font-mono text-xs text-metallic-silver/60">{archive.length} records</span></div>
        <div className="grid gap-4 md:grid-cols-2">
          {archive.map((event) => <article key={event.id} className="rounded-xl border border-metallic-silver/20 bg-space-black/45 p-5 transition-colors hover:border-tertiary-cyan/45"><div className="flex items-center justify-between gap-4"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary-cyan">{categoryLabels[event.category]}</span><span className="font-mono text-[10px] text-metallic-silver/60">{event.date.slice(0, 4)}</span></div><h3 className="mt-4 font-display text-2xl font-semibold text-starlight-white">{event.title}</h3><p className="mt-2 text-sm leading-6 text-metallic-silver">{event.summary}</p></article>)}
        </div>
      </section>
    </div>
  );
}
