import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useTheme } from '../../hooks/useTheme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { detectWebGL } from '../../hooks/useWebGL';
import { HeroFallback } from './HeroFallback';

// The three.js + R3F bundle (~810KB raw, ~220KB gzipped) is only fetched on capable devices,
// after the page has painted, and never blocks first render.
const HeroScene = lazy(() => import('./HeroScene'));

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface HeroVisualProps {
  ready: boolean;
}

export function HeroVisual({ ready }: HeroVisualProps) {
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isStacked = useMediaQuery('(max-width: 1023px)'); // overlays sit below the stage, not on it
  const containerRef = useRef<HTMLDivElement>(null);

  const [wantScene, setWantScene] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  // Defer the heavy import until the browser is idle (or 1.2s at most).
  useEffect(() => {
    if (!detectWebGL()) return;
    const start = () => setWantScene(true);
    const idle = (window as Window & typeof globalThis & { requestIdleCallback?: typeof requestIdleCallback }).requestIdleCallback;
    if (typeof idle === 'function') {
      const id = idle.call(window, start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(start, 400);
    return () => window.clearTimeout(timer);
  }, []);

  // Stop rendering when scrolled away or the tab is hidden.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const showScene = wantScene && !failed;

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: showScene && sceneReady ? 0 : 1 }}
      >
        <HeroFallback />
      </div>

      {showScene && (
        <SceneBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: sceneReady ? 1 : 0 }}>
              <HeroScene
                theme={theme}
                reduced={reduced}
                mobile={isMobile}
                ready={ready}
                active={inView && tabVisible}
                offsetY={isStacked ? 0 : 1.75}
                onFirstFrame={() => setSceneReady(true)}
                onFail={() => setFailed(true)}
              />
            </div>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
