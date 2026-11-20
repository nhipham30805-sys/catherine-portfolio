"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { calm } from "@/lib/motion";

// "Above the ridges" (chosen by Catherine Nov 2026, after the live sky on house-of-imaginaries.com; drawn from
// scratch, nothing copied). A live sky behind "Solve smarter": three mountain ranges with rock texture, snow on the
// far peaks and mist drifting between them; stars, the odd gold shooting star and a summit lit gold. The ranges rise
// into place as the zoom lands (`rise` 0 to 1). It only draws while on screen, at reduced resolution. Visitors who
// ask for less motion get one still frame; a device without WebGL keeps the plain dark background.
const FRAG = `#version 300 es
precision highp float;
uniform vec2 R; uniform float T; uniform float rise;
out vec4 o;
vec3 hex(float r,float g,float b){return vec3(r,g,b)/255.;}
float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
float stars(vec2 p,float t){vec2 g=p*80.;vec2 id=floor(g);vec2 f=fract(g)-.5;float r=h(id);if(r<.94)return 0.;
  vec2 off=vec2(h(id+3.),h(id+7.))-.5;float d=length(f-off*.6);float tw=.55+.45*sin(t*(1.+r*3.)+r*60.);
  return smoothstep(.09,0.,d)*tw*(.4+(r-.94)/.06);}
float shoot(vec2 p,float asp,float t){float per=7.;float k=floor(t/per);float ph=mod(t,per)/per;if(ph>.14)return 0.;
  vec2 s=vec2(asp*(.15+.6*h(vec2(k,1.))),.92-.15*h(vec2(k,2.)));vec2 dir=normalize(vec2(.8,-.38));
  vec2 head=s+dir*(ph/.14)*.7;vec2 tail=head-dir*.22;vec2 pa=p-tail,ba=head-tail;float u=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  float d=length(pa-ba*u);float fade=sin(ph/.14*3.1416);return smoothstep(.004,0.,d)*u*u*fade;}
float ridge(float x,float f,float s){float v=0.,a=.6;x=x*f+s;for(int i=0;i<6;i++){float r=1.-abs(n(vec2(x,s+float(i)*3.1))*2.-1.);v+=a*r*r;x*=2.2;a*=.46;}return v*1.15;}
void main(){
  vec2 uv=gl_FragCoord.xy/R;float asp=R.x/R.y;vec2 p=vec2(uv.x*asp,uv.y);
  vec3 night=hex(14.,18.,22.),mid=hex(22.,27.,33.),dusk=hex(34.,42.,50.),slate=hex(46.,55.,64.),storm=hex(62.,72.,82.),mist=hex(79.,90.,100.),fog=hex(122.,132.,141.);
  vec3 ridgeC=hex(59.,42.,34.),umber=hex(92.,58.,36.),copper=hex(138.,74.,31.),ember=hex(181.,104.,42.),sun=hex(217.,139.,50.),gold=hex(240.,194.,122.),honey=hex(247.,221.,168.),paper=hex(243.,235.,221.);
  float e=smoothstep(0.,1.,rise);
  vec3 col;
    float lift=(1.-e)*.35;
    // sky: night above, warm ember glow low behind the summit
    col=mix(dusk*1.05,night,smoothstep(.2,.95,uv.y));
    vec2 sc=vec2(asp*.66,.46-lift);
    col+=gold*exp(-length((p-sc)*vec2(.55,1.2))*4.2)*.55+ember*exp(-pow(uv.y-.25+lift,2.)*30.)*.18;
    // thin high streaks of cloud, lit from below
    float hs=fbm(vec2(p.x*1.1+T*.012,p.y*10.));
    col=mix(col,mix(col,gold,.3),smoothstep(.6,.78,hs)*smoothstep(.42,.7,uv.y)*smoothstep(.95,.7,uv.y)*.55);
    col+=stars(p,T)*paper*smoothstep(.5,.95,uv.y);
    col+=shoot(p,asp,T)*gold*1.4;
    float aa=1.3/R.y;
    for(int k=0;k<3;k++){
      float fk=float(k);
      float base=.21-fk*.085,amp=.25-fk*.065,fr=1.6+fk*.9,sd=3.+fk*8.,lk=lift*(1.+fk*.22);
      float top=base+amp*ridge(p.x,fr,sd)-lk;
      float d=top-uv.y;
      if(d>-aa){
        float cover=smoothstep(-aa,aa,d);
        float ex=.03;float sl=(ridge(p.x+ex,fr,sd)-ridge(p.x-ex,fr,sd))*amp/(2.*ex);
        // gullies run down the faces; fine grit breaks up the flat fill
        float gx=p.x*(16.+fk*8.)+d*(5.+fk*2.)*clamp(sl*2.5,-1.,1.);
        float gully=pow(1.-abs(fbm(vec2(gx*.35,d*16.+sd))*2.-1.),6.)*smoothstep(.3,.6,fbm(vec2(p.x*6.,d*4.)+sd));
        float grit=fbm(vec2(p.x*55.+uv.y*20.,uv.y*48.)+sd);
        float strata=n(vec2(p.x*3.,(uv.y+p.x*.25*clamp(sl*2.5,-1.,1.))*55.+sd));
        vec3 hi=k==0?mix(mist,fog,.25):(k==1?storm:dusk*1.15);
        vec3 lo=k==0?storm*.9:(k==1?slate*.85:night);
        vec3 rock=mix(hi,lo,smoothstep(0.,.2+fk*.04,d));
        rock*=.82+.3*grit;
        rock*=.94+.1*strata;
        rock=mix(rock,rock*.72,gully*smoothstep(.0,.03,d)*(.6+.4*grit));
        float near=exp(-abs(p.x-sc.x)*(1.4+fk*.8));
        float facing=clamp(-sl*clamp((p.x-sc.x)*5.,-1.,1.)*.7,0.,1.);
        rock+=gold*facing*near*(.4-fk*.12)*smoothstep(.18,0.,d)*(.7+.3*grit);
        if(k==0){float peak=smoothstep(base+amp*.45,base+amp*.85,top+lk);float sdep=.012+.04*fbm(vec2(p.x*5.,7.));float patchy=smoothstep(.38,.62,fbm(vec2(p.x*14.+d*30.,d*60.)+sd));float sn=peak*smoothstep(sdep,sdep*.35,d)*mix(.25,1.,patchy)*(.6+.4*grit);
          rock=mix(rock,mix(paper,honey,.35)*(.75+.25*near),sn*.9);}
        rock+=gold*(.55-fk*.2)*smoothstep(.008,0.,abs(d))*near*near;
        col=mix(col,rock,cover);
      }
      if(k<2){
        float my=base-.03-lk;
        float mv=fbm(vec2(p.x*1.2-T*(.016+fk*.012),(uv.y-my)*6.+fk*5.));
        float fall=exp(-pow((uv.y-my)/.075,2.));
        col=mix(col,mix(fog,paper,.14)*(1.-fk*.18),smoothstep(.42,.74,mv)*fall*.62);
      }
    }
    col+=(h(gl_FragCoord.xy+fract(T*.37)*311.)-.5)*.035;
  // soft vignette for the words
  col*=mix(1.,.82,smoothstep(.35,1.,length(uv-vec2(.5,.62))));
  o=vec4(col,1.);
}`;

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0., 1.); }`;

export default function RidgeSky({ rise, className }: { rise: MutableRefObject<number>; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const gl = cv.getContext("webgl2", { antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const still = calm();
    const make = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, make(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, make(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "R");
    const uT = gl.getUniformLocation(prog, "T");
    const uRise = gl.getUniformLocation(prog, "rise");

    // Drawn below full resolution: soft scenery does not need every pixel, and it keeps laptops cool.
    const fit = () => {
      const s = Math.min(devicePixelRatio, 1.5) * 0.8;
      cv.width = Math.max(1, Math.round(cv.clientWidth * s));
      cv.height = Math.max(1, Math.round(cv.clientHeight * s));
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const t0 = performance.now();
    let on = false;
    let raf = 0;
    const draw = () => {
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, still ? 12 : (performance.now() - t0) / 1000);
      gl.uniform1f(uRise, still ? 1 : rise.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => {
      draw();
      if (on) raf = requestAnimationFrame(loop);
    };
    fit();
    draw();
    cv.classList.add("is-live");
    const onResize = () => {
      fit();
      draw();
    };
    addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting && !still;
      cancelAnimationFrame(raf);
      if (on) loop();
      else if (e.isIntersecting) draw();
    });
    io.observe(cv);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [rise]);

  return <canvas ref={canvas} className={className} aria-hidden />;
}
