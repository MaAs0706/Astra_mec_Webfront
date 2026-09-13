import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionGlow } from "@/components/common/SectionGlow";
import { DataTicker } from "@/components/common/DataTicker";
import { getRecentEvents } from "@/services/eventService";
import type { AstraEvent } from "@/types/Event";

const categoryLabel: Record<AstraEvent["category"], string> = {
  hackathon: "Build mission",
  workshop: "Systems lab",
  observation: "Sky watch",
  talk: "Signal briefing",
};

const categoryTone: Record<AstraEvent["category"], string> = {
  hackathon: "border-primary-purple/70 text-primary-purple",
  workshop: "border-secondary-blue/80 text-tertiary-cyan",
  observation: "border-tertiary-cyan/70 text-tertiary-cyan",
  talk: "border-metallic-silver/70 text-metallic-silver",
};

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2000, 0, 1, hours, minutes));
}

/** A scrolling mission-control timeline that remains a clear single column on mobile. */
export function RecentEvents() {
  const [events, setEvents] = useState<AstraEvent[]>([]);

  useEffect(() => {
    getRecentEvents(4).then(setEvents);
  }, []);

  return (
    <section className="container-astra relative py-16 sm:py-24" aria-labelledby="timeline-title">
      <SectionGlow color="rgba(0, 242, 254, 0.18)" className="-left-36 top-20 h-80 w-80" />
      <SectionGlow color="rgba(18, 62, 234, 0.28)" className="-right-40 bottom-0 h-[28rem] w-[28rem]" />
      <DataTicker
        text="MISSION LOG · TELEMETRY VERIFIED · FLIGHT SYSTEMS ONLINE"
        className="left-0 top-1/2 w-full -translate-y-1/2 text-center text-2xl sm:text-5xl"
      />

      <div className="relative flex flex-col gap-10 sm:gap-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="timeline-title" eyebrow="Mission log" title="Event timeline" />
          <Link to="/events" className="w-fit font-mono text-xs uppercase tracking-[0.15em] text-tertiary-cyan transition-colors hover:text-starlight-white">
            View all missions <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="relative ml-2 border-l border-tertiary-cyan/35 pl-7 sm:ml-[22%] sm:pl-12">
          {events.map((event, index) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative pb-10 last:pb-0 sm:grid sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] sm:gap-10"
            >
              <span className="absolute -left-[34px] top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-tertiary-cyan bg-space-black shadow-[0_0_16px_rgba(0,242,254,0.8)] sm:-left-[55px]">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary-cyan" />
              </span>
              <div className="mb-3 flex flex-col gap-1 sm:mb-0 sm:items-end sm:text-right">
                <time dateTime={`${event.date}T${event.time}`} className="font-mono text-sm font-medium text-starlight-white">
                  {formatDate(event.date)}
                </time>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-metallic-silver">T+ {formatTime(event.time)}</span>
              </div>
              <div className="group rounded-lg border border-metallic-silver/20 bg-deep-nebula/20 p-5 transition-colors hover:border-tertiary-cyan/60 hover:bg-deep-nebula/35 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <span className={`rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${categoryTone[event.category]}`}>{categoryLabel[event.category]}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-metallic-silver/70">{event.venue}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-starlight-white sm:text-3xl">{event.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-metallic-silver sm:text-base">{event.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
