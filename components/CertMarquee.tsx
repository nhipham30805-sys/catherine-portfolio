"use client";

import { useEffect, useRef, useState } from "react";
import type { Cert } from "@/lib/content";
import { calm } from "@/lib/motion";

// Two rows of certificates that move with the scroll (after spicyweb.com.au): scrolling down runs the
// top row to the left and the bottom row to the right. Clicking a tile opens the full certificate.
export default function CertMarquee({ rows }: { rows: Cert[][] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Cert | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // The rows only move when the visitor scrolls, so they still follow the page with reduced motion on,
    // just without the easing.
    const ease = calm() ? 1 : 0.12;
    const tracks = [...el.querySelectorAll<HTMLElement>(".cert-track")];
    const cur = tracks.map(() => NaN);
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // Pixels scrolled since the rows came up from the bottom of the screen.
      const scrolled = Math.max(0, innerHeight - r.top);
      let moving = false;
      tracks.forEach((t, i) => {
        // How far a row can travel: most of one copy of the list, never past its end.
        const span = Math.max(0, Math.min(t.scrollWidth / 2, t.scrollWidth - el.clientWidth));
        const travel = Math.min(span, scrolled * 0.7);
        const goal = i % 2 ? -span + travel : -travel;
        cur[i] = Number.isNaN(cur[i]) ? goal : cur[i] + (goal - cur[i]) * ease;
        if (Math.abs(goal - cur[i]) > 0.3) moving = true;
        else cur[i] = goal;
        t.style.transform = `translate3d(${cur[i].toFixed(1)}px,0,0)`;
      });
      if (moving) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    addEventListener("scroll", kick, { passive: true });
    window.__lenis?.on("scroll", kick);
    addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", kick);
      window.__lenis?.off("scroll", kick);
      removeEventListener("resize", kick);
    };
  }, [rows]);

  const show = (c: Cert) => {
    setOpen(c);
    dialog.current?.showModal();
  };

  return (
    <>
      <div ref={box} className="cert-rows">
        {rows.map((row, r) => (
          <div key={r} className="cert-row">
            <ul className="cert-track">
              {/* The list is drawn twice so the row never runs out while it slides; the copy is hidden from screen readers and the keyboard. */}
              {[0, 1].flatMap((copy) =>
                row.map((c) => (
                  <li key={`${copy}-${c.img}`} aria-hidden={copy === 1 || undefined} className={copy === 1 ? "cert-copy" : undefined}>
                    <button type="button" className="cert-tile" tabIndex={copy === 1 ? -1 : undefined} onClick={() => show(c)}>
                      <span className="cert-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.img} alt="" loading="lazy" />
                      </span>
                      <span className="cert-title">{c.title}</span>
                      <span className="cert-meta">
                        {c.win && <span className="text-sunrise">Win · </span>}
                        {c.issuer}
                        {c.date && ` · ${c.date}`}
                      </span>
                    </button>
                  </li>
                )),
              )}
            </ul>
          </div>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={open?.title ?? "Certificate"}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {open && (
          <div className="lightbox-inner">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium">
                {open.title}
                <span className="block text-sm font-normal text-muted">
                  {open.issuer}
                  {open.date && ` · ${open.date}`}
                </span>
              </p>
              <button type="button" className="btn btn-ghost !min-h-10 !px-4" onClick={() => dialog.current?.close()}>
                Close
              </button>
            </div>
            <div className="lightbox-stage is-doc">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={open.img} alt={`${open.title} certificate from ${open.issuer}`} className="h-full w-full bg-night object-contain" />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
