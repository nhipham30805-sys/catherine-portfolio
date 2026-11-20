"use client";

import { useEffect, useRef } from "react";
import { calm } from "@/lib/motion";

// The Experience page's opening: the headline set large and centred, with small windows of real work opening
// between the words. Behind it, stacked mountain ridgelines (like a topographic map) rise into a peak wherever
// the pointer goes and settle back when it leaves. The ridges are a plain 2D canvas, hidden from screen readers,
// paused off screen or when nothing moves, and drawn once, still, for visitors who ask for less motion.

const PILLS = [
  { href: "#trail-prace-media", src: "/images/melbourne/lapeau-treatment-poster.jpg", alt: "Prace Media: Lapeau Medi Spa treatment video", w: "1.9em" },
  { href: "#trail-vinuniversity", src: "/images/hanoi/vinuni-3-sm.jpg", alt: "VinUniversity: our booth at the Summit Global Education Fair", w: "1.6em" },
  { href: "#trail-catiez-ph", src: "/images/catiez/trekking.jpg", alt: "@catiez.ph: my biggest trekking struggles", w: "2.1em" },
];

function Pill({ i }: { i: number }) {
  const p = PILLS[i];
  return (
    <a href={p.href} className="xh-pill" style={{ ["--i" as string]: i, ["--w" as string]: p.w }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.src} alt={p.alt} />
    </a>
  );
}

// Small smooth noise for the ridge shapes.
const rnd = (s: number) => {
  const x = Math.sin(s * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const noise1 = (x: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return rnd(i) * (1 - u) + rnd(i + 1) * u;
};

function useRidges(hero: React.RefObject<HTMLElement | null>, canvas: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const host = hero.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;
    const still = calm();
    let W = 0;
    let H = 0;
    let lines: number[][] = [];
    let lift: Float32Array[] = [];
    const step = 8;
    let raf = 0;
    let visible = true;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, on: false };

    const build = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(18, Math.round(H / 28));
      const cols = Math.ceil(W / step) + 2;
      lines = Array.from({ length: n }, (_, j) => {
        const base = H * 0.18 + (H * 0.86 - 20) * (j / (n - 1));
        return Array.from({ length: cols }, (_, i) => {
          const x = i * step;
          const m = noise1(x / 160 + j * 3.1) * 0.6 + noise1(x / 60 + j * 7.7) * 0.4;
          const env = Math.sin(Math.PI * Math.min(1, Math.max(0, x / W)));
          return base - m * 40 * env;
        });
      });
      lift = lines.map((l) => new Float32Array(l.length));
    };

    const draw = () => {
      ctx.fillStyle = "#0E1216";
      ctx.fillRect(0, 0, W, H);
      let moving = false;
      lines.forEach((l, j) => {
        const up = lift[j];
        let peak = 0;
        ctx.beginPath();
        for (let i = 0; i < l.length; i++) {
          const x = i * step;
          let target = 0;
          if (ptr.on) {
            const dx = (x - ptr.x) / 150;
            const dy = (l[i] - ptr.y) / 120;
            target = 70 * Math.exp(-(dx * dx) - dy * dy * 0.6);
          }
          const d = (target - up[i]) * 0.12;
          if (Math.abs(d) > 0.05) moving = true;
          up[i] += d;
          if (up[i] > peak) peak = up[i];
          const y = l[i] - up[i];
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        // Fill under each line so nearer ridges hide the farther ones.
        ctx.lineTo(W + 20, H + 20);
        ctx.lineTo(-20, H + 20);
        ctx.closePath();
        ctx.fillStyle = "rgba(14,18,22,0.86)";
        ctx.fill();
        const t = j / (lines.length - 1);
        const warm = Math.min(1, peak / 60);
        // Storm slate lines that warm to sunlit gold where they rise.
        const c = (a: number, b: number) => Math.round(a + (b - a) * warm);
        ctx.strokeStyle = `rgba(${c(62, 240)},${c(72, 194)},${c(82, 122)},${0.22 + 0.3 * t + 0.35 * warm})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      return moving;
    };

    const frame = () => {
      ptr.x += (ptr.tx - ptr.x) * 0.25;
      ptr.y += (ptr.ty - ptr.y) * 0.25;
      const moving = draw();
      raf = visible && (moving || ptr.on) ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => {
      if (!raf && !still && visible) raf = requestAnimationFrame(frame);
    };

    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      ptr.tx = e.clientX - r.left;
      ptr.ty = e.clientY - r.top;
      if (!ptr.on) {
        ptr.x = ptr.tx;
        ptr.y = ptr.ty;
      }
      ptr.on = true;
      wake();
    };
    const leave = () => {
      ptr.on = false;
      wake();
    };

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    io.observe(host);
    if (!still) {
      host.addEventListener("pointermove", move, { passive: true });
      host.addEventListener("pointerleave", leave);
      host.addEventListener("pointercancel", leave);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
    };
  }, [hero, canvas]);
}

export default function ExperienceHero() {
  const hero = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useRidges(hero, canvas);

  // The arrival: hidden only once script has confirmed it can play it, so the words are always there without it.
  useEffect(() => {
    const el = hero.current;
    if (!el || calm()) return;
    el.classList.add("xh-anim");
    const id = requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("xh-go")));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section ref={hero} className="xh" aria-labelledby="xh-title">
      <canvas ref={canvas} className="xh-canvas" aria-hidden />
      <div className="wrap xh-inner">
        <p className="label xh-fade">The Trail</p>
        <h1 id="xh-title" className="display xh-title">
          <span className="xh-line" style={{ ["--i" as string]: 0 }}>
            <span>
              Every role <Pill i={0} /> was
            </span>
          </span>
          <span className="xh-line" style={{ ["--i" as string]: 1 }}>
            <span>
              a step <Pill i={1} /> up the
            </span>
          </span>
          <span className="xh-line" style={{ ["--i" as string]: 2 }}>
            <span>
              mountain. <Pill i={2} />
            </span>
          </span>
        </h1>
        <p className="xh-lede xh-fade" style={{ ["--i" as string]: 1 }}>
          Here&apos;s the trail so far, and the work I made along the way.
        </p>
      </div>
    </section>
  );
}
