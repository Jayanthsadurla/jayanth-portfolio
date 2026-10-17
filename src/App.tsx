import { useCallback, useState } from 'react';
import { sectionIds } from './data/site';
import { useActiveSection } from './hooks/useActiveSection';
import { HeroSection } from './components/hero/HeroSection';
import { Footer } from './components/layout/Footer';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { Navbar } from './components/layout/Navbar';
import { ParticleField } from './components/layout/ParticleField';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { JourneyTimeline } from './components/sections/JourneyTimeline';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsVisualization } from './components/sections/SkillsVisualization';
import { TechnicalUniverse } from './components/sections/TechnicalUniverse';

export default function App() {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const active = useActiveSection(sectionIds);
  // The Technical Universe has no nav link of its own; it continues the Journey, so Journey stays highlighted.
  const navActive = active === 'universe' ? 'journey' : active;

  return (
    <>
      <div className="page-bg" aria-hidden="true" />
      <div className="page-grid" aria-hidden="true" />
      <ParticleField />
      <LoadingScreen onReady={onReady} />
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-blue focus:px-4 focus:py-2 focus:font-semibold focus:text-[rgb(var(--on-accent))]"
      >
        Skip to content
      </a>
      <Navbar active={navActive} />
      <main id="main">
        <HeroSection ready={ready} />
        <AboutSection />
        <ProjectsSection />
        <SkillsVisualization />
        <JourneyTimeline />
        <TechnicalUniverse />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
