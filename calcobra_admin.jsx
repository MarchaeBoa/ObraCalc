// CalcObra Pro — Painel Administrativo
// Tema escuro + ouro igual ao resto do app

const { useState, useMemo, useEffect, useCallback } = React;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#040404", bg2: "#080808", bg3: "#0e0e0e", bg4: "#141414", bg5: "#1a1a1a",
  border: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
  gold: "#C9982A", gold2: "#DDB040", gold3: "#EEC85A", gold4: "#F8DC82",
  goldDim: "rgba(201,152,42,0.10)", goldMid: "rgba(201,152,42,0.22)", goldGlow: "rgba(201,152,42,0.40)",
  text: "#F2EDE4", text2: "#8A8070", text3: "#3A3530",
  grad: "linear-gradient(135deg,#C9982A 0%,#EEC85A 50%,#C9982A 100%)",
  green: "#7EBF8E", greenBg: "rgba(126,191,142,.1)", greenBorder: "rgba(126,191,142,.25)",
  red: "#E07B54", redBg: "rgba(224,123,84,.1)", redBorder: "rgba(224,123,84,.25)",
  blue: "#6BA3D6", blueBg: "rgba(107,163,214,.1)", blueBorder: "rgba(107,163,214,.25)",
  mono: "'DM Mono','Fira Code',monospace",
  head: "'Unbounded',sans-serif",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=DM+Mono:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;overflow:hidden;}
body{background:#040404;color:#F2EDE4;font-family:'DM Mono',monospace;}
input,select,button,textarea{font-family:inherit;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(201,152,42,0.25);border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:rgba(201,152,42,0.45);}
`;

// ─── UTILS ────────────────────────────────────────────────────────────────────
const R = (n) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
const fmtDate = (d) => { try { const dt = new Date(d); return dt.toLocaleDateString("pt-BR"); } catch { return "—"; } };

// ─── SVG ICON ─────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const I = {
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  crown: ["M2 4l3 12h14l3-12-5 4-5-4-5 4z", "M2 16h20"],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  project: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  search: ["M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z", "M16 16l4.5 4.5"],
  promote: ["M12 5v14", "M5 12h14"],
  demote: "M5 12h14",
  enter: ["M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", "M10 17l5-5-5-5", "M15 12H3"],
  disable: ["M18.36 5.64a9 9 0 1 1-12.73 0", "M12 2v10"],
  check: "M20 6L9 17l-5-5",
  x: ["M18 6L6 18", "M6 6l12 12"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  trend: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  back: ["M19 12H5", "M12 19l-7-7 7-7"],
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  send: ["M22 2L11 13", "M22 2l-7 20-4-9-9-4z"],
  trash: ["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10,
    position: "relative", transition: "border-color .15s, box-shadow .15s",
    cursor: onClick ? "pointer" : "default", ...style,
  }}
  onMouseOver={e => { if (onClick) { e.currentTarget.style.borderColor = C.goldMid; e.currentTarget.style.boxShadow = `0 0 20px ${C.goldDim}`; }}}
  onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
    {children}
  </div>
);

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ label, color, bg, border }) => (
  <span style={{
    fontFamily: C.mono, fontSize: 9, fontWeight: 700, padding: "3px 10px",
    borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase",
    background: bg, border: `1px solid ${border}`, color,
  }}>{label}</span>
);

// ─── ACTION BUTTON ────────────────────────────────────────────────────────────
const ActionBtn = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
    background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
    borderRadius: 6, cursor: "pointer", color: color || C.text2,
    fontFamily: C.mono, fontSize: 9, letterSpacing: "0.04em", transition: "all .15s",
  }}
  onMouseOver={e => { e.currentTarget.style.borderColor = color || C.gold; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
  onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
    <Ic d={icon} size={11} color={color || C.text2} />
    {label}
  </button>
);

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon, value, label, color }) => (
  <Card style={{ padding: "18px 20px" }}>
    <div style={{ position: "absolute", top: 0, inset: "0 0 auto 0", height: 1, background: `linear-gradient(90deg,transparent,${color || C.gold}40,transparent)` }} />
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: C.goldDim, border: `1px solid ${C.goldMid}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Ic d={icon} size={18} color={C.gold2} />
      </div>
      <div>
        <div style={{ fontFamily: C.head, fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: "-0.5px" }}>{value}</div>
        <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text2, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  </Card>
);

