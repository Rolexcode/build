"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Group, Mesh, Object3D } from "three";
import { CanvasTexture, SRGBColorSpace, MeshStandardMaterial, SphereGeometry, TextureLoader } from "three";

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

function PfpTexture({image,onReady}:{image:string;onReady:(texture:CanvasTexture)=>void}) {
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
      ctx.drawImage(img,0,0,512,512);
      const texture=new CanvasTexture(canvas);
      texture.colorSpace=SRGBColorSpace;
      texture.needsUpdate=true;
      onReady(texture);
    };
    img.src=image;
    return ()=>{alive=false};
  },[image,onReady]);
  return null;
}

function RealAvatar({accent,pfpImage}:{accent:string;pfpImage?:string}) {
  const ref=useRef<Group>(null);
  const [model,setModel]=useState<any>(null);
  const [pfpTexture,setPfpTexture]=useState<CanvasTexture|null>(null);

  useEffect(()=>{
    let mounted=true;
    new GLTFLoader().load(
      "https://readyplayerme.github.io/web-3d-viewer/male.glb",
      gltf=>{
        if(!mounted)return;
        // Keep the realistic body, but replace the head with the player's actual PFP.
        gltf.scene.traverse((node:Object3D)=>{
          const mesh=node as Mesh;
          const n=(node.name||"").toLowerCase();
          if("isMesh" in mesh && (n.includes("head") || n.includes("hair") || n.includes("eye") || n.includes("teeth") || n.includes("face"))){
            mesh.visible=false;
          }
        });
        setModel(gltf.scene);
      },
      undefined,
      ()=>{}
    );
    return ()=>{mounted=false};
  },[]);

  useFrame(({clock})=>{
    if(ref.current) ref.current.position.y=0.02+Math.sin(clock.elapsedTime*1.7)*0.012;
  });

  return (
    <group ref={ref} position={[0.45,0,0.25]} scale={0.78}>
      {pfpImage && <PfpTexture image={pfpImage} onReady={setPfpTexture}/>}
      {model ? <primitive object={model.clone(true)} /> : <>
        <mesh position={[0,0.9,0]}>
          <capsuleGeometry args={[0.3,1.05,8,16]}/>
          <meshStandardMaterial color={accent}/>
        </mesh>
      </>}
      {pfpTexture && (
        <mesh position={[0,1.73,0]} castShadow>
          <sphereGeometry args={[0.34,32,24]}/>
          <meshStandardMaterial map={pfpTexture} roughness={0.55} metalness={0.02}/>
        </mesh>
      )}
    </group>
  );
}

