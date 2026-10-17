import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Theme } from '../../hooks/useTheme';
import { readToken, type Rgb } from '../../lib/colors';

/* -------------------------------------------------------------------------- */
/* Network data: five layers shaped like a spindle, each node linked to the    */
/* three nearest nodes in the next layer. Deterministic (seeded) so the shape  */
/* is identical on every visit.                                                */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Network {
  nodes: THREE.Vector3[];
  edges: [number, number][];
  /** outgoing edge indices per node */
  out: number[][];
  firstLayerEdges: number[];
}

function buildNetwork(mobile: boolean): Network {
  const rand = mulberry32(7);
  const layers = mobile ? [4, 6, 8, 6, 4] : [5, 8, 10, 8, 5];
  const xs = [-3.3, -1.65, 0, 1.65, 3.3];
  const radii = [1.0, 1.9, 2.4, 1.9, 1.0];

  const nodes: THREE.Vector3[] = [];
  const byLayer: number[][] = [];
  layers.forEach((count, l) => {
    const ids: number[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + l * 0.5 + (rand() - 0.5) * 0.25;
      const radius = radii[l] * (0.88 + rand() * 0.24);
      nodes.push(new THREE.Vector3(xs[l] + (rand() - 0.5) * 0.25, Math.cos(angle) * radius, Math.sin(angle) * radius));
      ids.push(nodes.length - 1);
    }
    byLayer.push(ids);
  });

  const edges: [number, number][] = [];
  const out: number[][] = nodes.map(() => []);
  const firstLayerEdges: number[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (const a of byLayer[l]) {
      const nearest = [...byLayer[l + 1]]
        .sort((p, q) => nodes[a].distanceToSquared(nodes[p]) - nodes[a].distanceToSquared(nodes[q]))
        .slice(0, 3);
      for (const b of nearest) {
        edges.push([a, b]);
        out[a].push(edges.length - 1);
        if (l === 0) firstLayerEdges.push(edges.length - 1);
      }
    }
  }
  return { nodes, edges, out, firstLayerEdges };
}

/* -------------------------------------------------------------------------- */
/* Theme palette: same scene, different colours, blending and light levels.    */
/* -------------------------------------------------------------------------- */

function toColor([r, g, b]: Rgb): THREE.Color {
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
}