// ─── TAB ──────────────────────────────────────────────────────────────────────
const Tab = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
    background: active ? C.goldDim : "transparent", border: "none",
    borderBottom: active ? `2px solid ${C.gold}` : "2px solid transparent",
    color: active ? C.gold2 : C.text2, fontFamily: C.mono, fontSize: 11,
    fontWeight: active ? 600 : 400, cursor: "pointer", letterSpacing: "0.04em",
    transition: "all .15s",
  }}
  onMouseOver={e => { if (!active) e.currentTarget.style.color = C.text; }}
  onMouseOut={e => { if (!active) e.currentTarget.style.color = C.text2; }}>
    <Ic d={icon} size={14} color={active ? C.gold2 : C.text2} />
    {label}
  </button>
);

// ─── SEARCH INPUT ─────────────────────────────────────────────────────────────
const SearchInput = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
    <Ic d={I.search} size={14} color={C.text3} />
    <input value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder || "Buscar..."}
      style={{
        width: "100%", padding: "9px 12px 9px 32px", background: "rgba(255,255,255,0.03)",
        border: `1px solid ${C.border}`, borderRadius: 7, color: C.text,
        fontFamily: C.mono, fontSize: 11, outline: "none",
      }}
      onFocus={e => e.target.style.borderColor = C.goldMid}
      onBlur={e => e.target.style.borderColor = C.border}
    />
    <div style={{ position: "absolute", top: 10, left: 10 }}>
      <Ic d={I.search} size={13} color={C.text3} />
    </div>
  </div>
);

// ─── SELECT FILTER ────────────────────────────────────────────────────────────
const FilterSelect = ({ value, onChange, options, label }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{
    padding: "9px 12px", background: C.bg3, border: `1px solid ${C.border}`,
    borderRadius: 7, color: C.text2, fontFamily: C.mono, fontSize: 10,
    outline: "none", cursor: "pointer", minWidth: 100,
  }}>
    <option value="">{label || "Todos"}</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

// ─── TOAST ────────────────────────────────────────────────────────────────────
let toastTimeout = null;
function showToast(msg, setToast) {
  setToast(msg);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => setToast(""), 3000);
}

