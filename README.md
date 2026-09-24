# Cinematic Vows

Create a premium, modern, highly interactive wedding invitation website inspired by the overall experience and information architecture of the reference site https://www.missingpieceinvites.com/demos/meenaya, but do NOT copy proprietary code, exact artwork, or exact visual assets. Make it an original design.

The website must feel like a cinematic 3D wedding invitation rather than a normal static webpage.

Core experience:
- Mobile-first responsive 9:16-friendly composition, also polished on desktop.
- Smooth scroll-driven storytelling with sections that react visibly to scrolling.
- Use tasteful real 3D effects via CSS transforms and, where useful, lightweight Three.js/react-three-fiber; prioritize performance and graceful fallback on mobile.
- Hero opening with layered 3D depth, floating floral/ornamental elements, elegant reveal of bride and groom names, date and invitation line.
- Scroll progress / subtle navigation indicator.
- Sections should animate into view using scale, blur, opacity, parallax, depth and rotation, but never feel nauseating.
- Premium South Indian wedding aesthetic: warm ivory/cream base, muted maroon/wine, antique gold, deep green accents, subtle paper/grain texture, floral and temple-inspired ornamental motifs.
- Typography should feel editorial and luxurious, mixing an elegant serif/display face with a clean sans-serif.
- Add tasteful ambient particles/petal motion and subtle 3D floral layers.
- Include an optional background music control with mute/unmute; do not autoplay aggressively or block the page.
- Include a sticky/floating "RSVP" action and share action.
- Add smooth anchor navigation.

Content architecture:
1. Opening / Hero
2. Couple introduction with portraits placeholders
3. Wedding blessing / invitation message
4. Our story timeline
5. Events: engagement/reception/wedding with date, time, venue
6. Venue section with map button placeholder
7. Countdown to wedding date
8. Family / blessings section
9. Photo gallery with cinematic lightbox
10. RSVP / WhatsApp CTA
11. Closing thank-you section

Make all wedding content data-driven from one central config object so names, dates, venue, event details, social links, images and colors can be changed easily later.

Interaction requirements:
- Scroll-triggered 3D transformations between sections.
- Hero layers move at different depths with scroll.
- Event cards tilt slightly based on pointer position on desktop.
- Gallery has horizontal/stacked 3D card interaction and fullscreen lightbox.
- Countdown updates live.
- Buttons have tactile micro-interactions.
- Respect prefers-reduced-motion.
- No clutter, no fake filler text, no generic dashboard UI.

Use high-quality placeholder images/abstract generated-looking gradients where actual couple photos are not available, but make the image slots obvious and easy to replace.
Keep performance good, avoid huge libraries unless necessary.
Build a polished first version with working interactions, not just a visual mockup.
Also include a simple hidden/editable content configuration area or clearly documented config file for future customization.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b8c18c4c-7bed-4791-bedf-e53c0a434b96).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
