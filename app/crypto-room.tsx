"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Group } from "three";
import { TextureLoader, SpriteMaterial, CanvasTexture, SRGBColorSpace } from "three";

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

function Orbit({target}:{target:[number,number,number]}) {
  const {camera,gl} = useThree();
  useEffect(()=>{
    const controls=new OrbitControls(camera,gl.domElement);
    controls.target.set(...target);
    controls.enablePan=false;
    controls.enableDamping=true;
    controls.dampingFactor=0.08;
    controls.minDistance=7;
    controls.maxDistance=16;
    controls.minPolarAngle=0.65;
    controls.maxPolarAngle=1.45;
    // Keep the player inside the believable front/side viewing arc of the room.
    // The back wall is not a playable camera side, so do not let the camera orbit behind it.
    const startAzimuth=Math.atan2(camera.position.x-target[0],camera.position.z-target[2]);
    const arc=Math.PI*0.53;
    controls.minAzimuthAngle=startAzimuth-arc;
    controls.maxAzimuthAngle=startAzimuth+arc;
    return ()=>controls.dispose();
  },[camera,gl,target]);
  useFrame(()=>{});
  return null;
}

function RealAvatar({accent,pfpImage}:{accent:string;pfpImage?:string}) {
  const ref=useRef<Group>(null);
  const [model,setModel]=useState<any>(null);
  useEffect(()=>{
    let mounted=true;
    new GLTFLoader().load(
      "https://readyplayerme.github.io/web-3d-viewer/male.glb",
      gltf=>{ if(mounted) setModel(gltf.scene); },
      undefined,
      ()=>{}
    );
    return ()=>{mounted=false};
  },[]);
  useFrame(({clock})=>{
    if(ref.current) ref.current.position.y=0.02+Math.sin(clock.elapsedTime*1.7)*0.015;
  });
  return <group ref={ref} position={[0.45,0,0.25]} scale={0.78}>
    {model ? <>
      <primitive object={model.clone(true)} />
      {pfpImage && <PfpHead image={pfpImage} />}
    </> : <>
      <mesh position={[0,0.9,0]}><capsuleGeometry args={[0.3,1.05,8,16]}/><meshStandardMaterial color={accent}/></mesh>
      <mesh position={[0,1.75,0]}><sphereGeometry args={[0.38,24,18]}/><meshStandardMaterial color="#7c5544"/></mesh>
    </>}
  </group>;
}

function Sofa({style}:{style:RoomStyle}) {
  return <group position={[-2.25,0.72,0.1]}>
    <Box position={[0,0,0]} size={[3.25,0.85,1.18]} color={style.furniture}/>
    <Box position={[0,0.7,-0.42]} size={[3.25,1.05,0.34]} color={style.furniture}/>
    <Box position={[-1.18,0.82,0.05]} size={[0.42,0.95,1.1]} color={style.furniture}/>
    <Box position={[1.18,0.82,0.05]} size={[0.42,0.95,1.1]} color={style.furniture}/>
    <Box position={[0,0.63,0.08]} size={[2.55,0.35,0.86]} color={style.accent}/>
  </group>;
}
function Desk({style}:{style:RoomStyle}) {
  return <group position={[2.45,0.68,-0.5]}>
    <Box position={[0,0,0]} size={[2.5,0.18,0.95]} color={style.furniture}/>
    <Box position={[-0.95,-0.7,0]} size={[0.13,1.4,0.13]} color={style.furniture}/>
    <Box position={[0.95,-0.7,0]} size={[0.13,1.4,0.13]} color={style.furniture}/>
    <Box position={[0,0.65,-0.25]} size={[1.45,0.9,0.08]} color="#1e2521"/>
    <Box position={[0,0.2,0.15]} size={[0.72,0.04,0.45]} color="#242c27"/>
  </group>;
}
function CoffeeTable({style}:{style:RoomStyle}) {
  return <group position={[-0.2,0.38,1.25]}>
    <Box position={[0,0,0]} size={[1.8,0.16,0.85]} color={style.furniture}/>
    {[[-0.7,-0.38,-0.28],[0.7,-0.38,-0.28],[-0.7,-0.38,0.28],[0.7,-0.38,0.28]].map((p,i)=><Box key={i} position={p as [number,number,number]} size={[0.08,0.75,0.08]} color={style.furniture}/>)}
  </group>;
}
function Window({style}:{style:RoomStyle}) {
  return <group position={[0,3.05,-2.7]}>
    <Box position={[0,0,0]} size={[6.2,3.2,0.12]} color="#a9c8d4"/>
    <Box position={[0,0,0.08]} size={[0.13,3.2,0.16]} color="#f4f0e4"/>
    <Box position={[0,0,0.08]} size={[6.2,0.13,0.16]} color="#f4f0e4"/>
    <Box position={[-3.1,0,0.08]} size={[0.13,3.2,0.16]} color="#f4f0e4"/>
    <Box position={[3.1,0,0.08]} size={[0.13,3.2,0.16]} color="#f4f0e4"/>
    <Box position={[0,0,0.09]} size={[0.08,3.2,0.16]} color="#f4f0e4"/>
  </group>;
}
function Plant({position}:{position:[number,number,number]}) {
  return <group position={position}><mesh position={[0,0.35,0]} castShadow><cylinderGeometry args={[0.34,0.26,0.65,18]}/><meshStandardMaterial color="#b86f4b"/></mesh><mesh position={[0,1.15,0]} castShadow><sphereGeometry args={[0.62,12,10]}/><meshStandardMaterial color="#527a4f"/></mesh></group>;
}

