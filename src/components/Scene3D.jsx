import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { useScroll } from "framer-motion";
import PropTypes from "prop-types";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";
import profileImg from "../assets/me.png";

/* ───────────────────────────────────────────────────────────────
   ASSETS — the security/dev tools that orbit the portrait
   ─────────────────────────────────────────────────────────────── */
const TOOL_ICONS = [
  "/symbols/burpsuite.png",
  "/symbols/metasploit.png",
  "/symbols/nmap.png",
  "/symbols/wireshark.png",
  "/symbols/nessus.png",
  "/symbols/splunk.png",
  "/symbols/python.png",
  "/symbols/javascript.png",
  "/symbols/docker.png",
  "/symbols/linux.png",
  "/symbols/owasp.png",
  "/symbols/mitre_attck.png",
];

const refShape = PropTypes.shape({
  current: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
});

const ACCENT_GOLD = "#E8A838";
const ACCENT_GLOW = "#8a6f1a";

/* ───────────────────────────────────────────────────────────────
   FORMATIONS — target position per tool, per scroll zone
   Scroll is normalised [0,1] across the page. Each zone below
   roughly corresponds to a section in App.jsx.
   ─────────────────────────────────────────────────────────────── */
const HERO_ZONE = (xR, _xL, idx, total, t) => {
  const a = (idx / total) * Math.PI * 2 + t * 0.35;
  const r = 2.55 + Math.sin(idx * 1.3 + t * 0.3) * 0.18;
  return [
    xR + Math.cos(a) * r,
    Math.sin(idx * 0.7 + t * 0.5) * 0.7,
    Math.sin(a) * r * 0.55 - 0.6,
  ];
};
const ABOUT_ZONE = (_xR, xL, idx, _total, t) => {
  const cols = 3;
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  return [
    xL - 0.6 + col * 0.85 + Math.sin(t + idx) * 0.04,
    1.7 - row * 0.95,
    -0.5,
  ];
};
const EDUCATION_ZONE = (_xR, xL, idx, total, t) => {
  const offset = (idx - (total - 1) / 2) / total;
  return [
    xL + Math.sin(idx * 0.8 + t * 0.4) * 0.2,
    offset * 4.4,
    -0.8 + Math.cos(idx * 0.5 + t * 0.3) * 0.12,
  ];
};
const SERVICES_ZONE = (xR, _xL, idx, total, t) => {
  const fanA = -Math.PI / 3 + (idx / (total - 1)) * ((2 * Math.PI) / 3);
  const r = 2.8;
  return [
    xR + Math.cos(fanA) * r * 0.55 - 0.8,
    Math.sin(fanA) * r * 0.65,
    -0.5 + Math.cos(t + idx) * 0.1,
  ];
};
const CERTS_ZONE = (_xR, _xL, idx, _total, t) => {
  const group = idx % 4;
  const sub = Math.floor(idx / 4);
  const gx = -2.5 + (group % 2) * 5.0;
  const gy = 1.4 - Math.floor(group / 2) * 2.8;
  return [
    gx + Math.sin(idx + t * 0.6) * 0.25,
    gy + Math.cos(idx + t * 0.6) * 0.25 + (sub - 1) * 0.35,
    -0.5,
  ];
};
const SKILLS_ZONE = (xR, _xL, idx) => {
  const cols = 4;
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  return [xR - 1.3 + col * 0.85, 1.4 - row * 1.1, -0.4];
};
const EXPERIENCE_ZONE = (xR, _xL, idx, total, t) => {
  const offset = (idx - (total - 1) / 2) / total;
  return [xR + Math.cos(idx + t * 0.4) * 0.2, offset * 4.6, -0.8];
};
const PROJECTS_ZONE = (_xR, _xL, idx, total, t) => {
  const a = (idx / total) * Math.PI * 2 + t * 0.8;
  return [Math.cos(a) * 3.4, Math.sin(t + idx) * 0.4, Math.sin(a) * 2.4 - 0.4];
};
const CONTACT_ZONE = (_xR, _xL, idx, total, t) => {
  const a = (idx / total) * Math.PI * 2 + t * 0.2;
  const r = 4.2 + Math.sin(t + idx) * 0.4;
  return [Math.cos(a) * r, Math.sin(a) * r * 0.6, -1 + Math.sin(t + idx) * 0.3];
};

