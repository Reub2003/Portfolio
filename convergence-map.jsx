// Convergence Map — loaded via Babel CDN, no ES imports
const { useState, useEffect, useRef } = React;

const CM_NODES = [
  {
    id: "fusion", label: "Net Positive\nFusion", x: 50, y: 12,
    color: "#f97316", icon: "⚛", summary: "Achieved in ~5 years",
    detail: "D-T fusion on the ground cracks net energy output. Not immediately revolutionary — grid infrastructure takes time — but energy prices begin falling in anticipation. The key unlock is cheap, abundant electricity at civilisational scale.",
    outputs: ["compute", "hydrogen", "manufacturing"], phase: 1
  },
  {
    id: "compute", label: "Compute\nAbundance", x: 78, y: 28,
    color: "#06b6d4", icon: "⬡", summary: "Energy → cheap processing",
    detail: "Data centres currently constrained by electricity cost. Fusion removes that ceiling. Training runs that cost $100M become $1M. Inference becomes essentially free. This is the fastest feedback loop in the entire system.",
    outputs: ["agi", "robotics"], phase: 1
  },
  {
    id: "hydrogen", label: "Cheap\nHydrogen", x: 22, y: 28,
    color: "#a3e635", icon: "H₂", summary: "Electrolysis scales massively",
    detail: "Fusion electricity makes green hydrogen economically trivial via electrolysis. Hydrogen is a key rocket propellant — Starship's Raptor engines can run on it. Launch costs see indirect but real reductions.",
    outputs: ["launch"], phase: 1
  },
  {
    id: "manufacturing", label: "Cheap\nManufacturing", x: 50, y: 30,
    color: "#a78bfa", icon: "⚙", summary: "Energy-intensive production scales",
    detail: "Steel, aluminium, carbon fibre — all energy intensive. Fusion makes advanced materials cheaper, which feeds directly into rocket and spacecraft manufacturing. Combined with robotic assembly lines, unit costs crater.",
    outputs: ["launch", "robotics"], phase: 1
  },
  {
    id: "agi", label: "AGI\n(Assumed)", x: 78, y: 52,
    color: "#f43f5e", icon: "◈", summary: "10–15 years post-fusion",
    detail: "Compute abundance + sustained AI research = AGI becoming a working assumption. Cloud-based cognition means physical systems don't need local intelligence. The 'brain' lives in a fusion-powered datacentre. Alignment and safety become existential priorities at this point.",
    outputs: ["robotics", "plasma_physics"], phase: 2
  },
  {
    id: "robotics", label: "Humanoid\nRobotics", x: 50, y: 52,
    color: "#06b6d4", icon: "⬟", summary: "Dexterous + cloud-brained",
    detail: "Humanoid robots become genuinely useful not because they're locally smart, but because AGI cognition is streamed to them over the cloud. They just need to be reliable and dexterous. Labour economics bend — then break. Robots can build and maintain fusion plants, accelerating the whole loop.",
    outputs: ["manufacturing", "fusion_drive_build"], phase: 2
  },
  {
    id: "plasma_physics", label: "AI-Accelerated\nPlasma Physics", x: 78, y: 72,
    color: "#f97316", icon: "∿", summary: "The second mountain",
    detail: "D-T fusion ≠ fusion drives. Fusion propulsion requires aneutronic fuels (D-He3, p-B11) that produce charged particles instead of neutrons, enabling magnetic thrust. AGI-assisted plasma physics research is the path to cracking this — potentially compressing decades of research into years.",
    outputs: ["fusion_drive"], phase: 2
  },
  {
    id: "launch", label: "Starship\n→ LEO", x: 22, y: 52,
    color: "#a3e635", icon: "🚀", summary: "The gravity well solved",
    detail: "Starship solves the problem fusion can't touch: getting off the ground. Chemical rockets need high thrust-to-weight to fight gravity — fusion drives produce 5–20N, useless at launch. But Starship to LEO at $100/kg changes everything. You only need to solve gravity once per mission.",
    outputs: ["architecture"], phase: 2
  },
  {
    id: "fusion_drive", label: "Fusion\nDrive", x: 78, y: 88,
    color: "#f43f5e", icon: "⚡", summary: "10,000+ seconds Isp",
    detail: "Direct Fusion Drive: field-reversed configuration, 5–20N thrust, 10,000+ seconds Isp. Compare to Starship's ~380s. In microgravity with no drag, low thrust + continuous burn = enormous delta-v. Burns for weeks instead of minutes. Mars transit drops from 9 months to ~90 days conservatively.",
    outputs: ["architecture"], phase: 3
  },
  {
    id: "fusion_drive_build", label: "Robotic\nAssembly", x: 50, y: 72,
    color: "#a78bfa", icon: "🔧", summary: "Robots build the drive in orbit",
    detail: "Fusion transfer vehicles are too large to launch assembled. Robotic construction in LEO — enabled by AGI cognition and cheap Starship cargo runs — makes orbital shipyards viable. No human has to do a spacewalk to bolt a fusion drive together.",
    outputs: ["architecture"], phase: 3
  },
  {
    id: "architecture", label: "Starship + Fusion\nArchitecture", x: 36, y: 72,
    color: "#06b6d4", icon: "◎", summary: "The two-stage solar system",
    detail: "Starship lifts to LEO. Orbital depot awaits. Fusion transfer vehicle — permanently space-based, never touching atmosphere — takes cargo and crew anywhere in the solar system. The fusion stage is reused indefinitely. This is the architecture NASA and DARPA have been quietly converging on.",
    outputs: ["solar_system"], phase: 3
  },
  {
    id: "solar_system", label: "Solar System\nAccessible", x: 50, y: 90,
    color: "#f97316", icon: "◉", summary: "The civilisational outcome",
    detail: "Mars in weeks. Jupiter crewed missions conceivable. Saturn reachable and returnable. The outer solar system stops being a generational voyage and becomes a commutable distance. In-space manufacturing, asteroid mining, and permanent off-world presence become engineering questions rather than physics impossibilities.",
    outputs: [], phase: 3
  }
];

