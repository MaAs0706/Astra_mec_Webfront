import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionGlow } from "@/components/common/SectionGlow";
import { DataTicker } from "@/components/common/DataTicker";
import { getRecentEvents } from "@/services/eventService";
import type { AstraEvent } from "@/types/Event";

const categoryLabel: Record<AstraEvent["category"], string> = {
  hackathon: "Hackathon",
  workshop: "Workshop",
  observation: "Observation",
  talk: "Talk",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RecentEvents() {
  const [events, setEvents] = useState<AstraEvent[]>([]);

  useEffect(() => {
    getRecentEvents(4).then(setEvents);
  }, []);

  return (
    <section className="container-astra relative py-20">
      <SectionGlow
        color="rgba(18, 62, 234, 0.3)"
        className="-right-40 top-10 h-[26rem] w-[26rem]"
      />
      <DataTicker
        text="RA 05H 34M 31S · DEC +22° 00′ 52″ · ORBIT NOMINAL · TELEMETRY LOCKED"
        className="left-0 top-1/2 w-full -translate-y-1/2 text-center text-3xl sm:text-5xl"
      />

      <div className="relative flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Mission Log" title="Recent events" />
          <Link
            to="/events"
            className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary-cyan hover:underline"
          >
            View all events →
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-metallic-silver/15 border-y border-metallic-silver/15">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="rounded-sm border border-metallic-silver/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-tertiary-cyan">
                    {categoryLabel[event.category]}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-metallic-silver">
                    {formatDate(event.date)}
                  </span>
                </div>
                <p className="font-display text-xl text-starlight-white">{event.title}</p>
                <p className="max-w-xl text-sm text-metallic-silver">{event.summary}</p>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-metallic-silver">
                {event.venue}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
