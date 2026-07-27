import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  driftSpeed: number;
  twinklePhase: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
}

interface ConstellationTemplate {
  /** Points in a 0-1 local space; scaled + positioned per instance. */
  points: Array<{ x: number; y: number }>;
  /** Index pairs into `points` describing which ones connect. */
  edges: Array<[number, number]>;
}

interface ActiveConstellation {
  template: ConstellationTemplate;
  originX: number;
  originY: number;
  scale: number;
  bornAt: number;
  lifespan: number;
}

interface StarfieldProps {
  density?: number;
  /** Multiplies star radius — lower for a distant/far layer, higher for near. */
  sizeScale?: number;
  /** Multiplies overall alpha — lets parallax layers recede visually. */
  opacityScale?: number;
  /** Occasionally streaks a shooting star across the canvas. */
  shootingStars?: boolean;
  /** Occasionally traces a random constellation that holds briefly, then fades. */
  constellations?: boolean;
}

const MAX_SIZE_RETRIES = 30;

// A handful of distinct hand-placed shapes so repeats don't feel identical.
const CONSTELLATION_TEMPLATES: ConstellationTemplate[] = [
  {
    // Cassiopeia-style "W"
    points: [
      { x: 0, y: 0.6 },
      { x: 0.25, y: 0 },
      { x: 0.5, y: 0.45 },
      { x: 0.75, y: 0 },
      { x: 1, y: 0.55 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    // Dipper-style scoop
    points: [
      { x: 0, y: 0.1 },
      { x: 0.3, y: 0 },
      { x: 0.58, y: 0.12 },
      { x: 0.85, y: 0.4 },
      { x: 0.55, y: 0.65 },
      { x: 0.25, y: 0.5 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 1],
    ],
  },
  {
    // Simple kite/cross
    points: [
      { x: 0.5, y: 0 },
      { x: 0, y: 0.55 },
      { x: 1, y: 0.55 },
      { x: 0.5, y: 1 },
      { x: 0.5, y: 0.4 },
    ],
    edges: [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
    ],
  },
];

/**
 * Low-density ambient starfield. Draws once and drifts slowly; falls back to
 * a static frame when the user prefers reduced motion.
 */
export function Starfield({
  density = 90,
  sizeScale = 1,
  opacityScale = 1,
  shootingStars = false,
  constellations = false,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let sized = false;
    let sizeAttempts = 0;

    let meteors: Meteor[] = [];
    let nextMeteorWaveAt = 500;
    const METEOR_WAVE_INTERVAL_MS = 2000;

    let activeConstellations: ActiveConstellation[] = [];
    let nextConstellationWaveAt = 2500;
    const CONSTELLATION_WAVE_INTERVAL_MS = 8000;
    const CONSTELLATION_FADE_IN_MS = 450;
    const CONSTELLATION_FADE_OUT_MS = 700;

    function applySize(w: number, h: number) {
      if (w === 0 || h === 0) return;
      width = w;
      height = h;
      sized = true;

      const dpr = window.devicePixelRatio || 1;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: (Math.random() * 1.2 + 0.3) * sizeScale,
        driftSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    }

    function spawnMeteor(): Meteor {
      const speed = 7 + Math.random() * 4;
      // Down-and-right, roughly 30-55 degrees — reads as a classic meteor streak.
      const angle = Math.PI / 6 + Math.random() * (Math.PI / 5);
      return {
        // Anywhere on the canvas — some will only be visible briefly near an
        // edge, which reads as natural variety rather than a bug.
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 90 + Math.random() * 70,
      };
    }

    function updateMeteors(time: number) {
      if (!ctx) return;

      if (time >= nextMeteorWaveAt) {
        const count = 1 + Math.floor(Math.random() * 3); // 1-3 per wave
        for (let i = 0; i < count; i++) meteors.push(spawnMeteor());
        nextMeteorWaveAt = time + METEOR_WAVE_INTERVAL_MS;
      }

      meteors = meteors.filter((meteor) => {
        const dist = Math.hypot(meteor.vx, meteor.vy) || 1;
        const unitX = meteor.vx / dist;
        const unitY = meteor.vy / dist;
        const tailX = meteor.x - unitX * meteor.length;
        const tailY = meteor.y - unitY * meteor.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        gradient.addColorStop(0, "rgba(226, 232, 240, 0)");
        gradient.addColorStop(1, "rgba(226, 232, 240, 0.9)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.stroke();

        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        return meteor.x - meteor.length <= width && meteor.y - meteor.length <= height;
      });
    }

    function spawnConstellationWave(time: number) {
      const count = 1 + Math.floor(Math.random() * 3); // 1-3 per wave
      for (let i = 0; i < count; i++) {
        const template =
          CONSTELLATION_TEMPLATES[Math.floor(Math.random() * CONSTELLATION_TEMPLATES.length)];
        activeConstellations.push({
          template,
          originX: width * (0.1 + Math.random() * 0.75),
          originY: height * (0.1 + Math.random() * 0.75),
          scale: 90 + Math.random() * 150,
          bornAt: time,
          lifespan: 3000 + Math.random() * 2000, // 3-5s total, including fade in/out
        });
      }
      nextConstellationWaveAt = time + CONSTELLATION_WAVE_INTERVAL_MS;
    }

    function updateConstellations(time: number) {
      if (!ctx) return;

      if (time >= nextConstellationWaveAt) {
        spawnConstellationWave(time);
      }

      activeConstellations = activeConstellations.filter((constellation) => {
        const elapsed = time - constellation.bornAt;
        if (elapsed >= constellation.lifespan) return false;

        let alpha = 1;
        if (elapsed < CONSTELLATION_FADE_IN_MS) {
          alpha = elapsed / CONSTELLATION_FADE_IN_MS;
        } else if (elapsed > constellation.lifespan - CONSTELLATION_FADE_OUT_MS) {
          alpha = Math.max(0, (constellation.lifespan - elapsed) / CONSTELLATION_FADE_OUT_MS);
        }

        const { template, originX, originY, scale } = constellation;
        const toCanvas = (p: { x: number; y: number }) => ({
          x: originX + p.x * scale,
          y: originY + p.y * scale,
        });

        ctx.strokeStyle = `rgba(0, 242, 254, ${0.35 * alpha})`;
        ctx.lineWidth = 1;
        for (const [a, b] of template.edges) {
          const pa = toCanvas(template.points[a]);
          const pb = toCanvas(template.points[b]);
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(226, 232, 240, ${0.75 * alpha})`;
        for (const point of template.points) {
          const p = toCanvas(point);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });
    }

    function draw(time: number) {
      if (!ctx) return;

      // The canvas can mount with a momentarily-zero layout box (e.g. inside
      // an animated/transitioning ancestor). Keep re-measuring for a bit
      // instead of only trying once — a plain clientWidth read at effect-run
      // time isn't guaranteed to see final layout.
      if (!sized && sizeAttempts < MAX_SIZE_RETRIES) {
        applySize(canvas!.clientWidth, canvas!.clientHeight);
        sizeAttempts += 1;
      }

      if (!sized) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = prefersReducedMotion
          ? 0.7
          : 0.5 + 0.5 * Math.sin(time / 1000 + star.twinklePhase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(226, 232, 240, ${(0.25 + twinkle * 0.5) * opacityScale})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        if (!prefersReducedMotion) {
          star.y += star.driftSpeed;
          if (star.y > height) star.y = 0;
        }
      }

      if (shootingStars && !prefersReducedMotion) {
        updateMeteors(time);
      }

      if (constellations && !prefersReducedMotion) {
        updateConstellations(time);
      }

      if (!prefersReducedMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    }

    animationFrame = requestAnimationFrame(draw);

    // ResizeObserver picks up any later real size change (viewport resize,
    // orientation change) once the element is sized.
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      applySize(box.width, box.height);
      if (prefersReducedMotion) draw(0);
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [density, sizeScale, opacityScale, shootingStars, constellations]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
