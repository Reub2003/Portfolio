// Convergence Map v3 — CDN Babel, no ES imports
const { useState, useEffect } = React;

const CM_PHASES = [
  { phase:1, label:"FOUNDATION",   sublabel:"Now → 5 yrs",  color:"#38bdf8" },
  { phase:2, label:"CONVERGENCE",  sublabel:"5–10 yrs",     color:"#a78bfa" },
  { phase:3, label:"EMERGENCE",    sublabel:"10–15 yrs",    color:"#f97316" },
  { phase:4, label:"EXPANSION",    sublabel:"15–25 yrs",    color:"#4ade80" },
  { phase:5, label:"CIVILISATION", sublabel:"25+ yrs",      color:"#fbbf24" },
];

// Phase bands: each node row sits 12 units below its header line
// Header y values: 2, 30, 58, 86, 114, 138 (terminal)
// Node y values:   14, 42, 70, 98, 122, 145
const CM_NODES = [
  // Phase 1 — y:14
  { id:"starship",  label:"Starship\nMatures",         icon:"🚀", x:18, y:14,  phase:1, color:"#38bdf8",
    summary:"Ground → LEO becomes routine",
    detail:"Starship reaches operational maturity within 5 years — fully reusable, high cadence, sub-$100/kg to LEO realistic. Its role in the mature architecture is permanent and narrow: atmosphere to LEO only. It never goes further. Everything beyond LEO is handled by vehicles that never touch the ground." },
  { id:"robotics",  label:"Advanced\nRobotics",        icon:"⬟", x:50, y:14,  phase:1, color:"#38bdf8",
    summary:"Labour automation begins in earnest",
    detail:"Humanoid and specialised robots reach genuine usefulness — reliable enough for repetitive physical labour with remote supervision. The key enabler isn't local intelligence: robots stream cognition from cloud inference in real time. Better hardware + better AI = step change. Labour economics start bending." },
  { id:"ai_models", label:"AI Model\nProgress",        icon:"◈", x:82, y:14,  phase:1, color:"#38bdf8",
    summary:"Rapid capability gains continue",
    detail:"AI capabilities compound — reasoning, planning, autonomous agents. Not AGI yet, but increasingly capable of complex engineering and scientific research assistance. The path to AGI runs through cheap compute, which runs through energy abundance, which runs through fusion." },

  // Phase 2 — y:42
  { id:"leo_infra",   label:"LEO\nInfrastructure",     icon:"◎", x:18, y:42,  phase:2, color:"#a78bfa",
    summary:"Orbit becomes industrial real estate",
    detail:"Cheap Starship launches make LEO viable for propellant depots, orbital assembly platforms, early data centres, and staging infrastructure. LEO transitions from a destination to a port — the edge of the gravity well. Without a place to assemble and refuel, there are no permanent space vehicles." },
  { id:"ai_robotics", label:"AI + Robotics\nSynergy",  icon:"⚙", x:50, y:42,  phase:2, color:"#a78bfa",
    summary:"Cloud brain meets capable body",
    detail:"Converging AI models with capable robot hardware creates a step change. Robots stream cognition from data centres — no onboard intelligence needed. AI gets embodied feedback: real-world physical data makes models smarter, which makes robots more capable. This enables orbital assembly: robots placed in space, operated from the ground with near-AGI reasoning." },
  { id:"fusion",      label:"Net Positive\nFusion",     icon:"⚛", x:82, y:42,  phase:2, color:"#a78bfa",
    summary:"~10 years, optimistic case",
    detail:"D-T fusion achieves net energy output at commercially meaningful scale. Not immediately grid-dominant — infrastructure takes years — but the energy price trajectory shifts immediately on announcement. AI-assisted plasma physics simulation is a key accelerant. Robots help too: fusion plants require precision construction that robotic systems handle well." },

  // Phase 3 — y:70
  { id:"energy",           label:"Energy\nAbundance",  icon:"∿", x:18, y:70,  phase:3, color:"#f97316",
    summary:"Electricity as near-free resource",
    detail:"Fusion at grid scale means electricity costs approach near-zero. Green hydrogen becomes trivially cheap. Compute runs without energy constraints. Energy-intensive manufacturing — carbon fibre, aluminium, advanced alloys — becomes affordable. Ion drives need substantial power; energy abundance is what makes Gen1 transport ships genuinely practical at scale." },
  { id:"agi",              label:"AGI\nAssumed",        icon:"◈", x:50, y:70,  phase:3, color:"#f97316",
    summary:"Compute abundance tips the scale",
    detail:"Energy abundance removes the compute ceiling. Training runs that cost $100M become $1M. Inference is near-free. Combined with continued architectural progress, AGI becomes a working assumption — open-ended scientific research, autonomous engineering, generalised problem-solving. AGI-assisted plasma physics directly accelerates fusion drive development." },
  { id:"orbital_assembly", label:"Orbital\nAssembly",  icon:"🔧", x:82, y:70,  phase:3, color:"#f97316",
    summary:"Robots build ships in orbit",
    detail:"AI-operated robots plus cheap Starship cargo runs enables orbital shipyards. Structures too large to launch assembled — transport hulls, hab modules, power arrays — are built in LEO by robotic crews supervised from the ground. No human EVA required for routine construction. You cannot launch a solar-system-scale ship from Earth's surface." },

  // Phase 4 — y:98
  { id:"gen1_transport", label:"Gen 1 Transport\n(Ion Drive)",    icon:"◉", x:25, y:98,  phase:4, color:"#4ade80",
    summary:"Orbit-permanent, inner solar system viable",
    detail:"The first generation of permanent in-space transport ships. Ion drives are well-understood existing technology — the unlock is assembling them at scale in orbit and powering them from abundant energy. Specific impulse ~3,000–5,000 seconds. Mars transit: 4–6 months. Asteroid belt reachable. These ships never enter an atmosphere. They prove the two-tier architecture works." },
  { id:"fusion_drive",   label:"Fusion Drive\nDeveloped",          icon:"⚡", x:75, y:98,  phase:4, color:"#4ade80",
    summary:"Aneutronic propulsion cracked",
    detail:"D-T fusion can't propel ships well — ~80% of energy exits as neutrons, undirectable as exhaust. Aneutronic fuels like D-He3 produce charged particles that can be magnetically directed as thrust: 10,000–20,000+ seconds Isp vs ion drives at ~3,000s and chemical at ~380s. AGI-accelerated plasma physics makes this timeline plausible. Direct Fusion Drive also outputs electricity simultaneously." },

  // Phase 5 — y:128
  { id:"gen2_transport", label:"Gen 2 Transport\n(Fusion Drive)",  icon:"◉", x:50, y:128, phase:5, color:"#fbbf24",
    summary:"Full solar system, weeks not months",
    detail:"Gen2 ships replace ion drives with fusion propulsion — same hull architecture, upgraded powerplant. The Isp jump from ~3,000s to 10,000–20,000s is transformative: Mars in weeks instead of months. Outer planets move from 'technically possible' to 'operationally routine'. Crewed Jupiter missions become conceivable. Saturn reachable and returnable within a career." },

  // Terminal — y:152
  { id:"solar_system",   label:"Solar System\nAccessible",         icon:"🌌", x:50, y:152, phase:5, color:"#fb923c",
    summary:"Civilisational expansion",
    detail:"The terminal convergence. Gen1 opens the inner solar system — Mars colonisation, asteroid belt resource extraction, permanent Lagrange point infrastructure. Gen2 opens everything: outer planets, their moons, the Kuiper belt. Physical scarcity of resources collapses — the solar system contains more of every element than humanity could consume in millennia." },
];

