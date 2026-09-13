import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import logo from "@/assets/images/astra-logo.png";

export interface DriftWallItem {
  id: string;
  title: string;
  detail: string;
  tone: string;
}

const columns = (items: DriftWallItem[]) => [
  items.filter((_, index) => index % 3 === 0),
  items.filter((_, index) => index % 3 === 1),
  items.filter((_, index) => index % 3 === 2),
];

function Tile({ item }: { item: DriftWallItem }) {
  return (
    <div className={`relative h-28 overflow-hidden rounded-lg border border-metallic-silver/20 bg-gradient-to-br ${item.tone} p-3 shadow-[0_12px_30px_rgba(0,0,0,0.22)] sm:h-32`}>
      <img src={logo} alt="" className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-15" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-tertiary-cyan">Astra // crew</span>
        <div>
          <p className="font-display text-sm text-starlight-white sm:text-base">{item.title}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-metallic-silver">{item.detail}</p>
        </div>
      </div>
    </div>
  );
}

/** A deliberately lightweight drifting field: two columns on phones, paused off-screen. */
export function DriftWall({ items }: { items: DriftWallItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useInView(rootRef, { amount: 0.1 });
  const reducedMotion = useReducedMotion();
  const animate = visible && !reducedMotion;

  return (
    <div ref={rootRef} className="relative h-[25rem] overflow-hidden rounded-xl border border-metallic-silver/15 bg-space-black/50 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <div className="absolute inset-0 flex gap-3 px-3 sm:gap-5 sm:px-5" aria-label="Drifting Astra crew field">
        {columns(items).map((column, index) => (
          <motion.div
            key={index}
            className={`flex w-1/2 shrink-0 flex-col gap-3 sm:w-1/3 sm:gap-5 ${index === 2 ? "hidden sm:flex" : ""}`}
            animate={animate ? { y: index % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] } : { y: "0%" }}
            transition={animate ? { duration: 24 + index * 4, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
          >
            {[...column, ...column].map((item, tileIndex) => <Tile key={`${item.id}-${tileIndex}`} item={item} />)}
          </motion.div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-space-black/45 via-transparent to-space-black/45" />
    </div>
  );
}
