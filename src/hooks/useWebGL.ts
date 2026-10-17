let cached: boolean | undefined;

/**
 * Detects a usable, hardware-accelerated WebGL context.
 * Software renderers are treated as "unsupported" on purpose: the 2D fallback
 * is smoother than a CPU-rasterised 3D scene.
 *
 * Visitors (or developers) can override with ?scene=3d or ?scene=2d.
 */
export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;

  const override = new URLSearchParams(window.location.search).get('scene');
  if (override === '2d') return false;
  if (override === '3d') return true;

  if (cached !== undefined) return cached;
  try {
    const canvas = document.createElement('canvas');
    const options = { failIfMajorPerformanceCaveat: true, powerPreference: 'high-performance' as const };
    // three.js r163+ requires WebGL2, so WebGL1-only devices get the 2D visual.
    const gl = canvas.getContext('webgl2', options) as WebGL2RenderingContext | null;
    cached = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
