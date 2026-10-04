"use client";

import { useState } from "react";

const origins = [
  { name: "Airdrop Hunter", line: "You were born hunting.", desc: "Wallets, quests, snapshots. You know that free money is never really free.", cash: "₦420,000", trait: "Scout", accent: "#7c3aed" },
  { name: "Crypto Developer", line: "You speak in commits.", desc: "You can turn caffeine into code. Your technical edge opens doors other players cannot see.", cash: "₦280,000", trait: "Builder", accent: "#0891b2" },
  { name: "Crypto Analyst", line: "You read the room.", desc: "Charts, narratives and flows make sense to you. You notice patterns before the crowd.", cash: "₦360,000", trait: "Alpha", accent: "#16a34a" },
  { name: "Degen", line: "Risk is your cardio.", desc: "You chase momentum, survive volatility and somehow always have one more trade.", cash: "₦190,000", trait: "Degen", accent: "#ea580c" },
  { name: "Community Operator", line: "You know everybody.", desc: "You collect people, not just coins. Your network can open doors raw money cannot.", cash: "₦310,000", trait: "Connector", accent: "#db2777" },
  { name: "NFT Native", line: "The PFP is the identity.", desc: "You understand culture, scarcity and social status. Your avatar speaks before you do.", cash: "₦250,000", trait: "Collector", accent: "#ca8a04" },
];

const pfps = [
  { id: 37, name: "Noun #37", collection: "Nouns", seed: "noun-37" },
  { id: 214, name: "Noun #214", collection: "Nouns", seed: "noun-214" },
  { id: 421, name: "Noun #421", collection: "Nouns", seed: "noun-421" },
  { id: 666, name: "Noun #666", collection: "Nouns", seed: "noun-666" },
  { id: 777, name: "Noun #777", collection: "Nouns", seed: "noun-777" },
  { id: 999, name: "Noun #999", collection: "Nouns", seed: "noun-999" },
];