const CM_CONNECTIONS = [
  { from: "fusion", to: "compute" },
  { from: "fusion", to: "hydrogen" },
  { from: "fusion", to: "manufacturing" },
  { from: "compute", to: "agi" },
  { from: "compute", to: "robotics" },
  { from: "agi", to: "robotics" },
  { from: "agi", to: "plasma_physics" },
  { from: "robotics", to: "manufacturing" },
  { from: "robotics", to: "fusion_drive_build" },
  { from: "manufacturing", to: "launch" },
  { from: "hydrogen", to: "launch" },
  { from: "plasma_physics", to: "fusion_drive" },
  { from: "launch", to: "architecture" },
  { from: "fusion_drive", to: "architecture" },
  { from: "fusion_drive_build", to: "architecture" },
  { from: "architecture", to: "solar_system" },
  { from: "robotics", to: "architecture" },
];

const CM_PHASES = [
  { phase: 1, label: "IGNITION", sub: "Years 1–5", color: "#f97316" },
  { phase: 2, label: "ACCELERATION", sub: "Years 5–15", color: "#06b6d4" },
  { phase: 3, label: "EXPANSION", sub: "Years 15+", color: "#a78bfa" },
];

// Deterministic curve offsets — no Math.random() in render
const CM_CURVE_OFFSETS = CM_CONNECTIONS.map((_, i) =>
  ((i % 2 === 0 ? 1 : -1) * (3 + (i * 4.3) % 8)).toFixed(1)
);

