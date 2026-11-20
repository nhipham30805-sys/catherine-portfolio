// Structured copy from content/site-copy.md. Edit there first, then mirror here.

export const CONTACT = {
  email: "nhipham30805@gmail.com",
  phone: "0451 053 008",
  tel: "tel:+61451053008",
  linkedin: "https://www.linkedin.com/in/catherine-pham-4654a12a9/",
  resume: "/Catherine_Pham_Resume.pdf",
};

export const NAV = [
  { href: "/", name: "Home", camp: "Base Camp" },
  { href: "/about", name: "About", camp: "The Climb" },
  { href: "/experience", name: "Experience", camp: "The Trail" },
  { href: "/education", name: "Education and Certifications", camp: "Training Ground" },
  { href: "/leadership", name: "Leadership & Competitions", camp: "Summit Pushes" },
  { href: "/contact", name: "Contact", camp: "The View" },
];

export const HEADLINE = "Strategy, SEO, AI. Sorted.";
export const SUBHEAD =
  "From marketing internships and sales to account management and digital marketing at BigDigital, I've explored it all with curiosity. Now combining that experience with AI and looking for my next SEO or digital marketing opportunity.";
export const POSITIONING =
  "From the mountains of Hòa Bình to Melbourne's agencies. I work hard, and I work smart.";

// The longer hello, placed after the flight so it can be read properly.
export const INTRO = {
  lead: "I'm probably the most random person you'll ever meet, chasing experiences, embracing the chaos, and refusing to live life halfway.",
  hello: "A final-year Marketing student at RMIT University, exploring the world of digital marketing, client strategy, and AI automation. I'm fascinated by what makes people tick, what makes brands stand out, and how ideas turn into real impact.",
  body: [
    "But here's something about me: my curiosity doesn't stop at work. And sometimes, it takes me to pretty crazy places.",
    "I once challenged myself to live as a homeless person for two days in the middle of Melbourne's winter, simply because I was curious about what life on the streets might feel like. I also love skydiving. Because apparently, where's the fun if your life isn't a little on the line? :)",
    "Different experiences, same mindset: I don't want to just hear about life. I want to experience it, question it, and learn from it.",
    "And that's exactly how I approach marketing.",
    "From managing client accounts and coordinating content shoots to exploring SEO, paid ads, and AI-powered workflows, I've learned that great marketing isn't about getting attention. It's about understanding people, digging deeper, and solving problems that actually matter.",
    "I'm the kind of person who asks too many questions, challenges assumptions, and believes that if something is worth doing, it's worth giving everything I've got.",
    "One quote I live by:",
  ],
  // Lines Catherine wants to stand out inside the bio: shown in gold italic serif, words unchanged.
  keys: [
    "my curiosity doesn't stop at work. And sometimes, it takes me to pretty crazy places.",
    "Different experiences, same mindset: I don't want to just hear about life. I want to experience it, question it, and learn from it.",
  ],
  quote: "Don't just talk about the work. Let your actions do the talking.",
  close: "I'm still learning, experimenting, making mistakes, and figuring things out. But one thing is certain:",
  // The last line, split so the page can build it up: "I don't do things halfway. Whether it's life, learning, or work, I'm all in."
  finale: { lead: "I don't do things halfway.", build: "Whether it's life, learning, or work,", punch: "I'm all in." },
};

export const STATS = [
  { prefix: "+", value: 26, suffix: "", label: "client accounts managed", arrow: true },
  { prefix: "", value: 6, suffix: "×+", label: "return on ad spend (ROAS)", arrow: false },
  { prefix: "+", value: 52, suffix: "", label: "client meetings led a month", arrow: true },
  { prefix: "#", value: 1, suffix: "", label: "of 350+ teams worldwide, Agentic AI Build Week 2026", arrow: false },
  { prefix: "", value: 3, suffix: "", label: "countries worked in: Vietnam, Singapore, Australia", arrow: false },
];

// A sample in a "Show the work" strip. Without an href, video or image it shows as a visible placeholder.
// video is a YouTube id; file is a video hosted on the site (with thumb as its poster).
// embed: a page shown inside the lightbox (e.g. an Instagram post). Google Sheets links get a preview automatically.
// slides: a carousel post, every slide in order (the viewer shows them side by side to swipe through).
// ratio: the slides' shape as a CSS aspect-ratio (default 9 / 16, a story; Instagram feed posts are 4 / 5).
export type Work = { label: string; href?: string; video?: string; file?: string; image?: string; thumb?: string; embed?: string; logo?: string; slides?: string[]; ratio?: string; client?: string };

// Photos pinned to each place in The Flight. A photo without src shows as a visible placeholder.
// focus: which part of the picture to keep when the card crops it (a CSS object-position, e.g. "left center").
// video: a short clip that plays in the card, with src as its poster frame.
export type PlacePhoto = { src?: string; full?: string; alt: string; focus?: string; video?: string };

export const PLACE_PHOTOS: Record<string, PlacePhoto[]> = {
  "Hòa Bình": [
    { src: "/images/hoa-binh/child-2-sm.jpg", full: "/images/hoa-binh/child-2.jpg", alt: "Young Catherine in a green dress making a peace sign at home" },
    { src: "/images/hoa-binh/school-sm.jpg", full: "/images/hoa-binh/school.jpg", alt: "Catherine writing notes at her desk in a busy classroom" },
    { src: "/images/hoa-binh/child-5-sm.jpg", full: "/images/hoa-binh/child-5.jpg", alt: "Young Catherine with a flower tucked behind her ear in a tiled courtyard" },
    { src: "/images/hoa-binh/aiesec-sm.jpg", full: "/images/hoa-binh/aiesec.jpg", alt: "Catherine on an AIESEC Global Volunteer poster as a media ambassador", focus: "center 68%" },
  ],
  Hanoi: [
    { src: "/images/hanoi/vinuni-4-sm.jpg", full: "/images/hanoi/vinuni-4.jpg", alt: "Catherine in a VinUniversity T-shirt and lanyard on campus" },
    { src: "/images/hanoi/vinuni-team-sm.jpg", full: "/images/hanoi/vinuni-team.jpg", alt: "The VinUniversity admissions team gathered around a birthday cake and flowers in the office" },
    { src: "/images/hanoi/vinuni-1-sm.jpg", full: "/images/hanoi/vinuni-1.jpg", alt: "The VinUniversity table at the Summit Global Education Fair, with brochures and bear keychains" },
    { src: "/images/hanoi/vinuni-2-sm.jpg", full: "/images/hanoi/vinuni-2.jpg", alt: "VinUniversity bear keychains and a branded fan laid out for visiting students" },
  ],
  Singapore: [
    { src: "/images/singapore/team-sm.jpg", full: "/images/singapore/team.jpg", alt: "The Singapore team in a working session around a meeting table" },
    { src: "/images/singapore/market-trends-sm.jpg", full: "/images/singapore/market-trends.jpg", alt: "A Market Trends slide from Catherine's Singapore market research", focus: "left center" },
    { src: "/images/singapore/why-singapore-sm.jpg", full: "/images/singapore/why-singapore.jpg", alt: "A slide on why to choose Singapore mutual funds now", focus: "left center" },
    { src: "/images/singapore/award-sm.jpg", full: "/images/singapore/award.jpg", alt: "Wealth & Finance FinTech Awards 2026 announcement for Ascendant Globalcredit Group" },
  ],
  Melbourne: [
    { src: "/images/melbourne/ai-build-week-certificate-sm.jpg", full: "/images/melbourne/ai-build-week-certificate.jpg", alt: "Agentic AI Build Week 2026 certificate of achievement for winning the Founder Mode Track" },
    { src: "/images/melbourne/lapeau-treatment-poster.jpg", video: "/video/melbourne/lapeau-treatment.mp4", alt: "Short treatment video Catherine produced for Lapeau Medi Spa" },
    { src: "/images/melbourne/lapeau-reviews-sm.jpg", full: "/images/melbourne/lapeau-reviews.jpg", alt: "Lapeau Medi Spa social post: I can't believe they said this about us", focus: "left center" },
    { src: "/images/melbourne/femmeline-bra-signs-poster.jpg", video: "/video/melbourne/femmeline-bra-signs.mp4", alt: "Femmeline video: 4 signs you need a new bra", focus: "center 30%" },
    { src: "/images/melbourne/femmeline-grid-sm.jpg", full: "/images/melbourne/femmeline-grid.jpg", alt: "Femmeline's Instagram grid of lingerie posts", focus: "center top" },
  ],
};

