"use client";

import { useState } from "react";

const origins = [
  { name: "Airdrop Hunter", line: "You were born hunting", desc: "You learned early that free money is never really free. You watch wallets, quests and the next snapshot.", cash: "₦420,000", trait: "Scout", accent: "#8b5cf6" },
  { name: "Crypto Developer", line: "You speak in commits", desc: "You can turn caffeine into code. Your technical edge opens doors other players cannot see.", cash: "₦280,000", trait: "Builder", accent: "#06b6d4" },
  { name: "Crypto Analyst", line: "You read the room", desc: "Charts, narratives and flows make sense to you. You notice patterns before the crowd.", cash: "₦360,000", trait: "Alpha", accent: "#22c55e" },
  { name: "Degen", line: "Risk is your cardio", desc: "You do not wait for certainty. You chase momentum, survive volatility and always have one more trade.", cash: "₦190,000", trait: "Degen", accent: "#f97316" },
  { name: "Community Operator", line: "You know everybody", desc: "You collect people, not just coins. Your network can open doors that raw money cannot.", cash: "₦310,000", trait: "Connector", accent: "#ec4899" },
  { name: "NFT Native", line: "The PFP is the identity", desc: "You understand culture, scarcity and social status. Your avatar speaks before you do.", cash: "₦250,000", trait: "Collector", accent: "#eab308" },
];

const avatars = [
  { name: "Ribbit", type: "Original frog", skin: "#7ed46b", dark: "#203b2b", item: "visor" },
  { name: "Icebox", type: "Original penguin", skin: "#b8d7e9", dark: "#18283a", item: "chain" },
  { name: "Blockhead", type: "Original meme humanoid", skin: "#c9956e", dark: "#31241d", item: "cap" },
  { name: "Mog", type: "Original cat", skin: "#c5a1df", dark: "#2b1938", item: "glasses" },
  { name: "Bongo", type: "Original ape", skin: "#9b704f", dark: "#2b211b", item: "hood" },
  { name: "Noodle", type: "Original creature", skin: "#efc45f", dark: "#3c2f0c", item: "buds" },
];

