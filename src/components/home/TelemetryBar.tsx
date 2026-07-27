import { useEffect, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { useCountdown } from "@/hooks/useCountdown";
import { getEvents, getNextEvent } from "@/services/eventService";
import { siteConfig } from "@/constants/site";
import type { AstraEvent } from "@/types/Event";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function TelemetryValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-lg text-starlight-white sm:text-xl">
      {children}
    </span>
  );
}

function TelemetryLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-metallic-silver">
      {children}
    </span>
  );
}

export function TelemetryBar() {
  const [ready, setReady] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const [nextEvent, setNextEvent] = useState<AstraEvent | null>(null);

  useEffect(() => {
    setReady(true);
    getEvents().then((events) => setEventCount(events.length));
    getNextEvent().then(setNextEvent);
  }, []);

  const members = useCountUp(40, ready);
  const eventsHosted = useCountUp(eventCount, ready && eventCount > 0);
  const yearsActive = useCountUp(new Date().getFullYear() - siteConfig.foundedYear, ready);

  const countdown = useCountdown(nextEvent?.date ?? null);

  return (
    <section className="container-astra">
      <div className="glass-panel flex flex-col gap-6 rounded-lg px-6 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-8">
        <div className="flex flex-col gap-1">
          <TelemetryLabel>Members</TelemetryLabel>
          <TelemetryValue>{members}+</TelemetryValue>
        </div>

        <div className="hidden h-8 w-px bg-metallic-silver/20 sm:block" />

        <div className="flex flex-col gap-1">
          <TelemetryLabel>Events Hosted</TelemetryLabel>
          <TelemetryValue>{eventsHosted}</TelemetryValue>
        </div>

        <div className="hidden h-8 w-px bg-metallic-silver/20 sm:block" />

        <div className="flex flex-col gap-1">
          <TelemetryLabel>Active</TelemetryLabel>
          <TelemetryValue>{yearsActive}+ Yrs</TelemetryValue>
        </div>

        <div className="hidden h-8 w-px bg-metallic-silver/20 sm:block" />

        <div className="flex flex-col gap-1">
          <TelemetryLabel>
            {nextEvent ? `Next Launch — ${nextEvent.title}` : "Next Launch"}
          </TelemetryLabel>
          <TelemetryValue>
            {nextEvent ? (
              <span className="text-tertiary-cyan">
                T-{countdown.days}d {pad(countdown.hours)}:{pad(countdown.minutes)}:
                {pad(countdown.seconds)}
              </span>
            ) : (
              "—"
            )}
          </TelemetryValue>
        </div>
      </div>
    </section>
  );
}