// ─── USERS TAB ────────────────────────────────────────────────────────────────
function UsersTab({ users, setUsers, setToast }) {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = useMemo(() => {
    return users.filter(u => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchPlan = !filterPlan || (filterPlan === "admin" ? u.role === "admin" : u.plan === filterPlan);
      const matchStatus = !filterStatus || (filterStatus === "active" ? u.ok !== false : u.ok === false);
      return matchSearch && matchPlan && matchStatus;
    });
  }, [users, search, filterPlan, filterStatus]);

  const handlePromote = (email) => {
    const updated = users.map(u => {
      if (u.email === email) {
        if (u.role === "admin") return u;
        const newPlan = u.plan === "pro" ? "free" : "pro";
        return { ...u, plan: newPlan, promotedAt: new Date().toISOString(), promotedBy: "admin" };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("co_users", JSON.stringify(updated));
    const user = updated.find(u => u.email === email);
    showToast(`✅ ${user.name} agora é ${user.plan === "pro" ? "PRO" : "Grátis"}`, setToast);
  };

  const handleToggleStatus = (email) => {
    const updated = users.map(u => {
      if (u.email === email && u.role !== "admin") {
        return { ...u, ok: u.ok === false ? true : false };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("co_users", JSON.stringify(updated));
    const user = updated.find(u => u.email === email);
    showToast(`${user.ok ? "✅" : "🚫"} ${user.name} ${user.ok ? "ativado" : "desativado"}`, setToast);
  };

  const handleEnterAccount = (email) => {
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem("co_admin_backup", localStorage.getItem("co_logged"));
      localStorage.setItem("co_logged", JSON.stringify({ name: user.name, email: user.email, company: user.company || "" }));
      window.location.href = "dashboard.html";
    }
  };

  const planBadge = (u) => {
    if (u.role === "admin") return <Badge label="ADM" color="#F8DC82" bg="rgba(248,220,130,.15)" border="rgba(248,220,130,.3)" />;
    if (u.plan === "pro") return <Badge label="PRO" color={C.green} bg={C.greenBg} border={C.greenBorder} />;
    return <Badge label="GRÁTIS" color={C.text2} bg="rgba(138,128,112,.08)" border="rgba(138,128,112,.2)" />;
  };

  const statusBadge = (u) => {
    if (u.ok === false) return <Badge label="Inativo" color={C.red} bg={C.redBg} border={C.redBorder} />;
    return <Badge label="Ativo" color={C.green} bg={C.greenBg} border={C.greenBorder} />;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome ou email..." />
        <FilterSelect value={filterPlan} onChange={setFilterPlan} label="Plano" options={[
          { value: "free", label: "Grátis" }, { value: "pro", label: "Pro" }, { value: "admin", label: "Admin" },
        ]} />
        <FilterSelect value={filterStatus} onChange={setFilterStatus} label="Status" options={[
          { value: "active", label: "Ativo" }, { value: "inactive", label: "Inativo" },
        ]} />
        <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text3, marginLeft: "auto" }}>
          {filtered.length} de {users.length} usuários
        </div>
      </div>

      {/* Users Table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <Ic d={I.users} size={15} color={C.gold2} />
          <span style={{ fontFamily: C.head, fontSize: 13, fontWeight: 900, color: C.text, letterSpacing: "-0.3px" }}>Usuários Cadastrados</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: C.bg2 }}>
                {["Nome", "Email", "Plano", "Assinatura Pro", "Status", "Cadastro", "Ações"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: C.mono, fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 30, textAlign: "center", fontFamily: C.mono, fontSize: 12, color: C.text3 }}>Nenhum usuário encontrado</td></tr>
              ) : filtered.map(u => (
                <tr key={u.email} style={{ borderTop: `1px solid ${C.border}`, transition: "background .12s", opacity: u.ok === false ? 0.5 : 1 }}
                  onMouseOver={e => e.currentTarget.style.background = C.bg2}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        background: u.role === "admin" ? "rgba(248,220,130,.15)" : C.goldDim,
                        border: `1px solid ${u.role === "admin" ? "rgba(248,220,130,.3)" : C.goldMid}`,
                        fontFamily: C.head, fontSize: 11, fontWeight: 900, color: u.role === "admin" ? C.gold4 : C.gold2,
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.text }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{u.email}</td>
                  <td style={{ padding: "12px 16px" }}>{planBadge(u)}</td>
                  <td style={{ padding: "12px 16px", fontFamily: C.mono, fontSize: 10, color: C.text3 }}>
                    {u.plan === "pro" && u.promotedAt ? (
                      <div>
                        <div>Início: {fmtDate(u.promotedAt)}</div>
                        <div style={{ color: C.gold2, fontSize: 9 }}>Promovido via admin</div>
                      </div>
                    ) : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{statusBadge(u)}</td>
                  <td style={{ padding: "12px 16px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{fmtDate(u.at)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {u.role !== "admin" && (
                        <>
                          <ActionBtn icon={u.plan === "pro" ? I.demote : I.promote} label={u.plan === "pro" ? "Rebaixar" : "Promover"} color={C.blue} onClick={() => handlePromote(u.email)} />
                          <ActionBtn icon={I.eye} label="Projetos" color={C.gold2} onClick={() => {}} />
                          <ActionBtn icon={I.enter} label="Entrar na conta" color={C.green} onClick={() => handleEnterAccount(u.email)} />
                          <ActionBtn icon={I.disable} label={u.ok === false ? "Ativar" : "Desativar"} color={u.ok === false ? C.green : C.red} onClick={() => handleToggleStatus(u.email)} />
                        </>
                      )}
                      {u.role === "admin" && (
                        <span style={{ fontFamily: C.mono, fontSize: 9, color: C.text3 }}>Administrador</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── PROJECTS TAB ─────────────────────────────────────────────────────────────
function ProjectsTab({ users }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const allData = useMemo(() => {
    const allOrc = [];
    // Gather all orcamentos from localStorage
    try {
      const orcs = JSON.parse(localStorage.getItem("co_orcamentos") || "[]");
      orcs.forEach(o => allOrc.push(o));
    } catch {}

    // Group by user/client
    const byClient = {};
    allOrc.forEach(o => {
      const key = o.cliente || "Sem cliente";
      if (!byClient[key]) byClient[key] = { name: key, orcamentos: [], total: 0 };
      byClient[key].orcamentos.push(o);
      byClient[key].total += (o.total || 0);
    });

    return Object.values(byClient);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return allData;
    const q = search.toLowerCase();
    return allData.filter(c => c.name.toLowerCase().includes(q));
  }, [allData, search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar cliente..." />
        <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text3, marginLeft: "auto" }}>
          {filtered.length} cliente{filtered.length !== 1 ? "s" : ""} com projetos
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card style={{ padding: "40px 20px", textAlign: "center" }}>
          <Ic d={I.project} size={28} color={C.text3} />
          <div style={{ fontFamily: C.mono, fontSize: 12, color: C.text3, marginTop: 12 }}>Nenhum projeto encontrado</div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(client => (
            <Card key={client.name} style={{ padding: 0, overflow: "hidden" }}>
              <div onClick={() => setExpanded(expanded === client.name ? null : client.name)}
                style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: C.goldDim, border: `1px solid ${C.goldMid}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: C.head, fontSize: 13, fontWeight: 900, color: C.gold2 }}>{client.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.text }}>{client.name}</div>
                    <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text2 }}>{client.orcamentos.length} orçamento{client.orcamentos.length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 700, color: C.gold3 }}>{R(client.total)}</span>
                  <div style={{ transform: expanded === client.name ? "rotate(90deg)" : "rotate(0)", transition: "transform .2s" }}>
                    <Ic d="M9 18l6-6-6-6" size={14} color={C.text3} />
                  </div>
                </div>
              </div>
              {expanded === client.name && (
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: C.bg2 }}>
                        {["Nº", "Serviço", "Área", "Valor", "Status", "Data"].map(h => (
                          <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontFamily: C.mono, fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {client.orcamentos.map(o => (
                        <tr key={o.id} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 11, color: C.text3 }}>{o.id}</td>
                          <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{o.servico || "—"}</td>
                          <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 11, color: C.text2 }}>{o.area ? `${o.area} m²` : "—"}</td>
                          <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.gold3 }}>{R(o.total)}</td>
                          <td style={{ padding: "10px 16px" }}>
                            <Badge
                              label={o.status === "aprovado" ? "Aprovado" : o.status === "enviado" ? "Enviado" : o.status === "recusado" ? "Recusado" : "Rascunho"}
                              color={o.status === "aprovado" ? C.green : o.status === "recusado" ? C.red : C.gold3}
                              bg={o.status === "aprovado" ? C.greenBg : o.status === "recusado" ? C.redBg : C.goldDim}
                              border={o.status === "aprovado" ? C.greenBorder : o.status === "recusado" ? C.redBorder : C.goldMid}
                            />
                          </td>
                          <td style={{ padding: "10px 16px", fontFamily: C.mono, fontSize: 10, color: C.text3 }}>{fmtDate(o.criadoEm)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS TAB ────────────────────────────────────────────────────────
function NotificationsTab({ users, setToast }) {
  const [target, setTarget] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem("co_admin_notifications") || "[]"); } catch { return []; }
  });

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      showToast("⚠ Preencha título e mensagem", setToast);
      return;
    }
    const notif = {
      id: Date.now(),
      target,
      targetLabel: target === "all" ? "Todos" : target === "pro" ? "Usuários Pro" : target === "free" ? "Usuários Grátis" : users.find(u => u.email === target)?.name || target,
      title: title.trim(),
      message: message.trim(),
      sentAt: new Date().toISOString(),
      sentBy: "admin",
    };
    const updated = [notif, ...notifications];
    setNotifications(updated);
    localStorage.setItem("co_admin_notifications", JSON.stringify(updated));
    setTitle("");
    setMessage("");
    showToast("✅ Notificação enviada!", setToast);
  };

  const handleDelete = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("co_admin_notifications", JSON.stringify(updated));
    showToast("🗑 Notificação removida", setToast);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Send notification */}
      <Card style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <Ic d={I.send} size={15} color={C.gold2} />
          <span style={{ fontFamily: C.head, fontSize: 13, fontWeight: 900, color: C.text, letterSpacing: "-0.3px" }}>Enviar Notificação</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: C.mono, fontSize: 9, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Destinatário</label>
              <select value={target} onChange={e => setTarget(e.target.value)} style={{
                width: "100%", padding: "10px 12px", background: C.bg4, border: `1px solid ${C.border}`,
                borderRadius: 7, color: C.text, fontFamily: C.mono, fontSize: 11, outline: "none",
              }}>
                <option value="all">Todos os usuários</option>
                <option value="pro">Usuários Pro</option>
                <option value="free">Usuários Grátis</option>
                {users.filter(u => u.role !== "admin").map(u => (
                  <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: C.mono, fontSize: 9, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Título</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da notificação"
                style={{ width: "100%", padding: "10px 12px", background: C.bg4, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontFamily: C.mono, fontSize: 11, outline: "none" }}
                onFocus={e => e.target.style.borderColor = C.goldMid} onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
          </div>
          <div>
            <label style={{ fontFamily: C.mono, fontSize: 9, color: C.text3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, display: "block" }}>Mensagem</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Escreva a mensagem..."
              rows={3} style={{ width: "100%", padding: "10px 12px", background: C.bg4, border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontFamily: C.mono, fontSize: 11, outline: "none", resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = C.goldMid} onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <button onClick={handleSend} style={{
            alignSelf: "flex-end", display: "flex", alignItems: "center", gap: 8,
            padding: "10px 24px", background: C.grad, backgroundSize: "200%",
            border: "none", borderRadius: 7, color: "#030303", fontFamily: C.mono,
            fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: "pointer", boxShadow: `0 0 20px ${C.goldDim}`,
          }}>
            <Ic d={I.send} size={13} color="#030303" /> Enviar
          </button>
        </div>
      </Card>

      {/* Notification history */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <Ic d={I.bell} size={15} color={C.gold2} />
          <span style={{ fontFamily: C.head, fontSize: 13, fontWeight: 900, color: C.text, letterSpacing: "-0.3px" }}>Histórico de Notificações</span>
          <span style={{ fontFamily: C.mono, fontSize: 10, color: C.text3, marginLeft: 8 }}>{notifications.length}</span>
        </div>
        {notifications.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <Ic d={I.bell} size={28} color={C.text3} />
            <div style={{ fontFamily: C.mono, fontSize: 12, color: C.text3, marginTop: 12 }}>Nenhuma notificação enviada</div>
          </div>
        ) : (
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {notifications.map(n => (
              <div key={n.id} style={{ padding: "14px 18px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.text }}>{n.title}</span>
                    <Badge label={n.targetLabel} color={C.blue} bg={C.blueBg} border={C.blueBorder} />
                  </div>
                  <div style={{ fontFamily: C.mono, fontSize: 11, color: C.text2, marginBottom: 4 }}>{n.message}</div>
                  <div style={{ fontFamily: C.mono, fontSize: 9, color: C.text3 }}>{fmtDate(n.sentAt)}</div>
                </div>
                <button onClick={() => handleDelete(n.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <Ic d={I.trash} size={13} color={C.text3} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── FINANCIAL SUMMARY ────────────────────────────────────────────────────────
function FinancialSummary() {
  const orcamentos = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("co_orcamentos") || "[]"); } catch { return []; }
  }, []);

  const stats = useMemo(() => {
    const aprovados = orcamentos.filter(o => o.status === "aprovado");
    const emAnalise = orcamentos.filter(o => o.status === "enviado" || o.status === "rascunho");
    const totalAprovado = aprovados.reduce((s, o) => s + (o.total || 0), 0);
    const totalAnalise = emAnalise.reduce((s, o) => s + (o.total || 0), 0);
    const totalGeral = orcamentos.reduce((s, o) => s + (o.total || 0), 0);
    return { totalAprovado, totalAnalise, totalGeral };
  }, [orcamentos]);

  return (
    <Card style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <Ic d={I.crown} size={15} color={C.gold2} />
        <span style={{ fontFamily: C.head, fontSize: 13, fontWeight: 900, color: C.text, letterSpacing: "-0.3px" }}>Resumo Financeiro dos Orçamentos</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "ORÇAMENTOS APROVADOS", value: R(stats.totalAprovado), color: C.green, bg: C.greenBg, border: C.greenBorder },
          { label: "ORÇAMENTOS EM ANÁLISE", value: R(stats.totalAnalise), color: C.gold3, bg: C.goldDim, border: C.goldMid },
          { label: "VALOR TOTAL", value: R(stats.totalGeral), color: C.text, bg: "rgba(255,255,255,.03)", border: C.border2 },
        ].map(s => (
          <div key={s.label} style={{ padding: "16px 18px", background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8 }}>
            <div style={{ fontFamily: C.mono, fontSize: 9, fontWeight: 700, color: s.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: C.head, fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── ACCESS CONTROL ───────────────────────────────────────────────────────────
function AccessControl() {
  const roles = [
    { title: "ADMIN", desc: "Acesso total ao sistema, gerencia usuários e planos.", color: C.gold4, bg: "rgba(248,220,130,.08)", border: "rgba(248,220,130,.2)" },
    { title: "PROFISSIONAL", desc: "Acesso a todas as ferramentas, simulador, licitações e recursos premium.", color: C.green, bg: C.greenBg, border: C.greenBorder },
    { title: "USUÁRIO PADRÃO", desc: "Acesso à dashboard, calculadora, orçamento e tabela de preços.", color: C.text2, bg: "rgba(138,128,112,.06)", border: "rgba(138,128,112,.15)" },
  ];

  return (
    <Card style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <Ic d={I.shield} size={15} color={C.gold2} />
        <span style={{ fontFamily: C.head, fontSize: 13, fontWeight: 900, color: C.text, letterSpacing: "-0.3px" }}>Controle de Acesso</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {roles.map(r => (
          <div key={r.title} style={{ padding: "16px 18px", background: r.bg, border: `1px solid ${r.border}`, borderRadius: 8 }}>
            <div style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 700, color: r.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{r.title}</div>
            <div style={{ fontFamily: C.mono, fontSize: 11, color: C.text2, lineHeight: 1.6 }}>{r.desc}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── MAIN ADMIN APP ───────────────────────────────────────────────────────────
function AdminApp() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem("co_users") || "[]"); } catch { return []; }
  });
  const [toast, setToast] = useState("");

  const logged = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("co_logged")); } catch { return {}; }
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const pros = users.filter(u => u.plan === "pro").length;
    const free = users.filter(u => u.plan !== "pro" && u.role !== "admin").length;
    const orcs = (() => { try { return JSON.parse(localStorage.getItem("co_orcamentos") || "[]").length; } catch { return 0; } })();
    return { total, pros, free, orcs };
  }, [users]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999, padding: "12px 20px",
          background: C.bg4, border: `1px solid ${C.goldMid}`, borderRadius: 8,
          fontFamily: C.mono, fontSize: 12, color: C.text, boxShadow: `0 4px 20px rgba(0,0,0,.5)`,
          animation: "fadeIn .2s ease",
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.goldDim, border: `1px solid ${C.goldMid}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic d={I.shield} size={18} color={C.gold2} />
          </div>
          <div>
            <div style={{ fontFamily: C.head, fontSize: 18, fontWeight: 900, color: C.text, letterSpacing: "-0.5px" }}>Painel Administrativo</div>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.text2 }}>Gerencie usuários, planos e projetos</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => window.location.href = "dashboard.html"} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
            background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 7,
            color: C.text2, fontFamily: C.mono, fontSize: 10, cursor: "pointer",
          }}>
            <Ic d={I.back} size={12} color={C.text2} /> Voltar ao Dashboard
          </button>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: "rgba(248,220,130,.15)",
            border: "1px solid rgba(248,220,130,.3)", display: "flex", alignItems: "center",
            justifyContent: "center", fontFamily: C.head, fontSize: 12, fontWeight: 900, color: C.gold4,
          }}>
            {(logged.name || "A").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          <KpiCard icon={I.users} value={stats.total} label="Total de usuários" />
          <KpiCard icon={I.crown} value={stats.pros} label="Profissionais" />
          <KpiCard icon={I.user} value={stats.free} label="Plano Grátis" />
          <KpiCard icon={I.project} value={stats.orcs} label="Total de projetos" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "16px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}` }}>
          <Tab icon={I.users} label="Usuários" active={tab === "users"} onClick={() => setTab("users")} />
          <Tab icon={I.project} label="Projetos dos Clientes" active={tab === "projects"} onClick={() => setTab("projects")} />
          <Tab icon={I.bell} label="Notificações" active={tab === "notifications"} onClick={() => setTab("notifications")} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 28px 28px" }}>
        {tab === "users" && <UsersTab users={users} setUsers={setUsers} setToast={setToast} />}
        {tab === "projects" && <ProjectsTab users={users} />}
        {tab === "notifications" && <NotificationsTab users={users} setToast={setToast} />}

        {/* Financial Summary & Access Control — always visible below tabs */}
        <div style={{ height: 1, margin: "24px 0", background: `linear-gradient(90deg,transparent,${C.gold}25,transparent)` }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FinancialSummary />
          <AccessControl />
        </div>
      </div>
    </div>
  );
}
