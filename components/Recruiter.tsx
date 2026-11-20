"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const Ctx = createContext({ recruiter: false, setRecruiter: (_: boolean) => {} });
export const useRecruiter = () => useContext(Ctx);

// Recruiter mode = the real site with every animation switched off, starting on The Trail (Experience).
// Switching loads the page fresh so every scroll effect and the Flight start in the right state.
export function RecruiterProvider({ children }: { children: React.ReactNode }) {
  const [recruiter, setState] = useState(false);

  useEffect(() => {
    setState(document.documentElement.hasAttribute("data-recruiter"));
  }, []);

  const setRecruiter = useCallback((on: boolean) => {
    try {
      if (on) localStorage.setItem("recruiter", "1");
      else localStorage.removeItem("recruiter");
    } catch {}
    document.documentElement.toggleAttribute("data-recruiter", on);
    setState(on);
    if (on) location.assign("/experience");
    else location.reload();
  }, []);

  return <Ctx.Provider value={{ recruiter, setRecruiter }}>{children}</Ctx.Provider>;
}

// Always one tap away, bottom centre: a slim glass button that takes you straight to The Trail (work experience).
// It tucks away while you scroll down, comes back when you scroll up, and hides on The Trail itself.
export function RecruiterPill() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/experience") return null;

  return (
    <Link href="/experience" onFocus={() => setHidden(false)} className={`glass-pill ${hidden ? "glass-hide" : ""}`}>
      <span className="glass-name">Recruiter mode</span>
      <span aria-hidden className="glass-go">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span className="sr-only">: see my work experience</span>
    </Link>
  );
}
