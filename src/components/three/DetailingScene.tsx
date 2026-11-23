'use client';

import * as THREE from 'three';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import {
  Html,
  Environment,
  AccumulativeShadows,
  ContactShadows,
} from '@react-three/drei';
import { ShaderMaterial, Vector2, Clock } from 'three';
import { vertexShader, fragmentShader } from '@/lib/shaders/detailingShaders';
import { DetailingStage } from '@/types';

extend({ ShaderMaterial });

const STAGES: DetailingStage[] = [
  {
    id: 'dirty',
    name: 'Before: Neglected',
    description: 'Your vehicle arrives covered in road grime, oxidation, water spots, and embedded contaminants.',
    color: '#8B7355',
    bgColor: '#1a1612',
    shaderUniforms: { uDirtAmount: 1, uWaterAmount: 0, uPolishAmount: 0, uCeramicAmount: 0 },
    cameraPosition: [0, 1.2, 4],
    carRotation: [0, -0.5, 0],
  },
  {
    id: 'correction',
    name: 'Process: Paint Correction',
    description: 'Multi-stage machine polishing removes defects, oxidation, and swirls revealing true clarity.',
    color: '#3A7BD5',
    bgColor: '#0a1628',
    shaderUniforms: { uDirtAmount: 0, uWaterAmount: 1, uPolishAmount: 0.5, uCeramicAmount: 0 },
    cameraPosition: [0, 1.2, 4],
    carRotation: [0, 0.5, 0],
  },
  {
    id: 'perfect',
    name: 'After: Ceramic Perfection',
    description: 'Ceramic coating applied - hydrophobic, UV-resistant, 5-year protection with mirror finish.',
    color: '#00D4AA',
    bgColor: '#021814',
    shaderUniforms: { uDirtAmount: 0, uWaterAmount: 0, uPolishAmount: 1, uCeramicAmount: 1 },
    cameraPosition: [0, 1.2, 4],
    carRotation: [0, 1.5, 0],
  },
];

interface DetailingSceneProps {
  onStageChange?: (stage: number) => void;
  scrollProgress?: number;
  currentStage?: number;
}

