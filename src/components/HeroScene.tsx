import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Gold/red neural-globe: particle shell + connected nodes, reacts to the mouse and scroll. */
export default function HeroScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const small = window.innerWidth < 760;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    const N = small ? 1400 : 3200;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const gold = new THREE.Color("#f2b84b");
    const red = new THREE.Color("#e0262d");
    for (let i = 0; i < N; i++) {
      const p = fib(i, N, 2.6 + Math.random() * 0.25);
      pos.set([p.x, p.y, p.z], i * 3);
      const c = gold.clone().lerp(red, Math.random());
      col.set([c.r, c.g, c.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 0.028, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    group.add(points);

    // neural nodes + edges
    const M = small ? 55 : 110;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < M; i++) nodes.push(fib(i, M, 1.9 + Math.random() * 0.5));
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    const nodeMat = new THREE.PointsMaterial({ size: 0.09, color: "#ffd98a", transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending });
    const nodePts = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodePts);
    const seg: THREE.Vector3[] = [];
    for (let i = 0; i < M; i++)
      for (let j = i + 1; j < M; j++) if (nodes[i].distanceTo(nodes[j]) < 1.15) seg.push(nodes[i], nodes[j]);
    const lines = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(seg),
      new THREE.LineBasicMaterial({ color: "#e0262d", transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending })
    );
    group.add(lines);

    // inner glowing core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 1),
      new THREE.MeshBasicMaterial({ color: "#e0262d", wireframe: true, transparent: true, opacity: 0.35 })
    );
    group.add(core);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      group.position.x = w > 900 ? 2.6 : 0;
      group.scale.setScalar(w > 900 ? 1 : 0.8);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.12 + mouse.x * 0.5;
      group.rotation.x += (mouse.y * 0.35 - group.rotation.x) * 0.05;
      core.rotation.y = -t * 0.3;
      core.rotation.x = t * 0.2;
      const s = 1 + Math.sin(t * 1.4) * 0.04;
      core.scale.setScalar(s);
      nodeMat.size = 0.09 + Math.sin(t * 2) * 0.015;
      group.position.y = -window.scrollY * 0.002;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      geo.dispose();
    };
  }, []);

  return <canvas ref={ref} />;
}
