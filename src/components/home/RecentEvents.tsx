import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionGlow } from "@/components/common/SectionGlow";
import { getRecentEvents } from "@/services/eventService";
import type { AstraEvent } from "@/types/Event";

const categoryLabel: Record<AstraEvent["category"], string> = { hackathon: "Build mission", workshop: "Systems lab", observation: "Sky watch", talk: "Signal briefing" };
const categoryTone: Record<AstraEvent["category"], string> = { hackathon: "border-primary-purple/70 text-primary-purple", workshop: "border-secondary-blue/80 text-tertiary-cyan", observation: "border-tertiary-cyan/70 text-tertiary-cyan", talk: "border-metallic-silver/70 text-metallic-silver" };

const stops = [
  { progress: 0.15, top: 16, desktopLeft: true },
  { progress: 0.38, top: 37, desktopLeft: false },
  { progress: 0.61, top: 59, desktopLeft: true },
  { progress: 0.84, top: 79, desktopLeft: false },
] as const;

function formatDate(iso: string) { return new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(2000, 0, 1, hours, minutes));
}

function MissionCard({ event, index, progress }: { event: AstraEvent; index: number; progress: MotionValue<number> }) {
  const stop = stops[index];
  const previous = index === 0 ? 0 : stops[index - 1].progress;
  const next = index === stops.length - 1 ? 1 : stops[index + 1].progress;
  const reveal = stop.progress;
  const shown = reveal + 0.028;
  // Keep a transmission readable for the full leg of the route. It only
  // retracts as the signal approaches the following checkpoint.
  // Let adjacent transmissions overlap briefly at each checkpoint, avoiding
  // an empty interval between one mission retracting and the next appearing.
  const leave = index === stops.length - 1 ? 0.92 : next - 0.015;
  const gone = index === stops.length - 1 ? 0.98 : next + 0.025;
  const opacity = useTransform(progress, [previous, reveal, shown, leave, gone], [0, 0, 1, 1, 0]);
  const y = useTransform(progress, [previous, reveal, shown, leave, gone], [54, 54, 0, 0, -38]);
  const scale = useTransform(progress, [reveal, shown, leave, gone], [0.96, 1, 1, 0.96]);
  const nodeScale = useTransform(progress, [reveal, shown, gone], [1, 1.8, 1]);
  const nodeOpacity = useTransform(progress, [reveal, shown, gone], [0.4, 1, 0.4]);
  const latest = index === 0;

  return (
    <>
      <motion.span aria-hidden="true" className="absolute z-20 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-tertiary-cyan bg-space-black shadow-[0_0_18px_rgba(0,242,254,0.9)] sm:block" style={{ left: stop.desktopLeft ? "31%" : "69%", top: `${stop.top}%`, scale: nodeScale, opacity: nodeOpacity }}><span className="absolute inset-[4px] rounded-full bg-tertiary-cyan" /></motion.span>
      <motion.span aria-hidden="true" className="absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-tertiary-cyan bg-space-black shadow-[0_0_16px_rgba(0,242,254,0.9)] sm:hidden" style={{ left: index % 2 === 0 ? "8%" : "13%", top: `${stop.top}%`, scale: nodeScale, opacity: nodeOpacity }}><span className="absolute inset-[3px] rounded-full bg-tertiary-cyan" /></motion.span>

      <motion.article className={`absolute z-30 w-[calc(100%-4rem)] sm:w-[43%] ${stop.desktopLeft ? "left-12 sm:right-0 sm:left-auto" : "left-12 sm:left-0"}`} style={{ top: `${stop.top}%`, opacity, y, scale }}>
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
          <span className="text-[10px] uppercase tracking-[0.16em] text-tertiary-cyan/80">M-{String(index + 1).padStart(2, "0")}</span>
          <time dateTime={`${event.date}T${event.time}`} className="text-xs font-medium text-starlight-white">{formatDate(event.date)}</time>
          <span className="text-[10px] uppercase tracking-[0.13em] text-metallic-silver">T+ {formatTime(event.time)}</span>
        </div>
        <div className="relative rounded-lg border border-metallic-silver/30 bg-deep-nebula/90 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-md sm:p-5">
          {latest && <span className="absolute -top-3 left-3 rounded-sm border border-tertiary-cyan/50 bg-space-black px-2 py-1 font-mono text-[8px] uppercase tracking-[0.13em] text-tertiary-cyan">Latest transmission</span>}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className={`rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.13em] ${categoryTone[event.category]}`}>{categoryLabel[event.category]}</span><span className="font-mono text-[9px] uppercase tracking-[0.1em] text-metallic-silver/70">{event.venue}</span></div>
          <h3 className="font-display text-lg font-semibold text-starlight-white sm:text-2xl">{event.title}</h3>
          <p className="mt-2 text-xs leading-5 text-metallic-silver sm:text-sm sm:leading-6">{event.summary}</p>
        </div>
      </motion.article>
    </>
  );
}