const random = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function PFP({ p, large = false }: { p: typeof pfps[number]; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const fallback = `https://api.dicebear.com/10.x/bottts/svg?seed=${p.seed}&backgroundColor=1a1b18`;
  return <div className={large ? "pfp pfp-lg" : "pfp"}>
    <img src={failed ? fallback : `https://noun.pics/noun/${p.id}`} alt={p.name} onError={() => setFailed(true)} />
  </div>;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [origin, setOrigin] = useState<typeof origins[number] | null>(null);
  const [pfp, setPfp] = useState<typeof pfps[number] | null>(null);
  const [started, setStarted] = useState(false);
  const [lifeNumber] = useState(() => Math.floor(1000 + Math.random() * 9000));

  const createIdentity = () => {
    if (!name.trim() || username.trim().length < 3) return;
    setOrigin(random(origins)); setPfp(random(pfps)); setStep(1);
  };

  if (started && origin && pfp) return <main className="world">
    <header><b><i>◆</i> CRYPTO LIFE</b><span>SIMULATION MODE</span></header>
    <section className="spawn">
      <div><p className="kicker">LIFE #{lifeNumber} · @{username}</p><h1>GM, <em>{name.split(" ")[0]}.</em></h1>
      <p className="lead">Your life has started. No roadmap. No ending. Just a world full of people, opportunities and questionable decisions.</p>
      <div className="stats"><div><small>ORIGIN</small><strong>{origin.name}</strong></div><div><small>STARTING CASH</small><strong>{origin.cash}</strong></div><div><small>TRAIT</small><strong>{origin.trait}</strong></div></div>
      <button onClick={() => alert("World map is the next build slice.")}>ENTER THE WORLD <b>→</b></button></div>
      <div className="world-avatar"><div className="world-pfp"><PFP p={pfp} large /></div><div className="world-identity"><strong>{name}</strong><span>@{username}</span></div></div>
    </section>
  </main>;

  return <main className="onboarding">
    <header><b><i>◆</i> CRYPTO LIFE</b><span>{step === 0 ? "CREATE YOUR LIFE" : `STEP ${step} / 3`}</span></header>

    {step === 0 && <section className="signup">
      <div className="signup-intro"><p className="kicker">WELCOME TO THE TIMELINE</p><h1>Before the GM,<br /><span>who are you?</span></h1><p className="lead">This is your identity in Crypto Life. Your name stays yours. Your starting life does not.</p></div>
      <div className="signup-card">
        <div className="field"><label htmlFor="name">Your name</label><input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rolex" autoComplete="name" /></div>
        <div className="field"><label htmlFor="username">Username</label><div className="username-input"><span>@</span><input id="username" value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())} placeholder="rolex" autoComplete="nickname" /></div><small>This is the name other players will see in the world.</small></div>
        <div className="identity-note"><span className="note-icon">✦</span><div><strong>Your first life is dealt by fate.</strong><p>Origin, starting cash and Genesis PFP are randomly assigned after you continue.</p></div></div>
        <button className="primary" onClick={createIdentity} disabled={!name.trim() || username.trim().length < 3}>CONTINUE <b>→</b></button>
        <p className="legal">18+ beta · Simulation only · No wallet required</p>
      </div>
    </section>}

    {step === 1 && origin && <section className="reveal">
      <div className="step-heading"><span className="step-number">01</span><div><p className="kicker">YOUR STARTING LIFE</p><h2>Fate has<br /><span>dealt you a hand.</span></h2></div></div>
      <div className="origin-card"><div className="origin-icon" style={{background: origin.accent}}>↯</div><div><small>{origin.line}</small><h3>{origin.name}</h3><p>{origin.desc}</p></div><div className="cash"><small>STARTING CASH</small><b>{origin.cash}</b></div></div>
      <div className="locked-note">NO REROLL · THIS IS YOUR GENESIS</div><button onClick={() => setStep(2)}>MEET MY PFP <b>→</b></button>
    </section>}

    {step === 2 && pfp && <section className="reveal">
      <div className="step-heading"><span className="step-number">02</span><div><p className="kicker">YOUR DIGITAL IDENTITY</p><h2>The PFP is<br /><span>the identity.</span></h2></div></div>
      <div className="character"><div className="stage"><PFP p={pfp} large /></div><div className="character-copy">
        <span className="collection-pill">⌐◨-◨ {pfp.collection} · CC0</span><h3>{pfp.name}</h3>
        <p>Your Genesis PFP. It is your profile picture, your leaderboard identity and eventually the character you walk around with in the world.</p>
        <div className="chips"><span>COLLECTION <b>{pfp.collection}</b></span><span>STATUS <b>GENESIS</b></span></div>
        <div className="own-pfp"><strong>Already have a PFP?</strong><span>Connect your wallet later and use an NFT you actually own.</span></div>
      </div></div>
      <button onClick={() => setStep(3)}>SEE MY LIFE <b>→</b></button>
    </section>}

    {step === 3 && origin && pfp && <section className="final">
      <div><p className="kicker">IDENTITY COMPLETE</p><h2>Welcome,<br /><span>{name.split(" ")[0]}.</span></h2>
      <p className="lead">Your starting status and PFP are locked for this life. Build skills, find alpha, lose money, make friends and see where the world takes you.</p>
      <div className="summary"><span>NAME <b>{name}</b></span><span>USERNAME <b>@{username}</b></span><span>ORIGIN <b>{origin.name}</b></span><span>GENESIS PFP <b>{pfp.name}</b></span></div>
      <button onClick={() => setStarted(true)}>ENTER CRYPTO LIFE <b>↗</b></button></div>
      <div className="final-pfp"><PFP p={pfp} large /><div className="final-tag"><span>GENESIS PFP</span><strong>{pfp.name}</strong></div></div>
    </section>}
  </main>;
}
