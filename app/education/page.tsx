import type { Metadata } from "next";
import CertMarquee from "@/components/CertMarquee";
import EducationHero from "@/components/EducationHero";
import ProjectStack from "@/components/ProjectStack";
import SunriseCTA from "@/components/SunriseCTA";
import WorkStrip from "@/components/WorkStrip";
import { CERTS, PROJECTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Education and Certifications | Catherine Pham",
  description: "Bachelor of Business (Marketing) at RMIT, with the strategy, campaign and data projects behind it.",
};

// The latest posts on the blog (copied from the live site, Nov 2026). Update when new ones go up.
const BLOG_POSTS = [
  { title: "How Meta's chatbot became its best ad targeting tool", date: "27 Sep 2026", href: "https://cath-blog.house-of-imaginaries.com/2026/09/27/how-metas-chatbot-became-its-best-ad-targeting-tool-what-changed-in-australia-in-december-2025/" },
  { title: "Is it still search advertising if nobody searched?", date: "13 Sep 2026", href: "https://cath-blog.house-of-imaginaries.com/2026/09/13/is-it-still-search-advertising-if-nobody-searched/" },
  { title: "Is it still a recommendation when your name is on the can?", date: "6 Sep 2026", href: "https://cath-blog.house-of-imaginaries.com/2026/09/06/is-it-still-a-recommendation-when-your-name-is-on-the-can/" },
];

export default function Education() {
  return (
    <>
      <EducationHero />

      <section aria-labelledby="projects" className="wrap pt-24 md:pt-32">
        <h2 id="projects" className="display text-4xl md:text-6xl">
          University projects
        </h2>
        <div className="mt-10">
          <ProjectStack projects={PROJECTS} />
        </div>
      </section>

      <section aria-labelledby="public" className="blog-band mt-24 md:mt-32">
        <div className="wrap blog-grid">
          <a href="https://cath-blog.house-of-imaginaries.com" target="_blank" rel="noopener noreferrer" className="blog-frame" aria-label="Open Catherine's blog (opens in a new tab)">
            <span className="blog-bar" aria-hidden>
              <i /><i /><i />
              <span className="blog-url">cath-blog.house-of-imaginaries.com</span>
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/education/blog-home.jpg" alt="The home page of Catherine's blog" width={1440} height={600} loading="lazy" />
          </a>
          <div>
            <p className="blog-kicker">Written on Sunday mornings</p>
            <h2 id="public" className="display mt-3 text-5xl md:text-7xl">
              Learning in public
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg text-paper/85">Weekly marketing blogs unpacking theory with real brand campaigns.</p>
            <ul className="blog-posts mt-8">
              {BLOG_POSTS.map((b) => (
                <li key={b.href}>
                  <a href={b.href} target="_blank" rel="noopener noreferrer">
                    <span className="blog-post-title">{b.title}</span>
                    <span className="blog-post-date">{b.date}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a href="https://cath-blog.house-of-imaginaries.com" target="_blank" rel="noopener noreferrer" className="btn btn-sun mt-8">
              Read the blog ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="certs" className="pt-24 md:pt-32">
        <div className="wrap">
          <h2 id="certs" className="display text-4xl md:text-6xl">
            Certifications
          </h2>
        </div>
        <div className="mt-10">
          <CertMarquee rows={CERTS} />
        </div>
      </section>

      <SunriseCTA />
    </>
  );
}