export type Role = {
  camp: string;
  org: string;
  role: string;
  meta: string;
  climb?: string;
  elevation?: string;
  hard?: string;
  smart?: string;
  /** "What I did": shown instead of the old Hard/Smart toggle. Falls back to hard + smart joined. */
  did?: string;
  work: Work[];
  lesson?: string;
};

const LATER: Work[] = [{ label: "[Work sample: will insert later]" }];

// Top of the trail first.
export const ROLES: Role[] = [
  {
    camp: "Camp 3",
    org: "Crowd Cypher",
    role: "Client Success and Growth Intern",
    meta: "Melbourne · Sep 2026 to Nov 2026",
    climb: "Shadowed the Head of Strategy in 13+ client meetings a month, learning client discovery, strategic pitching and objection handling.",
    elevation: "13+ client meetings a month, 8 weeks of professional training in SEO, Google Ads, Meta Ads and digital marketing strategy.",
    hard: "8 weeks of professional training in SEO, Google Ads, Meta Ads and digital marketing strategy.",
    smart: "Contributed to SEO and content work that improves organic visibility, while learning discovery and pitching from the Head of Strategy.",
    work: [
      { client: "Art De Dente", label: "Art_De_Dente_Keyword_Implementation_Plan", logo: "/images/crowd-cypher/art-de-dente-logo.png", href: "https://docs.google.com/spreadsheets/d/1wYKSYWIGqoSQmsZlJLd9pyW-4H4LBNBJXDWMjz3sFr8/edit?gid=279418141#gid=279418141" },
      { client: "Art De Dente", label: "Art_De_Dente_Technical-Audit-findings", logo: "/images/crowd-cypher/art-de-dente-logo.png", href: "https://docs.google.com/spreadsheets/d/1gUG5XdrI8tfIiPyUITNZaSUdWRPOj6Wb/edit?gid=879202168#gid=879202168" },
      { client: "CogTek", label: "CogTek - Website Audit", logo: "/images/crowd-cypher/cogtek-logo.png", href: "https://docs.google.com/spreadsheets/d/1IMVxtku2tYVO8hIkleDZ6ZsydTlFZ-Hr/edit?gid=489132100#gid=489132100" },
      { client: "CogTek", label: "CogTek - Onpage Audit", logo: "/images/crowd-cypher/cogtek-logo.png", href: "https://docs.google.com/spreadsheets/d/1b8bvzqvywWK9Ri5TumIg2W2AqekgCV25/edit?gid=1945499734#gid=1945499734" },
      { client: "CogTek", label: "CogTek SEO IA & Content Planner (NEW + Top Priority Keywords)", logo: "/images/crowd-cypher/cogtek-logo.png", href: "https://docs.google.com/spreadsheets/d/1yQwiQLl-Ws_c21ZCSZAIovih_Jh6N6DV/edit?gid=1004648128#gid=1004648128" },
      { client: "Blue Lotus College and AABT College", label: "Blue Lotus College and AABT College: social ads and brand colours", image: "/images/crowd-cypher/colleges/blue-lotus-ad-1.jpg", thumb: "/images/crowd-cypher/colleges/blue-lotus-ad-1-sm.jpg", slides: ["blue-lotus-ad-1", "blue-lotus-ad-2", "blue-lotus-brand-post", "aabt-ad-1", "aabt-ad-2", "aabt-brand-post"].map((n) => `/images/crowd-cypher/colleges/${n}.jpg`), ratio: "4 / 5" },
    ],
    lesson: "Ask better questions and the pitch writes itself.",
  },
  {
    camp: "Camp 3",
    org: "Prace Media",
    role: "Account Manager and Content Creator",
    meta: "Melbourne · Aug 2026 to Oct 2026",
    climb: "Built monthly content calendars and managed 26 client accounts as the link between clients and specialists, running a 7+ specialist team through ClickUp.",
    elevation: "Led 52 client meetings a month, scripted 60+ and filmed 80+ client videos a month, 346K views at 9% engagement on Instagram and Facebook, revisions cut by 75%.",
    hard: "60+ scripts, 80+ videos and 52 client meetings every month.",
    smart: "Moved every client onto clear briefs and a ClickUp workflow, cutting revisions by 75%.",
    work: [
      { client: "Lapeau Medi Spa", label: "Lapeau Medi Spa: reviews post", image: "/images/melbourne/lapeau-reviews/lapeau-reviews-1.jpg", thumb: "/images/melbourne/lapeau-reviews/lapeau-reviews-1-sm.jpg", slides: [1, 3, 4, 5, 6].map((n) => `/images/melbourne/lapeau-reviews/lapeau-reviews-${n}.jpg`) },
      { client: "Lapeau Medi Spa", label: "Lapeau Medi Spa: skin ageing carousel", image: "/images/melbourne/lapeau-reviews/lapeau-ageing-1.jpg", thumb: "/images/melbourne/lapeau-reviews/lapeau-ageing-1-sm.jpg", slides: [1, 2, 3, 4].map((n) => `/images/melbourne/lapeau-reviews/lapeau-ageing-${n}.jpg`) },
      { client: "Lapeau Medi Spa", label: "Lapeau Medi Spa: treatment video", file: "/video/melbourne/lapeau-treatment.mp4", thumb: "/images/melbourne/lapeau-treatment-poster.jpg" },
      { client: "Lapeau Medi Spa", label: "Lapeau Medi Spa: customer testimonial", file: "/video/melbourne/lapeau-testimonial.mp4", thumb: "/images/melbourne/lapeau-testimonial-poster.jpg" },
      { client: "Lapeau Medi Spa", label: "Lapeau Medi Spa: meet Layla", file: "/video/melbourne/lapeau-meet-layla.mp4", thumb: "/images/melbourne/lapeau-meet-layla-poster.jpg" },
      { client: "Lapeau Medi Spa", label: "Lapeau Medi Spa: customer feed", file: "/video/melbourne/lapeau-customer-feed.mp4", thumb: "/images/melbourne/lapeau-customer-feed-poster.jpg" },
      { client: "Lapeau Medi Spa", label: "Lapeau Medi Spa: pigmentation carousel", image: "/images/melbourne/lapeau-reviews/lapeau-pigment-1.jpg", thumb: "/images/melbourne/lapeau-reviews/lapeau-pigment-1-sm.jpg", slides: [1, 2, 3, 4, 5, 6].map((n) => `/images/melbourne/lapeau-reviews/lapeau-pigment-${n}.jpg`) },
      { client: "Femmeline", label: "Femmeline: 4 signs you need a new bra", file: "/video/melbourne/femmeline-bra-signs.mp4", thumb: "/images/melbourne/femmeline-bra-signs-poster.jpg" },
      { client: "Femmeline", label: "Femmeline: bras for a bigger bust", file: "/video/melbourne/femmeline-bigger-bust.mp4", thumb: "/images/melbourne/femmeline-bigger-bust-poster.jpg" },
      { client: "Femmeline", label: "Femmeline: breast prosthesis fittings", file: "/video/melbourne/femmeline-prosthesis.mp4", thumb: "/images/melbourne/femmeline-prosthesis-poster.jpg" },
      { client: "Femmeline", label: "Femmeline: normal vs mastectomy bras", file: "/video/melbourne/femmeline-mastectomy-bra.mp4", thumb: "/images/melbourne/femmeline-mastectomy-bra-poster.jpg" },
      { client: "Femmeline", label: "Femmeline: new arrivals, part 1", image: "/images/melbourne/femmeline-posts/femmeline-arrivals-1-1.jpg", thumb: "/images/melbourne/femmeline-posts/femmeline-arrivals-1-1-sm.jpg", ratio: "4 / 5", slides: [1, 2, 3, 4, 5].map((n) => `/images/melbourne/femmeline-posts/femmeline-arrivals-1-${n}.jpg`) },
      { client: "Femmeline", label: "Femmeline: new arrivals, part 2", image: "/images/melbourne/femmeline-posts/femmeline-arrivals-2-1.jpg", thumb: "/images/melbourne/femmeline-posts/femmeline-arrivals-2-1-sm.jpg", ratio: "4 / 5", slides: [1, 2, 3, 4, 5].map((n) => `/images/melbourne/femmeline-posts/femmeline-arrivals-2-${n}.jpg`) },
      { client: "Femmeline", label: "Femmeline: how to choose a bra that fits", image: "/images/melbourne/femmeline-posts/femmeline-fit-guide-1.jpg", thumb: "/images/melbourne/femmeline-posts/femmeline-fit-guide-1-sm.jpg", ratio: "4 / 5", slides: [1, 2, 3, 4, 5, 6, 7].map((n) => `/images/melbourne/femmeline-posts/femmeline-fit-guide-${n}.jpg`) },
      { client: "Femmeline", label: "[Femmeline: 6 organic posts deck, PDF to come]" },
    ],
    lesson: "Fix the process and the team stops redoing the work. That's smart work.",
  },
  {
    camp: "Camp 3",
    org: "BigDigital",
    role: "Digital Marketing Executive, Website Builder and SEO Optimiser",
    meta: "Melbourne · Aug 2025 to now",
    climb: "Coordinated Meta Ads and SEO delivery across 9+ concurrent client accounts: allocating tasks, tracking progress and signing off completed work.",
    elevation: "Over 6× ROAS, Top 3 Google Search placements, 82% traffic growth, 100% client satisfaction, campaign cost efficiency up 62%.",
    hard: "Quality checks on every ad creative, website page and SEO deliverable before it reached a client.",
    smart: "Used performance analysis and reporting to catch inefficiencies early, improving campaign cost efficiency by 62%. Delivered monthly performance reports to clients.",
    work: [
      { client: "Bayside Blades", label: "Bayside Blades Google Ads Report", image: "/images/melbourne/bayside-blades/bayside-ads-cover.jpg", thumb: "/images/melbourne/bayside-blades/bayside-ads-cover-sm.jpg", slides: [1, 2, 3, 4, 5, 6, 7].map((n) => `/images/melbourne/bayside-blades/bayside-ads-${n}.jpg`), ratio: "12 / 5" },
      { client: "Bayside Blades", label: "Bayside Blades: Google Ads Search campaign", image: "/images/melbourne/bayside-blades/bayside-search-1.jpg", thumb: "/images/melbourne/bayside-blades/bayside-search-cover-sm.jpg", slides: [1, 2, 3].map((n) => `/images/melbourne/bayside-blades/bayside-search-${n}.jpg`), ratio: "16 / 9" },
      { client: "Bayside Blades", label: "Bayside Blades: the website", href: "https://www.baysideblades.com.au/", thumb: "/images/melbourne/bayside-blades/bayside-website-sm.jpg" },
      { client: "Ozeskates", label: "Ozeskates Google Ads Report", image: "/images/melbourne/ozeskates/ozeskates-ads-1.jpg", thumb: "/images/melbourne/ozeskates/ozeskates-ads-cover-sm.jpg", slides: [1, 2, 3, 4, 5, 6, 7].map((n) => `/images/melbourne/ozeskates/ozeskates-ads-${n}.jpg`), ratio: "12 / 5" },
      { client: "Ozeskates", label: "Ozeskates: Google Ads Performance Max campaign", image: "/images/melbourne/ozeskates/ozeskates-pmax-1.jpg", thumb: "/images/melbourne/ozeskates/ozeskates-pmax-cover-sm.jpg", slides: ["/images/melbourne/ozeskates/ozeskates-pmax-1.jpg"], ratio: "16 / 9" },
      { client: "Zeal Refrigeration Group", label: "Zeal Refrigeration Group: local ranking report", href: "https://www.local-marketing-reports.com/location-dashboard/e904a33c34effe90fb1f452cb5909e1a3eb5d169/ranking-reports", thumb: "/images/melbourne/zeal/zeal-local-report-sm.jpg" },
      { client: "Cheap and Best Cleaning", label: "Cheap and Best Cleaning Google Ads Report", image: "/images/melbourne/cheap-best-cleaning/cleaning-ads-1.jpg", thumb: "/images/melbourne/cheap-best-cleaning/cleaning-ads-cover-sm.jpg", slides: [1, 2, 3, 4, 5, 6].map((n) => `/images/melbourne/cheap-best-cleaning/cleaning-ads-${n}.jpg`), ratio: "12 / 5" },
      { client: "Cheap and Best Cleaning", label: "Cheap and Best Cleaning: carpet cleaning Search campaign", image: "/images/melbourne/cheap-best-cleaning/cleaning-carpet-search-1.jpg", thumb: "/images/melbourne/cheap-best-cleaning/cleaning-carpet-search-cover-sm.jpg", slides: ["/images/melbourne/cheap-best-cleaning/cleaning-carpet-search-1.jpg"], ratio: "16 / 9" },
      { client: "Cheap and Best Cleaning", label: "Cheap and Best Cleaning: carpet cleaning ad landing page", href: "https://cheapandbestcleaning.com.au/carpet-cleaning/", thumb: "/images/melbourne/cheap-best-cleaning/cleaning-carpet-page-sm.jpg" },
      { client: "Cheap and Best Cleaning", label: "Cheap and Best Cleaning: end of lease cleaning Search campaign", image: "/images/melbourne/cheap-best-cleaning/cleaning-eolc-1.jpg", thumb: "/images/melbourne/cheap-best-cleaning/cleaning-eolc-cover-sm.jpg", slides: [1, 2, 3].map((n) => `/images/melbourne/cheap-best-cleaning/cleaning-eolc-${n}.jpg`), ratio: "16 / 9" },
      { client: "Cheap and Best Cleaning", label: "Cheap and Best Cleaning: Performance Max campaign", image: "/images/melbourne/cheap-best-cleaning/cleaning-pmax-1.jpg", thumb: "/images/melbourne/cheap-best-cleaning/cleaning-pmax-cover-sm.jpg", slides: ["/images/melbourne/cheap-best-cleaning/cleaning-pmax-1.jpg"], ratio: "16 / 9" },
      { client: "Cheap and Best Cleaning", label: "Cheap and Best Cleaning: end of lease cleaning website", href: "https://endofleasecleaning.cheapandbestcleaning.com.au/", thumb: "/images/melbourne/cheap-best-cleaning/cleaning-eolc-site-sm.jpg" },
      { client: "Cheap and Best Cleaning", label: "Cheap and Best Cleaning: Facebook page", image: "/images/melbourne/cheap-best-cleaning/cleaning-facebook.jpg", thumb: "/images/melbourne/cheap-best-cleaning/cleaning-facebook-sm.jpg" },
      { client: "Solar Beat", label: "Solar Beat: the website", href: "https://solarbeat.com.au/", thumb: "/images/melbourne/solar-beat/solar-beat-website-sm.jpg" },
      { client: "Lockcorp", label: "Lockcorp Google Ads Report", image: "/images/melbourne/lockcorp/lockcorp-ads-1.jpg", thumb: "/images/melbourne/lockcorp/lockcorp-ads-cover-sm.jpg", slides: [1, 2, 3, 4, 5].map((n) => `/images/melbourne/lockcorp/lockcorp-ads-${n}.jpg`), ratio: "12 / 5" },
      { client: "Lockcorp", label: "Lockcorp: Google Ads campaigns", image: "/images/melbourne/lockcorp/lockcorp-campaigns-1.jpg", thumb: "/images/melbourne/lockcorp/lockcorp-campaigns-cover-sm.jpg", slides: [1, 2, 3].map((n) => `/images/melbourne/lockcorp/lockcorp-campaigns-${n}.jpg`), ratio: "16 / 9" },
      { client: "ToBe HealthCare", label: "ToBe HealthCare: Performance Max campaigns", image: "/images/melbourne/tobe/tobe-pmax-1.jpg", thumb: "/images/melbourne/tobe/tobe-pmax-cover-sm.jpg", slides: [1, 2].map((n) => `/images/melbourne/tobe/tobe-pmax-${n}.jpg`), ratio: "16 / 9" },
      { client: "ToBe HealthCare", label: "ToBe HealthCare: the website", href: "https://tobe.com.au/", thumb: "/images/melbourne/tobe/tobe-website-sm.jpg" },
      { client: "24h Melbourne Plumbers", label: "24h Melbourne Plumbers Google Ads Report", image: "/images/melbourne/24h-plumbers/plumbers-ads-1.jpg", thumb: "/images/melbourne/24h-plumbers/plumbers-ads-cover-sm.jpg", slides: [1, 2, 3, 4, 5, 6].map((n) => `/images/melbourne/24h-plumbers/plumbers-ads-${n}.jpg`), ratio: "12 / 5" },
      { client: "24h Melbourne Plumbers", label: "24h Melbourne Plumbers: Google Ads Search campaign", image: "/images/melbourne/24h-plumbers/plumbers-campaign-1.jpg", thumb: "/images/melbourne/24h-plumbers/plumbers-campaign-cover-sm.jpg", slides: ["/images/melbourne/24h-plumbers/plumbers-campaign-1.jpg"], ratio: "16 / 9" },
    ],
    lesson:
      "School taught me marketing theories. Real clients taught me what actually works. Great marketing isn't about having all the answers. It's about asking the right questions, solving real problems, and making things happen.",
  },
  {
    camp: "Camp 3",
    org: "MetBrains",
    role: "Sales and Marketing Intern",
    meta: "Melbourne · Apr to Aug 2026",
    elevation: "20+ new registrations, 17 new partnerships, 8 AI-generated ad and content assets (Gemini Omni, Arcards) reaching a 40K+ combined audience.",
    hard: "One-to-one LinkedIn conversations, from first message to sign-up.",
    smart: "Used AI to produce ad creative and built a call-tracking tool, so outreach could scale without more hours.",
    work: [
      { label: "LinkedIn video: skills first, mindset matters", href: "https://www.linkedin.com/posts/metbrains-inc_metbrains-skillsfirst-mindsetmatters-activity-7463531599947698176-lByr", thumb: "/images/metbrains/skills-first.jpg" },
      { label: "LinkedIn video: the tutorial trap", href: "https://www.linkedin.com/posts/metbrains-inc_most-developers-fall-into-the-same-trap-activity-7464646206468608000-3G50", thumb: "/images/metbrains/tutorial-trap.jpg" },
      { label: "LinkedIn video: Data Analytics course launch", href: "https://www.linkedin.com/posts/metbrains-inc_unlock-the-power-of-data-analytics-activity-7466071206098591744-7066", thumb: "/images/metbrains/data-analytics.jpg" },
      { label: "LinkedIn post: 5-step path to DevOps excellence", href: "https://www.linkedin.com/posts/metbrains-inc_metbrains-devops-cloudengineering-activity-7465636422990065664-JPxP", thumb: "/images/metbrains/devops.jpg" },
      { label: "LinkedIn video: the biggest resume mistake", href: "https://www.linkedin.com/posts/metbrains-inc_the-biggest-resume-mistake-activity-7473704079362469888-RdPG", thumb: "/images/metbrains/resume-mistake.jpg" },
      { label: "LinkedIn video: the unsung heroes of DevOps", href: "https://www.linkedin.com/posts/metbrains-inc_the-unsung-heroes-of-why-didnt-this-app-activity-7472582293027446784-kR4b", thumb: "/images/metbrains/unsung-heroes.jpg" },
      { label: "Call-tracking tool (Google Sheet)", href: "https://docs.google.com/spreadsheets/d/1VN0juBaZXMxohD_zh_hdQuO_eiAlEK6YRZKeIIIDKvM/edit?gid=319031884#gid=319031884" },
    ],
    lesson: "The first time I used AI to do in an hour what used to take a week.",
  },
  {
    camp: "Camp 3",
    org: "RMIT University",
    role: "Peer Mentor, Cryptofinance and Cryptocurrency",
    meta: "Melbourne · Jul 2025 to now",
    elevation: "40+ students coached, 100% pass rate.",
    hard: "40+ students coached through 1:1 sessions and workshops.",
    smart: "Kept every explanation simple enough to repeat back. 40+ students, 100% pass rate.",
    did: "Coached 40+ students through 1:1 sessions and workshops, keeping every explanation simple enough to repeat back.",
    work: [],
    lesson: "If you can explain crypto simply, you can explain anything.",
  },
  {
    camp: "Camp 2",
    org: "Ascendant Global Credit Group",
    role: "Private Wealth Introducer, Marketing Department",
    meta: "Suntec Tower One, Singapore · May to Oct 2025",
    climb: "Engaged 25+ HNWI clients across ASEAN, conducting needs-based conversations to understand financial goals, introduce tailored wealth solutions and support client prospecting. Conducted SEA market research.",
    elevation: "Team accountability up 35% through better tracking and reporting.",
    hard: "25+ high-stakes client conversations.",
    smart: "A tracking and reporting system that lifted team accountability by 35%.",
    work: [
      { label: "Pitch deck: Singapore mutual funds", embed: "/docs/mutual-funds-pitch.pdf", href: "https://lnkd.in/p/gMGytfcT", thumb: "/images/singapore/deck-cover-sm.jpg" },
      { label: "Working session with the team", image: "/images/singapore/team.jpg", thumb: "/images/singapore/team-sm.jpg" },
      { label: "LinkedIn post: the mutual funds pitch", href: "https://lnkd.in/p/gMGytfcT" },
      { label: "My article: hedging ASEAN currency risk", href: "https://www.ascendantglobalcreditgroup.com/insights/hedging-asean-currency-risk-investment-portfolio", thumb: "/images/singapore/hedging-article-sm.jpg" },
      { label: "The company's FinTech Awards (2026) win at Wealth & Finance", image: "/images/singapore/award.jpg", thumb: "/images/singapore/award-tile-sm.jpg" },
    ],
    lesson: "In a bigger room, listening is the strongest thing you can do.",
  },
  {
    camp: "Camp 1",
    org: "VinUniversity",
    role: "Collaborator, International Admissions and Marketing",
    meta: "Hanoi · Jun to Sep 2024",
    elevation: "64 international students enrolled (+47%), 6 events, 3 academic conferences, applicant engagement up 41%.",
    hard: "Planned recruitment strategies enrolling 64 international students (+47%); 6 events, 3 academic conferences and one-to-one guidance for students and families.",
    smart: "Rebuilt the brochures, decks and emails, lifting applicant engagement by 41%.",
    work: [
      { label: "On campus in my VinUniversity shirt", image: "/images/hanoi/vinuni-4.jpg", thumb: "/images/hanoi/vinuni-4-sm.jpg" },
      { label: "Our booth at the Summit Global Education Fair", image: "/images/hanoi/vinuni-3.jpg", thumb: "/images/hanoi/vinuni-3-sm.jpg" },
      { label: "Fair day: brochures and bear keychains", image: "/images/hanoi/vinuni-1.jpg", thumb: "/images/hanoi/vinuni-1-sm.jpg" },
      { label: "The keychains we gave to students", image: "/images/hanoi/vinuni-2.jpg", thumb: "/images/hanoi/vinuni-2-sm.jpg" },
      { label: "The admissions team", image: "/images/hanoi/vinuni-team.jpg", thumb: "/images/hanoi/vinuni-team-sm.jpg" },
    ],
    lesson: "Nobody cares how young you are. Your work speaks for itself. So make damn sure it speaks loudly.",
  },
  {
    camp: "Camp 1",
    org: "@catiez.ph",
    role: "Freelance Content Creator, Threads and Instagram",
    meta: "Hanoi · Apr 2024 to now",
    climb: "Managed the end-to-end content calendar and publishing cadence for my personal channel.",
    elevation: "3.4K followers in 2 months, 36 posts past 10K views and none below 3K.",
    work: [
      { label: "Instagram: leaving home right before Tết", thumb: "/images/catiez/tet.jpg", embed: "https://www.instagram.com/p/DT2vqQsEye5/embed", href: "https://www.instagram.com/p/DT2vqQsEye5/" },
      { label: "Instagram reel: back from the Gold Coast", thumb: "/images/catiez/goldcoast.jpg", embed: "https://www.instagram.com/reel/DVV6vt9k-ax/embed", href: "https://www.instagram.com/reel/DVV6vt9k-ax/" },
      { label: "Threads: 30/4 in Melbourne, 13.5K likes", image: "/images/catiez/april30.jpg", thumb: "/images/catiez/april30.jpg", href: "https://www.threads.com/@catiez.ph/post/DXwgYguFD7e" },
      { label: "Threads: is an RMIT degree worth it?", image: "/images/catiez/rmit.jpg", thumb: "/images/catiez/rmit.jpg", href: "https://www.threads.com/@catiez.ph/post/C8Ua1QgPkbB" },
      { label: "Threads: my biggest trekking struggles, 1.1K likes", image: "/images/catiez/trekking.jpg", thumb: "/images/catiez/trekking.jpg", href: "https://www.threads.com/@catiez.ph/post/DDe1UWoJLGV" },
      { label: "Threads: understand the market is key", image: "/images/catiez/market.jpg", thumb: "/images/catiez/market.jpg", href: "https://www.threads.com/@catiez.ph/post/DJHejYFh6gF" },
      { label: "Threads: a day as an RMIT student", image: "/images/catiez/rmit-day.jpg", thumb: "/images/catiez/rmit-day.jpg", href: "https://www.threads.com/@catiez.ph/post/DCopjeSy0Ag" },
    ],
  },
];

