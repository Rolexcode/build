"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

type RoomStyle = {
  key: string; label: string; subtitle: string; wall: string; floor: string;
  furniture: string; accent: string; luxe: boolean;
};

const styles: Record<string, RoomStyle> = {
  "Crypto Guru": { key:"guru", label:"PENTHOUSE", subtitle:"$1M+ portfolio · city view · private office", wall:"#eee9d8", floor:"#b9b2a1", furniture:"#34372f", accent:"#d5ad47", luxe:true },
  "NFT Native": { key:"collector", label:"COLLECTOR LOFT", subtitle:"PFP walls · gallery sofa · collector desk", wall:"#e8e4da", floor:"#9d9b91", furniture:"#564d48", accent:"#d58b65", luxe:true },
  "Crypto Developer": { key:"builder", label:"BUILDER APARTMENT", subtitle:"dual monitors · late nights · code on the wall", wall:"#dce7df", floor:"#8d9a8f", furniture:"#3d5049", accent:"#55c6a4", luxe:false },
  "Crypto Analyst": { key:"analyst", label:"HIGH-RISE STUDIO", subtitle:"clean lines · market screens · quiet morning", wall:"#e4e9e3", floor:"#aaa99c", furniture:"#59625a", accent:"#8ebf68", luxe:false },
  Degen: { key:"degen", label:"DEGEN PAD", subtitle:"one couch · five screens · questionable decisions", wall:"#ded7cf", floor:"#7e766e", furniture:"#4b3e3a", accent:"#ff7847", luxe:false },
  "Airdrop Hunter": { key:"hunter", label:"HUSTLE FLAT", subtitle:"airdrop tabs open · rent paid · still hunting", wall:"#e3e5d7", floor:"#858d7d", furniture:"#5a584d", accent:"#9ebf43", luxe:false },
  "Web3 Jobber": { key:"jobber", label:"RENTED APARTMENT", subtitle:"mod queue · side gigs · grind mode", wall:"#e6e0d5", floor:"#8b8377", furniture:"#65594e", accent:"#e44f8f", luxe:false },
};

function Box({ position, size, color }: { position:[number,number,number]; size:[number,number,number]; color:string }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={0.72}/></mesh>;
}

function Sofa({ style }:{style:RoomStyle}) {
  return <group position={[-2.25,0.72,0.1]}>
    <Box position={[0,0,0]} size={[3.25,0.85,1.18]} color={style.furniture}/>
    <Box position={[0,0.7,-0.42]} size={[3.25,1.05,0.34]} color={style.furniture}/>
    <Box position={[-1.18,0.82,0.05]} size={[0.42,0.95,1.1]} color={style.furniture}/>
    <Box position={[1.18,0.82,0.05]} size={[0.42,0.95,1.1]} color={style.furniture}/>
    <Box position={[0,0.63,0.08]} size={[2.55,0.35,0.86]} color={style.accent}/>
  </group>;
}

function Desk({ style }:{style:RoomStyle}) {
  return <group position={[2.45,0.68,-0.5]}>
    <Box position={[0,0,0]} size={[2.5,0.18,0.95]} color={style.furniture}/>
    <Box position={[-0.95,-0.7,0]} size={[0.13,1.4,0.13]} color={style.furniture}/>
    <Box position={[0.95,-0.7,0]} size={[0.13,1.4,0.13]} color={style.furniture}/>
    <Box position={[0,0.65,-0.25]} size={[1.45,0.9,0.08]} color="#1e2521"/>
    <Box position={[0,0.2,0.15]} size={[0.72,0.04,0.45]} color="#242c27"/>
    {style.luxe ? <Box position={[0.88,0.34,0.12]} size={[0.45,0.1,0.25]} color={style.accent}/> : null}
  </group>;
}

function CoffeeTable({ style }:{style:RoomStyle}) {
  return <group position={[-0.2,0.38,1.25]}>
    <Box position={[0,0,0]} size={[1.8,0.16,0.85]} color={style.furniture}/>
    <Box position={[-0.7,-0.38,-0.28]} size={[0.08,0.75,0.08]} color={style.furniture}/>
    <Box position={[0.7,-0.38,-0.28]} size={[0.08,0.75,0.08]} color={style.furniture}/>
    <Box position={[-0.7,-0.38,0.28]} size={[0.08,0.75,0.08]} color={style.furniture}/>
    <Box position={[0.7,-0.38,0.28]} size={[0.08,0.75,0.08]} color={style.furniture}/>
    <mesh position={[0,0.13,0]} castShadow><cylinderGeometry args={[0.22,0.22,0.06,24]}/><meshStandardMaterial color={style.accent} metalness={style.luxe?0.7:0.1} roughness={0.4}/></mesh>
  </group>;
}

function Window({ style }:{style:RoomStyle}) {
  return <group position={[0,3.05,-2.7]}>
    <Box position={[0,0,0]} size={[6.2,3.2,0.12]} color="#a9c8d4"/>
    <Box position={[0,0,0.08]} size={[0.13,3.2,0.16]} color="#f4f0e4"/>
    <Box position={[0,0,0.08]} size={[6.2,0.13,0.16]} color="#f4f0e4"/>
    <Box position={[-3.1,0,0.08]} size={[0.13,3.2,0.16]} color="#f4f0e4"/>
    <Box position={[3.1,0,0.08]} size={[0.13,3.2,0.16]} color="#f4f0e4"/>
    <Box position={[0,0,0.09]} size={[0.08,3.2,0.16]} color="#f4f0e4"/>
    <Box position={[0,0,0.1]} size={[6.2,0.08,0.16]} color="#f4f0e4"/>
    <mesh position={[0,0,0.15]}><planeGeometry args={[5.8,2.8]}/><meshBasicMaterial color={style.luxe?"#9fb6c6":"#a7c4cf"}/></mesh>
  </group>;
}

