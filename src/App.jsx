import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  ShieldCheck,
  Clock,
  Wrench,
  FileCheck2,
  ClipboardCheck,
  BadgeCheck,
  MapPin,
  ChevronDown,
  ChevronRight,
  Star,
  Upload,
  Menu,
  X,
  Gauge,
  Home as HomeIcon,
  PlugZap,
  Calculator,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Design tokens (kept out of Tailwind's arbitrary-value syntax since  */
/* this environment has no JIT compiler — exact brand values live in  */
/* inline style objects / CSS custom properties instead).             */
/* ------------------------------------------------------------------ */
const C = {
  ink: "#0A0E14",
  inkSoft: "#3B4250",
  surface: "#F6F7F9",
  surfaceAlt: "#EEF1F5",
  line: "#E4E7EC",
  white: "#FFFFFF",
  volt: "#1D5FFF",
  voltDeep: "#0B3FCC",
  voltSoft: "#EAF0FF",
  green: "#16A672",
  greenSoft: "#E9F8F1",
  amber: "#E8A23A",
};

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
:root {
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
html { scroll-behavior: smooth; }
body { font-family: var(--font-body); }
.font-display { font-family: var(--font-display); }
.font-mono { font-family: var(--font-mono); }
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.in { opacity: 1; transform: translateY(0); }
`;

/* ------------------------------------------------------------------ */
/* Scroll-reveal hook                                                  */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */
function CTAButton({ children, className = "", href = "#quote", size = "md", onClick }) {
  const pad = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold ${pad} transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      style={{ backgroundColor: C.volt, color: C.white, boxShadow: "0 8px 24px rgba(29,95,255,0.28)" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.voltDeep)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.volt)}
    >
      {children}
    </a>
  );
}

function Eyebrow({ children }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold font-mono tracking-wide uppercase"
      style={{ backgroundColor: C.voltSoft, color: C.voltDeep }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Signature element: animated charge-port illustration for the hero.  */
/* The "fill" bar reads as a battery charging — a literal, on-brand    */
/* loading motif rather than a generic stat block.                    */
/* ------------------------------------------------------------------ */
function ChargeIllustration() {
  const [fill, setFill] = useState(18);
  useEffect(() => {
    const t = setTimeout(() => setFill(86), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden" style={{ backgroundColor: C.ink }}>
      {/* garage backdrop, rendered as soft geometric planes */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(160deg, #0A0E14 0%, #101725 45%, #0A0E14 100%)"
      }} />
      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{
        background: "linear-gradient(180deg, rgba(29,95,255,0) 0%, rgba(29,95,255,0.10) 100%)"
      }} />
      {/* car silhouette */}
      <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="200" cy="420" rx="150" ry="14" fill="rgba(0,0,0,0.35)" />
        <g>
          <path d="M70 360 Q90 300 150 288 L260 288 Q320 296 340 350 L340 380 Q340 392 328 392 L96 392 Q70 392 70 372 Z" fill="#151C2B" stroke="#232C41" strokeWidth="2" />
          <path d="M150 288 Q190 250 235 288" fill="none" stroke="#232C41" strokeWidth="2" />
          <circle cx="120" cy="392" r="24" fill="#0A0E14" stroke="#2B3550" strokeWidth="6" />
          <circle cx="300" cy="392" r="24" fill="#0A0E14" stroke="#2B3550" strokeWidth="6" />
          <rect x="150" y="300" width="86" height="30" rx="4" fill="#0E1421" opacity="0.7" />
        </g>
        {/* charging cable arc from wall unit to car */}
        <path d="M340 250 C 300 260, 280 300, 270 340" fill="none" stroke={C.volt} strokeWidth="3.5" strokeLinecap="round" opacity="0.9">
          <animate attributeName="stroke-dashoffset" values="0;40" dur="2.4s" repeatCount="indefinite" />
        </path>
        <path d="M340 250 C 300 260, 280 300, 270 340" fill="none" stroke={C.volt} strokeWidth="3.5" strokeDasharray="6 10" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" values="0;-32" dur="1.6s" repeatCount="indefinite" />
        </path>
        {/* wall charger unit */}
        <rect x="330" y="200" width="46" height="66" rx="10" fill="#151C2B" stroke="#2B3550" strokeWidth="2" />
        <circle cx="353" cy="222" r="5" fill={C.volt} />
        <rect x="340" y="238" width="26" height="16" rx="3" fill="#0A0E14" />
      </svg>

      {/* charge status card */}
      <div className="absolute left-5 right-5 bottom-5 sm:left-6 sm:right-6 sm:bottom-6 rounded-2xl p-4 backdrop-blur-md"
           style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-xs font-mono tracking-wide uppercase">Level 2 · 48A</span>
          <span className="text-white text-xs font-mono">{fill}%</span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <div className="h-full rounded-full transition-all duration-[1400ms] ease-out" style={{ width: `${fill}%`, backgroundColor: C.volt }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                  */
/* ------------------------------------------------------------------ */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { label: "Why Us", href: "#why-us" },
    { label: "Process", href: "#process" },
    { label: "Brands", href: "#brands" },
    { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <header
      className="sticky top-0 z-50 transition-shadow duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.0)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.line}` : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display font-semibold text-lg" style={{ color: C.ink }}>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: C.ink }}>
            <Zap size={16} color={C.volt} fill={C.volt} />
          </span>
          Current Charging
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium transition-colors" style={{ color: C.inkSoft }}
               onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
               onMouseLeave={(e) => (e.currentTarget.style.color = C.inkSoft)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <CTAButton href="#quote">Get My Free Quote</CTAButton>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4" style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.line}` }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium" style={{ color: C.inkSoft }}>
              {l.label}
            </a>
          ))}
          <CTAButton href="#quote" onClick={() => setOpen(false)}>Get My Free Quote</CTAButton>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal>
            <Eyebrow>No site visit. No sales call. Just 5 photos.</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display font-semibold leading-[1.05] mt-5 text-4xl sm:text-5xl lg:text-[3.4rem]" style={{ color: C.ink }}>
              Home EV charging,
              <br />
              done right.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 text-lg leading-relaxed max-w-md" style={{ color: C.inkSoft }}>
              Skip the pile of contractor calls. Send five photos of your home and get a firm quote from Michigan's EV charging specialists — no site visit required.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <CTAButton href="#quote" size="lg">
                Get My Free Quote <ArrowRight size={18} />
              </CTAButton>
              <span className="text-sm" style={{ color: C.inkSoft }}>No obligation · Firm quote from photos alone</span>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                { icon: HomeIcon, label: "No site visit needed" },
                { icon: ShieldCheck, label: "Licensed & insured" },
                { icon: BadgeCheck, label: "150+ chargers installed" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <t.icon size={18} color={C.volt} />
                  <span className="text-sm font-medium" style={{ color: C.ink }}>{t.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <ChargeIllustration />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why Current Charging                                                */
/* ------------------------------------------------------------------ */
function WhyUs() {
  const items = [
    { icon: Zap, title: "EV specialists, not generalists", body: "Electric vehicle charging is the only thing we do. No side jobs, no learning on your dime." },
    { icon: BadgeCheck, title: "150+ commercial chargers installed", body: "We've handled complex commercial sites across Michigan — a home install is second nature." },
    { icon: ShieldCheck, title: "Licensed electricians, every job", body: "Every install is performed and inspected by a licensed Michigan electrician." },
    { icon: Clock, title: "Fast scheduling", body: "Most homeowners get a site review within days, not weeks." },
    { icon: Wrench, title: "Truly turnkey", body: "From panel evaluation to final testing, we manage every step so you don't have to." },
    { icon: MapPin, title: "Michigan-based, statewide", body: "Local crews who know Michigan homes, panels, and permitting offices." },
  ];
  return (
    <section id="why-us" className="py-20 sm:py-28" style={{ backgroundColor: C.surface }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <Eyebrow>Why Current Charging</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            We're EV charging specialists. Not electricians who also do chargers.
          </h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 60}>
              <div className="h-full rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: C.voltSoft }}>
                  <it.icon size={20} color={C.voltDeep} />
                </div>
                <h3 className="font-display font-semibold text-lg" style={{ color: C.ink }}>{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: C.inkSoft }}>{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why not just hire an electrician — with a mini interactive gauge    */
/* (signature element: a panel-capacity dial that visualizes the exact */
/* judgment call a generalist electrician often gets wrong).           */
/* ------------------------------------------------------------------ */
function PanelGauge() {
  const [amps, setAmps] = useState(100);
  const pct = Math.min(100, Math.max(0, ((amps - 60) / (200 - 60)) * 100));
  const status = amps < 100 ? { label: "Likely needs an upgrade", color: C.amber } : amps < 150 ? { label: "May support a Level 2 charger", color: C.volt } : { label: "Comfortable headroom for EV charging", color: C.green };
  return (
    <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: C.ink }}>
      <div className="flex items-center gap-2 mb-1">
        <Gauge size={18} color={C.volt} />
        <span className="text-xs font-mono uppercase tracking-wide text-white/60">Panel capacity check</span>
      </div>
      <p className="text-white/80 text-sm mb-6">Drag to see how panel size affects whether an upgrade is needed — the exact judgment call generalist electricians get wrong most often.</p>
      <input
        type="range"
        min="60"
        max="200"
        step="5"
        value={amps}
        onChange={(e) => setAmps(Number(e.target.value))}
        className="w-full accent-blue-600"
        style={{ accentColor: C.volt }}
      />
      <div className="flex items-center justify-between mt-3">
        <span className="font-mono text-2xl font-semibold text-white">{amps}A</span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: status.color, color: C.ink }}>{status.label}</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden mt-4" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: status.color }} />
      </div>
    </div>
  );
}

