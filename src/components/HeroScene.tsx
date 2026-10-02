import { useEffect, useRef } from "react";
import * as THREE from "three";

type Palette = { a: string; b: string; node: string; line: string; core: string; blend: THREE.Blending; dust: number; lines: number; coreOp: number };
const DARK: Palette = { a: "#f2b84b", b: "#e0262d", node: "#ffd98a", line: "#e0262d", core: "#e0262d", blend: THREE.AdditiveBlending, dust: 0.85, lines: 0.38, coreOp: 0.35 };
const LIGHT: Palette = { a: "#b87a12", b: "#c4202a", node: "#8f1217", line: "#c4202a", core: "#c4202a", blend: THREE.NormalBlending, dust: 0.8, lines: 0.32, coreOp: 0.3 };
const palette = (): Palette => (document.documentElement.getAttribute("data-theme") === "light" ? LIGHT : DARK);

function makeSprite(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.45, "rgba(255,255,255,0.95)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/** Gold/red neural-globe: particle shell + connected nodes, reacts to the mouse and scroll. Follows the site theme. */
function init(canvas: HTMLCanvasElement): () => void {
  const small = window.innerWidth < 760;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: "low-power" });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.75));

  // Software renderers (no GPU) would block the main thread: draw one still frame instead of animating.
  const gl = renderer.getContext();
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
  const stillOnly = /swiftshader|llvmpipe|software|basic render/i.test(gpu);

  const sprite = makeSprite();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 7;
  const group = new THREE.Group();
  scene.add(group);

  const fib = (i: number, n: number, r: number) => {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    return new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r);
  };

  // dust shell
  const N = small ? 900 : 2400;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const mix = new Float32Array(N); // per-particle gold<->red mix, kept so we can recolor on theme change
  for (let i = 0; i < N; i++) {
    const p = fib(i, N, 2.6 + Math.random() * 0.25);
    pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
    mix[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const colAttr = new THREE.BufferAttribute(col, 3);
  geo.setAttribute("color", colAttr);
  const dustMat = new THREE.PointsMaterial({ size: 0.045, map: sprite, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false });
  group.add(new THREE.Points(geo, dustMat));

  // neural nodes + edges
  const M = small ? 45 : 90;
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < M; i++) nodes.push(fib(i, M, 1.9 + Math.random() * 0.5));
  const nodeMat = new THREE.PointsMaterial({ size: 0.12, map: sprite, transparent: true, opacity: 1, depthWrite: false });
  group.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(nodes), nodeMat));
  const seg: THREE.Vector3[] = [];
  for (let i = 0; i < M; i++)
    for (let j = i + 1; j < M; j++) if (nodes[i].distanceTo(nodes[j]) < 1.25) seg.push(nodes[i], nodes[j]);
  const lineMat = new THREE.LineBasicMaterial({ transparent: true });
  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg), lineMat));

  // inner glowing core
  const coreMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), coreMat);
  group.add(core);

  const c1 = new THREE.Color(), c2 = new THREE.Color(), c = new THREE.Color();
  const applyTheme = () => {
    const p = palette();
    c1.set(p.a); c2.set(p.b);
    for (let i = 0; i < N; i++) {
      c.copy(c1).lerp(c2, mix[i]);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    colAttr.needsUpdate = true;
    dustMat.blending = p.blend; dustMat.opacity = p.dust; dustMat.needsUpdate = true;
    nodeMat.color.set(p.node); nodeMat.blending = p.blend; nodeMat.needsUpdate = true;
    lineMat.color.set(p.line); lineMat.opacity = p.lines; lineMat.blending = p.blend; lineMat.needsUpdate = true;
    coreMat.color.set(p.core); coreMat.opacity = p.coreOp;
    if (stillOnly) renderer.render(scene, camera);
  };
  applyTheme();
  const mo = new MutationObserver(applyTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const mouse = { x: 0, y: 0 };
  const onMove = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!stillOnly) window.addEventListener("mousemove", onMove, { passive: true });

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    group.position.x = w > 900 ? 2.6 : 0;
    group.scale.setScalar(w > 900 ? 1 : 0.8);
    if (stillOnly) renderer.render(scene, camera);
  };
  resize();
  window.addEventListener("resize", resize);

  let raf = 0, visible = true, last = 0;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);
  const frameGap = small ? 34 : 17; // cap at ~30fps on phones, ~60fps on desktop
  const t0 = performance.now();
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    if (!visible || now - last < frameGap) return;
    last = now;
    const t = (now - t0) / 1000;
    group.rotation.y = t * 0.12 + mouse.x * 0.5;
    group.rotation.x += (mouse.y * 0.35 - group.rotation.x) * 0.05;
    core.rotation.y = -t * 0.3;
    core.rotation.x = t * 0.2;
    core.scale.setScalar(1 + Math.sin(t * 1.4) * 0.04);
    nodeMat.size = 0.12 + Math.sin(t * 2) * 0.02;
    group.position.y = -window.scrollY * 0.002;
    renderer.render(scene, camera);
  };
  if (!stillOnly) raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    mo.disconnect();
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("resize", resize);
    renderer.dispose();
    geo.dispose();
    sprite.dispose();
  };
}

export default function HeroScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const start = () => {
      if (disposed || !ref.current) return;
      cleanup = init(ref.current);
      ref.current.classList.add("ready");
    };
    // Phones / low-core devices start the 3D later so the page is interactive first; it fades in.
    const slow = window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;
    // Start after first paint / when the browser is idle so the page becomes interactive first.
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const kick = () => (w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 400));
    let id = 0;
    const t = slow ? window.setTimeout(() => { id = kick(); }, 2400) : 0;
    if (!slow) id = kick();
    return () => {
      disposed = true;
      clearTimeout(t);
      if (w.requestIdleCallback && w.cancelIdleCallback) w.cancelIdleCallback(id); else clearTimeout(id);
      cleanup();
    };
  }, []);
  return <canvas ref={ref} aria-hidden />;
}
