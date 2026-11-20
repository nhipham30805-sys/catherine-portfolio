"use client";

import { useRef, useState } from "react";
import { CONTACT } from "@/lib/content";

// After simon-nguyen.space's contact block, in our colours: the email big enough to read across a room,
// a Copy button that puts it straight on the clipboard, then LinkedIn and CV side by side.
export default function ContactLinks() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Copies with a hidden text box first (works everywhere, no permission prompt), then the modern clipboard as a backup.
  const copy = () => {
    let ok = false;
    const back = document.activeElement as HTMLElement | null;
    try {
      const t = document.createElement("textarea");
      t.value = CONTACT.email;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      ok = document.execCommand("copy");
      t.remove();
      back?.focus(); // keep keyboard focus on the Copy button
    } catch {}
    if (!ok) navigator.clipboard?.writeText(CONTACT.email).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <a href={`mailto:${CONTACT.email}`} className="contact-email">
          {CONTACT.email}
        </a>
        <button type="button" onClick={copy} className="contact-copy" data-copied={copied || undefined}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
            {copied ? (
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3 10.5V3.5A1 1 0 0 1 4 2.5h6.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </>
            )}
          </svg>
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
            <rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4.8 6.8v4.6M4.8 4.6v.1M7.6 11.4V6.8m0 2.2c0-1.3.8-2.3 1.9-2.3s1.7.8 1.7 2.1v2.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          LinkedIn
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a href={CONTACT.resume} target="_blank" rel="noopener noreferrer" className="contact-link">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
            <path d="M4 1.5h5.5L12.5 4.5v10h-8.5z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M6 8h4.5M6 10.5h4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          CV
          <span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
