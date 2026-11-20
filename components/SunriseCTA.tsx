import Link from "next/link";
import { CONTACT } from "@/lib/content";

// Every page ends here: a band in sunrise colours (ember to gold) with dark ridges along its foot, the small
// aside, the big line, "Let's talk" and the email. Hovering the band lifts the far ridge a little.
export default function SunriseCTA() {
  return (
    <section className="wrap pb-16 pt-[clamp(64px,10vw,120px)] md:pb-24">
      <div className="sunband">
        <p className="sunband-aside">Unserious personality.</p>
        <p className="sunband-big">Seriously driven.</p>
        <div className="sunband-row">
          <Link href="/contact#contact-form" className="btn sunband-btn">
            Let&apos;s talk
            <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden>
              <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" fill="none" />
            </svg>
          </Link>
          <a href={`mailto:${CONTACT.email}`} className="sunband-mail">
            {CONTACT.email}
          </a>
        </div>
        <div className="sunband-ridge" aria-hidden>
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path className="sunband-far" d="M0 200V120l130-60 100 50 150-90 120 70 110-40 160 80 120-50 140 60 170-100 110 70 160-40 170 60v70Z" fill="#5C3A24" opacity=".55" />
            <path d="M0 200v-50l180-40 160 30 200-60 170 50 140-20 200 40 180-35 200 30 10 0v55Z" fill="#3B2A22" />
            <path d="M0 200v-20l260-14 260 10 280-18 240 12 260-8 140 8v30Z" fill="#0E1216" />
          </svg>
        </div>
      </div>
    </section>
  );
}
