"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import type { Group } from "three";


type RoomStyle = {
  label:string; subtitle:string; wall:string; floor:string; furniture:string; accent:string; luxe:boolean;
};

const styles: Record<string,RoomStyle> = {
  "Crypto Guru":{label:"PENTHOUSE",subtitle:"$1M+ portfolio · city view · private office",wall:"#eee9d8",floor:"#b9b2a1",furniture:"#34372f",accent:"#d5ad47",luxe:true},
  "NFT Native":{label:"COLLECTOR LOFT",subtitle:"PFP walls · gallery sofa · collector desk",wall:"#e8e4da",floor:"#9d9b91",furniture:"#564d48",accent:"#d58b65",luxe:true},
  "Crypto Developer":{label:"BUILDER APARTMENT",subtitle:"dual monitors · late nights · code on the wall",wall:"#dce7df",floor:"#8d9a8f",furniture:"#3d5049",accent:"#55c6a4",luxe:false},
  "Crypto Analyst":{label:"HIGH-RISE STUDIO",subtitle:"clean lines · market screens · quiet morning",wall:"#e4e9e3",floor:"#aaa99c",furniture:"#59625a",accent:"#8ebf68",luxe:false},
  Degen:{label:"DEGEN PAD",subtitle:"one couch · five screens · questionable decisions",wall:"#ded7cf",floor:"#7e766e",furniture:"#4b3e3a",accent:"#ff7847",luxe:false},
  "Airdrop Hunter":{label:"HUSTLE FLAT",subtitle:"airdrop tabs open · rent paid · still hunting",wall:"#e3e5d7",floor:"#858d7d",furniture:"#5a584d",accent:"#9ebf43",luxe:false},
  "Web3 Jobber":{label:"RENTED APARTMENT",subtitle:"mod queue · side gigs · grind mode",wall:"#e6e0d5",floor:"#8b8377",furniture:"#65594e",accent:"#e44f8f",luxe:false},
};

function Box({position,size,color}:{position:[number,number,number];size:[number,number,number];color:string}) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={0.72}/></mesh>;
}


type HomeAction = "sleep" | "hygiene" | "cook" | "work" | "watch";
type NpcId = "mara" | "rae" | "dex" | "nia";
type Interaction = HomeAction | NpcId;
type Target = { id: Interaction; kind: "place" | "person"; label: string; title: string; position: [number, number] };

const worldTargets: Target[] = [
  { id:"sleep", kind:"place", label:"BEDROOM", title:"Get some sleep", position:[-4.6,-2.5] },
  { id:"hygiene", kind:"place", label:"BATHROOM", title:"Freshen up", position:[5.1,-2.8] },
  { id:"cook", kind:"place", label:"KITCHEN", title:"Make something to eat", position:[4.4,2.1] },
  { id:"work", kind:"place", label:"WORK DESK", title:"Work on a bounty", position:[-4.2,2.4] },
  { id:"watch", kind:"place", label:"LOUNGE", title:"Take a break", position:[0,-2.8] },
  { id:"mara", kind:"person", label:"MARA", title:"Talk to Mara", position:[2.1,0.6] },
  { id:"rae", kind:"person", label:"RAE", title:"Talk to Rae", position:[-1.8,0.7] },
  { id:"dex", kind:"person", label:"DEX", title:"Talk to Dex", position:[2.5,-1.1] },
  { id:"nia", kind:"person", label:"NIA", title:"Talk to Nia", position:[-2.2,-1.2] },
];

const homeActions: Record<HomeAction,{label:string;title:string;detail:string;need:string;amount:number}> = {
  sleep:{label:"BED",title:"Sleep",detail:"Recover energy and start the next part of your day.",need:"ENERGY",amount:18},
  hygiene:{label:"BATHROOM",title:"Freshen Up",detail:"Wash up before heading into the city.",need:"HYGIENE",amount:22},
  cook:{label:"KITCHEN",title:"Cook",detail:"Make a quick meal and refill your hunger.",need:"HUNGER",amount:24},
  work:{label:"DESK",title:"Work",detail:"Open your laptop and grind a crypto task from home.",need:"CASH",amount:120},
  watch:{label:"TV / LOUNGE",title:"Watch",detail:"Take a break and raise your fun.",need:"FUN",amount:16},
};

