"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { COMPETITIONS, NO_PRIZE, type Work } from "@/lib/content";
import WhatIDid, { whatIDid } from "./WhatIDid";
import T from "./T";
import WorkStrip from "./WorkStrip";

// "Peaks as tabs" (chosen by Catherine Nov 2026). A short mountain range works as the row of tabs: each placing
// is a peak whose height is the number of teams in the field; the climbs without a placing are low grey ridges
// with no flag. Picking a peak swaps the one panel underneath, which has the same shape for every climb:
// the result, story and role on the left, the work (first piece big) on the right.
// Look ("Sunrise facets", chosen Nov 2026): each peak is cut into lit and shadow faces like a paper mountain;
// the picked peak turns gold and ember while a soft sun rises behind it. The others stay cool slate.
type Climb = {
  key: string;
  tag: string; // the label on the peak
  result: string; // the big line in the panel
  none: boolean;
  teams: number;
  title: string;
  meta: string;
  details: { label: string; text: string }[];
  callout?: string;
  did: string;
  work: Work[];
  link?: { label: string; href: string };
};

const MAX = 350;

const CLIMBS: Climb[] = [
  ...COMPETITIONS.map((c) => ({
    key: c.title,
    tag: c.peakLabel,
    result: c.rank,
    none: false,
    teams: c.teams,
    title: c.title,
    meta: c.meta,
    details: c.details,
    callout: c.callout,
    did: whatIDid(c),
    work: c.work,
    link: c.link,
  })),
  ...NO_PRIZE.map((p) => ({
    key: p.title,
    tag: p.title,
    result: "",
    none: true,
    teams: 0,
    title: p.title,
    meta: p.meta,
    details: [{ label: "The project", text: p.about }],
    did: p.did,
    work: p.work,
  })),
];

// Square-root scale keeps the 32-team peak visible but the global win clearly tallest.
const heightOf = (x: Climb, i: number) => (x.none ? (i % 2 ? 34 : 24) : Math.sqrt(x.teams / MAX) * 88);

// Open on the tallest peak, the global #1.
const FIRST = CLIMBS.reduce((best, c, i) => (c.teams > CLIMBS[best].teams ? i : best), 0);

export default function Peaks() {
  const [active, setActive] = useState(FIRST);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const c = CLIMBS[active];
  const [sun, setSun] = useState<{ x: number; h: number } | null>(null);

  // Park the sun behind the picked summit (measured, because the peaks overlap and scroll on phones).
  useLayoutEffect(() => {
    const place = () => {
      const t = tabs.current[active];
      if (t) setSun({ x: t.offsetLeft + t.offsetWidth / 2, h: heightOf(CLIMBS[active], active) });
    };
    place();
    const range = tabs.current[active]?.parentElement;
    const ro = new ResizeObserver(place);
    if (range) ro.observe(range);
    return () => ro.disconnect();
  }, [active]);

  // Arrow keys move between peaks, like any tab row.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + CLIMBS.length) % CLIMBS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="pk">
      <div className="pk-range" role="tablist" aria-label="Choose a climb" onKeyDown={onKey}>
        <span
          className="pk-sun"
          aria-hidden
          style={sun ? { left: sun.x, ["--h" as string]: `${sun.h}%`, opacity: 1 } : undefined}
        />
        {CLIMBS.map((x, i) => {
          const h = heightOf(x, i);
          const on = i === active;
          return (
            <button
              key={x.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`pk-tab-${i}`}
              aria-selected={on}
              aria-controls="pk-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`pk-peak${x.none ? " is-none" : ""}`}
              style={{ ["--h" as string]: `${h}%` }}
            >
              <span className="pk-tag">{x.tag}</span>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <polygon className="f1" points="0,100 50,0 39,50" />
                <polygon className="f2" points="0,100 39,50 54,58 45,100" />
                <polygon className="f3" points="50,0 54,58 39,50" />
                <polygon className="f4" points="50,0 100,100 54,58" />
                <polygon className="f5" points="54,58 100,100 45,100" />
                {!x.none && <polygon className="pk-snow" points="50,0 62,24 52,20 44,30 40,20" />}
              </svg>
              <span className="sr-only">
                {x.result}: {x.title}
              </span>
            </button>
          );
        })}
      </div>

      <div key={active} id="pk-panel" role="tabpanel" aria-labelledby={`pk-tab-${active}`} className="pk-panel tab-in">
        <div className="pk-text">
          {!c.none && <p className="pk-result display">{c.result}</p>}
          <h2 className="pk-title display">{c.title}</h2>
          <p className="pk-meta">
            <T>{c.meta}</T>
          </p>
          <dl className="pk-details">
            {c.details.map((d) => (
              <div key={d.label}>
                <dt className="label">{d.label}</dt>
                <dd>
                  <T>{d.text}</T>
                </dd>
              </div>
            ))}
          </dl>
          {c.callout && <p className="pk-callout">{c.callout}</p>}
          <WhatIDid text={c.did} />
        </div>
        <div className="min-w-0">
          <WorkStrip items={c.work} lead />
          {c.link && (
            <a className="pk-link" href={c.link.href} target="_blank" rel="noopener noreferrer">
              {c.link.label}
              <span aria-hidden> ↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
