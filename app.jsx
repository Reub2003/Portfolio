// app.jsx — shared Tweaks panel + cross-page persistence.
// Each page mounts <TweaksApp/> into #tweaks-root. The panel posts edits to
// localStorage so navigating to another page keeps the same look.

const STORAGE_KEY = 'reuben.tweaks.v2';

const PALETTES = {
  navyAmber:    { bg:'#06101c', surface:'#0c1726', surface2:'#131f30',
                  ink:'#e8edf3', dim:'#8493a5', faint:'#4a5668',
                  accent:'#f7a13c', label:'Navy / Amber' },
  inkWhite:     { bg:'#0a0a0a', surface:'#141414', surface2:'#1d1d1d',
                  ink:'#f4f4f4', dim:'#888888', faint:'#444444',
                  accent:'#ffffff', label:'Mono / White' },
  charcoalCyan: { bg:'#0e1418', surface:'#161e24', surface2:'#1f2a32',
                  ink:'#e8eef2', dim:'#7e8e98', faint:'#475058',
                  accent:'#5cd0e0', label:'Charcoal / Cyan' },
  hudGreen:     { bg:'#080c0a', surface:'#0e1410', surface2:'#161e18',
                  ink:'#e6f0e8', dim:'#7c8e80', faint:'#465048',
                  accent:'#7cf0a8', label:'HUD / Green' },
};

const FONTS = {
  archivo:    { display:'"Archivo Narrow", sans-serif', body:'"Space Grotesk", system-ui, sans-serif', label:'Archivo + Grotesk' },
  industrial: { display:'"Oswald", "Archivo Narrow", sans-serif', body:'"Inter", system-ui, sans-serif', label:'Oswald + Inter' },
  serif:      { display:'"Fraunces", "Archivo Narrow", serif', body:'"Space Grotesk", sans-serif', label:'Fraunces + Grotesk' },
};

const DENSITY = { compact:0.85, regular:1, comfy:1.15 };

const DEFAULTS = {
  palette: 'inkWhite',
  font: 'archivo',
  density: 'regular',
  accent: '#e8eaed',
};

// Read persisted tweaks BEFORE first paint — also called from inline <head> script.
function applyTweaks(t) {
  const p = PALETTES[t.palette] || PALETTES.navyAmber;
  const f = FONTS[t.font] || FONTS.archivo;
  const d = DENSITY[t.density] ?? 1;
  const r = document.documentElement.style;
  r.setProperty('--bg', p.bg);
  r.setProperty('--surface', p.surface);
  r.setProperty('--surface-2', p.surface2);
  r.setProperty('--ink', p.ink);
  r.setProperty('--ink-dim', p.dim);
  r.setProperty('--ink-faint', p.faint);
  r.setProperty('--accent', t.accent || p.accent);
  r.setProperty('--accent-dim', hexA(t.accent || p.accent, 0.35));
  r.setProperty('--accent-glow', hexA(t.accent || p.accent, 0.18));
  r.setProperty('--font-display', f.display);
  r.setProperty('--font-body', f.body);
  r.setProperty('--d', d);
}

function hexA(hex, a) {
  const h = hex.replace('#','');
  const x = h.length === 3 ? h.replace(/./g, c => c+c) : h;
  const n = parseInt(x, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function loadTweaks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...DEFAULTS, ...stored };
  } catch (e) { return { ...DEFAULTS }; }
}

// Apply immediately so unmounted React doesn't flash defaults.
if (typeof document !== 'undefined') applyTweaks(loadTweaks());

function TweaksApp() {
  const [t, setT] = React.useState(loadTweaks);

  const set = (k, v) => {
    const edits = typeof k === 'object' ? k : { [k]: v };
    const next = { ...t, ...edits };
    setT(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
    applyTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  };

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette">
        <TweakRadio label="Theme" value={t.palette}
          options={[
            { value:'navyAmber',    label:'Navy' },
            { value:'inkWhite',     label:'Mono' },
            { value:'charcoalCyan', label:'Cyan' },
            { value:'hudGreen',     label:'HUD' },
          ]}
          onChange={(v) => set({ palette: v, accent: PALETTES[v].accent })} />
        <TweakColor label="Accent" value={t.accent}
          options={['#f7a13c', '#ff5522', '#5cd0e0', '#7cf0a8', '#c8a4ff', '#ffffff']}
          onChange={(v) => set('accent', v)} />
      </TweakSection>

      <TweakSection label="Typography">
        <TweakSelect label="Font pair" value={t.font}
          options={Object.keys(FONTS).map(k => ({ value:k, label:FONTS[k].label }))}
          onChange={(v) => set('font', v)} />
      </TweakSection>

      <TweakSection label="Layout">
        <TweakRadio label="Density" value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => set('density', v)} />
      </TweakSection>

      <TweakSection label="Reset">
        <TweakButton label="Restore defaults" secondary
          onClick={() => { localStorage.removeItem(STORAGE_KEY); set(DEFAULTS); }} />
      </TweakSection>
    </TweaksPanel>
  );
}

window.TweaksApp = TweaksApp;
window.__applyTweaks = applyTweaks;
window.__loadTweaks = loadTweaks;
