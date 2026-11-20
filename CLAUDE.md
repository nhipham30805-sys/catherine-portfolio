# CLAUDE.md — Catherine Pham Portfolio ("The Climb")

You are building a 6-page personal portfolio website for **Catherine Pham**, a marketer in Melbourne, Australia, applying for graduate and junior marketing roles at agencies and big brands. The owner is not a developer: explain what you did in plain English after each task, keep changes small, and tell her exactly how to see the result (e.g. "run `npm run dev` and open http://localhost:3000").

## Source of truth

- **All words on the site come from `content/site-copy.md`.** Never invent stats, job titles, dates, awards or quotes. If copy is missing, use the `[bracketed placeholder]` from that file as-is and list it in your summary.
- Text in square brackets like `[LinkedIn URL]` is a placeholder Catherine will fill in later. Render it visibly (e.g. a dashed outline) so she can spot it, never hide it.
- Copy notes such as "Interaction:", "Layout:", "Small label:", "SEO title:" are instructions for you, not text to display.
- Australian English spelling (organise, colour, optimise). Currency A$.
- `reference/` holds screenshots of the inspiration site (a scroll-driven 3D Everest flight). Look at them before building The Flight.
- `TODO.md` lists facts Catherine still needs to supply. Do not resolve them yourself.

## Concept (read before every page)