const DetailingCarModel = ({ stage }: { stage: number }) => {
  const { scene } = useThree();
  const clock = useMemo(() => new Clock(), []);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Create procedural car geometry since we don't have actual GLTF models
  useEffect(() => {
    if (groupRef.current) return;

    const group = new THREE.Group();
    groupRef.current = group;

    // Create car body using primitive geometries
    const bodyGeometry = new THREE.BoxGeometry(3.5, 1.2, 1.6);
    const roofGeometry = new THREE.BoxGeometry(2, 0.8, 1.4);
    const hoodGeometry = new THREE.BoxGeometry(1.2, 0.4, 1.6);
    const trunkGeometry = new THREE.BoxGeometry(1, 0.5, 1.6);

    const windowGeometry = new THREE.BoxGeometry(1.8, 0.6, 1.45);
    const frontWindowGeometry = new THREE.BoxGeometry(0.8, 0.6, 1.5);
    const rearWindowGeometry = new THREE.BoxGeometry(0.6, 0.5, 1.5);

    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 16);
    const rimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.26, 16);

    // Create shader material for car body
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uStage: { value: stage },
        uResolution: { value: new Vector2() },
        uMouse: { value: new Vector2() },
        uDirtAmount: { value: STAGES[stage]?.shaderUniforms.uDirtAmount || 0 },
        uWaterAmount: { value: STAGES[stage]?.shaderUniforms.uWaterAmount || 0 },
        uPolishAmount: { value: STAGES[stage]?.shaderUniforms.uPolishAmount || 0 },
        uCeramicAmount: { value: STAGES[stage]?.shaderUniforms.uCeramicAmount || 0 },
      },
      transparent: false,
      side: THREE.DoubleSide,
    });
    materialRef.current = material;

    // Glass material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2e,
      metalness: 0,
      roughness: 0,
      transmission: 0.8,
      thickness: 0.1,
      ior: 1.5,
      transparent: true,
      opacity: 0.3,
    });

    // Wheel material
    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.9,
      metalness: 0,
    });
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: stage === 2 ? 0x2a2a2a : 0x1a1a1a,
      roughness: stage === 2 ? 0.2 : 0.6,
      metalness: 0.8,
    });

    // Car body parts
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 0.6, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const roof = new THREE.Mesh(roofGeometry, material);
    roof.position.set(0, 1.5, -0.1);
    roof.castShadow = true;
    roof.receiveShadow = true;
    group.add(roof);

    const hood = new THREE.Mesh(hoodGeometry, material);
    hood.position.set(1.35, 0.8, 0);
    hood.castShadow = true;
    hood.receiveShadow = true;
    group.add(hood);

    const trunk = new THREE.Mesh(trunkGeometry, material);
    trunk.position.set(-1.75, 0.85, 0);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // Windows
    const windows = new THREE.Mesh(windowGeometry, glassMaterial);
    windows.position.set(0, 1.5, 0);
    group.add(windows);

    const frontWindow = new THREE.Mesh(frontWindowGeometry, glassMaterial);
    frontWindow.position.set(1.6, 1.5, 0);
    group.add(frontWindow);

    const rearWindow = new THREE.Mesh(rearWindowGeometry, glassMaterial);
    rearWindow.position.set(-1.45, 1.5, 0);
    group.add(rearWindow);

    // Wheels
    const wheelPositions: [number, number, number][] = [
      [1.3, 0.4, 0.95],
      [1.3, 0.4, -0.95],
      [-1.3, 0.4, 0.95],
      [-1.3, 0.4, -0.95],
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, tireMaterial);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      group.add(wheel);

      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.position.set(pos[0], pos[1], pos[2]);
      rim.rotation.z = Math.PI / 2;
      rim.castShadow = true;
      group.add(rim);
    });

    // Headlights and taillights
    const lightGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.3);
    const headlightMaterial = new THREE.MeshBasicMaterial({
      color: stage === 2 ? 0xffffee : 0x888888,
      transparent: true,
      opacity: 0.8,
    });
    const taillightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3333,
      transparent: true,
      opacity: 0.6,
    });

    const headlightL = new THREE.Mesh(lightGeometry, headlightMaterial);
    headlightL.position.set(1.9, 0.7, 0.7);
    group.add(headlightL);

    const headlightR = new THREE.Mesh(lightGeometry, headlightMaterial);
    headlightR.position.set(1.9, 0.7, -0.7);
    group.add(headlightR);

    const taillightL = new THREE.Mesh(lightGeometry, taillightMaterial);
    taillightL.position.set(-1.9, 0.7, 0.7);
    group.add(taillightL);

    const taillightR = new THREE.Mesh(lightGeometry, taillightMaterial);
    taillightR.position.set(-1.9, 0.7, -0.7);
    group.add(taillightR);

    // Badge
    const badgeGeometry = new THREE.RingGeometry(0.08, 0.15, 32);
    const badgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.1,
      side: THREE.DoubleSide,
    });
    const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
    badge.position.set(1.9, 1.0, 0);
    badge.rotation.y = Math.PI / 2;
    group.add(badge);

    scene.add(group);
    setModelLoaded(true);

    return () => {
      scene.remove(group);
      material.dispose();
      glassMaterial.dispose();
      tireMaterial.dispose();
      rimMaterial.dispose();
      headlightMaterial.dispose();
      taillightMaterial.dispose();
      badgeMaterial.dispose();
      bodyGeometry.dispose();
      roofGeometry.dispose();
      hoodGeometry.dispose();
      trunkGeometry.dispose();
      windowGeometry.dispose();
      frontWindowGeometry.dispose();
      rearWindowGeometry.dispose();
      wheelGeometry.dispose();
      rimGeometry.dispose();
      lightGeometry.dispose();
      badgeGeometry.dispose();
    };
  }, [scene, stage]);

  // Update shader uniforms on stage change
  useEffect(() => {
    if (materialRef.current) {
      const uniforms = materialRef.current.uniforms;
      const stageData = STAGES[stage] || STAGES[0];
      uniforms.uStage.value = stage;
      uniforms.uDirtAmount.value = stageData.shaderUniforms.uDirtAmount;
      uniforms.uWaterAmount.value = stageData.shaderUniforms.uWaterAmount;
      uniforms.uPolishAmount.value = stageData.shaderUniforms.uPolishAmount;
      uniforms.uCeramicAmount.value = stageData.shaderUniforms.uCeramicAmount;
    }
  }, [stage]);

  // Animation loop
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }

    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = 0.6 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02;
      // Slow rotation for showcase
      groupRef.current.rotation.y += 0.0005;
    }
  });

  if (!modelLoaded) return null;

  return <group ref={groupRef} />;
};