function makePalette(theme: Theme) {
  const dark = theme === 'dark';
  return {
    dark,
    blending: dark ? THREE.AdditiveBlending : THREE.NormalBlending,
    blue: toColor(readToken('blue')),
    cyan: toColor(readToken('cyan')),
    violet: toColor(readToken('violet')),
    mint: toColor(readToken('mint')),
    // base opacities (multiplied by the entrance factor every frame)
    edge: dark ? 0.34 : 0.42,
    node: dark ? 1 : 0.95,
    glow: dark ? 0.55 : 0.28,
    pulse: dark ? 1 : 0.95,
    coreFill: dark ? 0.16 : 0.1,
    coreWire: dark ? 0.3 : 0.38,
    ring: dark ? 0.45 : 0.5,
    particles: dark ? 0.7 : 0.55,
    grid: dark ? 0.55 : 0.4,
    ambient: dark ? 0.35 : 0.95,
    point: dark ? 22 : 9,
  };
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/* -------------------------------------------------------------------------- */
/* Scene                                                                       */
/* -------------------------------------------------------------------------- */

interface SceneProps {
  theme: Theme;
  reduced: boolean;
  mobile: boolean;
  ready: boolean;
  offsetY: number;
  onFirstFrame: () => void;
}

const PULSES = 22;
const PARTICLES = 220;

function Scene({ theme, reduced, mobile, ready, offsetY, onFirstFrame }: SceneProps) {
  const palette = useMemo(() => makePalette(theme), [theme]);
  const net = useMemo(() => buildNetwork(mobile), [mobile]);
  const invalidate = useThree((s) => s.invalidate);

  const rig = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const coreGroup = useRef<THREE.Group>(null);
  const particlesGroup = useRef<THREE.Group>(null);
  const edgeMat = useRef<THREE.LineBasicMaterial>(null);
  const nodeMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.PointsMaterial>(null);
  const pulseMat = useRef<THREE.PointsMaterial>(null);
  const coreFillMat = useRef<THREE.MeshStandardMaterial>(null);
  const coreWireMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const satMat = useRef<THREE.MeshBasicMaterial>(null);
  const particleMat = useRef<THREE.PointsMaterial>(null);
  const floorMat = useRef<THREE.ShaderMaterial>(null);

  const entranceStart = useRef<number | null>(null);
  const firstFrame = useRef(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  /* soft round sprite used by the glow + particle points */
  const sprite = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  /* geometry */
  const edgeGeo = useMemo(() => {
    const pos = new Float32Array(net.edges.length * 6);
    net.edges.forEach(([a, b], i) => {
      net.nodes[a].toArray(pos, i * 6);
      net.nodes[b].toArray(pos, i * 6 + 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [net]);

  const nodeGlowGeo = useMemo(() => {
    const pos = new Float32Array(net.nodes.length * 3);
    net.nodes.forEach((n, i) => n.toArray(pos, i * 3));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [net]);

  const pulses = useMemo(() => {
    const rand = mulberry32(21);
    return Array.from({ length: PULSES }, () => ({
      edge: net.firstLayerEdges[Math.floor(rand() * net.firstLayerEdges.length)] ?? 0,
      t: rand(),
      speed: 0.35 + rand() * 0.35,
    }));
  }, [net]);
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
    return g;
  }, []);

  const particleGeo = useMemo(() => {
    const rand = mulberry32(99);
    const count = mobile ? PARTICLES / 2 : PARTICLES;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4.2 + rand() * 3.2;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.8;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [mobile]);

  const floorUniforms = useMemo(() => ({ uColor: { value: new THREE.Color() }, uOpacity: { value: 0 } }), []);

  /* place the pulses on their edges once, so a still frame already shows data in flight */
  const placePulses = () => {
    const attr = pulseGeo.getAttribute('position') as THREE.BufferAttribute;
    const tmp = new THREE.Vector3();
    pulses.forEach((p, i) => {
      const [a, b] = net.edges[p.edge];
      tmp.lerpVectors(net.nodes[a], net.nodes[b], p.t);
      attr.setXYZ(i, tmp.x, tmp.y, tmp.z);
    });
    attr.needsUpdate = true;
  };

  useLayoutEffect(() => {
    placePulses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulses, net]);

  /* repaint when the theme changes while the loop is paused (reduced motion) */
  useEffect(() => {
    invalidate();
  }, [palette, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (!firstFrame.current) {
      firstFrame.current = true;
      onFirstFrame();
    }

    /* entrance: scale up + settle, once, after the loader hands over */
    let e = 1;
    if (!reduced) {
      if (ready && entranceStart.current === null) entranceStart.current = t;
      e = entranceStart.current === null ? 0 : easeOutCubic(clamp((t - entranceStart.current) / 1.6, 0, 1));
    }

    if (rig.current) {
      const px = reduced ? 0 : clamp(state.pointer.x, -1.2, 1.2);
      const py = reduced ? 0 : clamp(state.pointer.y, -1.2, 1.2);
      const sway = reduced ? 0 : Math.sin(t * 0.22) * 0.26;
      const targetY = sway + px * 0.34 + (1 - e) * 0.9;
      const targetX = -py * 0.16;
      rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, targetY, 3, dt);
      rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, targetX, 3, dt);
      rig.current.scale.setScalar(0.55 + 0.45 * e);
    }

    /* opacities follow the entrance factor so everything fades in together */
    if (edgeMat.current) edgeMat.current.opacity = palette.edge * e;
    if (nodeMat.current) nodeMat.current.opacity = palette.node * e;
    if (glowMat.current) glowMat.current.opacity = palette.glow * e;
    if (pulseMat.current) pulseMat.current.opacity = palette.pulse * e;
    if (coreFillMat.current) coreFillMat.current.opacity = palette.coreFill * e;
    if (coreWireMat.current) coreWireMat.current.opacity = palette.coreWire * e;
    if (ringMat.current) ringMat.current.opacity = palette.ring * e;
    if (satMat.current) satMat.current.opacity = e;
    if (particleMat.current) particleMat.current.opacity = palette.particles * e;
    floorUniforms.uOpacity.value = palette.grid * e;

    /* nodes breathe very slightly */
    if (nodesRef.current) {
      net.nodes.forEach((n, i) => {
        const s = reduced ? 1 : 0.92 + 0.22 * Math.sin(t * 1.2 + i * 1.7);
        dummy.position.copy(n);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        nodesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (!reduced) {
      /* data pulses travel layer to layer along the edges */
      const attr = pulseGeo.getAttribute('position') as THREE.BufferAttribute;
      const tmp = new THREE.Vector3();
      pulses.forEach((p, i) => {
        p.t += dt * p.speed;
        if (p.t >= 1) {
          const outs = net.out[net.edges[p.edge][1]];
          p.edge = outs.length > 0 ? outs[Math.floor(Math.random() * outs.length)] : net.firstLayerEdges[Math.floor(Math.random() * net.firstLayerEdges.length)];
          p.t = 0;
        }
        const [a, b] = net.edges[p.edge];
        tmp.lerpVectors(net.nodes[a], net.nodes[b], p.t * p.t * (3 - 2 * p.t));
        attr.setXYZ(i, tmp.x, tmp.y, tmp.z);
      });
      attr.needsUpdate = true;

      if (coreGroup.current) coreGroup.current.rotation.y += dt * 0.12;
      if (ringGroup.current) ringGroup.current.rotation.z += dt * 0.1;
      if (particlesGroup.current) particlesGroup.current.rotation.y += dt * 0.012;
    }
  });

  const { dark } = palette;

  return (
    <group position={[0, offsetY, 0]}>
      <group ref={rig}>
        {/* lighting: stronger coloured point lights on dark, brighter ambient on light */}
        <ambientLight intensity={palette.ambient} />
        <pointLight position={[-4, 3, 4]} color={palette.cyan} intensity={palette.point} distance={16} />
        <pointLight position={[4, -2, 3]} color={palette.violet} intensity={palette.point} distance={16} />

        {/* nodes */}
        <instancedMesh ref={nodesRef} args={[undefined, undefined, net.nodes.length]} frustumCulled={false}>
          <sphereGeometry args={[0.085, 14, 14]} />
          <meshBasicMaterial ref={nodeMat} color={dark ? palette.cyan : palette.blue} transparent toneMapped={false} />
        </instancedMesh>
        <points geometry={nodeGlowGeo} frustumCulled={false}>
          <pointsMaterial
            ref={glowMat}
            map={sprite}
            size={0.62}
            sizeAttenuation
            color={dark ? palette.blue : palette.violet}
            transparent
            depthWrite={false}
            blending={palette.blending}
            toneMapped={false}
          />
        </points>

        {/* connections */}
        <lineSegments geometry={edgeGeo} frustumCulled={false}>
          <lineBasicMaterial ref={edgeMat} color={dark ? palette.blue : palette.blue} transparent depthWrite={false} toneMapped={false} />
        </lineSegments>

        {/* signals */}
        <points geometry={pulseGeo} frustumCulled={false}>
          <pointsMaterial
            ref={pulseMat}
            map={sprite}
            size={0.42}
            sizeAttenuation
            color={palette.mint}
            transparent
            depthWrite={false}
            blending={palette.blending}
            toneMapped={false}
          />
        </points>

        {/* faceted core: lit solid + wireframe */}
        <group ref={coreGroup}>
          <mesh>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshStandardMaterial
              ref={coreFillMat}
              color={palette.violet}
              flatShading
              transparent
              metalness={0.6}
              roughness={0.25}
              depthWrite={false}
            />
          </mesh>
          <mesh scale={1.012}>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshBasicMaterial ref={coreWireMat} color={dark ? palette.violet : palette.violet} wireframe transparent toneMapped={false} />
          </mesh>
        </group>

        {/* orbit ring with three satellites */}
        <group rotation={[Math.PI / 2.5, 0.2, 0]}>
          <group ref={ringGroup}>
            <mesh>
              <torusGeometry args={[3.7, 0.014, 8, 160]} />
              <meshBasicMaterial ref={ringMat} color={palette.cyan} transparent toneMapped={false} />
            </mesh>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[Math.cos((i / 3) * Math.PI * 2) * 3.7, Math.sin((i / 3) * Math.PI * 2) * 3.7, 0]}>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshBasicMaterial ref={i === 0 ? satMat : undefined} color={palette.cyan} transparent toneMapped={false} />
              </mesh>
            ))}
          </group>
        </group>

        {/* ambient data dust */}
        <group ref={particlesGroup}>
          <points geometry={particleGeo} frustumCulled={false}>
            <pointsMaterial
              ref={particleMat}
              map={sprite}
              size={0.16}
              sizeAttenuation
              color={dark ? palette.cyan : palette.blue}
              transparent
              depthWrite={false}
              blending={palette.blending}
              toneMapped={false}
            />
          </points>
        </group>
      </group>

      {/* digital grid floor (kept outside the rig so it stays level) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.15, 0]} frustumCulled={false}>
        <planeGeometry args={[24, 24]} />
        <shaderMaterial
          ref={floorMat}
          transparent
          depthWrite={false}
          uniforms={floorUniforms}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={`
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uOpacity;
            float grid(vec2 p, float size) {
              vec2 q = p / size;
              vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
              return 1.0 - min(min(g.x, g.y), 1.0);
            }
            void main() {
              vec2 p = (vUv - 0.5) * 24.0;
              float lines = grid(p, 1.0) * 0.55 + grid(p, 4.0) * 0.55;
              float fade = smoothstep(1.0, 0.1, length(vUv - 0.5) * 2.0);
              gl_FragColor = vec4(uColor, lines * fade * uOpacity);
              #include <colorspace_fragment>
            }
          `}
        />
      </mesh>
      <GridColor uniforms={floorUniforms} color={dark ? palette.cyan : palette.blue} />
    </group>
  );
}

/** Keeps the floor shader colour in sync with the theme. */
function GridColor({ uniforms, color }: { uniforms: { uColor: { value: THREE.Color } }; color: THREE.Color }) {
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    uniforms.uColor.value.copy(color);
    invalidate();
  }, [uniforms, color, invalidate]);
  return null;
}

/** Fits the whole network in view whatever the stage's aspect ratio. */
function CameraRig({ offsetY }: { offsetY: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(4.7 / (tan * aspect), (3.9 + Math.abs(offsetY)) / tan);
    camera.position.set(0, 0.3, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, offsetY, invalidate]);

  return null;
}

/* -------------------------------------------------------------------------- */
/* Canvas wrapper (default export so it can be lazy-loaded)                    */
/* -------------------------------------------------------------------------- */

export interface HeroSceneProps {
  theme: Theme;
  reduced: boolean;
  mobile: boolean;
  ready: boolean;
  /** false pauses rendering (off-screen or hidden tab) */
  active: boolean;
  /** shift the model up when overlays occupy the bottom of the stage */
  offsetY: number;
  onFirstFrame: () => void;
  onFail: () => void;
}

export default function HeroScene({ theme, reduced, mobile, ready, active, offsetY, onFirstFrame, onFail }: HeroSceneProps) {
  // Let the whole hero section drive the parallax, not just the canvas box.
  const [eventSource] = useState<HTMLElement | undefined>(() => document.getElementById('home') ?? undefined);

  return (
    <Canvas
      flat
      dpr={[1, mobile ? 1.25 : 1.75]}
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      camera={{ fov: 40, near: 0.1, far: 60, position: [0, 0.3, 11] }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      eventSource={eventSource}
      eventPrefix="client"
      style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          onFail();
        });
      }}
    >
      <CameraRig offsetY={offsetY} />
      <Scene theme={theme} reduced={reduced} mobile={mobile} ready={ready} offsetY={offsetY} onFirstFrame={onFirstFrame} />
    </Canvas>
  );
}
