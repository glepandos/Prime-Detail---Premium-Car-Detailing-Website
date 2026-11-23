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

import * as THREE from 'three';