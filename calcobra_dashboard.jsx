// CalcObra Pro — Dashboard
// Paleta idêntica à landing page: preto #040404 + ouro #C9982A→#F8DC82
// Tipografia: Unbounded (títulos) + DM Mono (UI/dados) + Cormorant Garamond (destaques)

const { useState, useMemo } = React;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:      "#040404",
  bg2:     "#080808",
  bg3:     "#0e0e0e",
  bg4:     "#141414",
  bg5:     "#1a1a1a",
  border:  "rgba(255,255,255,0.06)",
  border2: "rgba(255,255,255,0.10)",
  gold:    "#C9982A",
  gold2:   "#DDB040",
  gold3:   "#EEC85A",
  gold4:   "#F8DC82",
  goldDim: "rgba(201,152,42,0.10)",
  goldMid: "rgba(201,152,42,0.22)",
  goldGlow:"rgba(201,152,42,0.40)",
  text:    "#F2EDE4",
  text2:   "#8A8070",
  text3:   "#3A3530",
  grad:    "linear-gradient(135deg,#C9982A 0%,#EEC85A 50%,#C9982A 100%)",
  gradV:   "linear-gradient(180deg,#C9982A,#F8DC82)",
  mono:    "'DM Mono','Fira Code',monospace",
  head:    "'Unbounded',sans-serif",
  serif:   "'Cormorant Garamond',serif",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=DM+Mono:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;overflow:hidden;}
body{background:#040404;color:#F2EDE4;font-family:'DM Mono',monospace;}
input,select,button,textarea{font-family:inherit;}
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
input[type=number]{-moz-appearance:textfield;}
select option{background:#0e0e0e;color:#F2EDE4;}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(201,152,42,0.25);border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:rgba(201,152,42,0.45);}
@keyframes breathe{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes shimmer-move{0%{background-position:-200% center}100%{background-position:200% center}}
`;

// ─── SVG ICON ─────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

// Icon paths
const I = {
  dash:    ["M3 3h7v7H3z","M14 3h7v7h-7z","M3 14h7v7H3z","M14 14h7v7h-7z"],
  quote:   ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  sim:     ["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"],
  calc:    ["M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M8 6h8","M8 10h8","M8 14h4"],
  people:  ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"],
  tag:     ["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z","M7 7h.01"],
  bar:     ["M18 20V10","M12 20V4","M6 20v-6"],
  cog:     ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  plus:    "M12 5v14M5 12h14",
  save:    ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z","M17 21v-8H7v8","M7 3v5h8"],
  dl:      ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  check:   "M20 6L9 17l-5-5",
  chev:    "M9 18l6-6-6-6",
  trend:   ["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"],
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  area:    ["M3 3v18h18","M18.4 9.6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z","M8 15.6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z","M13 11.6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"],
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const R = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
const N = (n, d = 2) => Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const F = (v) => parseFloat(v) || 0;

// ─── PRIMITIVE COMPONENTS ────────────────────────────────────────────────────

// Gold shimmer divider (like landing page section separators)
const GoldLine = ({ my = 12 }) => (
  <div style={{ height: 1, margin: `${my}px 0`, background: "linear-gradient(90deg,transparent,rgba(201,152,42,.25),transparent)" }} />
);

// Section micro-label (like landing page labels e.g. "CALCULADORAS")
const Label = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, ...style }}>
    <div style={{ width: 14, height: 1, background: C.gold }} />
    <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 500, color: C.gold2, letterSpacing: "0.16em", textTransform: "uppercase" }}>{children}</span>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${C.gold}35,transparent)` }} />
  </div>
);

// Card (matching landing bento cards)
const Card = ({ children, style, glow, onClick }) => (
  <div onClick={onClick} style={{
    background: C.bg3,
    border: `1px solid ${glow ? C.goldMid : C.border}`,
    borderRadius: 10,
    padding: 18,
    position: "relative",
    overflow: "hidden",
    cursor: onClick ? "pointer" : "default",
    transition: "border-color .2s, box-shadow .2s",
    ...(glow && { boxShadow: `0 0 40px rgba(201,152,42,0.07)` }),
    ...style,
  }}
    onMouseOver={e => { if (onClick) { e.currentTarget.style.borderColor = C.goldMid; e.currentTarget.style.boxShadow = `0 0 24px rgba(201,152,42,.08)`; } }}
    onMouseOut={e => { if (onClick) { e.currentTarget.style.borderColor = glow ? C.goldMid : C.border; e.currentTarget.style.boxShadow = glow ? `0 0 40px rgba(201,152,42,0.07)` : "none"; } }}
  >
    {glow && <div style={{ position: "absolute", top: 0, inset: "0 0 auto 0", height: 1, background: "linear-gradient(90deg,transparent,#EEC85A 40%,#C9982A 60%,transparent)" }} />}
    {children}
  </div>
);

// Input field styled like landing page form inputs
const Field = ({ label, value, onChange, type = "number", unit, hint, children, ...rest }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {label}{hint && <span style={{ color: "rgba(58,53,48,.7)", marginLeft: 5, fontSize: 9 }}>({hint})</span>}
    </label>
    {children ?? (
      <div style={{ position: "relative" }}>
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          style={{ width: "100%", padding: "8px 11px", paddingRight: unit ? 40 : 11, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, outline: "none", transition: "border .15s, box-shadow .15s", fontFamily: C.mono, boxSizing: "border-box" }}
          onFocus={e => { e.target.style.borderColor = C.goldMid; e.target.style.boxShadow = `0 0 0 3px rgba(201,152,42,.07)`; }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
          {...rest}
        />
        {unit && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: C.text3, pointerEvents: "none", fontFamily: C.mono }}>{unit}</span>}
      </div>
    )}
  </div>
);

const Sel = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <label style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: "8px 11px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, outline: "none", cursor: "pointer", fontFamily: C.mono }}
      onFocus={e => e.target.style.borderColor = C.goldMid}
      onBlur={e => e.target.style.borderColor = C.border}
    >
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0" }}>
    <button type="button" onClick={() => onChange(!checked)} style={{ position: "relative", width: 38, height: 20, borderRadius: 10, border: "none", cursor: "pointer", background: checked ? C.gold : C.bg5, transition: "background .2s", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: 2, left: checked ? 19 : 2, width: 16, height: 16, borderRadius: "50%", background: checked ? C.bg : "#555", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.5)" }} />
    </button>
    <span style={{ fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{label}</span>
  </div>
);

// Gold CTA button (identical to landing page buttons)
const Btn = ({ children, onClick, variant = "gold", icon, sm }) => {
  const V = {
    gold:    { background: C.grad, backgroundSize: "200%", color: C.bg, border: "none", boxShadow: `0 0 20px rgba(201,152,42,.2)` },
    outline: { background: "transparent", color: C.gold3, border: `1px solid ${C.goldMid}` },
    ghost:   { background: "transparent", color: C.text2, border: `1px solid ${C.border}` },
  };
  return (
    <button type="button" onClick={onClick} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: sm ? "6px 14px" : "9px 18px", borderRadius: 7, cursor: "pointer", fontFamily: C.mono, fontSize: sm ? 10 : 12, fontWeight: 500, letterSpacing: "0.04em", transition: "opacity .18s, background-position .3s", ...V[variant] }}
      onMouseOver={e => e.currentTarget.style.opacity = ".8"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >
      {icon && <Ic d={I[icon]} size={13} color={variant === "gold" ? C.bg : "currentColor"} />}
      {children}
    </button>
  );
};

// Result row (breakdown lines)
const Row = ({ label, value, gold, last }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: last ? "none" : `1px solid ${C.border}` }}>
    <span style={{ fontFamily: C.mono, fontSize: 11, color: gold ? C.gold2 : C.text2 }}>{label}</span>
    <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: gold ? 700 : 500, color: gold ? C.gold3 : C.text }}>{value}</span>
  </div>
);

// Stat chip inside cards
const Chip = ({ label, value }) => (
  <div style={{ padding: "7px 11px", background: C.bg2, borderRadius: 6, border: `1px solid ${C.border}` }}>
    <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text3, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 500, color: C.gold3, marginTop: 3 }}>{value}</div>
  </div>
);

// ─── SIMULADOR SINAPI ─────────────────────────────────────────────────────────
// Base de dados SINAPI — composições reais com códigos oficiais
// Referência: SINAPI Jan/2026 (Caixa/IBGE) — custo nacional R$ 1.920,74/m²
// Fonte: caixa.gov.br/sinapi · ibge.gov.br/sinapi

const SINAPI_UF = {
  AC:{n:"Acre",f:1.08},AL:{n:"Alagoas",f:0.91},AM:{n:"Amazonas",f:1.12},AP:{n:"Amapá",f:1.15},
  BA:{n:"Bahia",f:0.93},CE:{n:"Ceará",f:0.90},DF:{n:"Distrito Federal",f:1.05},ES:{n:"Espírito Santo",f:0.97},
  GO:{n:"Goiás",f:0.94},MA:{n:"Maranhão",f:0.92},MG:{n:"Minas Gerais",f:0.98},MS:{n:"Mato Grosso do Sul",f:0.99},
  MT:{n:"Mato Grosso",f:1.02},PA:{n:"Pará",f:1.06},PB:{n:"Paraíba",f:0.89},PE:{n:"Pernambuco",f:0.92},
  PI:{n:"Piauí",f:0.88},PR:{n:"Paraná",f:1.00},RJ:{n:"Rio de Janeiro",f:1.10},RN:{n:"Rio Grande do Norte",f:0.91},
  RO:{n:"Rondônia",f:1.04},RR:{n:"Roraima",f:1.14},RS:{n:"Rio Grande do Sul",f:1.03},SC:{n:"Santa Catarina",f:1.02},
  SE:{n:"Sergipe",f:0.90},SP:{n:"São Paulo",f:1.07},TO:{n:"Tocantins",f:1.01},
};

// Padrões construtivos (multiplicador sobre base SINAPI)
const SINAPI_PADRAO = {
  baixo:  { n: "Popular (R1-B)",    f: 0.72, desc: "Alvenaria simples, acabamento básico" },
  normal: { n: "Normal (R1-N)",     f: 1.00, desc: "Padrão médio, acabamento convencional" },
  alto:   { n: "Alto (R1-A)",       f: 1.42, desc: "Acabamento de alto padrão, importados" },
};