function random<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function PFP({ a, large = false }: { a: typeof avatars[number]; large?: boolean }) {
  return <div className={large ? "pfp pfp-lg" : "pfp"}>
    <svg viewBox="0 0 300 340" aria-label={a.name} role="img">
      <defs><linearGradient id="shine" x1="0" x2="1"><stop offset="0" stopColor={a.skin}/><stop offset="1" stopColor="#f8f7f0"/></linearGradient></defs>
      <ellipse cx="150" cy="316" rx="80" ry="13" fill="#000" opacity=".13"/>
      <path d="M73 258c0-54 31-84 77-84s77 30 77 84c0 40-31 59-77 59s-77-19-77-59Z" fill="url(#shine)"/>
      <path d="M61 164C61 91 101 48 150 48s89 43 89 116c0 51-32 84-89 84s-89-33-89-84Z" fill={a.skin}/>
      <circle cx="112" cy="157" r="25" fill="#fff"/><circle cx="188" cy="157" r="25" fill="#fff"/>
      <circle cx="118" cy="162" r="10" fill={a.dark}/><circle cx="182" cy="162" r="10" fill={a.dark}/>
      <path d="M113 207c20 17 54 17 74 0" fill="none" stroke={a.dark} strokeWidth="10" strokeLinecap="round"/>
      {a.item === "visor" && <><path d="M55 143h190v37H55z" fill="#14202a"/><path d="M78 150h144" stroke="#9af6d0" strokeWidth="5"/></>}
      {a.item === "chain" && <circle cx="150" cy="268" r="34" fill="none" stroke="#e4b84a" strokeWidth="10"/>}
      {a.item === "cap" && <><path d="M69 94c36-55 126-55 162 0l-9 20H78Z" fill="#27374a"/><path d="M185 107h73l-16 18h-57Z" fill="#27374a"/></>}
      {a.item === "glasses" && <g fill="none" stroke="#202020" strokeWidth="9"><rect x="79" y="139" width="59" height="43" rx="12"/><rect x="162" y="139" width="59" height="43" rx="12"/><path d="M138 157h24"/></g>}
      {a.item === "hood" && <path d="M61 151c-9-70 27-122 89-122s98 52 89 122c-26-24-51-35-89-35s-63 11-89 35Z" fill="#35251e" opacity=".94"/>}
      {a.item === "buds" && <><circle cx="61" cy="181" r="12" fill="#202a37"/><circle cx="239" cy="181" r="12" fill="#202a37"/><path d="M61 193v44M239 193v44" stroke="#202a37" strokeWidth="6"/></>}
    </svg>
  </div>;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState<typeof origins[number] | null>(null);
  const [avatar, setAvatar] = useState<typeof avatars[number] | null>(null);
  const [started, setStarted] = useState(false);
  const lifeNumber = Math.floor(1000 + Math.random() * 9000);

  const start = () => { setOrigin(random(origins)); setAvatar(random(avatars)); setStep(1); };
  const next = () => setStep(s => Math.min(3, s + 1));

  if (started && origin && avatar) return <main className="world">
    <header><b><i>◆</i> CRYPTO LIFE</b><span>SIMULATION MODE</span></header>
    <section className="spawn">
      <div><p className="kicker">LIFE #{lifeNumber}</p><h1>GM, <em>{avatar.name}.</em></h1><p className="lead">Your life has started. No roadmap. No ending. Just a world full of people, opportunities and questionable decisions.</p>
      <div className="stats"><div><small>ORIGIN</small><strong>{origin.name}</strong></div><div><small>STARTING CASH</small><strong>{origin.cash}</strong></div><div><small>TRAIT</small><strong>{origin.trait}</strong></div></div>
      <button onClick={() => alert("World map is the next build slice.")}>ENTER THE WORLD <b>→</b></button></div>
      <div className="world-avatar"><PFP a={avatar} large/></div>
    </section>
  </main>;

  return <main className="onboarding">
    <header><b><i>◆</i> CRYPTO LIFE</b><span>{step === 0 ? "START" : step + " / 3"}</span></header>
    {step === 0 && <section className="hero">
      <div><p className="kicker">A LIFE SIM FOR THE CRYPTO-NATIVE</p><h1>Wake up.<br/><span>Say GM.</span><br/>Live your life.</h1><p className="lead">Your status is random. Your PFP is random. What you do with the life you get is up to you.</p><button onClick={start}>START MY LIFE <b>→</b></button><small className="note">No wallet required · Simulation only · Your first life is dealt by fate</small></div>
      <div className="hero-card"><div className="bubble"><b>GM ☀️</b><span>08:42</span></div><div className="hero-pfp"><PFP a={avatars[2]} large/></div><div className="ticker"><span>BTC</span><b>+4.82%</b><span>ETH</span><b>+2.31%</b></div><strong>YOUR LIFE IS LIVE</strong><small>The market moves. So do you.</small></div>
    </section>}
    {step === 1 && origin && <section className="reveal"><p className="kicker">FATE HAS DEALT YOU A HAND</p><h2>You didn't choose<br/><span>your starting life.</span></h2><div className="origin-card"><div className="origin-icon" style={{background:origin.accent}}>↯</div><div><small>{origin.line}</small><h3>{origin.name}</h3><p>{origin.desc}</p></div><div className="cash"><small>STARTING CASH</small><b>{origin.cash}</b></div></div><button onClick={next}>MEET MY PFP <b>→</b></button></section>}
    {step === 2 && avatar && <section className="reveal"><p className="kicker">YOUR IDENTITY HAS BEEN DEALT</p><h2>This is <span>you.</span></h2><div className="character"><div className="stage"><PFP a={avatar} large/></div><div><small className="mono">GENESIS PFP · RANDOMLY ASSIGNED</small><h3>{avatar.name}</h3><p>{avatar.type}. An original Web3-native character designed to work as a PFP and as a 3D person inside the world.</p><div className="chips"><span>ORIGIN <b>{origin?.trait}</b></span><span>STATUS <b>UNRANKED</b></span></div></div></div><button onClick={next}>SEE MY LIFE <b>→</b></button></section>}
    {step === 3 && origin && avatar && <section className="final"><div><p className="kicker">LIFE GENERATED</p><h2>Welcome to<br/><span>the timeline.</span></h2><p className="lead">Your starting status and character are locked for this life. No reroll. Build skills, find alpha, lose money, make friends and see where the world takes you.</p><div className="summary"><span>ORIGIN <b>{origin.name}</b></span><span>PFP <b>{avatar.name}</b></span><span>CASH <b>{origin.cash}</b></span></div><button onClick={() => setStarted(true)}>ENTER CRYPTO LIFE <b>↗</b></button></div><div className="final-pfp"><PFP a={avatar} large/></div></section>}
  </main>;
}
