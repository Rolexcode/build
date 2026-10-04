"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const CryptoRoom = dynamic(() => import("./crypto-room"), { ssr: false });

type Origin = {
  name: string;
  tagline: string;
  cash: string;
  trait: string;
  color: string;
};

type PFP = {
  id: string;
  name: string;
  collection: string;
  image: string;
  accent: string;
};

const origins: Origin[] = [
  { name: "Airdrop Hunter", tagline: "You were born hunting.", cash: "$2,800", trait: "Scout", color: "#7c5cff" },
  { name: "Crypto Developer", tagline: "You speak in commits.", cash: "$1,900", trait: "Builder", color: "#00a6a6" },
  { name: "Crypto Analyst", tagline: "You read the room.", cash: "$2,400", trait: "Alpha", color: "#36a269" },
  { name: "Degen", tagline: "Risk is your cardio.", cash: "$1,250", trait: "Degen", color: "#ff6b35" },
  { name: "Web3 Jobber", tagline: "You mod, shill, host, grind.", cash: "$2,100", trait: "Operator", color: "#e44f8f" },
  { name: "NFT Native", tagline: "The PFP is the identity.", cash: "$1,700", trait: "Collector", color: "#d09b25" },
  { name: "Crypto Guru", tagline: "You caught the cycle early.", cash: "$1,250,000", trait: "Whale", color: "#d5ad47" },
];

