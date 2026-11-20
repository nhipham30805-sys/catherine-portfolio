"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HEADLINE, SUBHEAD } from "@/lib/content";
import { calm } from "@/lib/motion";
import { scrollToY } from "../SmoothScroll";
import Scene, { Apply } from "./Scene";
import Terrain, { STATIONS, stationWeight } from "./Terrain";
import { DISTANCE, DWELL_STRETCH, dwell, fade, key, LOCATIONS, stageAt, undwell } from "./timeline";

const FlightMap = dynamic(() => import("./FlightMap"), { ssr: false });

type Backdrop = "terrain" | "scene" | "map" | "video";

type Chapter = { numeral?: string; title?: string; label: string; org?: string; panel: string; small?: string };

const CHAPTERS: Chapter[] = [
  { numeral: "I", title: "The mountains that raised me", label: "Base Camp · Hòa Bình", panel: "12 years in gifted schools, believing good grades were the ticket to a better life." },
  { label: "Camp 1 · Hanoi", org: "VinUniversity · Collaborator", panel: "My first job, first competitions, and discovering my love for helping others." },
  { numeral: "II", title: "The bigger market", label: "The Bigger Market · Singapore", org: "Ascendant Global Credit Group Pte. Ltd · Private Wealth Introducer", panel: "Bigger rooms. High-stakes clients. Listen before you sell.", small: "~2,200 km" },
  { numeral: "III", title: "Proof", label: "Camp 3 · Melbourne", panel: "Not smart enough for AI? #1 of 350+ teams.", small: "~8,300 km · 26 client accounts · Top 3 Google Search placements · 82% traffic growth · 6×+ ROAS" },
];

