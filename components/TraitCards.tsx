"use client";

import { useEffect, useRef, useState } from "react";
import { calm } from "@/lib/motion";

type Trait = { trait: string; proof: string; img?: string; wide?: boolean; pos?: string; peak?: boolean; square?: boolean };

// "What the mountains gave me" (About). Two wide cards on top, three below. Each card shows its proof straight
// away; on hover warm ember light rises from the bottom, the outlined word fills in, and a preview picture
// follows the pointer (after simon-nguyen.space/work). Smart work is the peak: already lit; its preview is the Watt the Hack poster (Catherine swapped it in for a "75%" tile, Nov 2026).
// Phones and reduced-motion visitors get a small still thumbnail in each card's corner instead.
const TRAITS: Trait[] = [
  { trait: "Resilience", proof: "Three countries in three years, starting from scratch each time.", img: "/images/catherine-harbour.jpg", pos: "center 30%" },
  { trait: "Resourcefulness", proof: "From a mountain city with limited access to running AI tools in client work every day.", img: "/images/certs/agentic-ai-build-week.jpg", wide: true },
  { trait: "Hustle", proof: "Account manager, growth intern and peer mentor, all while studying.", img: "/images/catherine-certificate.jpg", pos: "center 30%" },
  { trait: "Ambition", proof: "Always moving to the bigger market.", img: "/images/catherine-about.jpg", pos: "center 25%" },
  { trait: "Smart work", proof: "Revisions cut by 75% by fixing the process, not working longer.", img: "/images/leadership/watt-the-hack-poster-sm.jpg", peak: true, square: true },
];

const RIDGES = [
  "M0 40V26l14-12 10 8 16-16 14 12 10-6 18 14 18-8v22Z",
  "M0 40V30l12-6 14 6 18-20 12 10 14-6 14 10 16-6v22Z",
  "M0 40V22l20-10 16 12 22-18 20 16 22-6v24Z",
  "M0 40V28l18-14 18 10 20-20 18 14 26-6v28Z",
  "M0 40V30l24-12 26-16 24 14 26-4v28Z",
];

function Preview({ t }: { t: Trait }) {
  if (!t.img) return <span className="tc-num">75%</span>;
  return <img src={t.img} alt="" style={{ objectPosition: t.pos, objectFit: t.wide ? "contain" : "cover" }} />;
}

export default function TraitCards() {
  const box = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<number | null>(null);

  // The preview eases toward the pointer each frame, so it trails slightly behind like the reference.
  useEffect(() => {
    const el = box.current;
    const f = float.current;
    if (!el || !f || calm() || !matchMedia("(hover: hover)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, started = false;
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      f.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!started) {
        x = tx;
        y = ty;
        started = true;
        raf = requestAnimationFrame(tick);
      }
    };
    el.addEventListener("pointermove", move);
    return () => {
      el.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={box} className="tc-grid" onPointerLeave={() => setOn(null)}>
      {TRAITS.map((t, i) => (
        <article
          key={t.trait}
          className={`tc-card${t.peak ? " is-peak" : ""}`}
          onPointerEnter={() => setOn(i)}
        >
          <svg className="tc-ridge" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
            <path d={RIDGES[i]} />
          </svg>
          <span className={`tc-thumb${t.wide ? " is-wide" : ""}${t.square ? " is-square" : ""}`} aria-hidden>
            <Preview t={t} />
          </span>
          <h3 className="tc-word display">{t.trait}</h3>
          <p className="tc-proof">{t.proof}</p>
        </article>
      ))}
      <div ref={float} className="tc-float" aria-hidden>
        {TRAITS.map((t, i) => (
          <span key={t.trait} className={`tc-pic${t.wide ? " is-wide" : ""}${t.square ? " is-square" : ""}${on === i ? " is-on" : ""}`}>
            <Preview t={t} />
          </span>
        ))}
      </div>
    </div>
  );
}
