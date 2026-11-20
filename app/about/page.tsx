import type { Metadata } from "next";
import PortraitReveal, { type RevealAnchor } from "@/components/PortraitReveal";

// The point between Catherine's eyes in each photo. The festival photo is drawn 1.12× and its face sits a little
// above the harbour face (440 instead of 492), as Catherine asked: bigger and a bit higher.
// baseY matches the portrait's CSS object-position (center 64%).
const ANCHOR: RevealAnchor = { base: [517, 440], reveal: [614, 588], scale: 1.12, baseY: 0.64 };
import Reveal from "@/components/Reveal";
import { TheDoubt } from "@/components/ScrollBits";
import SkillMap from "@/components/SkillMap";
import SunriseCTA from "@/components/SunriseCTA";
import TraitCards from "@/components/TraitCards";
import { INTRO } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Catherine Pham | From Hòa Bình to Melbourne",
  description:
    "A gifted-school nerd from a mountain city in Vietnam who learned to work smart, and kept climbing to bigger markets.",
};


// Wraps Catherine's key lines (INTRO.keys) in a gold italic span; the rest of the sentence stays as it is.
function highlight(text: string) {
  const key = INTRO.keys.find((k) => text.includes(k));
  if (!key) return text;
  const at = text.indexOf(key);
  return (
    <>
      {text.slice(0, at)}
      <em className="key-line">{key}</em>
      {text.slice(at + key.length)}
    </>
  );
}

export default function About() {
  return (
    <>
      <section aria-labelledby="hello" className="pb-24 pt-32 md:pb-40 md:pt-44">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h1 id="hello" className="display text-5xl md:text-7xl">
              Hey, I&apos;m Catherine!
            </h1>
            {/* Her photo, with the line she lives by set over it like a caption. */}
            <figure className="about-portrait mt-8">
              <PortraitReveal
                base="/images/catherine-about.jpg"
                reveal="/images/catherine-reveal.jpg"
                alt="Catherine by Sydney Harbour, the Harbour Bridge behind her"
                width={999}
                height={1500}
                anchor={ANCHOR}
              />
              <figcaption>
                <blockquote>&ldquo;{INTRO.lead}&rdquo;</blockquote>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal className="space-y-5 text-lg lg:col-span-6 lg:col-start-7" delay={90}>
            <p>{INTRO.hello}</p>
            {INTRO.body.slice(0, -1).map((t) => (
              <p key={t.slice(0, 24)}>{highlight(t)}</p>
            ))}
          </Reveal>
        </div>

        {/* Second row: the quote and the finale on the left, the park photo on the right. */}
        <div className="wrap mt-16 grid items-center gap-12 md:mt-24 lg:grid-cols-12">
          <Reveal className="space-y-5 text-lg lg:col-span-6">
            <p>{INTRO.body[INTRO.body.length - 1]}</p>
            <blockquote className="py-4 font-serif text-3xl italic leading-tight text-gold md:text-4xl">
              &ldquo;{INTRO.quote}&rdquo;
            </blockquote>
            <p>{INTRO.close}</p>
            {/* The bio's last word: it builds line by line and lands on "I'm all in." */}
            <Reveal className="finale">
              <p>
                <span className="finale-lead">{INTRO.finale.lead}</span>{" "}
                <span className="finale-build">{INTRO.finale.build}</span>{" "}
                <span className="finale-punch">{INTRO.finale.punch}</span>
              </p>
            </Reveal>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={90}>
            <figure className="about-portrait about-park lg:ml-auto">
              <img
                src="/images/catherine-park.jpg"
                alt="Catherine crouched on the grass in a park, pulling a playful face under a clear blue sky"
                width={1000}
                height={1500}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Reveal>
        </div>
      </section>

      <TheDoubt />

      <section className="wrap py-24 md:py-40">
        <h2 className="display text-5xl md:text-7xl">What the mountains gave me</h2>
        <div className="mt-12">
          <TraitCards />
        </div>
      </section>

      <section className="skillmap-section bg-night-2 py-24 md:py-36">
        <div className="wrap">
          <p className="label">Toolkit</p>
          <h2 className="display mt-4 text-5xl md:text-8xl">
            What I bring <span className="text-gold">and where I earned it</span>
          </h2>
          <div className="mt-14 md:mt-20">
            <SkillMap />
          </div>
        </div>
      </section>

      <SunriseCTA />
    </>
  );
}
