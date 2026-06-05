# Design

## Overview

The public website uses a research graph identity: members, projects, meetings, articles, events, and contact paths are treated as connected nodes in the DUT Blockchain Team network. The design should feel research-minded, young, credible, and active.

## Color

Use a deep ink foundation with restrained luminous accents.

- Background ink: `#040712`, `#0c1725`, `#101827`
- Text: `#f8fafc` on dark, `#0f172a` on light
- Muted text: `#64748b`, `rgba(226, 232, 240, 0.84)`
- Graph cyan: `#67e8f9`
- Team amber: `#facc15`
- Member green: `#5eead4`
- Project violet: `#a78bfa`
- Event rose: `#fb7185`
- Action dark: `#0f172a`, hover `#0e7490`

Avoid purple-to-blue gradient text and generic cyan-on-dark decoration. Accents should mark graph nodes, active controls, or section identity.

## Typography

Use local/system fonts to support Chinese copy cleanly:

`Avenir Next`, `PingFang SC`, `Microsoft YaHei`, `system-ui`, `-apple-system`, `sans-serif`

Headings use strong weight, tight but readable tracking, and balanced wrapping. Body copy should stay direct, concrete, and easy for new students to scan.

## Components

### PublicGraphHero

Shared public-page hero for About, Members, Projects, Blog, Meetings, Events, and Contact. It uses animated graph edges, a subtle orbit core, solid accent text, and compact stat tiles.

### Home Orbital Field

The homepage remains the immersive entry point. It should act as a navigable research graph rather than a game-like splash screen. Use symbolic node markers, restrained glow, and clear route labels.

### Cards

Cards should be functional containers for repeated content. Keep borders and shadows quiet, avoid nested cards, and do not use colored side stripes.

## Motion

Motion represents data flow and graph connectivity. Use slow linear graph motion and smooth hover feedback. All animations must have reduced-motion fallbacks.

## Layout

Public pages share a graph hero followed by scannable content areas. Content pages can use filters, grids, and modals, but the first viewport should immediately say where the visitor is in the team network.

## Accessibility

Target WCAG AA contrast. Keep focus states visible, avoid color-only meanings, and do not hide content behind animation. Mobile layouts must preserve the floating navigation space.