export const DEGREE = {
  name: "Bachelor of Business (Marketing)",
  meta: "RMIT University, Melbourne · Oct 2023 to now",
  courses: "Digital Marketing (MKTG1415), Cryptofinance and Cryptocurrency (FINM2610), [add others]",
  before: "12 years in gifted schools, Hòa Bình [school name, optional]",
};

// Certifications for the running rows on /education. Every title, issuer and date is read off the certificate itself.
export type Cert = { title: string; issuer: string; date?: string; img: string; win?: boolean };
export const CERTS: Cert[][] = [
  [
    { title: "Google Analytics Certification", issuer: "Google", date: "Apr 2026", img: "/images/certs/google-analytics.jpg" },
    { title: "Google Ads Search Certification", issuer: "Google", date: "May 2025", img: "/images/certs/google-ads-search.jpg" },
    { title: "Google Ads Display Certification", issuer: "Google", date: "Apr 2026", img: "/images/certs/google-ads-display.jpg" },
    { title: "SEO Essentials with Semrush", issuer: "Semrush Academy", img: "/images/certs/semrush-seo.jpg" },
    { title: "Introduction to developing AI agents", issuer: "Microsoft Learn", date: "Oct 2026", img: "/images/certs/ms-learn-ai-agents.jpg" },
    { title: "Build secure agents for public sector services", issuer: "Microsoft Learn", date: "Oct 2026", img: "/images/certs/ms-learn-secure-agents.jpg" },
  ],
  [
    { title: "Winner, Founder Mode Track, Agentic AI Build Week", issuer: "GenAI Fund", date: "Jul 2026", img: "/images/certs/agentic-ai-build-week.jpg", win: true },
    { title: "L'Oréal Brandstorm 2026", issuer: "L'Oréal", date: "2026", img: "/images/certs/loreal-brandstorm.jpg" },
    { title: "Top 6, Driving Innovation in Organisations (Starbucks Vietnam project)", issuer: "RMIT University", date: "Semester 1, 2025", img: "/images/certs/rmit-starbucks-top6.jpg", win: true },
    { title: "Outstanding contribution, RMIT Student Club Program", issuer: "RMIT Vietnam", date: "2024 to 2025", img: "/images/certs/rmit-club-program.jpg" },
    { title: "HR Executive, RMIT Innovation and Entrepreneurship Club", issuer: "RMIT University", date: "Semester A, 2025", img: "/images/certs/rmit-iec-hr.jpg" },
    { title: "Microsoft Office Specialist: Word 2016", issuer: "Microsoft", date: "Apr 2022", img: "/images/certs/mos-word.jpg" },
  ],
];

