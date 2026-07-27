import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionGlow } from "@/components/common/SectionGlow";

const tiles = [
  { id: "obs-014", label: "OBS-014", gradient: "from-secondary-blue to-space-black" },
  { id: "build-009", label: "BUILD-009", gradient: "from-primary-purple to-deep-nebula" },
  { id: "hack-003", label: "HACK-003", gradient: "from-tertiary-cyan/60 to-space-black" },
  { id: "obs-021", label: "OBS-021", gradient: "from-deep-nebula to-secondary-blue" },
];

export function GalleryTeaser() {
  return (
    <section className="container-astra relative py-20">
      <SectionGlow
        color="rgba(0, 242, 254, 0.22)"
        className="-left-32 bottom-0 h-[24rem] w-[24rem]"
      />

      <div className="relative flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Field Archive" title="From the gallery" />
          <Link
            to="/gallery"
            className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary-cyan hover:underline"
          >
            View full gallery →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className={`group relative aspect-square overflow-hidden rounded-lg border border-metallic-silver/20 bg-gradient-to-br ${tile.gradient} transition-shadow duration-300 hover:border-tertiary-cyan/60 hover:shadow-[0_0_20px_rgba(0,242,254,0.15)]`}
            >
              <span className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-[0.15em] text-starlight-white/80">
                {tile.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
