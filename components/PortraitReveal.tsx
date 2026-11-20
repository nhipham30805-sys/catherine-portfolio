"use client";

import { useEffect, useRef } from "react";

// The About portrait. Moving the cursor (or a finger) paints a brush-stroke trail
// that shows a second photo underneath, then the stroke fades back out.
const LIFE = 900; // ms a stroke stays visible
type Pt = { x: number; y: number; t: number };
// Lines the second photo up with the first: the same point (between the eyes) in each photo,
// in that photo's own pixels, plus how much bigger the second face should be drawn.
export type RevealAnchor = { base: [number, number]; reveal: [number, number]; scale?: number; baseY?: number };

export default function PortraitReveal({
  base,
  reveal,
  alt,
  width,
  height,
  anchor,
}: {
  base: string;
  reveal: string;
  alt: string;
  width: number;
  height: number;
  anchor?: RevealAnchor;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const host = c?.parentElement;
    const ctx = c?.getContext("2d");
    if (!c || !host || !ctx) return;

    const img = new Image();
    img.src = reveal;
    let pts: Pt[] = [];
    let raf = 0;
    let w = 0, h = 0, dpr = 1;

    const size = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(host);

    const draw = () => {
      const now = performance.now();
      pts = pts.filter((p) => now - p.t < LIFE);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      if (pts.length && img.complete) {
        // 1. The mask: a ribbon through the recent points, thinner as it ages, soft at the edges.
        const base = Math.max(70, w * 0.2);
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.shadowColor = "#000"; ctx.shadowBlur = base * 0.35;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i];
          const k = 1 - (now - b.t) / LIFE;
          ctx.lineWidth = base * Math.pow(k, 0.7);
          ctx.strokeStyle = `rgba(0,0,0,${Math.min(1, k * 1.6)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        if (pts.length === 1) {
          const k = 1 - (now - pts[0].t) / LIFE;
          ctx.fillStyle = `rgba(0,0,0,${k})`;
          ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, (base / 2) * k, 0, Math.PI * 2); ctx.fill();
        }
        ctx.shadowBlur = 0;
        // 2. The second photo, only where the mask is painted.
        ctx.globalCompositeOperation = "source-in";
        const nw = img.naturalWidth, nh = img.naturalHeight;
        let s: number, dx: number, dy: number;
        if (anchor) {
          // Where the first photo's anchor point lands on screen (it is object-fit: cover).
          const sb = Math.max(w / width, h / height);
          const fx = (w - width * sb) * 0.5 + anchor.base[0] * sb;
          const fy = (h - height * sb) * (anchor.baseY ?? 0.5) + anchor.base[1] * sb;
          const [ax, ay] = anchor.reveal;
          // Same face size, but never so small that an edge of the frame shows through.
          s = Math.max(sb * (anchor.scale ?? 1), fx / ax, (w - fx) / (nw - ax), fy / ay, (h - fy) / (nh - ay));
          dx = fx - ax * s; dy = fy - ay * s;
        } else {
          s = Math.max(w / nw, h / nh);
          dx = (w - nw * s) / 2; dy = (h - nh * s) * 0.4;
        }
        ctx.drawImage(img, dx, dy, nw * s, nh * s);
      }
      raf = pts.length ? requestAnimationFrame(draw) : 0;
    };

    const add = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const last = pts[pts.length - 1];
      const now = performance.now();
      // Fill gaps on fast moves so the stroke stays continuous.
      if (last) {
        const d = Math.hypot(x - last.x, y - last.y);
        const steps = Math.min(12, Math.floor(d / 14));
        for (let i = 1; i < steps; i++) {
          pts.push({ x: last.x + ((x - last.x) * i) / steps, y: last.y + ((y - last.y) * i) / steps, t: now });
        }
      }
      pts.push({ x, y, t: now });
      if (pts.length > 160) pts = pts.slice(-160);
      if (!raf) raf = requestAnimationFrame(draw);
    };

    host.addEventListener("pointermove", add);
    host.addEventListener("pointerdown", add);
    return () => {
      host.removeEventListener("pointermove", add);
      host.removeEventListener("pointerdown", add);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reveal, anchor, width, height]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={base} alt={alt} width={width} height={height} />
      <canvas ref={canvas} className="portrait-reveal" aria-hidden />
    </>
  );
}
