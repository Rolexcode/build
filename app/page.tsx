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

type PhoneTab = "home" | "wallet" | "messages" | "pulse" | "city";

type MarketPrice = { symbol: string; label: string; price: number; change: number };

const districts = [
  { name: "Genesis Hub", tag: "HOME", x: "48%", y: "50%" }, { name: "Builder District", tag: "BUILD", x: "24%", y: "31%" },
  { name: "Exchange Row", tag: "MONEY", x: "73%", y: "28%" }, { name: "Alpha House", tag: "ALPHA", x: "77%", y: "67%" },
  { name: "NFT Quarter", tag: "NFT", x: "28%", y: "72%" }, { name: "Degen District", tag: "DEGEN", x: "57%", y: "79%" },
  { name: "DAO Square", tag: "DAO", x: "51%", y: "23%" }, { name: "Conference Center", tag: "EVENT", x: "84%", y: "45%" },
];

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
    image: `https://api.pudgypenguins.io/penguin/image/${id}`,
    accent: ["#ef6f86","#7eb8df","#f1b36d","#8ccfbd","#b9a0e8"][i % 5],
  })),
];



const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function PfpImage({ pfp, className = "" }: { pfp: PFP; className?: string }) {
  return <img className={`pfp-image ${className}`} src={pfp.image} alt={pfp.name} loading="eager" decoding="async" />;
}

function CitySheet({ selected, select, close, onAction }: { selected: string; select: (name: string) => void; close: () => void; onAction: (message: string, reputation: number) => void }) {
  return <div className="city-overlay" role="dialog" aria-modal="true" aria-label="Crypto City map">
    <section className="city-sheet">
      <header><div><span>CRYPTO CITY · DAY 01</span><strong>Where are you going?</strong></div><button onClick={close} aria-label="Close city map">×</button></header>
      <div className="city-mini-map"><div className="map-river" /><div className="map-road r1" /><div className="map-road r2" /><div className="map-road r3" /><div className="map-road r4" />{districts.map(district => <button key={district.name} className={`district-pin ${selected === district.name ? "selected" : ""}`} style={{ left: district.x, top: district.y }} onClick={() => select(district.name)}><span>{district.tag}</span><strong>{district.name}</strong></button>)}</div>
      <div className="nearby-card"><div><span>NEARBY · ALPHA HOUSE</span><strong>Rae Imani</strong><p>Researcher · “Always knows someone who knows.”</p></div><div className="nearby-actions"><button onClick={() => onAction("You nodded at Rae · she remembers you", 1)}>NOD</button><button onClick={() => onAction("Message sent to Rae · a conversation has started", 2)}>MESSAGE</button><button onClick={() => onAction(`You headed to ${selected} · the city keeps moving`, 1)}>GO THERE →</button></div></div>
    </section>
  </div>;
}

