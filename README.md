# La Basil — cinematic botanical website

An Arabic, right-to-left site using La Basil's supplied identity. Five scroll-controlled films lead into La Basil's own floral installation, services, and a WhatsApp enquiry composer.

## Run locally

Requires Node.js 22.12+ (tested on 24.19), pnpm 11+, and network access for the initial package and licensed media downloads.

```sh
pnpm install
pnpm media:setup
pnpm dev
```

Open the localhost URL printed by Vite. For a release build:

```sh
pnpm build
pnpm preview
```

The release output is `dist/`. Serve it over HTTP; opening `index.html` with `file://` will not load the module app correctly. The default base path is `/labasil/` for GitHub Pages. Set `SITE_BASE=/` when deploying at an origin root. No server, API keys, or environment secrets are required.

## Media setup and rights

The five runtime MP4s and extracted poster JPEGs are deliberately excluded from Git. Website use is covered by the Mixkit Free License; independent redistribution of source footage in a public code repository was not established. `pnpm media:setup` downloads only the five individually reviewed files, verifies their SHA-256 checksums, and creates optimized local films and posters. Provider access failures stop setup; use the original item page recorded in `ASSETS.json`, never an access-control workaround.

FFmpeg and FFprobe are project-local packages. FFmpeg's install step needs permission from the package manager to run its standard download script. If the binary is missing after install, run `node node_modules/ffmpeg-static/install.js`. Media preparation uses H.264, yuv420p, no sound, 1280x720, 24 fps, every frame an I-frame, no B-frames, and fast-start metadata. Source frame rates are preserved approximately; frames are not interpolated.

Read `ASSET-LICENSES.md`, `FOOTAGE-MAP.md`, `RESEARCH.md`, and `MEDIA-REPORT.json` for provenance, creative rationale, trims, cues, and encoding evidence. The website's first five films are licensed mood imagery, not a claim that these are La Basil client projects. The installation in the work section comes from the supplied preview.

## Controls

- Scroll forward or backward through the narrative. Videos stay paused and seek to exact frame targets.
- Chapter links jump to a section; services expand with mouse, touch, or keyboard.
- Mobile and desktop both retain reversible video seeking, the opening flower, and botanical particles. Mobile uses fewer particles and adapted framing.
- Reduced-motion preference shows posters, disables video seeking/particles, and removes extended pinned distances.
- Add `?demo=1` to the URL. Space starts/pauses; R resets. Wheel/touch pauses. The central `CONFIG.demoSeconds` value in `src/main.js` defaults to 15 seconds.
- The enquiry form creates a WhatsApp link using the number in the reference preview. It does not send a message or claim a booking. The visitor reviews and sends the message in WhatsApp. No enquiry data is saved by this site.

## Brand and content

La Basil's original green/gold logo and botanical emblem are retained as supplied. The header crops only their surrounding empty space using CSS. The original desktop HTML and synced project references were not modified. Contact information follows the supplied preview; verify business details before connecting the site to a public commercial domain.

Google Fonts provides Amiri and Tajawal; system serif/sans-serif fonts are fallbacks. The site contains no tracking scripts.

## Delivery and verification

See `QA.md` for actual browser checks and limitations. The GitHub repository contains source, brand assets, licence records, and the repeatable download/encoding setup. The local release folder also contains the prepared films and posters.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` installs dependencies, downloads and prepares the licensed media, builds the site, and deploys `dist/` to GitHub Pages. In Settings → Pages, select **GitHub Actions** as the source. Future pushes to `main` redeploy automatically. The site address is `https://mustafa963b.github.io/labasil/`. No paid hosting or additional domain is required.
