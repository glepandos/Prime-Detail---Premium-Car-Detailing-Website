'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

// Repeated workshop parts share geometry/material and are drawn in batches.
export function EquipmentRack() {
  const rack = useMemo(() => {
    const group = new THREE.Group();
    const box = new THREE.BoxGeometry(1, 1, 1);
    const cylinder = new THREE.CylinderGeometry(1, 1, 1, 16);
    const batches = new Map<string, { geometry: THREE.BufferGeometry; color: string; matrices: THREE.Matrix4[] }>();
    const dummy = new THREE.Object3D();
    const part = (shape: 'box' | 'cylinder', color: string, position: number[], scale: number[], rotation = [0, 0, 0]) => {
      const key = `${shape}-${color}`;
      if (!batches.has(key)) batches.set(key, { geometry: shape === 'box' ? box : cylinder, color, matrices: [] });
      dummy.position.set(position[0], position[1], position[2]);
      dummy.scale.set(scale[0], scale[1], scale[2]);
      dummy.rotation.set(rotation[0], rotation[1], rotation[2]);
      dummy.updateMatrix();
      batches.get(key)!.matrices.push(dummy.matrix.clone());
    };
    const steel = '#333d44', silver = '#8b9599', dark = '#182127', label = '#c7ccca';
    // Four uprights, mounting holes, feet and reinforced shelf edges.
    for (const x of [-1.45, 1.45]) for (const z of [-0.43, 0.43]) {
      part('box', steel, [x, 1.8, z], [0.075, 3.6, 0.075]);
      part('box', dark, [x, 0.045, z], [0.18, 0.09, 0.18]);
      for (let y = 0.3; y < 3.5; y += 0.22) part('box', dark, [x, y, z - 0.039], [0.024, 0.065, 0.006]);
    }
    for (const y of [0.18, 1.25, 2.23, 3.3]) {
      part('box', steel, [0, y, 0], [2.97, 0.065, 0.94]);
      part('box', silver, [0, y - 0.06, -0.46], [2.97, 0.08, 0.025]);
      for (const x of [-1, 0, 1]) part('box', dark, [x, y - 0.08, 0], [0.04, 0.1, 0.86]);
    }
    for (const angle of [-0.7, 0.7]) part('box', silver, [0, 1.75, 0.45], [0.035, 4.05, 0.025], [0, 0, angle]);
    // Protective film rolls: wound outer shell, cardboard cores and dark openings.
    for (let i = 0; i < 7; i++) {
      const x = -1.13 + i * 0.37, height = 0.75 + (i % 3) * 0.07;
      part('cylinder', i % 2 ? '#9aa8ac' : '#d0d6d4', [x, 0.22 + height / 2, 0], [0.145, height, 0.145]);
      part('cylinder', '#a18a67', [x, 0.23 + height, 0], [0.072, 0.035, 0.072]);
      part('cylinder', dark, [x, 0.25 + height, 0], [0.045, 0.006, 0.045]);
      part('box', label, [x, 0.52, -0.146], [0.14, 0.11, 0.008]);
    }
    // Polish tins and trigger bottles, each with lids, labels and spray nozzles.
    for (let row = 0; row < 2; row++) for (let i = 0; i < 5; i++) {
      const x = -1.13 + i * 0.48, z = 0.2 - row * 0.45;
      const y = 1.3, height = 0.3 + (i % 2) * 0.1;
      part('cylinder', i % 2 ? '#547f79' : '#aab1b4', [x, y + height / 2, z], [0.14, height, 0.14]);
      part('cylinder', dark, [x, y + height + 0.02, z], [0.145, 0.045, 0.145]);
      part('box', label, [x, y + height / 2, z - 0.14], [0.16, 0.12, 0.008]);
      part('box', dark, [x, y + height / 2, z - 0.146], [0.1, 0.018, 0.004]);
    }
    for (let i = 0; i < 4; i++) {
      const x = -1.1 + i * 0.39;
      part('cylinder', i % 2 ? '#547f79' : '#d0d6d4', [x, 2.48, 0], [0.115, 0.42, 0.115]);
      part('cylinder', dark, [x, 2.72, 0], [0.047, 0.09, 0.047]);
      part('box', dark, [x + 0.035, 2.79, -0.015], [0.17, 0.055, 0.08]);
      part('box', label, [x, 2.49, -0.115], [0.13, 0.16, 0.008]);
    }
    // Tool tray, upright brushes, polisher with handle and stacked foam pads.
    part('box', dark, [0.85, 2.32, 0], [0.85, 0.12, 0.55]);
    for (let i = 0; i < 4; i++) {
      const x = 0.58 + i * 0.17;
      part('cylinder', '#a18a67', [x, 2.58, 0.1], [0.025, 0.4, 0.025], [0, 0, (i - 1.5) * 0.1]);
      part('cylinder', '#b0a18a', [x + (1.5 - i) * 0.02, 2.82, 0.1], [0.055, 0.11, 0.055]);
    }
    part('box', '#547f79', [-0.75, 3.48, 0], [0.58, 0.22, 0.25], [0, 0, -0.1]);
    part('cylinder', dark, [-0.98, 3.43, -0.04], [0.23, 0.07, 0.23]);
    part('box', dark, [-0.45, 3.57, 0], [0.28, 0.09, 0.11]);
    for (let i = 0; i < 3; i++) part('cylinder', i % 2 ? '#547f79' : '#b0a18a', [0.15, 3.39 + i * 0.075, 0], [0.24, 0.065, 0.24]);
    part('box', '#a18a67', [0.96, 3.55, 0.02], [0.6, 0.42, 0.64]);
    part('box', label, [0.96, 3.55, -0.305], [0.32, 0.17, 0.008]);
    for (const batch of Array.from(batches.values())) {
      const material = new THREE.MeshStandardMaterial({ color: batch.color, roughness: 0.55, metalness: batch.color === steel || batch.color === silver ? 0.65 : 0.05 });
      const mesh = new THREE.InstancedMesh(batch.geometry, material, batch.matrices.length);
      batch.matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
      mesh.computeBoundingSphere();
      group.add(mesh);
    }
    return group;
  }, []);
  useEffect(() => () => {
    const geometries = new Set<THREE.BufferGeometry>();
    rack.traverse((object) => {
      if (object instanceof THREE.InstancedMesh) {
        geometries.add(object.geometry);
        (object.material as THREE.Material).dispose();
        object.dispose();
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
  }, [rack]);
  return <primitive object={rack} position={[-4.6, 0, 4.5]} />;
}