export type Project = {
  title: string;
  meta: string;
  hard: string;
  smart: string;
  idea?: string; // "The idea": what the project set out to do, shown above What I did
  did?: string; // when set, shown as plain "What I did" text instead of the Hard | Smart toggle
  work: Work[];
  result?: string;
  resultNote?: string; // a second win shown under the result
};

export const PROJECTS: Project[] = [
  {
    title: "REA Group: earning trust in AI-driven property",
    meta: "Digital Marketing (MKTG1415) · Group project · Aug 2026",
    idea: "Make people trust AI with the biggest purchase of their lives. Our answer for REA Group was a A$1.29m, six-month plan to build that trust.",
    hard: "I owned the Proposed Implementations section: channel selection, two full implementations, an action plan and measurement framework. Then I integrated, formatted and submitted the whole report.",
    smart: "I wrote a team alignment brief before anyone started writing, so the whole group read as one plan. The headline: a A$1.29m six-month budget built to make people trust AI with the biggest purchase of their lives.",
    did: "I stepped up to lead the team, taking ownership of the proposed strategies, action plan and measurement framework, while pulling the entire report together for submission. I also built the whole high-fidelity prototype of the REA Group website, which put our team among the top performers chosen to pitch to the client.",
    work: [
      { label: "The pitch video", embed: "https://drive.google.com/file/d/1PZR21psyeXyDiNFL9RgWmnyLQ1qG4sZ_/preview", href: "https://drive.google.com/file/d/1PZR21psyeXyDiNFL9RgWmnyLQ1qG4sZ_/view", thumb: "/images/education/rea-pitch-poster.jpg" },
      { label: "The full report (PDF)", embed: "/docs/rea-report.pdf", href: "/docs/rea-report.pdf", thumb: "/images/education/rea-report-cover.jpg" },
      { label: "The working demo", href: "https://claude.ai/artifact/YWjQyenXv3AwtfFB46jUtw#search", thumb: "/images/education/rea-demo.jpg" },
    ],
    result: "86",
  },
  {
    title: "Starbucks Vietnam: winning back the evening",
    meta: "Driving Innovation in Organisations (BUSM4632) · Group project · May 2025",
    idea: "Give young professionals in Hanoi an emotional reason to stay at Starbucks after 5PM. We tested three in-store experiments, each with a survey: a dark-themed evening menu (207 responses), a cup sleeve design activity (133) and soft cushions (307).",
    hard: "Three in-store experiments, each tested with a survey: a dark-themed evening menu (207 responses), a cup sleeve design activity (133) and soft cushions for evening visits (307).",
    smart: "",
    did: "As Marketing Lead, I ran social media and survey outreach for our three experiments and helped develop the strategies.",
    work: [
      { label: "The full proposal (PDF)", embed: "/docs/starbucks-proposal.pdf", href: "/docs/starbucks-proposal.pdf", thumb: "/images/education/starbucks-cover-sm.jpg" },
      { label: "The question we set out to answer", image: "/images/education/starbucks-hmw.jpg", thumb: "/images/education/starbucks-hmw-sm.jpg" },
      { label: "Idea 1: what the survey told us", image: "/images/education/starbucks-findings.jpg", thumb: "/images/education/starbucks-findings-sm.jpg" },
      { label: "Our three ideas, as mockups", image: "/images/education/starbucks-mockups.jpg", thumb: "/images/education/starbucks-mockups-sm.jpg" },
    ],
    result: "Top 6",
  },
  {
    title: "IBM SkillsBuild: industry partner challenge",
    meta: "Integrated Perspectives on Business Problems (BUSM2577) · Group pitch for IBM · Oct 2026",
    idea: "Australian working adults are studying less, and time is the main barrier. Our answer for IBM SkillsBuild: From Zero to Hero, a free pathway for career changers aged 25 to 44. It maps the skills their new career needs, fits 15-minute lessons into the time they have, and keeps them going with a guide and a crew. The goal: 70% learner engagement and 55 to 60% course completion within 12 months.",
    did: "I ran a full PESTLE and stakeholder analysis of the partner's challenge. I proposed the solution and led the SCAMPER ideation, built the prototype, and designed the slides.",
    hard: "Full PESTLE and stakeholder analysis of the partner's challenge.",
    smart: "[the one insight that changed your recommendation]",
    work: [
      { label: "The pitch deck (PDF)", embed: "/docs/ibm-pitch.pdf", href: "/docs/ibm-pitch.pdf", thumb: "/images/education/ibm-solution-sm.jpg" },
      { label: "The pitch video", embed: "https://drive.google.com/file/d/1NViYLJ_a3UNGMafr_L_Y96qfYMhGio4B/preview", href: "https://drive.google.com/file/d/1NViYLJ_a3UNGMafr_L_Y96qfYMhGio4B/view", thumb: "/images/education/ibm-cover.jpg" },
      { label: "The website: From Zero to Hero", href: "https://from-zero-to-hero-one.vercel.app/#how", thumb: "/images/education/ibm-website-sm.jpg" },
      { label: "The digital poster", embed: "https://drive.google.com/file/d/1FR1JKaqs0CNjpVX6bCTP40mVNNuymajj/preview", href: "https://drive.google.com/file/d/1FR1JKaqs0CNjpVX6bCTP40mVNNuymajj/view", thumb: "/images/education/ibm-poster-sm.jpg" },
    ],
    result: "89",
  },
  {
    title: "UMC: a hospital campaign for every generation",
    meta: "Digital Marketing Communication (MTKG1422) · Group IMC campaign · 2024",
    idea: "An IMC campaign for University Medical Center HCMC's 30th anniversary, built around one idea: Medical Care Through Generations. It speaks to mums caring for both their kids and their ageing parents, in three phases: a short film, bus wraps and billboards to trigger; TikTok stories and pop-up health checks to engage; workshops and webinars to amplify. All on a 500 million VND budget.",
    hard: "Built a full IMC campaign for University Medical Center HCMC's 30th anniversary.",
    smart: "One idea, Medical Care Through Generations, carried across three phases and every channel.",
    did: "I researched the company, brainstormed the idea and the insight with the team, and set the objectives. I built the customer insight and segmentation, the budget, and Activity 3: the Pop-Up Health Check Stations.",
    work: [
      { label: "The full campaign (PDF)", embed: "/docs/umc-imc-campaign.pdf", href: "/docs/umc-imc-campaign.pdf", thumb: "/images/education/umc-cover-sm.jpg" },
      { label: "The big idea", image: "/images/education/umc-big-idea.jpg", thumb: "/images/education/umc-big-idea-sm.jpg" },
      { label: "Trigger, engage, amplify", image: "/images/education/umc-roadmap.jpg", thumb: "/images/education/umc-roadmap-sm.jpg" },
      { label: "The bus wrap", image: "/images/education/umc-bus-wrap.jpg", thumb: "/images/education/umc-bus-wrap-sm.jpg" },
    ],
    result: "74",
  },
  {
    title: "#SharedResponsibilities: a social change campaign",
    meta: "Sex, Political, Social Change in Asia (COMM2253) · Social change project · Apr 2026",
    idea: "Close the gender gap in domestic labour among urban Japanese couples. Instead of telling couples the work is unequal, we made them feel it: \"Two Much\" is a simulation game where partners play each other's load.",
    did: "I made the slide decks, Canva designs and presentation scripts for the campaign.",
    hard: "Slide decks, Canva designs and presentation scripts for a campaign tackling the gender gap in domestic labour among urban Japanese couples.",
    smart: "Instead of telling couples the work is unequal, we made them feel it. \"Two Much\" is a simulation game where partners play each other's load.",
    work: [
      { label: "The pitch deck (PDF)", embed: "/docs/shared-responsibilities-pitch.pdf", href: "/docs/shared-responsibilities-pitch.pdf", thumb: "/images/education/shared-cover.jpg" },
      { label: "The social media campaign", image: "/images/education/shared-campaign.jpg", thumb: "/images/education/shared-campaign.jpg" },
      { label: "The game: how \"Two Much\" plays", image: "/images/education/shared-game.jpg", thumb: "/images/education/shared-game.jpg" },
    ],
    result: "87",
  },
  {
    title: "Solana vs Arbitrum: which ecosystem has stronger future potential?",
    meta: "Cryptocurrency and Cryptofinance (BAFI3236) · Group pitch · 16 slides",
    idea: "Which blockchain ecosystem, Solana or Arbitrum, has the stronger future? A 16-slide pitch weighing the two.",
    hard: "Led a three-person team comparing Solana and Arbitrum's future potential. I owned the structure, market research, Canva design and scripts, plus weekly team check-ins.",
    smart: "",
    did: "I led a team of three. I set the deck's structure, theme and Canva designs, drove the market research and scripts, and ran weekly performance check-ins.",
    work: [
      { label: "The pitch deck (PDF)", embed: "/docs/crypto-pitch.pdf", href: "/docs/crypto-pitch.pdf", thumb: "/images/education/crypto-cover.jpg" },
      { label: "Speed and fees, side by side", image: "/images/education/crypto-speed.jpg", thumb: "/images/education/crypto-speed.jpg" },
      { label: "The judgement: why Solana", image: "/images/education/crypto-judgement.jpg", thumb: "/images/education/crypto-judgement.jpg" },
    ],
    result: "83",
    resultNote: "Invited to become Peer Mentor",
  },

  {
    title: "Star Inc.: what makes builders buy window insulation?",
    meta: "Marketing Analytics (MKTG1487) · Individual report · Jun 2026",
    idea: "Find what really makes builders buy window insulation. The answer: not better insulation, but faster installation, so the pitch should lead with speed, not specs.",
    hard: "Ran a conjoint analysis on 20 respondents across 9 product profiles, then a logit choice model in Excel.",
    smart: "Customers didn't pay for better insulation. They paid for faster installation, so the pitch should lead with speed, not specs.",
    did: "My solo report. I built a conjoint analysis in Excel (20 respondents, 9 product profiles, 4 attributes) and a logit choice model that predicted 17 of 20 real choices. I found the jump from $80 to $90 hurts far more than $90 to $100, split buyers into contractors and homeowners, and recommended a $100 one-week-install product with an 89% purchase probability.",
    work: [
      { label: "The full report (PDF)", embed: "/docs/marketing-analytics-a3.pdf", href: "/docs/marketing-analytics-a3.pdf", thumb: "/images/education/analytics-cover-sm.jpg" },
      { label: "What the numbers mean", image: "/images/education/analytics-findings.jpg", thumb: "/images/education/analytics-findings-sm.jpg" },
      { label: "Three buyer segments, three priorities", image: "/images/education/analytics-segments.jpg", thumb: "/images/education/analytics-segments-sm.jpg" },
    ],
    result: "82",
  },
  {
    title: "UNIQLO Australia: leading a multicultural team",
    meta: "Leadership (BUSM4177) · Group pitch · Sep 2026",
    idea: "Learning at UNIQLO Australia flows one way, from Japanese head office down, so new hires' expertise goes unused. We built the return leg: PASS IT ON, two-way mentoring, and the UNIQLO Work Voice Hub, which uses AI to listen to staff ideas, rolled out over 12 months.",
    hard: "UNIQLO Australia runs on strict operating procedures, and learning flows one way, from Japanese head office down to local staff. We mapped two problems: cultural and professional differences, and tight operational control that leaves little room for empowerment.",
    smart: "Instead of more top-down training, we built the return leg. PASS IT ON is two-way mentoring (Exchange Hour, Why Card, Exchange Season), and the UNIQLO Work Voice Hub uses AI to listen, analyse and respond to staff ideas, rolled out over 12 months with the ADKAR change model.",
    did: "I owned the slide design, researched the problem, built the solution foundation and designed Solution 1, PASS IT ON, which pairs people who each hold something the other needs, so both teach and both learn.",
    work: [
      { label: "The pitch deck (PDF)", embed: "/docs/uniqlo-leadership-pitch.pdf", href: "/docs/uniqlo-leadership-pitch.pdf", thumb: "/images/education/uniqlo-pitch-cover-sm.jpg" },
      { label: "Solution 1: PASS IT ON", image: "/images/education/uniqlo-pass-it-on.jpg", thumb: "/images/education/uniqlo-pass-it-on-sm.jpg" },
      { label: "Solution 2: the Work Voice Hub", image: "/images/education/uniqlo-work-voice-hub.jpg", thumb: "/images/education/uniqlo-work-voice-hub-sm.jpg" },
      { label: "The 12-month roll-out plan", image: "/images/education/uniqlo-rollout-plan.jpg", thumb: "/images/education/uniqlo-rollout-plan-sm.jpg" },
    ],
    result: "83",
  },
  {
    title: "TPBank: how a Vietnamese bank went digital-first",
    meta: "Digital Business Development · Individual report · 2024",
    idea: "How did TPBank become one of Vietnam's leading digital banks? The numbers tell the story: 97% of transactions online, and digital customers bringing in 40% of retail banking revenue.",
    hard: "Mapped TPBank's business model, value chain and customer journey across 38 slides.",
    smart: "97% of transactions online, and digital customers bringing in 40% of retail banking revenue.",
    did: "My solo report. I mapped its business model, value chain and customer journey, from 24/7 LiveBank kiosks and eKYC sign-up to ChatPay in its app, then closed with its gaps, like weak pull with Gen Z, and six recommendations.",
    work: [
      { label: "The full report (PDF)", embed: "/docs/tpbank-digital-business.pdf", href: "/docs/tpbank-digital-business.pdf", thumb: "/images/education/tpbank-cover-sm.jpg" },
      { label: "The business model", image: "/images/education/tpbank-business-model.jpg", thumb: "/images/education/tpbank-business-model-sm.jpg" },
      { label: "What going digital achieved", image: "/images/education/tpbank-outcomes.jpg", thumb: "/images/education/tpbank-outcomes-sm.jpg" },
      { label: "Strengths, gaps and recommendations", image: "/images/education/tpbank-recommendations.jpg", thumb: "/images/education/tpbank-evaluation-sm.jpg" },
    ],
    result: "78",
  },
  {
    title: "Carlsberg: why Vietnam picks another beer",
    meta: "Consumer Behaviour Psychology · Group strategy · 2025",
    idea: "Follow Vietnamese beer drinkers through every stage of buying, from the first craving to how they feel after, to find where Carlsberg loses them. Weighed on taste, image, price, availability and packaging, it scored 340 against Heineken's 460. So we planned a year-long, four-phase IMC campaign to grow its market share from 8% to 12%.",
    hard: "Walked Vietnamese beer buyers through all five stages of the decision process.",
    smart: "Scored against its rivals, Carlsberg came last: 340, to Heineken's 460.",
    did: "I built the consumer profile and perceptual map and mapped the customer decision-making process. I analysed Carlsberg's SEO and social media performance, and wrote Phases 3 and 4 of the recommendations.",
    work: [
      { label: "The full strategy (PDF)", embed: "/docs/carlsberg-consumer-behaviour.pdf", href: "/docs/carlsberg-consumer-behaviour.pdf", thumb: "/images/education/carlsberg-cover-sm.jpg" },
      { label: "Who buys, and where Carlsberg sits", image: "/images/education/carlsberg-profile.jpg", thumb: "/images/education/carlsberg-profile-sm.jpg" },
      { label: "How it scores against its rivals", image: "/images/education/carlsberg-scoring.jpg", thumb: "/images/education/carlsberg-scoring-sm.jpg" },
      { label: "The four-phase IMC plan", image: "/images/education/carlsberg-imc.jpg", thumb: "/images/education/carlsberg-imc-sm.jpg" },
    ],
    result: "70",
  },
];

