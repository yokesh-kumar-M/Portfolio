import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { useScroll } from "framer-motion";
import PropTypes from "prop-types";

/**
 * HelmetScene — the cinematic centrepiece.
 *
 * Loads a sci-fi helmet (Khronos DamagedHelmet, CC-BY) and rotates it
 * continuously as the user scrolls — two full revolutions across the page —
 * with subtle X-tilt, scale shifts, and a small camera dolly. PBR materials
 * lit by Drei's Environment preset + manual three-point lights for robustness.
 *
 * Scroll zones:
 *   0    – 0.08   Hero        helmet right-of-centre, big (scale 1.6)
 *   0.08 – 0.85   Content     helmet right side, small (scale 0.7) — peeks behind text
 *   0.85 – 1      Contact     helmet centre, BIG (scale 2.0) — finale
 */
const MODEL_URL = "/models/DamagedHelmet.glb";

useGLTF.preload(MODEL_URL);

const refShape = PropTypes.shape({
  current: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
});

function Helmet({ scrollRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const s = scrollRef.current;

    // Continuous Y rotation — 2 full revs across the page
    const tgtRotY = -s * Math.PI * 4;
    // Subtle X tilt — wobble tied to scroll, with idle breathing
    const tgtRotX = Math.sin(s * Math.PI * 6) * 0.18 + Math.sin(t * 0.5) * 0.05;

    const g = groupRef.current;
    g.rotation.y += (tgtRotY - g.rotation.y) * 0.08;
    g.rotation.x += (tgtRotX - g.rotation.x) * 0.08;

    // Position + scale per zone
    let tx = 0;
    let ty = 0;
    let ts = 1.6;
    if (s < 0.08) {
      tx = 1.5;
      ts = 1.6;
    } else if (s < 0.85) {
      tx = 1.6;
      ts = 0.7;
    } else {
      tx = 0;
      ts = 2.0;
    }

    g.position.x += (tx - g.position.x) * 0.05;
    g.position.y += (ty - g.position.y) * 0.05;
    const cs = g.scale.x;
    g.scale.setScalar(cs + (ts - cs) * 0.05);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
Helmet.propTypes = { scrollRef: refShape.isRequired };

function CameraRig({ scrollRef }) {
  const { camera } = useThree();
  useFrame(() => {
    const s = scrollRef.current;
    const zTarget = 5 - s * 0.6;
    /* eslint-disable react-hooks/immutability */
    camera.position.z += (zTarget - camera.position.z) * 0.04;
    camera.rotation.z = Math.sin(s * Math.PI) * 0.02;
    /* eslint-enable react-hooks/immutability */
  });
  return null;
}
CameraRig.propTypes = { scrollRef: refShape.isRequired };

function SceneContent({ scrollRef }) {
  return (
    <>
      {/* 3-point manual lighting (works even if Environment HDR fails) */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} color="#fff3d8" />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#8aafff" />
      <pointLight position={[0, -2, 4]} intensity={1.3} color="#e8a838" distance={14} />
      <pointLight position={[3, 3, -3]} intensity={0.6} color="#ff6644" distance={10} />

      {/* HDR environment for PBR reflections (from drei CDN) */}
      <Environment preset="city" />

      <CameraRig scrollRef={scrollRef} />

      <Suspense fallback={null}>
        <Helmet scrollRef={scrollRef} />
      </Suspense>
    </>
  );
}
SceneContent.propTypes = { scrollRef: refShape.isRequired };

const HelmetScene = () => {
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
  }, [scrollYProgress]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none" aria-hidden="true">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          stencil: false,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 5], fov: 35, far: 100 }}
      >
        <SceneContent scrollRef={scrollRef} />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.45} intensity={0.55} mipmapBlur radius={0.6} />
          <ChromaticAberration offset={[0.0006, 0.0006]} />
          <Vignette offset={0.15} darkness={0.45} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default HelmetScene;
