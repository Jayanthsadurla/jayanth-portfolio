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

The build uses relative asset paths (`base: './'`), so the same output works on a root domain or a GitHub Pages project path.

### Vercel

1. Push the project to GitHub.
2. In Vercel choose **Add New → Project** and import the repository.
3. Vercel detects Vite. Build command `npm run build`, output directory `dist`. Deploy.

Or from the command line: `npm i -g vercel`, then `vercel` and follow the prompts. `vercel.json` adds long-lived caching for hashed assets.

### GitHub Pages

1. Push the project to a GitHub repository on the `main` branch.
2. In the repository open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it at `https://<username>.github.io/<repository>/`.

### Custom domain

Add the domain in the Vercel or Pages settings, then point your DNS records where the host tells you to.

## Browser support

Current Chrome, Edge, Firefox and Safari. The page is fully usable with JavaScript-rendered content but without WebGL, and with reduced motion enabled.

## Accessibility

Semantic landmarks, a skip link, visible focus rings, keyboard-operable menus, tabs, filters and chips, an accessible theme switch, `aria-live` regions where content changes, links that open in a new tab say so for screen readers, and colour is never the only signal.