const DOTS = [
  { at: 0.15, name: "Base Camp" },
  { at: 0.35, name: "Hanoi" },
  { at: 0.52, name: "Singapore" },
  { at: 0.78, name: "Melbourne" },
  { at: 0.97, name: "Summit" },
];

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Flight() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const listeners = useRef(new Set<Apply>());
  const last = useRef(0);
  const [backdrop, setBackdrop] = useState<Backdrop>("terrain");
  const [mapReady, setMapReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  const register = useCallback((fn: Apply) => {
    listeners.current.add(fn);
    fn(last.current);
    return () => void listeners.current.delete(fn);
  }, []);

  const onReady = useCallback(() => setMapReady(true), []);
  const onMapFail = useCallback(() => {
    setMapReady(false);
    setBackdrop("terrain");
  }, []);
  const onTerrainFail = useCallback(() => setBackdrop("scene"), []);
  const backdropRef = useRef(backdrop);
  backdropRef.current = backdrop;

  // Each chapter's words arrive once the camera has closed in on its place, and leave as it pulls away.
  const showChapters = useCallback((p: number) => {
    section.current?.querySelectorAll<HTMLElement>("[data-station]").forEach((node, i) => {
      const o = Math.max(0, Math.min(1, (stationWeight(p, STATIONS[i]) - 0.55) / 0.45));
      node.style.opacity = String(o);
      node.style.setProperty("--o", String(o));
      node.style.visibility = o === 0 ? "hidden" : "visible";
    });
  }, []);

  // Pick the richest backdrop this device can handle. Terrain needs no token; Scene catches anything without WebGL.
  useEffect(() => {
    // Reduced motion gets the still version of the flight.
    if (calm()) {
      setReduced(true);
      return;
    }
    if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN && innerWidth >= 768 && hasWebGL()) {
      setBackdrop("map");
      return;
    }
    if (innerWidth >= 768) return;
    fetch("/video/flight.mp4", { method: "HEAD" })
      .then((r) => {
        if (r.ok && r.headers.get("content-type")?.startsWith("video")) setBackdrop("video");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const windows = Array.from(el.querySelectorAll<HTMLElement>("[data-win]")).map((node) => ({
      node,
      range: node.dataset.win!.split(",").map(Number),
    }));
    const hudLoc = el.querySelector<HTMLElement>("[data-hud=loc]")!;
    const hudDist = el.querySelector<HTMLElement>("[data-hud=dist]")!;
    const hudClients = el.querySelector<HTMLElement>("[data-hud=clients]")!;
    const hudRank = el.querySelector<HTMLElement>("[data-hud=rank]")!;
    const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]"));

    const set = (node: HTMLElement, text: string) => {
      if (node.textContent !== text) node.textContent = text;
    };

    const apply = (p: number) => {
      last.current = p;
      for (const { node, range } of windows) {
        const o = fade(p, range[0], range[1]);
        node.style.opacity = String(o);
        node.style.setProperty("--o", String(o));
        // Hidden overlays must not hold keyboard focus.
        node.style.visibility = o === 0 ? "hidden" : "visible";
      }
      // The terrain drives the chapter words from its own eased camera; other backdrops follow the scroll.
      if (backdropRef.current !== "terrain") showChapters(p);
      const stage = stageAt(p);
      set(hudLoc, LOCATIONS[stage]);
      const km = Math.round(key(p, DISTANCE) / 10) * 10;
      set(hudDist, `~${km.toLocaleString("en-AU")} km`);
      // Clients climb with the flight: 12 by Singapore, 25 by Melbourne.
      set(hudClients, String(Math.round(key(p, [[0.45, 0], [0.53, 12], [0.7, 12], [0.82, 25]]))));
      set(hudRank, p >= 0.84 ? "#1" : "–");
      dots.forEach((d, i) => d.setAttribute("data-on", String(i === stage)));
      if (video.current?.duration) video.current.currentTime = p * video.current.duration;
      listeners.current.forEach((fn) => fn(p));
    };

    apply(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => apply(dwell(self.progress)),
    });
    apply(dwell(st.progress));
    return () => st.kill();
  }, [reduced, backdrop]);

  const goTo = (p: number) => {
    const el = section.current!;
    scrollToY(el.offsetTop + undwell(p) * (el.offsetHeight - innerHeight));
  };
  const skip = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToY(document.getElementById("after-flight")!.offsetTop - 64);
  };

  if (reduced) return <FlightStatic />;

  return (
    <section ref={section} aria-label="The Flight" className="relative" style={{ height: `${Math.round(500 * DWELL_STRETCH)}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {backdrop === "scene" && <Scene register={register} />}
        {(backdrop === "terrain" || (backdrop === "map" && !mapReady)) && <Terrain register={register} onFail={onTerrainFail} onCamera={showChapters} />}
        {backdrop === "map" && <FlightMap register={register} onReady={onReady} onFail={onMapFail} />}
        {backdrop === "video" && (
          <video ref={video} src="/video/flight.mp4" muted playsInline preload="auto" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        )}

        {/* Keeps overlay text legible whatever the sky is doing. */}
        <div data-win="-1,0.91" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(rgba(14, 18, 22,.5), transparent 28%)" }} />

        <a
          href="#after-flight"
          onClick={skip}
          className="skip-link absolute right-5 top-[84px] z-20 md:right-28"
        >
          Skip the flight <span aria-hidden>↓</span>
        </a>

        {/* Hero */}
        <div data-win="-1,0.05" className="hero-scrim pointer-events-none absolute inset-0" />
        <div data-win="-1,0.05" className="absolute inset-0 z-10">
          <HeroCopy onStart={() => goTo(0.08)} />
        </div>

        {/* End card */}
        <div data-win="0.91,2" className="absolute inset-0 flex flex-col items-center justify-center bg-night/30 px-5 text-center" style={{ opacity: 0, visibility: "hidden" }}>
          <p className="label !text-paper">Summit: Not yet</p>
          <h2 className="display mt-3 text-6xl md:text-8xl" style={{ textShadow: "0 2px 24px rgba(14, 18, 22,.6)" }}>The climb continues.</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/experience" className="btn btn-sun">
              See the trail
            </Link>
          </div>
        </div>

        {/* Flight log: the chapter on the left, the numbers on the right, on one scrim rising from the bottom. */}
        <div data-win="0.04,0.92" className="flight-scrim pointer-events-none absolute inset-x-0 bottom-0 h-[62%]" style={{ opacity: 0, visibility: "hidden" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-[84px] md:bottom-[92px]">
          <div className="wrap grid gap-6 md:grid-cols-12 md:items-end md:gap-10">
            <div className="relative min-h-[11rem] md:col-span-7 md:min-h-[15rem]">
              {CHAPTERS.map((c, i) => (
                <article key={c.label} data-station={i} className="chapter-copy absolute inset-x-0 bottom-0" style={{ opacity: 0, visibility: "hidden" }}>
                  {c.numeral && (
                    <h2 className="flex items-baseline gap-3 md:gap-5">
                      <span aria-hidden className="chapter-numeral font-serif font-light leading-[0.8]">
                        {c.numeral}
                      </span>
                      <span className="font-serif text-[1.65rem] italic leading-none text-paper md:text-[2.6rem]">{c.title}</span>
                    </h2>
                  )}
                  <p className="mt-4 max-w-[30ch] font-serif text-[1.55rem] font-medium leading-[1.12] text-paper md:mt-6 md:text-[2.5rem]">
                    {c.panel}
                  </p>
                  <p className="mt-3 max-w-[60ch] text-[13px] leading-snug text-honey md:mt-4 md:text-sm">
                    {c.org ?? c.label}
                    {c.small && <span className="hidden text-paper/70 md:inline"> · {c.small}</span>}
                  </p>
                </article>
              ))}
            </div>

            <dl data-win="0.04,0.92" className="flight-log md:col-span-4 md:col-start-9" style={{ opacity: 0, visibility: "hidden" }}>
              <div className="col-span-2">
                <dt>Location</dt>
                <dd data-hud="loc">{LOCATIONS[0]}</dd>
              </div>
              <div className="col-span-2">
                <dt>Distance travelled</dt>
                <dd data-hud="dist" className="flight-log-big">~0 km</dd>
              </div>
              <div>
                <dt>Years</dt>
                <dd>19</dd>
              </div>
              <div>
                <dt>Clients</dt>
                <dd data-hud="clients">0</dd>
              </div>
              <div>
                <dt>Rank</dt>
                <dd data-hud="rank">–</dd>
              </div>
            </dl>
          </div>
        </div>


        {/* Chapter dots */}
        <div data-win="0.04,0.92" className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col md:right-24" style={{ opacity: 0, visibility: "hidden" }}>
          {DOTS.map((d) => (
            <button
              key={d.name}
              type="button"
              data-dot
              aria-label={`Go to ${d.name}`}
              onClick={() => goTo(d.at)}
              className="group flex h-7 w-7 items-center justify-center"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-paper/60 group-hover:bg-paper group-data-[on=true]:bg-sunrise" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reduced motion: one still scene, then the same chapters as plain reading.
function FlightStatic() {
  const [still, setStill] = useState(true);
  const onFail = useCallback(() => setStill(false), []);
  return (
    <section aria-label="The Flight">
      <div className="relative min-h-svh">
        {still ? <Terrain onFail={onFail} /> : <Scene />}
        <div className="hero-scrim absolute inset-0" />
        <HeroCopy onStart={() => scrollToY(document.getElementById("after-flight")?.offsetTop ?? innerHeight)} />
      </div>
      <div className="wrap grid gap-10 py-20 md:grid-cols-2 xl:grid-cols-4">
        {CHAPTERS.map((c) => (
          <div key={c.label}>
            <p className="label">{c.label}</p>
            {c.title && (
              <h2 className="mt-2 font-serif text-4xl font-medium italic">
                {c.numeral}. {c.title}
              </h2>
            )}
            {c.org && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-honey">{c.org}</p>}
            <p className="mt-3 text-lg">{c.panel}</p>
            {c.small && <p className="mt-2 text-sm text-muted">{c.small}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// The opening frame: the headline, big (Catherine removed the small "I was told to work hard." line, Nov 2026). Sits low, so the mountains get the screen.
function HeroCopy({ onStart }: { onStart: () => void }) {
  return (
    <>
      <p className="hero-coords wrap">
        <span>Hòa Bình, Vietnam</span>
        <span className="tabular-nums">20.81° N · 105.34° E</span>
      </p>
      <div className="hero-grid wrap">
        <h1 className="hero-title">
          <span className="hero-line">
            <span className="hero-now">{HEADLINE}</span>
          </span>
        </h1>
        <div className="hero-side">
          <p>{SUBHEAD}</p>
          <StartButton onStart={onStart} />
        </div>
      </div>
    </>
  );
}

// Quiet on purpose: a label and a small arrow that nudges down the page.
function StartButton({ onStart }: { onStart: () => void }) {
  return (
    <button type="button" className="hero-start" onClick={onStart}>
      <span>Start the climb</span>
      <svg className="hero-start-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 4v15M6 13l6 6 6-6" />
      </svg>
    </button>
  );
}
