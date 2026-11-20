"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const CAMPS = [
  { name: "Base Camp", at: 0 },
  { name: "Camp 1", at: 0.33 },
  { name: "Camp 2", at: 0.66 },
  { name: "Camp 3", at: 1 },
];

export default function AltitudeMeter() {
  const pathname = usePathname();
  const contact = pathname === "/contact";
  const marker = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = contact ? 1 : max > 0 ? Math.min(1, scrollY / max) : 0;
      if (marker.current) marker.current.style.transform = `translateY(${-p * 100}cqh)`;
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => {
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      cancelAnimationFrame(frame);
    };
  }, [contact, pathname]);

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed bottom-8 right-4 top-24 z-40 hidden w-20 flex-col items-end md:flex"
      style={{ textShadow: "0 1px 4px rgba(14, 18, 22,.9)" }}
    >
      <p className="label mb-3 text-right !text-[10px] !tracking-[0.12em] !text-paper">
        {contact ? "Next climb: you?" : "Summit: Not yet"}
      </p>
      <div className="relative mr-1 w-[3px] flex-1 bg-paper/20" style={{ containerType: "size" }}>
        <div ref={fill} className="absolute inset-0 origin-bottom bg-sunrise" style={{ transform: "scaleY(0)" }} />
        {CAMPS.map((c) => (
          <span
            key={c.name}
            className="absolute right-3 whitespace-nowrap text-[10px] uppercase tracking-[0.12em] text-paper/80"
            style={{ bottom: `${c.at * 100}%`, transform: "translateY(50%)" }}
          >
            {c.name}
          </span>
        ))}
        <div ref={marker} className="absolute -left-[4px] bottom-0 h-[11px] w-[11px] rounded-full bg-sunrise" />
      </div>
    </aside>
  );
}
