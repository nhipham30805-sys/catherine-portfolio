"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DEGREE } from "@/lib/content";
import T from "./T";
import { calm } from "@/lib/motion";

// Education top: the "Training Ground" as a live survey map.
// The contour lines are traced from a height map on every frame, so the land can change shape:
// on load the mountains rise out of flat ground, and wherever the cursor goes a new summit pushes up
// under it, its rings bunching together and glowing honey, then settling back when the cursor leaves.
// All motion is GSAP; with reduced motion the map is drawn once, still.

type Field = { rise: number; amp: number; mx: number; my: number };

// Height of the land at (u, v), both 0..1 across the hero. Pure maths, so it looks the same every visit.
function height(u: number, v: number, aspect: number, f: Field) {
  const x = u * aspect;
  const peak = (cx: number, cy: number, h: number, s: number) => {
    const dx = x - cx * aspect, dy = v - cy;
    return h * Math.exp(-(dx * dx + dy * dy) / (2 * s * s));
  };
  let z =
    peak(0.76, 0.26, 1.0, 0.2) + // main summit, top right
    peak(0.97, 0.82, 0.62, 0.15) + // second peak, bottom right
    peak(0.5, 0.05, 0.35, 0.12) + // a shoulder along the top
    0.07 * Math.sin(u * 7.1 + v * 3.3) * Math.cos(v * 5.2 - u * 2.1) +
    0.04 * Math.sin(u * 13.7 - v * 9.4);
  z *= f.rise;
  if (f.amp > 0.001) z += peak(f.mx, f.my, 0.95 * f.amp, 0.095);
  return z;
}

// Marching squares: trace every contour level through the grid as short line segments.
function contours(
  grid: Float32Array, cols: number, rows: number, cell: number, level: number, ctx: CanvasRenderingContext2D,
  box = [0, cols - 1, 0, rows - 1],
) {
  for (let j = box[2]; j < box[3]; j++) {
    for (let i = box[0]; i < box[1]; i++) {
      const a = grid[j * cols + i], b = grid[j * cols + i + 1];
      const c = grid[(j + 1) * cols + i + 1], d = grid[(j + 1) * cols + i];
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * cell, y = j * cell;
      const t = (p: number, q: number) => (level - p) / (q - p);
      const top: [number, number] = [x + t(a, b) * cell, y];
      const right: [number, number] = [x + cell, y + t(b, c) * cell];
      const bottom: [number, number] = [x + t(d, c) * cell, y + cell];
      const left: [number, number] = [x, y + t(a, d) * cell];
      const seg = (p: [number, number], q: [number, number]) => {
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(q[0], q[1]);
      };
      switch (idx) {
        case 1: case 14: seg(left, bottom); break;
        case 2: case 13: seg(bottom, right); break;
        case 3: case 12: seg(left, right); break;
        case 4: case 11: seg(top, right); break;
        case 5: seg(left, top); seg(bottom, right); break;
        case 6: case 9: seg(top, bottom); break;
        case 7: case 8: seg(left, top); break;
        case 10: seg(top, right); seg(left, bottom); break;
      }
    }
  }
}

const LEVELS = Array.from({ length: 16 }, (_, k) => 0.1 + k * 0.085);
const LINE_2 = "play way harder.";

