import type React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Environment, Html, Lightformer, OrbitControls } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
type OrbitControlsImpl = React.ComponentRef<typeof OrbitControls>;
import { buildStore, type Cat, type Inst, type Sign } from "./layout";
import { DEPARTMENTS, INCIDENTS, topSeverity, type Department, type Incident } from "@/lib/store-data";

export type RenderMode = "hybrid" | "solid" | "wire";
export type SceneHandle = { reset: () => void; zoom: (f: number) => void; focus: (id: string) => void };

const DEFAULT_TARGET = new THREE.Vector3(-1, 0, -1);
const DEFAULT_POS = new THREE.Vector3(30, 34, 40);
const SEV_HEX = { critical: "#e5484d", high: "#f5a524", medium: "#2f7cf6", low: "#9fb6cc" };

type Props = {
  mode: RenderMode;
  selectedDept: string | null;
  selectedIncident: string | null;
  onSelectDept: (id: string | null) => void;
  onSelectIncident: (inc: Incident) => void;
};

export const StoreScene = forwardRef<SceneHandle, Props>(function StoreScene(props, ref) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: DEFAULT_POS.toArray(), fov: 32, near: 0.5, far: 300 }}
      onPointerMissed={() => props.onSelectDept(null)}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ffffff", "#e8dfcf", 0.6]} />
      <directionalLight
        position={[14, 30, 18]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
        shadow-bias={-0.0004}
      />
      {([[-9, -4], [5, 0], [12, 3], [-12, 8], [8, -10]] as [number, number][]).map(([x, z], i) => (
        <pointLight key={i} position={[x, 2.9, z]} intensity={6} distance={10} color="#ffd9a8" />
      ))}
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} />
        <Lightformer intensity={1} color="#ffe9cf" position={[-8, 3, 4]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
        <Lightformer intensity={0.8} color="#dbe9ff" position={[8, 3, -4]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
      </Environment>
      <Rig ref={ref} />
      <Store {...props} />
    </Canvas>
  );
});

/* ---------------- Camera rig ---------------- */
const Rig = forwardRef<SceneHandle>(function Rig(_, ref) {
  const controls = useRef<OrbitControlsImpl>(null);
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const { camera } = useThree();

  useImperativeHandle(ref, () => ({
    reset: () => (goal.current = { pos: DEFAULT_POS.clone(), target: DEFAULT_TARGET.clone() }),
    zoom: (f) => {
      const c = controls.current;
      if (!c) return;
      const off = camera.position.clone().sub(c.target).multiplyScalar(f);
      goal.current = { pos: c.target.clone().add(off), target: c.target.clone() };
    },
    focus: (id) => {
      const d = DEPARTMENTS.find((x) => x.id === id);
      if (!d) return;
      const target = new THREE.Vector3(d.center[0], 0.8, d.center[1]);
      const dir = DEFAULT_POS.clone().sub(DEFAULT_TARGET).normalize();
      goal.current = { pos: target.clone().add(dir.multiplyScalar(26)), target };
    },
  }));

  useFrame((_, raw) => {
    const g = goal.current, c = controls.current;
    if (!g || !c) return;
    const k = 1 - Math.exp(-4 * Math.min(raw, 0.05));
    camera.position.lerp(g.pos, k);
    c.target.lerp(g.target, k);
    c.update();
    if (camera.position.distanceTo(g.pos) < 0.05) goal.current = null;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={DEFAULT_TARGET.toArray()}
      enableDamping
      dampingFactor={0.08}
      minDistance={12}
      maxDistance={90}
      maxPolarAngle={Math.PI / 2.2}
      onStart={() => (goal.current = null)}
    />
  );
});

/* ---------------- Store ---------------- */
function Store({ mode, selectedDept, selectedIncident, onSelectDept, onSelectIncident }: Props) {
  const layout = useMemo(() => buildStore(), []);
  const ghost = mode === "wire";
  return (
    <group>
      <Floor ghost={ghost} />
      {(Object.keys(layout.cats) as Cat[]).map((cat) => (
        <InstancedCat key={cat} cat={cat} items={layout.cats[cat]} ghost={ghost} />
      ))}
      <Lines data={layout.struct} visible={mode !== "solid"} opacity={ghost ? 0.7 : 0.38} />
      <Lines data={layout.detail} visible={ghost} opacity={0.35} />
      {layout.signs.map((s, i) => (
        <SignPlate key={i} sign={s} />
      ))}
      {DEPARTMENTS.map((d) => (
        <DeptPad key={d.id} dept={d} selected={selectedDept === d.id} onSelect={onSelectDept} />
      ))}
      <Markers selectedDept={selectedDept} selectedIncident={selectedIncident} onSelectIncident={onSelectIncident} />
    </group>
  );
}

function Floor({ ghost }: { ghost: boolean }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#efe7d9";
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#e9e0d0";
    g.fillRect(0, 0, 128, 128);
    g.fillRect(128, 128, 128, 128);
    g.strokeStyle = "#d9cfbd";
    g.lineWidth = 3;
    g.strokeRect(0, 0, 128, 128);
    g.strokeRect(128, 128, 128, 128);
    g.strokeRect(128, 0, 128, 128);
    g.strokeRect(0, 128, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(18, 14);
    t.anisotropy = 8;
    return t;
  }, []);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.125, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial map={tex} roughness={0.35} metalness={0.02} transparent={ghost} opacity={ghost ? 0.25 : 1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[60, 50]} />
        <shadowMaterial opacity={0.12} />
      </mesh>
    </>
  );
}

