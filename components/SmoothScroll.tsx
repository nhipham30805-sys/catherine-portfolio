"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { calm } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function scrollToY(y: number) {
  if (window.__lenis) window.__lenis.scrollTo(y);
  else window.scrollTo(0, y);
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (calm()) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
