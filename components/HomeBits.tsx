"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/content";
import Reveal from "./Reveal";
import RidgeSky from "./RidgeSky";
import { calm } from "@/lib/motion";

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || value < 5 || calm()) return;
    const decimals = Number.isInteger(value) ? 0 : 1;
    const state = { n: 0 };
    el.textContent = (0).toFixed(decimals);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      gsap.to(state, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = state.n.toFixed(decimals);
        },
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{value}</span>;
}

// What fades in behind each number on hover. Only real evidence for that number; the rest just warm up.
const STAT_MEDIA: Record<number, { src?: string; slices?: string[]; alt: string; position?: string }> = {
  0: { src: "/images/melbourne/lapeau-treatment-poster.jpg", alt: "A frame from a Lapeau Medi Spa video Catherine produced" },
  // Framed on the KPI tiles so the ROAS figure sits in view.
  1: { src: "/images/melbourne/roas-dashboard-sm.jpg", alt: "Google Ads report showing ROAS of 5.4", position: "60% 18%" },
  2: { src: "/images/melbourne/client-meeting-sm.jpg", alt: "Catherine presenting in a client meeting on Google Meet" },
  // Framed on Catherine at the front of the team call.
  3: { src: "/images/melbourne/build-week-win-sm.jpg", alt: "Catherine and her team celebrating on a video call during the Agentic AI Build Week", position: "42% 55%" },
  4: {
    slices: ["/images/hoa-binh/school-sm.jpg", "/images/hanoi/vinuni-4-sm.jpg", "/images/singapore/team-sm.jpg"],
    alt: "Three snapshots: school in Vietnam, VinUniversity in Hanoi, the team in Singapore",
  },
};

function UpArrow() {
  return (
    <svg viewBox="0 0 24 24" className="stat-arrow" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20V5M6 11l6-6 6 6" />
    </svg>
  );
}

