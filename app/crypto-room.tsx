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
type Target = { id: Interaction; kind: "place" | "person"; label: string; title: string; position: [number, number]; walkPosition?: [number, number] };

const worldTargets: Target[] = [
  { id:"sleep", kind:"place", label:"BEDROOM", title:"Get some sleep", position:[-4.6,-2.5], walkPosition:[-4.2,-0.72] },
  { id:"hygiene", kind:"place", label:"BATHROOM", title:"Freshen up", position:[5.1,-2.8], walkPosition:[4.05,-2.65] },
  { id:"cook", kind:"place", label:"KITCHEN", title:"Make something to eat", position:[4.4,2.1], walkPosition:[4.4,1.48] },
  { id:"work", kind:"place", label:"WORK DESK", title:"Work on a bounty", position:[-4.2,2.4], walkPosition:[-4.2,3.78] },
  { id:"watch", kind:"place", label:"LOUNGE", title:"Take a break", position:[0,-2.8], walkPosition:[-2.0,-1.8] },
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

function StarterApartment({onGroundTap}:{onGroundTap:(position:[number,number])=>void}) {
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.065, 0]} onPointerDown={(event) => { event.stopPropagation(); onGroundTap([event.point.x, event.point.z]); }}>
      <planeGeometry args={[15.7, 11.6]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
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
function Player({accent,onNearby,moveTarget,onArrive}:{accent:string;onNearby:(target:Target|null)=>void;moveTarget:{x:number;z:number;id:string;interaction:Interaction|null}|null;onArrive:(interaction:Interaction|null)=>void}) {
  const ref=useRef<Group>(null);
  const leftArm=useRef<Group>(null);
  const rightArm=useRef<Group>(null);
  const leftLeg=useRef<Group>(null);
  const rightLeg=useRef<Group>(null);
  const keys=useRef<Set<string>>(new Set());
  const nearbyId=useRef<Interaction|null>(null);
  const arrivedId=useRef<string|null>(null);
  const {camera}=useThree();

  useEffect(()=>{
    const down=(event:KeyboardEvent)=>{
      const key=event.key.toLowerCase();
      if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)){
        keys.current.add(key);
        event.preventDefault();
      }
    };
    const up=(event:KeyboardEvent)=>keys.current.delete(event.key.toLowerCase());
    const blur=()=>keys.current.clear();
    window.addEventListener("keydown",down);
    window.addEventListener("keyup",up);
    window.addEventListener("blur",blur);
    return ()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.removeEventListener("blur",blur);};
  },[]);

  useFrame(({clock},delta)=>{
    if(!ref.current)return;
    let x=0,z=0;
    let moving=false;
    if(moveTarget && arrivedId.current!==moveTarget.id){
      const dx=moveTarget.x-ref.current.position.x;
      const dz=moveTarget.z-ref.current.position.z;
      const distance=Math.hypot(dx,dz);
      if(distance<0.22){
        ref.current.position.x=moveTarget.x;
        ref.current.position.z=moveTarget.z;
        arrivedId.current=moveTarget.id;
        onArrive(moveTarget.interaction);
      } else { x=dx/distance; z=dz/distance; moving=true; }
    } else {
      const pressed=keys.current;
      if(pressed.has("a")||pressed.has("arrowleft"))x-=1;
      if(pressed.has("d")||pressed.has("arrowright"))x+=1;
      if(pressed.has("w")||pressed.has("arrowup"))z-=1;
      if(pressed.has("s")||pressed.has("arrowdown"))z+=1;
      moving=x!==0||z!==0;
      if(moving){const length=Math.hypot(x,z);x/=length;z/=length;}
    }
    if(moving){
      const nextX=Math.max(-6.65,Math.min(6.65,ref.current.position.x+x*delta*3.35));
      const nextZ=Math.max(-4.65,Math.min(5.05,ref.current.position.z+z*delta*3.35));
      const blockers:[number,number,number,number][]=[
        [-6.15,-3.35,-4.35,-1.0],
        [-5.55,-2.95,1.88,3.02],
        [-5.55,-2.95,2.95,3.65],
        [2.25,6.9,2.05,2.98],
        [4.95,7.25,-3.95,-1.85],
        [-1.65,1.7,-3.45,-2.1],
        [-1.25,1.35,-1.5,-0.3],
      ];
      const blocked=(px:number,pz:number)=>blockers.some(([minX,maxX,minZ,maxZ])=>px>minX&&px<maxX&&pz>minZ&&pz<maxZ);
      if(!blocked(nextX,ref.current.position.z))ref.current.position.x=nextX;
      if(!blocked(ref.current.position.x,nextZ))ref.current.position.z=nextZ;
      ref.current.rotation.y=Math.atan2(x,z);
    }
    const gait=moving?Math.sin(clock.elapsedTime*10):0;
    ref.current.position.y=moving?Math.abs(Math.sin(clock.elapsedTime*10))*.035:Math.sin(clock.elapsedTime*1.6)*.012;
    if(leftArm.current)leftArm.current.rotation.x=gait*.58;
    if(rightArm.current)rightArm.current.rotation.x=-gait*.58;
    if(leftLeg.current)leftLeg.current.rotation.x=-gait*.48;
    if(rightLeg.current)rightLeg.current.rotation.x=gait*.48;

    const closest=worldTargets.reduce<{target:Target|null;distance:number}>((best,target)=>{
      const distance=Math.hypot(ref.current!.position.x-target.position[0],ref.current!.position.z-target.position[1]);
      return distance<best.distance?{target,distance}:best;
    },{target:null,distance:Infinity});
    const nextNearby=closest.distance<2.1?closest.target:null;
    const nextNearbyId=nextNearby?.id ?? null;
    // Avoid forcing a React render every animation frame while the player
    // remains near the same object. Only notify when the nearby target changes.
    if(nearbyId.current!==nextNearbyId){
      nearbyId.current=nextNearbyId;
      onNearby(nextNearby);
    }

    const touch=typeof window!=="undefined"&&(navigator.maxTouchPoints>0||"ontouchstart" in window);
    const mobile=touch||window.innerWidth<700;
    const offset=mobile?new Vector3(6.8,7.8,10.2):new Vector3(8.8,8.2,11.8);
    camera.position.lerp(new Vector3(ref.current.position.x+offset.x,offset.y,ref.current.position.z+offset.z),Math.min(1,delta*3.2));
    camera.lookAt(ref.current.position.x,0.78,ref.current.position.z-0.35);
  });

  return <group ref={ref} position={[-.2,0,3.8]}>
    {/* A more intentional stylised citizen silhouette with separate animated limbs. */}
    {/* Hood and neck */}
    <mesh position={[0,.91,-.09]} castShadow><sphereGeometry args={[.34,20,16]}/><meshStandardMaterial color="#343a32" roughness={.95}/></mesh>
    <mesh position={[0,.98,.015]} castShadow><cylinderGeometry args={[.105,.12,.22,14]}/><meshStandardMaterial color="#b97e5e" roughness={.9}/></mesh>
    {/* Head, ears, hairline and face */}
    <mesh position={[0,1.29,.025]} castShadow><sphereGeometry args={[.285,28,22]}/><meshStandardMaterial color="#b97e5e" roughness={.88}/></mesh>
    <mesh position={[0,1.46,-.035]} castShadow><sphereGeometry args={[.292,24,18,0,Math.PI*2,0,Math.PI*.52]}/><meshStandardMaterial color="#25201f" roughness={.92}/></mesh>
    <mesh position={[-.277,1.28,.015]} castShadow><sphereGeometry args={[.055,12,10]}/><meshStandardMaterial color="#b97e5e" roughness={.9}/></mesh>
    <mesh position={[.277,1.28,.015]} castShadow><sphereGeometry args={[.055,12,10]}/><meshStandardMaterial color="#b97e5e" roughness={.9}/></mesh>
    {/* Short fringe sits above the eyes instead of obscuring the face. */}
    <mesh position={[0,1.42,.27]} castShadow><boxGeometry args={[.31,.065,.05]}/><meshStandardMaterial color="#25201f" roughness={.8}/></mesh>
    <mesh position={[-.09,1.29,.298]}><sphereGeometry args={[.041,14,12]}/><meshStandardMaterial color="#f4e9d7" roughness={.55}/></mesh>
    <mesh position={[.09,1.29,.298]}><sphereGeometry args={[.041,14,12]}/><meshStandardMaterial color="#f4e9d7" roughness={.55}/></mesh>
    <mesh position={[-.09,1.29,.331]}><sphereGeometry args={[.022,12,10]}/><meshStandardMaterial color="#17211e" roughness={.45}/></mesh>
    <mesh position={[.09,1.29,.331]}><sphereGeometry args={[.022,12,10]}/><meshStandardMaterial color="#17211e" roughness={.45}/></mesh>
    <mesh position={[-.09,1.345,.315]} rotation={[0,0,-.08]}><boxGeometry args={[.075,.016,.018]}/><meshStandardMaterial color="#342522" roughness={.85}/></mesh>
    <mesh position={[.09,1.345,.315]} rotation={[0,0,.08]}><boxGeometry args={[.075,.016,.018]}/><meshStandardMaterial color="#342522" roughness={.85}/></mesh>
    {/* Short textured twists give the silhouette more character than a smooth helmet. */}
    {[-.22,-.12,0,.12,.22].map((x,i)=><mesh key={i} position={[x,1.51,.13]} castShadow><sphereGeometry args={[.09,12,10]}/><meshStandardMaterial color={i%2?"#2b2220":"#1e1b1a"} roughness={.96}/></mesh>}
    <mesh position={[0,1.19,.311]} castShadow><sphereGeometry args={[.022,10,8]}/><meshStandardMaterial color="#8c5a46" roughness={.8}/></mesh>
    <mesh position={[0,1.13,.305]}><boxGeometry args={[.075,.018,.015]}/><meshStandardMaterial color="#603b34" roughness={.8}/></mesh>
    {/* Hoodie torso with front panel, zipper and drawstrings */}
    <mesh position={[0,.59,0]} castShadow><capsuleGeometry args={[.29,.61,10,18]}/><meshStandardMaterial color={accent} roughness={.72}/></mesh>
    <mesh position={[0,.61,.285]} castShadow><boxGeometry args={[.035,.57,.018]}/><meshStandardMaterial color="#e7e5d9" roughness={.6}/></mesh>
    <mesh position={[-.075,.81,.282]}><cylinderGeometry args={[.012,.012,.18,8]}/><meshStandardMaterial color="#f0e5c9" roughness={.8}/></mesh>
    <mesh position={[.075,.81,.282]}><cylinderGeometry args={[.012,.012,.18,8]}/><meshStandardMaterial color="#f0e5c9" roughness={.8}/></mesh>
    <mesh position={[.16,.48,.26]}><boxGeometry args={[.12,.11,.025]}/><meshStandardMaterial color="#f1e8d7" roughness={.7}/></mesh>
    <mesh position={[.16,.48,.278]}><boxGeometry args={[.06,.025,.012]}/><meshStandardMaterial color="#5c7650" roughness={.7}/></mesh>
    <mesh position={[0,.37,.287]}><torusGeometry args={[.12,.012,6,18]}/><meshStandardMaterial color="#d4b46e" metalness={.55} roughness={.4}/></mesh>
    {/* Pivoted sleeves and forearms animate while walking. */}
    <group ref={leftArm} position={[-.3,.82,0]}>
      <mesh position={[0,-.18,0]} rotation={[0,0,-.08]} castShadow><capsuleGeometry args={[.105,.28,8,12]}/><meshStandardMaterial color={accent} roughness={.72}/></mesh>
      <mesh position={[0,-.4,.015]} castShadow><capsuleGeometry args={[.075,.23,8,12]}/><meshStandardMaterial color="#b97e5e" roughness={.9}/></mesh>
      <mesh position={[0,-.54,.035]} castShadow><sphereGeometry args={[.078,12,10]}/><meshStandardMaterial color="#b97e5e" roughness={.9}/></mesh>
    </group>
    <group ref={rightArm} position={[.3,.82,0]}>
      <mesh position={[0,-.18,0]} rotation={[0,0,.08]} castShadow><capsuleGeometry args={[.105,.28,8,12]}/><meshStandardMaterial color={accent} roughness={.72}/></mesh>
      <mesh position={[0,-.4,.015]} castShadow><capsuleGeometry args={[.075,.23,8,12]}/><meshStandardMaterial color="#b97e5e" roughness={.9}/></mesh>
      <mesh position={[0,-.54,.035]} castShadow><sphereGeometry args={[.078,12,10]}/><meshStandardMaterial color="#b97e5e" roughness={.9}/></mesh>
    </group>
    {/* Trousers and sneakers, animated independently at the hips. */}
    <group ref={leftLeg} position={[-.145,.3,0]}>
      <mesh position={[0,-.13,0]} castShadow><capsuleGeometry args={[.105,.28,8,12]}/><meshStandardMaterial color="#252d29" roughness={.88}/></mesh>
      <mesh position={[0,-.275,.09]} castShadow><boxGeometry args={[.2,.105,.31]}/><meshStandardMaterial color="#e4e2d6" roughness={.82}/></mesh>
      <mesh position={[0,-.322,.095]}><boxGeometry args={[.2,.025,.3]}/><meshStandardMaterial color="#b8b9ac" roughness={.9}/></mesh>
    </group>
    <group ref={rightLeg} position={[.145,.3,0]}>
      <mesh position={[0,-.13,0]} castShadow><capsuleGeometry args={[.105,.28,8,12]}/><meshStandardMaterial color="#252d29" roughness={.88}/></mesh>
      <mesh position={[0,-.275,.09]} castShadow><boxGeometry args={[.2,.105,.31]}/><meshStandardMaterial color="#e4e2d6" roughness={.82}/></mesh>
      <mesh position={[0,-.322,.095]}><boxGeometry args={[.2,.025,.3]}/><meshStandardMaterial color="#b8b9ac" roughness={.9}/></mesh>
    </group>
    <mesh position={[0,.02,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.48,24]}/><meshBasicMaterial color="#1c211b" transparent opacity={.2}/></mesh>
  </group>;
}
function Scene({style,onNearby,moveTarget,onArrive,onGroundTap,onTargetTap}:{style?:RoomStyle;onNearby:(target:Target|null)=>void;moveTarget:{x:number;z:number;id:string;interaction:Interaction|null}|null;onArrive:(interaction:Interaction|null)=>void;onGroundTap:(position:[number,number])=>void;onTargetTap:(target:Target)=>void}) {
  const sceneStyle:RoomStyle=style ?? {label:"STARTER APARTMENT",subtitle:"your first home",wall:"#eee7dc",floor:"#c8b8a6",furniture:"#4d5149",accent:"#d98b7b",luxe:false};

  return <>
    <ambientLight intensity={1.2}/>
    <directionalLight position={[5,10,7]} intensity={2.3} castShadow shadow-mapSize={[1024,1024]}/>
    <hemisphereLight args={["#f8f3d9","#7b936f",1.3]}/>
    <StarterApartment onGroundTap={onGroundTap}/>
    {worldTargets.map((target) => <mesh key={target.id} position={[target.position[0],0.018,target.position[1]]} rotation={[-Math.PI/2,0,0]} onPointerDown={(event)=>{event.stopPropagation();onTargetTap(target);}}>
      <circleGeometry args={[0.56,28]}/><meshBasicMaterial color={target.kind==="person"?"#e9b85b":"#a8d96a"} transparent opacity={0.16} depthWrite={false}/>
    </mesh>)}
    <Player accent={sceneStyle.accent} onNearby={onNearby} moveTarget={moveTarget} onArrive={onArrive}/>
  </>;
}

