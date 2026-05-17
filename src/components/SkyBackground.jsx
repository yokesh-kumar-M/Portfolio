import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, SoftShadows } from "@react-three/drei";
import { useScroll } from "framer-motion";
import PropTypes from "prop-types";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

const scrollRefShape = PropTypes.shape({
  current: PropTypes.number,
});

const ACCENT_GOLD = "#E8A838";

// 3D Celestial scene
const CelestialBody = ({ theme, scrollYProgress }) => {
  const meshRef = useRef(null);
  const glowRef = useRef(null);

  useFrame((state, delta) => {
    const scroll = scrollYProgress.current || 0;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = scroll * Math.PI * 2;

      const targetX = 12 - scroll * 24;
      const targetY = 8 - scroll * 12;

      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
      meshRef.current.position.z = -15 + Math.sin(scroll * Math.PI) * 5;

      if (glowRef.current) {
        glowRef.current.position.copy(meshRef.current.position);
      }
    }
  });

  const isLight = theme === "light";

  return (
    <>
      <ambientLight intensity={isLight ? 0.3 : 0.05} color={isLight ? "#ffffff" : "#4466aa"} />
      <directionalLight position={[10, 10, 5]} intensity={isLight ? 2 : 0.5} color={isLight ? "#ffebaa" : "#88aaff"} />

      {/* Glow / Halo Effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[isLight ? 3 : 2.5, 32, 32]} />
        <meshBasicMaterial
          color={isLight ? ACCENT_GOLD : "#88aaff"}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main Body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[isLight ? 2.5 : 2.2, 64, 64]} />
        <meshStandardMaterial
          color={isLight ? "#ffcc00" : "#cbd4e0"}
          emissive={isLight ? ACCENT_GOLD : "#1a2436"}
          emissiveIntensity={isLight ? 1.5 : 0.8}
          roughness={isLight ? 0.2 : 0.8}
          metalness={isLight ? 0.1 : 0.2}
          wireframe={false}
        />
        {/* Subtle wireframe overlay for tech aesthetic */}
        <mesh>
          <sphereGeometry args={[isLight ? 2.51 : 2.21, 32, 32]} />
          <meshBasicMaterial
            color={isLight ? "#ffffff" : "#4466aa"}
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      </mesh>
    </>
  );
};

CelestialBody.propTypes = {
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  scrollYProgress: scrollRefShape.isRequired,
};

// Cyber particles that float around
const TechParticles = ({ theme, scrollYProgress }) => {
  const pointsRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile ? 100 : 300;

  const [particleData] = useState(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  });

  useFrame(() => {
    if (pointsRef.current) {
      const scroll = scrollYProgress.current || 0;
      pointsRef.current.rotation.y = scroll * Math.PI;
      pointsRef.current.position.y = scroll * 10;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particleData}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={theme === "light" ? ACCENT_GOLD : "#ffffff"}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

TechParticles.propTypes = {
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  scrollYProgress: scrollRefShape.isRequired,
};

const SkyBackground = () => {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);

  // Sync framer-motion scroll with a mutable ref for R3F
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
  }, [scrollYProgress]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const dpr = isMobile ? 1 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000"
      style={{ background: theme === "light" ? "#f4f4f5" : "#020205" }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={dpr}
      >
        <SoftShadows size={20} samples={16} focus={0.5} />

        {theme === "dark" && (
          <Stars radius={100} depth={50} count={isMobile ? 1500 : 3000} factor={4} saturation={0.5} fade speed={0.5} />
        )}

        <CelestialBody theme={theme} scrollYProgress={scrollRef} />
        <TechParticles theme={theme} scrollYProgress={scrollRef} />
      </Canvas>

      {/* Post-processing visual overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)] shrink-0" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
    </div>
  );
};

export default SkyBackground;
