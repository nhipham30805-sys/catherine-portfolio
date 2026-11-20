"use client";

import { useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/content";
import T from "./T";
import { calm } from "@/lib/motion";

// A preview to show in the lightbox: an explicit embed, or a Google Sheet's read-only preview page.
export function embedOf(w: Work) {
  if (w.embed) return w.embed;
  const sheet = w.href?.match(/docs\.google\.com\/spreadsheets\/d\/([^/?#]+)/);
  if (!sheet) return undefined;
  const gid = w.href?.match(/gid=(\d+)/)?.[1];
  return `https://docs.google.com/spreadsheets/d/${sheet[1]}/preview${gid ? `?gid=${gid}` : ""}`;
}

// A tile's picture. YouTube's own preview is 4:3 with black bars, so it's zoomed until only the frame shows.
// scrim: a dark fade up from the bottom so the label stays readable on pale or busy pictures (tiles with text on them).
const SCRIM = "linear-gradient(to top, rgba(14, 18, 22, 0.94) 0%, rgba(14, 18, 22, 0.72) 34%, rgba(14, 18, 22, 0.2) 68%, rgba(14, 18, 22, 0) 85%)";
function bg(w: Work, scrim = true): React.CSSProperties | undefined {
  if (!w.thumb) return undefined;
  const size = /ytimg\.com/.test(w.thumb) ? "auto 134%" : "cover";
  return scrim
    ? { backgroundImage: `${SCRIM}, url(${w.thumb})`, backgroundSize: `100% 100%, ${size}` }
    : { backgroundImage: `url(${w.thumb})`, backgroundSize: size };
}

export function siteOf(href: string) {
  if (/youtu/.test(href)) return "YouTube";
  if (/docs\.google\.com\/spreadsheets/.test(href)) return "Google Sheets";
  if (/instagram\.com/.test(href)) return "Instagram";
  if (/drive\.google\.com/.test(href)) return "Google Drive";
  if (/threads\.(com|net)/.test(href)) return "Threads";
  if (/linkedin\.com|lnkd\.in/.test(href)) return "LinkedIn";
  return "the original";
}

// "Show the work": a swipeable row of samples. Each opens full screen with a preview; plain links open in a new tab.
// feature: the first sample is shown large, with the rest in a row beneath it (used in the project cards).
// ring: the samples sit on a turning wheel instead of a row. It turns as the page scrolls (and with the arrows);
// the card at the top stands upright and bright, the rest fade round the sides. Used for the #1 Build Week.
function WorkRing({ items, onOpen }: { items: Work[]; onOpen: (i: number) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const steps = useRef(0);
  const kick = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const n = items.length;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const gap = 360 / n;
    const still = calm();
    let cur = 0;
    let raf = 0;
    let shown = -1;
    const target = () => {
      const r = el.getBoundingClientRect();
      const fromScroll = still ? 0 : (innerHeight / 2 - (r.top + r.height / 2)) * 0.09;
      return -steps.current * gap - fromScroll;
    };
    const layout = () => {
      const W = el.clientWidth;
      const cw = Math.min(230, W * 0.36);
      const ch = (cw * 2) / 3;
      const R = W * 0.42;
      const cx = W / 2;
      const cy = ch / 2 + 18 + R;
      el.style.setProperty("--cw", `${cw}px`);
      el.style.setProperty("--cy", `${cy}px`);
      el.style.setProperty("--r", `${R}px`);
      items.forEach((_, i) => {
        const c = cards.current[i];
        if (!c) return;
        const a = ((((i * gap + cur) % 360) + 540) % 360) - 180;
        const rad = (a * Math.PI) / 180;
        const d = Math.abs(a) / 180;
        c.style.transform = `translate3d(${cx + R * Math.sin(rad) - cw / 2}px, ${cy - R * Math.cos(rad) - ch / 2}px, 0) rotate(${a}deg)`;
        const o = Math.max(0, 1 - d * 1.3);
        c.style.opacity = String(o);
        c.style.filter = `brightness(${1 - d * 0.6}) saturate(${1 - d * 0.7})`;
        c.style.zIndex = String(100 - Math.round(d * 100));
        c.style.visibility = o < 0.04 ? "hidden" : "visible";
        c.toggleAttribute("data-top", Math.abs(a) < gap / 2);
      });
      const top = ((Math.round(-cur / gap) % n) + n) % n;
      if (top !== shown) {
        shown = top;
        setActive(top);
      }
    };
    const tick = () => {
      const t = target();
      cur += (t - cur) * (still ? 1 : 0.12);
      if (Math.abs(t - cur) < 0.05) cur = t;
      layout();
      raf = cur === t ? 0 : requestAnimationFrame(tick);
    };
    kick.current = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    cur = target();
    layout();
    const onMove = () => kick.current();
    addEventListener("scroll", onMove, { passive: true });
    addEventListener("resize", onMove);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onMove);
      removeEventListener("resize", onMove);
    };
  }, [items, n]);

  const turn = (by: number) => {
    steps.current += by;
    kick.current();
  };

  return (
    <div ref={box} className="work-ring mt-3">
      {items.map((w, i) => (
        <button
          key={w.label}
          ref={(b) => {
            cards.current[i] = b;
          }}
          type="button"
          onClick={() => onOpen(i)}
          className="ring-card"
          style={bg(w, false)}
        >
          <span className="sr-only">
            <T>{w.label}</T>
          </span>
        </button>
      ))}
      <div className="ring-center">
        <p className="ring-count">
          {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
        <p className="ring-title" aria-live="polite">
          <T>{items[active].label}</T>
        </p>
        <div className="ring-arrows">
          <button type="button" onClick={() => turn(-1)} aria-label="Previous sample">←</button>
          <button type="button" onClick={() => onOpen(active)} className="ring-open">Open</button>
          <button type="button" onClick={() => turn(1)} aria-label="Next sample">→</button>
        </div>
      </div>
    </div>
  );
}

// lead: the first piece big, the rest as small thumbnails underneath (Leadership page panel).
export default function WorkStrip({ items, confidential = false, feature = false, ring = false, stack = false, lead = false }: { items: Work[]; confidential?: boolean; feature?: boolean; ring?: boolean; stack?: boolean; lead?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  if (!items.length) return null;

  const show = (i: number) => {
    setOpen(i);
    setPlaying(false);
    dialog.current?.showModal();
  };
  const current = open === null ? null : items[open];

  return (
    <div>
      <h3 className="label">Show the work</h3>
      {ring && !lead ? (
        <WorkRing items={items} onOpen={show} />
      ) : (
        <ul className={`work-strip mt-3${lead ? " is-lead" : stack ? " is-stack" : feature ? " is-feature" : items.length <= 3 ? " is-fit" : ""}`} style={{ ["--n" as string]: items.length }}>
          {items.map((w, i) => (
            <li key={w.label}>
              {w.href && !w.video && !w.image && !embedOf(w) ? (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`work-tile ${w.thumb ? "work-photo" : "work-link"}`}
                  style={bg(w)}
                >
                  <span>
                    <T>{w.label}</T>
                  </span>
                  <span aria-hidden className="text-sunrise">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => show(i)}
                  className={`work-tile ${w.thumb || w.image || w.file ? "work-photo" : w.video ? "work-video" : embedOf(w) ? "work-link" : "work-empty"}`}
                  style={bg(w)}
                >
                  {(w.video || w.file || (/instagram\.com|drive\.google\.com\/file/.test(w.embed ?? "") && w.thumb)) && (
                    <span aria-hidden className="work-play">
                      <svg viewBox="0 0 10 10" width="14" height="14" aria-hidden><path d="M2.5 1.5v7l6-3.5z" fill="currentColor" /></svg>
                    </span>
                  )}
                  <span>
                    <T>{w.label}</T>
                  </span>
                  {!w.thumb && embedOf(w) && <span className="text-sm text-gold">Preview</span>}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {confidential && <p className="mt-2 text-sm text-muted">Client details hidden for confidentiality.</p>}

      <WorkLightbox dialog={dialog} current={current} playing={playing} setPlaying={setPlaying} onClosed={() => {
          setOpen(null);
          setPlaying(false);
        }} />
    </div>
  );
}

// The full-screen viewer for one work sample. Shared by the work rows and The Trail's work walls.
// With `set`, it steps through a whole set of work (one company's): arrows, thumbnails, keyboard or a swipe.
export function WorkLightbox({
  dialog,
  current,
  playing,
  setPlaying,
  onClosed,
  set,
  index = 0,
  onStep,
}: {
  dialog: React.RefObject<HTMLDialogElement | null>;
  current: Work | null;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  onClosed: () => void;
  set?: Work[];
  index?: number;
  onStep?: (i: number) => void;
}) {
  const many = !!set && set.length > 1 && !!onStep;
  const go = (d: number) => many && onStep!((index + d + set!.length) % set!.length);
  const swipe = useRef(0);
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (strip.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [index]);
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={current?.label ?? "Work sample"}
      onClose={onClosed}
      onClick={(e) => {
        if (e.target === e.currentTarget) dialog.current?.close();
      }}
      onKeyDown={(e) => {
        if (!many || (e.target as HTMLElement).closest("iframe, video")) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onTouchStart={(e) => (swipe.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if ((e.target as HTMLElement).closest(".lb-slides")) return; // swiping a carousel moves its slides, not the piece
        const d = e.changedTouches[0].clientX - swipe.current;
        if (Math.abs(d) > 50) go(d < 0 ? 1 : -1);
      }}
    >
      {current && (
        <div className="lightbox-inner">
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium">
              <T>{current.label}</T>
            </p>
            <button type="button" className="btn btn-ghost !min-h-10 !px-4" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
          <div
            style={current.slides ? ({ "--ar": current.ratio ?? "9 / 16" } as React.CSSProperties) : undefined}
            className={`lightbox-stage${current.slides ? " is-slides" : current.embed?.includes("instagram.com") ? " is-tall" : current.embed?.endsWith(".pdf") ? " is-doc" : ""}`}>
            {embedOf(current) ? (
              <iframe src={embedOf(current)} title={current.label} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" className="h-full w-full bg-paper" />
            ) : current.file ? (
              <video src={current.file} poster={current.thumb} controls autoPlay playsInline className="h-full w-full bg-night object-contain" />
            ) : current.slides ? (
              <ul className="lb-slides" aria-label={`${current.slides.length} slides`}>
                {current.slides.map((src, i) => (
                  <li key={src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${current.label}, slide ${i + 1} of ${current.slides!.length}`} loading={i < 3 ? "eager" : "lazy"} />
                  </li>
                ))}
              </ul>
            ) : current.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.image} alt={current.label} className="h-full w-full bg-night object-contain" />
            ) : current.video ? (
              playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${current.video}?autoplay=1&rel=0`}
                  title={current.label}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                // Nothing loads from YouTube until the visitor asks for it.
                <button type="button" onClick={() => setPlaying(true)} className="flex h-full w-full flex-col items-center justify-center gap-3 bg-night">
                  <span aria-hidden className="work-play !h-16 !w-16">
                    <svg viewBox="0 0 10 10" width="22" height="22" aria-hidden><path d="M2.5 1.5v7l6-3.5z" fill="currentColor" /></svg>
                  </span>
                  <span className="font-medium">Play the video</span>
                  <span className="text-sm text-muted">Plays from YouTube</span>
                </button>
              )
            ) : (
              <div className="ph-block h-full w-full">
                <T>{current.label}</T>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {current.href ? (
              <a href={current.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gold underline underline-offset-4">
                {/\.pdf$/.test(current.href) ? "Open the PDF" : `Open on ${siteOf(current.href)}`} ↗
              </a>
            ) : (
              <span />
            )}
            {many && (
              <div className="lb-nav">
                <span className="text-sm tabular-nums text-muted" aria-live="polite">
                  {index + 1} / {set!.length}
                </span>
                <button type="button" onClick={() => go(-1)} aria-label="Previous piece">
                  <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden><path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next piece">
                  <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden><path d="m5 2 5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
                </button>
              </div>
            )}
          </div>
          {many && (
            <div ref={strip} className="lb-strip">
              {set!.map((w, k) => (
                <button key={w.label} type="button" onClick={() => onStep!(k)} aria-label={w.label} aria-current={k === index ? "true" : undefined}>
                  {w.thumb ?? w.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.thumb ?? w.image} alt="" loading="lazy" />
                  ) : w.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.logo} alt="" loading="lazy" className="is-logo" />
                  ) : (
                    <span className="lb-strip-doc">{k + 1}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