const TOOL_ZONES = [
  [0.10, HERO_ZONE],
  [0.22, ABOUT_ZONE],
  [0.32, EDUCATION_ZONE],
  [0.43, SERVICES_ZONE],
  [0.55, CERTS_ZONE],
  [0.67, SKILLS_ZONE],
  [0.78, EXPERIENCE_ZONE],
  [0.88, PROJECTS_ZONE],
];

function getToolTarget(scroll, idx, total, t, vw) {
  const xR = Math.min(vw * 0.22, 3.2);
  const xL = -xR;
  for (const [threshold, zoneFn] of TOOL_ZONES) {
    if (scroll < threshold) return zoneFn(xR, xL, idx, total, t);
  }
  return CONTACT_ZONE(xR, xL, idx, total, t);
}

// Portrait target position + scale per scroll zone
function getPortraitTarget(scroll, vw) {
  const xR = Math.min(vw * 0.22, 3.2);
  const xL = -xR * 0.85;
  // [x, y, z, scale]
  if (scroll < 0.10) return [xR, 0, 0, 1.0];
  if (scroll < 0.22) return [xR * 1.05, -0.15, -0.4, 0.85];
  if (scroll < 0.32) return [xR, 0.05, -0.8, 0.75];
  if (scroll < 0.43) return [xL, 0, -0.8, 0.75];
  if (scroll < 0.55) return [xL * 0.7, 0.05, -0.5, 0.85];
  if (scroll < 0.67) return [xL, 0, -0.5, 0.85];
  if (scroll < 0.78) return [xL * 1.15, 0, -0.8, 0.75];
  if (scroll < 0.88) return [0, 0.4, -2.2, 0.65];
  return [0, 0, 0, 1.15];
}

/* ───────────────────────────────────────────────────────────────
   FloatingTool — a single sprite that animates to its formation
   ─────────────────────────────────────────────────────────────── */
function FloatingTool({ texture, idx, total, scrollRef }) {
  const ref = useRef(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef.current;
    const vw = state.viewport.width;
    const [tx, ty, tz] = getToolTarget(scroll, idx, total, t, vw);
    target.set(tx, ty, tz);
    ref.current.position.lerp(target, 0.045);
  });

  return (
    <sprite ref={ref} scale={[0.72, 0.72, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

FloatingTool.propTypes = {
  texture: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  scrollRef: refShape.isRequired,
};

function ToolsCluster({ scrollRef }) {
  const textures = useTexture(TOOL_ICONS);
  useEffect(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
    });
  }, [textures]);

  return (
    <group>
      {TOOL_ICONS.map((src, i) => (
        <FloatingTool
          key={src}
          texture={textures[i]}
          idx={i}
          total={TOOL_ICONS.length}
          scrollRef={scrollRef}
        />
      ))}
    </group>
  );
}

ToolsCluster.propTypes = { scrollRef: refShape.isRequired };

/* ───────────────────────────────────────────────────────────────
   Portrait — 2.5D layered (back glow + photo + ring/brackets)
   Each layer parallaxes with the mouse at a different rate.
   ─────────────────────────────────────────────────────────────── */
