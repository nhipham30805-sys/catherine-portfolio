import type { Metadata } from "next";
import { Anton, Fraunces, Inter } from "next/font/google";
import "./globals.css";
import AltitudeMeter from "@/components/AltitudeMeter";
import ContourBackground from "@/components/ContourBackground";
import Footer from "@/components/Footer";
import HeadTorch from "@/components/HeadTorch";
import Nav from "@/components/Nav";
import PageWipe from "@/components/PageWipe";
import { RecruiterPill, RecruiterProvider } from "@/components/Recruiter";
import SmoothScroll from "@/components/SmoothScroll";

const anton = Anton({ weight: "400", subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-inter" });
// Fraunces: the voice font for quotes, lessons and Flight chapter titles. Variable, with optical sizing for big type.
const fraunces = Fraunces({
  style: ["normal", "italic"],
  axes: ["opsz"],
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Catherine Pham | Marketing, Content and Client Growth | Melbourne",
  description:
    "From Hòa Bình to Melbourne. Marketer managing 26 client accounts, 346K+ video views, and global #1 at an Agentic AI Build Week.",
};

// Runs before paint so Recruiter mode is on from the first frame. A ?recruiter=1 link to the home page lands on The Trail.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');d.removeAttribute('data-recruiter');try{localStorage.removeItem('recruiter')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-AU"
      suppressHydrationWarning
      className={`${anton.variable} ${inter.variable} ${fraunces.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <ContourBackground />
        <RecruiterProvider>
          <a
            href="#main"
            className="btn btn-sun fixed left-4 top-4 z-[70] -translate-y-24 focus:translate-y-0"
          >
            Skip to content
          </a>
          <Nav />
          <SmoothScroll />
          <AltitudeMeter />
          <main id="main">{children}</main>
          <Footer />
          <RecruiterPill />
        </RecruiterProvider>
        <PageWipe />
        <HeadTorch />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