const SPHERE = new THREE.SphereGeometry(0.5, 12, 10);
const BOX = new THREE.BoxGeometry(1, 1, 1);

function InstancedCat({ cat, items, ghost }: { cat: Cat; items: Inst[]; ghost: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.rotation.set(0, it.r ?? 0, 0);
      o.scale.set(...it.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, col.set(it.c));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
  }, [items]);

  const geo = cat === "fruit" || cat === "plant" ? SPHERE : BOX;
  const glass = cat === "glass";
  const mat = useMemo(() => {
    if (glass)
      return new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0, depthWrite: false, envMapIntensity: 1.4 });
    const rough = { white: 0.75, metal: 0.35, dark: 0.45, wood: 0.7, product: 0.55, fruit: 0.5, glow: 0.3, plant: 0.8, glass: 0 }[cat];
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: rough,
      metalness: cat === "metal" ? 0.55 : 0,
      emissive: cat === "glow" ? new THREE.Color("#ffffff") : new THREE.Color("#000000"),
      emissiveIntensity: cat === "glow" ? 0.55 : 0,
    });
  }, [cat, glass]);
  useLayoutEffect(() => {
    if (glass) return;
    mat.transparent = ghost;
    mat.opacity = ghost ? (cat === "product" || cat === "fruit" ? 0.06 : 0.14) : 1;
    mat.depthWrite = !ghost;
    mat.needsUpdate = true;
  }, [ghost, mat, cat, glass]);

  return (
    <instancedMesh
      ref={ref}
      args={[geo, mat, items.length]}
      castShadow={!glass && !ghost}
      receiveShadow
      raycast={() => null}
    />
  );
}

function Lines({ data, visible, opacity }: { data: Float32Array; visible: boolean; opacity: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data, 3));
    return g;
  }, [data]);
  return (
    <lineSegments geometry={geo} visible={visible} raycast={() => null}>
      <lineBasicMaterial color="#3b4048" transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  );
}

function SignPlate({ sign }: { sign: Sign }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 96;
    const g = c.getContext("2d")!;
    g.fillStyle = "#2b2e33";
    g.fillRect(0, 0, 512, 96);
    g.fillStyle = "#f5f2ea";
    g.font = "600 46px Geist, Helvetica, Arial, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.letterSpacing = "6px";
    g.fillText(sign.text, 256, 50);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [sign.text]);
  return (
    <mesh position={sign.p} rotation-y={sign.r} raycast={() => null}>
      <planeGeometry args={[sign.w, sign.w * (96 / 512)]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function DeptPad({ dept, selected, onSelect }: { dept: Department; selected: boolean; onSelect: (id: string | null) => void }) {
  const [hover, setHover] = useState(false);
  const active = hover || selected;
  return (
    <group position={[dept.center[0], 0, dept.center[1]]}>
      <mesh
        position={[0, 1.2, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(dept.id);
        }}
      >
        <boxGeometry args={[dept.size[0], 2.4, dept.size[1]]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges visible={active} color={selected ? "#2f7cf6" : "#5a6470"} lineWidth={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.14, 0]} visible={active} raycast={() => null}>
        <planeGeometry args={dept.size} />
        <meshBasicMaterial color="#2f7cf6" transparent opacity={selected ? 0.14 : 0.07} depthWrite={false} />
      </mesh>
      {hover && !selected && (
        <Html position={[0, 2.9, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="vos-tooltip">{dept.name}</div>
        </Html>
      )}
    </group>
  );
}

function Markers({ selectedDept, selectedIncident, onSelectIncident }: Pick<Props, "selectedDept" | "selectedIncident" | "onSelectIncident">) {
  const groups = useMemo(
    () =>
      DEPARTMENTS.map((d) => ({ d, list: INCIDENTS.filter((i) => i.departmentId === d.id) })).filter((g) => g.list.length > 0),
    [],
  );
  return (
    <>
      {groups.map(({ d, list }) => (
        <Marker
          key={d.id}
          dept={d}
          list={list}
          dim={!!selectedDept && selectedDept !== d.id}
          active={list.some((i) => i.id === selectedIncident)}
          onClick={() => list[0] && onSelectIncident(list[0])}
        />
      ))}
    </>
  );
}

function Marker({ dept, list, dim, active, onClick }: { dept: Department; list: Incident[]; dim: boolean; active: boolean; onClick: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const sev = topSeverity(list);
  const offset = useMemo(() => dept.center[0] * 0.37, [dept]);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = 3.6 + Math.sin(clock.elapsedTime * 1.6 + offset) * 0.12;
  });
  const crit = list.filter((i) => i.severity === sev).length;
  const label = sev === "critical" ? `${crit} Critical ${crit === 1 ? "Issue" : "Issues"}` : `${list.length} ${list.length === 1 ? "Issue" : "Issues"}`;
  return (
    <group ref={ref} position={[dept.center[0], 3.6, dept.center[1]]}>
      <Html center zIndexRange={[30, 10]}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="vos-marker"
          data-sev={sev}
          data-dim={dim}
          data-active={active}
          aria-label={`${dept.name}: ${label}`}
        >
          <span className="vos-marker-pin" style={{ background: SEV_HEX[sev] }}>
            {sev === "critical" ? "!" : sev === "high" ? "▲" : "i"}
          </span>
          <span className="vos-marker-text">
            <span className="vos-marker-title">{dept.name}</span>
            <span className="vos-marker-sub" style={{ color: SEV_HEX[sev] }}>
              {label}
            </span>
          </span>
        </button>
      </Html>
    </group>
  );
}