// Elevation gained: tall columns that slide sideways as you scroll, ending on Catherine herself.
export function StatsStrip() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (calm()) {
      setStill(true);
      return;
    }
    const el = section.current;
    const row = track.current;
    if (!el || !row) return;
    gsap.registerPlugin(ScrollTrigger);
    let distance = 0;
    // The section is exactly as tall as the sideways distance, so one screen of scroll moves one screen across.
    const fit = () => {
      distance = Math.max(0, row.scrollWidth - innerWidth);
      el.style.height = `${distance + innerHeight}px`;
    };
    fit();
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        row.style.transform = `translate3d(${-self.progress * distance}px, 0, 0)`;
      },
      onRefresh: fit,
    });
    const onResize = () => {
      fit();
      ScrollTrigger.refresh();
    };
    addEventListener("resize", onResize);

    // Slide sideways by hand too: a trackpad swipe or a drag moves the page, so the rail follows.
    const stage = row.parentElement!;
    const scrollTo = (y: number) => {
      const top = el.offsetTop;
      const clamped = Math.min(top + distance, Math.max(top, y));
      if (window.__lenis) window.__lenis.scrollTo(clamped, { immediate: true });
      else window.scrollTo(0, clamped);
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      scrollTo(scrollY + e.deltaX);
    };
    let drag: { x: number; y: number; id: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: scrollY, id: e.pointerId };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4 && !stage.classList.contains("is-dragging")) {
        stage.classList.add("is-dragging");
        // Keep the drag even if the pointer leaves the rail; harmless if the browser refuses.
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {}
      }
      scrollTo(drag.y - dx);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      stage.classList.remove("is-dragging");
      try {
        if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
      } catch {}
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);

    return () => {
      st.kill();
      removeEventListener("resize", onResize);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      el.style.height = "";
      row.style.transform = "";
    };
  }, []);

  return (
    <section ref={section} id="after-flight" aria-labelledby="elevation" className={`stats-rail ${still ? "is-still" : ""}`}>
      <div className="stats-stage">
        <div ref={track} className="stats-track">
          <div className="stats-intro">
            <h2 id="elevation" className="display text-6xl md:text-8xl">
              Elevation gained
            </h2>
          </div>
          {STATS.map((s, i) => {
            const media = STAT_MEDIA[i];
            return (
              <article key={s.label} className="stat-col" tabIndex={0} aria-label={`${s.prefix}${s.value}${s.suffix} ${s.label}`}>
                {media && (
                  <div className="stat-media" aria-hidden>
                    {media.slices ? (
                      media.slices.map((src) => <span key={src} style={{ backgroundImage: `url(${src})` }} />)
                    ) : (
                      <span style={{ backgroundImage: `url(${media.src})`, backgroundPosition: media.position }} />
                    )}
                  </div>
                )}
                <p className="stat-number">
                  {s.arrow && <UpArrow />}
                  {s.prefix}
                  <CountUp value={s.value} />
                  {s.suffix}
                </p>
                <p className="stat-label">{s.label}</p>
              </article>
            );
          })}
          <figure className="stat-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/catherine-harbour.jpg" alt="Catherine by the harbour, the Harbour Bridge behind her" loading="lazy" decoding="async" />
            <figcaption className="stat-photo-caption">
              <Reveal>
                <p>Everything contributes to who I am now.</p>
              </Reveal>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

// "Zoom through the O" (chosen by Catherine Nov 2026): a full screen that holds still while you scroll. "Work harder"
// sits on the dark; scrolling zooms into it, faster and faster, straight through the hollow of the O, and out onto a
// live night sky over three mountain ranges (RidgeSky) that says "Solve smarter". Visitors who ask for less motion see both screens one after the other.
export function HardSmartSplit() {
  const section = useRef<HTMLElement>(null);
  const rise = useRef(0); // how far the mountains behind "Solve smarter" have risen, 0 to 1
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (calm()) {
      setStill(true);
      return;
    }
    const el = section.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const front = el.querySelector<HTMLElement>(".zo-front")!;
    const word = front.querySelector<HTMLElement>(".zo-word")!;
    const cv = front.querySelector<HTMLCanvasElement>(".zo-zoom")!;
    const g = cv.getContext("2d");
    if (!g) return;

    // The zooming "WORK HARDER" is drawn on a canvas, sharp at every size. Blowing up a full-screen HTML layer
    // 60 times made some browsers show cut-off letters and dark bands while scrolling (Catherine saw it, Nov 2026).
    const TEXT = "WORK HARDER";
    const zoom = { s: 1, x: 0, y: 0 };
    const m = { font: "", left: 0, base: 0, k: 1, ox: 0, oy: 0, dpr: 1 };
    const paper = getComputedStyle(word).color;

    const draw = () => {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, cv.width, cv.height);
      g.setTransform(m.dpr, 0, 0, m.dpr, 0, 0);
      g.translate(m.ox + zoom.x, m.oy + zoom.y);
      g.scale(zoom.s, zoom.s);
      g.translate(-m.ox + m.left, -m.oy + m.base);
      g.scale(m.k, m.k);
      g.font = m.font;
      g.fillStyle = paper;
      g.fillText(TEXT, 0, 0);
    };

    // Measure where the HTML word sits, then find the middle of the O's hollow by drawing the word on a hidden
    // canvas and looking for the gap inside the O. The zoom glides that point to the centre and rushes through it.
    const measure = () => {
      const cs = getComputedStyle(word);
      const size = parseFloat(cs.fontSize);
      m.font = `400 ${size}px ${cs.fontFamily}`;
      const c = document.createElement("canvas");
      const x = c.getContext("2d");
      if (!x) return;
      c.width = Math.ceil(size * 8);
      c.height = Math.ceil(size * 1.6);
      x.font = m.font;
      const base = Math.round(size * 1.2);
      x.fillText(TEXT, 0, base);
      const w1 = x.measureText("W").width;
      const w2 = x.measureText("WO").width;
      const full = x.measureText(TEXT);
      const cap = x.measureText("O").actualBoundingBoxAscent;
      const row = x.getImageData(0, Math.round(base - cap / 2), c.width, 1).data;
      let best: [number, number] = [w1, w2];
      let start = -1;
      for (let i = Math.ceil(w1) + 2; i < Math.floor(w2); i++) {
        const ink = row[i * 4 + 3] > 100;
        if (!ink && start < 0) start = i;
        if (ink && start >= 0) {
          if (i - start > best[1] - best[0] || best[0] === w1) best = [start, i];
          start = -1;
        }
      }
      const fr = front.getBoundingClientRect();
      const wr = word.getBoundingClientRect();
      m.k = wr.width / full.width;
      m.left = wr.left - fr.left;
      // Same baseline the browser uses for the HTML word, so nothing jumps when the canvas takes over.
      const fa = full.fontBoundingBoxAscent;
      const fd = full.fontBoundingBoxDescent;
      m.base = wr.top - fr.top + (wr.height - (fa + fd) * m.k) / 2 + fa * m.k;
      m.ox = m.left + ((best[0] + best[1]) / 2) * m.k;
      m.oy = m.base - (cap * m.k) / 2;
      m.dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(fr.width * m.dpr);
      cv.height = Math.round(fr.height * m.dpr);
      shift.x = fr.width / 2 - m.ox;
      shift.y = fr.height / 2 - m.oy;
      word.style.visibility = "hidden";
      draw();
    };
    const shift = { x: 0, y: 0 };

    // A context so the clean-up puts every word back where it started.
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      // The night screen starts showing while the zoom is still speeding up, so there is never a blank dark
      // stretch inside the O (Catherine saw one, Nov 2026).
      tl.to(q(".zo-front .zo-sub"), { opacity: 0, duration: 0.1 }, 0.03)
        // The O glides to the middle of the screen while the zoom builds slowly, then rushes through it, so the
        // view never lingers on giant half-letters.
        .to(zoom, { x: () => shift.x, y: () => shift.y, ease: "power2.inOut", duration: 0.2, onUpdate: draw }, 0.04)
        .to(zoom, { s: 60, ease: "expo.in", duration: 0.36, onUpdate: draw }, 0.06)
        .to(front, { opacity: 0, ease: "power1.in", duration: 0.09 }, 0.26)
        .from(q(".zo-scene"), { scale: 1.15, ease: "power2.out", duration: 0.3 }, 0.26)
        .fromTo(rise, { current: 0 }, { current: 1, ease: "power2.out", duration: 0.4 }, 0.26)
        .from(q(".zo-back .zo-word"), { scale: 0.8, opacity: 0, ease: "power3.out", duration: 0.16 }, 0.33)
        .from(q(".zo-back .zo-sub"), { opacity: 0, y: 16, duration: 0.12 }, 0.46)
        .to({}, { duration: 0.32 }, 0.68);
      ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6, animation: tl, invalidateOnRefresh: true, onRefresh: draw });
    }, el);

    const refit = () => {
      measure();
      ScrollTrigger.refresh();
    };
    document.fonts.ready.then(refit);
    addEventListener("resize", refit);
    return () => {
      removeEventListener("resize", refit);
      ctx.revert();
      word.style.visibility = "";
    };
  }, []);

  return (
    <section ref={section} aria-label="Hard and smart" className={`zo${still ? " zo-still" : ""}`}>
      <h3 className="sr-only">Work harder. Solve smarter.</h3>
      <div className="zo-stage">
        <div className="zo-back">
          <RidgeSky rise={rise} className="zo-scene" />
          <span aria-hidden className="zo-word">Solve smarter</span>
          <p className="zo-sub">Find the right problem. Prioritise what matters. Use the right tools to move faster.</p>
        </div>
        <div className="zo-front">
          <canvas className="zo-zoom" aria-hidden />
          <span aria-hidden className="zo-word">Work harder</span>
          <p className="zo-sub">I thought the biggest hustler in the room would always win.</p>
        </div>
      </div>
    </section>
  );
}
