"use client";

import { gsap } from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { calm } from "@/lib/motion";

// The page change (after simon-nguyen.space): four coloured bands sweep in one after another and cover the page,
// the next page loads behind them, then they carry on out to show it. The bands run at 45 degrees (Catherine,
// Nov 2026): they come in from the bottom-left corner and leave through the top-right.
// It catches every link to another page on the site, so no link needs changing. Back/forward, new-tab clicks,
// links to the same page and visitors who asked for less motion get an ordinary page change.
export default function PageWipe() {
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const waiting = useRef(false);
  const failsafe = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const reveal = () => {
    const cols = box.current?.children;
    if (!cols) return;
    clearTimeout(failsafe.current);
    waiting.current = false;
    gsap.to(cols, {
      scaleY: 0,
      transformOrigin: "50% 0%",
      duration: 0.9,
      ease: "expo.out", // leaves fast, then glides to a soft stop
      stagger: 0.05,
      delay: 0.05,
      overwrite: true,
    });
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.hasAttribute("download") || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (/\.[a-z0-9]{2,4}$/i.test(url.pathname)) return; // files like the résumé PDF
      if (calm() || waiting.current || !box.current) return;

      // Stop Next's own navigation (Link skips it when the click is already handled); the link's own
      // onClick, such as closing the phone menu, still runs.
      e.preventDefault();
      waiting.current = true;
      const dest = url.pathname + url.search + url.hash;
      // Change page when the columns have covered it, or after 0.9s whatever happens, so a click always works.
      let went = false;
      const go = () => {
        if (went) return;
        went = true;
        router.push(dest);
        // If the page never changes (an error, say), lift the columns anyway.
        failsafe.current = setTimeout(reveal, 4000);
      };
      setTimeout(go, 900);
      gsap.fromTo(
        box.current.children,
        { scaleY: 0, transformOrigin: "50% 100%" },
        {
          scaleY: 1,
          duration: 0.6,
          ease: "power4.out", // snaps in, then settles
          stagger: 0.05,
          overwrite: true,
          onComplete: go,
        },
      );
    };
    // Capture phase on window: runs before React's and Next's handlers see the click.
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // The new page is in: lift the columns.
  useEffect(() => {
    if (waiting.current) reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="wipe" aria-hidden>
      <div ref={box} className="wipe-in">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
