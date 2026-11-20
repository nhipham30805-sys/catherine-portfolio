"use client";

import { useEffect, useRef } from "react";
import { fade, key, TRAVEL } from "./timeline";

// Deterministic so server and client markup match.
function ridge(seed: number, base: number, amp: number, peaks: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let d = `M0 400 L0 ${base}`;
  const step = 1600 / peaks;
  for (let i = 0; i < peaks; i++) {
    const h = amp * (0.35 + rnd() * 0.65);
    const x = i * step;
    // Steep limestone karst towers with slightly rounded tops.
    d += ` L${(x + step * 0.28).toFixed(1)} ${(base - h * 0.75).toFixed(1)}`;
    d += ` Q${(x + step * 0.5).toFixed(1)} ${(base - h * 1.25).toFixed(1)} ${(x + step * 0.7).toFixed(1)} ${(base - h * 0.7).toFixed(1)}`;
    d += ` L${(x + step).toFixed(1)} ${(base - amp * 0.12 * rnd()).toFixed(1)}`;
  }
  return `${d} L1600 400 Z`;
}

function skyline(seed: number, heights: [number, number], tower = false) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const rects: { x: number; w: number; h: number }[] = [];
  let x = 0;
  while (x < 1600) {
    const w = 18 + rnd() * 34;
    const centre = 1 - Math.abs(x - 900) / 900;
    rects.push({ x, w, h: heights[0] + (heights[1] - heights[0]) * rnd() * (0.3 + centre * 0.7) });
    x += w + rnd() * 5;
  }
  return { rects, tower };
}

const RIDGES = [
  { d: ridge(11, 190, 120, 7), fill: "#7A848D", depth: 0.35 },
  { d: ridge(23, 230, 150, 9), fill: "#4F5A64", depth: 0.55 },
  { d: ridge(37, 270, 170, 8), fill: "#2E3740", depth: 0.8 },
  { d: ridge(51, 320, 190, 6), fill: "#161B21", depth: 1.1 },
];

const SG = skyline(7, [40, 150]);
const MEL = skyline(19, [60, 220]);

const CLOUDS = [
  { top: 18, left: 8, w: 34, o: 0.55, speed: 1 },
  { top: 34, left: 52, w: 44, o: 0.5, speed: 1.4 },
  { top: 52, left: 22, w: 30, o: 0.4, speed: 1.9 },
  { top: 12, left: 74, w: 26, o: 0.45, speed: 0.8 },
  { top: 62, left: 68, w: 48, o: 0.45, speed: 2.4 },
  { top: 44, left: -8, w: 36, o: 0.4, speed: 1.6 },
];

const SKIES = [
  { bg: "linear-gradient(#2E3740 0%, #4F5A64 55%, #7A848D 100%)", win: [-1, 0.36] },
  { bg: "linear-gradient(#0E1216 0%, #222A32 60%, #4F5A64 100%)", win: [0.32, 0.56] },
  { bg: "linear-gradient(#161B21 0%, #5C3A24 50%, #B5682A 92%)", win: [0.52, 0.72] },
  { bg: "linear-gradient(#0E1216 0%, #222A32 70%, #3E4852 100%)", win: [0.68, 0.84] },
  { bg: "linear-gradient(#2E3740 0%, #B5682A 55%, #D98B32 80%, #F7DDA8 100%)", win: [0.8, 2] },
];

const TAGS = [
  { name: "Hòa Bình", x: 38, y: 88, at: 0.02 },
  { name: "Hanoi", x: 50, y: 78, at: 0.38 },
  { name: "Singapore", x: 76, y: 66, at: 0.63 },
  { name: "Melbourne", x: 87, y: 30, at: 0.88 },
];

export type Apply = (p: number) => void;

