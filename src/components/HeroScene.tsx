import { useRef, Suspense, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── Device detection ── */
const isMobile = () => window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/* ── Scroll state ── */
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

/* ── Camera: smooth lerp ── */
function SmoothCamera({ mobile }: { mobile: boolean }) {
  const { camera } = useThree();

  useFrame(() => {
    scroll.current += (scroll.target - scroll.current) * 0.04;
    const p = scroll.current;
    // Mobile: gentler orbit (1 rotation vs 2), pulled back further
    const orbits = mobile ? Math.PI * 2 : Math.PI * 4;
    const baseRadius = mobile ? 6.5 : 5.5;
    const angle = p * orbits;
    const radius = baseRadius - p * 1.2;
    const height = Math.sin(p * Math.PI * 2) * (mobile ? 0.4 : 0.8);

    camera.position.x = Math.sin(angle) * radius;
    camera.position.y = height;
    camera.position.z = Math.cos(angle) * radius;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Particles ── */
function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);

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
  }, [count]);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.015 + scroll.current * 2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d4a843" size={0.025} sizeAttenuation transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
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
      <torusGeometry args={[radius, 0.007, 12, 64]} />
      <meshBasicMaterial color="#d4a843" transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

/* ── Photo ── */
function Photo({ mobile }: { mobile: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const texture = useLoader(THREE.TextureLoader, "/IMG_8537.jpg");

  const aspect = texture.image ? texture.image.width / texture.image.height : 3 / 4;
  const scale = mobile ? 1.5 : 2.0;
  const w = scale * Math.min(aspect, 1);
  const h = scale * (aspect < 1 ? 1 : 1 / aspect);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[w + 0.4, h + 0.4]} />
        <meshBasicMaterial color="#d4a843" transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[w + 0.06, h + 0.06]} />
        <meshBasicMaterial color="#d4a843" transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ── Scene ── */
function Scene({ mobile }: { mobile: boolean }) {
  return (
    <>
      <SmoothCamera mobile={mobile} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 3, 5]} intensity={0.3} color="#d4a843" />

      <Photo mobile={mobile} />

      <Ring radius={mobile ? 1.8 : 2.3} speed={0.15} opacity={0.2} rot={[Math.PI / 2, 0, 0]} />
      {!mobile && <Ring radius={2.8} speed={-0.08} opacity={0.08} rot={[Math.PI / 3, Math.PI / 6, 0]} />}

      <Particles count={mobile ? 35 : 80} />
    </>
  );
}

export function HeroScene() {
  useScrollProgress();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    const onResize = () => setMobile(isMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, mobile ? 6.5 : 5.5], fov: mobile ? 55 : 50 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={1}
        style={{ background: "#050505" }}
      >
        <Suspense fallback={null}>
          <Scene mobile={mobile} />
        </Suspense>
      </Canvas>

      {/* CSS vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 150px 40px #050505" }} />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10" id="hero-text-overlay">
        <div className="absolute" style={{ top: "14%" }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display tracking-[0.3em] sm:tracking-[0.4em] text-[#d4a843] glow-text-strong">
            WANTED
          </h1>
        </div>
        <div className="absolute text-center px-4" style={{ bottom: "16%" }}>
          <p className="text-sm sm:text-base md:text-lg font-display tracking-[0.15em] sm:tracking-[0.2em] text-[#f5e6c8] glow-text mb-2">
            SUBJECT: POTATO SMASHER
          </p>
          <p className="text-[8px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.35em] text-[#8b6914] font-mono">
            BUREAU OF POTATO INVESTIGATION
          </p>
          <p className="text-[7px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] text-[#5a4520] font-mono mt-1">
            CASE FILE #PSM-2026-0042 // CLASSIFIED
          </p>
        </div>
      </div>
    </div>
  );
}
