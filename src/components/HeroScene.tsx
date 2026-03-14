import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 250 }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#e8910c" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function FloatingOrb({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.5;
    ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.3;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.z = t * 0.15;
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.6, 4]} />
      <meshStandardMaterial color={color} roughness={0.15} metalness={0.8} transparent opacity={0.5} />
    </mesh>
  );
}

function FloatingRing({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.3;
    ref.current.rotation.z = clock.getElapsedTime() * 0.2;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.8, 0.06, 16, 64]} />
      <meshStandardMaterial color="#e8910c" metalness={0.9} roughness={0.1} transparent opacity={0.45} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffa040" />
        <pointLight position={[-3, 2, 4]} intensity={0.6} color="#ff8800" />
        <pointLight position={[3, -2, 2]} intensity={0.4} color="#1a1a3e" />

        <FloatingOrb position={[-2.5, 1.2, -1]} color="#e8910c" speed={1.2} />
        <FloatingOrb position={[2.8, -0.8, -2]} color="#1e293b" speed={0.8} />
        <FloatingOrb position={[0.5, 2, -1.5]} color="#c2710a" speed={1} />
        <FloatingRing position={[-1.5, -1.5, -1]} />
        <FloatingRing position={[2, 1.5, -2]} />
        <Particles count={300} />
      </Canvas>
    </div>
  );
}
