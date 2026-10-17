# Jayanth Sadurla — Portfolio

A responsive personal portfolio built with React, TypeScript, Vite, Tailwind CSS, Framer Motion and React Three Fiber. It has dark and light themes, a lazy-loaded 3D neural-network hero, a stationary animated guide avatar, an interactive project showcase, a skill constellation, a learning timeline, and a contact section.

Everything on the page is truthful by design: no invented jobs, companies, dates, testimonials or skill percentages. All content lives in `src/data/` and is easy to edit.

## Quick start

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload           |
| `npm run typecheck` | Type-check the whole project                   |
| `npm run build`     | Type-check, then create a production build in `dist/` |
| `npm run preview`   | Serve the production build locally             |

## Where to edit content

| To change…                        | Edit                      |
| --------------------------------- | ------------------------- |
| Name, intro, email, phone, links  | `src/data/site.ts`        |
| Avatar greeting text              | `src/data/site.ts` (`guide`) |
| Projects, repo links, filters     | `src/data/projects.ts`    |
| Skill groups                      | `src/data/skills.ts`      |
| Journey timeline                  | `src/data/journey.ts`     |
| "Technical Universe" themes       | `src/data/universe.ts`    |
| About section copy                | `src/components/sections/AboutSection.tsx` |
| Colours (both themes)             | `src/index.css` (CSS variables at the top) |

To add deployed links to a project, give it a `demos` array (`{ label, url }`). Each one shows as a button above "View on GitHub".

Project technology chips only list things named in each project's description. If you want a card to show more (for example, a library you used), add it to that project's `tech` array.

## Architecture

```
src/
  components/
    hero/       HeroSection, AvatarGuide, BoyAvatar (SVG), HeroVisual,
                HeroScene (three.js, lazy), HeroFallback (2D SVG)
    layout/     Navbar, ThemeToggle, LoadingScreen, ScrollProgress,
                ParticleField, Footer
    projects/   ProjectCard, ProjectFilter, ProjectArt
    sections/   About, Projects, Skills, Journey, TechnicalUniverse, Contact
    ui/         Section, SectionHeading, Reveal, CountUp, Icons
  data/         All content (typed)
  hooks/        useTheme, useActiveSection, useGuideSequence, useWebGL, …
  lib/          scroll, contact (mailto), colours, motion helpers
```

### How the avatar guide behaves

- It is drawn as inline SVG, so it is crisp at any size and works without WebGL.
- It is rendered once, inside the hero, by the page layout. It is never `position: fixed`, never follows the pointer or the scroll, and scrolls away with the hero.
- After a short entrance it only breathes, blinks and sways very slightly. Only `transform` and `opacity` animate.
- The greeting types out once, then shows links to About, Projects, Skills, Journey and Contact. A **Skip** button shows the full text immediately.
- Screen readers get the whole message at once from a visually hidden copy.
- On phones and tablets it sits in normal flow below the call-to-action buttons and is smaller, so it can never cover content. On laptops it fits above the fold, including 1280×720.
- With `prefers-reduced-motion: reduce` the greeting appears instantly and all avatar animation is off.

### Performance and fallbacks

- three.js and React Three Fiber (about 810 KB raw, 220 KB gzipped) load in a separate chunk after first paint, only when WebGL is available.
- The 3D scene pauses when scrolled out of view or when the tab is hidden, and uses fewer particles on small screens.
- If WebGL is missing or the scene fails, a 2D SVG version of the network is shown instead.
- Fonts are self-hosted through `@fontsource-variable`, so there are no third-party font requests.

### Theme

The theme is set before first paint from `localStorage` (`theme` key), falling back to the system preference on a first visit. The 3D scene reads its colours from the same CSS variables, so lighting and palette change with the theme.

## Contact form

There is no backend. Submitting the form validates the fields and opens the visitor's email app with the message filled in, and the page says clearly that nothing has been sent yet. To use a form service instead (Formspree, Web3Forms, your own endpoint), replace the submit handler in `src/components/sections/ContactSection.tsx`.

## Assets and custom 3D models

No model files are needed. The 3D network is generated in code (`HeroScene.tsx`) and the avatar is SVG (`BoyAvatar.tsx`).

If you later want a custom 3D avatar or object:

1. Export it as `.glb`, ideally under 1 MB (compress with `gltf-transform optimize` or Draco).
2. Put it in `public/models/` (for example `public/models/guide.glb`).
3. Load it inside `HeroScene.tsx` with `useGLTF` from `@react-three/drei` (`npm install @react-three/drei@9`), and keep the guide positioned by the hero layout, not by the scene.
4. Keep the SVG avatar as the fallback for devices without WebGL.

For link previews, add a 1200×630 image at `public/og-image.png` and this tag in `index.html`:

```html
<meta property="og:image" content="https://YOUR-DOMAIN/og-image.png" />
```

## Deploy

This portfolio is built with React, TypeScript and Vite. The production build generates static files in the `dist` directory.

### Render

1. Push the project to the GitHub repository on the `main` branch.
2. In Render, select **New → Static Site** and connect the repository.
3. Set the build command to `npm ci && npm run build`.
4. Set the publish directory to `dist`.
5. Click **Create Static Site** and wait for the deployment to complete.

**Live portfolio:** [https://jayanth-portfolio-9y1p.onrender.com/](https://jayanth-portfolio-9y1p.onrender.com/)

Render can automatically deploy updates when new commits are pushed to the connected branch.

### Alternative hosting

The project can also be deployed to Vercel by importing the GitHub repository, using `npm run build` as the build command and `dist` as the output directory.

### Custom domain

A custom domain can be configured through the hosting provider's settings after the domain is registered and its DNS records are configured correctly.

## Browser support

Supports current versions of Chrome, Edge, Firefox and Safari. The portfolio works without WebGL and supports reduced-motion preferences.

## Accessibility

- Semantic page landmarks and a skip link.
- Visible keyboard focus indicators.
- Keyboard-operable menus, tabs, filters and chips.
- An accessible theme switch.
- `aria-live` regions for dynamic content.
- Links that open in new tabs are identified for screen readers.
- Colour is never the only way information is communicated.