function WhyNotElectrician() {
  const points = [
    "We evaluate load capacity for EV charging specifically, not as an afterthought.",
    "We know the quirks of every major charger brand — Tesla, Rivian, ChargePoint, and more.",
    "We manage permitting with municipalities that already know our work.",
    "We've done this 150+ times. A generalist electrician may do it once.",
  ];
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <Eyebrow>Why not just hire an electrician?</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            A general electrician can wire a charger. Getting it right is different.
          </h2>
          <p className="mt-4 text-base leading-relaxed max-w-lg" style={{ color: C.inkSoft }}>
            Home EV charging sits at the intersection of your electrical panel, your specific charger, and your specific vehicle. It's a narrow specialty — and specialists make fewer expensive mistakes.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <BadgeCheck size={18} color={C.volt} className="mt-0.5 shrink-0" />
                <span className="text-sm" style={{ color: C.ink }}>{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <PanelGauge />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */
function Process() {
  const steps = [
    { icon: FileCheck2, title: "Send five photos", body: "Snap your electrical panel, meter, water main, and charger location. No site visit needed." },
    { icon: ClipboardCheck, title: "We review remotely", body: "Our specialists assess your panel capacity and wire path from your photos and send a firm quote." },
    { icon: Wrench, title: "Professional installation", body: "Licensed electricians handle permitting, installation, inspection, and testing." },
  ];
  return (
    <section id="process" className="py-20 sm:py-28" style={{ backgroundColor: C.surface }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <Eyebrow>Our simple process</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            Three steps between you and a charged garage. No site visit required.
          </h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="rounded-2xl p-7 h-full relative" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                <span className="font-mono text-sm" style={{ color: C.volt }}>Step {i + 1}</span>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center my-4" style={{ backgroundColor: C.ink }}>
                  <s.icon size={20} color={C.volt} />
                </div>
                <h3 className="font-display font-semibold text-lg" style={{ color: C.ink }}>{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: C.inkSoft }}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={320} className="mt-12 flex justify-center">
          <CTAButton href="#quote" size="lg">Get My Free Quote <ArrowRight size={18} /></CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* What's Included                                                     */
/* ------------------------------------------------------------------ */
function WhatsIncluded() {
  const items = [
    { icon: FileCheck2, title: "Permit management" },
    { icon: ShieldCheck, title: "Licensed electrician" },
    { icon: ClipboardCheck, title: "Municipal inspection" },
    { icon: Wrench, title: "Professional installation" },
    { icon: BadgeCheck, title: "Final testing" },
    { icon: HomeIcon, title: "Setup assistance" },
    { icon: Zap, title: "Electrical upgrades, if needed" },
    { icon: PlugZap, title: "Charger selection help" },
  ];
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <Eyebrow>What's included</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            One turnkey install. Nothing left for you to coordinate.
          </h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 4) * 60}>
              <div className="rounded-2xl p-5 flex items-center gap-3" style={{ backgroundColor: C.surface }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                  <it.icon size={16} color={C.voltDeep} />
                </div>
                <span className="text-sm font-medium" style={{ color: C.ink }}>{it.title}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Brands                                                              */
/* ------------------------------------------------------------------ */
function Brands() {
  const brands = ["Tesla", "ChargePoint", "Emporia", "Wallbox", "Autel", "Enphase"];
  return (
    <section id="brands" className="py-20 sm:py-28" style={{ backgroundColor: C.surface }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <Eyebrow>Brands we install</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            Already have a charger picked out? We install it.
          </h2>
          <p className="mt-3 text-base" style={{ color: C.inkSoft }}>Tesla Wall Connector, Tesla Universal Wall Connector, and most other major brands.</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {brands.map((b, i) => (
            <Reveal key={b} delay={i * 50}>
              <div className="rounded-2xl py-8 flex items-center justify-center text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                <span className="font-display font-semibold text-lg" style={{ color: C.ink }}>{b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Savings Calculator                                                  */
/* ------------------------------------------------------------------ */
function SavingsCalculator() {
  const [miles, setMiles] = useState(1000);
  const gasCostPerMile = 0.14;
  const evCostPerMile = 0.045;
  const monthlySavings = Math.round(miles * (gasCostPerMile - evCostPerMile));
  const yearlySavings = monthlySavings * 12;
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <Eyebrow>Savings calculator</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            Home charging costs a fraction of gas.
          </h2>
          <p className="mt-4 text-base leading-relaxed max-w-md" style={{ color: C.inkSoft }}>
            Estimate your monthly savings from charging at home instead of fueling up, based on average Michigan electricity and gas prices.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-2xl p-7 sm:p-8" style={{ backgroundColor: C.surface, border: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={18} color={C.voltDeep} />
              <span className="text-sm font-semibold" style={{ color: C.ink }}>Monthly miles driven</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={miles}
              onChange={(e) => setMiles(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: C.volt }}
            />
            <div className="text-sm font-mono mt-1" style={{ color: C.inkSoft }}>{miles.toLocaleString()} miles / month</div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="rounded-xl p-4" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                <div className="text-xs font-mono uppercase tracking-wide" style={{ color: C.inkSoft }}>Monthly savings</div>
                <div className="font-display font-semibold text-2xl mt-1" style={{ color: C.green }}>${monthlySavings.toLocaleString()}</div>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                <div className="text-xs font-mono uppercase tracking-wide" style={{ color: C.inkSoft }}>Yearly savings</div>
                <div className="font-display font-semibold text-2xl mt-1" style={{ color: C.green }}>${yearlySavings.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-xs mt-4" style={{ color: C.inkSoft }}>Estimate only, based on avg. $3.30/gal gas at 24 mpg vs. $0.17/kWh residential electricity. Your results will vary.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rebates                                                              */
/* ------------------------------------------------------------------ */
function Rebates() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: C.surface }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <Eyebrow>Incentives</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            Federal and local incentives may lower your cost.
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: C.inkSoft }}>
            Depending on your utility and household, you may qualify for a federal tax credit on charger equipment and installation, plus utility-specific EV charging rate programs offered by Michigan providers like DTE Energy and Consumers Energy. Eligibility and amounts change often — we'll walk you through what applies to your situation during your quote.
          </p>
          <CTAButton href="#quote" className="mt-6">Check My Eligibility</CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Service Area                                                        */
/* ------------------------------------------------------------------ */
function ServiceArea() {
  const cities = ["Detroit", "Ann Arbor", "Grand Rapids", "Farmington Hills", "Troy", "Lansing", "Novi", "Rochester Hills"];
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <Eyebrow>Service area</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            Statewide coverage across Michigan.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {cities.map((c) => (
              <span key={c} className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: C.surface, color: C.ink, border: `1px solid ${C.line}` }}>{c}</span>
            ))}
          </div>
          <p className="mt-4 text-sm" style={{ color: C.inkSoft }}>Don't see your city? We likely still cover it — ask when you request your quote.</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center" style={{ backgroundColor: C.ink }}>
            <svg viewBox="0 0 300 300" className="w-3/4 h-3/4">
              <path d="M90 40 L200 30 L220 70 L210 120 L230 150 L200 190 L210 230 L170 260 L120 250 L90 210 L60 180 L70 120 L50 90 Z"
                    fill="none" stroke={C.volt} strokeWidth="2.5" opacity="0.85" />
              {[[140, 90], [160, 140], [110, 170], [180, 100], [130, 200]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill={C.volt}>
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                </circle>
              ))}
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews                                                              */
/* ------------------------------------------------------------------ */
function Reviews() {
  const reviews = [
    { name: "Sarah M.", vehicle: "Tesla Model Y · Ann Arbor", body: "Professional from the first call to the final inspection. They handled the permit and panel questions I didn't even know I had." },
    { name: "David K.", vehicle: "Ford Lightning · Troy", body: "Installed in a single morning. Clean work, no drywall mess, and the crew clearly does this every day." },
    { name: "Priya R.", vehicle: "Rivian R1S · Novi", body: "Knew our Wallbox better than we did. Explained the amperage tradeoffs clearly and got us set up fast." },
    { name: "Mike T.", vehicle: "Hyundai Ioniq 5 · Grand Rapids", body: "Compared quotes from two generalist electricians first — Current Charging was faster to schedule and more precise about our panel." },
  ];
  return (
    <section id="reviews" className="py-20 sm:py-28" style={{ backgroundColor: C.surface }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <Eyebrow>What homeowners say</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            Trusted by EV owners across Michigan.
          </h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 70}>
              <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={16} fill={C.amber} color={C.amber} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.ink }}>"{r.body}"</p>
                <div className="mt-4 text-sm font-semibold" style={{ color: C.ink }}>{r.name}</div>
                <div className="text-xs" style={{ color: C.inkSoft }}>{r.vehicle}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */
function FAQItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}`, backgroundColor: C.white }}>
      <button className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-base" style={{ color: C.ink }}>{q}</span>
        <ChevronDown size={18} className="transition-transform duration-300 shrink-0" style={{ color: C.volt, transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: C.inkSoft }}>{a}</p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    { q: "Do you need to visit my home before quoting?", a: "No. Send the five photos we ask for — your meter, your panel, your water main, your desired charger location, and the path between them — and our specialists can assess your panel capacity and wire run remotely. Most homeowners get a firm quote without ever scheduling a site visit." },
    { q: "How much does installation cost?", a: "Cost depends on your panel's existing capacity, the distance from your panel to the install location, and the charger you choose. Most installs range from a few hundred to a couple thousand dollars — you'll get an exact number after your free site review." },
    { q: "Do I need a permit?", a: "In most Michigan municipalities, yes. We handle the entire permit process for you, including scheduling the required inspection." },
    { q: "Can you install a charger I already purchased?", a: "Absolutely. We install Tesla, ChargePoint, Emporia, Wallbox, Autel, Enphase, and most other major brands, whether you bought it already or want our help choosing one." },
    { q: "Can you upgrade my electrical panel?", a: "Yes. If your panel doesn't have sufficient capacity, we'll walk you through upgrade options as part of your quote." },
    { q: "How long does installation take?", a: "Most straightforward installs are completed in half a day. Jobs requiring a panel upgrade or longer wire runs may take a full day." },
    { q: "What if my garage is detached?", a: "We regularly install chargers for detached garages and outdoor parking areas — this just means a slightly longer wire run, which we'll account for in your quote." },
  ];
  return (
    <section id="faq" className="py-20 sm:py-28" style={{ backgroundColor: C.white }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center mb-10">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            Questions homeowners ask us most.
          </h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 40}>
              <FAQItem q={f.q} a={f.a} defaultOpen={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                            */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: C.ink }}>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-white leading-tight">
            Michigan's EV charging specialists are ready when you are.
          </h2>
          <p className="mt-5 text-white/70 text-lg max-w-xl mx-auto">
            Get a free, no-obligation quote and find out exactly what your install will take.
          </p>
          <div className="mt-8">
            <CTAButton href="#quote" size="lg">Get My Free Quote <ArrowRight size={18} /></CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Quote Form                                                          */
/* ------------------------------------------------------------------ */
function FieldLabel({ children }) {
  return <label className="block text-sm font-semibold mb-1.5" style={{ color: C.ink }}>{children}</label>;
}

const inputStyle = {
  backgroundColor: C.surface,
  border: `1px solid ${C.line}`,
  color: C.ink,
};

const PHOTO_SPECS = [
  {
    key: "meter",
    label: "Electrical meter & service",
    instruction: "From outside, standing back at least 20 ft. Usually on the rear or side of the house.",
  },
  {
    key: "panel",
    label: "Circuit breaker panel",
    instruction: "Standing back at least 20 ft, inside the home. We want to see the ceiling and floor around it, not just the panel door.",
  },
  {
    key: "water",
    label: "Water main & meter",
    instruction: "Typically in the basement. On a well? Skip this one.",
    optional: true,
  },
  {
    key: "location",
    label: "Desired charger location",
    instruction: "Where on the wall you'd like the charger mounted.",
  },
  {
    key: "path",
    label: "Path from panel to charger",
    instruction: "One or more photos showing the route the wire would run.",
  },
];

function PhotoUploadField({ spec }) {
  const [fileName, setFileName] = useState(null);
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: C.surface, border: `1px solid ${C.line}` }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-sm font-semibold" style={{ color: C.ink }}>
            {spec.label}
            {spec.optional && <span className="ml-2 text-xs font-normal" style={{ color: C.inkSoft }}>(skip if on a well)</span>}
          </span>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: C.inkSoft }}>{spec.instruction}</p>
        </div>
      </div>
      <label className="mt-3 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm cursor-pointer w-fit"
             style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        <Upload size={15} color={C.voltDeep} />
        <span style={{ color: fileName ? C.ink : C.inkSoft }}>{fileName || "Upload photo"}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          required={!spec.optional}
          onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
        />
      </label>
    </div>
  );
}

function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const vehicles = ["Tesla", "Rivian", "Lucid", "Ford Lightning", "Mustang Mach-E", "Hyundai Ioniq 5", "Kia EV6", "Chevy Equinox EV", "Chevy Blazer EV", "Other"];
  const brands = ["Tesla Wall Connector", "Tesla Universal Wall Connector", "ChargePoint", "Emporia", "Wallbox", "Autel", "Enphase", "Not sure yet"];

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="quote" className="py-20 sm:py-28" style={{ backgroundColor: C.surface }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <Reveal className="text-center mb-10">
          <Eyebrow>Free quote · no site visit</Eyebrow>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mt-4" style={{ color: C.ink }}>
            Five photos. That's all we need.
          </h2>
          <p className="mt-3 text-base" style={{ color: C.inkSoft }}>No one needs to come out to your house to give you a firm quote. Send the photos below and we'll follow up within one business day.</p>
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: C.greenSoft }}>
                <BadgeCheck size={24} color={C.green} />
              </div>
              <h3 className="font-display font-semibold text-xl" style={{ color: C.ink }}>Request received.</h3>
              <p className="mt-2 text-sm" style={{ color: C.inkSoft }}>A Current Charging specialist will review your photos and follow up with a firm quote within one business day — no site visit needed.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={handleSubmit} className="rounded-2xl p-6 sm:p-8 space-y-5" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Full name</FieldLabel>
                  <input required type="text" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none" style={inputStyle} placeholder="Jane Doe" />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input required type="tel" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none" style={inputStyle} placeholder="(313) 555-0134" />
                </div>
              </div>

              <div>
                <FieldLabel>Email</FieldLabel>
                <input required type="email" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none" style={inputStyle} placeholder="jane@email.com" />
              </div>

              <div>
                <FieldLabel>Home address</FieldLabel>
                <input required type="text" className="w-full rounded-lg px-4 py-2.5 text-sm outline-none" style={inputStyle} placeholder="123 Main St, Farmington Hills, MI" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Vehicle</FieldLabel>
                  <select required className="w-full rounded-lg px-4 py-2.5 text-sm outline-none" style={inputStyle} defaultValue="">
                    <option value="" disabled>Select your vehicle</option>
                    {vehicles.map((v) => (<option key={v} value={v}>{v}</option>))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Charger brand</FieldLabel>
                  <select className="w-full rounded-lg px-4 py-2.5 text-sm outline-none" style={inputStyle} defaultValue="">
                    <option value="" disabled>Select a brand</option>
                    {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel>Photos we need — no site visit required</FieldLabel>
                <div className="space-y-3">
                  {PHOTO_SPECS.map((spec) => (
                    <PhotoUploadField key={spec.key} spec={spec} />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Anything else we should know?</FieldLabel>
                <textarea rows={3} className="w-full rounded-lg px-4 py-2.5 text-sm outline-none resize-none" style={inputStyle} placeholder="Garage is detached, panel is in the basement, etc." />
              </div>

              <button type="submit" className="w-full rounded-full font-semibold py-3.5 text-base transition-all duration-200 hover:-translate-y-0.5"
                      style={{ backgroundColor: C.volt, color: C.white, boxShadow: "0 8px 24px rgba(29,95,255,0.28)" }}>
                Get My Free Quote
              </button>
              <p className="text-xs text-center" style={{ color: C.inkSoft }}>By submitting, you agree to be contacted about your quote. No spam, ever.</p>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky mobile CTA                                                    */
/* ------------------------------------------------------------------ */
function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden p-3" style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.line}` }}>
      <CTAButton href="#quote" className="w-full">Get My Free Quote</CTAButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="py-12" style={{ backgroundColor: C.ink }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display font-semibold text-white">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <Zap size={16} color={C.volt} fill={C.volt} />
            </span>
            Current Charging
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/60">
            <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
            <a href="#process" className="hover:text-white transition-colors">Process</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#quote" className="hover:text-white transition-colors">Get a Quote</a>
          </div>
        </div>
        <div className="mt-8 pt-8 text-xs text-white/40" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          © {new Date().getFullYear()} Current Charging. Residential & commercial EV charger installation across Michigan. Licensed electricians. Tesla Wall Connector · Level 2 charger installation.
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function CurrentChargingLandingPage() {
  return (
    <div className="font-body" style={{ backgroundColor: C.white }}>
      <style>{fontImport}</style>
      <Nav />
      <Hero />
      <WhyUs />
      <Process />
      <WhatsIncluded />
      <Brands />
      <WhyNotElectrician />
      <SavingsCalculator />
      <Rebates />
      <ServiceArea />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <QuoteForm />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
