"use client";

import { useEffect, useId, useRef, useState } from "react";

export type TabItem = { id: string; label: string };

// A recessed track with one raised key that slides between options.
export default function Tabs({
  items,
  value,
  onChange,
  label,
  light = false,
  className = "",
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  light?: boolean;
  className?: string;
}) {
  const base = useId();
  const track = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const active = el.querySelector<HTMLElement>('[aria-selected="true"]');
      if (active) setThumb({ x: active.offsetLeft, w: active.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [value]);

  const onKey = (e: React.KeyboardEvent) => {
    const i = items.findIndex((t) => t.id === value);
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % items.length;
    if (e.key === "ArrowLeft") next = (i - 1 + items.length) % items.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].id);
    track.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div
      ref={track}
      role="tablist"
      aria-label={label}
      onKeyDown={onKey}
      className={`strip ${light ? "strip-light" : ""} ${className}`}
    >
      {thumb && (
        <span
          aria-hidden
          className="strip-thumb"
          style={{ width: thumb.w, transform: `translateX(${thumb.x}px)` }}
        />
      )}
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          id={`${base}-${t.id}`}
          aria-selected={t.id === value}
          tabIndex={t.id === value ? 0 : -1}
          onClick={() => onChange(t.id)}
          className="strip-key"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
