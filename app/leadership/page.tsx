import type { Metadata } from "next";
import Peaks from "@/components/Peaks";
import SunriseCTA from "@/components/SunriseCTA";
import WorkStrip from "@/components/WorkStrip";
import { LEADERSHIP } from "@/lib/content";

export const metadata: Metadata = {
  title: "Leadership and Competitions | Catherine Pham",
  description:
    "Global #1 at an Agentic AI Build Week, national business case finalist, hackathon top 10 and student leader, with the projects behind each result.",
};

export default function Leadership() {
  return (
    <>
      <section className="wrap pb-10 pt-32 md:pt-44">
        <p className="label">Summit Pushes</p>
        <h1 className="display mt-4 max-w-4xl text-5xl md:text-7xl">Every competition was a summit push.</h1>
        <p className="mt-6 max-w-xl text-lg">
          I never imagined I would make it this far.
        </p>
      </section>
      <section aria-label="Competitions" className="wrap">
        <Peaks />
      </section>
      <section aria-labelledby="trail" className="wrap pt-24 md:pt-32">
        <h2 id="trail" className="display text-4xl md:text-6xl">
          Leadership trail
        </h2>
        {/* Same two-column shape as the competition panel above. */}
        <div className="pk-panel mt-8">
          <div className="pk-text">
            <p className="pk-result display">Head of HR</p>
            <h3 className="pk-title display">{LEADERSHIP.role}</h3>
            <p className="pk-meta">{LEADERSHIP.meta}</p>
            <p className="mt-5 text-lg">{LEADERSHIP.detail}</p>
          </div>
          <div className="min-w-0">
            <WorkStrip items={LEADERSHIP.work} lead />
          </div>
        </div>
      </section>
      <SunriseCTA />
    </>
  );
}