const isHomeAction = (id: Interaction): id is HomeAction => ["sleep","hygiene","cook","work","watch"].includes(id);

function Citizen({position, color, hair, scale=1}:{position:[number,number];color:string;hair:string;scale?:number}) {
  const ref=useRef<Group>(null);
  useFrame(({clock})=>{
    if(!ref.current) return;
    const t=clock.elapsedTime + position[0] * 0.3;
    ref.current.position.y=Math.sin(t*1.5)*0.025;
    ref.current.rotation.y=Math.sin(t*.45)*.22;
  });
  return <group ref={ref} position={[position[0],0,position[1]]} scale={scale}>
    <mesh position={[0,1.38,0]} castShadow><sphereGeometry args={[.32,20,18]}/><meshStandardMaterial color={hair} roughness={.8}/></mesh>
    <mesh position={[0,1.06,.08]} castShadow><sphereGeometry args={[.25,20,18]}/><meshStandardMaterial color="#c98d6b" roughness={.9}/></mesh>
    <mesh position={[0,.58,0]} castShadow><capsuleGeometry args={[.22,.62,6,12]}/><meshStandardMaterial color={color} roughness={.72}/></mesh>
    <mesh position={[-.13,.16,0]} castShadow><capsuleGeometry args={[.075,.35,4,8]}/><meshStandardMaterial color="#28302a"/></mesh>
    <mesh position={[.13,.16,0]} castShadow><capsuleGeometry args={[.075,.35,4,8]}/><meshStandardMaterial color="#28302a"/></mesh>
  </group>;
}