const pfps: PFP[] = [
  {
    id: "milady-gyaru",
    name: "Gyaru Milady",
    collection: "Milady Maker",
    image: "https://www.miladymaker.net/images/gyaru.png",
    accent: "#d98b7b",
  },
  {
    id: "milady-hypebeast",
    name: "Hypebeast Milady",
    collection: "Milady Maker",
    image: "https://www.miladymaker.net/images/hypebeast.png",
    accent: "#9aa87c",
  },
  {
    id: "punk-3100",
    name: "CryptoPunk #3100",
    collection: "CryptoPunks",
    image: "https://files.larvalabs.com/cryptopunks/original/punk3100.png",
    accent: "#79d8ff",
  },
  {
    id: "wojak-8",
    name: "Rare Wojak #8",
    collection: "Rare Wojak",
    image: "https://rarewojak.com/images/wojaks/8.png",
    accent: "#ff7a24",
  },
  {
    id: "pudgy-1219",
    name: "Pudgy Penguin #1219",
    collection: "Pudgy Penguins",
    image: "https://f8n-production-collection-assets.imgix.net/0xBd3531dA5CF5857e7CfAA92426877b022e612cf8/1219/nft.png?auto=format%2Ccompress&cs=srgb&fnd_key=v1&h=1200&q=70&w=1200",
    accent: "#ef6f86",
  },
];

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function PfpImage({ pfp, className = "" }: { pfp: PFP; className?: string }) {
  const [broken, setBroken] = useState(false);
  return broken ? (
    <div className={`pfp-fallback ${className}`} style={{ background: pfp.accent }}>
      <span>{pfp.collection.slice(0, 2).toUpperCase()}</span>
    </div>
  ) : (
    <img
      className={`pfp-image ${className}`}
      src={pfp.image}
      alt={pfp.name}
      onError={() => setBroken(true)}
    />
  );
}

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<"signup" | "origin" | "pfp" | "world">("signup");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [pfp, setPfp] = useState<PFP | null>(null);
  const [lifeNumber, setLifeNumber] = useState<number | null>(null);

  useEffect(() => { setHydrated(true); }, []);

  const createLife = () => {
    if (!name.trim() || username.trim().length < 3) return;
    setOrigin(pick(origins));
    setPfp(pick(pfps));
    setLifeNumber(Math.floor(1000 + Math.random() * 9000));
    setScreen("origin");
  };

  const startOver = () => {
    setName("");
    setUsername("");
    setOrigin(null);
    setPfp(null);
    setLifeNumber(null);
    setScreen("signup");
  };

  if (!hydrated) return <main className="boot"><div className="boot-mark">◆</div></main>;

  if (screen === "world" && origin && pfp) {
    return (
      <main className="game-shell">
        <header className="game-topbar">
          <div className="brand"><span className="brand-mark">◆</span><strong>CRYPTO LIFE</strong></div>
          <div className="top-status"><span className="online-dot" /> YOUR LIFE · #{lifeNumber}</div>
          <div className="top-profile"><PfpImage pfp={pfp} /><span>@{username}</span></div>
        </header>
        <section className="home-scene">
          <div className="scene-copy">
            <span className="eyebrow">DAY 01 · 08:42 AM · GENESIS HUB</span>
            <h1>GM, <span>{name.split(" ")[0]}.</span></h1>
            <p>You just spawned into the timeline. The market is moving. Your phone is buzzing. Someone in the group chat already has alpha.</p>
            <div className="needs">
              <div><span>ENERGY</span><b><i style={{ width: "82%" }} /></b></div>
              <div><span>HUNGER</span><b><i style={{ width: "68%" }} /></b></div>
              <div><span>FUN</span><b><i style={{ width: "91%" }} /></b></div>
            </div>
            <div className="world-actions">
              <button className="game-button primary-game" onClick={() => alert("City exploration is the next build slice.")}>STEP INTO THE CITY <b>→</b></button>
              <button className="game-button ghost-game" onClick={() => setScreen("pfp")}>VIEW LIFE</button>
            </div>
          </div>
          <div className="room"><CryptoRoom originName={origin.name} cash={origin.cash} /></div>
        </section>
      </main>
    );
  }

  if (screen === "pfp" && origin && pfp) {
    return (
      <main className="reveal-screen">
        <header className="minimal-topbar">
          <div className="brand"><span className="brand-mark">◆</span><strong>CRYPTO LIFE</strong></div>
          <span className="tiny-status">03 / 03 · IDENTITY</span>
        </header>
        <section className="reveal-layout character-builder-screen">
          <div className="reveal-copy">
            <span className="eyebrow">YOUR CHARACTER · @{username}</span>
            <h1>Now meet<br /><span>your PFP.</span></h1>
            <p>This is the face people will know in Crypto Life. Your PFP follows you through your profile, chat, leaderboard and the world.</p>
            <div className="life-ticket">
              <div><span>STARTING LIFE</span><strong>{origin.name}</strong><small>{origin.tagline}</small></div>
              <div><span>STARTING CASH</span><strong>{origin.cash}</strong><small>{origin.trait} · GENESIS</small></div>
            </div>
            <button className="enter-button" onClick={() => setScreen("world")}>ENTER MY LIFE <b>↗</b></button>
            <button className="reset-link" onClick={startOver}>START OVER</button>
          </div>
          <div className="pfp-reveal">
            <div className="pfp-aura" style={{ background: pfp.accent }} />
            <div className="pfp-frame">
              <div className="pfp-grid" />
              <PfpImage pfp={pfp} className="hero-pfp" />
              <div className="pfp-stamp"><span>GENESIS</span><strong>#{lifeNumber}</strong></div>
            </div>
            <div className="pfp-name"><span>{pfp.collection}</span><strong>{pfp.name}</strong></div>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "origin" && origin) {
    return (
      <main className="reveal-screen origin-screen">
        <header className="minimal-topbar">
          <div className="brand"><span className="brand-mark">◆</span><strong>CRYPTO LIFE</strong></div>
          <span className="tiny-status">02 / 03 · STARTING LIFE</span>
        </header>
        <section className="origin-layout">
          <div className="origin-copy">
            <span className="eyebrow">LIFE DEALT · #{lifeNumber}</span>
            <h1>You didn't<br /><span>choose this.</span></h1>
            <p>Every life starts somewhere. Your first archetype, cash and trait are dealt at genesis. What you do with it is yours.</p>
            <div className="origin-card">
              <div className="origin-card-top"><span>YOUR STARTING LIFE</span><b>GENESIS</b></div>
              <div className="origin-avatar"><PfpImage pfp={pfp!} /></div>
              <h2>{origin.name}</h2>
              <p>{origin.tagline}</p>
              <div className="origin-stats">
                <div><span>CASH</span><strong>{origin.cash}</strong></div>
                <div><span>TRAIT</span><strong>{origin.trait}</strong></div>
              </div>
            </div>
            <button className="enter-button" onClick={() => setScreen("pfp")}>REVEAL MY CHARACTER <b>→</b></button>
            <button className="reset-link" onClick={startOver}>START OVER</button>
          </div>
          <div className="origin-preview">
            <div className="origin-world-card">
              <span>DAY 01</span>
              <strong>{name.split(" ")[0]} just spawned.</strong>
              <small>The city is already moving.</small>
              <div className="origin-pfp-stack">
                {pfps.slice(0, 4).map(item => <PfpImage key={item.id} pfp={item} />)}
              </div>
              <p>Thousands of lives. One shared timeline.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="onboarding">
      <header className="minimal-topbar">
        <div className="brand"><span className="brand-mark">◆</span><strong>CRYPTO LIFE</strong></div>
        <div className="tiny-status">18+ · BETA</div>
      </header>
      <section className="signup-layout">
        <div className="signup-copy">
          <div className="floating-pfps">
            {pfps.map((item, index) => <div className={`float-pfp f${index + 1}`} key={item.id}><PfpImage pfp={item} /></div>)}
          </div>
          <span className="eyebrow">A LIFE SIM FOR THE CRYPTO-NATIVE</span>
          <h1>Make a life.<br /><span>Not a profile.</span></h1>
          <p>Wake up. Get a job. Find alpha. Meet people. Lose money. Make it back. Your life in crypto starts here.</p>
          <div className="scene-teaser">
            <div className="teaser-road" /><div className="teaser-building b1" /><div className="teaser-building b2" /><div className="teaser-building b3" />
            <div className="teaser-player"><PfpImage pfp={pfps[2]} /></div>
            <div className="teaser-chat"><b>GM</b><span>you coming?</span></div>
          </div>
        </div>
        <div className="signup-panel">
          <div className="panel-head"><span>CREATE YOUR SIM</span><b>01 / 03</b></div>
          <h2>Who are you?</h2>
          <p className="panel-sub">Just your name and your handle. Your life gets dealt next.</p>
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rolex" autoComplete="name" autoFocus />
          </div>
          <div className="field">
            <label htmlFor="username">Username</label>
            <div className="handle-input"><span>@</span><input id="username" value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())} placeholder="rolex" autoComplete="nickname" onKeyDown={e => { if (e.key === "Enter") createLife(); }} /></div>
            <small>This is your name in the world. Keep it clean.</small>
          </div>
          <button className="create-button" onClick={createLife} disabled={!name.trim() || username.trim().length < 3}>CREATE MY LIFE <b>→</b></button>
          <div className="no-wallet"><span>✦</span><p><strong>No wallet required.</strong> Your PFP is assigned from Crypto Life's genesis pool.</p></div>
          <div className="terms">By entering, you agree to the beta terms. 18+.</div>
        </div>
      </section>
    </main>
  );
}
