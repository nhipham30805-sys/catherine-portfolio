"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/content";
import T from "./T";
import WorkStrip from "./WorkStrip";
import { calm } from "@/lib/motion";

// University projects as a stack of cards: each one pins near the top, and the next slides up over it
// while the one underneath sinks back and dims (after simon-nguyen.space). On a mouse, the prints tilt toward
// the cursor. Phones and reduced motion get a plain list.
export default function ProjectStack({ projects }: { projects: Project[] }) {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el || calm()) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 960px)", () => {
      const items = [...el.querySelectorAll<HTMLLIElement>(":scope > li")];
      // A card taller than the screen would pin with its bottom (the result) hidden, and the next card would
      // cover it. So a tall card pins higher up, only once its bottom edge is in view.
      const fit = () => {
        items.forEach((li, i) => {
          const base = 104 + i * 14;
          const room = window.innerHeight - li.offsetHeight - 24;
          li.style.top = `${Math.min(base, room)}px`;
        });
      };
      fit();
      ScrollTrigger.addEventListener("refreshInit", fit);
      items.slice(0, -1).forEach((li, i) => {
        const next = items[i + 1];
        const card = li.querySelector(".pstack-card");
        const dim = li.querySelector(".pstack-dim");
        const st = { trigger: next, start: "top bottom", end: `top ${parseFloat(getComputedStyle(next).top) || 120}px`, scrub: true };
        gsap.to(card, { scale: 0.94, ease: "none", scrollTrigger: st });
        gsap.to(dim, { opacity: 0.65, ease: "none", scrollTrigger: { ...st } });
      });
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", fit);
        items.forEach((li) => (li.style.top = ""));
      };
    });
    // The prints tilt toward the mouse (up to ~5 degrees), eased, and settle flat when it leaves.
    const offs: (() => void)[] = [];
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      el.querySelectorAll<HTMLElement>(".pstack-vis").forEach((vis) => {
        const strip = vis.querySelector<HTMLElement>(".work-strip");
        if (!strip) return;
        let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
        const tick = () => {
          cx += (tx - cx) * 0.1;
          cy += (ty - cy) * 0.1;
          strip.style.transform = `perspective(1200px) rotateY(${cx.toFixed(3)}deg) rotateX(${cy.toFixed(3)}deg)`;
          raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(tick) : 0;
        };
        const kick = () => {
          if (!raf) raf = requestAnimationFrame(tick);
        };
        const move = (e: PointerEvent) => {
          const r = vis.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          tx = (px - 0.5) * 10;
          ty = (0.5 - py) * 8;
          vis.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
          vis.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
          vis.style.setProperty("--glow", "1");
          kick();
        };
        const leave = () => {
          tx = ty = 0;
          vis.style.setProperty("--glow", "0");
          kick();
        };
        vis.addEventListener("pointermove", move);
        vis.addEventListener("pointerleave", leave);
        offs.push(() => {
          cancelAnimationFrame(raf);
          vis.removeEventListener("pointermove", move);
          vis.removeEventListener("pointerleave", leave);
          strip.style.transform = "";
        });
      });
    }
    return () => {
      mm.revert();
      offs.forEach((off) => off());
    };
  }, []);

  const total = String(projects.length).padStart(2, "0");

  return (
    <ol ref={list} className="pstack">
      {projects.map((p, i) => {
        const cut = p.title.indexOf(": ");
        const main = cut > 0 ? p.title.slice(0, cut) : p.title;
        const sub = cut > 0 ? p.title.slice(cut + 2) : "";
        return (
          <li key={p.title} className="pstack-item" style={{ ["--i" as string]: i }}>
            <article className="pstack-card">
              <div className="pstack-text">
                <p className="pstack-meta">
                  <span className="text-gold">
                    {String(i + 1).padStart(2, "0")} / {total}
                  </span>
                  <span aria-hidden>·</span>
                  <span>{p.meta}</span>
                </p>
                <h3 className="pstack-title" style={{ ["--long" as string]: Math.max(...main.split(/\s+|(?=[A-Z][a-z])/).map((w) => w.length)) }}>
                  {/* Long joined-up names like #SharedResponsibilities may break at a capital, never mid-word. */}
                  {main.split(/(?=[A-Z][a-z])/).map((part, k) => (
                    <span key={k}>
                      {k > 0 && <wbr />}
                      {part}
                    </span>
                  ))}
                </h3>
                {sub && <p className="pstack-sub">{sub}</p>}

                {p.idea && (
                  <div className="mt-7">
                    <h4 className="label">The idea</h4>
                    <p className="mt-3 text-lg leading-relaxed text-paper/85">
                      <T>{p.idea}</T>
                    </p>
                  </div>
                )}

                <div className="mt-7">
                  <h4 className="label">What I did</h4>
                  <p className="mt-3 text-lg leading-relaxed text-paper/85">
                    <T>{p.did ?? p.hard}</T>
                  </p>
                </div>

                {p.result && (
                  <div className="pstack-result">
                    <span className={p.result.startsWith("[") ? "text-lg" : p.result.length <= 6 ? "pstack-result-num" : "pstack-result-text"}>
                      <T>{p.result}</T>
                    </span>
                    {p.resultNote && (
                      <span className="pstack-result-text">
                        <T>{p.resultNote}</T>
                      </span>
                    )}
                    <span className="pstack-result-label">
                      <span aria-hidden className="pstack-peak" />
                      Result
                    </span>
                  </div>
                )}
              </div>

              {/* The same mountain behind every card, seen from higher up each time: card 1 is the forest, the last is the summit. */}
              <div className="pstack-vis" style={{ ["--climb" as string]: projects.length > 1 ? 1 - i / (projects.length - 1) : 0 }}>
                <div className="pstack-alt" aria-hidden>
                  <span className="pstack-alt-track">
                    <span className="pstack-alt-dot" />
                  </span>
                  <span>Ascent {String(i + 1).padStart(2, "0")}</span>
                </div>
                <WorkStrip items={p.work} feature />
              </div>
              <div className="pstack-dim" aria-hidden />
            </article>
          </li>
        );
      })}
    </ol>
  );
}
