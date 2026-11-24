"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { calm } from "@/lib/motion";

const LINES = ["I'm not smart enough for tech.", "I'm not smart enough for AI.", "I'm not enough."];
const WIN = "#1 globally.";

// "The rewrite" typing (Catherine, Nov 2026) filmed as "Into the valley, over the ridge": one line typed like a
// draft, each doubt deleted and retyped. Through the doubts the camera sinks into a dark valley and the ridges rise
// around the words; when "#1 globally." is typed it cranes up over the top and a gold sunrise opens. The
// certificate and closing line then appear in the middle. Reduced motion shows the end state.
function edits() {
  const out: string[] = [];
  const done: number[] = []; // the step where each phrase is fully typed
  let prev = "";
  [...LINES, WIN].forEach((s) => {
    let k = 0;
    if (s !== WIN) while (k < prev.length && k < s.length && prev[k] === s[k]) k++;
    for (let i = prev.length; i >= k; i--) out.push(prev.slice(0, i));
    for (let i = k + 1; i <= s.length; i++) out.push(s.slice(0, i));
    done.push(out.length);
    for (let h = 0; h < 16; h++) out.push(s); // a beat to read it before the next edit
    prev = s;
  });
  return { out, done };
}

// Four ridgelines, far (light slate) to near (darkest), as SVG paths. Fixed numbers so server and browser agree.
const RIDGE_FILLS = ["#3E4852", "#2E3740", "#222A32", "#161B21"];
const RIDGES = RIDGE_FILLS.map((_, i) => {
  let d = `M0 ${380 + i * 70}`;
  for (let x = 0; x <= 1600; x += 40) {
    const y = 380 + i * 70 - Math.abs(Math.sin(x / (170 + i * 40) + i * 2)) * (200 - i * 30) - Math.sin(x / 37 + i) * 8;
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d;
});

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function TheDoubt() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const stage = el.querySelector<HTMLElement>("[data-stage]")!;
    const line = el.querySelector<HTMLElement>("[data-line]")!;
    const text = el.querySelector<HTMLElement>("[data-text]")!;
    const foot = el.querySelector<HTMLElement>("[data-foot]")!;
    const glow = el.querySelector<HTMLElement>("[data-glow]")!;
    const veil = el.querySelector<HTMLElement>("[data-veil]")!;
    const hills = Array.from(el.querySelectorAll<SVGSVGElement>("[data-ridge]"));

    // The camera: 0 → 3 sinks into the valley through the doubts, 3 → 4 cranes up into the sunrise.
    const film = (ph: number) => {
      const down = clamp(ph / 3);
      const up = ease(clamp((ph - 3) * 1.3));
      hills.forEach((h, k) => {
        const depth = (k + 1) / 4;
        const y = mix(mix(40, -(18 + k * 14), ease(down)) * depth, 60 + k * 20, up);
        h.style.transform = `translateY(${y.toFixed(2)}vh) scale(${(1 + down * 0.15 * depth).toFixed(3)})`;
        (h.lastElementChild as SVGPathElement).style.opacity = (up * (k < 2 ? 0.9 : 0.4)).toFixed(3);
      });
      veil.style.opacity = (down * 0.55 * (1 - up)).toFixed(3);
      stage.style.background = `linear-gradient(180deg, #0E1216 ${mix(0, 40, up).toFixed(0)}%, ${up > 0 ? "#5C3A24" : "#222A32"} ${mix(100, 82, up).toFixed(0)}%)`;
      glow.style.background = `radial-gradient(60% ${(10 + up * 40).toFixed(0)}% at 50% ${mix(100, 72, up).toFixed(0)}%, rgba(247, 221, 168, ${(up * 0.9).toFixed(3)}), rgba(217, 139, 50, ${(up * 0.55).toFixed(3)}) 35%, transparent 70%)`;
    };

    if (calm()) {
      film(4);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const { out: steps, done } = edits();
    const n = steps.length;
    const M = done.map((d) => (d / n) * 0.8); // scroll progress where each phrase finishes typing
    const phase = (q: number) => {
      if (q <= M[0]) return q / M[0];
      if (q <= M[1]) return 1 + (q - M[0]) / (M[1] - M[0]);
      if (q <= M[3]) return 2 + (q - M[1]) / (M[3] - M[1]);
      return 3 + clamp((q - M[3]) / (1 - M[3]));
    };
    let last = "";

    const apply = (p: number) => {
      const s = steps[Math.min(n - 1, Math.floor(clamp(p / 0.8) * n))];
      if (s !== last) {
        text.textContent = s;
        line.classList.toggle("is-win", s.startsWith("#"));
        last = s;
      }
      foot.classList.toggle("is-on", p > 0.86);
      film(phase(p));
    };
    el.classList.add("is-live");
    apply(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => apply(s.progress),
    });
    return () => {
      st.kill();
      el.classList.remove("is-live");
      text.textContent = WIN;
      line.classList.add("is-win");
      foot.classList.add("is-on");
    };
  }, []);

  return (
    <section ref={section} aria-label="The doubt" className="doubt relative motion-safe:h-[440svh]">
      <div data-stage className="doubt-stage">
        <div data-glow aria-hidden className="doubt-glow" />
        <div aria-hidden className="doubt-ridges">
          {RIDGES.map((d, k) => (
            <svg key={k} data-ridge viewBox="0 0 1600 900" preserveAspectRatio="none">
              <path d={`${d} L1600 900 L0 900Z`} fill={RIDGE_FILLS[k]} />
              <path d={d} fill="none" stroke="#B5682A" strokeWidth="1.5" opacity="0" />
            </svg>
          ))}
        </div>
        <div data-veil aria-hidden className="doubt-veil" />
        <div className="wrap doubt-copy">
          <p className="sr-only">
            {LINES.join(" ")} {WIN} 350+ teams. Agentic AI Build Week 2026. Turns out I just hadn&apos;t tried yet.
          </p>
          <p data-line aria-hidden className="doubt-line is-win">
            <span data-text>{WIN}</span>
            <span className="doubt-caret" />
          </p>
          <div data-foot aria-hidden className="doubt-foot is-on">
            <img
              src="/images/melbourne/ai-build-week-certificate-sm.jpg"
              alt=""
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
            />
            <p>350+ teams. Agentic AI Build Week 2026.</p>
            <em>Turns out I just hadn&apos;t tried yet.</em>
          </div>
        </div>
      </div>
    </section>
  );
}

// Draws the path with scroll, and pops each flag as the line reaches it.
export function useTrailDraw() {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const line = el.querySelector<SVGPathElement>("[data-line]")!;
    const flags = Array.from(el.querySelectorAll<HTMLElement>("[data-flag]"));
    if (calm()) {
      line.style.strokeDashoffset = "0";
      flags.forEach((f) => f.classList.add("up"));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const apply = (p: number) => {
      line.style.strokeDashoffset = String(1 - p);
      flags.forEach((f, i) => f.classList.toggle("up", p >= (i / flags.length) * 0.92));
    };
    apply(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 60%",
      end: "bottom 80%",
      onUpdate: (s) => apply(s.progress),
    });
    return () => st.kill();
  }, []);
  return box;
}
