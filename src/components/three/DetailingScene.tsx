'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const STAGES = [
  { id: 'dirty', bgColor: '#211e1a', name: 'Before detailing', description: 'The starting point. Every surface, carefully assessed.', color: '#c7ae8c' },
  { id: 'correction', bgColor: '#111c29', name: 'Paint correction', description: 'Precision polishing. Depth and clarity restored.', color: '#9fc5e8' },
  { id: 'perfect', bgColor: '#0b211b', name: 'Ceramic finish', description: 'Deep gloss. Sculpted reflections. Lasting protection.', color: '#64e2c1' },
];

function Car({ stage }: { stage: number }) {
  const { scene } = useGLTF('/models/ferrari.glb', '/draco/');
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const name = object.name.toLowerCase();
      if (name === 'body') {
        object.material = new THREE.MeshPhysicalMaterial({
          color: stage === 0 ? '#726c63' : stage === 1 ? '#607f9c' : '#8dacc5',
          metalness: 0.85, roughness: stage === 0 ? 0.48 : 0.19,
          clearcoat: 1, clearcoatRoughness: 0.08,
        });
      } else if (name === 'glass') {
        object.material = new THREE.MeshPhysicalMaterial({ color: '#14202b', metalness: 0.3, roughness: 0.08, clearcoat: 1 });
      } else if (name.startsWith('rim') || name === 'trim') {
        object.material = new THREE.MeshStandardMaterial({ color: '#a4a9af', metalness: 0.95, roughness: 0.22 });
      } else {
        object.material = Array.isArray(object.material) ? object.material.map((m) => m.clone()) : object.material.clone();
      }
    });
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 5.4 / Math.max(size.x, size.y, size.z);
    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -bounds.min.y * scale + 0.025, -center.z * scale);
    return clone;
  }, [scene, stage]);
  useEffect(() => () => {
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => m.dispose());
      }
    });
  }, [model]);
  return <primitive object={model} />;
}

function Garage() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#333a40" roughness={0.3} metalness={0.35} />
      </mesh>
      {/* Rear wall and framed sectional garage door. */}
      <RoundedBox args={[15, 6, 0.24]} position={[0, 3, 5.5]} radius={0.06}>
        <meshStandardMaterial color="#191f25" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[6.4, 3.7, 0.16]} position={[0, 1.85, 5.29]} radius={0.03}>
        <meshStandardMaterial color="#080c11" metalness={0.6} roughness={0.5} />
      </RoundedBox>
      {Array.from({ length: 10 }, (_, i) => (
        <RoundedBox key={i} args={[6.1, 0.3, 0.08]} position={[0, 0.22 + i * 0.35, 5.16]} radius={0.015}>
          <meshStandardMaterial color={i % 2 ? '#323a42' : '#2a323a'} metalness={0.5} roughness={0.45} />
        </RoundedBox>
      ))}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 7.4, 3, 0]}>
            <boxGeometry args={[0.2, 6, 11]} />
            <meshStandardMaterial color="#252d34" roughness={0.7} />
          </mesh>
          <mesh position={[side * 3.5, 2.2, 5.03]}>
            <boxGeometry args={[0.055, 4, 0.045]} />
            <meshStandardMaterial color="#c5eeff" emissive="#9ddfff" emissiveIntensity={3} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[side * 6.7, 2.3, 3.5 - i * 2.8]} rotation={[0, 0, side * -0.22]}>
              <boxGeometry args={[0.06, 3.8, 0.1]} />
              <meshStandardMaterial color="#e4f1ff" emissive="#cbe6ff" emissiveIntensity={4} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Service cabinets and detailing equipment. */}
      {[-5.6, 5.6].map((x) => (
        <group key={x} position={[x, 0, 4.6]}>
          <RoundedBox args={[1.65, 1.05, 0.65]} position={[0, 0.55, 0]} radius={0.04}>
            <meshStandardMaterial color="#20262c" metalness={0.6} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 1.1, 0]}><boxGeometry args={[1.8, 0.06, 0.8]} /><meshStandardMaterial color="#9ba4a9" metalness={0.9} roughness={0.3} /></mesh>
          {[0.3, 0.55, 0.8].map((y) => <mesh key={y} position={[0, y, -0.34]}><boxGeometry args={[1.4, 0.025, 0.035]} /><meshStandardMaterial color="#89969b" metalness={0.7} /></mesh>)}
          {[-0.45, 0, 0.45].map((bx, i) => <mesh key={bx} position={[bx, 1.28, 0]}><cylinderGeometry args={[0.06, 0.075, 0.3, 12]} /><meshStandardMaterial color={i === 1 ? '#65b9a5' : '#b8c5cd'} roughness={0.4} /></mesh>)}
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 5.1, 3 - i * 3]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.5, 0.12]} />
          <meshBasicMaterial color="#d5edff" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function CameraFraming() {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const base = useRef(new THREE.Vector3(4.3, 2.05, -6.2));
  useEffect(() => {
    const mobile = size.width < 700;
    base.current.set(mobile ? 9.2 : 4.3, mobile ? 4.1 : 2.05, mobile ? -14.4 : -6.2);
    camera.position.copy(base.current);
    camera.lookAt(0, 0.85, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reset = () => { pointer.current = { x: 0, y: 0 }; };
    reset();
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reduced.matches || size.width < 700) { reset(); return; }
      pointer.current = {
        x: THREE.MathUtils.clamp(event.clientX / window.innerWidth * 2 - 1, -1, 1),
        y: THREE.MathUtils.clamp(event.clientY / window.innerHeight * 2 - 1, -1, 1),
      };
    };
    window.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    reduced.addEventListener('change', reset);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      reduced.removeEventListener('change', reset);
    };
  }, [size.width]);
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, base.current.x + pointer.current.x * 0.5, 4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, base.current.y - pointer.current.y * 0.2, 4, delta);
    camera.lookAt(0, 0.85, 0);
  });
  return null;
}

export const DetailingScene = ({ currentStage = 2 }: { currentStage?: number; scrollProgress?: number; onStageChange?: (stage: number) => void }) => (
  <Canvas shadows dpr={[1, 1.6]} camera={{ position: [4.3, 2.05, -6.2], fov: 37, near: 0.1, far: 70 }} gl={{ antialias: true }} style={{ position: 'absolute', inset: 0 }}>
    <color attach="background" args={['#11191f']} />
    <fog attach="fog" args={['#11191f', 19, 45]} />
    <CameraFraming />
    <ambientLight intensity={0.55} />
    <hemisphereLight args={['#d2e8ff', '#48515a', 1.5]} />
    <spotLight position={[1, 7, -2]} intensity={110} angle={0.9} penumbra={0.65} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} />
    <pointLight position={[-5, 3, 2]} color="#9bd9f2" intensity={25} />
    <pointLight position={[5, 3, -1]} color="#e2f1ff" intensity={30} />
    <Garage />
    <Suspense fallback={null}>
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={4} position={[0, 6, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 3, 1]} />
        <Lightformer intensity={3} position={[-5, 3, 0]} rotation={[0, Math.PI / 2, 0]} scale={[2, 5, 1]} />
        <Lightformer intensity={3} position={[5, 3, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 5, 1]} />
      </Environment>
      <Car stage={currentStage} />
      <ContactShadows position={[0, 0.015, 0]} opacity={0.6} scale={11} blur={2.5} far={5} resolution={256} frames={1} />
    </Suspense>
  </Canvas>
);
