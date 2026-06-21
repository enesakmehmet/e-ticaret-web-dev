export const topographyVert = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const topographyFrag = `
// Simplex 2B gürültü
// https://github.com/stegu/webgl-noise/blob/master/src/noise2D.glsl
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec2 taylorInvSqrt(vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

uniform float uTime;
uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uOpacity;
uniform float uLineOpacity;
uniform float uScale;
uniform float uLineThickness;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Düzlem boyutlarına göre en boy oranını düzelt
  float aspect = uResolution.x / uResolution.y;
  vec2 noiseUv = uv;
  noiseUv.x *= aspect;

  // Daire maskesi (tam yuvarlak kalması için en boy oranı düzeltildi)
  vec2 centeredUv = uv - 0.5;
  centeredUv.x *= aspect;
  float dist = length(centeredUv);
  float radius = 0.6;
  float mask = 1.0 - smoothstep(radius - 0.01, radius + 0.01, dist);

  // Gürültü Üretimi
  float n = snoise(noiseUv * uScale + uTime * 0.05);

  // İzohips Çizgileri
  float lines = fract(n * 5.0);
  float pattern = smoothstep(0.5 - uLineThickness, 0.5, lines) - smoothstep(0.5, 0.5 + uLineThickness, lines);

  // Opaklık
  float opacity = uLineOpacity;

  // Kumlanma
  float grain = (fract(sin(dot(vUv, vec2(12.9898, 78.233) * 2.0)) * 43758.5453) - 0.5) * 0.15;

  vec3 finalColor = uColor + grain;

  gl_FragColor = vec4(finalColor, pattern * opacity * mask * uOpacity);
}
`;

export const holocardVert = `
varying vec2 vUv;
uniform float uTime;
uniform float uActive;

void main() {
  vUv = uv;
  vec3 pos = position;

  // "Nefes alma" - sadece aktifken
  float breath = sin(uTime * 2.0) * 0.015 * uActive;
  float scale = 1.0 + breath;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos * scale, 1.0);
}
`;

export const holocardFrag = `
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uActive;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  vec3 baseColor = texColor.rgb;

  if (uActive < 0.01) {
    gl_FragColor = vec4(baseColor, texColor.a * uOpacity);
    return;
  }

  // Işık bandı taraması - uActive geçişi ile tetiklenir (0->1)
  float diagonal = (vUv.x * 0.8) + vUv.y;
  float sheenPos = uActive * 2.5;
  float sheenWidth = 0.5;

  float dist = abs(diagonal - sheenPos);
  float intensity = 1.0 - smoothstep(0.0, sheenWidth, dist);
  intensity = pow(intensity, 3.0);

  // uActive 1'e yaklaştıkça parlamayı azalt (tarama tamamlandı)
  float sheenFade = 1.0 - smoothstep(0.7, 1.0, uActive);

  vec3 sheenColor = vec3(0.85, 0.92, 1.0) * intensity * 0.9 * sheenFade;
  vec3 finalColor = baseColor + sheenColor * texColor.a;

  gl_FragColor = vec4(finalColor, texColor.a * uOpacity);
}
`;