function Portrait({ scrollRef, mouseRef }) {
  const photo = useTexture(profileImg);
  useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    photo.colorSpace = THREE.SRGBColorSpace;
    photo.anisotropy = 8;
    /* eslint-enable react-hooks/immutability */
  }, [photo]);

  const groupRef = useRef(null);
  const backRef = useRef(null);
  const midRef = useRef(null);
  const frontRef = useRef(null);
  const scanRef = useRef(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  const W = 2.0;
  const H = 2.45;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollRef.current;
    const [mx, my] = mouseRef.current;
    const vw = state.viewport.width;
    const [tx, ty, tz, scale] = getPortraitTarget(scroll, vw);

    // Position with a gentle bob
    target.set(tx, ty + Math.sin(t * 0.6) * 0.06, tz);
    groupRef.current.position.lerp(target, 0.04);

    // Scale lerp
    const sCur = groupRef.current.scale.x;
    const sNext = sCur + (scale - sCur) * 0.04;
    groupRef.current.scale.setScalar(sNext);

    // Tilt with mouse + a slow spin tied to scroll
    const rotYTarget = mx * 0.18 + scroll * 0.35;
    const rotXTarget = -my * 0.12;
    groupRef.current.rotation.y += (rotYTarget - groupRef.current.rotation.y) * 0.06;
    groupRef.current.rotation.x += (rotXTarget - groupRef.current.rotation.x) * 0.06;

    // 2.5D parallax — layers shift at different rates with the mouse
    if (backRef.current) {
      backRef.current.position.x = -mx * 0.20;
      backRef.current.position.y = -my * 0.20;
    }
    if (midRef.current) {
      midRef.current.position.x = mx * 0.06;
      midRef.current.position.y = my * 0.06;
    }
    if (frontRef.current) {
      frontRef.current.position.x = mx * 0.30 + Math.sin(t * 0.7) * 0.02;
      frontRef.current.position.y = my * 0.30 + Math.cos(t * 0.6) * 0.02;
      frontRef.current.rotation.z = Math.sin(t * 0.25) * 0.06;
    }
    // Scanline sweep over the photo
    if (scanRef.current) {
      const cycle = (t * 0.35) % 1;
      scanRef.current.position.y = H / 2 - cycle * H;
      scanRef.current.material.opacity = 0.35 * (1 - Math.abs(cycle - 0.5) * 1.6);
    }
  });

  return (
    <group ref={groupRef}>
      {/* BACK — warm halo glow */}
      <mesh ref={backRef} position={[0, 0, -0.6]}>
        <circleGeometry args={[1.85, 64]} />
        <meshBasicMaterial
          color={ACCENT_GOLD}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* BACK 2 — secondary cool glow for depth */}
      <mesh position={[0.15, -0.1, -0.5]}>
        <circleGeometry args={[1.55, 48]} />
        <meshBasicMaterial
          color={ACCENT_GLOW}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* MID — the photo */}
      <group ref={midRef}>
        <mesh>
          <planeGeometry args={[W, H, 1, 1]} />
          <meshBasicMaterial map={photo} transparent toneMapped={false} side={THREE.DoubleSide} />
        </mesh>

        {/* Scanline sweep (above photo plane) */}
        <mesh ref={scanRef} position={[0, 0, 0.01]}>
          <planeGeometry args={[W, 0.04]} />
          <meshBasicMaterial
            color={ACCENT_GOLD}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* FRONT — ring + corner HUD brackets */}
      <group ref={frontRef} position={[0, 0, 0.35]}>
        {/* Crisp outer ring */}
        <mesh>
          <ringGeometry args={[1.32, 1.345, 96]} />
          <meshBasicMaterial
            color={ACCENT_GOLD}
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        {/* Soft glow ring */}
        <mesh>
          <ringGeometry args={[1.36, 1.55, 96]} />
          <meshBasicMaterial
            color={ACCENT_GOLD}
            transparent
            opacity={0.10}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Corner HUD brackets */}
        {[
          [-1, 1],
          [1, 1],
          [-1, -1],
          [1, -1],
        ].map(([sx, sy]) => (
          <group key={`${sx}-${sy}`} position={[sx * W * 0.56, sy * H * 0.55, 0]}>
            <mesh position={[sx * -0.1, 0, 0]}>
              <planeGeometry args={[0.22, 0.025]} />
              <meshBasicMaterial color={ACCENT_GOLD} transparent opacity={0.9} toneMapped={false} />
            </mesh>
            <mesh position={[0, sy * -0.1, 0]}>
              <planeGeometry args={[0.025, 0.22]} />
              <meshBasicMaterial color={ACCENT_GOLD} transparent opacity={0.9} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

Portrait.propTypes = {
  scrollRef: refShape.isRequired,
  mouseRef: refShape.isRequired,
};

/* ───────────────────────────────────────────────────────────────
   Nebula — distant cosmic shader plane behind everything
   ─────────────────────────────────────────────────────────────── */
const nebulaVS = `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const nebulaFS = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uA;
  uniform vec3 uB;
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.1; a *= 0.5; }
    return v;
  }
  void main(){
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= 1.6;
    float n = fbm(p * 1.1 + uTime * 0.014 + uScroll * 0.45);
    float n2 = fbm(p * 2.2 - uTime * 0.008 + n * 0.4);
    vec3 col = mix(uA, uB, smoothstep(0.2, 0.85, n2));
    float d = length(p);
    float mask = smoothstep(1.7, 0.25, d);
    gl_FragColor = vec4(col, pow(n2, 3.0) * 0.20 * mask);
  }
`;

function Nebula({ scrollRef }) {
  const { viewport } = useThree();
  const { theme } = useTheme();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uA: { value: new THREE.Color(theme === "dark" ? "#06051a" : "#fff8e0") },
      uB: { value: new THREE.Color(theme === "dark" ? "#2a1858" : "#e8a838") },
    }),
    [theme]
  );

  useFrame((state) => {
    /* eslint-disable react-hooks/immutability */
    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uScroll.value = scrollRef.current;
    /* eslint-enable react-hooks/immutability */
  });

  return (
    <mesh position={[0, 0, -16]} scale={[viewport.width * 5, viewport.height * 5, 1]}>
      <planeGeometry />
      <shaderMaterial
        vertexShader={nebulaVS}
        fragmentShader={nebulaFS}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

Nebula.propTypes = { scrollRef: refShape.isRequired };

/* ───────────────────────────────────────────────────────────────
   Light-mode "dark dust" particles (substitute for stars on light)
   ─────────────────────────────────────────────────────────────── */
function DarkDust({ count = 1200 }) {
  const ref = useRef(null);
  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 120 - 40;
    }
    return arr;
  });

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.0}
        color="#1a1a17"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

