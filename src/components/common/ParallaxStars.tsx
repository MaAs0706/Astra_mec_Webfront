import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Starfield } from "@/components/common/Starfield";

interface Layer {
  density: number;
  sizeScale: number;
  opacityScale: number;
  driftPx: number;
}

const layers: Layer[] = [
  { density: 45, sizeScale: 0.6, opacityScale: 0.45, driftPx: 40 }, // far
  { density: 35, sizeScale: 1, opacityScale: 0.75, driftPx: 90 }, // mid
  { density: 22, sizeScale: 1.7, opacityScale: 1, driftPx: 160 }, // near
];

function ParallaxLayer({ layer }: { layer: Layer }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -layer.driftPx]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ y: prefersReducedMotion ? 0 : y }}
    >
      <Starfield
        density={layer.density}
        sizeScale={layer.sizeScale}
        opacityScale={layer.opacityScale}
      />
    </motion.div>
  );
}

/**
 * Three depth layers of stars drifting at different scroll-linked rates —
 * the "far" layer barely moves, "near" moves fastest, reading as real depth
 * rather than one flat texture behind the content. Shooting stars and
 * constellations live on their own plain (non-scroll-linked) layer on top,
 * so they keep firing on their own timeline regardless of whether the page
 * is scrolling.
 */
export function ParallaxStars() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {layers.map((layer, index) => (
        <ParallaxLayer key={index} layer={layer} />
      ))}
      <div className="absolute inset-0">
        <Starfield density={0} shootingStars constellations />
      </div>
    </div>
  );
}