export default function Scene({ register }: { register?: (fn: Apply) => () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !register) return;
    const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T & HTMLElement>(s));
    const skies = q<HTMLElement>("[data-sky]");
    const ridges = q<HTMLElement>("[data-ridge]");
    const clouds = q<HTMLElement>("[data-cloud]");
    const sg = el.querySelector<HTMLElement>("[data-sg]")!;
    const mel = el.querySelector<HTMLElement>("[data-mel]")!;
    const sun = el.querySelector<HTMLElement>("[data-sun]")!;
    const lights = el.querySelector<HTMLElement>("[data-lights]")!;
    const bank = el.querySelector<HTMLElement>("[data-bank]")!;
    const segs = q<SVGPathElement & HTMLElement>("[data-seg]");
    const tags = q<HTMLElement>("[data-tag]");
    const routeBox = el.querySelector<HTMLElement>("[data-route]")!;

    return register((p) => {
      skies.forEach((s, i) => {
        const [a, b] = SKIES[i].win;
        s.style.opacity = String(fade(p, a, b, 0.04));
      });
      // Altitude pushes the mountains off the bottom of the frame.
      const alt = key(p, [[0, 0], [0.3, 0.05], [0.4, 0.5], [0.5, 3.2]]);
      ridges.forEach((r, i) => {
        r.style.transform = `translate3d(0, ${alt * 100 * RIDGES[i].depth}%, 0)`;
      });
      const travel = key(p, TRAVEL);
      clouds.forEach((c, i) => {
        const s = CLOUDS[i].speed;
        const x = ((((CLOUDS[i].left - travel * 340 * s) % 150) + 150) % 150) - 50;
        c.style.transform = `translate3d(${x - CLOUDS[i].left}vw, 0, 0) scaleX(${1 + (p > 0.4 && p < 0.9 ? 0.5 : 0)})`;
      });
      lights.style.opacity = String(fade(p, 0.29, 0.42, 0.03));
      bank.style.transform = `translate3d(0, ${(1 - key(p, [[0.3, 0], [0.45, 1], [0.58, 1], [0.64, 0.2], [0.7, 1], [0.84, 1], [0.9, 0]])) * 100}%, 0)`;
      sg.style.transform = `translate3d(0, ${(1 - key(p, [[0.55, 0], [0.63, 1], [0.66, 1], [0.7, 0]])) * 100}%, 0)`;
      mel.style.transform = `translate3d(0, ${(1 - key(p, [[0.8, 0], [0.9, 1], [1, 0.72]])) * 100}%, 0)`;
      sun.style.opacity = String(key(p, [[0.82, 0], [0.92, 1]]));
      sun.style.transform = `translate3d(0, ${key(p, [[0.82, 40], [1, -10]])}%, 0)`;

      routeBox.style.opacity = String(fade(p, -1, 0.91));
      const spans = [[0.02, 0.4], [0.4, 0.65], [0.65, 0.9]];
      segs.forEach((seg, i) => {
        const [a, b] = spans[i];
        seg.style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, (p - a) / (b - a))));
      });
      tags.forEach((t, i) => {
        const on = p >= TAGS[i].at;
        t.style.opacity = on ? "1" : "0";
        t.style.transform = on ? "none" : "translateY(10px)";
      });
    });
  }, [register]);

  return (
    <div ref={root} aria-hidden className="absolute inset-0 overflow-hidden bg-night">
      {SKIES.map((s, i) => (
        <div
          key={i}
          data-sky
          className="absolute inset-0"
          style={{ background: s.bg, opacity: i === 0 ? 1 : 0 }}
        />
      ))}
      <div
        data-sun
        className="absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          opacity: 0,
          background: "radial-gradient(60% 55% at 62% 88%, rgba(247, 221, 168,.95), rgba(217, 139, 50,.45) 45%, transparent 75%)",
        }}
      />

      <div data-lights className="absolute inset-x-0 bottom-[30%] h-16" style={{ opacity: 0 }}>
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle, #F0C27A 1.2px, transparent 1.6px)",
            backgroundSize: "17px 11px",
          }}
        />
      </div>

      {RIDGES.map((r, i) => (
        <div key={i} data-ridge className="absolute inset-x-0 bottom-0 h-[62%]">
          <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className="h-full w-full">
            <path d={r.d} fill={r.fill} />
          </svg>
          <div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: `linear-gradient(transparent, rgba(226,235,240,${0.22 - i * 0.05}))` }}
          />
        </div>
      ))}

      <div data-sg className="absolute inset-x-0 bottom-0 h-[42%]" style={{ transform: "translateY(100%)" }}>
        <svg viewBox="0 0 1600 300" preserveAspectRatio="none" className="h-full w-full">
          {SG.rects.map((b, i) => (
            <rect key={i} x={b.x} y={250 - b.h} width={b.w} height={b.h} fill="#161B21" />
          ))}
          {/* Marina Bay's three towers and rooftop deck */}
          <path d="M1040 250V96h26v154zM1092 250V96h26v154zM1144 250V96h26v154zM1028 84h154v12H1028z" fill="#0E1216" />
          <rect x="0" y="250" width="1600" height="50" fill="#222A32" />
        </svg>
      </div>

      <div data-mel className="absolute inset-x-0 bottom-0 h-[46%]" style={{ transform: "translateY(100%)" }}>
        <svg viewBox="0 0 1600 300" preserveAspectRatio="none" className="h-full w-full">
          {MEL.rects.map((b, i) => (
            <rect key={i} x={b.x} y={280 - b.h} width={b.w} height={b.h} fill="#161B21" />
          ))}
          <rect x="0" y="280" width="1600" height="20" fill="#161B21" />
        </svg>
      </div>

      <div
        data-bank
        className="absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          transform: "translateY(100%)",
          background:
            "radial-gradient(30% 60% at 15% 100%, #F3EBDD, transparent), radial-gradient(35% 75% at 45% 100%, #F3EBDD, transparent), radial-gradient(30% 65% at 78% 100%, #F3EBDD, transparent), linear-gradient(transparent, rgba(243, 235, 221,.75))",
        }}
      />

      {CLOUDS.map((c, i) => (
        <div
          key={i}
          data-cloud
          className="absolute h-[14vh]"
          style={{
            top: `${c.top}%`,
            left: `${c.left}vw`,
            width: `${c.w}vw`,
            opacity: c.o,
            background: "radial-gradient(closest-side, rgba(243, 235, 221,.95), rgba(243, 235, 221,.35) 55%, transparent)",
          }}
        />
      ))}

      <div data-route className="absolute inset-0">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full origin-top max-md:scale-y-[0.62]">
          {[
            { d: "M380 880 C420 830 450 800 500 780", c: "#F0C27A" },
            { d: "M500 780 C580 750 700 780 760 660", c: "#D98B32" },
            { d: "M760 660 C800 570 850 480 870 300", c: "#D98B32" },
          ].map((s, i) => (
            <g key={i}>
              <path
                data-seg
                d={s.d}
                fill="none"
                stroke={s.c}
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
              />
            </g>
          ))}
        </svg>
        {TAGS.map((t) => (
          <div
            key={t.name}
            data-tag
            className="absolute hidden -translate-x-1/2 flex-col items-center transition-[opacity,transform] duration-500 md:flex"
            style={{ left: `${t.x}%`, top: `${t.y}%`, marginTop: -92, opacity: 0 }}
          >
            <span className="bg-night/80 px-2 py-1 text-[11px] uppercase tracking-[0.15em] text-paper">{t.name}</span>
            <span
              className="h-16 w-[2px]"
              style={{ background: "linear-gradient(transparent, #D98B32)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
