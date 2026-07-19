import { useEffect, useRef } from 'react';

const vertexSource = `#version 300 es
precision mediump float;
layout(location = 0) in vec4 a_position;
void main() { gl_Position = a_position; }`;

const fragmentSource = `#version 300 es
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_pxSize;
uniform float u_type;
uniform float u_shape;
uniform float u_zoom;
out vec4 fragColor;

#define PI 3.14159265358979323846
#define TWO_PI 6.28318530718

float bayer2(vec2 p) {
  vec2 q = mod(p, 2.0);
  return (q.x < 1.0 ? (q.y < 1.0 ? 0.0 : 3.0) : (q.y < 1.0 ? 2.0 : 1.0)) / 4.0;
}
float bayer4(vec2 p) {
  vec2 q = mod(p, 4.0);
  float row = floor(q.y);
  float col = floor(q.x);
  float values[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
  return values[int(row * 4.0 + col)] / 16.0;
}
float bayer8(vec2 p) {
  return (bayer4(floor(p * .5)) * 4.0 + bayer2(p)) / 5.0;
}

void main() {
  vec2 pixel = gl_FragCoord.xy;
  vec2 centered = pixel - .5 * u_resolution;
  vec2 cell = floor(centered / u_pxSize) * u_pxSize;
  vec2 uv = cell / u_resolution;
  float radius = length(uv);
  float rippleRadius = length(cell / min(u_resolution.x, u_resolution.y)) / max(u_zoom, .001);
  float t = .5 * u_time;
  vec2 waveUv = uv * 4.0;
  float waveLine = cos(.5 * waveUv.x - 2.0 * t) * sin(1.5 * waveUv.x + t) * (.75 + .25 * cos(3.0 * t));
  float wave = 1.0 - smoothstep(-1.0, 1.0, waveUv.y + waveLine);
  float angle = 6.0 * atan(uv.y, uv.x) + 2.0 * u_time;
  float twist = fract(pow(max(radius, .001), -1.2) + angle / TWO_PI);
  float swirl = mix(0.0, twist, smoothstep(0.0, 1.0, pow(radius, 1.2)));
  float ripple = sin(pow(rippleRadius, 1.7) * 7.0 - 1.5 * u_time) * .5 + .5;
  float shape = u_shape < 4.5 ? wave : (u_shape < 5.5 ? ripple : swirl);
  float dither = u_type < 2.5 ? bayer2(pixel / u_pxSize) : (u_type < 3.5 ? bayer4(pixel / u_pxSize) : bayer8(pixel / u_pxSize));
  float result = step(.5, shape + dither - .5);
  vec3 color = mix(u_colorBack.rgb, u_colorFront.rgb, result);
  float alpha = mix(u_colorBack.a, u_colorFront.a, result);
  fragColor = vec4(color, alpha);
}`;

const hexToRgba = (hex) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match ? [1, 2, 3].map((index) => Number.parseInt(match[index], 16) / 255).concat(1) : [0, 0, 0, 1];
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
};

export default function DitheringShader({
  colorBack = '#ffffff',
  colorFront = '#dce4ea',
  shape = 'swirl',
  type = '4x4',
  pxSize = 4,
  speed = 0.9,
  zoom = 1,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) return undefined;
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return undefined;
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      time: gl.getUniformLocation(program, 'u_time'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      back: gl.getUniformLocation(program, 'u_colorBack'),
      front: gl.getUniformLocation(program, 'u_colorFront'),
      pxSize: gl.getUniformLocation(program, 'u_pxSize'),
      type: gl.getUniformLocation(program, 'u_type'),
      shape: gl.getUniformLocation(program, 'u_shape'),
      zoom: gl.getUniformLocation(program, 'u_zoom'),
    };
    const start = performance.now();
    let frameId = 0;
    const draw = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.uniform1f(uniforms.time, ((performance.now() - start) / 1000) * speed);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform4fv(uniforms.back, hexToRgba(colorBack));
      gl.uniform4fv(uniforms.front, hexToRgba(colorFront));
      gl.uniform1f(uniforms.pxSize, pxSize * ratio);
      gl.uniform1f(uniforms.type, type === '2x2' ? 2 : type === '4x4' ? 3 : 4);
      gl.uniform1f(uniforms.shape, shape === 'wave' ? 4 : shape === 'ripple' ? 5 : 6);
      gl.uniform1f(uniforms.zoom, zoom);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (speed !== 0) frameId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(frameId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [colorBack, colorFront, pxSize, shape, speed, type, zoom]);

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden="true" />;
}
