# Verification

Checked in Chrome against the Vite production preview, 29–30 September 2026.

## Passed

- Production build completes; 13 local media/brand references resolve.
- pnpm dependency audit: zero known vulnerabilities at the time checked.
- Five paused video scenes checked at progress 0, 0.5 and 0.96. All stage tops remain at viewport y=0 throughout their pinned range. Observed target/current-time difference is below 0.001 seconds after seeking settles.
- All five scenes checked in reverse at progress 0.3; frame targets and sticky positions agree.
- Direct rapid jumps and interrupted navigation resolve without autoplay or lingering scene animation.
- Fifteen beginning/midpoint/end screenshots saved locally under ignored `qa/`.
- 1440×900 laptop layout: no horizontal overflow; readable opening and scene typography.
- 700×1000 portrait desktop: sticky choreography and video seeking remain enabled, no horizontal overflow.
- Updated 390×844 phone: all five videos load from the `/labasil/` base path, sticky scenes and reverse seeking are enabled, no horizontal overflow or application errors. Bloom checked at progress 0, 0.5, 0.96 and reverse 0.2; actual frame times 0, 4.041666, 7.958333, 1.083333 seconds match targets within 0.001 seconds. Text fades during opening to reveal the petals. Menu behavior was checked in the earlier pass.
- Reduced-motion preference: ordinary-flow scenes, video sources removed, canvas hidden, content and navigation retained.
- Native enquiry dialog opens, focuses the name field, closes, and restores focus. Test Arabic and special characters (`&`, `+`) survive URL encoding into the WhatsApp draft link. No test message was sent.
- Demo pass reaches the bottom within subpixel rounding (<1 CSS px), stops, and leaves every video at its metadata-derived final frame. Space toggles, R repeatedly restores scroll and every video to 0; manual wheel/touch handlers cancel a pass. A cancellation race during media preparation was found and fixed with a generation token.
- Console check shows no application warnings or errors in the normal production flow.
- All authored MP4s are under 6 MB each after the final trim (about 21.6 MB total), below both the 100 MB GitHub per-file limit and common static-host asset limits. Stock MP4s/posters are excluded from the public repository.

## Scope and limits

Testing used Chrome on this Windows computer, including emulated phone dimensions. It is not a physical iOS/Safari device certification. Video seeks were checked for endpoint correctness and visually inspected; no universal frame-rate guarantee is made for slower devices or networks. Later media load near the viewport, and failures preserve poster imagery. Google Fonts depends on network availability; system fonts remain a fallback.

The WhatsApp workflow composes a message but does not submit or store an enquiry. Business links/contact details come from the user's supplied reference.

## Hosting migration

The production preview now serves under `/labasil/`. Brand imagery, posters, module files and lazily loaded videos resolve beneath that base. GitHub Actions builds and deploys the release; activation and live verification depend on the repository Pages setting. Reduced-motion emulation was rechecked after enabling mobile choreography: video source attributes are removed and the canvas is hidden.