const CM_CONNECTIONS = [
  { from:"starship",         to:"leo_infra" },
  { from:"robotics",         to:"ai_robotics" },
  { from:"ai_models",        to:"ai_robotics" },
  { from:"ai_models",        to:"fusion" },
  { from:"robotics",         to:"fusion" },
  { from:"leo_infra",        to:"orbital_assembly" },
  { from:"ai_robotics",      to:"orbital_assembly" },
  { from:"ai_robotics",      to:"agi" },
  { from:"fusion",           to:"energy" },
  { from:"energy",           to:"agi" },
  { from:"energy",           to:"gen1_transport" },
  { from:"agi",              to:"gen1_transport" },
  { from:"agi",              to:"fusion_drive" },
  { from:"orbital_assembly", to:"gen1_transport" },
  { from:"fusion",           to:"fusion_drive" },
  { from:"energy",           to:"fusion_drive" },
  { from:"gen1_transport",   to:"gen2_transport" },
  { from:"fusion_drive",     to:"gen2_transport" },
  { from:"starship",         to:"gen1_transport" },
  { from:"starship",         to:"gen2_transport" },
  { from:"gen1_transport",   to:"solar_system" },
  { from:"gen2_transport",   to:"solar_system" },
];

const CM_OFFSETS = {
  "starship-leo_infra":              0,
  "robotics-ai_robotics":            0,
  "ai_models-ai_robotics":           0,
  "ai_models-fusion":                8,
  "robotics-fusion":                 8,
  "leo_infra-orbital_assembly":     -7,
  "ai_robotics-orbital_assembly":    7,
  "ai_robotics-agi":                 0,
  "fusion-energy":                  -8,
  "energy-agi":                      0,
  "energy-gen1_transport":          -6,
  "agi-gen1_transport":              0,
  "agi-fusion_drive":                0,
  "orbital_assembly-gen1_transport": 7,
  "fusion-fusion_drive":             0,
  "energy-fusion_drive":             8,
  "gen1_transport-gen2_transport":  -6,
  "fusion_drive-gen2_transport":     6,
  "starship-gen1_transport":        -14,
  "starship-gen2_transport":        -18,
  "gen1_transport-solar_system":    -8,
  "gen2_transport-solar_system":     0,
};

