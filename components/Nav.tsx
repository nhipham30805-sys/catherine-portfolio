"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACT, NAV } from "@/lib/content";

// A small peak that fills higher the further up the trail the link sits.
function PeakGlyph({ level }: { level: number }) {
  const y = 21 - 18 * level;
  const half = (10 * (y - 3)) / 18;
  return (
    <svg className="menu-glyph" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3 22 21H2Z" fill="none" stroke="rgba(243, 235, 221,.45)" strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points={`2,21 22,21 ${12 + half},${y} ${12 - half},${y}`} fill="#F0C27A" />
    </svg>
  );
}

function BrandMark() {
  return (
    <svg className="h-[18px] w-[22px] shrink-0" viewBox="0 0 22 18" aria-hidden>
      <path d="M0 18 8 3l4 7 3-4 7 12Z" fill="#D98B32" />
      <circle cx="17.5" cy="2.5" r="1.6" fill="#F0C27A" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setScrolled(scrollY > 24);
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(close, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    // The wipe grows out of the button, wherever it sits on this phone.
    const r = menuButton.current?.getBoundingClientRect();
    if (r) {
      sheet.current?.style.setProperty("--ox", `${r.left + r.width / 2}px`);
      sheet.current?.style.setProperty("--oy", `${r.top + r.height / 2}px`);
    }
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        menuButton.current?.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <nav aria-label="Main" className={`nav ${scrolled ? "scrolled" : ""} ${open ? "open" : ""}`}>
      <div ref={sheet} id="menu-sheet" className="menu-sheet" inert={!open}>
        <div className="menu-range" aria-hidden>
          <svg viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M0 200V128l52-58 34 34 56-84 62 92 38-40 58 62 44-44 56 58v52Z" fill="#222A32" />
            <path d="M0 200v-44l70-40 54 42 74-64 70 66 54-34 78 48v26Z" fill="#161B21" />
          </svg>
        </div>
        <div className="menu-scroll">
          <ol className="menu-links">
            {NAV.map((n, i) => (
              <li key={n.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={n.href} onClick={close} aria-current={pathname === n.href ? "page" : undefined}>
                  <PeakGlyph level={(i + 1) / NAV.length} />
                  <span className="menu-name">
                    <span>{n.name}</span>
                  </span>
                  <em className="menu-sub">{n.camp}</em>
                </Link>
              </li>
            ))}
          </ol>
          <div className="menu-actions">
            <Link href="/experience" onClick={close} className="btn btn-ghost">
              Recruiter mode
            </Link>
            <Link href="/contact#contact-form" onClick={close} className="btn btn-sun">
              Let&apos;s climb together
            </Link>
          </div>
          <p className="menu-foot">
            <span>Melbourne, VIC</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </p>
        </div>
      </div>

      <div className="nav-glass">
        <Link href="/" className="nav-brand" onClick={close}>
          <BrandMark />
          <span className="display whitespace-nowrap text-lg">Catherine Pham</span>
        </Link>


        <div className="nav-end">
          <button
            ref={menuButton}
            type="button"
            className="nav-menu"
            aria-expanded={open}
            aria-controls="menu-sheet"
            aria-label={open ? "Close menu" : "Menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