function Phone({
  pfp, username, cash, reputation, markets, tab, setTab, close, onChoice,
}: {
  pfp: PFP; username: string; cash: number; reputation: number; markets: MarketPrice[]; tab: PhoneTab;
  setTab: (tab: PhoneTab) => void; close: () => void; onChoice: (message: string, cashDelta: number, reputationDelta: number) => void;
}) {
  const tabs: { id: PhoneTab; label: string; icon: string }[] = [
    { id: "home", label: "Now", icon: "●" }, { id: "wallet", label: "Wallet", icon: "◇" },
    { id: "messages", label: "Chats", icon: "◌" }, { id: "pulse", label: "Pulse", icon: "↗" }, { id: "city", label: "City", icon: "⌘" },
  ];
  const formatPrice = (price: number) => price ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: price < 100 ? 2 : 0 }).format(price) : "Syncing…";

  return (
    <div className="phone-overlay" role="dialog" aria-modal="true" aria-label="Your in-game phone">
      <section className="phone-shell">
        <header className="phone-head">
          <div className="phone-person"><PfpImage pfp={pfp} /><div><span>YOUR PHONE</span><strong>@{username}</strong></div></div>
          <button className="phone-close" onClick={close} aria-label="Close phone">×</button>
        </header>
        <main className="phone-content">
          {tab === "home" && <>
            <span className="phone-kicker">DAY 01 · 08:42</span><h2>The city is <em>moving.</em></h2>
            <div className="phone-card focus-card"><span>RIGHT NOW</span><strong>Orbit is looking for a community operator.</strong><p>One shift. $180. A useful person might notice.</p><button onClick={() => onChoice("You took the Orbit shift · +$180 · new contact unlocked", 180, 4)}>TAKE THE SHIFT <b>→</b></button></div>
            <div className="notification-list">
              <button onClick={() => setTab("messages")}><i>01</i><div><strong>Alpha House</strong><span>Rae: “Something is brewing.”</span></div><b>NOW</b></button>
              <button onClick={() => setTab("pulse")}><i>02</i><div><strong>Prediction market</strong><span>Will BTC close green today?</span></div><b>2m</b></button>
              <button onClick={() => setTab("city")}><i>03</i><div><strong>City invite</strong><span>Founder drinks · 21:00</span></div><b>1h</b></button>
            </div>
          </>}
          {tab === "wallet" && <>
            <span className="phone-kicker">WALLET · SIMULATED LIFE BALANCE</span><h2>${cash.toLocaleString()}<em> available.</em></h2>
            <div className="wallet-summary"><div><span>REPUTATION</span><strong>{reputation}/100</strong></div><div><span>STATUS</span><strong>{reputation >= 30 ? "KNOWN" : "EARLY"}</strong></div></div>
            <div className="market-list"><div className="market-title"><span>LIVE SPOT</span><small>via Coinbase</small></div>{markets.map(market => <div className="market-row" key={market.symbol}><b>{market.symbol}</b><span>{market.label}</span><strong>{formatPrice(market.price)}</strong><i className={market.change >= 0 ? "up" : "down"}>{market.change >= 0 ? "+" : ""}{market.change}%</i></div>)}</div>
            <p className="phone-footnote">Spot prices are live. Your cash, positions and choices are part of the simulation.</p>
          </>}
          {tab === "messages" && <>
            <span className="phone-kicker">CHATS · 3 UNREAD</span><h2>Your <em>world</em> talks.</h2>
            <div className="chat-list"><button><span className="chat-avatar">R</span><div><strong>Rae / Alpha House</strong><p>“Don’t fade this. Meet me at 11.”</p></div><time>now</time></button><button><span className="chat-avatar builder">O</span><div><strong>Orbit Protocol</strong><p>Community operator shift is open.</p></div><time>3m</time></button><button><span className="chat-avatar degen">D</span><div><strong>Degens After Dark</strong><p>New market just dropped.</p></div><time>9m</time></button></div>
          </>}
          {tab === "pulse" && <>
            <span className="phone-kicker">CITY PULSE · MARKET 04</span><h2>Pick a <em>side.</em></h2>
            <div className="phone-card market-card"><span>PREDICTION MARKET</span><strong>Does BTC finish today above its open?</strong><div className="odds"><b>YES <i>61¢</i></b><b>NO <i>39¢</i></b></div><p>Simulation only · your choice will change your cash and story.</p><div className="split-actions"><button onClick={() => onChoice("You backed YES · $50 committed · the city is watching", -50, 2)}>BACK YES</button><button onClick={() => onChoice("You backed NO · $50 committed · contrarian energy", -50, 2)}>BACK NO</button></div></div>
            <button className="mint-callout" onClick={() => onChoice("You saved a collection concept · Mint Studio unlocked", 0, 3)}><span>MINT STUDIO</span><strong>Have an idea worth owning?</strong><b>OPEN CONCEPTS →</b></button>
          </>}
          {tab === "city" && <>
            <span className="phone-kicker">CRYPTO CITY · TONIGHT</span><h2>Be where <em>things happen.</em></h2>
            <div className="city-list"><button onClick={() => onChoice("You RSVP’d to Founder Drinks · social access up", -35, 3)}><span>21:00</span><div><strong>Founder Drinks</strong><p>Conference Center · $35 cover</p></div><b>RSVP →</b></button><button onClick={() => onChoice("You entered the Degen District · new market access", 0, 1)}><span>23:30</span><div><strong>Degens After Dark</strong><p>Degen District · Prediction floor open</p></div><b>GO →</b></button><button><span>TMRW</span><div><strong>Protocol Hack Night</strong><p>Builder District · bounties posted</p></div><b>VIEW →</b></button></div>
          </>}
        </main>
        <nav className="phone-nav" aria-label="Phone sections">{tabs.map(item => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)} aria-current={tab === item.id ? "page" : undefined}><i>{item.icon}</i><span>{item.label}</span></button>)}</nav>
      </section>
    </div>
  );
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
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [phoneTab, setPhoneTab] = useState<PhoneTab>("home");
  const [cash, setCash] = useState(1250);
  const [reputation, setReputation] = useState(12);
  const [needs, setNeeds] = useState({ energy: 82, hunger: 68, fun: 91 });
  const [notice, setNotice] = useState<string | null>(null);
  const [markets, setMarkets] = useState<MarketPrice[]>([
    { symbol: "BTC", label: "Bitcoin", price: 0, change: 2.4 },
    { symbol: "ETH", label: "Ethereum", price: 0, change: -0.8 },
    { symbol: "SOL", label: "Solana", price: 0, change: 4.1 },
  ]);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setPhoneOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    let active = true;
    if (!phoneOpen || phoneTab !== "wallet" || screen !== "world") return;
    const getMarkets = async () => {
      try {
        const responses = await Promise.all(["BTC", "ETH", "SOL"].map(symbol => fetch(`https://api.coinbase.com/v2/prices/${symbol}-USD/spot`)));
        const payloads = await Promise.all(responses.map(response => response.json()));
        if (!active || payloads.some(payload => !payload?.data?.amount)) return;
        setMarkets(current => current.map((market, index) => ({ ...market, price: Number(payloads[index].data.amount) })));
      } catch {
        // The game remains playable when the live market feed is unavailable.
      }
    };
    getMarkets();
    const timer = window.setInterval(getMarkets, 60_000);
    return () => { active = false; window.clearInterval(timer); };
  }, [phoneOpen, phoneTab, screen]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3200);
  };

  const completeHomeAction = ({ need, amount }: { need: string; amount: number }) => {
    if (need === "CASH") {
      setCash(current => current + amount);
      setReputation(current => Math.min(100, current + 1));
      showNotice(`Contract delivered · +$${amount} · reputation up`);
      return;
    }
    const key = need.toLowerCase() as "energy" | "hunger" | "fun";
    if (key in needs) setNeeds(current => ({ ...current, [key]: Math.min(100, current[key] + amount) }));
    showNotice(`${need.toLowerCase()} restored · your day keeps moving`);
  };

  const createLife = () => {
    if (!name.trim() || username.trim().length < 3) return;
    setOrigin(pick(origins));
    setPfp(pick(pfps));
    setLifeNumber(Math.floor(1000 + Math.random() * 9000));
    setCash(1250);
    setReputation(12);
    setNeeds({ energy: 82, hunger: 68, fun: 91 });
    setScreen("origin");
  };

  const startOver = () => {
    setName("");
    setUsername("");
    setOrigin(null);
    setPfp(null);
    setLifeNumber(null);
    setPhoneOpen(false);
    setMapOpen(false);
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
          <div className="top-profile"><button className="phone-trigger" onClick={() => { setPhoneTab("home"); setPhoneOpen(true); }} aria-label="Open your phone"><span aria-hidden="true">▣</span> PHONE</button><PfpImage pfp={pfp} /><span>@{username}</span></div>
        </header>
        <section className="home-scene">
          <div className="scene-copy">
            <span className="eyebrow">DAY 01 · 08:42 AM · GENESIS HUB</span>
            <h1>GM, <span>{name.split(" ")[0]}.</span></h1>
            <p>You just spawned into the timeline. This is your starter home. Build your skills, earn your first serious money, then upgrade the life around you.</p>
            <div className="needs">
              <div><span>ENERGY</span><b><i style={{ width: `${needs.energy}%` }} /></b><small>{needs.energy}</small></div>
              <div><span>HUNGER</span><b><i style={{ width: `${needs.hunger}%` }} /></b><small>{needs.hunger}</small></div>
              <div><span>FUN</span><b><i style={{ width: `${needs.fun}%` }} /></b><small>{needs.fun}</small></div>
            </div>
            <div className="world-actions">
              <button className="game-button primary-game" onClick={() => setMapOpen(true)}>STEP INTO THE CITY <b>→</b></button>
              <button className="game-button ghost-game" onClick={() => setScreen("pfp")}>VIEW LIFE</button>
            </div>
          </div>
          <div className="room"><CryptoRoom originName={origin.name} cash={origin.cash} onComplete={completeHomeAction} /></div>
        </section>
        {notice && <div className="life-notice" role="status">{notice}</div>}
        {phoneOpen && <Phone pfp={pfp} username={username} cash={cash} reputation={reputation} markets={markets} tab={phoneTab} setTab={setPhoneTab} close={() => setPhoneOpen(false)} onChoice={(message, cashDelta, reputationDelta) => { setCash(current => current + cashDelta); setReputation(current => Math.max(0, Math.min(100, current + reputationDelta))); showNotice(message); }} />}
        {mapOpen && <CitySheet selected={selectedDistrict} select={setSelectedDistrict} close={() => setMapOpen(false)} onAction={(message, reputationDelta) => { setReputation(current => Math.min(100, current + reputationDelta)); setMapOpen(false); showNotice(message); }} />}
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
