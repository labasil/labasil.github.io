# Footage and scroll map

All five selected sources are 1920×1080 (16:9), H.264, approximately 24 fps, with no audio. Final masters are 1280×720 at 24 fps, all-I-frame H.264 with fast-start metadata, yuv420p, and no audio. Full probes and input/output bitrates are in MEDIA-REPORT.json. Source URLs, creators and 16 candidate records are in ASSETS.json.

Each scene uses a tall outer section and a separate sticky 100svh stage. Progress 0–0.09 holds the first frame; 0.09–0.90 scrubs; 0.90–1 holds the final metadata-derived frame. The stage then releases. Desktop scroll distance below is the pinned portion, in viewport heights. Phones retain the full reversible films, with 90/180/110/110/140svh scroll ranges and fewer particles. Only reduced-motion settings use normal-flow poster scenes. Mobile bloom framing contains both flowers and the copy fades during their opening.

| Scene / emotion | Local MP4 | Source ID | Source trim | Crop | Pinned range | Authored cues and layers | Exit |
|---|---|---|---|---|---|---|---|
| 01 Opening / intimate invitation | 01-first-petal.mp4 | Mixkit 5189 | 0–6s | cover, bouquet left of Arabic type | 105vh | white orchids and hydrangeas remain the subject; headline stays readable, frame scales 1–1.10 | green edge and final hold |
| 02 Unfolding / discovery | 02-natural-unfolding.mp4 | Mixkit 4484 | 3.5–11.5s | cover, flower left, gradient edge | 160vh | early closed right bud; opening around output 2–5s; fuller bloom by 7s; cue rule and In bloom type move with progress | forest green into ivory |
| 03 Material / quiet detail | 03-light-and-petals.mp4 | Mixkit 5228 | 2–8s | cover, orchids left, cream fade | 130vh | shifting highlights and petal detail; slight lateral frame travel, dark typography | cream into green |
| 04 Human touch / personal occasion | 04-the-human-touch.mp4 | Mixkit 5223 | 1–7s | cover, bouquet/hands left | 130vh | hands hold a finished bouquet; no claim of arranging; frame contracts 1.12–1.00 | green veil |
| 05 Celebration / payoff | 05-a-moment-together.mp4 | Mixkit 5224 | 6.3–10.3s | cover, continuous tableware shot | 150vh | candles and gold-rimmed plates; p=.14–.38 logo particles gather, p=.38–.45 logo holds, p=.45–.73 disperses, p=.88 fully clear; copy returns | warm table resolves into cream work section |

The lilies' blue background and yellow petals are permanently normalized with desaturation and a green/ivory color balance; all other clips use restrained saturation/contrast changes. Posters come from frame zero of each prepared master. The table clip's earlier edit is outside the used range.

## Final sections

06 shows the genuine floral installation image extracted from the reference, followed by service accordions. 07 closes with the supplied leaf emblem and a working enquiry composer. The composer opens WhatsApp only after the visitor selects its final link; sending remains in WhatsApp.

## Frame targeting

Target time is quantized to 1/24 second and bounded by video metadata duration minus one frame. Seeks are serialized; if input changes while seeking, the most recent target is used when the current seek completes. The video remains paused. Rapid jumps resolve to a deterministic endpoint. Canvas drawing is called by scene progress updates, not by an independent animation loop.
