"use client";

import { useEffect, useRef, useState } from "react";
import type { Apply } from "./Scene";
import { PLACE_PHOTOS } from "@/lib/content";
import { curve, key, Keys } from "./timeline";

// An FPV ridge run, drawn live on the GPU: skim the crest, bank into the bends,
// pull up the rock faces, punch through cloud. No video or map token needed.

const LENGTH = 1400;
const FOCAL = 1.5;

const pathX = (z: number) => 16 * Math.sin(z * 0.041) + 7 * Math.sin(z * 0.107 + 1.3);
const ridgeTop = (z: number) => {
  const t = Math.min(1, Math.max(0, z / LENGTH));
  const grow = 24 + 44 * t * t * (3 - 2 * t);
  return grow * (1 + 0.22 * Math.sin(z * 0.045) + 0.12 * Math.sin(z * 0.117 + 1));
};

const FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes;
uniform vec3 uCam, uFwd, uUp, uRight;
uniform vec3 uSkyTop, uSkyHor, uSunCol, uSunDir;
uniform float uFog, uSnow, uTrailZ, uCloudY, uCloud, uFocal, uLen;

float pathX(float z){ return 16.*sin(z*.041)+7.*sin(z*.107+1.3); }
float ridgeTop(float z){
  float t=clamp(z/uLen,0.,1.);
  float grow=24.+44.*t*t*(3.-2.*t);
  return grow*(1.+.22*sin(z*.045)+.12*sin(z*.117+1.));
}
float hash(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
const mat2 ROT=mat2(.8,.6,-.6,.8);
float ridged(vec2 p,int oct){
  float a=.5,s=0.,w=1.;
  for(int i=0;i<oct;i++){
    float n=1.-abs(2.*vnoise(p)-1.);
    n*=n; s+=a*n*w; w=clamp(n*1.8,0.,1.);
    p=ROT*p*2.03; a*=.5;
  }
  return s;
}
float soft(vec2 p){
  float a=.5,s=0.;
  for(int i=0;i<4;i++){ s+=a*vnoise(p); p=ROT*p*2.1; a*=.5; }
  return s;
}
float terrain(vec2 p,int oct){
  float d=p.x-pathX(p.y);
  float top=ridgeTop(p.y);
  float r=exp(-(d*d)/(d<0.?900.:2100.));
  float massif=smoothstep(30.,130.,d)*top*.9;
  float body=top*r+massif*(1.-r)-smoothstep(16.,80.,-d)*(top*.35+16.);
  float n=ridged(p*.05,oct);
  return body+(n-.42)*(2.5+.34*max(body,0.));
}
vec3 normalAt(vec3 p,float e){
  float h=terrain(p.xz,8);
  return normalize(vec3(h-terrain(p.xz+vec2(e,0),8),e,h-terrain(p.xz+vec2(0,e),8)));
}
vec3 sky(vec3 rd){
  float y=clamp(rd.y,0.,1.);
  vec3 c=mix(uSkyHor,uSkyTop,smoothstep(0.,.6,y));
  float s=max(dot(rd,uSunDir),0.);
  c+=uSunCol*(pow(s,6.)*.28+pow(s,90.)*.8+pow(s,900.)*2.);
  return c;
}
float shadow(vec3 ro){
  float res=1.,t=1.5;
  for(int i=0;i<12;i++){
    vec3 p=ro+uSunDir*t;
    float h=p.y-terrain(p.xz,3);
    if(h<0.) return 0.;
    res=min(res,10.*h/t);
    t+=max(1.,h*.6);
  }
  return clamp(res,0.,1.);
}
void main(){
  vec2 uv=(2.*gl_FragCoord.xy-uRes)/uRes.y;
  vec3 rd=normalize(uv.x*uRight+uv.y*uUp+uFocal*uFwd);
  vec3 ro=uCam;

  float t=.5, tMax=800.; bool hit=false;
  for(int i=0;i<110;i++){
    vec3 p=ro+rd*t;
    float d=p.y-terrain(p.xz,4);
    if(d<.0015*t){ hit=true; break; }
    t+=max(.05,d*.42)*(1.+t*.0012);
    if(t>tMax) break;
  }
  float tWater=rd.y<0.?-ro.y/rd.y:1e6;

  vec3 col; float dist;
  if(tWater<t||(!hit&&tWater<1e5)){
    dist=tWater;
    vec3 p=ro+rd*tWater;
    float w1=vnoise(p.xz*.5), w2=vnoise(p.xz*.53+7.);
    vec3 n=normalize(vec3(vec2(w1-.5,w2-.5)*.16*exp(-dist*.012),1.).xzy);
    vec3 rf=reflect(rd,n); rf.y=abs(rf.y);
    float fres=.04+.96*pow(1.-max(dot(-rd,n),0.),5.);
    vec3 deep=mix(vec3(.055,.071,.086),vec3(.18,.216,.251),smoothstep(0.,1.,soft(p.xz*.02)));
    col=mix(deep,sky(rf),fres);
    col+=uSunCol*pow(max(dot(rf,uSunDir),0.),220.)*1.4;
  } else if(hit){
    dist=t;
    vec3 p=ro+rd*t;
    vec3 n=normalAt(p,.02*t+.06);
    float grain=vnoise(p.xz*3.1)+.5*vnoise(p.xz*7.3)-.75;
    n=normalize(n+vec3(grain,0.,vnoise(p.zx*2.7)-.5)*.5*exp(-t*.012));
    float top=ridgeTop(p.z);
    float d=p.x-pathX(p.z);

    float strata=vnoise(vec2(p.y*2.2+p.x*.12,p.z*.06))*.7+.3*vnoise(p.xz*1.3);
    vec3 rock=mix(vec3(.231,.165,.133),vec3(.361,.227,.141),strata);
    rock=mix(rock,vec3(.243,.282,.322),vnoise(p.xz*.7)*.5);
    float gr=smoothstep(.62,.84,n.y)*(1.-smoothstep(top*.28,top*.62,p.y));
    vec3 grass=mix(vec3(.361,.227,.141),vec3(.541,.29,.122),vnoise(p.xz*.16));
    vec3 alb=mix(rock,grass,gr);
    float sn=smoothstep(uSnow,uSnow+5.,p.y+vnoise(p.xz*.3)*9.)*smoothstep(.42,.7,n.y);
    alb=mix(alb,vec3(.953,.922,.867),sn);

    float dif=max(dot(n,uSunDir),0.)*shadow(p+n*.3);
    vec3 amb=mix(uSkyHor,uSkyTop,.5+.5*n.y)*.55;
    col=alb*(uSunCol*dif*1.6+amb);

    // The route, burning along the crest ahead of the camera.
    float w=.035+t*.0011;
    float line=(1.-smoothstep(w*.5,w,abs(d)))*step(p.z,uTrailZ);
    float halo=exp(-abs(d)/(w*5.))*.22*step(p.z,uTrailZ);
    vec3 trail=mix(vec3(.941,.761,.478),vec3(.851,.545,.196),clamp(p.z/uLen,0.,1.))*1.8;
    col=mix(col,trail,clamp(line+halo,0.,1.));
  } else {
    dist=tMax;
    col=sky(rd);
  }

  if(dist<tMax){
    float f=1.-exp(-dist*uFog);
    col=mix(col,sky(normalize(vec3(rd.x,max(rd.y,.01),rd.z))),f);
  }

  // Cloud band hugging the ridge.
  float cl=0.; vec3 cc=vec3(0.);
  float end=min(dist,260.), stp=end/9.;
  float off=hash(gl_FragCoord.xy)*stp;
  for(int i=0;i<9;i++){
    vec3 p=ro+rd*(off+float(i)*stp);
    float band=exp(-pow((p.y-uCloudY)/5.,2.));
    float n=soft(p.xz*.04+vec2(0.,p.y*.03));
    float den=smoothstep(.62-uCloud*.34,.9-uCloud*.2,n)*band;
    if(den>0.){
      float a=den*(1.-cl)*.3;
      cc+=a*mix(uSkyHor,vec3(.953,.922,.867)+uSunCol*.2,.72);
      cl+=a;
    }
  }
  col=col*(1.-cl)+cc;

  col=col/(1.+col*.28);
  col=pow(col,vec3(.86));
  outColor=vec4(col,1.);
}`;

const VERT = `#version 300 es
void main(){ vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2); gl_Position=vec4(p*2.-1.,0.,1.); }`;

type RGB = [number, number, number];

// Colour by scroll: blue dawn, high air, Singapore dusk, open ocean, Melbourne sunrise.
// Sky by scroll, every colour from Golden Peak: misty dawn, high air, ember dusk, night ocean, golden sunrise.
const LIGHT: { p: number; top: RGB; hor: RGB; sun: RGB; dir: RGB; fog: number }[] = [
  { p: 0, top: [0.31, 0.353, 0.392], hor: [0.478, 0.518, 0.553], sun: [1.16, 1.04, 0.79], dir: [0.55, 0.42, 0.7], fog: 0.0045 },
  { p: 0.34, top: [0.243, 0.282, 0.322], hor: [0.478, 0.518, 0.553], sun: [1.19, 1.15, 1.08], dir: [0.4, 0.62, 0.65], fog: 0.0028 },
  { p: 0.58, top: [0.133, 0.165, 0.196], hor: [0.71, 0.408, 0.165], sun: [1.28, 0.82, 0.29], dir: [-0.65, 0.18, 0.74], fog: 0.0035 },
  { p: 0.74, top: [0.055, 0.071, 0.086], hor: [0.18, 0.216, 0.251], sun: [0.57, 0.62, 0.66], dir: [0.4, 0.3, 0.86], fog: 0.0026 },
  { p: 0.9, top: [0.243, 0.282, 0.322], hor: [0.851, 0.545, 0.196], sun: [1.41, 1.14, 0.72], dir: [0.3, 0.16, 0.94], fog: 0.0034 },
  { p: 1, top: [0.31, 0.353, 0.392], hor: [0.941, 0.761, 0.478], sun: [1.45, 1.3, 0.99], dir: [0.26, 0.24, 0.93], fog: 0.0034 },
];

function lightAt(p: number) {
  let i = 0;
  while (i < LIGHT.length - 2 && p > LIGHT[i + 1].p) i++;
  const a = LIGHT[i];
  const b = LIGHT[i + 1];
  const t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
  const mix = (x: RGB, y: RGB): RGB => [x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t];
  const dir = mix(a.dir, b.dir);
  const len = Math.hypot(...dir);
  return { top: mix(a.top, b.top), hor: mix(a.hor, b.hor), sun: mix(a.sun, b.sun), dir: dir.map((d) => d / len), fog: a.fog + (b.fog - a.fog) * t };
}

// The places she lived. The flight stops at each one and the camera circles it on its own.
// z is the distance along the route; from/to is the scroll window spent there.
export const STATIONS = [
  { name: "Hòa Bình", z: 52, from: 0.07, to: 0.24 },
  { name: "Hanoi", z: 182, from: 0.33, to: 0.39 },
  { name: "Singapore", z: 672, from: 0.53, to: 0.61 },
  { name: "Melbourne", z: LENGTH, from: 0.79, to: 0.87 },
];
const RAMP = 0.03;
// One full circle every 40 seconds.
const ORBIT_SPEED = (2 * Math.PI) / 40000;

// Distance along the route by scroll: arrive before each circle, hold through it, then fly on.
const CAM_TRAVEL: Keys = [
  [0, 0],
  [0.04, (52 - 80) / LENGTH + 0.02],
  [0.27, (56 - 80) / LENGTH + 0.02],
  [0.3, 182 / LENGTH],
  [0.42, 186 / LENGTH],
  [0.5, 672 / LENGTH],
  [0.64, 676 / LENGTH],
  [0.76, 1],
  [0.9, 1.003],
  [1, 1.03],
];
const LIFT: Keys = [[0, 0], [0.3, 2], [0.35, 10], [0.45, 16], [0.52, 6], [0.63, 6], [0.7, 18], [0.78, 6], [0.9, 4], [1, 8]];
const TILT_UP: Keys = [[0, 0], [0.9, 0], [0.97, 40], [1, 70]];
const LOOK = 170;

// Average over a long window, so small bends and bumps never reach the camera.
const smooth = (f: (z: number) => number, z: number, width: number) => {
  let sum = 0;
  for (let i = -6; i <= 6; i++) sum += f(z + (i * width) / 6);
  return sum / 13;
};
const smoother = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * x * (x * (6 * x - 15) + 10));

// How much of the camera belongs to a place right now, 0 to 1.
export function stationWeight(p: number, s: (typeof STATIONS)[number]) {
  return Math.min(smoother((p - s.from + RAMP) / RAMP), smoother((s.to + RAMP - p) / RAMP));
}
const stationPoint = (s: (typeof STATIONS)[number]): Vec => [pathX(s.z), ridgeTop(s.z) + 3, s.z];
const orbitRadius = (s: (typeof STATIONS)[number]) => 38 + ridgeTop(s.z) * 0.3;

// Highest the ground can reach at (x, z), with the tallest possible rock on top. Mirrors terrain() in the shader.
function groundCeiling(x: number, z: number) {
  const ease = (a: number, b: number, v: number) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const d = x - pathX(z);
  const top = ridgeTop(z);
  const r = Math.exp(-(d * d) / (d < 0 ? 900 : 2100));
  const massif = ease(30, 130, d) * top * 0.9;
  const body = top * r + massif * (1 - r) - ease(16, 80, -d) * (top * 0.35 + 16);
  return body + 0.58 * (2.5 + 0.34 * Math.max(body, 0));
}

// Circling height per place: never closer than 14 units to the tallest ground anywhere on the circle.
const ORBIT_HEIGHT = STATIONS.map((s) => {
  const c = stationPoint(s);
  const radius = orbitRadius(s);
  let highest = -Infinity;
  for (let a = 0; a < 360; a += 3) {
    const t = (a * Math.PI) / 180;
    highest = Math.max(highest, groundCeiling(c[0] + radius * Math.sin(t), c[2] - radius * Math.cos(t)));
  }
  return Math.max(c[1] + 16 + ridgeTop(s.z) * 0.2, highest + 14);
});

const CLOUD: Keys = [[0, 0.3], [0.33, 0.35], [0.36, 1], [0.4, 0.35], [0.61, 0.3], [0.64, 0.95], [0.67, 0.3], [0.86, 0.3], [0.885, 0.9], [0.92, 0.3]];

type Vec = [number, number, number];
const norm = (v: Vec): Vec => {
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// angles: how far the camera has circled each place, in radians (0 = behind it, facing the way the flight goes).
export function cameraAt(p: number, angles: number[] = []) {
  const z = LENGTH * curve(p, CAM_TRAVEL);
  let pos: Vec = [smooth(pathX, z, 120) - 6, smooth(ridgeTop, z, 90) * 1.32 + 20 + curve(p, LIFT), z];
  const ahead = z + LOOK;
  let fwd = norm([smooth(pathX, ahead, 120) - pos[0], smooth(ridgeTop, ahead, 90) * 1.05 + curve(p, TILT_UP) - pos[1], LOOK]);

  STATIONS.forEach((s, i) => {
    const w = stationWeight(p, s);
    if (!w) return;
    const c = stationPoint(s);
    const angle = angles[i] ?? 0;
    const radius = orbitRadius(s);
    const orbit: Vec = [c[0] + radius * Math.sin(angle), ORBIT_HEIGHT[i], c[2] - radius * Math.cos(angle)];
    const look = norm([c[0] - orbit[0], c[1] - orbit[1], c[2] - orbit[2]]);
    pos = [pos[0] + (orbit[0] - pos[0]) * w, pos[1] + (orbit[1] - pos[1]) * w, pos[2] + (orbit[2] - pos[2]) * w];
    fwd = norm([fwd[0] + (look[0] - fwd[0]) * w, fwd[1] + (look[1] - fwd[1]) * w, fwd[2] + (look[2] - fwd[2]) * w]);
  });

  const right = norm(cross([0, 1, 0], fwd));
  const up = cross(fwd, right);
  const zoom = Math.max(...STATIONS.map((st) => stationWeight(p, st)));
  return { pos, fwd, right, up, z: pos[2], focal: FOCAL + 0.6 * zoom };
}


export default function Terrain({
  register,
  onFail,
  onCamera,
}: {
  register?: (fn: Apply) => () => void;
  onFail?: () => void;
  // Called with the camera's eased progress each frame, so overlays can follow the camera rather than the raw scroll.
  onCamera?: (p: number) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const cameraListener = useRef(onCamera);
  cameraListener.current = onCamera;

  useEffect(() => {
    const el = canvas.current;
    const box = root.current;
    if (!el || !box) return;
    const gl = el.getContext("webgl2", { antialias: false, powerPreference: "high-performance" });
    if (!gl) {
      onFail?.();
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    try {
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    } catch (e) {
      console.warn("Terrain shader failed, using the stylised flight", e);
      onFail?.();
      return;
    }
    gl.useProgram(prog);
    gl.bindVertexArray(gl.createVertexArray());
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform1f(u("uLen"), LENGTH);

    let scale = innerWidth < 768 ? 0.5 : 0.6;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = box.clientWidth;
      const h = box.clientHeight;
      // Cap the pixel count so big screens don't cook the GPU.
      const fit = Math.min(1, Math.sqrt(900000 / Math.max(1, w * dpr * scale * h * dpr * scale)));
      el.width = Math.max(1, Math.round(w * dpr * scale * fit));
      el.height = Math.max(1, Math.round(h * dpr * scale * fit));
      gl.viewport(0, 0, el.width, el.height);
    };
    resize();

    const pins = Array.from(box.querySelectorAll<HTMLElement>("[data-pin]"));
    const angles = STATIONS.map(() => 0);

    const draw = (p: number) => {
      const cam = cameraAt(p, angles);
      const l = lightAt(p);
      gl.uniform2f(u("uRes"), el.width, el.height);
      gl.uniform1f(u("uFocal"), cam.focal);
      gl.uniform3fv(u("uCam"), cam.pos);
      gl.uniform3fv(u("uFwd"), cam.fwd);
      gl.uniform3fv(u("uUp"), cam.up);
      gl.uniform3fv(u("uRight"), cam.right);
      gl.uniform3fv(u("uSkyTop"), l.top);
      gl.uniform3fv(u("uSkyHor"), l.hor);
      gl.uniform3fv(u("uSunCol"), l.sun);
      gl.uniform3fv(u("uSunDir"), l.dir);
      gl.uniform1f(u("uFog"), l.fog);
      // Snow line climbs less than the mountains do, so there's more snow the higher she gets.
      gl.uniform1f(u("uSnow"), 26 + 8 * p);
      gl.uniform1f(u("uTrailZ"), cam.z + 70);
      gl.uniform1f(u("uCloudY"), ridgeTop(cam.z) + 3);
      gl.uniform1f(u("uCloud"), key(p, CLOUD));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      cameraListener.current?.(p);

      const w = box.clientWidth;
      const h = box.clientHeight;
      STATIONS.forEach((st, i) => {
        const c = stationPoint(st);
        const v: Vec = [c[0] - cam.pos[0], c[1] - cam.pos[1], c[2] - cam.pos[2]];
        const depth = dot(v, cam.fwd);
        const sx = w / 2 + ((dot(v, cam.right) / depth) * cam.focal * h) / 2;
        const sy = h / 2 - ((dot(v, cam.up) / depth) * cam.focal * h) / 2;
        const shown = depth > 6 && sx > -40 && sx < w + 40 && sy > 60 && sy < h ? stationWeight(p, st) : 0;
        const pin = pins[i];
        pin.style.opacity = String(shown);
        pin.style.visibility = shown > 0.02 ? "visible" : "hidden";
        pin.style.setProperty("--in", String(shown));
        pin.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
      });
    };

    // A touch of inertia on top of the scroll, so the drone has weight.
    let target = 0;
    let current = 0;
    let frame = 0;
    let last = 0;
    let slow = 0;
    let onScreen = true;
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(100, now - last) : 16;
      const delta = target - current;
      // Time-based, so slow machines settle just as quickly as fast ones.
      current = Math.abs(delta) < 0.00004 ? target : current + delta * (1 - Math.exp(-dt / 220));

      // Parked at a place, the camera circles it on its own. Arriving or leaving, it eases back behind the place.
      let circling = false;
      STATIONS.forEach((st, i) => {
        const w = stationWeight(current, st);
        if (w > 0.85) {
          angles[i] += ORBIT_SPEED * dt;
          circling = true;
        } else if (w > 0) {
          const home = Math.round(angles[i] / (2 * Math.PI)) * 2 * Math.PI;
          angles[i] += (home - angles[i]) * (1 - Math.exp(-dt / 700));
          circling ||= Math.abs(home - angles[i]) > 0.002;
        } else angles[i] = 0;
      });

      draw(current);
      // Drop resolution rather than frames on weaker machines.
      if (last && now - last > 45) {
        if (++slow > 6 && scale > 0.28) {
          scale *= 0.8;
          slow = 0;
          resize();
        }
      } else slow = 0;
      const moving = current !== target || (circling && onScreen && !document.hidden);
      last = moving ? now : 0;
      if (moving) frame = requestAnimationFrame(tick);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      queue();
    };
    const onLost = () => onFail?.();
    addEventListener("resize", onResize);
    el.addEventListener("webglcontextlost", onLost);
    const unregister = register?.((p) => {
      target = p;
      queue();
    });
    queue();

    // Only keep circling while the flight is on screen and the tab is visible.
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) queue();
    });
    io.observe(box);
    const onVisible = () => !document.hidden && queue();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      unregister?.();
      cancelAnimationFrame(frame);
      removeEventListener("resize", onResize);
      el.removeEventListener("webglcontextlost", onLost);
    };
  }, [register, onFail]);

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(#2E3740, #7A848D 60%, #161B21)" }}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
      {STATIONS.map((st) => (
        <PlacePin key={st.name} name={st.name} />
      ))}
    </div>
  );
}

// Fan positions around the place marker, in px at the desktop card size (the CSS scales them on phones).
// An arc of cards centred on the marker, tighter when there are more photos, so it fits a phone too.
// Values are px at the desktop card size (150px); the CSS scales them on phones.
function fanSlot(i: number, n: number) {
  const step = n > 4 ? 112 : 158;
  const k = n > 1 ? (i - (n - 1) / 2) / ((n - 1) / 2) : 0;
  return { x: (i - (n - 1) / 2) * step - 75, y: -168 - 78 * (1 - k * k), r: k * (n > 4 ? 9 : 7) };
}

function PlacePin({ name }: { name: string }) {
  const photos = PLACE_PHOTOS[name] ?? [];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div data-pin className="place-pin" style={{ opacity: 0, visibility: "hidden" }} onMouseLeave={() => setOpen(null)}>
      <div role="group" aria-label={`Photos from ${name}`} className="place-fan">
        {photos.map((ph, i) => {
          const f = fanSlot(i, photos.length);
          // Unitless, so the CSS can scale them by the card size in every browser.
          const style = { "--x": f.x, "--y": f.y, "--r": `${f.r}deg` } as React.CSSProperties;
          return ph.src ? (
            <button
              key={ph.alt}
              type="button"
              className="place-card"
              style={style}
              aria-label={ph.alt}
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
              onBlur={() => setOpen(null)}
            >
              {ph.video ? (
                // Plays silently while the card is hovered or opened; only the poster loads until then.
                <video
                  src={ph.video}
                  poster={ph.src}
                  muted
                  loop
                  playsInline
                  preload="none"
                  ref={(v) => {
                    if (!v) return;
                    if (open === i) void v.play().catch(() => {});
                    else v.pause();
                  }}
                  onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => open !== i && e.currentTarget.pause()}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ph.src} alt="" loading="lazy" decoding="async" style={ph.focus ? { objectPosition: ph.focus } : undefined} />
              )}
              {ph.video && (
                <span aria-hidden className="place-play">
                  <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden><path d="M2.5 1.5v7l6-3.5z" fill="currentColor" /></svg>
                </span>
              )}
            </button>
          ) : (
            <div key={ph.alt} className="place-card empty" style={style}>
              {ph.alt}
            </div>
          );
        })}
      </div>
      <div aria-hidden className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="whitespace-nowrap rounded-full bg-night/80 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-paper">{name}</span>
        <span className="h-14 w-[2px]" style={{ background: "linear-gradient(#D98B32, transparent)" }} />
      </div>
    </div>
  );
}