// Phase header bands: line + label rendered above each node row
const CM_BANDS = [
  { phase:1, y:3   },
  { phase:2, y:31  },
  { phase:3, y:59  },
  { phase:4, y:87  },
  { phase:5, y:116 },
  { phase:6, y:141, label:"TERMINAL NODE", sublabel:"civilisational outcome", color:"#fb923c" },
];

function ConvergenceMap() {
  const [selected, setSelected] = useState(null);
  const [hovered,  setHovered]  = useState(null);
  const [visible,  setVisible]  = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const focus = selected || hovered;
  const getNode = id => CM_NODES.find(n => n.id === id);
  const sel = selected ? getNode(selected) : null;
  const phaseInfo = p => CM_PHASES.find(ph => ph.phase === p);

  const nodelit = id => {
    if (!focus) return true;
    if (id === focus) return true;
    return CM_CONNECTIONS.some(c =>
      (c.from === focus && c.to === id) || (c.to === focus && c.from === id)
    );
  };
  const connlit = c => !!focus && (c.from === focus || c.to === focus);

  return (
    <div style={{ display:"flex", position:"relative", background:"#04080f", maxWidth:960, margin:"0 auto" }}>
      <style>{`
        @keyframes cm3-dashflow { to { stroke-dashoffset:-20; } }
        @keyframes cm3-ripple { 0%,100%{opacity:.45} 50%{opacity:0} }
        @keyframes cm3-fadeup { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .cm3-node { cursor:pointer; transition:opacity .25s ease; }
        .cm3-panel-in { animation: cm3-fadeup .35s cubic-bezier(.4,0,.2,1) forwards; }
        .cm3-chip {
          border-radius:3px; padding:3px 8px; font-size:10px; cursor:pointer;
          transition:opacity .15s; display:inline-flex; align-items:center; gap:4px;
        }
        .cm3-chip:hover { opacity:.7; }
        .cm3-grid {
          position:absolute; inset:0; pointer-events:none;
          background-image: linear-gradient(rgba(56,189,248,.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(56,189,248,.025) 1px,transparent 1px);
          background-size:48px 48px;
        }
        .cm3-close {
          background:transparent; border:1px solid #1e293b; color:#475569;
          border-radius:3px; padding:7px; cursor:pointer; font-size:9px;
          letter-spacing:.12em; font-family:'JetBrains Mono',monospace;
          transition:all .2s; width:100%;
        }
        .cm3-close:hover { border-color:#475569; color:#94a3b8; }
      `}</style>

      <div className="cm3-grid" />

      {/* SVG graph */}
      <div style={{ flex:1, position:"relative", zIndex:1 }}>
        <svg
          viewBox="0 0 100 168"
          style={{ width:"100%", display:"block" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="cm3-a0" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
              <path d="M0,0L0,5L5,2.5z" fill="#94a3b815"/>
            </marker>
            <marker id="cm3-a1" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
              <path d="M0,0L0,5L5,2.5z" fill="#94a3b8cc"/>
            </marker>
            {CM_NODES.map(n => (
              <radialGradient key={n.id} id={`cm3-rg-${n.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={n.color} stopOpacity=".22"/>
                <stop offset="100%" stopColor={n.color} stopOpacity="0"/>
              </radialGradient>
            ))}
          </defs>

          {/* Phase band headers */}
          {CM_BANDS.map((b, i) => {
            const ph = b.phase <= 5 ? phaseInfo(b.phase) : { label: b.label, sublabel: b.sublabel, color: b.color };
            const phNum = b.phase <= 5 ? b.phase : null;
            return (
              <g key={i}>
                <line x1="2" y1={b.y + 1.8} x2="98" y2={b.y + 1.8}
                  stroke={ph.color} strokeWidth=".12" opacity=".25"/>
                <text x="2" y={b.y + .8} fontSize="1.55" fill={ph.color}
                  fontFamily="monospace" letterSpacing=".14em" opacity=".7">
                  {phNum ? `PHASE ${phNum} · ` : ""}{ph.label}
                  <tspan fill={ph.color} opacity=".45"> · {ph.sublabel}</tspan>
                </text>
              </g>
            );
          })}

          {/* Connections */}
          {CM_CONNECTIONS.map((c, i) => {
            const f = getNode(c.from), t = getNode(c.to);
            const lit = connlit(c);
            const off = CM_OFFSETS[`${c.from}-${c.to}`] || 0;
            const mx = (f.x + t.x) / 2 + off;
            const my = (f.y + t.y) / 2;
            return (
              <path key={i}
                d={`M${f.x},${f.y} Q${mx},${my} ${t.x},${t.y}`}
                fill="none"
                stroke={lit ? "#94a3b8" : "#94a3b80e"}
                strokeWidth={lit ? .42 : .18}
                strokeDasharray={lit ? "2.5 1.2" : "none"}
                markerEnd={lit ? "url(#cm3-a1)" : "url(#cm3-a0)"}
                style={lit ? { animation:"cm3-dashflow 2s linear infinite" } : {}}
                opacity={visible ? 1 : 0}
              />
            );
          })}

          {/* Nodes */}
          {CM_NODES.map((n, i) => {
            const lit = nodelit(n.id);
            const isSel = selected === n.id;
            const isGen = n.id === "gen1_transport" || n.id === "gen2_transport";
            const ph = phaseInfo(n.phase);
            const r    = isGen ? 7.2 : 6;
            const ring = isGen ? 9   : 7.8;
            const glow = isGen ? 13  : 11;
            return (
              <g key={n.id} className="cm3-node"
                transform={`translate(${n.x},${n.y})`}
                style={{ opacity: visible ? (lit ? 1 : .15) : 0, transition:`opacity .3s ease ${i*.04}s` }}
                onClick={() => setSelected(selected === n.id ? null : n.id)}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle r={glow} fill={`url(#cm3-rg-${n.id})`}/>
                {isSel && (
                  <circle r={glow + 10} fill="none" stroke={n.color} strokeWidth=".28"
                    style={{ animation:"cm3-ripple 2.2s ease-out infinite" }}/>
                )}
                <circle r={ring} fill="none" stroke={ph.color}
                  strokeWidth={isSel ? .85 : .38}
                  strokeDasharray={isSel ? "none" : "2.5 1.5"}
                  opacity={.5}/>
                <circle r={r}
                  fill={isSel ? n.color+"22" : "#060c17"}
                  stroke={n.color}
                  strokeWidth={isSel ? .85 : .52}
                  style={{ filter: isSel ? `drop-shadow(0 0 6px ${n.color}88)` : "none", transition:"all .25s" }}/>
                <text textAnchor="middle" dominantBaseline="central"
                  fontSize={n.icon.length > 2 ? "3.2" : "4.2"} y=".2" fill={n.color}>
                  {n.icon}
                </text>
                {n.label.split("\n").map((l, li) => (
                  <text key={li} textAnchor="middle"
                    y={(ring + 2.5) + li * 2.75}
                    fontSize="1.75" fill={lit ? "#cbd5e1" : "#334155"}
                    fontFamily="monospace" style={{ userSelect:"none" }}>
                    {l}
                  </text>
                ))}
                <circle cx={ring - 1.5} cy={-(ring - 1.5)}
                  r="1.25" fill={ph.color} stroke="#04080f" strokeWidth=".45"/>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <div style={{
        width: sel ? 308 : 0, flexShrink:0, overflow:"hidden",
        transition:"width .4s cubic-bezier(.4,0,.2,1)", position:"relative", zIndex:2,
      }}>
        {sel && (
          <div className="cm3-panel-in" style={{
            width:308, overflowY:"auto",
            background:"linear-gradient(180deg,#080f1a,#050b14)",
            borderLeft:`1px solid ${sel.color}28`,
            padding:"20px 16px", display:"flex", flexDirection:"column", gap:13,
            fontFamily:"'JetBrains Mono',monospace",
          }}>
            {/* Title */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
                <div style={{
                  width:38, height:38, borderRadius:"50%",
                  background:sel.color+"15", border:`1px solid ${sel.color}45`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:17, flexShrink:0,
                }}>{sel.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:"#fff", lineHeight:1.25 }}>
                    {sel.label.replace("\n"," ")}
                  </div>
                  <div style={{ fontSize:9, color:sel.color, marginTop:2, letterSpacing:".1em" }}>
                    {sel.summary}
                  </div>
                </div>
              </div>
              <div style={{ height:1, background:`linear-gradient(90deg,${sel.color}48,transparent)` }}/>
            </div>

            {/* Phase badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:6,
              background:phaseInfo(sel.phase).color+"10",
              border:`1px solid ${phaseInfo(sel.phase).color}28`,
              borderRadius:3, padding:"3px 10px", width:"fit-content",
              fontSize:9, letterSpacing:".12em", color:phaseInfo(sel.phase).color,
            }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:phaseInfo(sel.phase).color }}/>
              PHASE {sel.phase} · {phaseInfo(sel.phase).label} · {phaseInfo(sel.phase).sublabel}
            </div>

            {/* Gen comparison */}
            {(sel.id === "gen1_transport" || sel.id === "gen2_transport") && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { id:"gen1_transport", label:"GEN 1", isp:"~3–5k s",    mars:"4–6 months", outer:"limited", drive:"Ion",    color:"#4ade80" },
                  { id:"gen2_transport", label:"GEN 2", isp:"~10–20k s",  mars:"weeks",       outer:"routine", drive:"Fusion", color:"#fbbf24" },
                ].map(g => (
                  <div key={g.id} style={{
                    background: sel.id===g.id ? g.color+"15" : "#0a141e",
                    border:`1px solid ${g.color}${sel.id===g.id?"50":"20"}`,
                    borderRadius:4, padding:"9px 10px",
                  }}>
                    <div style={{ fontSize:9, color:g.color, letterSpacing:".12em", marginBottom:6 }}>
                      {g.label} · {g.drive}
                    </div>
                    <div style={{ fontSize:9.5, color:"#94a3b8", lineHeight:1.7 }}>
                      <div>Isp <span style={{ color:"#e2e8f0" }}>{g.isp}</span></div>
                      <div>Mars <span style={{ color:"#e2e8f0" }}>{g.mars}</span></div>
                      <div>Outer <span style={{ color:"#e2e8f0" }}>{g.outer}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p style={{ fontSize:11, lineHeight:1.78, color:"#94a3b8", margin:0 }}>{sel.detail}</p>

            {CM_CONNECTIONS.filter(c => c.from === sel.id).length > 0 && (
              <div>
                <div style={{ fontSize:9, color:"#475569", letterSpacing:".13em", marginBottom:6 }}>ENABLES →</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {CM_CONNECTIONS.filter(c => c.from === sel.id).map(c => {
                    const t = getNode(c.to);
                    return t ? (
                      <div key={c.to} className="cm3-chip" onClick={() => setSelected(c.to)}
                        style={{ background:t.color+"10", border:`1px solid ${t.color}30`, color:t.color }}>
                        {t.icon} {t.label.replace("\n"," ")}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {CM_CONNECTIONS.filter(c => c.to === sel.id).length > 0 && (
              <div>
                <div style={{ fontSize:9, color:"#475569", letterSpacing:".13em", marginBottom:6 }}>← REQUIRES</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {CM_CONNECTIONS.filter(c => c.to === sel.id).map(c => {
                    const s = getNode(c.from);
                    return s ? (
                      <div key={c.from} className="cm3-chip" onClick={() => setSelected(c.from)}
                        style={{ background:s.color+"0a", border:`1px solid ${s.color}22`, color:s.color+"aa" }}>
                        {s.icon} {s.label.replace("\n"," ")}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {sel.id === "solar_system" && (
              <div style={{
                padding:"10px", borderRadius:3,
                background:"#fb923c08", border:"1px solid #fb923c28",
                fontSize:9.5, color:"#fb923c", lineHeight:1.65,
              }}>
                ◉ TERMINAL NODE — two parallel paths converge here. Gen1 opens the inner solar system. Gen2 opens everything.
              </div>
            )}

            <button className="cm3-close" onClick={() => setSelected(null)}>
              CLOSE PANEL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