export type Competition = {
  rank: string;
  peakLabel: string;
  teams: number;
  field: string;
  title: string;
  meta: string;
  details: { label: string; text: string }[];
  hard?: string;
  smart?: string;
  /** "What I did": shown instead of the old Hard/Smart toggle. Falls back to hard + smart joined. */
  did?: string;
  work: Work[];
  /** Show the work as a turning wheel of photos instead of a row. */
  ring?: boolean;
  /** Show the work as big tiles stacked one above the other. */
  stack?: boolean;
  callout?: string;
  /** A plain text link shown under the work, e.g. the project post on LinkedIn. */
  link?: { label: string; href: string };
};

// Left-to-right order of the mountain range. Height comes from `teams`.
export const COMPETITIONS: Competition[] = [
  {
    rank: "Top 6 national",
    peakLabel: "Top 6",
    teams: 100,
    field: "100+ teams",
    title: "Starbucks Business Case Competition",
    meta: "RMIT x Starbucks Vietnam · Hanoi · May to Jul 2025 · 100+ teams",
    details: [
      {
        label: "The brief",
        text: "How do we help Starbucks Vietnam tackle: Vietnamese youth choosing local cafés over Starbucks in the evening. Foot traffic dropping after 5PM. Brand disengagement + underutilized resources",
      },
      {
        label: "Our idea",
        text: "We asked: how might we make Starbucks evenings more engaging and welcoming for young professionals (25–34) in central Hanoi, for both work and social life? Our answer was to shift from functional benefits (premium service, quality drinks, brand image) to emotional ones: a place that feels as warm as home, where people feel they belong. It builds on Starbucks' own “Third Place” idea, backed by customer segmentation, surveys, hypotheses and enough frameworks to fill a marketing textbook.",
      },
      {
        label: "Three ideas we tested",
        text: "1. A dark-themed, Vietnamese-language evening menu with insomnia-level indicators, so people pick drinks faster and more confidently by how much caffeine they want. 2. A cup sleeve design activity in the evening, to get strangers talking to each other. 3. Soft cushions for evening visits, so staying longer feels comfortable.",
      },
    ],
    hard: "The past few weeks were the most chaotic yet beautiful stretch of the semester. We ate, slept, planned, argued, and laughed together, survived daily 2–3 hour meetings, fought deadlines coming from every direction, held internal debates that felt like mini TED Talks, and honestly bonded over snacks more than strategy. Looking back, it all feels like a fever dream of uni hustle — but one I'd relive again in a heartbeat.",
    smart: "The biggest lesson? Teamwork. Real, efficient, disciplined teamwork.",
    did: "I managed social media and survey outreach for our experiments, and helped develop the strategies. I researched the market, industry trends and our customers to find the opportunity, shaped the recommendations, and designed the slides.",
    work: [
      { label: "The full proposal (PDF)", embed: "/docs/starbucks-proposal.pdf", href: "/docs/starbucks-proposal.pdf", thumb: "/images/education/starbucks-cover-sm.jpg" },
      { label: "Our three ideas, as mockups", image: "/images/education/starbucks-mockups.jpg", thumb: "/images/education/starbucks-mockups-sm.jpg" },
      { label: "See the deck on Canva", href: "https://canva.link/bwj0ho28ig0bqt1", thumb: "/images/education/starbucks-hmw-sm.jpg" },
    ],
  },
  {
    rank: "Global #1",
    peakLabel: "#1",
    teams: 350,
    field: "350+ teams",
    title: "Founder Mode Track, GenAI Fund Agentic AI Build Week",
    meta: "Jul 2026 · #1 of 350+ teams worldwide",
    details: [
      {
        label: "The project",
        text: "Syncnapse - an AI teammate that joins live meetings, participates in conversations, remembers how decisions are made, turns company knowledge into permanent, governed memory.",
      },
      {
        label: "My role",
        text: "Product/Project Manager — from brainstorming ideas with the tech team and designing pitch decks to presenting ideas, coordinating projects, and making sure everything stays on track.",
      },
    ],
    work: [
      { label: "Certificate of achievement", image: "/images/melbourne/ai-build-week-certificate.jpg", thumb: "/images/melbourne/ai-build-week-certificate-sm.jpg" },
      { label: "Syncnapse: the pitch deck (PDF)", embed: "/docs/syncnapse-pitch.pdf", href: "/docs/syncnapse-pitch.pdf", thumb: "/images/melbourne/syncnapse-deck-sm.jpg" },
      { label: "Syncnapse: the pitch cover", image: "/images/melbourne/syncnapse-cover.jpg", thumb: "/images/melbourne/syncnapse-cover-sm.jpg" },
      { label: "Syncnapse: landing page", image: "/images/melbourne/syncnapse-landing.jpg", thumb: "/images/melbourne/syncnapse-landing-sm.jpg" },
      { label: "Syncnapse: the team dashboard", image: "/images/melbourne/syncnapse-dashboard.jpg", thumb: "/images/melbourne/syncnapse-dashboard-sm.jpg" },
      { label: "Syncnapse: chat with the AI teammate", image: "/images/melbourne/syncnapse.jpg", thumb: "/images/melbourne/syncnapse-sm.jpg" },
      { label: "Syncnapse: departments and access", image: "/images/melbourne/syncnapse-departments.jpg", thumb: "/images/melbourne/syncnapse-departments-sm.jpg" },
      { label: "Syncnapse: an early build on the laptop", image: "/images/melbourne/syncnapse-prototype.jpg", thumb: "/images/melbourne/syncnapse-prototype-sm.jpg" },
      { label: "Syncnapse: sign-in page, live online", image: "/images/melbourne/syncnapse-signin.jpg", thumb: "/images/melbourne/syncnapse-signin-sm.jpg" },
    ],
    ring: true,
    callout: "The girl who thought she wasn't smart enough for AI. #1 in the world.",
  },
  {
    rank: "Top 10",
    peakLabel: "Top 10",
    teams: 32,
    field: "32+ teams",
    title: "Watt the Hack",
    meta: "MLAI's AI Hackathon · Melbourne · May 2026 · 32+ teams",
    details: [
      { label: "The project", text: "SolarCycle AI, a platform tackling Australia's growing solar panel waste." },
      {
        label: "What it does",
        text: "Predicts which panels will fail, optimises recovery routes to cut distance and cost per run, and gives each panel a digital passport for traceability.",
      },
      {
        label: "My role",
        text: "Project Manager — identifying problems, shaping ideas with the tech team, pitching solutions, and keeping projects on track.",
      },
    ],
    work: [
      { label: "Watt the Hack: the event poster", image: "/images/leadership/watt-the-hack-poster.jpg", thumb: "/images/leadership/watt-the-hack-poster-sm.jpg" },
      { label: "SolarCycle AI: the landing page", image: "/images/leadership/solarcycle-hero-day.jpg", thumb: "/images/leadership/solarcycle-hero-day-sm.jpg" },
      { label: "SolarCycle AI: the landing page at night", image: "/images/leadership/solarcycle-hero-night.jpg", thumb: "/images/leadership/solarcycle-hero-night-sm.jpg" },
      { label: "SolarCycle AI: three steps, one story", image: "/images/leadership/solarcycle-walkthrough.jpg", thumb: "/images/leadership/solarcycle-walkthrough-sm.jpg" },
      { label: "SolarCycle AI: what we recover from every panel", image: "/images/leadership/solarcycle-panel.jpg", thumb: "/images/leadership/solarcycle-panel-sm.jpg" },
      { label: "SolarCycle AI: the live route demo", image: "/images/leadership/solarcycle-demo.jpg", thumb: "/images/leadership/solarcycle-demo-sm.jpg" },
    ],
    link: { label: "See the project on LinkedIn", href: "https://lnkd.in/geEiCirx" },
    ring: true,
  },
  {
    rank: "Top 23 national",
    peakLabel: "Top 23",
    teams: 200,
    field: "200+ teams",
    title: "TVCreate Competition",
    stack: true,
    meta: "Hoa Sen University · Ho Chi Minh City · Jul to Oct 2024 · 200+ teams",
    details: [
      { label: "The project", text: "Concepted and produced a TV commercial for Highlands Coffee." },
      { label: "The idea", text: "Gen Z don't just want good coffee. They want a cup that tastes new and looks like them. So we pitched PhinDi as an accessory for your style: \"PhinDi – Tròn vị, trọn chất riêng\" (rounded flavour, all your own style)." },
      { label: "The ad", text: "A 64-second TV commercial in 12 scenes. A girl stuck with the same old coffee walks into a modern Highlands, orders a PhinDi, and swaps her classic áo dài for a modern one." },
      { label: "The plan", text: "The ad sat in the middle of a three-month, three-phase plan: a \"Show PhinDi\" photo minigame for awareness, the TV commercial, then a \"PhinDi Mix & Match\" video contest on TikTok, Facebook and Instagram." },
    ],
    did: "I did the shoots, crafted the storyboard, brainstormed the insight and designed the slides. I also managed our deadlines, prepared materials, and kept in touch with our actors.",
    work: [
      { label: "Highlands Coffee TV commercial", video: "ADFao4CKJh0", href: "https://youtu.be/ADFao4CKJh0", thumb: "/images/leadership/phindi-tvc-sm.jpg" },
      { label: "The IMC plan and pitch deck (PDF)", embed: "/docs/highlands-imc-plan.pdf", href: "/docs/highlands-imc-plan.pdf", thumb: "/images/leadership/imc-plan-cover-sm.jpg" },
    ],
  },
];