- **Big idea:** the site is a mountain climb. Each move to a bigger market is a higher camp:
  Base Camp = Hòa Bình (Vietnam) → Camp 1 = Hanoi → Camp 2 = Singapore → Camp 3 = Melbourne → Summit = "Not yet" (she's still climbing).
- **Recurring theme:** "work hard vs work smart". She grew up being told hard work is enough; she learned you also need to work smart.
- **Voice:** bold, short sentences, first person, confident not cocky. Climbing words (camp, trail, summit, view) at most once per section.
- **Audience:** recruiters and hiring managers at agencies and large companies. They are busy and often on mobile.

## Tech stack (use exactly this unless Catherine agrees to change)

- **Next.js (App Router) + TypeScript + Tailwind CSS**, deployed to **Vercel**.
- **GSAP + ScrollTrigger** for scroll animation, **Lenis** for smooth scroll.
- **Mapbox GL JS** (satellite-streets style, 3D terrain via `mapbox-dem`, sky layer, FreeCamera API) for The Flight hero.
- Fonts via `next/font/google`: display = **Anton** (or Bebas Neue), body = **Inter**, chapter titles, notes and lessons = **Fraunces** (often italic). Catherine tried Anton for The Flight chapters and preferred a serif; she later swapped Cormorant Garamond for Fraunces because Cormorant clashed with Anton. Never use a handwriting font (Catherine asked for none).
- No paid services. No CMS. No database. The contact form uses **Formspree** (free) or a `mailto:` fallback until she has an endpoint.

## Design tokens (Golden Peak palette only, no other colours)

```
Deep night  #0E1216  page background          (--color-night)
Midnight    #161B21  raised surfaces          (--color-night-2)
Dusk navy   #222A32  Slate sky #2E3740  Storm slate #3E4852  Blue mist #4F5A64
Fog grey    #7A848D  secondary text           (--color-muted)
Shadow ridge #3B2A22  Umber #5C3A24  Burnt copper #8A4A1F  Ember #B5682A
Golden hour #D98B32  ONLY for wins: big numbers, awards, CTAs (--color-sunrise)
Sunlit gold #F0C27A  labels, route line start (--color-gold)
Pale honey  #F7DDA8  Snow glow #F3EBDD main text (--color-paper)
```
- Light film-grain overlay over everything (CSS noise, ~4% opacity).
- "Hard" moments use a faint graph-paper grid and italic serif notes; "Smart" moments are clean Snow glow panels.
- Small labels: uppercase, letter-spacing 0.2em, 11–12px.
- Tabs everywhere use components/Tabs.tsx (sliding thumb, Impeccable-style).

## Site structure

| Route | Page | Camp label |
| --- | --- | --- |
| `/` | Home (starts with The Flight) | Base Camp |
| `/about` | About | The Climb |
| `/experience` | Experience | The Trail |
| `/education` | Education and Certifications | Training Ground |
| `/leadership` | Leadership & Competitions | Summit Pushes |
| `/contact` | Contact | The View |
| 404 | "You've wandered off the trail." | — |

`/projects` and `/awards` redirect to `/education` and `/leadership`.

The desktop nav shows page names only. Camp labels appear in the phone menu, under each page name.

## Site-wide components

1. **Altitude meter** — fixed slim vertical bar on the right edge. A marker climbs through Base Camp, Camp 1, Camp 2, Camp 3 as the page scrolls, stopping below a flag labelled "Summit: Not yet". Hidden on mobile (<768px).
2. **Recruiter mode** — a slim glass button at the bottom centre of every page (except The Trail), plus a button in the phone menu. Both are plain links to `/experience`. It no longer switches any animation off (Catherine wants the Flight and every climb animation always on); only the visitor's own reduced-motion setting does that.
3. **Sign-off** (components/SunriseCTA.tsx) — every page ends with "Unserious personality." / big "Seriously driven." and the button "Let's talk →" → `/contact#contact-form`. Catherine swapped this in for "Let's climb together".
4. **Footer** — name, Melbourne VIC, LinkedIn, email, phone (as `tel:+61451053008`)
5. **Resume download** — links to `/public/Catherine_Pham_Resume.pdf` (Catherine adds the file).

## The Flight (signature hero on Home)

A scroll-pinned, scroll-scrubbed 3D flight over real terrain, styled after `reference/`. Full spec is in `content/site-copy.md` → "Signature hero: The Flight". Key rules:

- Waypoints: Hòa Bình `[105.34, 20.81]` → Hanoi `[105.85, 21.03]` → Singapore Marina Bay `[103.86, 1.28]` → Melbourne CBD `[144.96, -37.81]` (Mapbox order is `[lng, lat]`).
- **Each leg is faster than the last** (slow hover over Hòa Bình's mountains, quick hop to Hanoi, fast to Singapore, fastest long arc to Melbourne, soft landing at sunrise). Scroll budget ~ 30% / 10% / 25% / 25% / 10%.
- Pin the section for roughly 400vh of scroll. Interpolate camera position, altitude, pitch and bearing from scroll progress with GSAP ScrollTrigger and Mapbox `FreeCameraOptions`. Use great-circle interpolation (e.g. `@turf/great-circle` or `@turf/along`) for long legs.
- Overlays (HTML, above the map): big thin Roman numeral + Fraunces italic chapter title, frosted-glass left panel with chapter text, bottom HUD (LOCATION · DISTANCE TRAVELLED · YEARS · CLIENTS · RANK) with counters that tick, chapter dots on the right, drifting cloud PNG/CSS layers, a glowing route line (`line-gradient`, gold → coral) drawn progressively, and small vertical light-beam markers at each camp.
- Light/sky shifts across the flight: blue dawn → dusk over Singapore → sunrise over Melbourne (Mapbox `sky` layer + `setFog`).
- Always-visible "Skip the flight →" link that scrolls past the section.
- **Fallbacks are mandatory:** if there is no `NEXT_PUBLIC_MAPBOX_TOKEN`, WebGL fails, the screen is <768px, or `prefers-reduced-motion` is on, render the fallback instead: a scroll-scrubbed video at `/public/video/flight.mp4` if it exists, otherwise a static stylised layered-mountain scene with the same chapter overlays. The site must never show a blank hero.
- Lazy-load Mapbox (`next/dynamic`, `ssr: false`).

## Quality bar (check before saying a task is done)

- `npm run build` passes with no errors.
- Works at 375px, 768px and 1440px widths with no horizontal scroll.
- Lighthouse accessibility ≥ 90; text contrast AA; every image has alt text; everything works with keyboard.
- `prefers-reduced-motion` turns animations off.
- No secrets committed: the Mapbox token lives only in `.env.local` (git-ignored).
- After each task, tell Catherine: what changed, how to view it, and any placeholders still showing.
