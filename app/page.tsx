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
  name: "Milady" | "CryptoPunk" | "Wojak" | "Pudgy Penguin";
  category: "MILADY" | "CRYPTOPUNK" | "WOJAK" | "PUDGY PENGUIN";
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
  // Four identity families. Each family contains many individual identities;
  // onboarding chooses a family and then a specific PFP inside it.
  ...["gyaru","hypebeast"].map((variant, i) => ({
    id: `milady-${variant}`,
    name: "Milady" as const,
    category: "MILADY" as const,
    image: `https://www.miladymaker.net/images/${variant}.png`,
    accent: i ? "#9aa87c" : "#d98b7b",
  })),
  ...[3100,7804,5822,7252,2338,6965,8348,9416,7523,7807].map((id, i) => ({
    id: `punk-${id}`,
    name: "CryptoPunk" as const,
    category: "CRYPTOPUNK" as const,
    image: `https://unpkg.com/cryptopunk-icons@1.1.0/files/app/assets/punk${String(id).padStart(4,"0")}.png`,
    accent: ["#79d8ff","#8ec5ff","#b7a1ff","#78e0c1","#f1b36d"][i % 5],
  })),
  ...[8,27,69,103,211,420,777,1024,2048,3141].map((id, i) => ({
    id: `wojak-${id}`,
    name: "Wojak" as const,
    category: "WOJAK" as const,
    image: `https://rarewojak.com/images/wojaks/${id}.png`,
    accent: ["#ff7a24","#f09a3e","#e96b57","#ff9b42","#d86a42"][i % 5],
  })),
  ...[1219,1,7,42,69,100,420,777,1337,2024].map((id, i) => ({
    id: `pudgy-${id}`,
    name: "Pudgy Penguin" as const,
    category: "PUDGY PENGUIN" as const,
    image: `https://api.pudgypenguins.io/penguin/${id}`,
    accent: ["#ef6f86","#7eb8df","#f1b36d","#8ccfbd","#b9a0e8"][i % 5],
  })),
];



