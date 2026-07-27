import { useEffect, useState } from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function diffToCountdown(diffMs: number): Countdown {
  const isPast = diffMs <= 0;
  const abs = Math.max(diffMs, 0);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const seconds = Math.floor((abs % 60_000) / 1000);
  return { days, hours, minutes, seconds, isPast };
}

/** Live countdown to a target ISO date string, ticking every second. */
export function useCountdown(targetIso: string | null) {
  const [countdown, setCountdown] = useState<Countdown>(() =>
    diffToCountdown(targetIso ? new Date(targetIso).getTime() - Date.now() : 0),
  );

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();

    const tick = () => setCountdown(diffToCountdown(target - Date.now()));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [targetIso]);

  return countdown;
}
