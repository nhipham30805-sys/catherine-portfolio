"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/content";

const CLIMBS = ["Hiring", "Project", "Coffee chat"];

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!id) {
      const subject = encodeURIComponent(`${data.get("climb")}: ${data.get("name")}`);
      const body = encodeURIComponent(`${data.get("message")}\n\n${data.get("name")}\n${data.get("company")}\n${data.get("email")}`);
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
      return;
    }
    setState("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${id}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="ct-form ct-sent">
        <svg viewBox="0 0 64 52" width="64" height="52" aria-hidden>
          <path d="M2 50 24 12l9 15 7-9 22 32Z" fill="#D98B32" />
          <circle cx="50" cy="8" r="4" fill="#F0C27A" />
        </svg>
        <p>Message received at the summit. I&apos;ll be back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="ct-form">
      <label className="ct-field">
        <span>Name</span>
        <input name="name" required autoComplete="name" className="ct-in" />
      </label>
      <label className="ct-field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" className="ct-in" />
      </label>
      <label className="ct-field ct-full">
        <span>Company</span>
        <input name="company" autoComplete="organization" className="ct-in" />
      </label>
      <fieldset className="ct-field ct-full">
        <legend>What&apos;s the climb?</legend>
        <div className="ct-chips">
          {CLIMBS.map((c, i) => (
            <label key={c}>
              <input type="radio" name="climb" value={c} defaultChecked={i === 0} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="ct-field ct-full ct-grow">
        <span>Message</span>
        <textarea name="message" required rows={5} className="ct-in" />
      </label>
      <div className="ct-full ct-send">
        <button type="submit" disabled={state === "sending"} className="btn btn-sun">
          Send it up the mountain
        </button>
        {state === "error" && (
          <p role="alert">
            That didn&apos;t send. Email me at{" "}
            <a className="underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