// Etapas com composições SINAPI reais — códigos, descrições e custos base (R$/m² ref. nacional jan/2026)
const SINAPI_ETAPAS = [
  { id:"prelim", nome:"Serviços Preliminares", icon:"M3 3v18h18M9 15v3M13 11v7M17 7v11",
    pct: 3.0, codigos:[
      {cod:"73847/2",desc:"Limpeza mecânica do terreno",un:"m²",val:4.82},
      {cod:"74077/3",desc:"Locação convencional de obra",un:"m²",val:8.15},
      {cod:"74209/1",desc:"Placa de identificação de obra",un:"m²",val:326.50},
      {cod:"73948",desc:"Tapume de madeira compensada",un:"m²",val:68.74},
    ]},
  { id:"fundacao", nome:"Fundação", icon:"M2 20h20M4 20V10l8-7 8 7v10",
    pct: 5.5, codigos:[
      {cod:"96543",desc:"Armação de sapata/baldrame CA-60 5mm",un:"kg",val:17.82},
      {cod:"96545",desc:"Armação de sapata/baldrame CA-50 8mm",un:"kg",val:15.75},
      {cod:"96535",desc:"Forma para sapata madeira serrada 25mm",un:"m²",val:132.86},
      {cod:"96995",desc:"Reaterro manual apiloado com soquete",un:"m³",val:45.74},
      {cod:"96546",desc:"Armação baldrame CA-50 10mm montagem",un:"kg",val:17.81},
      {cod:"94965",desc:"Concreto fck=25MPa bombeado",un:"m³",val:498.62},
    ]},
  { id:"estrutura", nome:"Estrutura / Superestrutura", icon:"M4 21V7l8-4 8 4v14M4 11h16M12 3v18",
    pct: 16.0, codigos:[
      {cod:"104488",desc:"Estrutura concreto armado fck=25 edif. térrea",un:"m²",val:312.45},
      {cod:"92872",desc:"Laje pré-moldada p/ forro e=12cm",un:"m²",val:128.50},
      {cod:"92874",desc:"Laje pré-moldada p/ piso e=16cm",un:"m²",val:165.80},
      {cod:"96547",desc:"Armação pilar/viga CA-50 10mm",un:"kg",val:17.53},
      {cod:"92478",desc:"Forma pilar retangular madeira",un:"m²",val:98.74},
      {cod:"92480",desc:"Forma de viga madeira",un:"m²",val:86.92},
    ]},
  { id:"alvenaria", nome:"Alvenaria / Vedação", icon:"M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
    pct: 11.0, codigos:[
      {cod:"103323",desc:"Alvenaria bloco cerâmico 9×19×39 e=9cm",un:"m²",val:70.56},
      {cod:"103324",desc:"Alvenaria bloco cerâmico 14×19×39 e=14cm",un:"m²",val:89.42},
      {cod:"103334",desc:"Alvenaria bloco concreto 14×19×39 e=14cm",un:"m²",val:95.68},
      {cod:"101161",desc:"Alvenaria elemento vazado concreto (cobogó)",un:"m²",val:112.40},
      {cod:"87503",desc:"Verga/contraverga concreto armado",un:"m",val:42.85},
    ]},
  { id:"cobertura", nome:"Cobertura", icon:"M3 21l9-9 9 9M3 21h18",
    pct: 4.0, codigos:[
      {cod:"100393",desc:"Trama madeira (ripas+caibros+terças)",un:"m²",val:85.72},
      {cod:"100392",desc:"Cobertura telha cerâmica de encaixe",un:"m²",val:17.01},
      {cod:"94227",desc:"Cobertura telha fibrocimento 6mm",un:"m²",val:52.48},
      {cod:"102190",desc:"Cumeeira cerâmica com argamassa",un:"m",val:28.90},
      {cod:"92583",desc:"Calha chapa galvanizada n°26",un:"m",val:78.35},
    ]},
  { id:"impermeab", nome:"Impermeabilização", icon:"M12 2C6.48 6.44 2 11.15 2 16.5S6.48 22 12 22s10-1.17 10-5.5S17.52 2 12 2",
    pct: 3.0, codigos:[
      {cod:"98555",desc:"Impermeabilização manta asfáltica 3mm",un:"m²",val:68.92},
      {cod:"98557",desc:"Impermeabilização manta asfáltica 4mm",un:"m²",val:82.15},
      {cod:"88489",desc:"Impermeabilização argamassa polimérica",un:"m²",val:32.47},
    ]},
  { id:"inst_elet", nome:"Instalações Elétricas", icon:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    pct: 8.0, codigos:[
      {cod:"91926",desc:"Ponto de tomada 2P+T incluindo elétroduto e fiação",un:"un",val:168.45},
      {cod:"91928",desc:"Ponto de iluminação incluindo elétroduto e fiação",un:"un",val:142.80},
      {cod:"91930",desc:"Ponto de interruptor simples 1 tecla",un:"un",val:125.60},
      {cod:"91940",desc:"Quadro de distribuição 12/16 disjuntores",un:"un",val:585.40},
      {cod:"91953",desc:"Disjuntor monopolar 20A",un:"un",val:18.92},
      {cod:"97601",desc:"Eletroduto PVC rígido 25mm",un:"m",val:12.85},
    ]},
  { id:"inst_hidr", nome:"Instalações Hidráulicas", icon:"M12 2v20M5 5h14M5 19h14",
    pct: 10.0, codigos:[
      {cod:"89356",desc:"Ponto de água fria — tubo PVC 25mm",un:"un",val:145.20},
      {cod:"89449",desc:"Ponto de esgoto — tubo PVC 100mm",un:"un",val:118.75},
      {cod:"89509",desc:"Vaso sanitário louça com cx acoplada",un:"un",val:562.40},
      {cod:"89515",desc:"Lavatório louça com coluna",un:"un",val:385.60},
      {cod:"89398",desc:"Registro de gaveta 25mm (3/4\")",un:"un",val:85.42},
      {cod:"89577",desc:"Caixa d'água polietileno 1000L",un:"un",val:635.80},
      {cod:"89437",desc:"Tubo PVC esgoto 100mm",un:"m",val:42.65},
    ]},
  { id:"revestimento", nome:"Revestimento / Acabamento", icon:"M4 4h16v16H4zM9 4v16M15 4v16M4 9h16M4 15h16",
    pct: 25.0, codigos:[
      {cod:"87878",desc:"Chapisco interno parede 1:3 preparo manual",un:"m²",val:5.46},
      {cod:"87905",desc:"Chapisco fachada 1:3 preparo betoneira",un:"m²",val:8.91},
      {cod:"104952",desc:"Massa única 1:2:8 parede interna e=25mm",un:"m²",val:41.40},
      {cod:"87264",desc:"Reboco/massa fina parede interna e=5mm",un:"m²",val:25.18},
      {cod:"87246",desc:"Contrapiso argamassa e=3cm",un:"m²",val:32.60},
      {cod:"87261",desc:"Piso cerâmico 45×45 PEI-4 argamassa",un:"m²",val:72.48},
      {cod:"87265",desc:"Revestimento cerâmico parede 35×35",un:"m²",val:68.52},
      {cod:"87268",desc:"Piso porcelanato 60×60 retificado",un:"m²",val:118.90},
    ]},
  { id:"esquadrias", nome:"Esquadrias / Vidros", icon:"M3 3h18v18H3zM3 12h18M12 3v18",
    pct: 7.0, codigos:[
      {cod:"91338",desc:"Porta interna madeira semi-oca 80×210cm",un:"un",val:582.60},
      {cod:"91339",desc:"Porta externa madeira maciça 80×210cm",un:"un",val:1285.40},
      {cod:"91311",desc:"Janela alumínio correr 120×120cm c/ vidro",un:"un",val:892.50},
      {cod:"91313",desc:"Janela alumínio maxim-ar 60×60cm c/ vidro",un:"un",val:425.80},
      {cod:"91335",desc:"Kit porta correr alumínio 80×210cm",un:"un",val:1150.00},
    ]},
  { id:"pintura", nome:"Pintura", icon:"M18 4V3a1 1 0 0 0-2 0v1H8V3a1 1 0 0 0-2 0v1H2v18h20V4zM2 8h20",
    pct: 5.5, codigos:[
      {cod:"88485",desc:"Pintura látex PVA 2 demãos parede interna",un:"m²",val:14.82},
      {cod:"88487",desc:"Pintura acrílica 2 demãos parede externa",un:"m²",val:18.45},
      {cod:"88497",desc:"Massa corrida PVA 2 demãos",un:"m²",val:12.68},
      {cod:"88495",desc:"Selador acrílico 1 demão",un:"m²",val:5.92},
      {cod:"88491",desc:"Textura acrílica rolada",un:"m²",val:22.10},
    ]},
  { id:"limpeza", nome:"Limpeza Final / Complementares", icon:"M20 6L9 17l-5-5",
    pct: 2.0, codigos:[
      {cod:"73930",desc:"Limpeza final da obra",un:"m²",val:6.85},
      {cod:"84087",desc:"Paisagismo/plantio de grama",un:"m²",val:12.40},
      {cod:"73978",desc:"Muro de divisa bloco + reboco",un:"m²",val:185.60},
    ]},
];

// BDI padrão para obras (Acórdão TCU 2622/2013)
const BDI_PADRAO = { min: 20.34, normal: 24.23, max: 29.89 };