/** A compact sticky scroll scene: cards transmit only as the signal reaches each curved checkpoint. */
export function RecentEvents() {
  const [events, setEvents] = useState<AstraEvent[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  // Scroll continues through the short duplicate spans, while the trajectory
  // stays at a checkpoint long enough for its mission transmission to land.
  const trajectory = useTransform(
    progress,
    [0, 0.13, 0.20, 0.34, 0.41, 0.55, 0.62, 0.76, 0.83, 1],
    [0, 0.15, 0.15, 0.38, 0.38, 0.61, 0.61, 0.84, 0.84, 1],
  );
  const desktopX = useTransform(trajectory, [0, 0.15, 0.38, 0.61, 0.84, 1], ["50%", "31%", "69%", "31%", "69%", "50%"]);
  const desktopY = useTransform(trajectory, [0, 0.15, 0.38, 0.61, 0.84, 1], ["0%", "16%", "37%", "59%", "79%", "100%"]);
  const mobileX = useTransform(trajectory, [0, 0.15, 0.38, 0.61, 0.84, 1], ["8%", "8%", "13%", "8%", "13%", "8%"]);

  useEffect(() => { getRecentEvents(4).then(setEvents); }, []);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      const scene = sceneRef.current;
      const panel = panelRef.current;
      if (!scene || !panel) return;

      // A sticky element begins and ends at different document positions than
      // its parent. Measuring those two real boundaries keeps the signal in
      // lockstep with scroll instead of pausing, jumping, or reversing.
      const sceneStart = window.scrollY + scene.getBoundingClientRect().top;
      const stickyTop = Number.parseFloat(window.getComputedStyle(panel).top) || 0;
      const panelHeight = panel.getBoundingClientRect().height;
      const start = sceneStart - stickyTop;
      const end = sceneStart + scene.offsetHeight - panelHeight;
      const distance = Math.max(end - start, 1);
      const next = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      progress.set(next);
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [progress]);

  return (
    <section className="container-astra relative py-16 sm:py-24" aria-labelledby="timeline-title">
      <SectionGlow color="rgba(0, 242, 254, 0.18)" className="-left-36 top-20 h-80 w-80" />
      <SectionGlow color="rgba(18, 62, 234, 0.28)" className="-right-40 bottom-0 h-[28rem] w-[28rem]" />
      <div className="relative flex flex-col gap-10 sm:gap-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><SectionHeading id="timeline-title" eyebrow="Mission log" title="Event trajectory" /><Link to="/events" className="w-fit font-mono text-xs uppercase tracking-[0.15em] text-tertiary-cyan transition-colors hover:text-starlight-white">View all missions <span aria-hidden="true">↗</span></Link></div>

        <div ref={sceneRef} className="relative h-[360vh] sm:h-[400vh]">
          <div ref={panelRef} className="sticky top-20 h-[calc(100svh-5rem)] min-h-[34rem] overflow-hidden rounded-xl border border-metallic-silver/15 bg-space-black/55">
            <svg aria-hidden="true" viewBox="0 0 1000 600" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full sm:block">
              <path d="M 500 0 C 445 45, 340 70, 310 96 S 625 188, 690 222 S 365 330, 310 354 S 620 450, 690 474 S 550 565, 500 600" fill="none" stroke="rgba(0,242,254,0.14)" strokeWidth="2.4" strokeDasharray="4 9" />
              <motion.path initial={false} d="M 500 0 C 445 45, 340 70, 310 96 S 625 188, 690 222 S 365 330, 310 354 S 620 450, 690 474 S 550 565, 500 600" fill="none" stroke="rgba(0,242,254,0.65)" strokeWidth="2.4" style={{ pathLength: trajectory }} />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 100 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full sm:hidden">
              <path d="M 8 0 C 28 45, 3 72, 8 96 S 18 195, 13 222 S 3 330, 8 354 S 18 450, 13 474 S 3 560, 8 600" fill="none" stroke="rgba(0,242,254,0.14)" strokeWidth="1.5" strokeDasharray="3 7" />
              <motion.path initial={false} d="M 8 0 C 28 45, 3 72, 8 96 S 18 195, 13 222 S 3 330, 8 354 S 18 450, 13 474 S 3 560, 8 600" fill="none" stroke="rgba(0,242,254,0.65)" strokeWidth="1.5" style={{ pathLength: trajectory }} />
            </svg>
            <motion.span aria-hidden="true" className="absolute z-40 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-tertiary-cyan bg-space-black shadow-[0_0_22px_rgba(0,242,254,1)] sm:block" style={{ left: desktopX, top: desktopY }}><span className="absolute inset-[4px] rounded-full bg-tertiary-cyan" /></motion.span>
            <motion.span aria-hidden="true" className="absolute z-40 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-tertiary-cyan bg-space-black shadow-[0_0_18px_rgba(0,242,254,1)] sm:hidden" style={{ left: mobileX, top: desktopY }}><span className="absolute inset-[3px] rounded-full bg-tertiary-cyan" /></motion.span>
            {events.slice(0, stops.length).map((event, index) => <MissionCard key={event.id} event={event} index={index} progress={trajectory} />)}
            <div className="pointer-events-none absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[0.16em] text-metallic-silver/60">Trajectory controlled by scroll</div>
          </div>
        </div>
      </div>
    </section>
  );
}