DarkDust.propTypes = { count: PropTypes.number };

/* ───────────────────────────────────────────────────────────────
   CameraRig — subtle dolly + roll tied to scroll
   ─────────────────────────────────────────────────────────────── */
function CameraRig({ scrollRef }) {
  const { camera } = useThree();
  useFrame(() => {
    const s = scrollRef.current;
    const zTarget = 8 + Math.sin(s * Math.PI * 2) * 0.7;
    /* eslint-disable react-hooks/immutability */
    camera.position.z += (zTarget - camera.position.z) * 0.03;
    camera.rotation.z = Math.sin(s * Math.PI) * 0.025;
    /* eslint-enable react-hooks/immutability */
  });
  return null;
}

CameraRig.propTypes = { scrollRef: refShape.isRequired };

/* ───────────────────────────────────────────────────────────────
   SceneContent — everything inside the Canvas
   ─────────────────────────────────────────────────────────────── */
function SceneContent({ scrollRef, mouseRef }) {
  const { theme } = useTheme();
  return (
    <>
      <ambientLight intensity={theme === "light" ? 0.85 : 0.5} />
      <directionalLight position={[6, 8, 6]} intensity={theme === "light" ? 0.8 : 0.6} color="#fff" />
      <CameraRig scrollRef={scrollRef} />

      {theme === "dark" ? (
        <>
          <Stars radius={260} depth={80} count={5000} factor={4} saturation={0} fade speed={0.3} />
          <Stars radius={140} depth={40} count={1400} factor={6} saturation={0.6} fade speed={0.7} />
        </>
      ) : (
        <DarkDust count={1200} />
      )}

      <Nebula scrollRef={scrollRef} />

      <Suspense fallback={null}>
        <Portrait scrollRef={scrollRef} mouseRef={mouseRef} />
        <ToolsCluster scrollRef={scrollRef} />
      </Suspense>
    </>
  );
}

SceneContent.propTypes = {
  scrollRef: refShape.isRequired,
  mouseRef: refShape.isRequired,
};

/* ───────────────────────────────────────────────────────────────
   Main export — Scene3D
   ─────────────────────────────────────────────────────────────── */
export default function Scene3D() {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);
  const mouseRef = useRef([0, 0]);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
  }, [scrollYProgress]);

  useEffect(() => {
    let pendingX = 0;
    let pendingY = 0;
    let raf = 0;
    const onMove = (e) => {
      pendingX = (e.clientX / window.innerWidth) * 2 - 1;
      pendingY = -(e.clientY / window.innerHeight) * 2 + 1;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          mouseRef.current = [pendingX, pendingY];
          raf = 0;
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000"
      style={{
        background:
          theme === "light"
            ? "radial-gradient(ellipse at 50% 30%, #fff8e7 0%, #f3f1ea 60%, #e2dfd6 100%)"
            : "radial-gradient(ellipse at 50% 30%, #0a0816 0%, #050409 60%, #000000 100%)",
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          stencil: false,
          powerPreference: "high-performance",
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 8], fov: 45, far: 500 }}
      >
        <SceneContent scrollRef={scrollRef} mouseRef={mouseRef} />

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={theme === "dark" ? 0.15 : 0.55}
            mipmapBlur
            intensity={theme === "dark" ? 0.7 : 0.45}
            radius={0.5}
          />
          <Noise opacity={0.012} />
          <Vignette
            eskil={false}
            offset={0.15}
            darkness={theme === "dark" ? 0.95 : 0.45}
          />
        </EffectComposer>
      </Canvas>

      {/* Atmospheric overlays sit OUTSIDE the canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: theme === "dark" ? 0.45 : 0.06,
            background:
              "radial-gradient(circle at 50% 50%, transparent 25%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      </div>
    </div>
  );
}
