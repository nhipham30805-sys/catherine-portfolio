"use client";

import { useEffect, useRef } from "react";
import { calm } from "@/lib/motion";

// "Head torch" cursor (chosen by Catherine Nov 2026): a soft warm glow follows the mouse like a head torch on a
// night climb, with a small gold dot at the tip. Over anything clickable the beam tightens and brightens; a click
// flares like a flash. Only for a mouse: touch screens keep their normal behaviour. Text fields get the normal
// typing cursor back. Visitors who ask for less motion get the dot and glow without the trailing or the flare.
// The torch lives in the browser's top layer (a popover) and is raised again whenever a viewer (a <dialog>) opens,
// so it is never hidden behind one. Over an embedded frame (Google Sheets) the frame shows its own cursor, so the
// torch steps aside there.
const CLICKABLE = "a, button, [role='button'], [role='tab'], label, summary, select, input[type='range'], .ch-rail.can-drag";
const TYPING = "input:not([type='range']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

export default function HeadTorch() {
  const glow = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    const still = calm();
    const top = layer.current;
    const raise = () => {
      if (!top || typeof top.showPopover !== "function") return;
      try {
        if (top.matches(":popover-open")) top.hidePopover();
        top.showPopover();
      } catch {}
    };
    raise();
    // Any dialog opening goes on top of the torch, so lift the torch back above it.
    const watch = new MutationObserver((list) => {
      if (list.some((r) => r.target instanceof HTMLDialogElement && r.target.open)) raise();
    });
    watch.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    let x = -200, y = -200, gx = x, gy = y, raf = 0, seen = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        gx = x;
        gy = y;
        root.classList.add("has-torch");
      }
      const el = e.target instanceof Element ? e.target : null;
      root.classList.toggle("torch-link", !!el?.closest(CLICKABLE));
      root.classList.toggle("torch-type", !!el?.closest(TYPING));
      root.classList.toggle("torch-out", el instanceof HTMLIFrameElement);
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || still || !layer.current) return;
      if (e.target instanceof Element && e.target.closest(TYPING)) return;
      const f = document.createElement("div");
      f.className = "torch-flare";
      f.style.transform = `translate(${x}px, ${y}px)`;
      layer.current.appendChild(f);
      f.addEventListener("animationend", () => f.remove(), { once: true });
      setTimeout(() => f.remove(), 1200);
      root.classList.add("torch-down");
    };
    const up = () => root.classList.remove("torch-down");
    const out = (e: MouseEvent) => {
      if (!e.relatedTarget || e.relatedTarget instanceof HTMLIFrameElement) root.classList.add("torch-out");
    };

    const loop = () => {
      const k = still ? 1 : 0.16;
      gx += (x - gx) * k;
      gy += (y - gy) * k;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (glow.current) glow.current.style.transform = `translate(${gx}px, ${gy}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down, { passive: true });
    addEventListener("pointerup", up, { passive: true });
    document.addEventListener("mouseout", out);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      document.removeEventListener("mouseout", out);
      watch.disconnect();
      try {
        top?.hidePopover();
      } catch {}
      root.classList.remove("has-torch", "torch-link", "torch-type", "torch-down", "torch-out");
    };
  }, []);

  return (
    <div ref={layer} className="torch" popover="manual" aria-hidden>
      <div ref={glow} className="torch-glow">
        <i />
      </div>
      <div ref={dot} className="torch-dot">
        <i />
      </div>
    </div>
  );
}
