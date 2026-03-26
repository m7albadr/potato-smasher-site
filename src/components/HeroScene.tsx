import { useRef, Suspense, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Scroll state — written by scroll listener, read in rAF ── */
const scroll = { target: 0, current: 0, rawY: 0 };

function useScrollProgress() {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.rawY = window.scrollY;
      scroll.target = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

/* ── Camera: smooth lerp toward scroll target ── */
function SmoothCamera() {
  const { camera } = useThree();

  useFrame(() => {
    // Lerp for buttery smooth movement
    scroll.current += (scroll.target - scroll.current) * 0.04;
    const p = scroll.current;
    const angle = p * Math.PI * 4;
    const radius = 5.5 - p * 1.5;
    const height = Math.sin(p * Math.PI * 2) * 0.8;

    camera.position.x = Math.sin(angle) * radius;
    camera.position.y = height;
    camera.position.z = Math.cos(angle) * radius;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Particles ── */
function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 80;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.015 + scroll.current * 2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d4a843" size={0.02} sizeAttenuation transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ── Glow ring ── */
function Ring({ radius, speed, opacity, rot }: { radius: number; speed: number; opacity: number; rot: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ref} rotation={rot}>
      <torusGeometry args={[radius, 0.007, 12, 80]} />
      <meshBasicMaterial color="#d4a843" transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

/* ── Photo ── */
function Photo() {
  const ref = useRef<THREE.Group>(null!);
  const texture = useLoader(THREE.TextureLoader, "/IMG_8537.jpg");

  const aspect = texture.image ? texture.image.width / texture.image.height : 3 / 4;
  const s = 2.0;
  const w = s * Math.min(aspect, 1);
  const h = s * (aspect < 1 ? 1 : 1 / aspect);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
  });

  return (
    <group ref={ref}>
      {/* Soft glow behind */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[w + 0.4, h + 0.4]} />
        <meshBasicMaterial color="#d4a843" transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Border */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[w + 0.06, h + 0.06]} />
        <meshBasicMaterial color="#d4a843" transparent opacity={0.3} toneMapped={false} />
      </mesh>
      {/* Photo */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ── Scene — no post-processing ── */
function Scene() {
  return (
    <>
      <SmoothCamera />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 3, 5]} intensity={0.3} color="#d4a843" />

      <Photo />

      <Ring radius={2.3} speed={0.15} opacity={0.2} rot={[Math.PI / 2, 0, 0]} />
      <Ring radius={2.8} speed={-0.08} opacity={0.08} rot={[Math.PI / 3, Math.PI / 6, 0]} />

      <Particles />
    </>
  );
}

export function HeroScene() {
  useScrollProgress();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={1}
        style={{ background: "#050505" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* CSS vignette — free compared to GPU post-processing */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px 60px #050505" }} />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10" id="hero-text-overlay">
        <div className="absolute" style={{ top: "12%" }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-[0.4em] text-[#d4a843] glow-text-strong">
            WANTED
          </h1>
        </div>
        <div className="absolute text-center" style={{ bottom: "18%" }}>
          <p className="text-base md:text-lg font-display tracking-[0.2em] text-[#f5e6c8] glow-text mb-2">
            SUBJECT: POTATO SMASHER
          </p>
          <p className="text-[10px] tracking-[0.35em] text-[#8b6914] font-mono">
            BUREAU OF POTATO INVESTIGATION
          </p>
          <p className="text-[9px] tracking-[0.3em] text-[#5a4520] font-mono mt-1">
            CASE FILE #PSM-2026-0042 // CLASSIFIED
          </p>
        </div>
      </div>
    </div>
  );
}
