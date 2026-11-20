import type { Metadata } from "next";
import ExperienceHero from "@/components/ExperienceHero";
import SunriseCTA from "@/components/SunriseCTA";
import Trail from "@/components/Trail";

export const metadata: Metadata = {
  title: "Experience and Work | Catherine Pham",
  description:
    "Agency, client success, sales and admissions roles across Vietnam, Singapore and Australia, with the real work behind each one.",
};

export default function Experience() {
  return (
    <>
      <ExperienceHero />
      <section>
        <Trail />
      </section>
      <SunriseCTA />
    </>
  );
}