const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function PfpImage({ pfp, className = "" }: { pfp: PFP; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!pfp.image.includes("api.pudgypenguins.io")) {
      setSrc(pfp.image);
      return;
    }
    fetch(pfp.image)
      .then(r => r.json())
      .then(data => {
        if (alive) setSrc(data.image || data.image_url || data.animation_url || null);
      })
      .catch(() => alive && setBroken(true));
    return () => { alive = false; };
  }, [pfp.image]);

  if (broken || !src) {
    return <div className={`pfp-fallback ${className}`} style={{ background: pfp.accent }}>
      <span>{pfp.category.slice(0, 2)}</span>
    </div>;
  }

  return <img
    className={`pfp-image ${className}`}
    src={src}
    alt={pfp.name}
    onError={() => setBroken(true)}
  />;
}

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<"signup" | "origin" | "pfp" | "world" | "map">("signup");
  const [selectedDistrict, setSelectedDistrict] = useState("Genesis Hub");
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

  if (screen === "map" && origin && pfp) {
    const districts = [
      {name:"Genesis Hub",type:"STARTING DISTRICT",desc:"Your home base. Apartments, first jobs, social rooms and the city feed.",tag:"HOME",x:"48%",y:"50%"},
      {name:"Builder District",type:"BUILD · WORK",desc:"Protocol offices, hackathons, coworking floors and developer bounties.",tag:"BUILD",x:"24%",y:"31%"},
      {name:"Exchange Row",type:"MONEY · MARKETS",desc:"Exchanges, banks, OTC desks and places where your balance becomes a story.",tag:"MONEY",x:"73%",y:"28%"},
      {name:"Alpha House",type:"RESEARCH · SOCIAL",desc:"Analysts, researchers, private rooms and the people who always know something.",tag:"ALPHA",x:"77%",y:"67%"},
      {name:"NFT Quarter",type:"COLLECT · CULTURE",desc:"Galleries, collectors, auctions and PFP culture.",tag:"NFT",x:"28%",y:"72%"},
      {name:"Degen District",type:"RISK · NIGHTLIFE",desc:"Prediction markets, casinos and late-night decisions.",tag:"DEGEN",x:"57%",y:"79%"},
      {name:"DAO Square",type:"GOVERN · COMMUNITY",desc:"Proposals, votes, debates and protocol politics.",tag:"DAO",x:"51%",y:"23%"},
      {name:"Conference Center",type:"EVENTS · LAUNCHES",desc:"Meetups, launches, conferences and temporary city events.",tag:"EVENT",x:"84%",y:"45%"},
    ];
    const selected = districts.find(d => d.name === selectedDistrict) ?? districts[0];
    return (
      <main className="map-screen">
        <header className="game-topbar map-topbar">
          <button className="map-back" onClick={() => setScreen("world")}>← HOME</button>
          <div className="brand"><span className="brand-mark">◆</span><strong>CRYPTO LIFE</strong></div>
          <div className="top-profile"><span>@{username}</span></div>
        </header>
        <section className="city-map-layout">
          <div className="city-map-copy">
            <span className="eyebrow">GENESIS HUB · CITY MAP</span>
            <h1>Where are you<br /><span>going?</span></h1>
            <p>The city is a system of places. Every district has a reason to exist, people to meet and things that can change your life.</p>
            <div className="selected-place">
              <div><span>{selected.type}</span><strong>{selected.name}</strong></div>
              <p>{selected.desc}</p>
              <button className="enter-button" onClick={() => setScreen("world")}>TRAVEL TO {selected.name.toUpperCase()} <b>→</b></button>
            </div>
            <div className="map-legend"><span><i className="legend-dot home-dot" /> YOUR HOME</span><span><i className="legend-dot" /> DISTRICT</span><span><i className="legend-dot event-dot" /> EVENT</span></div>
          </div>
          <div className="city-map-card">
            <div className="map-card-head"><span>CRYPTO CITY</span><b>DAY 01 · 08:42</b></div>
            <div className="city-map">
              <div className="map-river" />
              <div className="map-road r1" /><div className="map-road r2" /><div className="map-road r3" /><div className="map-road r4" />
              {districts.map(d => <button key={d.name} className={`district-pin ${selected.name === d.name ? "selected" : ""}`} style={{left:d.x,top:d.y}} onClick={() => setSelectedDistrict(d.name)}><span>{d.tag}</span><strong>{d.name}</strong></button>)}
              <div className="you-marker"><span>YOU</span><b>◆</b></div>
            </div>
            <div className="map-card-foot"><span>8 DISTRICTS</span><span>SHARED WORLD</span><span>LIVE CITY</span></div>
          </div>
        </section>
      </main>
    );
  }

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
            <p>You just spawned into the timeline. This is your starter home. Build your skills, earn your first serious money, then upgrade the life around you.</p>
            <div className="needs">
              <div><span>ENERGY</span><b><i style={{ width: "82%" }} /></b></div>
              <div><span>HUNGER</span><b><i style={{ width: "68%" }} /></b></div>
              <div><span>FUN</span><b><i style={{ width: "91%" }} /></b></div>
            </div>
            <div className="world-actions">
              <button className="game-button primary-game" onClick={() => setScreen("map")}>STEP INTO THE CITY <b>→</b></button>
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
      <main className="character-screen">
        <header className="minimal-topbar">
          <div className="brand"><span className="brand-mark">◆</span><strong>CRYPTO LIFE</strong></div>
          <span className="tiny-status">03 / 03 · CHARACTER</span>
        </header>

        <section className="character-builder">
          <div className="character-intro">
            <span className="eyebrow">CHARACTER BUILDER · @{username}</span>
            <h1>Meet the life<br /><span>you were dealt.</span></h1>
            <p>Your starting archetype and PFP are assigned at genesis. This is the identity you'll carry into the city.</p>

            <div className="character-sheet">
              <div className="sheet-label">IDENTITY</div>
              <div className="sheet-main">
                <div>
                  <small>NAME</small>
                  <strong>{name}</strong>
                  <span>@{username}</span>
                </div>
                <div className="sheet-life">
                  <small>LIFE</small>
                  <strong>#{lifeNumber}</strong>
                </div>
              </div>

              <div className="sheet-grid">
                <div><small>ORIGIN</small><strong>{origin.name}</strong><span>{origin.tagline}</span></div>
                <div><small>TRAIT</small><strong>{origin.trait}</strong><span>GENESIS TRAIT</span></div>
                <div><small>CASH</small><strong>{origin.cash}</strong><span>STARTING BALANCE</span></div>
                <div><small>HOME</small><strong>{origin.name === "Crypto Guru" ? "Penthouse" : origin.name === "NFT Native" ? "Collector Loft" : "Apartment"}</strong><span>YOUR FIRST PLACE</span></div>
              </div>
            </div>

            <button className="enter-button" onClick={() => setScreen("world")}>LOCK IN CHARACTER <b>→</b></button>
            <button className="reset-link" onClick={startOver}>START OVER</button>
          </div>

          <div className="character-stage">
            <div className="stage-top">
              <span>GENESIS PFP</span>
              <b>ASSIGNED</b>
            </div>
            <div className="character-pfp-card">
              <div className="character-pfp-backdrop" style={{ background: pfp.accent }} />
              <div className="character-pfp-grid" />
              <PfpImage pfp={pfp} className="character-pfp" />
              <div className="character-badge"><span>GENESIS</span><strong>#{lifeNumber}</strong></div>
            </div>
            <div className="character-pfp-meta">
              <span>GENESIS PFP</span>
              <strong>{pfp.name}</strong>
            </div>
            <div className="character-note">
              <span>✦</span>
              <p><strong>This is your genesis identity.</strong> It is assigned at onboarding and lives in your identity, profile and social layer.</p>
            </div>
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
                {[pfps[0], pfps[12], pfps[17], pfps[29]].map(item => <PfpImage key={item.id} pfp={item} />)}
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
