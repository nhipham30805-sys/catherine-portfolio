"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONTACT, NAV } from "@/lib/content";
import { calm } from "@/lib/motion";
import LinkedIn from "./LinkedIn";

const NAME = "Catherine Pham";

// The footer: where she is (with the live Melbourne time), the pages, how to reach her and the résumé, then her
// name set right across the bottom. As the footer scrolls into view the letters rise one after another out of
// the bottom edge, in step with the scroll; for visitors who ask for less motion the name simply stands.
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Melbourne" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || calm()) return;
    const upd = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / r.height));
      el.style.setProperty("--fp", p.toFixed(3));
    };
    upd();
    addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    return () => {
      removeEventListener("scroll", upd);
      removeEventListener("resize", upd);
    };
  }, []);

  return (
    <footer ref={root} className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-where">
            <p className="foot-city">Melbourne, VIC</p>
            <p className="foot-time">
              {time && (
                <>
                  It&apos;s <b>{time}</b> in Melbourne
                </>
              )}
            </p>
          </div>
          <nav className="foot-col" aria-label="Footer">
            <h2>Pages</h2>
            <ul>
              {NAV.filter((n) => n.href !== "/").map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="foot-link">
                    {n.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="foot-col">
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="foot-link break-all">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.tel} className="foot-link">
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <LinkedIn label="LinkedIn" className="foot-link" />
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h2>Résumé</h2>
            <ul>
              <li>
                <a href={CONTACT.resume} download className="foot-link">
                  Download PDF <span aria-hidden>↓</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-legal">
          <span>© 2026 Catherine Pham</span>
        </div>
        <p className="foot-name display">
          <span className="sr-only">{NAME}</span>
          <span aria-hidden className="foot-name-row">
            {[...NAME].map((c, i) => (
              <span key={i} style={{ ["--i" as string]: i }}>
                {c === " " ? " " : c}
              </span>
            ))}
          </span>
        </p>
      </div>
    </footer>
  );
}
