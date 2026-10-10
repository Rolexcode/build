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
  { id:"sleep", kind:"place", label:"BLOCK 7", title:"Go home / sleep", position:[-8.5,2.4] },
  { id:"hygiene", kind:"place", label:"BLOCK 7", title:"Freshen up", position:[-8.5,0.8] },
  { id:"cook", kind:"place", label:"GM CAFÉ", title:"Get food", position:[-1.8,-3.4] },
  { id:"work", kind:"place", label:"ORBIT BOARD", title:"Pick up a bounty", position:[6,1.3] },
  { id:"watch", kind:"place", label:"AFTER HOURS", title:"Take a break", position:[6,-3.3] },
  { id:"mara", kind:"person", label:"MARA", title:"Talk to Mara", position:[4.1,1.9] },
  { id:"rae", kind:"person", label:"RAE", title:"Talk to Rae", position:[-1.1,1.2] },
  { id:"dex", kind:"person", label:"DEX", title:"Talk to Dex", position:[4.9,-2.4] },
  { id:"nia", kind:"person", label:"NIA", title:"Talk to Nia", position:[-4.4,-1.7] },
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

function CityStreet() {
  const buildings:[number,number,number,number,string][] = [[-8,-4.4,3.1,2.8,"#cdb993"],[-1.7,-4.5,3,4,"#849a8a"],[6.1,-4.3,3.6,3.2,"#7a8d88"],[8,3.9,3.6,2.2,"#865d55"],[-7.7,3.8,2.8,2.2,"#aa8d63"]];
  return <>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[25,18]}/><meshStandardMaterial color="#b9c8ae" roughness={.95}/></mesh>
    <mesh position={[0,.015,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[23,4.5]}/><meshStandardMaterial color="#526057" roughness={.92}/></mesh>
    <mesh position={[0,.03,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[23,.12]}/><meshBasicMaterial color="#f0cf64"/></mesh>
    {buildings.map(([x,z,w,h,color])=><group key={`${x}-${z}`} position={[x,0,z]}><Box position={[0,h/2,0]} size={[w,h,2.2]} color={color}/><Box position={[0,h-.48,1.14]} size={[w-.42,.68,.05]} color="#f3e0a3"/><Box position={[0,.35,1.16]} size={[.62,.7,.06]} color="#2c3b37"/></group>)}
    <Box position={[-1.9,.95,-3.4]} size={[2.4,1.9,.55]} color="#d8aa48"/><Box position={[6,.95,1.3]} size={[2.7,1.9,.55]} color="#74a57f"/><Box position={[6,.9,-3.3]} size={[2.7,1.8,.55]} color="#b6675c"/>
    <Citizen position={[4.1,1.9]} color="#e36e91" hair="#30242b"/><Citizen position={[-1.1,1.2]} color="#7b82d9" hair="#342924" scale={.94}/><Citizen position={[4.9,-2.4]} color="#ef8d42" hair="#3f3025" scale={1.08}/><Citizen position={[-4.4,-1.7]} color="#6eb6a5" hair="#241f20" scale={.91}/>
    <Citizen position={[-.4,3.3]} color="#9380cc" hair="#5b4639" scale={.83}/><Citizen position={[1.7,-1.5]} color="#e7d47c" hair="#222" scale={1.1}/><Citizen position={[-6.1,-.2]} color="#dc7770" hair="#604331" scale={.9}/>
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
    const moving=x!==0||z!==0;if(moving){const length=Math.hypot(x,z);x/=length;z/=length;ref.current.position.x=Math.max(-10.3,Math.min(10.3,ref.current.position.x+x*delta*3.2));ref.current.position.z=Math.max(-6.6,Math.min(5.7,ref.current.position.z+z*delta*3.2));ref.current.rotation.y=Math.atan2(x,z)+Math.PI;}
    ref.current.position.y=Math.sin(clock.elapsedTime*(moving?8:1.6))*.025;
    const closest=worldTargets.reduce<{target:Target|null;distance:number}>((best,target)=>{const distance=Math.hypot(ref.current!.position.x-target.position[0],ref.current!.position.z-target.position[1]);return distance<best.distance?{target,distance}:best;},{target:null,distance:Infinity});
    onNearby(closest.distance<2.1?closest.target:null);
    camera.position.lerp(new Vector3(ref.current.position.x+7.8,7.4,ref.current.position.z+10.2),Math.min(1,delta*3));camera.lookAt(ref.current.position.x,0.9,ref.current.position.z-1.2);
  });
  return <group ref={ref} position={[-.2,0,2.3]}>
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
    <CityStreet/>
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

      <div className="home-hint">WASD / ARROWS TO WALK · MOVE CLOSE TO OBJECTS</div>
      <div className="city-world-label"><span>GENESIS HUB</span><strong>RAE IS NEARBY</strong></div>
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