function StarterApartment() {
  const floorboards = Array.from({ length: 18 }, (_, i) => i);
  const wallArt = [
    { x: -1.25, color: "#d6b16b" },
    { x: 0.05, color: "#7f9c8d" },
    { x: 1.35, color: "#c77d65" },
  ];
  return <>
    {/* Warm, compact starter flat: the room itself is the first playable vertical slice. */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
      <planeGeometry args={[16, 12]} />
      <meshStandardMaterial color="#c4a982" roughness={0.92} />
    </mesh>
    {floorboards.map((i) => <Box key={i} position={[-7.2 + i * 0.84, -0.025, 0]} size={[0.025, 0.025, 11.7]} color="#9b7755" />)}
    {/* Back and side walls; front stays open so the player can read the space. */}
    <Box position={[0, 1.75, -5.85]} size={[16, 3.5, 0.22]} color="#e7dfd0" />
    <Box position={[-7.85, 1.75, 0]} size={[0.22, 3.5, 11.7]} color="#d9d0c0" />
    <Box position={[7.85, 1.75, 0]} size={[0.22, 3.5, 11.7]} color="#d9d0c0" />
    <Box position={[0, 3.52, -5.8]} size={[16, 0.12, 0.35]} color="#a68a69" />
    {/* Large window and a night-city view. */}
    <Box position={[0.8, 2.25, -5.71]} size={[3.7, 1.65, 0.08]} color="#344c54" />
    <Box position={[0.8, 2.25, -5.64]} size={[0.07, 1.65, 0.05]} color="#d6c8ad" />
    <Box position={[0.8, 2.25, -5.63]} size={[3.7, 0.07, 0.05]} color="#d6c8ad" />
    <Box position={[-1.05, 2.25, -5.62]} size={[0.12, 1.82, 0.12]} color="#d6c8ad" />
    <Box position={[2.65, 2.25, -5.62]} size={[0.12, 1.82, 0.12]} color="#d6c8ad" />
    <Box position={[0.8, 1.37, -5.56]} size={[4.05, 0.12, 0.35]} color="#795f46" />
    {/* Ceiling light and a little warm pool of light. */}
    <mesh position={[0, 3.35, 0.2]}><sphereGeometry args={[0.16, 16, 12]} /><meshStandardMaterial color="#f8e5a8" emissive="#f8d98a" emissiveIntensity={0.65} /></mesh>
    {/* Work corner: desk, monitor, keyboard, task lamp and chair. */}
    <Box position={[-4.25, 0.72, 2.45]} size={[2.5, 0.14, 1.05]} color="#5a4030" />
    <Box position={[-5.25, 0.36, 2.45]} size={[0.12, 0.68, 0.88]} color="#49372d" />
    <Box position={[-3.25, 0.36, 2.45]} size={[0.12, 0.68, 0.88]} color="#49372d" />
    <Box position={[-4.25, 1.18, 2.03]} size={[1.08, 0.68, 0.08]} color="#252c2c" />
    <Box position={[-4.25, 1.18, 1.975]} size={[0.94, 0.52, 0.025]} color="#67bba6" />
    <Box position={[-4.25, 0.83, 1.78]} size={[0.78, 0.035, 0.3]} color="#272b2b" />
    <Box position={[-4.25, 0.56, 3.28]} size={[0.72, 0.56, 0.65]} color="#444a43" />
    <Box position={[-5.05, 1.04, 2.1]} size={[0.08, 0.58, 0.08]} color="#d2a45c" />
    <mesh position={[-4.6, 1.37, 2.08]}><coneGeometry args={[0.2, 0.3, 16]} /><meshStandardMaterial color="#d2a45c" emissive="#d2a45c" emissiveIntensity={0.18} /></mesh>
    {/* Bed and bedside table. */}
    <Box position={[-4.75, 0.3, -2.6]} size={[2.7, 0.42, 3.2]} color="#59483e" />
    <Box position={[-4.75, 0.55, -2.62]} size={[2.55, 0.18, 3.02]} color="#e5dfd2" />
    <Box position={[-4.75, 0.68, -3.25]} size={[2.55, 0.16, 1.55]} color="#6c8d88" />
    <Box position={[-5.35, 0.78, -4.12]} size={[0.76, 0.24, 0.62]} color="#f0e9dc" />
    <Box position={[-3.15, 0.42, -3.85]} size={[0.68, 0.82, 0.72]} color="#6c5544" />
    <Box position={[-3.15, 0.87, -3.85]} size={[0.74, 0.08, 0.78]} color="#c49c65" />
    {/* Kitchenette: cabinets, counter, sink and fridge. */}
    <Box position={[4.6, 0.48, 2.5]} size={[4.5, 0.9, 0.78]} color="#8b6a4d" />
    <Box position={[4.6, 0.98, 2.5]} size={[4.58, 0.12, 0.84]} color="#d9d0be" />
    <Box position={[3.15, 0.72, 2.5]} size={[0.08, 0.5, 0.82]} color="#d4c6af" />
    <Box position={[4.35, 0.72, 2.5]} size={[0.08, 0.5, 0.82]} color="#d4c6af" />
    <Box position={[5.45, 1.52, 2.55]} size={[1.12, 2.1, 1.02]} color="#d6d8d0" />
    <Box position={[5.45, 1.5, 2.01]} size={[0.94, 1.88, 0.05]} color="#b9c0b9" />
    <Box position={[3.85, 1.06, 2.45]} size={[0.8, 0.04, 0.38]} color="#303d3a" />
    <Box position={[4.95, 1.1, 2.45]} size={[0.46, 0.08, 0.46]} color="#bd9a66" />
    {/* Bathroom nook, partitioned from the main room. */}
    <Box position={[6.05, 1.18, -3.05]} size={[3.25, 2.36, 0.14]} color="#d3d8cf" />
    <Box position={[4.48, 1.18, -4.05]} size={[0.14, 2.36, 2.05]} color="#d3d8cf" />
    <Box position={[6.1, 0.2, -3.1]} size={[3.05, 0.16, 2.65]} color="#b8c3b8" />
    <Box position={[6.55, 0.46, -3.45]} size={[0.72, 0.5, 0.88]} color="#f2eee4" />
    <Box position={[6.55, 0.73, -3.45]} size={[0.74, 0.08, 0.9]} color="#d9ddd5" />
    <Box position={[5.05, 0.62, -2.3]} size={[0.72, 1.12, 0.56]} color="#f0eee7" />
    <Box position={[5.05, 1.22, -2.3]} size={[0.82, 0.08, 0.62]} color="#c3d0c8" />
    {/* Lounge, coffee table, rug and a crypto-native wall gallery. */}
    <Box position={[0.05, 0.32, -2.75]} size={[3.15, 0.55, 1.15]} color="#66786e" />
    <Box position={[-1.1, 0.68, -2.95]} size={[0.95, 0.56, 0.95]} color="#75867a" />
    <Box position={[1.18, 0.68, -2.95]} size={[0.95, 0.56, 0.95]} color="#75867a" />
    <Box position={[0.05, 0.23, -0.9]} size={[2.45, 0.12, 1.1]} color="#a77f55" />
    <Box position={[0.05, 0.3, -0.9]} size={[2.25, 0.04, 0.9]} color="#e1cba5" />
    <Box position={[0.15, 0.06, -2.0]} size={[4.25, 0.04, 2.6]} color="#b6a18a" />
    {wallArt.map((art) => <group key={art.x}><Box position={[art.x, 2.2, -5.68]} size={[0.82, 1.02, 0.07]} color="#4b4941" /><Box position={[art.x, 2.2, -5.625]} size={[0.68, 0.86, 0.035]} color={art.color} /></group>)}
    {/* Plant, storage and lived-in details. */}
    <Box position={[-6.55, 0.28, 0.25]} size={[0.7, 0.5, 0.7]} color="#80664b" />
    <mesh position={[-6.55, 0.86, 0.25]}><sphereGeometry args={[0.48, 12, 10]} /><meshStandardMaterial color="#5d795d" roughness={0.95} /></mesh>
    <Box position={[2.6, 0.5, 0.45]} size={[0.8, 0.95, 0.62]} color="#b9a183" />
    <Box position={[2.6, 1.02, 0.45]} size={[0.85, 0.08, 0.66]} color="#d5c3a4" />
    {/* Neighbours give the home a little life; each has a matching interaction target. */}
    <Citizen position={[2.1,0.6]} color="#e36e91" hair="#30242b" scale={0.94} />
    <Citizen position={[-1.8,0.7]} color="#7b82d9" hair="#342924" scale={0.9} />
    <Citizen position={[2.5,-1.1]} color="#ef8d42" hair="#3f3025" scale={0.96} />
    <Citizen position={[-2.2,-1.2]} color="#6eb6a5" hair="#241f20" scale={0.9} />
    {/* A subtle entrance threshold. */}
    <Box position={[0, 0.04, 5.72]} size={[2.2, 0.08, 0.22]} color="#8c6c4b" />
  </>;
}
function Player({accent,onNearby,touchDirection}:{accent:string;onNearby:(target:Target|null)=>void;touchDirection:string|null}) {
  const ref=useRef<Group>(null);
  const keys=useRef<Set<string>>(new Set());
  const {camera}=useThree();
  useEffect(()=>{
    const down=(event:KeyboardEvent)=>{const key=event.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)){keys.current.add(key);event.preventDefault();}};
    const up=(event:KeyboardEvent)=>keys.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown",down);window.addEventListener("keyup",up);return()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up)};
  },[]);
  useFrame(({clock},delta)=>{
    if(!ref.current)return;
    let x=0,z=0;const pressed=keys.current;
    if(pressed.has("a")||pressed.has("arrowleft")||touchDirection==="left")x-=1;if(pressed.has("d")||pressed.has("arrowright")||touchDirection==="right")x+=1;if(pressed.has("w")||pressed.has("arrowup")||touchDirection==="up")z-=1;if(pressed.has("s")||pressed.has("arrowdown")||touchDirection==="down")z+=1;
    const moving=x!==0||z!==0;if(moving){const length=Math.hypot(x,z);x/=length;z/=length;ref.current.position.x=Math.max(-10.3,Math.min(10.3,ref.current.position.x+x*delta*3.2));ref.current.position.z=Math.max(-4.65,Math.min(5.05,ref.current.position.z+z*delta*3.2));ref.current.rotation.y=Math.atan2(x,z)+Math.PI;}
    ref.current.position.y=Math.sin(clock.elapsedTime*(moving?8:1.6))*.025;
    const closest=worldTargets.reduce<{target:Target|null;distance:number}>((best,target)=>{const distance=Math.hypot(ref.current!.position.x-target.position[0],ref.current!.position.z-target.position[1]);return distance<best.distance?{target,distance}:best;},{target:null,distance:Infinity});
    onNearby(closest.distance<2.1?closest.target:null);
    camera.position.lerp(new Vector3(ref.current.position.x+7.8,7.4,ref.current.position.z+10.2),Math.min(1,delta*3));camera.lookAt(ref.current.position.x,0.9,ref.current.position.z-1.2);
  });
  return <group ref={ref} position={[-.2,0,3.8]}>
    <mesh position={[0,1.16,.03]} castShadow><sphereGeometry args={[.34,20,18]}/><meshStandardMaterial color="#c78a68" roughness={.9}/></mesh>
    <mesh position={[0,1.22,.34]} castShadow><boxGeometry args={[.49,.13,.08]}/><meshStandardMaterial color="#1c2523" metalness={.2} roughness={.38}/></mesh>
    <mesh position={[0,1.48,0]} castShadow><sphereGeometry args={[.36,20,18,0,Math.PI*2,0,Math.PI*.42]}/><meshStandardMaterial color="#2a2020" roughness={.85}/></mesh>
    <mesh position={[0,.55,0]} castShadow><capsuleGeometry args={[.26,.72,6,12]}/><meshStandardMaterial color={accent} roughness={.65}/></mesh>
    <mesh position={[-.15,.15,0]} castShadow><capsuleGeometry args={[.08,.35,4,8]}/><meshStandardMaterial color="#222a24"/></mesh><mesh position={[.15,.15,0]} castShadow><capsuleGeometry args={[.08,.35,4,8]}/><meshStandardMaterial color="#222a24"/></mesh>
    <mesh position={[0,.02,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.48,24]}/><meshBasicMaterial color="#1c211b" transparent opacity={.2}/></mesh>
  </group>;
}

