# Cinematic South Indian Wedding Invitation

## What I’ll build
- A polished one-page invitation with eleven scroll-led chapters: opening, couple, blessing, story, events, venue, countdown, family, gallery, RSVP, and closing.
- A mobile-first 9:16 composition that expands gracefully for desktop without losing its intimate invitation feel.
- An original South Indian visual direction using ivory paper, wine, antique gold, deep green, temple-arch geometry, floral layers, and subtle grain.

## Interactions
- Layered opening scene with scroll parallax, depth, gentle rotation, petals, and ornamental foreground elements.
- Scroll-reveal transitions using opacity, blur, scale, and restrained 3D transforms, with reduced-motion fallbacks.
- Pointer-responsive event cards on desktop, a stacked horizontal gallery, and a full-screen cinematic photo viewer.
- Live countdown, scroll progress, smooth section navigation, share action, floating RSVP action, and opt-in background music control.

## Content and customization
- Store names, dates, message, timeline, events, venue, family, links, colors, and image references in one clearly documented configuration file.
- Use refined generated portrait and wedding imagery as replaceable placeholders, clearly labeled in the configuration.
- Use WhatsApp for the RSVP call-to-action and a map placeholder link that can be replaced later.

## Technical details
- Build with React, Tailwind design tokens, CSS perspective/transforms, IntersectionObserver, and lightweight pointer/scroll effects rather than a heavy 3D engine.
- Keep decorative motion GPU-friendly, lazy-load noncritical imagery, lock body scroll in the photo viewer, and honor `prefers-reduced-motion`.
- Add invitation-specific page title and social metadata, then validate desktop and mobile layouts in the live preview.

## Assumptions
- I’ll use tasteful fictional sample names, dates, places, family names, and links until you provide the real invitation details.
- Music will be user-initiated and will not autoplay.
