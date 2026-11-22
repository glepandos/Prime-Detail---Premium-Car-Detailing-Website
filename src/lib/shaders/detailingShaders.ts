import * as THREE from 'three';

export const vertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vec4 viewPosition = viewMatrix * worldPosition;
    vViewPosition = viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uStage;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uDirtAmount;
  uniform float uWaterAmount;
  uniform float uPolishAmount;
  uniform float uCeramicAmount;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;

  // Noise functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  // Dirt/dust pattern
  float getDirtPattern(vec2 uv, float time) {
    vec2 p = uv * 10.0 + vec2(time * 0.1, time * 0.05);
    float n = fbm(p, 6);
    vec2 p2 = uv * 5.0 - vec2(time * 0.05, time * 0.1);
    n += 0.5 * fbm(p2, 4);
    return smoothstep(0.3, 0.6, n);
  }

  // Water/soap bubbles
  float getWaterPattern(vec2 uv, float time) {
    vec2 p = uv * 8.0;
    float bubbles = 0.0;
    for (int i = 0; i < 5; i++) {
      vec2 center = vec2(
        sin(time * 0.5 + float(i) * 2.0) * 0.5 + 0.5,
        cos(time * 0.3 + float(i) * 1.5) * 0.5 + 0.5
      );
      float dist = distance(uv, center);
      bubbles += smoothstep(0.15, 0.1, dist) * (0.5 + 0.5 * sin(time * 2.0 + float(i)));
    }
    float foam = fbm(uv * 20.0 + vec2(time * 0.2, 0.0), 4);
    return max(bubbles, foam * 0.3);
  }

  // Polish shine
  float getPolishPattern(vec2 uv, float time, vec3 normal, vec3 viewDir) {
    vec3 reflectDir = reflect(-viewDir, normal);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    float shine = pow(max(dot(reflectDir, vec3(0.0, 1.0, 0.0)), 0.0), 32.0);
    float specular = fresnel + shine * 0.5;
    return specular;
  }

  // Ceramic coating hydrophobic effect
  float getCeramicPattern(vec2 uv, float time, vec3 normal, vec3 viewDir) {
    vec3 reflectDir = reflect(-viewDir, normal);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
    float beading = fbm(uv * 30.0 + vec2(time * 0.1, time * 0.15), 5);
    beading = smoothstep(0.6, 0.8, beading);
    return fresnel * (1.0 + beading * 2.0);
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vViewPosition);

    // Base car paint color (deep metallic blue)
    vec3 baseColor = vec3(0.05, 0.1, 0.25);
    vec3 metallicFlake = vec3(0.15, 0.2, 0.35);

    // Stage 0: Dirty (dirt, dust, grime)
    float dirtMask = getDirtPattern(vUv, uTime);
    vec3 dirtColor = mix(baseColor, vec3(0.15, 0.12, 0.08), dirtMask * uDirtAmount);
    vec3 stage0Color = mix(baseColor, dirtColor, smoothstep(0.0, 1.0, 1.0 - uStage));

    // Stage 1: Correction (water, soap, cleaning)
    float waterMask = getWaterPattern(vUv, uTime);
    vec3 waterColor = vec3(0.2, 0.4, 0.6);
    vec3 soapColor = vec3(0.9, 0.95, 1.0);
    vec3 stage1Color = mix(stage0Color,
      mix(waterColor, soapColor, waterMask) * uWaterAmount,
      smoothstep(0.5, 1.5, uStage));

    // Stage 2: Polish (high gloss, reflection)
    float polishShine = getPolishPattern(vUv, uTime, normal, viewDir);
    vec3 polishColor = vec3(0.02, 0.08, 0.2);
    vec3 stage2Color = mix(stage1Color,
      mix(polishColor, metallicFlake, polishShine) * uPolishAmount,
      smoothstep(1.5, 2.5, uStage));

    // Stage 3: Ceramic Coating (hydrophobic, ultra-glossy)
    float ceramicEffect = getCeramicPattern(vUv, uTime, normal, viewDir);
    vec3 ceramicColor = vec3(0.01, 0.05, 0.15);
    vec3 finalColor = mix(stage2Color,
      mix(ceramicColor, vec3(0.3, 0.4, 0.6), ceramicEffect) * uCeramicAmount,
      smoothstep(2.5, 3.5, uStage));

    // Fresnel for edge highlight
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
    finalColor += vec3(0.1, 0.15, 0.25) * fresnel * (0.5 + uCeramicAmount * 0.5);

    // Metallic flakes
    float flakes = fbm(vUv * 100.0, 3);
    flakes = smoothstep(0.95, 1.0, flakes);
    finalColor += metallicFlake * flakes * (0.3 + uPolishAmount * 0.7);

    // Gamma correction
    finalColor = pow(finalColor, vec3(1.0 / 2.2));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const transitionVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const transitionFragmentShader = `
  uniform float uProgress;
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uTime;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 distortedUv = vUv;
    float distortion = sin(vUv.y * 20.0 + uTime * 2.0) * 0.02 * (1.0 - abs(uProgress - 0.5) * 2.0);
    distortedUv.x += distortion;

    vec4 color1 = texture2D(uTexture1, distortedUv);
    vec4 color2 = texture2D(uTexture2, distortedUv);

    float transition = smoothstep(0.0, 1.0, uProgress);
    vec4 finalColor = mix(color1, color2, transition);

    gl_FragColor = finalColor;
  }
`;

export const createDetailingMaterial = (uniforms: Record<string, THREE.Uniform>) => {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uStage: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uMouse: { value: new THREE.Vector2() },
      uDirtAmount: { value: 1 },
      uWaterAmount: { value: 0 },
      uPolishAmount: { value: 0 },
      uCeramicAmount: { value: 0 },
      ...uniforms,
    },
    transparent: false,
    side: THREE.DoubleSide,
  });
};

export const createTransitionMaterial = (texture1: THREE.Texture, texture2: THREE.Texture) => {
  return new THREE.ShaderMaterial({
    vertexShader: transitionVertexShader,
    fragmentShader: transitionFragmentShader,
    uniforms: {
      uProgress: { value: 0 },
      uTexture1: { value: texture1 },
      uTexture2: { value: texture2 },
      uTime: { value: 0 },
    },
    transparent: true,
  });
};