function Scene({style,onNearby,touchDirection}:{style?:RoomStyle;onNearby:(target:Target|null)=>void;touchDirection:string|null}) {
  const sceneStyle:RoomStyle=style ?? {label:"STARTER APARTMENT",subtitle:"your first home",wall:"#eee7dc",floor:"#c8b8a6",furniture:"#4d5149",accent:"#d98b7b",luxe:false};

  return <>
    <ambientLight intensity={1.2}/>
    <directionalLight position={[5,10,7]} intensity={2.3} castShadow shadow-mapSize={[1024,1024]}/>
    <hemisphereLight args={["#f8f3d9","#7b936f",1.3]}/>
    <StarterApartment/>
    <Player accent={sceneStyle.accent} onNearby={onNearby} touchDirection={touchDirection}/>
  </>;
}

export default function CryptoRoom(props:{style?:RoomStyle;originName?:string;cash?:string;onComplete?:(result:{need:string;amount:number;action:HomeAction})=>void;onMeet?:(npc:string)=>void}) {
  const [active,setActive]=useState<Interaction|null>(null);
  const [nearby,setNearby]=useState<Target|null>(null);
  const [touchDirection,setTouchDirection]=useState<string|null>(null);
  const [toast,setToast]=useState<string|null>(null);
  const action=active && isHomeAction(active)?homeActions[active]:null;
  const target=active?worldTargets.find(item=>item.id===active):null;
  const { onComplete, onMeet } = props;

  useEffect(()=>{
    const interact=(event:KeyboardEvent)=>{
      if((event.key==="e"||event.key==="Enter") && nearby && !active){ event.preventDefault(); setActive(nearby.id); }
    };
    window.addEventListener("keydown",interact);
    return ()=>window.removeEventListener("keydown",interact);
  },[nearby,active]);

  const perform=()=>{
    if(!active)return;
    if(isHomeAction(active) && action){onComplete?.({need:action.need,amount:action.amount,action:active});setToast(action.need==="CASH"?"+$120 earned · bounty shipped":`+${action.amount} ${action.need.toLowerCase()} restored`);} else {const name=target?.label ?? "resident";onMeet?.(name);setToast(`${name} remembers this conversation · trust up`);}
    setActive(null);
    window.setTimeout(()=>setToast(null),1800);
  };

  return (
    <div className="crypto-room-wrap">
      <Canvas camera={{position:[5.0,5.5,12.5],fov:43}} shadows>
        <Scene onNearby={setNearby} touchDirection={touchDirection}/>
      </Canvas>

      <div className="home-hint">YOUR APARTMENT · WALK UP TO OBJECTS TO LIVE, WORK AND RECOVER</div>
      <div className="city-world-label"><span>YOUR FIRST HOME</span><strong>STARTER APARTMENT · GENESIS HUB</strong></div>
      {nearby && !active && <button className="proximity-prompt" onClick={()=>setActive(nearby.id)}><span>NEARBY · {nearby.label}</span><strong>{nearby.kind === "person" ? "TALK" : "INTERACT"}: {nearby.title} <b>↵</b></strong></button>}
      <div className="touch-walk" aria-label="Move your character">
        <button aria-label="Walk forward" onPointerDown={()=>setTouchDirection("up")} onPointerUp={()=>setTouchDirection(null)} onPointerLeave={()=>setTouchDirection(null)}>↑</button>
        <button aria-label="Walk left" onPointerDown={()=>setTouchDirection("left")} onPointerUp={()=>setTouchDirection(null)} onPointerLeave={()=>setTouchDirection(null)}>←</button>
        <button aria-label="Walk back" onPointerDown={()=>setTouchDirection("down")} onPointerUp={()=>setTouchDirection(null)} onPointerLeave={()=>setTouchDirection(null)}>↓</button>
        <button aria-label="Walk right" onPointerDown={()=>setTouchDirection("right")} onPointerUp={()=>setTouchDirection(null)} onPointerLeave={()=>setTouchDirection(null)}>→</button>
      </div>

      {active&&target&&(
        <div className="home-action-modal">
          <div className="home-action-card">
            <span className="eyebrow">{target.kind === "person" ? "CITY RESIDENT" : "CITY PLACE"} · {target.label}</span>
            <h3>{target.title}</h3>
            <p>{action ? action.detail : `${target.label} looks you over. A real conversation can become a contact, a lead, or nothing—depending on how you show up.`}</p>
            <div className="home-action-meta">{action ? `RESTORE ${action.amount}${action.need==="CASH"?" USD":"%"}` : "BUILD TRUST · UNLOCK FUTURE MOVES"}</div>
            <div className="home-action-buttons">
              <button onClick={perform}>{target.kind === "person" ? "TALK →" : "DO IT →"}</button>
              <button onClick={()=>setActive(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {toast&&<div className="home-toast">{toast}</div>}
    </div>
  );
}