function ConvergenceMap() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => { setTimeout(() => setAnimated(true), 80); }, []);

  const getNode = (id) => CM_NODES.find(n => n.id === id);
  const selectedNode = selected ? getNode(selected) : null;

  const isHighlighted = (nodeId) => {
    if (!selected && !hovered) return true;
    const focus = selected || hovered;
    if (nodeId === focus) return true;
    return CM_CONNECTIONS.some(c =>
      (c.from === focus && c.to === nodeId) || (c.to === focus && c.from === nodeId)
    );
  };

  const isConnHighlighted = (conn) => {
    if (!selected && !hovered) return true;
    const focus = selected || hovered;
    return conn.from === focus || conn.to === focus;
  };

  const phaseColor = (phase) => CM_PHASES.find(p => p.phase === phase)?.color;

  return (
    <div style={{ display: "flex", gap: 0, position: "relative", background: "#050a10", minHeight: 540 }}>
      <style>{`
        @keyframes cm-pulse { 0%{r:18;opacity:.8} 100%{r:32;opacity:0} }
        @keyframes cm-flow { 0%{stroke-dashoffset:100} 100%{stroke-dashoffset:0} }
        @keyframes cm-fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .cm-pulse { animation: cm-pulse 2s ease-out infinite; }
        .cm-flow { animation: cm-flow 3s linear infinite; }
        .cm-fade-up { animation: cm-fade-up 0.35s ease forwards; }
        .cm-node { cursor: pointer; transition: opacity 0.3s ease; }
        .cm-node circle { transition: filter 0.2s; }
        .cm-tag {
          background: rgba(6,182,212,0.1);
          border: 1px solid rgba(6,182,212,0.3);
          border-radius: 3px; padding: 3px 8px;
          font-size: 10px; cursor: pointer;
          transition: background 0.2s;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.06em;
        }
        .cm-tag:hover { background: rgba(6,182,212,0.2); }
        .cm-close {
          background: transparent; border: 1px solid #1e293b;
          color: #475569; border-radius: 3px; padding: 8px;
          cursor: pointer; font-size: 10px; letter-spacing: 0.1em;
          font-family: 'JetBrains Mono', monospace; width: 100%;
          transition: border-color 0.2s, color 0.2s;
        }
        .cm-close:hover { border-color: #475569; color: #94a3b8; }
        .cm-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="cm-grid-bg" />

      {/* SVG graph */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <svg
          viewBox="0 0 100 105"
          style={{ width: "100%", maxHeight: 620, display: "block" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="cm-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#06b6d430" />
            </marker>
            <marker id="cm-arrow-hi" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#06b6d4" />
            </marker>
            {CM_NODES.map(n => (
              <radialGradient key={n.id} id={`cm-glow-${n.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={n.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          {/* Connections */}
          {CM_CONNECTIONS.map((conn, i) => {
            const from = getNode(conn.from);
            const to = getNode(conn.to);
            const hi = isConnHighlighted(conn);
            const mx = (from.x + to.x) / 2 + parseFloat(CM_CURVE_OFFSETS[i]);
            const my = (from.y + to.y) / 2;
            return (
              <path key={i}
                d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`}
                fill="none"
                stroke={hi ? "#06b6d4" : "#06b6d415"}
                strokeWidth={hi ? 0.4 : 0.2}
                strokeDasharray={hi ? "2 1" : "none"}
                markerEnd={hi ? "url(#cm-arrow-hi)" : "url(#cm-arrow)"}
                className={hi ? "cm-flow" : ""}
                style={{ opacity: animated ? 1 : 0, transition: "opacity 0.4s, stroke 0.3s" }}
              />
            );
          })}

          {/* Nodes */}
          {CM_NODES.map((node, i) => {
            const hi = isHighlighted(node.id);
            const isSel = selected === node.id;
            const pc = phaseColor(node.phase);
            return (
              <g key={node.id}
                className="cm-node"
                transform={`translate(${node.x},${node.y})`}
                onClick={() => setSelected(selected === node.id ? null : node.id)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ opacity: animated ? (hi ? 1 : 0.2) : 0, transition: `opacity 0.3s ease ${i * 0.04}s` }}
              >
                <circle r="10" fill={`url(#cm-glow-${node.id})`} />
                {isSel && <circle r="18" fill="none" stroke={node.color} strokeWidth="0.3" opacity="0" className="cm-pulse" />}
                <circle r="7.5" fill="none" stroke={pc} strokeWidth={isSel ? 0.8 : 0.4}
                  strokeDasharray={isSel ? "none" : "3 1"} opacity={0.6} />
                <circle r="6"
                  fill={isSel ? node.color + "30" : "#0a1520"}
                  stroke={node.color}
                  strokeWidth={isSel ? 0.8 : 0.5}
                  style={{ filter: isSel ? `drop-shadow(0 0 4px ${node.color})` : "none" }}
                />
                <text textAnchor="middle" dominantBaseline="central" fontSize="4" fill={node.color} y="0.2">
                  {node.icon}
                </text>
                {node.label.split('\n').map((line, li) => (
                  <text key={li} textAnchor="middle" y={10 + li * 2.8} fontSize="1.8"
                    fill={hi ? "#cbd5e1" : "#475569"}
                    style={{ userSelect: "none", fontFamily: "monospace" }}>
                    {line}
                  </text>
                ))}
                <circle cx="5.5" cy="-5.5" r="1.2" fill={pc} stroke="#050a10" strokeWidth="0.4" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      <div style={{
        width: selectedNode ? 300 : 0,
        overflow: "hidden",
        transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        position: "relative",
        zIndex: 2,
      }}>
        {selectedNode && (
          <div className="cm-fade-up" style={{
            width: 300,
            background: "linear-gradient(180deg,#0a141e,#060d14)",
            borderLeft: `1px solid ${selectedNode.color}40`,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minHeight: "100%",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: selectedNode.color + "20",
                border: `1px solid ${selectedNode.color}60`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0
              }}>{selectedNode.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", lineHeight: 1.2 }}>
                  {selectedNode.label.replace('\n', ' ')}
                </div>
                <div style={{ fontSize: 9, color: selectedNode.color, marginTop: 2, letterSpacing: "0.1em" }}>
                  {selectedNode.summary}
                </div>
              </div>
            </div>
            <div style={{ height: 1, background: `linear-gradient(90deg,${selectedNode.color}60,transparent)` }} />

            {/* Phase badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: phaseColor(selectedNode.phase) + "15",
              border: `1px solid ${phaseColor(selectedNode.phase)}40`,
              borderRadius: 3, padding: "3px 8px", width: "fit-content"
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: phaseColor(selectedNode.phase) }} />
              <span style={{ fontSize: 9, letterSpacing: "0.12em", color: phaseColor(selectedNode.phase) }}>
                PHASE {selectedNode.phase} · {CM_PHASES.find(p => p.phase === selectedNode.phase)?.sub}
              </span>
            </div>

            {/* Detail */}
            <p style={{ fontSize: 11, lineHeight: 1.7, color: "#94a3b8", margin: 0 }}>
              {selectedNode.detail}
            </p>

            {/* Enables */}
            <div>
              <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.15em", marginBottom: 6 }}>ENABLES →</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {CM_CONNECTIONS.filter(c => c.from === selectedNode.id).map(c => {
                  const t = getNode(c.to);
                  return t ? (
                    <div key={c.to} className="cm-tag"
                      onClick={() => setSelected(c.to)}
                      style={{ color: t.color, borderColor: t.color + "40", background: t.color + "15" }}>
                      {t.icon} {t.label.replace('\n', ' ')}
                    </div>
                  ) : null;
                })}
                {CM_CONNECTIONS.filter(c => c.from === selectedNode.id).length === 0 && (
                  <span style={{ fontSize: 10, color: "#334155", fontStyle: "italic" }}>Terminal — civilisational outcome</span>
                )}
              </div>
            </div>

            {/* Requires */}
            <div>
              <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.15em", marginBottom: 6 }}>← REQUIRES</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {CM_CONNECTIONS.filter(c => c.to === selectedNode.id).map(c => {
                  const s = getNode(c.from);
                  return s ? (
                    <div key={c.from} className="cm-tag"
                      onClick={() => setSelected(c.from)}
                      style={{ color: s.color + "cc", borderColor: s.color + "30", background: s.color + "10" }}>
                      {s.icon} {s.label.replace('\n', ' ')}
                    </div>
                  ) : null;
                })}
                {CM_CONNECTIONS.filter(c => c.to === selectedNode.id).length === 0 && (
                  <span style={{ fontSize: 10, color: "#334155", fontStyle: "italic" }}>Root — no prerequisites</span>
                )}
              </div>
            </div>

            <button className="cm-close" style={{ marginTop: "auto" }} onClick={() => setSelected(null)}>
              CLOSE PANEL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