function Plant({ position }:{position:[number,number,number]}) {
  return <group position={position}>
    <mesh position={[0,0.35,0]} castShadow><cylinderGeometry args={[0.34,0.26,0.65,18]}/><meshStandardMaterial color="#b86f4b" roughness={0.9}/></mesh>
    <mesh position={[0,1.15,0]} castShadow><sphereGeometry args={[0.62,12,10]}/><meshStandardMaterial color="#527a4f" roughness={0.9}/></mesh>
    <mesh position={[0.38,1.28,0.05]} castShadow><sphereGeometry args={[0.4,12,10]}/><meshStandardMaterial color="#6f9659" roughness={0.9}/></mesh>
  </group>;
}

function Avatar({ accent, luxe }:{accent:string;luxe:boolean}) {
  const group = useRef<Group>(null);
  useFrame(({clock}) => { if (group.current) group.current.position.y = Math.sin(clock.elapsedTime*1.5)*0.025; });
  return <group ref={group} position={[0.5,0.05,0.2]}>
    <mesh position={[0,0.15,0]} castShadow><cylinderGeometry args={[0.28,0.34,1.55,12]}/><meshStandardMaterial color={accent} roughness={0.65}/></mesh>
    <mesh position={[-0.2,-0.82,0]} castShadow><boxGeometry args={[0.28,0.95,0.32]}/><meshStandardMaterial color="#252a27" roughness={0.7}/></mesh>
    <mesh position={[0.2,-0.82,0]} castShadow><boxGeometry args={[0.28,0.95,0.32]}/><meshStandardMaterial color="#252a27" roughness={0.7}/></mesh>
    <mesh position={[0,1.15,0]} castShadow><sphereGeometry args={[0.52,18,14]}/><meshStandardMaterial color="#8b5f4a" roughness={0.85}/></mesh>
    <mesh position={[0,1.45,0]} castShadow><sphereGeometry args={[0.53,18,10]}/><meshStandardMaterial color={luxe?"#25221d":"#272b29"} roughness={0.9}/></mesh>
    <mesh position={[-0.64,0.28,0]} rotation={[0,0,-0.22]} castShadow><capsuleGeometry args={[0.11,1.1,5,10]}/><meshStandardMaterial color={accent} roughness={0.7}/></mesh>
    <mesh position={[0.64,0.28,0]} rotation={[0,0,0.22]} castShadow><capsuleGeometry args={[0.11,1.1,5,10]}/><meshStandardMaterial color={accent} roughness={0.7}/></mesh>
    <mesh position={[0,1.13,0.49]}><sphereGeometry args={[0.1,10,8]}/><meshStandardMaterial color="#e9e2d2" emissive="#e9e2d2" emissiveIntensity={0.15}/></mesh>
  </group>;
}

function Scene({ style }:{style:RoomStyle}) {
  return <>
    <ambientLight intensity={1.4}/>
    <directionalLight position={[5,9,6]} intensity={2.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <pointLight position={[-3,4,2]} intensity={12} distance={8} color={style.luxe?"#f8dca2":"#d8f0df"}/>
    <Box position={[0,-0.12,0]} size={[12,0.22,8]} color={style.floor}/>
    <Box position={[0,3.4,-3.05]} size={[12,7,0.16]} color={style.wall}/>
    <Box position={[-6,3.4,0]} size={[0.16,7,8]} color={style.wall}/>
    <Window style={style}/>
    <mesh position={[-0.25,0.015,0.7]} receiveShadow rotation={[-Math.PI/2,0,0]}><circleGeometry args={[2.35,48]}/><meshStandardMaterial color={style.luxe?"#c7bfae":"#a9b39f"} roughness={1}/></mesh>
    <Sofa style={style}/><CoffeeTable style={style}/><Desk style={style}/><Plant position={[-4.4,0,-1.8]}/><Avatar accent={style.accent} luxe={style.luxe}/>
    {style.luxe ? <>
      <Box position={[4.3,2.35,-2.8]} size={[2.8,1.8,0.12]} color="#151b18"/>
      <mesh position={[4.3,2.35,-2.68]}><planeGeometry args={[2.5,1.5]}/><meshBasicMaterial color="#18251f"/></mesh>
      <mesh position={[4.3,3.95,-2.7]}><cylinderGeometry args={[0.42,0.42,0.07,32]}/><meshStandardMaterial color={style.accent} metalness={0.8} roughness={0.25}/></mesh>
    </> : <Box position={[3.8,2.05,-2.75]} size={[2.35,1.5,0.12]} color="#17201b"/>}
  </>;
}

export default function CryptoRoom({ originName, cash }:{originName:string;cash:string}) {
  const style = styles[originName] ?? styles["Web3 Jobber"];
  return <div className="three-room-canvas">
    <Canvas shadows dpr={[1,1.5]} camera={{position:[8.2,6.6,9.4],fov:38}} fallback={<div className="three-fallback">3D world unavailable on this device.</div>}>
      <color attach="background" args={[style.luxe?"#d8d4c6":"#d7e1d3"]}/>
      <Scene style={style}/>
    </Canvas>
    <div className="room-style-chip"><span>{style.label}</span><strong>{cash}</strong></div>
    <div className="room-style-copy"><b>{style.subtitle}</b><small>HOME MATCHED TO YOUR LIFE</small></div>
  </div>;
}
