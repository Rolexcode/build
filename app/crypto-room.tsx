"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Group, Mesh, Object3D } from "three";
import { CanvasTexture, SRGBColorSpace } from "three";

const FURNISHED_FLAT_URL = "https://cdn.3dassets.dev/assets/38818/v1/model.glb";
// CC0 Quaternius humanoid, bundled by an open-source avatar project.
// It gives us a real head/body/arms/legs instead of the old RPM + sphere construction.
const AVATAR_URL = "https://raw.githubusercontent.com/programasweights/avatar/main/public/assets/character.glb";

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
    controls.minDistance=10;
    controls.maxDistance=20;
    controls.minPolarAngle=0.72;
    controls.maxPolarAngle=1.38;

    // Front-of-home only. The player can inspect the room from left/right,
    // but can never swing around behind the apartment.
    const startAzimuth=Math.atan2(camera.position.x-target[0],camera.position.z-target[2]);
    const arc=Math.PI*0.30;
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

function PfpFace({texture}:{texture:CanvasTexture}) {
  const ref=useRef<Group>(null);
  const {camera}=useThree();

  useFrame(()=>{
    // The identity follows the camera subtly, so the player's PFP remains readable
    // while the actual 3D head underneath stays visible as a real head.
    if(ref.current) ref.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={ref} position={[0,2.02,0.18]}>
      <mesh position={[0,0,-0.012]}>
        <planeGeometry args={[0.46,0.46]}/>
        <meshStandardMaterial color="#172018" roughness={0.8}/>
      </mesh>
      <mesh>
        <planeGeometry args={[0.39,0.39]}/>
        <meshBasicMaterial map={texture} transparent/>
      </mesh>
    </group>
  );
}

function RealAvatar({accent,pfpImage}:{accent:string;pfpImage?:string}) {
  const ref=useRef<Group>(null);
  const [model,setModel]=useState<any>(null);
  const [pfpTexture,setPfpTexture]=useState<CanvasTexture|null>(null);

  useEffect(()=>{
    let mounted=true;
    new GLTFLoader().load(
      AVATAR_URL,
      gltf=>{
        if(!mounted)return;
        gltf.scene.traverse((node:Object3D)=>{
          const mesh=node as Mesh;
          if(!("isMesh" in mesh)) return;
          mesh.castShadow=true;
          mesh.receiveShadow=true;

          const material:any=mesh.material;
          const materials=Array.isArray(material)?material:[material];
          for(const mat of materials){
            if(!mat?.color) continue;
            // The base model is intentionally neutral; clothing carries the
            // player's generated accent without flattening the character.
            const n=(node.name||"").toLowerCase();
            if(n.includes("shirt") || n.includes("top") || n.includes("torso") || n.includes("body")){
              mat.color.set(accent);
              mat.roughness=0.64;
            } else {
              mat.roughness=0.76;
            }
          }
        });
        setModel(gltf.scene);
      },
      undefined,
      ()=>{}
    );
    return ()=>{mounted=false};
  },[accent]);

  useFrame(({clock})=>{
    if(ref.current){
      ref.current.position.y=Math.sin(clock.elapsedTime*1.35)*0.004;
      ref.current.rotation.y=Math.sin(clock.elapsedTime*0.45)*0.018;
    }
  });

  return (
    <group ref={ref} position={[-4.65,0,-1.55]} scale={0.92}>
      {pfpImage && <PfpTexture image={pfpImage} onReady={setPfpTexture}/>}
      {model ? <primitive object={model.clone(true)} /> : null}
      {pfpTexture && <PfpFace texture={pfpTexture}/>}
      <mesh position={[0,0.025,0]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[0.42,32]}/>
        <meshBasicMaterial color="#1c211b" transparent opacity={0.15}/>
      </mesh>
    </group>
  );
}

function FurnishedApartment({style}:{style:RoomStyle}) {
  const [model,setModel]=useState<any>(null);

  useEffect(()=>{
    let mounted=true;
    new GLTFLoader().load(
      FURNISHED_FLAT_URL,
      gltf=>{ if(mounted) setModel(gltf.scene); },
      undefined,
      ()=>{}
    );
    return ()=>{ mounted=false; };
  },[]);

  if(!model) {
    return (
      <>
        <Box position={[-5,-0.12,-2]} size={[14,0.22,6]} color={style.floor}/>
        <Box position={[-5,3,-5]} size={[14,6,0.16]} color={style.wall}/>
      </>
    );
  }

  const apartment=model.clone(true);
  apartment.traverse((node:Object3D)=>{
    const mesh=node as Mesh;
    if("isMesh" in mesh){
      mesh.castShadow=true;
      mesh.receiveShadow=true;
    }
  });

  // Give the furnished flat breathing room. The original scene was too dense
  // at the old scale, which also pushed the player toward the front edge.
  return (
    <primitive
      object={apartment}
      position={[-6.15,0,-2.35]}
      scale={[1.42,1,1.30]}
    />
  );
}

type HomeAction = "sleep" | "hygiene" | "cook" | "work" | "watch";

const homeActions: Record<HomeAction,{label:string;title:string;detail:string;need:string;amount:number}> = {
  sleep:{label:"BED",title:"Sleep",detail:"Recover energy and start the next part of your day.",need:"ENERGY",amount:18},
  hygiene:{label:"BATHROOM",title:"Freshen Up",detail:"Wash up before heading into the city.",need:"HYGIENE",amount:22},
  cook:{label:"KITCHEN",title:"Cook",detail:"Make a quick meal and refill your hunger.",need:"HUNGER",amount:24},
  work:{label:"DESK",title:"Work",detail:"Open your laptop and grind a crypto task from home.",need:"CASH",amount:120},
  watch:{label:"TV / LOUNGE",title:"Watch",detail:"Take a break and raise your fun.",need:"FUN",amount:16},
};

function HomeHotspots({onAction}:{onAction:(action:HomeAction)=>void}) {
  const spots:{action:HomeAction;position:[number,number,number];size:[number,number]}[] = [
    {action:"sleep",position:[-8.8,0.72,-2.85],size:[2.2,1]},
    {action:"hygiene",position:[-2.65,0.78,-2.8],size:[1.45,1.1]},
    {action:"cook",position:[-10.45,0.78,-0.7],size:[2.1,1.1]},
    {action:"work",position:[-3.55,0.82,-0.75],size:[1.9,1.1]},
    {action:"watch",position:[-6.35,0.82,-0.45],size:[2.1,1.1]},
  ];
  return <>
    {spots.map(({action,position,size})=>(
      <mesh key={action} position={position} onClick={(e)=>{e.stopPropagation();onAction(action);}}>
        <planeGeometry args={size}/>
        <meshBasicMaterial transparent opacity={0} depthWrite={false}/>
      </mesh>
    ))}
  </>;
}

function Scene({style,pfpImage,originName,cash,onAction}:{style?:RoomStyle;pfpImage?:string;originName?:string;cash?:string;onAction?:(action:HomeAction)=>void}) {
  const sceneStyle:RoomStyle=style ?? {label:"STARTER APARTMENT",subtitle:"your first home",wall:"#eee7dc",floor:"#c8b8a6",furniture:"#4d5149",accent:"#d98b7b",luxe:false};
  const target:[number,number,number]=[-5.3,1.02,-1.75];

  return <>
    <ambientLight intensity={1.05}/>
    <directionalLight position={[4,8,7]} intensity={2.7} castShadow shadow-mapSize={[1024,1024]}/>
    <hemisphereLight args={["#fffdf5","#87957e",1.15]}/>
    <pointLight position={[-4,3.2,2]} intensity={7} distance={12} color={sceneStyle.luxe?"#f8dca2":"#d8f0df"}/>
    <FurnishedApartment style={sceneStyle}/>
    <RealAvatar accent={sceneStyle.accent} pfpImage={pfpImage}/>
    {onAction && <HomeHotspots onAction={onAction}/>}
    <Orbit target={target}/>
  </>;
}

export default function CryptoRoom(props:{style?:RoomStyle;pfpImage?:string;originName?:string;cash?:string}) {
  const [active,setActive]=useState<HomeAction|null>(null);
  const [toast,setToast]=useState<string|null>(null);
  const action=active?homeActions[active]:null;

  const perform=()=>{
    if(!action)return;
    setToast(action.need==="CASH"?"+$120 earned · desk session complete":`+${action.amount} ${action.need.toLowerCase()} restored`);
    setActive(null);
    window.setTimeout(()=>setToast(null),1800);
  };

  return (
    <div className="crypto-room-wrap">
      <Canvas camera={{position:[5.0,5.5,12.5],fov:43}} shadows>
        <Scene {...props} onAction={setActive}/>
      </Canvas>

      <div className="home-hint">TAP THE HOME OBJECTS · DRAG TO LOOK AROUND</div>

      <div className="home-interactions">
        {(["sleep","hygiene","cook","work","watch"] as HomeAction[]).map(key=>{
          const item=homeActions[key];
          return <button key={key} className={`home-action ${active===key?"selected":""}`} onClick={()=>setActive(key)}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
          </button>;
        })}
      </div>

      {active&&action&&(
        <div className="home-action-modal">
          <div className="home-action-card">
            <span className="eyebrow">HOME · {action.need}</span>
            <h3>{action.title}</h3>
            <p>{action.detail}</p>
            <div className="home-action-meta">RESTORE {action.amount}{action.need==="CASH"?" USD":"%"}</div>
            <div className="home-action-buttons">
              <button onClick={perform}>DO IT →</button>
              <button onClick={()=>setActive(null)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {toast&&<div className="home-toast">{toast}</div>}
    </div>
  );
}
