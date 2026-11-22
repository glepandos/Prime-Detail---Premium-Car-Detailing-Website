export interface CarModel {
  name: string;
  modelPath: string;
  texturePath?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export interface DetailingStage {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  shaderUniforms: Record<string, number | string>;
  cameraPosition: [number, number, number];
  carRotation: [number, number, number];
}

export interface ServiceTier {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  carModel: string;
  carYear: string;
  serviceTier: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export interface ScrollProgress {
  stage: number;
  progress: number;
  isTransitioning: boolean;
}

export interface ThreeSceneProps {
  onStageChange?: (stage: number) => void;
  scrollProgress?: number;
}

export interface ShaderUniforms {
  uTime: { value: number };
  uProgress: { value: number };
  uStage: { value: number };
  uResolution: { value: THREE.Vector2 };
  uMouse: { value: THREE.Vector2 };
  uDirtAmount: { value: number };
  uWaterAmount: { value: number };
  uPolishAmount: { value: number };
  uCeramicAmount: { value: number };
}

export interface ModelLoadResult {
  model: THREE.Group;
  materials: Map<string, THREE.Material>;
  animations: THREE.AnimationClip[];
}

declare global {
  namespace THREE {
    interface Vector2 {
      x: number;
      y: number;
    }
    interface Vector3 {
      x: number;
      y: number;
      z: number;
    }
    interface Group extends Object3D {
      children: Object3D[];
    }
    interface Object3D {
      position: Vector3;
      rotation: Euler;
      scale: Vector3;
      children: Object3D[];
      traverse(callback: (object: Object3D) => void): void;
    }
    interface Euler {
      x: number;
      y: number;
      z: number;
    }
    interface Material {
      uniforms?: Record<string, { value: unknown }>;
      map?: Texture;
      normalMap?: Texture;
      roughnessMap?: Texture;
      metalnessMap?: Texture;
      aoMap?: Texture;
      envMap?: Texture;
    }
    interface Texture {
      wrapS: number;
      wrapT: number;
      repeat: Vector2;
      offset: Vector2;
    }
    interface AnimationClip {
      name: string;
      duration: number;
    }
    interface Scene {
      add(object: Object3D): void;
      remove(object: Object3D): void;
      children: Object3D[];
    }
    interface Camera {
      position: Vector3;
      rotation: Euler;
      fov: number;
      aspect: number;
      near: number;
      far: number;
      updateProjectionMatrix(): void;
    }
    interface WebGLRenderer {
      domElement: HTMLCanvasElement;
      setSize(width: number, height: number): void;
      setPixelRatio(ratio: number): void;
      render(scene: Scene, camera: Camera): void;
      dispose(): void;
    }
  }
}

import * as THREE from 'three';