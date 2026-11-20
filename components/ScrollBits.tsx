"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { calm } from "@/lib/motion";

const LINES = ["I'm not smart enough for tech.", "I'm not smart enough for AI.", "I'm not enough."];
const WIN = "#1 globally.";

// "The rewrite" (chosen by Catherine Nov 2026): one line on screen, typed like a draft. Each doubt is deleted
// back to where the next one differs and retyped; the last one is wiped and replaced by "#1 globally.", then the
// Agentic AI Build Week certificate and the closing line appear. Scroll drives every keystroke.
// Without JS or with reduced motion the end state shows: the win, the certificate and the closing line.
function edits() {
  const out: string[] = [];
  let prev = "";
  [...LINES, WIN].forEach((s) => {
    let k = 0;
    if (s !== WIN) while (k < prev.length && k < s.length && prev[k] === s[k]) k++;
    for (let i = prev.length; i >= k; i--) out.push(prev.slice(0, i));
    for (let i = k + 1; i <= s.length; i++) out.push(s.slice(0, i));
    for (let h = 0; h < 14; h++) out.push(s); // a beat to read it before the next edit
    prev = s;
  });
  return out;
}

export function TheDoubt() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el || calm()) return;
    gsap.registerPlugin(ScrollTrigger);
    const line = el.querySelector<HTMLElement>("[data-line]")!;
    const text = el.querySelector<HTMLElement>("[data-text]")!;
    const foot = el.querySelector<HTMLElement>("[data-foot]")!;
    const steps = edits();
    let last = "";

    const apply = (p: number) => {
      const s = steps[Math.min(steps.length - 1, Math.floor(Math.min(1, p / 0.82) * steps.length))];
      if (s !== last) {
        text.textContent = s;
        line.classList.toggle("is-win", s.startsWith("#"));
        last = s;
      }
      foot.classList.toggle("is-on", p > 0.86);
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
    <section ref={section} aria-label="The doubt" className="doubt relative motion-safe:h-[320svh]">
      <div className="flex min-h-svh flex-col justify-center py-20 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh">
        <div className="wrap">
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
            <p>
              350+ teams. Agentic AI Build Week 2026.
              <em>Turns out I just hadn&apos;t tried yet.</em>
            </p>
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