const StageEnvironment = ({ stage }: { stage: number }) => {
  const stageData = STAGES[stage];
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color(stageData.bgColor);
  }, [scene, stageData.bgColor]);

  return (
    <>
      <Environment
        preset="city"
        files={[
          '/textures/environment/px.png',
          '/textures/environment/nx.png',
          '/textures/environment/py.png',
          '/textures/environment/ny.png',
          '/textures/environment/pz.png',
          '/textures/environment/nz.png',
        ]}
      />
      <AccumulativeShadows temporal opacity={0.3} scale={10} />
      <ContactShadows opacity={0.4} scale={10} blur={2} />
    </>
  );
};

const ParticleSystem = ({ stage }: { stage: number }) => {
  const { scene } = useThree();
  const pointsRef = useRef<THREE.Points | null>(null);
  const clock = useMemo(() => new Clock(), []);

  useEffect(() => {
    const count = stage === 0 ? 2000 : stage === 1 ? 3000 : 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + 1;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.05 + 0.02;

      if (stage === 0) {
        // Dirt particles - brown/dust
        colors[i * 3] = 0.4 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.15;
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.1;
      } else if (stage === 1) {
        // Water/soap particles - blue/white
        colors[i * 3] = Math.random() * 0.3;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.4;
      } else {
        // Sparkle particles - white/gold
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, stage]);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();

      for (let i = 0; i < positions.length; i += 3) {
        if (stage === 0) {
          // Dirt falls slowly
          positions[i + 1] -= 0.002;
          if (positions[i + 1] < -2) positions[i + 1] = 5;
        } else if (stage === 1) {
          // Water droplets fall and swirl
          positions[i + 1] -= 0.01;
          positions[i] += Math.sin(time + i) * 0.002;
          positions[i + 2] += Math.cos(time + i) * 0.002;
          if (positions[i + 1] < -2) positions[i + 1] = 5;
        } else {
          // Sparkles float and fade
          positions[i + 1] += Math.sin(time * 2 + i) * 0.001;
          positions[i] += Math.cos(time * 1.5 + i) * 0.001;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.0001;
    }
  });

  return null;
};

export const DetailingScene = ({
  onStageChange,
  currentStage = 0,
}: DetailingSceneProps) => {
  useThree();

  useEffect(() => {
    if (onStageChange) {
      onStageChange(currentStage);
    }
  }, [currentStage, onStageChange]);

  return (
    <Canvas
      camera={{ position: STAGES[currentStage].cameraPosition, fov: 45 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <StageEnvironment stage={currentStage} />
      <DetailingCarModel stage={currentStage} />
      <ParticleSystem stage={currentStage} />

      <Html
        transform
        position={[0, 2.5, 0]}
        style={{
          pointerEvents: 'none',
          textAlign: 'center',
          color: STAGES[currentStage].color,
          fontSize: '1.5rem',
          fontWeight: 300,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textShadow: '0 0 30px currentColor',
        }}
      >
        {STAGES[currentStage].name}
      </Html>

      <Html
        transform
        position={[0, -2.5, 0]}
        style={{
          pointerEvents: 'none',
          textAlign: 'center',
          color: '#ffffff88',
          fontSize: '0.9rem',
          maxWidth: '300px',
          lineHeight: 1.6,
        }}
      >
        {STAGES[currentStage].description}
      </Html>
    </Canvas>
  );
};

export { STAGES };