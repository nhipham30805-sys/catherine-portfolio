# Start here — Catherine's portfolio starter kit

This folder is everything Claude Code needs to build your "The Climb" portfolio site.

## What's inside

| File / folder | What it is |
| --- | --- |
| `CLAUDE.md` | The project brief. Claude Code reads it automatically every session: concept, colours, fonts, tech, rules. |
| `PROMPTS.md` | 12 prompts to paste into Claude Code, one at a time, in order. |
| `content/site-copy.md` | Every word on the site. Edit copy here, then ask Claude Code to update the page. |
| `reference/` | Screenshots of the Everest flythrough site you liked, so Claude Code can match the style. |
| `TODO.md` | Facts and photos only you can supply. |
| `public/images/`, `public/video/` | Where your photos, resume PDF and flight video go. |
| `.env.example` | Template for your secret keys (Mapbox, Formspree). |

## How to start (about 10 minutes)

1. Unzip this folder somewhere easy, e.g. `Documents/catherine-portfolio`.
2. Make sure you have **Node.js** (LTS version, from nodejs.org) and **Claude Code** installed.
3. Open Terminal, go into the folder, and start Claude Code:
   ```
   cd ~/Documents/catherine-portfolio
   claude
   ```
4. Open `PROMPTS.md`, copy **Prompt 1**, paste it in, press Enter.
5. When it's done, follow its instructions to open the site (usually `npm run dev`, then http://localhost:3000).
6. Keep going prompt by prompt.

## Before Prompt 4 (the real 3D map)

- Make a free account at mapbox.com, copy your **default public token** (starts with `pk.`).
- Paste it into `.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxx`.
- Until then, the site shows a stylised mountain version of the flight, so nothing is blocked.

## Good habits

- One prompt at a time. Check the result before moving on.
- If something breaks, paste the error message to Claude Code and say "fix this".
- Ask it to `commit this` with git after each page works, so you can always go back.
