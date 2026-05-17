import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, PerspectiveCamera } from "@react-three/drei";
import { useScroll } from "framer-motion";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import PropTypes from "prop-types";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

// --- Deep Space Shaders ---

const deepSpaceVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const deepSpaceFragmentShader = `
  varying vec2 vUv;
  uniform float time;
  uniform float scroll;
  uniform vec3 color1;
  uniform vec3 color2;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; ++i) {
      v += a * noise(p);
      p = rot * p * 2.2 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= 1.77; // Aspect ratio

    // Distant cosmic gas
    float n1 = fbm(p * 0.5 + time * 0.01 + scroll * 0.05);
    float n2 = fbm(p * 1.2 - time * 0.005 + n1 * 0.3);

    float intensity = pow(n2, 3.5);
    vec3 color = mix(color1, color2, n2);

    // Smooth falloff to keep it "away"
    float d = length(p);
    float mask = smoothstep(1.8, 0.2, d);

    gl_FragColor = vec4(color, intensity * 0.15 * mask);
  }
`;

const scrollProgressShape = PropTypes.shape({
  get: PropTypes.func.isRequired,
});

// --- Dark Particles for Light Mode ---

const DarkParticles = ({ count = 600 }) => {
  const pointsRef = useRef(null);

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300 - 150;
    }
    return pos;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={1.2} color="#1a1a1a" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
};

DarkParticles.propTypes = {
  count: PropTypes.number,
};

const CelestialVoid = ({ scrollYProgress }) => {
  const groupRef = useRef(null);
  const { theme } = useTheme();

  useFrame((state, delta) => {
    const scroll = scrollYProgress.get();
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
      groupRef.current.rotation.x = scroll * 0.1;
      groupRef.current.position.z = scroll * 3;
    }
  });

  return (
    <group ref={groupRef}>
      {theme === "dark" ? (
        <>
          <Stars radius={350} depth={100} count={10000} factor={4} saturation={0} fade speed={0.1} />
          <Stars radius={200} depth={50} count={2000} factor={6} saturation={1} fade speed={0.5} />
        </>
      ) : (
        <DarkParticles count={1500} />
      )}
      <DistantGlow scrollYProgress={scrollYProgress} />
    </group>
  );
};

CelestialVoid.propTypes = {
  scrollYProgress: scrollProgressShape.isRequired,
};

const DistantGlow = ({ scrollYProgress }) => {
  const { viewport } = useThree();
  const { theme } = useTheme();

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    scroll: { value: 0 },
    color1: { value: new THREE.Color(theme === "light" ? "#f8fafc" : "#020412") },
    color2: { value: new THREE.Color(theme === "light" ? "#FFD700" : "#2a3a7a") }
  }), [theme]);

  useFrame((state) => {
    // eslint-disable-next-line react-hooks/immutability
    uniforms.time.value = state.clock.getElapsedTime();
    uniforms.scroll.value = scrollYProgress.get();
  });

  return (
    <mesh position={[0, 0, -180]} scale={[viewport.width * 12, viewport.height * 12, 1]}>
      <planeGeometry />
      <shaderMaterial
        vertexShader={deepSpaceVertexShader}
        fragmentShader={deepSpaceFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

DistantGlow.propTypes = {
  scrollYProgress: scrollProgressShape.isRequired,
};

// --- Main Background Component ---

const CosmicBackground = () => {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000"
      style={{
        background: isDark
          ? "radial-gradient(circle at center, #020205 0%, #000000 100%)"
          : "radial-gradient(circle at center, #ffffff 0%, #f4f4f5 100%)"
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, stencil: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={45} far={1000} />
        <ambientLight intensity={isDark ? 0.05 : 0.9} />

        <CelestialVoid scrollYProgress={scrollYProgress} />

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={isDark ? 0.2 : 0.95}
            mipmapBlur
            intensity={isDark ? 0.8 : 0.4}
            radius={0.3}
          />
          <Noise opacity={0.012} />
          <Vignette eskil={false} offset={0.1} darkness={1.3} />
        </EffectComposer>
      </Canvas>

      {/* Atmospheric Post-Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: isDark ? 0.4 : 0.05,
            background: "radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.9) 100%)"
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
        />
      </div>
    </div>
  );
};

export default CosmicBackground;