function PfpHead({image}:{image:string}) {
  const [texture,setTexture]=useState<CanvasTexture|null>(null);
  useEffect(()=>{
    let alive=true;
    const img=new Image();
    img.crossOrigin="anonymous";
    img.onload=()=>{
      if(!alive)return;
      const canvas=document.createElement("canvas");
      canvas.width=512; canvas.height=512;
      const ctx=canvas.getContext("2d");
      if(!ctx)return;
      ctx.clearRect(0,0,512,512);
      ctx.beginPath(); ctx.arc(256,256,240,0,Math.PI*2); ctx.closePath(); ctx.clip();
      ctx.drawImage(img,0,0,512,512);
      const t=new CanvasTexture(canvas); t.colorSpace=SRGBColorSpace; t.needsUpdate=true;
      setTexture(t);
    };
    img.src=image;
    return ()=>{alive=false};
  },[image]);
  if(!texture)return null;
  const material=new SpriteMaterial({map:texture,transparent:true,depthTest:true,depthWrite:false});
  return <sprite material={material} position={[0,2.05,0.03]} scale={[0.62,0.62,0.62]} />;
}

function Scene({style,pfpImage}:{style:RoomStyle;pfpImage?:string}) {
  return <>
    <ambientLight intensity={1.25}/>
    <directionalLight position={[5,9,6]} intensity={2.4} castShadow/>
    <pointLight position={[-3,4,2]} intensity={10} distance={9} color={style.luxe?"#f8dca2":"#d8f0df"}/>
    <Box position={[0,-0.12,0]} size={[12,0.22,8]} color={style.floor}/>
    <Box position={[0,3.4,-3.05]} size={[12,7,0.16]} color={style.wall}/>
    <Box position={[-6,3.4,0]} size={[0.16,7,8]} color={style.wall}/>
    <Window style={style}/><Sofa style={style}/><CoffeeTable style={style}/><Desk style={style}/><Plant position={[-4.4,0,-1.8]}/>
    <RealAvatar accent={style.accent} pfpImage={pfpImage}/>
    {style.luxe && <Box position={[4.3,2.35,-2.8]} size={[2.8,1.8,0.12]} color="#151b18"/>}
    <Orbit target={[0,1.15,0]}/>
  </>;
}

export default function CryptoRoom({originName,cash,pfpImage}:{originName:string;cash:string;pfpImage?:string}) {
  const style=styles[originName]??styles["Web3 Jobber"];
  return <div className="three-room-canvas">
    <Canvas shadows dpr={[1,1.5]} camera={{position:[10.8,7.2,12.8],fov:42}} fallback={<div className="three-fallback">3D world unavailable on this device.</div>}>
      <color attach="background" args={[style.luxe?"#d8d4c6":"#d7e1d3"]}/><Scene style={style} pfpImage={pfpImage}/>
    </Canvas>
    <div className="room-3d-hint">DRAG TO LOOK AROUND · FRONT ARC</div>
    <div className="room-style-chip"><span>{style.label}</span><strong>{cash}</strong></div>
    <div className="room-style-copy"><b>{style.subtitle}</b><small>YOUR HOME · 3D WORLD</small></div>
  </div>;
}