export default function EducationHero() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [place, dates] = DEGREE.meta.split(" · ");

  // The live map.
  useEffect(() => {
    const el = root.current, cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const still = calm();
    const css = getComputedStyle(document.documentElement);
    const gold = css.getPropertyValue("--color-gold").trim() || "#F0C27A";
    const honey = css.getPropertyValue("--color-honey").trim() || "#F7DDA8";

    const f: Field = { rise: still ? 1 : 0, amp: 0, mx: 0.7, my: 0.4 };
    let w = 0, h = 0, cell = 10, cols = 0, rows = 0, grid = new Float32Array(0), dirty = true;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = w < 768 ? 8 : 10;
      cols = Math.ceil(w / cell) + 1; rows = Math.ceil(h / cell) + 1;
      grid = new Float32Array(cols * rows);
      dirty = true;
    };

    const draw = () => {
      if (!dirty || !w) return;
      dirty = false;
      const aspect = w / h;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) grid[j * cols + i] = height((i * cell) / w, (j * cell) / h, aspect, f);

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.strokeStyle = gold;
      LEVELS.forEach((lv, k) => {
        const index = k % 5 === 4; // every fifth line is an index contour, as on a real survey map
        ctx.globalAlpha = index ? 0.32 : 0.15;
        ctx.lineWidth = index ? 1.5 : 1;
        ctx.beginPath();
        contours(grid, cols, rows, cell, lv, ctx);
        ctx.stroke();
      });

      // Trace the lines around the cursor's summit again, in honey, brightest at the top and fading outwards.
      if (f.amp > 0.01) {
        const cx = f.mx * w, cy = f.my * h, rad = Math.min(w, h) * 0.34;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, honey);
        g.addColorStop(1, "rgba(247,221,168,0)");
        const box = [
          Math.max(0, Math.floor((cx - rad) / cell)), Math.min(cols - 1, Math.ceil((cx + rad) / cell)),
          Math.max(0, Math.floor((cy - rad) / cell)), Math.min(rows - 1, Math.ceil((cy + rad) / cell)),
        ];
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.3;
        ctx.globalAlpha = 0.75 * f.amp;
        ctx.beginPath();
        LEVELS.forEach((lv) => contours(grid, cols, rows, cell, lv, ctx, box));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);

    if (still) {
      draw();
      const redraw = () => draw();
      ro.disconnect();
      const ro2 = new ResizeObserver(() => { size(); redraw(); });
      ro2.observe(cv);
      return () => ro2.disconnect();
    }

    const mark = () => { dirty = true; };
    const tick = () => draw();
    gsap.ticker.add(tick);

    // The land rises out of flat ground on arrival.
    const intro = gsap.to(f, { rise: 1, duration: 2.6, ease: "power2.out", delay: 0.1, onUpdate: mark });

    // The cursor's summit follows with a little lag, like ground catching up.
    const toX = gsap.quickTo(f, "mx", { duration: 0.9, ease: "power3.out", onUpdate: mark });
    const toY = gsap.quickTo(f, "my", { duration: 0.9, ease: "power3.out", onUpdate: mark });
    let shown = false;
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
      if (u < 0 || u > 1 || v < 0 || v > 1) return leave();
      if (!shown) {
        // First touch on the map: start the summit right under the cursor rather than sliding in from elsewhere.
        gsap.set(f, { mx: u, my: v });
        shown = true;
        gsap.to(f, { amp: 1, duration: 1.1, ease: "power2.out", overwrite: "auto", onUpdate: mark });
      }
      toX(u); toY(v);
    };
    const leave = () => {
      if (!shown) return;
      shown = false;
      gsap.to(f, { amp: 0, duration: 1.4, ease: "power2.inOut", overwrite: "auto", onUpdate: mark });
    };
    // A tap on a phone raises a summit that sinks back after a moment.
    const tap = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      move(e);
      gsap.delayedCall(1.2, leave);
    };
    const hover = (e: PointerEvent) => { if (e.pointerType !== "touch") move(e); };
    el.addEventListener("pointermove", hover);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", tap);

    return () => {
      gsap.ticker.remove(tick);
      intro.kill();
      gsap.killTweensOf(f);
      ro.disconnect();
      el.removeEventListener("pointermove", hover);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", tap);
    };
  }, []);

  // The words.
  useEffect(() => {
    const el = root.current;
    if (!el || calm()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".edu-label", { opacity: 0, duration: 0.8 }, 0.2)
        .from(".edu-line-1", { yPercent: 105, duration: 0.9 }, 0.5)
        .from(".edu-roll", { yPercent: 110, duration: 0.7, stagger: 0.028 }, 0.75)
        .from(".edu-intro", { opacity: 0, y: 14, duration: 0.8 }, 1.2)
        .from(".edu-pin", { scale: 0, duration: 0.5, ease: "back.out(2.4)" }, 1.35)
        .from(".edu-stem", { scaleY: 0, transformOrigin: "bottom", duration: 0.9, ease: "power2.inOut" }, 1.35)
        .fromTo(".edu-pulse", { scale: 1, opacity: 0.7 }, { scale: 3.2, opacity: 0, duration: 1.1, ease: "power2.out" }, 1.6)
        .from(".edu-degree > *", { opacity: 0, x: -16, duration: 0.7, stagger: 0.08 }, 1.45);

      // The map drifts up a little slower than the page, so it feels like it sits underneath.
      gsap.to(".edu-map", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <canvas ref={canvas} className="edu-map" />
      </div>

      <section className="wrap relative flex min-h-[100svh] flex-col justify-between pb-14 pt-28 md:pb-20 md:pt-36">
        <p className="edu-label label">Training Ground · Where I learned the ropes</p>

        <div className="mt-24 md:mt-0">
          <h1
            className="display text-[3.6rem] leading-[0.9] sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[9.5rem]"
            aria-label="Work hard, play way harder."
          >
            <span className="edu-clip md:pl-[16%]" aria-hidden>
              <span className="edu-line-1 block">Work hard,</span>
            </span>
            <span className="edu-clip" aria-hidden>
              {LINE_2.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap">
                  {word.split("").map((ch, ci) => (
                    <span key={ci} className="edu-roll inline-block">
                      {ch}
                    </span>
                  ))}
                  {wi < LINE_2.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
              ))}
            </span>
          </h1>

          <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-12 md:gap-8">
            <p className="edu-intro max-w-md font-serif text-2xl italic leading-snug text-honey md:col-span-5 md:text-[1.75rem]">
              Chase big dreams. Take wild chances. Collect even wilder stories.
            </p>

            {/* The degree, pinned on the map like a survey marker, its stem rising into the contours. */}
            <section aria-labelledby="degree" className="md:col-span-6 md:col-start-7">
              <div className="grid grid-cols-[28px_1fr] gap-x-5 md:grid-cols-[36px_1fr] md:gap-x-6">
                <div className="relative flex justify-center">
                  <span className="edu-stem absolute bottom-[calc(100%-0.5rem)] h-16 w-0 border-l-2 border-dashed border-gold/45 md:h-24" aria-hidden />
                  <span className="edu-pin relative mt-2 block h-5 w-5 rounded-full border-2 border-sunrise md:mt-3">
                    <span className="absolute inset-[4px] rounded-full bg-sunrise" />
                    <span className="edu-pulse absolute inset-0 rounded-full border-2 border-sunrise opacity-0" />
                  </span>
                </div>
                <div className="edu-degree">
                  <p className="font-serif text-xl italic text-gold">The degree</p>
                  <h2 id="degree" className="display mt-2 text-4xl md:text-5xl">
                    {DEGREE.name}
                  </h2>
                  <p className="mt-4 text-lg text-paper">
                    <T>{place}</T>
                  </p>
                  {dates && <p className="text-lg text-muted">{dates}</p>}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