export default function CryptoRoom(props:{style?:RoomStyle;originName?:string;cash?:string;onComplete?:(result:{need:string;amount:number;action:HomeAction})=>void;onMeet?:(npc:string)=>void}) {
  const [active,setActive]=useState<Interaction|null>(null);
  const [nearby,setNearby]=useState<Target|null>(null);
  const [moveTarget,setMoveTarget]=useState<{x:number;z:number;id:string;interaction:Interaction|null}|null>(null);
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

  const walkToTarget=(next:Target)=>{
    setActive(null);
    const destination=next.walkPosition ?? next.position;
    setMoveTarget({x:destination[0],z:destination[1],id:next.id+"-"+Date.now(),interaction:next.id});
  };
  const walkToFloor=(position:[number,number])=>{
    setActive(null);
    setMoveTarget({x:Math.max(-6.3,Math.min(6.3,position[0])),z:Math.max(-4.4,Math.min(4.8,position[1])),id:"walk-"+Date.now(),interaction:null});
  };
  const arriveAt=(interaction:Interaction|null)=>{setMoveTarget(null);if(interaction)setActive(interaction);};

  const perform=()=>{
    if(!active)return;
    if(isHomeAction(active) && action){
      onComplete?.({need:action.need,amount:action.amount,action:active});
      const stories:Record<HomeAction,string>={
        sleep:"You pull the duvet up. The city carries on while you sleep.",
        hygiene:"Water runs, you clean up, and feel ready to face the day.",
        cook:"You put together a quick meal before heading back out.",
        work:"You finish the bounty, package the work, and send it to the client.",
        watch:"You sink into the sofa and let the market noise fade for a bit."
      };
      setToast(stories[active]);
    } else {const name=target?.label ?? "resident";onMeet?.(name);setToast(`You spend a few minutes talking with ${name.toLowerCase()}. A familiar face in Genesis Hub.`);}
    setActive(null);
    window.setTimeout(()=>setToast(null),1800);
  };

  return (
    <div className="crypto-room-wrap">
      <Canvas camera={{position:[8.5,9,15],fov:44}} dpr={[1,1.25]} gl={{antialias:false,powerPreference:"low-power"}} shadows>
        <Scene onNearby={setNearby} moveTarget={moveTarget} onArrive={arriveAt} onGroundTap={walkToFloor} onTargetTap={walkToTarget}/>
      </Canvas>

      <div className="home-hint">TAP THE FLOOR TO WALK · TAP A PLACE TO WALK OVER AND USE IT</div>
      <div className="city-world-label"><span>YOUR FIRST HOME</span><strong>STARTER APARTMENT · GENESIS HUB</strong></div>
      {nearby && !active && !moveTarget && <button className="proximity-prompt" onClick={()=>setActive(nearby.id)}><span>YOU ARE HERE · {nearby.label}</span><strong>{nearby.kind === "person" ? "TALK TO" : "USE"} {nearby.title} <b>↵</b></strong></button>}


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
