'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();

export const STAGES = [
  { id: 'dirty', bgColor: '#211e1a', name: 'Before detailing', description: 'The starting point. Every surface, carefully assessed.', color: '#c7ae8c' },
  { id: 'correction', bgColor: '#111c29', name: 'Protective film application', description: 'A transparent protective film is laid over each sculpted surface.', color: '#9fc5e8' },
  { id: 'perfect', bgColor: '#0b211b', name: 'Ceramic finish', description: 'Deep gloss. Sculpted reflections. Lasting protection.', color: '#64e2c1' },
];

function Car({ stage }: { stage: number }) {
  const { scene } = useGLTF('/models/ferrari.glb', '/draco/');
  const filmProgress = useRef({ value: 0 });
  const filmElapsed = useRef(0);
  const model = useMemo(() => {
    filmProgress.current.value = stage === 1 ? 0 : 1;
    filmElapsed.current = 0;
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const name = object.name.toLowerCase();
      // The source model uses legacy FBX materials; rebuild each surface as PBR.
      const original = Array.isArray(object.material) ? object.material[0] : object.material;
      const sourceName = original.name.toLowerCase();
      if (sourceName === 'ferrari_yellow') {
        if (name === 'yellow_trim') object.visible = false;
        object.material = new THREE.MeshStandardMaterial({ color: '#202327', metalness: 0.55, roughness: 0.45 });
      } else if (name === 'body') {
        object.material = new THREE.MeshPhysicalMaterial({
          color: stage === 2 ? '#b18410' : '#8b650d',
          metalness: 0.78, roughness: stage === 2 ? 0.18 : 0.38,
          clearcoat: 1, clearcoatRoughness: 0.035, envMapIntensity: 1.1,
        });
        const paint = object.material as THREE.MeshPhysicalMaterial;
        // Fine metallic grain below the smooth clearcoat; preserve Three.js PBR lighting.
        paint.onBeforeCompile = (shader) => {
          shader.uniforms.uFilmProgress = filmProgress.current;
          shader.uniforms.uApplyFilm = { value: stage === 1 ? 1 : 0 };
          shader.uniforms.uFilmColor = { value: new THREE.Color('#b18410') };
          shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vPaintPosition;\nvarying float vPaintWorldZ;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPaintPosition = position;\nvPaintWorldZ = (modelMatrix * vec4(position, 1.0)).z;');
          shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vPaintPosition;\nvarying float vPaintWorldZ;\nuniform float uFilmProgress;\nuniform float uApplyFilm;\nuniform vec3 uFilmColor;')
            .replace('#include <color_fragment>', `#include <color_fragment>
              float paintFilmFront = mix(-2.9, 2.9, uFilmProgress);
              float filmCoverage = uApplyFilm * smoothstep(-0.06, 0.06, paintFilmFront - vPaintWorldZ);
              diffuseColor.rgb = mix(diffuseColor.rgb, uFilmColor, filmCoverage);
            `)
            .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
              roughnessFactor = mix(roughnessFactor, 0.18, filmCoverage);
              float paintGrain = fract(sin(dot(floor(vPaintPosition * 1800.0), vec3(12.9898,78.233,45.164))) * 43758.5453);
              roughnessFactor = clamp(roughnessFactor + (paintGrain - 0.5) * 0.018, 0.06, 1.0);
            `);
        };
        paint.customProgramCacheKey = () => 'automotive-film-transition-v2';
      } else if (name === 'glass') {
        object.castShadow = false;
        object.renderOrder = 2;
        object.material = new THREE.MeshPhysicalMaterial({
          color: '#ffffff', metalness: 0, roughness: 0.025,
          transmission: 1, thickness: 0.015, ior: 1.46,
          transparent: true, opacity: 1, depthWrite: false,
          envMapIntensity: 0.4, side: THREE.DoubleSide,
        });
      } else if (sourceName.includes('leather') || name.includes('interior') || name === 'carpet') {
        object.material = new THREE.MeshStandardMaterial({
          color: sourceName.includes('red') ? '#382720' : name === 'carpet' ? '#101215' : '#222428',
          metalness: 0, roughness: name === 'carpet' ? 0.98 : 0.75,
          envMapIntensity: 0.3,
        });
      } else if (name.includes('carbon')) {
        object.material = new THREE.MeshPhysicalMaterial({ color: '#171b20', metalness: 0.3, roughness: 0.36, clearcoat: 0.6 });
      } else if (name.startsWith('rim') || name.startsWith('wheel')) {
        object.material = new THREE.MeshStandardMaterial({ color: '#626a72', metalness: 1, roughness: 0.28 });
      } else if (name.startsWith('brake')) {
        object.material = new THREE.MeshStandardMaterial({ color: '#53565a', metalness: 0.88, roughness: 0.5 });
      } else if (name.includes('tire') || name.includes('grill') || name === 'wipers' || name.includes('plastic')) {
        object.material = new THREE.MeshStandardMaterial({ color: '#101215', metalness: 0, roughness: 0.88 });
      } else if (name === 'lights') {
        object.material = new THREE.MeshPhysicalMaterial({ color: '#dbe8ed', metalness: 0.2, roughness: 0.1, transmission: 0.35, thickness: 0.05, clearcoat: 1 });
      } else if (name.includes('lights_red')) {
        object.material = new THREE.MeshPhysicalMaterial({ color: '#660807', emissive: '#a00b07', emissiveIntensity: 0.25, roughness: 0.2, clearcoat: 1 });
      } else if (name === 'chrome' || name.includes('metal')) {
        object.material = new THREE.MeshStandardMaterial({ color: '#979fa5', metalness: 1, roughness: 0.26 });
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
    const group = new THREE.Group();
    group.add(clone);
    group.updateMatrixWorld(true);
    if (stage === 1) {
      const film = new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0.065, clearcoat: 1, clearcoatRoughness: 0.025, transmission: 0.92, thickness: 0.008, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, envMapIntensity: 0.8 });
      film.onBeforeCompile = (shader) => {
        shader.uniforms.uFilmProgress = filmProgress.current;
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nuniform float uFilmProgress;\nvarying float vFilmZ;')
          .replace('#include <begin_vertex>', `#include <begin_vertex>
            vFilmZ = position.z;
            float front = mix(-2.9, 2.9, uFilmProgress);
            float curl = exp(-pow((position.z - front) / 0.16, 2.0));
            transformed += normal * (0.007 + curl * 0.16);
          `);
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', '#include <common>\nuniform float uFilmProgress;\nvarying float vFilmZ;')
          .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
            float filmFront = mix(-2.9, 2.9, uFilmProgress);
            if (vFilmZ > filmFront) discard;
          `)
          .replace('#include <alphamap_fragment>', '#include <alphamap_fragment>\ndiffuseColor.a *= mix(1.0, 0.15, smoothstep(0.8, 1.0, uFilmProgress));')
          .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
            float edge = 1.0 - smoothstep(0.0, 0.075, abs(vFilmZ - filmFront));
            totalEmissiveRadiance += vec3(0.12, 0.48, 0.55) * edge * 2.2;
          `);
      };
      film.customProgramCacheKey = () => 'protective-film-application-v1';
      const surfaces: THREE.Mesh[] = [];
      group.traverse((object) => { if (object instanceof THREE.Mesh && object.name === 'body') surfaces.push(object); });
      for (const surface of surfaces) {
        const geometry = surface.geometry.clone().applyMatrix4(surface.matrixWorld);
        const layer = new THREE.Mesh(geometry, film); layer.renderOrder = 3; layer.userData.ownedGeometry = true;
        group.add(layer);
      }
    }
    return group;
  }, [scene, stage]);
  useEffect(() => {
    filmElapsed.current = 0;
    filmProgress.current.value = stage === 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1;
  }, [stage]);
  useFrame((_, delta) => {
    if (stage !== 1 || filmProgress.current.value >= 1) return;
    filmElapsed.current += Math.min(delta, 0.05);
    const t = Math.min(1, filmElapsed.current / 5.5);
    filmProgress.current.value = t * t * (3 - 2 * t);
  });
  useEffect(() => () => {
    const materials = new Set<THREE.Material>();
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) => materials.add(m));
        if (object.userData.ownedGeometry) object.geometry.dispose();
      }
    });
    materials.forEach((material) => material.dispose());
  }, [model]);
  return <primitive object={model} />;
}

function Garage() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#181d23" roughness={0.68} metalness={0.08} />
      </mesh>
      {/* Rear wall and framed sectional garage door. */}
      <RoundedBox args={[15, 6, 0.24]} position={[0, 3, 5.5]} radius={0.06}>
        <meshStandardMaterial color="#657078" roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[6.4, 3.7, 0.16]} position={[0, 1.85, 5.29]} radius={0.03}>
        <meshStandardMaterial color="#080c11" metalness={0.6} roughness={0.5} />
      </RoundedBox>
      {Array.from({ length: 10 }, (_, i) => (
        <RoundedBox key={i} args={[6.1, 0.3, 0.08]} position={[0, 0.22 + i * 0.35, 5.16]} radius={0.015}>
          <meshStandardMaterial color={i % 2 ? '#566169' : '#4c575f'} metalness={0.5} roughness={0.45} />
        </RoundedBox>
      ))}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 7.4, 3, 0]}>
            <boxGeometry args={[0.2, 6, 11]} />
            <meshStandardMaterial color="#77838b" roughness={0.8} />
          </mesh>
          <mesh position={[side * 3.5, 2.2, 5.03]}>
            <boxGeometry args={[0.055, 4, 0.045]} />
            <meshStandardMaterial color="#c5eeff" emissive="#9ddfff" emissiveIntensity={1.5} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[side * 6.7, 2.3, 3.5 - i * 2.8]} rotation={[0, 0, side * -0.22]}>
              <boxGeometry args={[0.06, 3.8, 0.1]} />
              <meshStandardMaterial color="#e4f1ff" emissive="#cbe6ff" emissiveIntensity={1.8} />
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
        <mesh key={i} position={[0, 3.9, 2.5 - i * 2.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.8, 0.16]} />
          <meshBasicMaterial color="#d5edff" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Softbox({ position, intensity, width, height }: { position: [number, number, number]; intensity: number; width: number; height: number }) {
  const light = useMemo(() => {
    const area = new THREE.RectAreaLight('#dfebf5', intensity, width, height);
    area.position.set(...position);
    area.lookAt(0, 0.8, 0);
    return area;
  }, [position, intensity, width, height]);
  return <primitive object={light} />;
}

function CameraFraming() {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const base = useRef(new THREE.Vector3(3.75, 1.95, -5.65));
  useEffect(() => {
    const mobile = size.width < 700;
    base.current.set(mobile ? 8.8 : 3.75, mobile ? 3.9 : 1.95, mobile ? -13.8 : -5.65);
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
  <Canvas shadows dpr={[1, 2]} camera={{ position: [3.75, 1.95, -5.65], fov: 37, near: 0.1, far: 70 }} gl={{ antialias: true, toneMappingExposure: 0.85 }} style={{ position: 'absolute', inset: 0 }}>
    <color attach="background" args={['#11191f']} />
    <fog attach="fog" args={['#11191f', 19, 45]} />
    <CameraFraming />
    <ambientLight intensity={0.2} />
    <hemisphereLight args={['#d2e8ff', '#20252b', 0.7]} />
    <Softbox position={[-2, 4.5, -3]} intensity={12} width={5} height={0.45} />
    <Softbox position={[4, 3, 3]} intensity={8} width={3.5} height={0.65} />
    <Softbox position={[-4, 2.5, 0]} intensity={6} width={0.45} height={3} />
    <Softbox position={[0, 4, -1]} intensity={9} width={5.8} height={0.65} />
    <Softbox position={[0, 4, 2]} intensity={7} width={5.8} height={0.65} />
    <Garage />
    <Suspense fallback={null}>
      <Environment resolution={512} frames={1}>
        <Lightformer intensity={2} position={[0, 4, -6]} rotation={[Math.PI / 6, 0, 0]} scale={[5, 1.4, 1]} />
        <Lightformer intensity={3} position={[4, 2.5, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[1.2, 3, 1]} />
        <Lightformer intensity={3.2} position={[0, 6, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[7, 0.45, 1]} />
        <Lightformer intensity={1.8} position={[-5, 3, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.8, 4, 1]} />
        <Lightformer intensity={1.8} position={[5, 3, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[0.8, 4, 1]} />
      </Environment>
      <Car stage={currentStage} />
      <ContactShadows position={[0, 0.015, 0]} opacity={0.6} scale={11} blur={2.5} far={5} resolution={256} frames={1} />
    </Suspense>
  </Canvas>
);
