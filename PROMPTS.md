# Prompts to paste into Claude Code, in order

Paste one prompt, let Claude Code finish, check the result in your browser, then move on.
If something looks off, just tell it in plain words ("the headline is too small on my phone") before the next prompt.

Tip: at the start of a new session, Claude Code reads `CLAUDE.md` automatically, so it always knows the concept, colours and rules.

---

## 1. Set up the project

```
Read CLAUDE.md, content/site-copy.md and look at the images in reference/.
Then set up the project: Next.js (App Router) + TypeScript + Tailwind, install GSAP, Lenis, mapbox-gl and @turf/turf, set up the fonts and the design tokens from CLAUDE.md, and create empty routes for all 6 pages plus the 404.
Create .env.local from .env.example and make sure it's git-ignored.
When you're done, tell me how to run it and open it in my browser.
```

## 2. Build the shell (on every page)

```
Build the site-wide parts from CLAUDE.md: the nav with camp labels, the altitude meter, the film-grain overlay, the footer, the sunrise CTA, and Recruiter mode (toggle + the one-page fast summary).
Add Lenis smooth scroll. Make it all work on mobile, and turn animation off when prefers-reduced-motion is on.
```

## 3. Build The Flight (fallback first)

```
Build the Home hero "The Flight" from content/site-copy.md, styled like the screenshots in reference/.
Start with the FALLBACK version only (no Mapbox yet): a scroll-pinned scene with layered stylised mountains, drifting clouds, the Roman numeral + italic chapter titles, the frosted-glass side panel, the bottom HUD with ticking counters, chapter dots, and the "Skip the flight" link, all driven by scroll with GSAP ScrollTrigger.
Each leg must feel faster than the last.
```

## 4. Add the real 3D map to The Flight

Do this after you've made a free Mapbox account and pasted your public token into `.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN=pk....`

```
Now upgrade The Flight to the real Mapbox 3D version described in CLAUDE.md: satellite style, 3D terrain, sky and fog, FreeCamera driven by scroll progress, great-circle path for the long legs, and a glowing route line that draws itself from gold to coral. Add light-beam markers with tag labels at Hòa Bình, Hanoi, Singapore and Melbourne.
Keep the fallback for: no token, no WebGL, screens under 768px, reduced motion, and Recruiter mode.
Lazy-load Mapbox so the page still loads fast.
```

## 5. Finish the Home page

```
Build the rest of the Home page from content/site-copy.md: the hero headline (option A for now), the "Elevation gained" stats strip with count-up numbers, the draggable Hard/Smart split, the 3 featured climb cards, and the closing band.
```

## 6. About page

```
Build the About page from content/site-copy.md. Make "The doubt" section the showpiece: each line types out, pauses, then gets struck through in coral, then the big "#1 globally" reveal. Add the 5 flip cards and the toolkit. Leave clear photo placeholders.
```

## 7. Experience page

```
Build the Experience page from content/site-copy.md as a winding SVG trail that draws itself on scroll, with 7 flags from VinUniversity (bottom) to Crowd Cypher (top). Clicking a flag opens a card with The climb, Elevation and Lesson (lesson in the handwritten font). On mobile, make it a simple vertical timeline.
```

## 8. Projects page

```
Build the Projects page from content/site-copy.md. Each project card has a HARD | SMART toggle that swaps both the content and the styling (graph paper + handwriting for Hard, clean + coral for Smart). Use placeholder images for now.
```

## 9. Awards page

```
Build the Leadership & Awards page from content/site-copy.md. Each award is a flag on its own SVG peak, with peak height based on the number of teams (350+, 200+, 100+, 32+). Tapping or hovering a peak shows the details. Then the leadership trail list.
```

## 10. Contact page and 404

```
Build the Contact page and the 404 page from content/site-copy.md. Phone and email must be tap-to-call / tap-to-email links. Make the form send through Formspree using NEXT_PUBLIC_FORMSPREE_ID from .env.local, and fall back to a mailto link if that isn't set yet.
```

## 11. Polish and check

```
Do a full quality pass using the checklist in CLAUDE.md: run npm run build, test at 375px, 768px and 1440px, check keyboard navigation, alt text, contrast and reduced motion, and make sure Recruiter mode works on every page. Fix anything that fails and give me a list of every [placeholder] still showing on the site.
```

## 12. Put it online

```
Help me put this site online for free with Vercel. Walk me through it step by step, including pushing to GitHub and adding my Mapbox token and Formspree ID as environment variables in Vercel. Remind me to restrict my Mapbox token to my site's URL.
```

---

## Handy follow-up prompts

- `Swap the hero headline to option B.`
- `I added photos to public/images. Put them into the About page photo slots.`
- `Record The Flight: give me steps to screen-record the desktop version and save it as public/video/flight.mp4 so phones get the video version.`
- `Fill in these placeholders: [paste your answers]`
