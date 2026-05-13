import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  // Environment,
  PointMaterial,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
// import { PostProcessingEffects } from "./PostProcessingEffects";

function ConnectionLines({ nodes }: { nodes: [number, number, number][] }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const maxDistance = 8;
  const linePositions = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i][0] - nodes[j][0], 2) +
            Math.pow(nodes[i][1] - nodes[j][1], 2) +
            Math.pow(nodes[i][2] - nodes[j][2], 2),
        );
        if (dist < maxDistance) {
          positions.push(...nodes[i], ...nodes[j]);
        }
      }
    }
    return new Float32Array(positions);
  }, [nodes]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      if (material) {
        material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00D4FF"
        transparent
        opacity={0.15}
        linewidth={1}
      />
    </lineSegments>
  );
}

function CityGrid({
  mouse,
  scrollProgress,
}: {
  mouse: { x: number; y: number };
  scrollProgress: number;
}) {
  const meshRef = useRef<THREE.Points>(null);
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 40;
      pos[i + 1] = (Math.random() - 0.5) * 20;
      pos[i + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        state.clock.elapsedTime * 0.05 + scrollProgress * 2;
      meshRef.current.rotation.x = mouse.y * 0.1 + scrollProgress * 0.5;
      meshRef.current.rotation.z = mouse.x * 0.1;
      meshRef.current.position.z = -scrollProgress * 10;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#00D4FF"
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </points>
  );
}

function ConnectedNodes({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const count = 50;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const nodes = useMemo(() => {
    const nodePositions: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      nodePositions.push([
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20,
      ]);
    }
    return nodePositions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        state.clock.elapsedTime * 0.02 + scrollProgress * 0.5;
      groupRef.current.position.z = -scrollProgress * 5;
    }

    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const mesh = meshRef.current;
      nodes.forEach((position, i) => {
        dummy.position.set(position[0], position[1], position[2]);
        const floatY = Math.sin(time * 2 + i * 0.5) * 0.3;
        dummy.position.y += floatY;
        dummy.rotation.set(
          Math.sin(time + i) * 0.2,
          time * 0.5 + i * 0.1,
          Math.cos(time + i) * 0.2,
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;

      // Update emissive intensity once per frame
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ConnectionLines nodes={nodes} />
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.15, 4, 4]} />
        <meshStandardMaterial
          color="#6366F1"
          emissive="#6366F1"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </instancedMesh>
    </group>
  );
}

function Scene({
  mouse,
  scrollProgress,
}: {
  mouse: { x: number; y: number };
  scrollProgress: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.02;
    camera.position.z = 15 - scrollProgress * 8;
    camera.lookAt(0, 0, -scrollProgress * 5);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
      {/* <Environment preset="city" /> */}
      <fog attach="fog" args={["#050B18", 10, 50]} />

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00D4FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#6366F1" />
      <pointLight position={[0, 10, -10]} intensity={0.6} color="#8B5CF6" />

      <CityGrid mouse={mouse} scrollProgress={scrollProgress} />
      <ConnectedNodes scrollProgress={scrollProgress} />
    </>
  );
}

export function HeroScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        {/* <Perf position="top-left" /> */}
        <Suspense fallback={null}>
          <Scene mouse={mouse.current} scrollProgress={scrollProgress} />
          {/* <PostProcessingEffects scrollProgress={scrollProgress} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
