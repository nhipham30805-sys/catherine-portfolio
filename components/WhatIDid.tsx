import T from "./T";

// "What I did": one plain paragraph in place of the old Hard/Smart toggle.
export function whatIDid(x: { did?: string; hard?: string; smart?: string }) {
  return x.did ?? [x.hard, x.smart].filter((t) => t && !t.startsWith("[")).join(" ");
}

export default function WhatIDid({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div>
      <h3 className="label">What I did</h3>
      <p className="mt-2 text-lg leading-relaxed text-paper/85">
        <T>{text}</T>
      </p>
    </div>
  );
}