function Simulador({ onSave }) {
  const [uf, setUf] = useState("SP");
  const [padrao, setPadrao] = useState("normal");
  const [area, setArea] = useState(120);
  const [pavimentos, setPavimentos] = useState(1);
  const [bdi, setBdi] = useState(BDI_PADRAO.normal);
  const [encSocial, setEncSocial] = useState(86.0);
  const [etapasCustom, setEtapasCustom] = useState({});
  const [expandido, setExpandido] = useState(null);
  const [modoDetalhe, setModoDetalhe] = useState(false);

  const togglePct = (id, delta) => {
    setEtapasCustom(prev => {
      const base = SINAPI_ETAPAS.find(e => e.id === id).pct;
      const cur = prev[id] !== undefined ? prev[id] : base;
      const nv = Math.max(0, Math.min(50, cur + delta));
      return { ...prev, [id]: parseFloat(nv.toFixed(1)) };
    });
  };

  const resetPcts = () => setEtapasCustom({});

  const r = useMemo(() => {
    const fUf = SINAPI_UF[uf].f;
    const fPad = SINAPI_PADRAO[padrao].f;
    const areaTotal = F(area) * F(pavimentos);
    const custoBaseM2 = 1920.74; // SINAPI jan/2026
    const custoM2Ajust = custoBaseM2 * fUf * fPad;
    const custoObraBase = custoM2Ajust * areaTotal;

    let totalPcts = 0;
    const etapas = SINAPI_ETAPAS.map(et => {
      const pct = etapasCustom[et.id] !== undefined ? etapasCustom[et.id] : et.pct;
      totalPcts += pct;
      const custoEtapa = custoObraBase * (pct / 100);
      const custoM2Etapa = areaTotal > 0 ? custoEtapa / areaTotal : 0;
      return { ...et, pctUsado: pct, custo: custoEtapa, custoM2: custoM2Etapa };
    });

    const subtotal = custoObraBase;
    const valBdi = subtotal * (F(bdi) / 100);
    const total = subtotal + valBdi;
    const totalM2 = areaTotal > 0 ? total / areaTotal : 0;

    // Composição Mat vs MO (referência SINAPI jan/2026: 53.87% material, 39.34% MO, 6.79% equip)
    const pctMat = 53.87;
    const pctMo = 39.34;
    const pctEquip = 6.79;

    return { fUf, fPad, areaTotal, custoBaseM2, custoM2Ajust, custoObraBase: subtotal,
             etapas, totalPcts, valBdi, total, totalM2, pctMat, pctMo, pctEquip };
  }, [uf, padrao, area, pavimentos, bdi, encSocial, etapasCustom]);

  // Barra horizontal de proporção
  const BarProp = ({ items }) => (
    <div style={{ display:"flex", height:6, borderRadius:3, overflow:"hidden", background:C.bg5 }}>
      {items.map((it,i)=>(
        <div key={i} style={{ width:`${it.pct}%`, background:it.color, transition:"width .3s" }}
          title={`${it.label}: ${N(it.pct,1)}%`} />
      ))}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Header SINAPI */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ padding:"5px 12px", background:C.goldDim, border:`1px solid ${C.goldMid}`, borderRadius:20, display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.gold, animation:"breathe 2s infinite" }}/>
            <span style={{ fontFamily:C.mono, fontSize:9, color:C.gold2, letterSpacing:"0.12em" }}>SINAPI JAN/2026</span>
          </div>
          <span style={{ fontFamily:C.mono, fontSize:10, color:C.text3 }}>Base: R$ 1.920,74/m² nacional</span>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <Btn onClick={()=>setModoDetalhe(!modoDetalhe)} icon="calc" variant="outline" sm>
            {modoDetalhe ? "Modo Resumido" : "Modo Detalhado"}
          </Btn>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:18, alignItems:"start" }}>
        {/* ── FORM LEFT ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* UF + Padrão */}
          <Card>
            <Label>Localização e Padrão</Label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Sel label="Estado (UF)" value={uf} onChange={setUf}
                options={Object.entries(SINAPI_UF).sort((a,b)=>a[1].n.localeCompare(b[1].n)).map(([k,v])=>({value:k,label:`${v.n} (${k})`}))} />
              <Sel label="Padrão Construtivo" value={padrao} onChange={setPadrao}
                options={Object.entries(SINAPI_PADRAO).map(([k,v])=>({value:k,label:v.n}))} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:12 }}>
              <Chip label="Fator UF" value={`×${SINAPI_UF[uf].f.toFixed(2)}`} />
              <Chip label="Fator Padrão" value={`×${SINAPI_PADRAO[padrao].f.toFixed(2)}`} />
              <Chip label="m² Ajustado" value={R(r.custoM2Ajust)} />
            </div>
            <div style={{ marginTop:8, padding:"6px 10px", background:C.bg2, borderRadius:6, border:`1px solid ${C.border}` }}>
              <span style={{ fontFamily:C.mono, fontSize:10, color:C.text3 }}>{SINAPI_PADRAO[padrao].desc}</span>
            </div>
          </Card>

          {/* Dados da Obra */}
          <Card>
            <Label>Dados da Obra</Label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
              <Field label="Área por pavimento" value={area} onChange={setArea} unit="m²" />
              <Field label="Pavimentos" value={pavimentos} onChange={setPavimentos} unit="pav" step="1" />
              <Field label="BDI" value={bdi} onChange={setBdi} unit="%" hint={`TCU: ${BDI_PADRAO.min}–${BDI_PADRAO.max}%`} />
              <Field label="Encargos Sociais" value={encSocial} onChange={setEncSocial} unit="%" hint="Horista desonerado" />
            </div>
            <div style={{ marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:C.bg2, borderRadius:7, border:`1px solid ${C.border}` }}>
              <span style={{ fontFamily:C.mono, fontSize:10, color:C.text2 }}>Área total construída</span>
              <span style={{ fontFamily:C.head, fontSize:20, fontWeight:700, color:C.gold3, letterSpacing:"-0.5px" }}>{N(r.areaTotal)} m²</span>
            </div>
          </Card>

          {/* Etapas SINAPI */}
          <Card>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <Label style={{ marginBottom:0 }}>Etapas da Obra — Composições SINAPI</Label>
              <button onClick={resetPcts} style={{ fontFamily:C.mono, fontSize:9, color:C.text3, background:"none", border:`1px solid ${C.border}`, padding:"3px 9px", borderRadius:4, cursor:"pointer" }}
                onMouseOver={e=>e.currentTarget.style.borderColor=C.goldMid}
                onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
                Resetar %
              </button>
            </div>

            {/* Total % warning */}
            {Math.abs(r.totalPcts - 100) > 0.5 && (
              <div style={{ padding:"6px 10px", marginBottom:10, background:"rgba(224,112,96,.08)", border:"1px solid rgba(224,112,96,.25)", borderRadius:6, fontFamily:C.mono, fontSize:10, color:"#e07060" }}>
                Soma dos percentuais: {N(r.totalPcts,1)}% (ideal: 100%)
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {r.etapas.map(et => (
                <div key={et.id}>
                  <div onClick={()=>setExpandido(expandido===et.id?null:et.id)}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", background: expandido===et.id ? C.bg4 : C.bg2, border:`1px solid ${expandido===et.id ? C.goldMid : C.border}`, borderRadius:7, cursor:"pointer", transition:"all .15s" }}
                    onMouseOver={e=>{if(expandido!==et.id){e.currentTarget.style.borderColor=C.border2}}}
                    onMouseOut={e=>{if(expandido!==et.id){e.currentTarget.style.borderColor=C.border}}}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={expandido===et.id ? C.gold2 : C.text3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                      <path d={et.icon} />
                    </svg>
                    <span style={{ fontFamily:C.mono, fontSize:11, color: expandido===et.id ? C.gold3 : C.text, flex:1 }}>{et.nome}</span>
                    {/* Pct controls */}
                    <div style={{ display:"flex", alignItems:"center", gap:4 }} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>togglePct(et.id,-0.5)} style={{ width:18, height:18, borderRadius:3, border:`1px solid ${C.border}`, background:C.bg3, color:C.text2, cursor:"pointer", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:C.mono }}>-</button>
                      <span style={{ fontFamily:C.mono, fontSize:10, color: et.pctUsado !== et.pct ? C.gold3 : C.text2, minWidth:36, textAlign:"center", fontWeight:et.pctUsado !== et.pct ? 700 : 400 }}>
                        {N(et.pctUsado,1)}%
                      </span>
                      <button onClick={()=>togglePct(et.id,0.5)} style={{ width:18, height:18, borderRadius:3, border:`1px solid ${C.border}`, background:C.bg3, color:C.text2, cursor:"pointer", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:C.mono }}>+</button>
                    </div>
                    <span style={{ fontFamily:C.mono, fontSize:11, fontWeight:600, color:C.gold3, minWidth:85, textAlign:"right" }}>{R(et.custo)}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: expandido===et.id?"rotate(90deg)":"rotate(0)", transition:"transform .2s", flexShrink:0 }}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>

                  {/* Composições expandidas */}
                  {expandido === et.id && (
                    <div style={{ margin:"4px 0 6px 22px", padding:"10px 12px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:6 }}>
                      <div style={{ fontFamily:C.mono, fontSize:9, color:C.gold2, letterSpacing:"0.1em", marginBottom:8 }}>COMPOSIÇÕES SINAPI</div>
                      <table style={{ width:"100%", borderCollapse:"collapse" }}>
                        <thead>
                          <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                            <th style={{ fontFamily:C.mono, fontSize:8, color:C.text3, textAlign:"left", padding:"4px 6px", letterSpacing:"0.1em" }}>CÓDIGO</th>
                            <th style={{ fontFamily:C.mono, fontSize:8, color:C.text3, textAlign:"left", padding:"4px 6px", letterSpacing:"0.1em" }}>DESCRIÇÃO</th>
                            <th style={{ fontFamily:C.mono, fontSize:8, color:C.text3, textAlign:"center", padding:"4px 6px", letterSpacing:"0.1em" }}>UN</th>
                            <th style={{ fontFamily:C.mono, fontSize:8, color:C.text3, textAlign:"right", padding:"4px 6px", letterSpacing:"0.1em" }}>CUSTO UN.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {et.codigos.map((c,i) => (
                            <tr key={i} style={{ borderBottom: i < et.codigos.length-1 ? `1px solid ${C.border}` : "none" }}>
                              <td style={{ fontFamily:C.mono, fontSize:10, color:C.gold3, padding:"5px 6px", whiteSpace:"nowrap" }}>{c.cod}</td>
                              <td style={{ fontFamily:C.mono, fontSize:10, color:C.text, padding:"5px 6px" }}>{c.desc}</td>
                              <td style={{ fontFamily:C.mono, fontSize:10, color:C.text2, padding:"5px 6px", textAlign:"center" }}>{c.un}</td>
                              <td style={{ fontFamily:C.mono, fontSize:10, color:C.text, padding:"5px 6px", textAlign:"right", whiteSpace:"nowrap" }}>
                                {R(c.val * SINAPI_UF[uf].f)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ marginTop:8, fontFamily:C.mono, fontSize:9, color:C.text3 }}>
                        * Preços ajustados para {SINAPI_UF[uf].n} (fator ×{SINAPI_UF[uf].f.toFixed(2)})
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Barra visual de distribuição */}
            <div style={{ marginTop:14 }}>
              <div style={{ fontFamily:C.mono, fontSize:9, color:C.text3, marginBottom:4, letterSpacing:"0.08em" }}>DISTRIBUIÇÃO POR ETAPA</div>
              <BarProp items={r.etapas.map((et,i)=>({
                pct: et.pctUsado,
                label: et.nome,
                color: `hsl(${38 + i*28}, ${60+i*3}%, ${45+i*3}%)`
              }))} />
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 10px", marginTop:6 }}>
                {r.etapas.map((et,i) => (
                  <div key={et.id} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:6, height:6, borderRadius:1, background:`hsl(${38+i*28},${60+i*3}%,${45+i*3}%)` }}/>
                    <span style={{ fontFamily:C.mono, fontSize:8, color:C.text3 }}>{et.nome.split("/")[0].split("(")[0].trim()} {N(et.pctUsado,1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── RESULTS RIGHT ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, position:"sticky", top:0 }}>
          {/* Live pill */}
          <div style={{ display:"flex", alignItems:"center", gap:7, alignSelf:"flex-start", padding:"4px 11px", background:C.goldDim, border:`1px solid ${C.goldMid}`, borderRadius:20 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.gold, animation:"breathe 2s infinite" }}/>
            <span style={{ fontFamily:C.mono, fontSize:9, color:C.gold2, letterSpacing:"0.12em" }}>CÁLCULO EM TEMPO REAL</span>
          </div>

          {/* Total hero */}
          <Card glow style={{ padding:"22px 20px", textAlign:"center" }}>
            <div style={{ fontFamily:C.mono, fontSize:9, color:C.text2, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:6 }}>Custo Total da Obra</div>
            <div style={{ fontFamily:C.head, fontSize:28, fontWeight:900, letterSpacing:"-1.5px", background:C.grad, backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer-move 5s linear infinite" }}>
              {R(r.total)}
            </div>
            <div style={{ marginTop:6, fontFamily:C.mono, fontSize:13, color:C.text2 }}>
              <span style={{ color:C.gold3, fontWeight:500 }}>{R(r.totalM2)}</span> <span style={{ fontSize:10 }}>por m²</span>
            </div>
            <div style={{ marginTop:8, display:"flex", justifyContent:"center", gap:14 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:C.mono, fontSize:8, color:C.text3, letterSpacing:"0.1em" }}>SINAPI BASE</div>
                <div style={{ fontFamily:C.mono, fontSize:11, color:C.text2 }}>{R(r.custoBaseM2)}/m²</div>
              </div>
              <div style={{ width:1, background:C.border }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:C.mono, fontSize:8, color:C.text3, letterSpacing:"0.1em" }}>AJUSTADO UF</div>
                <div style={{ fontFamily:C.mono, fontSize:11, color:C.text2 }}>{R(r.custoM2Ajust)}/m²</div>
              </div>
            </div>
          </Card>

          {/* Breakdown */}
          <Card style={{ padding:"16px 18px" }}>
            <Label>Composição Geral</Label>
            <Row label={`Área construída (${pavimentos} pav.)`} value={`${N(r.areaTotal)} m²`} />
            <Row label={`Estado: ${SINAPI_UF[uf].n}`} value={`×${SINAPI_UF[uf].f.toFixed(2)}`} />
            <Row label={`Padrão: ${SINAPI_PADRAO[padrao].n}`} value={`×${SINAPI_PADRAO[padrao].f.toFixed(2)}`} />
            <GoldLine my={8} />
            <Row label="Custo direto da obra" value={R(r.custoObraBase)} />
            <Row label={`BDI (${N(bdi,2)}%)`} value={R(r.valBdi)} />
            <GoldLine my={8} />
            <Row label="TOTAL COM BDI" value={R(r.total)} gold />
            <Row label="Custo por m²" value={R(r.totalM2)} gold last />
          </Card>

          {/* Material vs MO */}
          <Card style={{ padding:"14px 16px" }}>
            <Label>Composição de Custo (ref. SINAPI)</Label>
            <BarProp items={[
              { pct:r.pctMat, color:"#C9982A", label:"Material" },
              { pct:r.pctMo, color:"#7EBF8E", label:"Mão de Obra" },
              { pct:r.pctEquip, color:"#6B8FCF", label:"Equipamento" },
            ]}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:"#C9982A" }}/>
                <span style={{ fontFamily:C.mono, fontSize:10, color:C.text2 }}>Material {N(r.pctMat,1)}%</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:"#7EBF8E" }}/>
                <span style={{ fontFamily:C.mono, fontSize:10, color:C.text2 }}>M.O. {N(r.pctMo,1)}%</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:"#6B8FCF" }}/>
                <span style={{ fontFamily:C.mono, fontSize:10, color:C.text2 }}>Equip. {N(r.pctEquip,1)}%</span>
              </div>
            </div>
            <div style={{ marginTop:8, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
              <Chip label="Material" value={R(r.total * r.pctMat / 100)} />
              <Chip label="Mão de Obra" value={R(r.total * r.pctMo / 100)} />
              <Chip label="Equipamentos" value={R(r.total * r.pctEquip / 100)} />
            </div>
          </Card>

          {/* Resumo por Etapa */}
          <Card style={{ padding:"14px 16px", maxHeight:250, overflowY:"auto" }}>
            <Label>Custo por Etapa</Label>
            {r.etapas.map(et => (
              <div key={et.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontFamily:C.mono, fontSize:10, color:C.text2, flex:1 }}>{et.nome.split("/")[0].split("(")[0].trim()}</span>
                <span style={{ fontFamily:C.mono, fontSize:9, color:C.text3, marginRight:8 }}>{N(et.pctUsado,1)}%</span>
                <span style={{ fontFamily:C.mono, fontSize:10, fontWeight:600, color:C.text, minWidth:80, textAlign:"right" }}>{R(et.custo)}</span>
              </div>
            ))}
          </Card>

          {/* Actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            <Btn onClick={()=>{
              const sim = { uf, padrao, area, pavimentos, bdi, encSocial, etapasCustom,
                total: r.total, totalM2: r.totalM2, data: new Date().toISOString() };
              const sims = JSON.parse(localStorage.getItem("co_simulacoes_sinapi")||"[]");
              sims.push(sim);
              localStorage.setItem("co_simulacoes_sinapi", JSON.stringify(sims));
              onSave?.();
            }} icon="save" variant="gold">Salvar simulação SINAPI</Btn>
            <Btn onClick={()=>{
              const txt = [
                "═══════════════════════════════════════════════",
                "  SIMULAÇÃO SINAPI — CalcObra Pro",
                "  " + new Date().toLocaleDateString("pt-BR"),
                "═══════════════════════════════════════════════",
                "",
                `Estado: ${SINAPI_UF[uf].n} (fator ${SINAPI_UF[uf].f})`,
                `Padrão: ${SINAPI_PADRAO[padrao].n}`,
                `Área: ${N(r.areaTotal)} m² (${pavimentos} pavimento(s))`,
                `BDI: ${N(bdi,2)}%`,
                `SINAPI Base: ${R(r.custoBaseM2)}/m²`,
                `SINAPI Ajustado: ${R(r.custoM2Ajust)}/m²`,
                "",
                "─── ETAPAS ───────────────────────────────────",
                ...r.etapas.map(et => `  ${et.nome.padEnd(35)} ${N(et.pctUsado,1).padStart(5)}%   ${R(et.custo).padStart(14)}`),
                "",
                "─── RESUMO ───────────────────────────────────",
                `  Custo Direto:    ${R(r.custoObraBase)}`,
                `  BDI (${N(bdi,2)}%):     ${R(r.valBdi)}`,
                `  TOTAL:           ${R(r.total)}`,
                `  Custo/m²:        ${R(r.totalM2)}`,
                "",
                "  Ref.: SINAPI Jan/2026 — Caixa/IBGE",
                "═══════════════════════════════════════════════",
              ].join("\n");
              const blob = new Blob([txt], { type:"text/plain;charset=utf-8" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `simulacao_sinapi_${uf}_${new Date().toISOString().slice(0,10)}.txt`;
              a.click();
            }} icon="dl" variant="outline">Exportar Relatório</Btn>
          </div>

          {/* Disclaimer */}
          <div style={{ padding:"8px 10px", background:C.bg2, borderRadius:6, border:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:C.mono, fontSize:8, color:C.text3, lineHeight:1.5 }}>
              Valores baseados no SINAPI Jan/2026 (Caixa/IBGE). Custo nacional: R$ 1.920,74/m².
              Não inclui terreno, projetos, licenças, taxas e administração. Composições com códigos
              oficiais SINAPI. Ajuste fino requer consulta às planilhas mensais por UF em
              caixa.gov.br/sinapi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CALC MÁRMORE ─────────────────────────────────────────────────────────────
// Referência: preços de mercado — sem código SINAPI para pedras ornamentais
// Chapa padrão: 3.00 × 1.50 m = 4.50 m²  |  Espessura: 2cm (padrão) ou 3cm (+30% material)
// Frontão/Saia: cobrado por ml (polimento de face lateral)
// Cuba embutida: R$350  |  Sobrepor: R$150  |  Furo torneira: R$80/un
function CalcMarmore() {
  const STONES = {
    gsg: { n: "Granito São Gabriel",      m2: 320, ml: 85,  inst: 180 },
    gan: { n: "Granito Andorinha",         m2: 290, ml: 80,  inst: 160 },
    gbi: { n: "Granito Branco Itaúnas",    m2: 380, ml: 95,  inst: 200 },
    mca: { n: "Mármore Carrara",           m2: 680, ml: 150, inst: 280 },
    gpr: { n: "Granito Preto São Gabriel", m2: 360, ml: 90,  inst: 190 },
  };
  // esp: "2cm" = padrão  |  "3cm" = +30% no material (chapa mais espessa)
  const [f, setF] = useState({
    stone: "gsg", comp: 3, larg: 0.6, esp: "2cm", qty: 1, perda: 5,
    front: 0, saia: 0, cuba: "nao", furos: 0, inst: true,
  });
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  const stone = STONES[f.stone];

  const r = useMemo(() => {
    const comp  = Math.max(0, F(f.comp));
    const larg  = Math.max(0, F(f.larg));
    const qty   = Math.max(1, Math.round(F(f.qty)));
    const perda = Math.min(30, Math.max(0, F(f.perda))) / 100;
    if (comp === 0 || larg === 0) return { area:0, areaC:0, chapas:0, matPedra:0, front:0, saia:0, recortes:0, inst:0, totalMat:0, total:0, pm2:0 };

    const espFator = f.esp === "3cm" ? 1.30 : 1.00;  // 3cm slab: +30% material
    const area     = comp * larg * qty;               // área líquida em m²
    const areaC    = area * (1 + perda);              // área de compra com perda técnica
    const chapas   = Math.ceil(areaC / 4.50);         // chapas padrão 3.00×1.50 m

    const matPedra = areaC * stone.m2 * espFator;     // custo da pedra com perda e espessura
    const frontVal = Math.max(0, F(f.front)) * stone.ml;
    const saiaVal  = Math.max(0, F(f.saia))  * stone.ml;
    // Recortes: cuba embutida R$350, sobrepor R$150, furos torneira R$80/un
    const cubaVal  = f.cuba === "emb" ? 350 : f.cuba === "sob" ? 150 : 0;
    const furosVal = Math.max(0, Math.round(F(f.furos))) * 80;
    const recortes = cubaVal + furosVal;

    const instVal  = f.inst ? area * stone.inst : 0;  // instalação sobre área líquida
    const totalMat = matPedra + frontVal + saiaVal + recortes;
    const total    = totalMat + instVal;
    const pm2      = area > 0 ? total / area : 0;
    return { area, areaC, chapas, matPedra, front: frontVal, saia: saiaVal, recortes, inst: instVal, totalMat, total, pm2 };
  }, [f, stone]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <Label>Tipo de Pedra</Label>
          <Sel value={f.stone} onChange={s("stone")} options={Object.entries(STONES).map(([k, v]) => ({ value: k, label: `${v.n} — ${R(v.m2)}/m²` }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
            <Chip label="Pedra/m²"      value={R(stone.m2)} />
            <Chip label="Acabamento/ml" value={R(stone.ml)} />
            <Chip label="Instalação/m²" value={R(stone.inst)} />
          </div>
        </Card>
        <Card>
          <Label>Medidas</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <Field label="Comprimento"  value={f.comp}  onChange={s("comp")}  unit="m" />
            <Field label="Largura"      value={f.larg}  onChange={s("larg")}  unit="m" />
            <Field label="Qtd. peças"   value={f.qty}   onChange={s("qty")}   step="1" />
            <Field label="Perda técnica" value={f.perda} onChange={s("perda")} unit="%" hint="padrão 5%" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <Chip label="Área líquida"  value={`${N(r.area)} m²`} />
            <Chip label="Área c/ perda" value={`${N(r.areaC)} m² — ${r.chapas} chapa${r.chapas !== 1 ? "s" : ""}`} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {["2cm", "3cm"].map(v => (
              <button key={v} type="button" onClick={() => s("esp")(v)}
                style={{ flex: 1, padding: "7px 0", borderRadius: 7, border: `1px solid ${f.esp === v ? C.gold : C.border}`, background: f.esp === v ? C.goldDim : "transparent", color: f.esp === v ? C.gold3 : C.text2, fontFamily: C.mono, fontSize: 11, cursor: "pointer" }}>
                Espessura {v}{v === "3cm" && <span style={{ color: C.text3, fontSize: 9 }}> +30%</span>}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <Label>Acabamentos e Serviços</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Field label="Frontão" value={f.front} onChange={s("front")} unit="ml" hint="polimento lateral" />
            <Field label="Saia"    value={f.saia}  onChange={s("saia")}  unit="ml" hint="polimento lateral" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Sel label="Recorte de cuba"
              value={f.cuba} onChange={s("cuba")}
              options={[{ value: "nao", label: "Sem cuba" }, { value: "emb", label: "Embutida — R$ 350" }, { value: "sob", label: "Sobrepor — R$ 150" }]} />
            <Field label="Furos torneira (un.)" value={f.furos} onChange={s("furos")} step="1" hint="R$80/furo" />
          </div>
          <Toggle label="Incluir instalação" checked={f.inst} onChange={v => s("inst")(v)} />
        </Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card glow style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text2, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Total Mármore</div>
          <div style={{ fontFamily: C.head, fontSize: 28, fontWeight: 900, letterSpacing: "-1px", background: C.grad, backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{R(r.total)}</div>
          <div style={{ fontFamily: C.mono, fontSize: 12, color: C.text2, marginTop: 5 }}><span style={{ color: C.gold3 }}>{R(r.pm2)}</span> /m²</div>
          <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text3, marginTop: 4 }}>{r.chapas} chapa{r.chapas !== 1 ? "s" : ""} 3.0×1.5 m · e={f.esp}</div>
        </Card>
        <Card style={{ padding: "15px 17px" }}>
          <Row label="Área líquida"          value={`${N(r.area)} m²`} />
          <Row label="Área c/ perda"         value={`${N(r.areaC)} m² (${N(f.perda, 0)}%)`} />
          <Row label="Chapas (3.0×1.5 m)"   value={`${r.chapas} chapa${r.chapas !== 1 ? "s" : ""}`} />
          <GoldLine my={6} />
          <Row label="Material pedra"        value={R(r.matPedra)} />
          <Row label="Frontão"               value={r.front > 0 ? R(r.front) : "—"} />
          <Row label="Saia"                  value={r.saia  > 0 ? R(r.saia)  : "—"} />
          <Row label="Recortes (cuba+furos)" value={r.recortes > 0 ? R(r.recortes) : "—"} />
          <Row label="Instalação"            value={f.inst ? R(r.inst) : "—"} />
          <GoldLine my={6} />
          <Row label="Subtotal material"     value={R(r.totalMat)} />
          <Row label="TOTAL"                 value={R(r.total)} gold last />
        </Card>
        <Btn onClick={() => alert("Orçamento de mármore gerado!")} icon="save" variant="gold">Gerar orçamento</Btn>
      </div>
    </div>
  );
}

// ─── CALC PISO ────────────────────────────────────────────────────────────────
function CalcPiso() {
  const [f, setF] = useState({
    ew: 6, el: 8,          // ambiente (m)
    tw: 0.60, tl: 0.60,   // peça largura × comprimento (m)
    espPeca: 8,            // espessura da peça (mm) — NBR 13818
    junta: 3,              // largura da junta (mm)
    perda: 10,             // perda por recorte (%)
    ppc: 0,                // peças por caixa (0 = não mostrar)
    rodape: 0,             // rodapé (ml)
    pisoP: 75,             // piso R$/m²
    argP: 28,              // argamassa saco 20kg — R$
    rejP: 15,              // rejunte R$/kg
    rodapeP: 12,           // rodapé R$/ml
    moP: 40,               // mão de obra R$/m²
    inclMo: true,
    inclRodape: false,
  });
  const s = k => v => setF(p => ({ ...p, [k]: v }));

  const r = useMemo(() => {
    const area     = F(f.ew) * F(f.el);
    const tileArea = F(f.tw) * F(f.tl);
    const areaC    = area * (1 + F(f.perda) / 100);          // área c/ perda técnica
    const pecas    = tileArea > 0 ? Math.ceil(areaC / tileArea) : 0;
    const caixas   = F(f.ppc) > 0 ? Math.ceil(pecas / F(f.ppc)) : null;

    // Argamassa SINAPI AC III — consumo 5.5 kg/m², saco 20 kg
    const argKg    = areaC * 5.5;
    const argSacs  = Math.ceil(argKg / 20);

    // Rejunte — NBR 13818
    // C = ((L + A) / (L × A)) × e_junta × e_peça × ρ × (1 + perda)
    // onde ρ = 1.7 g/cm³, perda = 10%, fator = 1.7 × 10 × 1.1 = 18.7 → usa 17×1.1 = 18.7
    const L_cm      = F(f.tl) * 100;
    const A_cm      = F(f.tw) * 100;
    const junta_cm  = F(f.junta) / 10;
    const espP_cm   = F(f.espPeca) / 10;
    const rejKgM2   = (L_cm > 0 && A_cm > 0)
      ? ((L_cm + A_cm) / (L_cm * A_cm)) * junta_cm * espP_cm * 17 * 1.1
      : 0;
    const rejKg     = Math.ceil(areaC * rejKgM2 * 10) / 10;  // arredonda 0.1 kg

    // Custos
    const pisoCost  = areaC * F(f.pisoP);
    const argCost   = argSacs * F(f.argP);
    const rejCost   = rejKg  * F(f.rejP);
    const rodapeCost = f.inclRodape ? F(f.rodape) * F(f.rodapeP) : 0;
    const moCost    = f.inclMo ? area * F(f.moP) : 0;
    const total     = pisoCost + argCost + rejCost + rodapeCost + moCost;
    const pm2       = area > 0 ? total / area : 0;

    return { area, areaC, pecas, caixas, argSacs, argKg, rejKg, rejKgM2, pisoCost, argCost, rejCost, rodapeCost, moCost, total, pm2 };
  }, [f]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <Label>Ambiente</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Largura"      value={f.ew} onChange={s("ew")} unit="m" />
            <Field label="Comprimento"  value={f.el} onChange={s("el")} unit="m" />
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", padding: "9px 12px", background: C.bg2, borderRadius: 7, border: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.text2 }}>Área do ambiente</span>
            <span style={{ fontFamily: C.head, fontSize: 18, fontWeight: 700, color: C.gold3, letterSpacing: "-0.5px" }}>{N(r.area)} m²</span>
          </div>
        </Card>
        <Card>
          <Label>Peça / Revestimento</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <Field label="Largura (m)"    value={f.tw}      onChange={s("tw")}      hint="ex: 0.60" />
            <Field label="Comprimento (m)" value={f.tl}     onChange={s("tl")}      hint="ex: 0.60" />
            <Field label="Espessura (mm)" value={f.espPeca} onChange={s("espPeca")} hint="ex: 8" step="1" />
            <Field label="Junta (mm)"     value={f.junta}   onChange={s("junta")}   hint="ex: 3" step="0.5" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
            <Field label="Perda (%)"      value={f.perda} onChange={s("perda")} hint="recorte" />
            <Field label="Peças/caixa"    value={f.ppc}   onChange={s("ppc")}   hint="0 = ocultar" step="1" />
            <div style={{ padding: "9px 12px", background: C.bg2, borderRadius: 7, border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text3, marginBottom: 3 }}>Rej. NBR 13818</div>
              <div style={{ fontFamily: C.mono, fontSize: 12, color: C.gold3, fontWeight: 600 }}>{N(r.rejKgM2, 3)} kg/m²</div>
            </div>
          </div>
        </Card>
        <Card>
          <Label>Rodapé</Label>
          <Toggle label="Incluir rodapé" checked={f.inclRodape} onChange={v => s("inclRodape")(v)} />
          {f.inclRodape && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <Field label="Comprimento total" value={f.rodape}  onChange={s("rodape")}  unit="ml" />
              <Field label="Preço"              value={f.rodapeP} onChange={s("rodapeP")} unit="R$/ml" />
            </div>
          )}
        </Card>
        <Card>
          <Label>Valores</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Piso / Revestimento"  value={f.pisoP} onChange={s("pisoP")} unit="R$/m²" />
            <Field label="Argamassa (sc. 20kg)" value={f.argP}  onChange={s("argP")}  unit="R$/sc" />
            <Field label="Rejunte"              value={f.rejP}  onChange={s("rejP")}  unit="R$/kg" />
            <Field label="Mão de obra"          value={f.moP}   onChange={s("moP")}   unit="R$/m²" />
          </div>
          <Toggle label="Incluir mão de obra" checked={f.inclMo} onChange={v => s("inclMo")(v)} />
        </Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card glow style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text2, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Total Piso</div>
          <div style={{ fontFamily: C.head, fontSize: 28, fontWeight: 900, letterSpacing: "-1px", background: C.grad, backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{R(r.total)}</div>
          <div style={{ fontFamily: C.mono, fontSize: 12, color: C.text2, marginTop: 5 }}><span style={{ color: C.gold3 }}>{R(r.pm2)}</span> /m²</div>
        </Card>
        <Card style={{ padding: "15px 17px" }}>
          <Row label="Área líquida"    value={`${N(r.area)} m²`} />
          <Row label="Área c/ perda"   value={`${N(r.areaC)} m² (${N(f.perda, 0)}%)`} />
          <Row label="Qtd. de peças"   value={`${r.pecas.toLocaleString("pt-BR")} unid.`} />
          {r.caixas !== null && <Row label="Caixas"  value={`${r.caixas} cx.`} />}
          <GoldLine my={6} />
          <Row label="Piso / material" value={R(r.pisoCost)} />
          <Row label={`Argamassa ACIII (${r.argSacs} sc.)`} value={R(r.argCost)} />
          <Row label={`Rejunte NBR (${N(r.rejKg, 1)} kg)`}  value={R(r.rejCost)} />
          {f.inclRodape && <Row label={`Rodapé (${N(f.rodape, 0)} ml)`} value={R(r.rodapeCost)} />}
          <Row label="Mão de obra"     value={f.inclMo ? R(r.moCost) : "—"} />
          <GoldLine my={6} />
          <Row label="TOTAL"           value={R(r.total)} gold last />
        </Card>
        <Btn onClick={() => alert("Orçamento de piso gerado!")} icon="save" variant="gold">Gerar orçamento</Btn>
      </div>
    </div>
  );
}

// ─── CALC ALVENARIA ───────────────────────────────────────────────────────────
function CalcAlvenaria() {
  // mf = m³ argamassa/m² parede — coeficientes SINAPI assentamento
  const BLOCOS = {
    "9x19x39":   { n: "Bloco de Concreto 9×19×39",    l: .39, h: .19, mf: 0.022 },
    "14x19x39":  { n: "Bloco de Concreto 14×19×39",   l: .39, h: .19, mf: 0.027 },
    "19x19x39":  { n: "Bloco de Concreto 19×19×39",   l: .39, h: .19, mf: 0.032 },
    "tijolo_9f": { n: "Tijolo Cerâmico 9 Furos",      l: .29, h: .14, mf: 0.018 },
  };
  const [f, setF] = useState({ bloco: "9x19x39", alt: 3, comp: 10, ab: 4.5, blocoP: 2.5, argP: 28, moP: 35 });
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  const bloco = BLOCOS[f.bloco];

  const r = useMemo(() => {
    const bruta  = F(f.alt) * F(f.comp);
    const liq    = Math.max(0, bruta - F(f.ab));
    // área de face de cada bloco (c/ junta 10mm)
    const bA     = (bloco.l + 0.01) * (bloco.h + 0.01);
    const qty    = bA > 0 ? Math.ceil(liq / bA * 1.05) : 0;   // +5% quebra
    // argamassa: volume (m³) → massa seca 1.600 kg/m³ → sacos 20 kg
    const m3     = liq * bloco.mf;
    const sacs   = Math.ceil(m3 * 1600 / 20);
    const bCost  = qty  * F(f.blocoP);
    const mCost  = sacs * F(f.argP);
    const lCost  = liq  * F(f.moP);
    const total  = bCost + mCost + lCost;
    const pm2    = liq > 0 ? total / liq : 0;
    return { bruta, liq, qty, m3, sacs, bCost, mCost, lCost, total, pm2 };
  }, [f, bloco]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <Label>Tipo de Bloco / Tijolo</Label>
          <Sel value={f.bloco} onChange={s("bloco")} options={Object.entries(BLOCOS).map(([k, v]) => ({ value: k, label: v.n }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
            <Chip label="Comprimento"   value={`${bloco.l * 100} cm`} />
            <Chip label="Altura"        value={`${bloco.h * 100} cm`} />
            <Chip label="Arg./m² SINAPI" value={`${(bloco.mf * 1000).toFixed(0)} L`} />
          </div>
        </Card>
        <Card>
          <Label>Dimensões da Parede</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Altura"      value={f.alt}  onChange={s("alt")}  unit="m" />
            <Field label="Comprimento" value={f.comp} onChange={s("comp")} unit="m" />
            <Field label="Aberturas"   value={f.ab}   onChange={s("ab")}   unit="m²" hint="portas/janelas" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            <Chip label="Área bruta"   value={`${N(r.bruta)} m²`} />
            <Chip label="Área líquida" value={`${N(r.liq)} m²`} />
          </div>
        </Card>
        <Card>
          <Label>Valores</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Preço do bloco"    value={f.blocoP} onChange={s("blocoP")} unit="R$/un" step="0.10" />
            <Field label="Argamassa (sc.20kg)" value={f.argP} onChange={s("argP")}   unit="R$/sc" />
            <Field label="Mão de obra"        value={f.moP}   onChange={s("moP")}    unit="R$/m²" />
          </div>
        </Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card glow style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text2, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Total Alvenaria</div>
          <div style={{ fontFamily: C.head, fontSize: 28, fontWeight: 900, letterSpacing: "-1px", background: C.grad, backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{R(r.total)}</div>
          <div style={{ fontFamily: C.mono, fontSize: 12, color: C.text2, marginTop: 5 }}><span style={{ color: C.gold3 }}>{R(r.pm2)}</span> /m²</div>
        </Card>
        <Card style={{ padding: "15px 17px" }}>
          <Row label="Área bruta"                    value={`${N(r.bruta)} m²`} />
          <Row label="Área líquida (s/ aberturas)"   value={`${N(r.liq)} m²`} />
          <GoldLine my={6} />
          <Row label="Blocos necessários"            value={`${r.qty.toLocaleString("pt-BR")} unid. (+5%)`} />
          <Row label={`Argamassa (${r.sacs} sc.)`}  value={`${N(r.m3, 3)} m³`} />
          <GoldLine my={6} />
          <Row label="Custo dos blocos"              value={R(r.bCost)} />
          <Row label="Custo argamassa"               value={R(r.mCost)} />
          <Row label="Mão de obra"                   value={R(r.lCost)} />
          <GoldLine my={6} />
          <Row label="TOTAL"                         value={R(r.total)} gold last />
        </Card>
        <Btn onClick={() => alert("Orçamento de alvenaria gerado!")} icon="save" variant="gold">Gerar orçamento</Btn>
      </div>
    </div>
  );
}

// ─── CALC REBOCO ──────────────────────────────────────────────────────────────
function CalcReboco() {
  // yd = m²/saco a 1cm de espessura | fixo = não depende de espessura
  // saco referência: reboco/gesso 50 kg, massa corrida 18 kg, arg. 20 kg
  const TIPOS = {
    reboco:    { n: "Reboco Traçado 1:3 (50 kg)",       yd: 3.0,  saco: 50, fixo: false },
    gesso:     { n: "Gesso em Pó (40 kg)",              yd: 4.5,  saco: 40, fixo: false },
    massa:     { n: "Massa Corrida PVA (18 kg)",        yd: 10.0, saco: 18, fixo: true  },
    argamassa: { n: "Arg. de Regularização 1:4 (20 kg)", yd: 1.1, saco: 20, fixo: false },
  };
  const [f, setF] = useState({
    tipo: "reboco", parede: 40, teto: 20, esp: 2,
    chapisco: false, chapP: 32,
    matP: 32, moP: 28,
  });
  const s = k => v => setF(p => ({ ...p, [k]: v }));
  const tipo = TIPOS[f.tipo];

  const r = useMemo(() => {
    const area  = F(f.parede) + F(f.teto);
    const espCm = F(f.esp);
    // sacos de massa principal
    const sacs  = tipo.fixo
      ? Math.ceil(area / tipo.yd * 1.10)
      : Math.ceil(area * espCm / tipo.yd * 1.10);
    // chapisco opcional — ~5 kg/m², saco 50 kg → 10 m²/saco fixo
    const sacsChap = f.chapisco ? Math.ceil(area / 10 * 1.10) : 0;
    const mCost    = sacs    * F(f.matP);
    const chapCost = sacsChap * F(f.chapP);
    const lCost    = area * F(f.moP);
    const total    = mCost + chapCost + lCost;
    const pm2      = area > 0 ? total / area : 0;
    // rendimento exibido (a 1cm para tipos fixo mostramos m²/saco)
    const rendDisplay = tipo.fixo ? `${tipo.yd} m²/saco` : `${tipo.yd} m²/saco/cm`;
    return { area, sacs, sacsChap, mCost, chapCost, lCost, total, pm2, rendDisplay };
  }, [f, tipo]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <Label>Tipo de Massa</Label>
          <Sel value={f.tipo} onChange={s("tipo")} options={Object.entries(TIPOS).map(([k, v]) => ({ value: k, label: v.n }))} />
          <div style={{ marginTop: 12, padding: "9px 12px", background: C.bg2, borderRadius: 7, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.text2 }}>Rendimento</span>
            <span style={{ fontFamily: C.mono, fontSize: 12, color: C.gold3, fontWeight: 500 }}>{r.rendDisplay}</span>
          </div>
        </Card>
        <Card>
          <Label>Áreas e Espessura</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Área de parede" value={f.parede} onChange={s("parede")} unit="m²" />
            <Field label="Área de teto"   value={f.teto}   onChange={s("teto")}   unit="m²" />
            <Field label="Espessura"      value={f.esp}    onChange={s("esp")}    unit="cm" min="0.3" step="0.5"
              hint={tipo.fixo ? "não usado" : ""} />
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", padding: "9px 12px", background: C.bg2, borderRadius: 7, border: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.text2 }}>Área total</span>
            <span style={{ fontFamily: C.head, fontSize: 18, fontWeight: 700, color: C.gold3, letterSpacing: "-0.5px" }}>{N(r.area)} m²</span>
          </div>
        </Card>
        <Card>
          <Label>Chapisco</Label>
          <Toggle label="Incluir chapisco" checked={f.chapisco} onChange={v => s("chapisco")(v)} />
          {f.chapisco && (
            <div style={{ marginTop: 12 }}>
              <Field label="Preço do saco chapisco (50 kg)" value={f.chapP} onChange={s("chapP")} unit="R$" />
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text3, marginTop: 6 }}>
                ~5 kg/m² — saco 50 kg cobre ~10 m² (+10% perda)
              </div>
            </div>
          )}
        </Card>
        <Card>
          <Label>Valores</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label={`Saco ${tipo.saco} kg`} value={f.matP} onChange={s("matP")} unit="R$/sc" />
            <Field label="Mão de obra"              value={f.moP}  onChange={s("moP")}  unit="R$/m²" />
          </div>
        </Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card glow style={{ padding: "20px", textAlign: "center" }}>
          <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text2, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Total Reboco</div>
          <div style={{ fontFamily: C.head, fontSize: 28, fontWeight: 900, letterSpacing: "-1px", background: C.grad, backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{R(r.total)}</div>
          <div style={{ fontFamily: C.mono, fontSize: 12, color: C.text2, marginTop: 5 }}><span style={{ color: C.gold3 }}>{R(r.pm2)}</span> /m²</div>
        </Card>
        <Card style={{ padding: "15px 17px" }}>
          <Row label="Área de parede"    value={`${N(f.parede)} m²`} />
          <Row label="Área de teto"      value={`${N(f.teto)} m²`} />
          <Row label="Área total"        value={`${N(r.area)} m²`} />
          <GoldLine my={6} />
          {f.chapisco && <Row label={`Chapisco (${r.sacsChap} sc.)`} value={R(r.chapCost)} />}
          <Row label={`Massa (${r.sacs} sc. ${tipo.saco} kg)`} value={R(r.mCost)} />
          <Row label="Mão de obra"       value={R(r.lCost)} />
          <GoldLine my={6} />
          <Row label="TOTAL"             value={R(r.total)} gold last />
        </Card>
        <Btn onClick={() => alert("Orçamento de reboco gerado!")} icon="save" variant="gold">Gerar orçamento</Btn>
      </div>
    </div>
  );
}

// ─── CALCULADORAS (abas) ──────────────────────────────────────────────────────
function Calculadoras() {
  const [tab, setTab] = useState("marmore");
  const TABS = [
    { id: "marmore",   label: "Mármore" },
    { id: "piso",      label: "Piso" },
    { id: "alvenaria", label: "Alvenaria" },
    { id: "reboco",    label: "Reboco" },
  ];
  return (
    <div>
      {/* Tab bar — same style as landing nav */}
      <div style={{ display: "flex", gap: 2, marginBottom: 22, background: C.bg3, padding: 4, borderRadius: 9, width: "fit-content", border: `1px solid ${C.border}` }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{ padding: "7px 22px", borderRadius: 7, border: active ? `1px solid ${C.goldMid}` : "1px solid transparent", cursor: "pointer", fontFamily: C.mono, fontSize: 11, fontWeight: active ? 700 : 400, letterSpacing: "0.06em", transition: "all .15s", background: active ? C.grad : "transparent", backgroundSize: "200%", color: active ? C.bg : C.text2 }}>
              {t.label}
            </button>
          );
        })}
      </div>
      {tab === "marmore"   && <CalcMarmore />}
      {tab === "piso"      && <CalcPiso />}
      {tab === "alvenaria" && <CalcAlvenaria />}
      {tab === "reboco"    && <CalcReboco />}
    </div>
  );
}

// ─── DASHBOARD HOME ───────────────────────────────────────────────────────────
function Dashboard({ onNav }) {
  const KPIS = [
    { label: "Orçamentos do mês",    value: "47",         sub: "+12% vs anterior",    icon: I.quote },
    { label: "Valor total simulado", value: "R$ 284.750", sub: "32 simulações ativas", icon: I.trend },
    { label: "Ticket médio",         value: "R$ 6.059",   sub: "por orçamento",        icon: I.zap },
    { label: "Clientes cadastrados", value: "138",         sub: "+5 esta semana",       icon: I.people },
  ];

  const ORC = [
    { id: "#0047", cli: "Construtora Horizonte",   srv: "Mármore Carrara — Bancadas",    area: "24 m²",  val: "R$ 18.420", st: "ok" },
    { id: "#0046", cli: "Reforma Silva & Cia",      srv: "Porcelanato 60×60 — Sala",      area: "68 m²",  val: "R$ 12.240", st: "pend" },
    { id: "#0045", cli: "Eng. Roberto Dias",        srv: "Alvenaria + Reboco — Galpão",   area: "340 m²", val: "R$ 48.600", st: "ok" },
    { id: "#0044", cli: "Residencial Torres",       srv: "Granito São Gabriel — Escada",  area: "18 m²",  val: "R$ 9.800",  st: "rev" },
    { id: "#0043", cli: "Hotel Meridian",           srv: "Mármore Travertino — Hall",     area: "95 m²",  val: "R$ 87.400", st: "ok" },
  ];
  const ST = {
    ok:   { label: "Aprovado", color: "#7EBF8E", bg: "rgba(126,191,142,.1)",  border: "rgba(126,191,142,.25)" },
    pend: { label: "Pendente", color: C.gold3,   bg: C.goldDim,               border: C.goldMid },
    rev:  { label: "Revisão",  color: "#E07B54", bg: "rgba(224,123,84,.1)",   border: "rgba(224,123,84,.25)" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {KPIS.map(k => (
          <Card key={k.label} style={{ padding: "16px 18px" }}>
            <div style={{ position: "absolute", top: 0, inset: "0 0 auto 0", height: 1, background: `linear-gradient(90deg,transparent,${C.gold}40,transparent)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.text2, letterSpacing: "0.06em" }}>{k.label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: C.goldDim, border: `1px solid ${C.goldMid}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic d={k.icon} size={13} color={C.gold2} />
              </div>
            </div>
            <div style={{ fontFamily: C.head, fontSize: 20, fontWeight: 900, color: C.text, letterSpacing: "-0.5px" }}>{k.value}</div>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text3, marginTop: 4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* Quick access — matching landing's bento grid concept */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Nova Simulação",   desc: "Calcular preço por m²",    icon: I.sim,    page: "simulator" },
          { label: "Nova Calculadora", desc: "Mármore, piso, alvenaria",  icon: I.calc,   page: "calculadoras" },
          { label: "Novo Orçamento",   desc: "Criar proposta completa",   icon: I.quote,  page: "orcamento" },
        ].map(a => (
          <Card key={a.label} onClick={() => onNav(a.page)} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: C.goldDim, border: `1px solid ${C.goldMid}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ic d={a.icon} size={16} color={C.gold2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: C.head, fontSize: 12, fontWeight: 700, color: C.text, letterSpacing: "-0.3px" }}>{a.label}</div>
              <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text2, marginTop: 2 }}>{a.desc}</div>
            </div>
            <Ic d={I.chev} size={13} color={C.text3} />
          </Card>
        ))}
      </div>

      {/* Recent quotes */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: C.head, fontSize: 13, fontWeight: 900, color: C.text, letterSpacing: "-0.3px" }}>Orçamentos Recentes</span>
          <button onClick={() => onNav("orcamento")} style={{ fontFamily: C.mono, fontSize: 10, color: C.gold2, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.05em" }}>VER TODOS →</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg2 }}>
              {["Nº", "Cliente", "Serviço", "Área", "Valor", "Status"].map(h => (
                <th key={h} style={{ padding: "9px 18px", textAlign: "left", fontFamily: C.mono, fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORC.map(o => {
              const st = ST[o.st];
              return (
                <tr key={o.id} style={{ borderTop: `1px solid ${C.border}`, transition: "background .12s" }}
                  onMouseOver={e => e.currentTarget.style.background = C.bg2}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 11, color: C.text3 }}>{o.id}</td>
                  <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.text }}>{o.cli}</td>
                  <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{o.srv}</td>
                  <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{o.area}</td>
                  <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.gold3 }}>{o.val}</td>
                  <td style={{ padding: "11px 18px" }}>
                    <span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.07em", background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                      {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── NOVO ORÇAMENTO ──────────────────────────────────────────────────────────
function NovoOrcamento({ onNav }) {
  const [orcamentos, setOrcamentos] = useState(() => {
    try { return JSON.parse(localStorage.getItem("co_orcamentos") || "[]"); } catch { return []; }
  });
  const [view, setView] = useState("list"); // list | form
  const [edit, setEdit] = useState(null);
  const [f, setF] = useState({ cliente: "", servico: "", descricao: "", area: "", valorM2: "", maoObra: "", extras: 0, margem: 15, status: "rascunho" });
  const s = k => v => setF(p => ({ ...p, [k]: v }));

  const save = (list) => { setOrcamentos(list); localStorage.setItem("co_orcamentos", JSON.stringify(list)); };

  const r = useMemo(() => {
    const area = F(f.area); const mat = area * F(f.valorM2); const mo = area * F(f.maoObra); const extras = F(f.extras);
    const sub = mat + mo + extras; const lucro = sub * (F(f.margem) / 100); const total = sub + lucro;
    return { area, mat, mo, extras, sub, lucro, total, pm2: area > 0 ? total / area : 0 };
  }, [f]);

  const handleSave = () => {
    if (!f.cliente || !f.servico) return alert("Preencha cliente e serviço.");
    const orc = { ...f, id: edit?.id || `#${String(orcamentos.length + 1).padStart(4, "0")}`, total: r.total, area: f.area, criadoEm: edit?.criadoEm || new Date().toISOString(), atualizadoEm: new Date().toISOString() };
    if (edit) { save(orcamentos.map(o => o.id === edit.id ? orc : o)); } else { save([orc, ...orcamentos]); }
    setView("list"); setEdit(null); setF({ cliente: "", servico: "", descricao: "", area: "", valorM2: "", maoObra: "", extras: 0, margem: 15, status: "rascunho" });
  };

  const handleDelete = (id) => { if (confirm("Excluir este orçamento?")) save(orcamentos.filter(o => o.id !== id)); };

  const handleEdit = (orc) => { setF({ cliente: orc.cliente, servico: orc.servico, descricao: orc.descricao || "", area: orc.area, valorM2: orc.valorM2, maoObra: orc.maoObra, extras: orc.extras, margem: orc.margem, status: orc.status }); setEdit(orc); setView("form"); };

  const ST = {
    rascunho: { label: "Rascunho", color: C.text2, bg: C.bg5, border: C.border2 },
    enviado:  { label: "Enviado",  color: "#5B9BD5", bg: "rgba(91,155,213,.1)", border: "rgba(91,155,213,.25)" },
    aprovado: { label: "Aprovado", color: "#7EBF8E", bg: "rgba(126,191,142,.1)", border: "rgba(126,191,142,.25)" },
    recusado: { label: "Recusado", color: "#E07B54", bg: "rgba(224,123,84,.1)", border: "rgba(224,123,84,.25)" },
  };

  if (view === "form") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <button onClick={() => { setView("list"); setEdit(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontFamily: C.mono, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Ic d={I.chev} size={12} /></span> Voltar
          </button>
          <span style={{ fontFamily: C.head, fontSize: 14, fontWeight: 900, color: C.text }}>{edit ? `Editar ${edit.id}` : "Novo Orçamento"}</span>
        </div>
        <Card>
          <Label>Informações do Orçamento</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Cliente" value={f.cliente} onChange={s("cliente")} type="text" placeholder="Nome do cliente" />
            <Field label="Serviço" value={f.servico} onChange={s("servico")} type="text" placeholder="Ex: Piso porcelanato" />
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Descrição" value={f.descricao} onChange={s("descricao")} type="text" placeholder="Detalhes do serviço..." />
          </div>
        </Card>
        <Card>
          <Label>Valores</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="Área total" value={f.area} onChange={s("area")} unit="m²" />
            <Field label="Material por m²" value={f.valorM2} onChange={s("valorM2")} unit="R$" />
            <Field label="Mão de obra por m²" value={f.maoObra} onChange={s("maoObra")} unit="R$" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Field label="Custos extras" value={f.extras} onChange={s("extras")} unit="R$" />
            <Field label="Margem de lucro" value={f.margem} onChange={s("margem")} unit="%" />
          </div>
        </Card>
        <Card>
          <Label>Status</Label>
          <Sel value={f.status} onChange={s("status")} options={[
            { value: "rascunho", label: "Rascunho" }, { value: "enviado", label: "Enviado" },
            { value: "aprovado", label: "Aprovado" }, { value: "recusado", label: "Recusado" },
          ]} />
        </Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, alignSelf: "flex-start", padding: "4px 11px", background: C.goldDim, border: `1px solid ${C.goldMid}`, borderRadius: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, animation: "breathe 2s infinite" }} />
          <span style={{ fontFamily: C.mono, fontSize: 9, color: C.gold2, letterSpacing: "0.12em" }}>PRÉVIA DO ORÇAMENTO</span>
        </div>
        <Card glow style={{ padding: "22px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text2, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Valor Final</div>
          <div style={{ fontFamily: C.head, fontSize: 30, fontWeight: 900, letterSpacing: "-1.5px", background: C.grad, backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer-move 5s linear infinite" }}>{R(r.total)}</div>
          <div style={{ marginTop: 8, fontFamily: C.mono, fontSize: 13, color: C.text2 }}><span style={{ color: C.gold3, fontWeight: 500 }}>{R(r.pm2)}</span> <span style={{ fontSize: 10 }}>por m²</span></div>
        </Card>
        <Card style={{ padding: "16px 18px" }}>
          <Label>Composição</Label>
          <Row label="Área total" value={`${N(r.area)} m²`} />
          <Row label="Material" value={R(r.mat)} />
          <Row label="Mão de obra" value={R(r.mo)} />
          <Row label="Extras" value={R(r.extras)} />
          <GoldLine />
          <Row label="Subtotal" value={R(r.sub)} />
          <Row label={`Lucro (${f.margem}%)`} value={R(r.lucro)} gold />
          <Row label="TOTAL" value={R(r.total)} gold last />
        </Card>
        <Btn onClick={handleSave} icon="save" variant="gold">{edit ? "Atualizar orçamento" : "Salvar orçamento"}</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{orcamentos.length} orçamento{orcamentos.length !== 1 ? "s" : ""} cadastrado{orcamentos.length !== 1 ? "s" : ""}</div>
        <Btn onClick={() => { setEdit(null); setF({ cliente: "", servico: "", descricao: "", area: "", valorM2: "", maoObra: "", extras: 0, margem: 15, status: "rascunho" }); setView("form"); }} icon="plus" variant="gold" sm>Novo orçamento</Btn>
      </div>
      {orcamentos.length === 0 ? (
        <Card style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: C.goldDim, border: `1px solid ${C.goldMid}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><Ic d={I.quote} size={24} color={C.gold2} /></div>
          <div style={{ fontFamily: C.head, fontSize: 15, fontWeight: 900, color: C.text2 }}>Nenhum orçamento ainda</div>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: C.text3, marginTop: 6, marginBottom: 18 }}>Crie seu primeiro orçamento para começar</div>
          <Btn onClick={() => { setEdit(null); setF({ cliente: "", servico: "", descricao: "", area: "", valorM2: "", maoObra: "", extras: 0, margem: 15, status: "rascunho" }); setView("form"); }} icon="plus" variant="gold">Criar primeiro orçamento</Btn>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.bg2 }}>
                {["Nº", "Cliente", "Serviço", "Área", "Valor", "Status", "Ações"].map(h => (
                  <th key={h} style={{ padding: "9px 18px", textAlign: "left", fontFamily: C.mono, fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orcamentos.map(o => {
                const st = ST[o.status] || ST.rascunho;
                return (
                  <tr key={o.id} style={{ borderTop: `1px solid ${C.border}`, transition: "background .12s" }}
                    onMouseOver={e => e.currentTarget.style.background = C.bg2}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 11, color: C.text3 }}>{o.id}</td>
                    <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.text }}>{o.cliente}</td>
                    <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{o.servico}</td>
                    <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{o.area} m²</td>
                    <td style={{ padding: "11px 18px", fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.gold3 }}>{R(o.total)}</td>
                    <td style={{ padding: "11px 18px" }}><span style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.07em", background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>{st.label}</span></td>
                    <td style={{ padding: "11px 18px", display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(o)} style={{ background: C.goldDim, border: `1px solid ${C.goldMid}`, borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: C.mono, fontSize: 9, color: C.gold2 }}>Editar</button>
                      <button onClick={() => handleDelete(o.id)} style={{ background: "rgba(224,123,84,.08)", border: "1px solid rgba(224,123,84,.2)", borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: C.mono, fontSize: 9, color: "#E07B54" }}>Excluir</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ─── CLIENTES ────────────────────────────────────────────────────────────────
function Clientes() {
  const [clientes, setClientes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("co_clientes") || "[]"); } catch { return []; }
  });
  const [view, setView] = useState("list");
  const [edit, setEdit] = useState(null);
  const [f, setF] = useState({ nome: "", email: "", telefone: "", cpfCnpj: "", endereco: "", notas: "" });
  const s = k => v => setF(p => ({ ...p, [k]: v }));

  const save = (list) => { setClientes(list); localStorage.setItem("co_clientes", JSON.stringify(list)); };

  const handleSave = () => {
    if (!f.nome) return alert("Preencha o nome do cliente.");
    const cli = { ...f, id: edit?.id || `CLI-${String(clientes.length + 1).padStart(3, "0")}`, criadoEm: edit?.criadoEm || new Date().toISOString(), atualizadoEm: new Date().toISOString() };
    if (edit) { save(clientes.map(c => c.id === edit.id ? cli : c)); } else { save([cli, ...clientes]); }
    setView("list"); setEdit(null); setF({ nome: "", email: "", telefone: "", cpfCnpj: "", endereco: "", notas: "" });
  };

  const handleDelete = (id) => { if (confirm("Excluir este cliente?")) save(clientes.filter(c => c.id !== id)); };
  const handleEdit = (cli) => { setF({ nome: cli.nome, email: cli.email, telefone: cli.telefone, cpfCnpj: cli.cpfCnpj, endereco: cli.endereco, notas: cli.notas || "" }); setEdit(cli); setView("form"); };

  // Count orcamentos per client
  const orcamentos = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("co_orcamentos") || "[]"); } catch { return []; }
  }, [clientes]);

  if (view === "form") return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <button onClick={() => { setView("list"); setEdit(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontFamily: C.mono, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}><Ic d={I.chev} size={12} /></span> Voltar
        </button>
        <span style={{ fontFamily: C.head, fontSize: 14, fontWeight: 900, color: C.text }}>{edit ? `Editar ${edit.nome}` : "Novo Cliente"}</span>
      </div>
      <Card>
        <Label>Dados do Cliente</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Nome completo" value={f.nome} onChange={s("nome")} type="text" placeholder="Nome do cliente" />
          <Field label="CPF / CNPJ" value={f.cpfCnpj} onChange={s("cpfCnpj")} type="text" placeholder="000.000.000-00" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <Field label="E-mail" value={f.email} onChange={s("email")} type="text" placeholder="email@exemplo.com" />
          <Field label="Telefone" value={f.telefone} onChange={s("telefone")} type="text" placeholder="(00) 00000-0000" />
        </div>
        <div style={{ marginTop: 12 }}>
          <Field label="Endereço" value={f.endereco} onChange={s("endereco")} type="text" placeholder="Rua, nº, bairro, cidade" />
        </div>
        <div style={{ marginTop: 12 }}>
          <Field label="Observações" value={f.notas} onChange={s("notas")} type="text" placeholder="Notas sobre o cliente..." />
        </div>
      </Card>
      <div style={{ marginTop: 14 }}>
        <Btn onClick={handleSave} icon="save" variant="gold">{edit ? "Atualizar cliente" : "Cadastrar cliente"}</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{clientes.length} cliente{clientes.length !== 1 ? "s" : ""} cadastrado{clientes.length !== 1 ? "s" : ""}</div>
        <Btn onClick={() => { setEdit(null); setF({ nome: "", email: "", telefone: "", cpfCnpj: "", endereco: "", notas: "" }); setView("form"); }} icon="plus" variant="gold" sm>Novo cliente</Btn>
      </div>
      {clientes.length === 0 ? (
        <Card style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: C.goldDim, border: `1px solid ${C.goldMid}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><Ic d={I.people} size={24} color={C.gold2} /></div>
          <div style={{ fontFamily: C.head, fontSize: 15, fontWeight: 900, color: C.text2 }}>Nenhum cliente cadastrado</div>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: C.text3, marginTop: 6 }}>Cadastre seu primeiro cliente para começar</div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {clientes.map(cli => {
            const qtdOrc = orcamentos.filter(o => o.cliente === cli.nome).length;
            return (
              <Card key={cli.id} style={{ padding: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.grad, backgroundSize: "200%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.head, fontSize: 12, fontWeight: 900, color: C.bg, flexShrink: 0 }}>
                    {cli.nome.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: C.head, fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "-0.3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cli.nome}</div>
                    <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text2, marginTop: 2 }}>{cli.id}</div>
                  </div>
                </div>
                {cli.email && <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text2, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cli.email}</div>}
                {cli.telefone && <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text2, marginBottom: 4 }}>{cli.telefone}</div>}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Chip label="Orçamentos" value={qtdOrc} />
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <button onClick={() => handleEdit(cli)} style={{ flex: 1, background: C.goldDim, border: `1px solid ${C.goldMid}`, borderRadius: 5, padding: "6px", cursor: "pointer", fontFamily: C.mono, fontSize: 9, color: C.gold2 }}>Editar</button>
                  <button onClick={() => handleDelete(cli.id)} style={{ background: "rgba(224,123,84,.08)", border: "1px solid rgba(224,123,84,.2)", borderRadius: 5, padding: "6px 10px", cursor: "pointer", fontFamily: C.mono, fontSize: 9, color: "#E07B54" }}>Excluir</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MATERIAIS ───────────────────────────────────────────────────────────────
function Materiais() {
  const DEFAULT_MATERIAIS = [
    { id: "M001", categoria: "Piso", nome: "Porcelanato 60×60 Polido", unid: "m²", preco: 85, fornecedor: "Portobello" },
    { id: "M002", categoria: "Piso", nome: "Porcelanato 80×80 Acetinado", unid: "m²", preco: 120, fornecedor: "Eliane" },
    { id: "M003", categoria: "Piso", nome: "Cerâmica 45×45", unid: "m²", preco: 42, fornecedor: "Incefra" },
    { id: "M004", categoria: "Pedra", nome: "Granito São Gabriel", unid: "m²", preco: 320, fornecedor: "Marmoraria ABC" },
    { id: "M005", categoria: "Pedra", nome: "Granito Branco Itaúnas", unid: "m²", preco: 380, fornecedor: "Marmoraria ABC" },
    { id: "M006", categoria: "Pedra", nome: "Mármore Carrara", unid: "m²", preco: 680, fornecedor: "Marmoraria ABC" },
    { id: "M007", categoria: "Alvenaria", nome: "Bloco 9×19×39", unid: "un", preco: 2.5, fornecedor: "Blocos Brasil" },
    { id: "M008", categoria: "Alvenaria", nome: "Bloco 14×19×39 Estrutural", unid: "un", preco: 3.8, fornecedor: "Blocos Brasil" },
    { id: "M009", categoria: "Alvenaria", nome: "Tijolo Cerâmico 9 furos", unid: "un", preco: 1.2, fornecedor: "Cerâmica Bela Vista" },
    { id: "M010", categoria: "Revestimento", nome: "Argamassa ACII (20kg)", unid: "sc", preco: 28, fornecedor: "Votoran" },
    { id: "M011", categoria: "Revestimento", nome: "Rejunte Flexível", unid: "kg", preco: 15, fornecedor: "Quartzolit" },
    { id: "M012", categoria: "Revestimento", nome: "Massa Corrida PVA (25kg)", unid: "sc", preco: 32, fornecedor: "Suvinil" },
    { id: "M013", categoria: "Revestimento", nome: "Gesso em pó (40kg)", unid: "sc", preco: 28, fornecedor: "Gesso Fácil" },
    { id: "M014", categoria: "Mão de Obra", nome: "Instalação Piso", unid: "m²", preco: 45, fornecedor: "—" },
    { id: "M015", categoria: "Mão de Obra", nome: "Instalação Mármore", unid: "m²", preco: 180, fornecedor: "—" },
    { id: "M016", categoria: "Mão de Obra", nome: "Alvenaria", unid: "m²", preco: 35, fornecedor: "—" },
    { id: "M017", categoria: "Mão de Obra", nome: "Reboco / Massa", unid: "m²", preco: 28, fornecedor: "—" },
  ];

  const [materiais, setMateriais] = useState(() => {
    try { const s = localStorage.getItem("co_materiais"); return s ? JSON.parse(s) : DEFAULT_MATERIAIS; } catch { return DEFAULT_MATERIAIS; }
  });
  const [filtro, setFiltro] = useState("Todos");
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [nf, setNf] = useState({ categoria: "Piso", nome: "", unid: "m²", preco: "", fornecedor: "" });

  const save = (list) => { setMateriais(list); localStorage.setItem("co_materiais", JSON.stringify(list)); };

  const categorias = useMemo(() => ["Todos", ...new Set(materiais.map(m => m.categoria))], [materiais]);
  const filtered = filtro === "Todos" ? materiais : materiais.filter(m => m.categoria === filtro);

  const handlePriceEdit = (id, preco) => { save(materiais.map(m => m.id === id ? { ...m, preco: F(preco) } : m)); setEditId(null); };
  const handleDelete = (id) => { save(materiais.filter(m => m.id !== id)); };
  const handleAdd = () => {
    if (!nf.nome || !nf.preco) return alert("Preencha nome e preço.");
    save([...materiais, { ...nf, preco: F(nf.preco), id: `M${String(materiais.length + 1).padStart(3, "0")}` }]);
    setNf({ categoria: "Piso", nome: "", unid: "m²", preco: "", fornecedor: "" }); setShowAdd(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 2, background: C.bg3, padding: 4, borderRadius: 9, border: `1px solid ${C.border}` }}>
          {categorias.map(cat => (
            <button key={cat} onClick={() => setFiltro(cat)} style={{ padding: "6px 16px", borderRadius: 7, border: filtro === cat ? `1px solid ${C.goldMid}` : "1px solid transparent", cursor: "pointer", fontFamily: C.mono, fontSize: 10, fontWeight: filtro === cat ? 700 : 400, background: filtro === cat ? C.grad : "transparent", backgroundSize: "200%", color: filtro === cat ? C.bg : C.text2 }}>{cat}</button>
          ))}
        </div>
        <Btn onClick={() => setShowAdd(!showAdd)} icon="plus" variant="gold" sm>Adicionar material</Btn>
      </div>

      {showAdd && (
        <Card>
          <Label>Novo Material</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 0.7fr 1fr 1.3fr auto", gap: 10, alignItems: "end" }}>
            <Sel label="Categoria" value={nf.categoria} onChange={v => setNf(p => ({ ...p, categoria: v }))} options={["Piso", "Pedra", "Alvenaria", "Revestimento", "Mão de Obra"]} />
            <Field label="Nome" value={nf.nome} onChange={v => setNf(p => ({ ...p, nome: v }))} type="text" placeholder="Nome do material" />
            <Sel label="Unidade" value={nf.unid} onChange={v => setNf(p => ({ ...p, unid: v }))} options={["m²", "ml", "un", "sc", "kg", "m³"]} />
            <Field label="Preço" value={nf.preco} onChange={v => setNf(p => ({ ...p, preco: v }))} unit="R$" />
            <Field label="Fornecedor" value={nf.fornecedor} onChange={v => setNf(p => ({ ...p, fornecedor: v }))} type="text" placeholder="Opcional" />
            <Btn onClick={handleAdd} icon="check" variant="gold" sm>Salvar</Btn>
          </div>
        </Card>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg2 }}>
              {["Código", "Categoria", "Material", "Unidade", "Preço", "Fornecedor", ""].map(h => (
                <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontFamily: C.mono, fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderTop: `1px solid ${C.border}`, transition: "background .12s" }}
                onMouseOver={e => e.currentTarget.style.background = C.bg2}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 10, color: C.text3 }}>{m.id}</td>
                <td style={{ padding: "10px 16px" }}>
                  <span style={{ fontFamily: C.mono, fontSize: 9, padding: "2px 8px", borderRadius: 12, background: C.goldDim, border: `1px solid ${C.goldMid}`, color: C.gold2 }}>{m.categoria}</span>
                </td>
                <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.text }}>{m.nome}</td>
                <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{m.unid}</td>
                <td style={{ padding: "10px 16px" }}>
                  {editId === m.id ? (
                    <input autoFocus value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={() => handlePriceEdit(m.id, editVal)}
                      onKeyDown={e => e.key === "Enter" && handlePriceEdit(m.id, editVal)}
                      style={{ width: 80, padding: "4px 8px", background: C.bg2, border: `1px solid ${C.goldMid}`, borderRadius: 5, color: C.gold3, fontSize: 12, fontFamily: C.mono, outline: "none" }} />
                  ) : (
                    <span onClick={() => { setEditId(m.id); setEditVal(String(m.preco)); }} style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.gold3, cursor: "pointer", padding: "2px 6px", borderRadius: 4, border: `1px dashed transparent`, transition: "border .15s" }}
                      onMouseOver={e => e.target.style.borderColor = C.goldMid}
                      onMouseOut={e => e.target.style.borderColor = "transparent"}>{R(m.preco)}</span>
                  )}
                </td>
                <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{m.fornecedor}</td>
                <td style={{ padding: "10px 16px" }}>
                  <button onClick={() => handleDelete(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.text3, fontSize: 11, fontFamily: C.mono }}
                    onMouseOver={e => e.target.style.color = "#E07B54"} onMouseOut={e => e.target.style.color = C.text3}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text3, textAlign: "right" }}>Clique no preço para editar rapidamente</div>
    </div>
  );
}

// ─── RELATÓRIOS ──────────────────────────────────────────────────────────────
function Relatorios() {
  const orcamentos = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("co_orcamentos") || "[]"); } catch { return []; }
  }, []);
  const clientes = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("co_clientes") || "[]"); } catch { return []; }
  }, []);

  const stats = useMemo(() => {
    const total = orcamentos.reduce((s, o) => s + (o.total || 0), 0);
    const aprovados = orcamentos.filter(o => o.status === "aprovado");
    const totalAprovado = aprovados.reduce((s, o) => s + (o.total || 0), 0);
    const ticket = orcamentos.length > 0 ? total / orcamentos.length : 0;
    const porStatus = { rascunho: 0, enviado: 0, aprovado: 0, recusado: 0 };
    orcamentos.forEach(o => { if (porStatus[o.status] !== undefined) porStatus[o.status]++; });
    const porServico = {};
    orcamentos.forEach(o => { porServico[o.servico] = (porServico[o.servico] || 0) + 1; });
    const topServicos = Object.entries(porServico).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const taxa = orcamentos.length > 0 ? (aprovados.length / orcamentos.length * 100) : 0;
    return { total, totalAprovado, ticket, porStatus, topServicos, taxa, aprovados: aprovados.length };
  }, [orcamentos]);

  const maxBar = Math.max(stats.porStatus.rascunho, stats.porStatus.enviado, stats.porStatus.aprovado, stats.porStatus.recusado, 1);
  const statusColors = { rascunho: C.text2, enviado: "#5B9BD5", aprovado: "#7EBF8E", recusado: "#E07B54" };
  const statusLabels = { rascunho: "Rascunho", enviado: "Enviado", aprovado: "Aprovado", recusado: "Recusado" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Total em orçamentos", value: R(stats.total), sub: `${orcamentos.length} orçamentos`, icon: I.trend },
          { label: "Valor aprovado", value: R(stats.totalAprovado), sub: `${stats.aprovados} aprovados`, icon: I.check },
          { label: "Ticket médio", value: R(stats.ticket), sub: "por orçamento", icon: I.zap },
          { label: "Taxa de aprovação", value: `${N(stats.taxa, 0)}%`, sub: `${stats.aprovados} de ${orcamentos.length}`, icon: I.bar },
        ].map(k => (
          <Card key={k.label} style={{ padding: "16px 18px" }}>
            <div style={{ position: "absolute", top: 0, inset: "0 0 auto 0", height: 1, background: `linear-gradient(90deg,transparent,${C.gold}40,transparent)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontFamily: C.mono, fontSize: 9, color: C.text2, letterSpacing: "0.06em" }}>{k.label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: C.goldDim, border: `1px solid ${C.goldMid}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic d={k.icon} size={13} color={C.gold2} /></div>
            </div>
            <div style={{ fontFamily: C.head, fontSize: 20, fontWeight: 900, color: C.text, letterSpacing: "-0.5px" }}>{k.value}</div>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text3, marginTop: 4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Status chart */}
        <Card style={{ padding: "18px" }}>
          <Label>Orçamentos por Status</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            {Object.entries(stats.porStatus).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 11, color: statusColors[key], fontWeight: 600 }}>{statusLabels[key]}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 12, color: C.text, fontWeight: 700 }}>{val}</span>
                </div>
                <div style={{ height: 6, background: C.bg5, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(val / maxBar) * 100}%`, background: statusColors[key], borderRadius: 3, transition: "width .4s" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top services */}
        <Card style={{ padding: "18px" }}>
          <Label>Serviços Mais Solicitados</Label>
          {stats.topServicos.length === 0 ? (
            <div style={{ fontFamily: C.mono, fontSize: 11, color: C.text3, textAlign: "center", padding: "30px 0" }}>Nenhum dado disponível</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {stats.topServicos.map(([srv, qty], i) => (
                <div key={srv} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: i === 0 ? C.goldDim : C.bg2, borderRadius: 7, border: `1px solid ${i === 0 ? C.goldMid : C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: C.head, fontSize: 14, fontWeight: 900, color: i === 0 ? C.gold2 : C.text3, width: 22 }}>{i + 1}º</span>
                    <span style={{ fontFamily: C.mono, fontSize: 11, color: i === 0 ? C.gold3 : C.text }}>{srv}</span>
                  </div>
                  <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: i === 0 ? C.gold3 : C.text2 }}>{qty}×</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ padding: "18px" }}>
          <Label>Resumo de Clientes</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Chip label="Total cadastrados" value={clientes.length} />
            <Chip label="Com orçamentos" value={new Set(orcamentos.map(o => o.cliente)).size} />
          </div>
        </Card>
        <Card style={{ padding: "18px" }}>
          <Label>Resumo Financeiro</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Chip label="Pendente" value={R(orcamentos.filter(o => o.status === "enviado" || o.status === "rascunho").reduce((s, o) => s + (o.total || 0), 0))} />
            <Chip label="Confirmado" value={R(stats.totalAprovado)} />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── CONFIGURAÇÕES ───────────────────────────────────────────────────────────
function Configuracoes() {
  const [config, setConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem("co_config") || "{}"); } catch { return {}; }
  });
  const [f, setF] = useState({
    nomeEmpresa: config.nomeEmpresa || "CalcObra Pro",
    responsavel: config.responsavel || "João Menezes",
    email: config.email || "contato@calcobra.com.br",
    telefone: config.telefone || "(11) 99999-9999",
    cnpj: config.cnpj || "",
    endereco: config.endereco || "",
    perdaPadrao: config.perdaPadrao || "10",
    margemPadrao: config.margemPadrao || "25",
    moedaSimbolo: config.moedaSimbolo || "R$",
  });
  const [saved, setSaved] = useState(false);
  const s = k => v => setF(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    localStorage.setItem("co_config", JSON.stringify(f));
    setConfig(f);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearData = () => {
    if (confirm("Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("co_orcamentos");
      localStorage.removeItem("co_clientes");
      localStorage.removeItem("co_materiais");
      localStorage.removeItem("co_config");
      alert("Todos os dados foram apagados. Recarregue a página.");
    }
  };

  return (
    <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <Label>Dados da Empresa</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Nome da empresa" value={f.nomeEmpresa} onChange={s("nomeEmpresa")} type="text" />
          <Field label="Responsável" value={f.responsavel} onChange={s("responsavel")} type="text" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <Field label="E-mail" value={f.email} onChange={s("email")} type="text" />
          <Field label="Telefone" value={f.telefone} onChange={s("telefone")} type="text" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <Field label="CNPJ" value={f.cnpj} onChange={s("cnpj")} type="text" placeholder="00.000.000/0000-00" />
          <Field label="Endereço" value={f.endereco} onChange={s("endereco")} type="text" placeholder="Endereço comercial" />
        </div>
      </Card>

      <Card>
        <Label>Padrões de Cálculo</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="Perda padrão" value={f.perdaPadrao} onChange={s("perdaPadrao")} unit="%" hint="aplicado nos cálculos" />
          <Field label="Margem padrão" value={f.margemPadrao} onChange={s("margemPadrao")} unit="%" hint="lucro padrão" />
          <Field label="Moeda" value={f.moedaSimbolo} onChange={s("moedaSimbolo")} type="text" />
        </div>
      </Card>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Btn onClick={handleSave} icon="save" variant="gold">Salvar configurações</Btn>
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 11px", background: "rgba(126,191,142,.08)", border: "1px solid rgba(126,191,142,.22)", borderRadius: 20, fontFamily: C.mono, fontSize: 10, color: "#7EBF8E" }}>
            <Ic d={I.check} size={11} color="#7EBF8E" /> Salvo com sucesso
          </div>
        )}
      </div>

      <GoldLine my={20} />

      <Card style={{ borderColor: "rgba(224,123,84,.2)" }}>
        <Label>Zona de Perigo</Label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: C.mono, fontSize: 12, color: C.text, fontWeight: 600 }}>Apagar todos os dados</div>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text3, marginTop: 2 }}>Remove orçamentos, clientes, materiais e configurações</div>
          </div>
          <button onClick={handleClearData} style={{ padding: "7px 16px", background: "rgba(224,123,84,.1)", border: "1px solid rgba(224,123,84,.3)", borderRadius: 7, cursor: "pointer", fontFamily: C.mono, fontSize: 11, fontWeight: 600, color: "#E07B54" }}
            onMouseOver={e => e.target.style.background = "rgba(224,123,84,.2)"} onMouseOut={e => e.target.style.background = "rgba(224,123,84,.1)"}>Apagar tudo</button>
        </div>
      </Card>
    </div>
  );
}

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────
const Logo = () => (
  <svg viewBox="0 0 36 36" width="28" height="28" fill="none">
    <defs>
      <linearGradient id="gl" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#C9982A" />
        <stop offset="50%"  stopColor="#EEC85A" />
        <stop offset="100%" stopColor="#C9982A" />
      </linearGradient>
    </defs>
    <polygon points="18,2.5 31,9.75 31,26.25 18,33.5 5,26.25 5,9.75" stroke="url(#gl)" strokeWidth="1.1" fill="rgba(201,152,42,0.07)" />
    <circle cx="18" cy="18" r="3.2" fill="url(#gl)" />
    <line x1="18" y1="9"  x2="18" y2="12.5"  stroke="url(#gl)" strokeWidth="1.1" />
    <line x1="18" y1="23.5" x2="18" y2="27" stroke="url(#gl)" strokeWidth="1.1" />
  </svg>
);

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
function App() {
  const [page, setPage]   = useState("dashboard");
  const [saved, setSaved] = useState(0);
  const logged = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('co_logged') || 'null'); } catch(e){ return null; }
  }, []);
  const userName = logged ? logged.name : 'Usuário';
  const userInitials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const doLogout = () => { localStorage.removeItem('co_logged'); window.location.href = 'calcobra-ultra.html'; };

  const NAV = [
    { id: "dashboard",    label: "Dashboard",      icon: I.dash },
    { id: "orcamento",    label: "Novo orçamento", icon: I.quote },
    { id: "simulator",   label: "Simulador SINAPI", icon: I.sim },
    { id: "calculadoras",label: "Calculadoras",   icon: I.calc },
    { id: "clientes",    label: "Clientes",        icon: I.people },
    { id: "materiais",   label: "Materiais",       icon: I.tag },
    { id: "relatorios",  label: "Relatórios",      icon: I.bar },
    { id: "config",      label: "Configurações",   icon: I.cog },
  ];
  const TITLE = { dashboard: "Dashboard", orcamento: "Novo Orçamento", simulator: "Simulador SINAPI — Custo por m²", calculadoras: "Calculadoras", clientes: "Clientes", materiais: "Materiais", relatorios: "Relatórios", config: "Configurações" };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, fontFamily: C.mono, overflow: "hidden" }}>
      <style>{CSS}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 204, background: C.bg2, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: "18px 16px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
          <div>
            <div style={{ fontFamily: C.head, fontSize: 13, fontWeight: 900, letterSpacing: "-0.4px" }}>
              Calc
              <span style={{ background: C.grad, backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Obra</span>
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 8, color: C.gold, letterSpacing: "0.14em" }}>PRO EDITION</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
          {NAV.map(n => {
            const on = page === n.id;
            return (
              <button key={n.id} type="button" onClick={() => setPage(n.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, border: on ? `1px solid ${C.goldMid}` : "1px solid transparent", cursor: "pointer", background: on ? C.goldDim : "transparent", color: on ? C.gold3 : C.text2, transition: "all .14s", fontSize: 12, fontFamily: C.mono, fontWeight: on ? 600 : 400, textAlign: "left", width: "100%" }}
                onMouseOver={e => { if (!on) { e.currentTarget.style.background = C.bg3; e.currentTarget.style.color = C.text; }}}
                onMouseOut={e => { if (!on) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.text2; }}}
              >
                <Ic d={n.icon} size={13} color={on ? C.gold2 : "currentColor"} />
                {n.label}
                {on && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: C.gold }} />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.grad, backgroundSize: "200%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.head, fontSize: 10, fontWeight: 900, color: C.bg, flexShrink: 0 }}>{userInitials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.gold, letterSpacing: "0.06em" }}>Plano Free</div>
          </div>
          <button type="button" onClick={doLogout} title="Sair" style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 4, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseOver={e => { e.currentTarget.style.color = "#e07060"; e.currentTarget.style.background = "rgba(224,112,96,.1)"; }}
            onMouseOut={e => { e.currentTarget.style.color = C.text2; e.currentTarget.style.background = "none"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ height: 52, background: C.bg2, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", flexShrink: 0 }}>
          <div>
            <h1 style={{ fontFamily: C.head, fontSize: 14, fontWeight: 900, color: C.text, letterSpacing: "-0.5px" }}>{TITLE[page]}</h1>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text3, marginTop: 1, letterSpacing: "0.06em" }}>
              CalcObra Pro · {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {saved > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 11px", background: "rgba(126,191,142,.08)", border: "1px solid rgba(126,191,142,.22)", borderRadius: 20, fontFamily: C.mono, fontSize: 10, color: "#7EBF8E" }}>
                <Ic d={I.check} size={11} color="#7EBF8E" />
                {saved} simulação{saved > 1 ? "ões" : ""} salva{saved > 1 ? "s" : ""}
              </div>
            )}
            <Btn onClick={() => setPage("simulator")} icon="plus" variant="gold" sm>Nova simulação</Btn>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: 22 }}>
          {page === "dashboard"    && <Dashboard onNav={setPage} />}
          {page === "simulator"    && <Simulador onSave={() => setSaved(c => c + 1)} />}
          {page === "calculadoras" && <Calculadoras />}
          {page === "orcamento"    && <NovoOrcamento onNav={setPage} />}
          {page === "clientes"     && <Clientes />}
          {page === "materiais"    && <Materiais />}
          {page === "relatorios"   && <Relatorios />}
          {page === "config"       && <Configuracoes />}
        </main>
      </div>
    </div>
  );
}