// Climbs that didn't end on a podium. Shown under the mountain range on /leadership.
export type NoPrize = { title: string; meta: string; about: string; did: string; work: Work[] };

export const NO_PRIZE: NoPrize[] = [
  {
    title: "Trustlane",
    meta: "Forward: AI in Business Hackathon · Melbourne · 2026",
    about: "An AI warranty coordinator for EV dealers and OEMs. It catches missing evidence while the vehicle is still in the workshop.",
    did: "I researched the market and the industry, and reached out to people working in the space to understand how warranty claims really run. I brought ideas for the product's features, ran QA and UX/UI testing, owned the slide design, and pitched it.",
    work: [
      { label: "Trustlane: the pitch deck (PDF)", embed: "/docs/trustlane.pdf", href: "/docs/trustlane.pdf", thumb: "/images/leadership/trustlane-cover-sm.jpg" },
      { label: "Trustlane: pitch and demo video", file: "/video/trustlane.mp4", thumb: "/images/leadership/trustlane-demo-sm.jpg" },
      { label: "Trustlane: the live website", href: "https://trustlane.house-of-imaginaries.com/", thumb: "/images/leadership/trustlane-site-sm.jpg" },
    ],
  },
  {
    title: "L'Oréal Brandstorm 2026",
    meta: "Emeis for Aesop · L'Oréal Luxe",
    about: "Emeis: a personalised fragrance built from your memories, with an app, an in-store experience and refillable bottles.",
    did: "A bit of everything: market research, social listening, fragrance insights, team coordination, Canva slides, storytelling and filming. Fixed the problems no one claimed. Proudest part? Keeping everyone laughing through the 3am crises.",
    work: [
      { label: "Emeis: problems and opportunity", image: "/images/leadership/loreal-problem.jpg", thumb: "/images/leadership/loreal-problem-sm.jpg" },
      { label: "Emeis: the solution and product features", image: "/images/leadership/loreal-solution.jpg", thumb: "/images/leadership/loreal-solution-sm.jpg" },
      { label: "Emeis: impact, pricing and roll-out", image: "/images/leadership/loreal-impact.jpg", thumb: "/images/leadership/loreal-impact-sm.jpg" },
    ],
  },
];

export const LEADERSHIP = {
  role: "RMIT Innovation and Entrepreneurship Club",
  meta: "Hanoi · Oct 2023 to Jul 2025",
  detail: "60–80 members in total, 20 more members recruited each semester, 4 main events each semester",
  work: [
    { label: "Certificate of participation", image: "/images/leadership/iec-participation.jpg", thumb: "/images/leadership/iec-participation-sm.jpg" },
    { label: "Certificate of recognition", image: "/images/leadership/iec-recognition.jpg", thumb: "/images/leadership/iec-recognition-sm.jpg" },
    { label: "From Chaos to Crown", image: "/images/leadership/iec-chaos-to-crown.jpg", thumb: "/images/leadership/iec-chaos-to-crown-sm.jpg" },
    { label: "The club, flag and all", image: "/images/leadership/iec-club-of-the-year.jpg", thumb: "/images/leadership/iec-club-of-the-year-sm.jpg" },
    { label: "Halloween shoot", image: "/images/leadership/iec-halloween.jpg", thumb: "/images/leadership/iec-halloween-sm.jpg" },
    { label: "Behind the group photo", image: "/images/leadership/iec-selfie.jpg", thumb: "/images/leadership/iec-selfie-sm.jpg" },
  ] as Work[],
};
