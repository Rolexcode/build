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
  const [screen, setScreen] = useState<"signup" | "reveal" | "world">("signup");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [pfp, setPfp] = useState<PFP | null>(null);
  const [lifeNumber, setLifeNumber] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("crypto-life-life");
    if (saved) {
      try {
        const life = JSON.parse(saved);
        setName(life.name || "");
        setUsername(life.username || "");
        setOrigin(life.origin || null);
        setPfp(life.pfp || null);
        setLifeNumber(life.lifeNumber || null);
        if (life.name && life.username && life.origin && life.pfp) setScreen("reveal");
      } catch {
        localStorage.removeItem("crypto-life-life");
      }
    }
    setHydrated(true);
  }, []);

  const gallery = useMemo(() => pfps, []);

  const createLife = () => {
    if (!name.trim() || username.trim().length < 3) return;
    const nextOrigin = pick(origins);
    const nextPfp = pick(pfps);
    const nextLifeNumber = Math.floor(1000 + Math.random() * 9000);
    const life = {
      name: name.trim(),
      username: username.trim().toLowerCase(),
      origin: nextOrigin,
      pfp: nextPfp,
      lifeNumber: nextLifeNumber,
    };
    localStorage.setItem("crypto-life-life", JSON.stringify(life));
    setOrigin(nextOrigin);
    setPfp(nextPfp);
    setLifeNumber(nextLifeNumber);
    setScreen("reveal");
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
              <button className="game-button ghost-game" onClick={() => setScreen("reveal")}>VIEW LIFE</button>
            </div>
          </div>

          <div className="room">
            <CryptoRoom originName={origin.name} cash={origin.cash} />
          </div>
        </section>
      </main>
    );
  }

  if (screen === "reveal" && origin && pfp) {
    return (
      <main className="reveal-screen">
        <header className="minimal-topbar">
          <div className="brand"><span className="brand-mark">◆</span><strong>CRYPTO LIFE</strong></div>
          <span className="tiny-status">GENESIS · LIFE #{lifeNumber}</span>
        </header>

        <section className="reveal-layout">
          <div className="reveal-copy">
            <span className="eyebrow">WELCOME, @{username}</span>
            <h1>This is<br /><span>your PFP.</span></h1>
            <p>Your first life is already dealt. No wallet. No setup. No choosing a character from a menu. You get a PFP, a starting hand and a world to figure out.</p>

            <div className="life-ticket">
              <div><span>STARTING LIFE</span><strong>{origin.name}</strong><small>{origin.tagline}</small></div>
              <div><span>STARTING CASH</span><strong>{origin.cash}</strong><small>{origin.trait} · GENESIS</small></div>
            </div>

            <button className="enter-button" onClick={() => setScreen("world")}>EXPLORE CRYPTO COMMUNITY <b>↗</b></button>
            <button className="reset-link" onClick={() => { localStorage.removeItem("crypto-life-life"); setName(""); setUsername(""); setOrigin(null); setPfp(null); setLifeNumber(null); setScreen("signup"); }}>START OVER</button>
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

  return (
    <main className="onboarding">
      <header className="minimal-topbar">
        <div className="brand"><span className="brand-mark">◆</span><strong>CRYPTO LIFE</strong></div>
        <div className="tiny-status">18+ · BETA</div>
      </header>

      <section className="signup-layout">
        <div className="signup-copy">
          <div className="floating-pfps">
            {gallery.map((item, index) => (
              <div className={`float-pfp f${index + 1}`} key={item.id}><PfpImage pfp={item} /></div>
            ))}
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
          <div className="panel-head"><span>CREATE YOUR SIM</span><b>01 / 01</b></div>
          <h2>Who are you?</h2>
          <p className="panel-sub">Just your name and your handle. Everything else comes after.</p>

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
