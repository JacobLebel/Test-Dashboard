import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

// ─── LIGHT SAAS PALETTE ───────────────────────────────────────────────────────
const C = {
  bg:        "#f8f9fb",    // fond principal
  surface:   "#ffffff",    // fond cards
  border:    "#e5e7eb",    // bordures
  border2:   "#d1d5db",    // bordures plus marquées
  text:      "#111827",    // texte principal
  textSub:   "#6b7280",    // texte secondaire
  textMuted: "#9ca3af",    // texte muted
  accent:    "#111827",    // accent primaire (quasi-noir)
  accentHov: "#374151",    
  green:     "#16a34a",    // vert
  greenBg:   "#f0fdf4",    
  red:       "#dc2626",    // rouge
  redBg:     "#fef2f2",    
  yellow:    "#d97706",    // jaune
  yellowBg:  "#fffbeb",   
  blue:      "#2563eb",   
  blueBg:    "#eff6ff",   
  wr:        "#111827",    // Will & Rich
  mc:        "#6b7280",    // McCord
  sh:        "#d1d5db",    // Sherwin
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const SUMMARY = [
  { immeuble: "Will & Rich", total: 103, en_location: 15, vacant: 3, loue_2026: 4,  taux_vacance: 0.029 },
  { immeuble: "McCord",      total: 154, en_location: 11, vacant: 0, loue_2026: 8,  taux_vacance: 0.071 },
  { immeuble: "Sherwin",     total: 162, en_location: 10, vacant: 5, loue_2026: 23, taux_vacance: 0.031 },
];

const DELAI_PAR_ANNEE = [
  { annee: "2024", studio: 31, c1: 47, c2: 61, c3: 85 },
  { annee: "2025", studio: 89, c1: 105, c2: 86, c3: 82 },
];

const PRIX_PI2_PAR_ANNEE = [
  { annee: "2024", wr: 3.08, mc: 3.02, sh: null },
  { annee: "2025", wr: 2.93, mc: 2.95, sh: 3.03 },
  { annee: "2026", wr: 2.99, mc: 2.99, sh: 2.95 },
];

const PRIX_PI2_PAR_TYPE_2025 = [
  { type: "Studio", wr: null, mc: 2.80, sh: 2.78 },
  { type: "1 ch",   wr: 2.89, mc: 2.96, sh: 3.15 },
  { type: "2 ch",   wr: 3.07, mc: 2.99, sh: 3.04 },
  { type: "3 ch",   wr: 2.97, mc: 2.86, sh: 2.81 },
];

const LOCATIONS_PAR_ANNEE = [
  { annee: "2024", wr: 22, mc: 67, sh: 0,   total: 89  },
  { annee: "2025", wr: 34, mc: 45, sh: 134, total: 213 },
  { annee: "2026", wr: 4,  mc: 8,  sh: 23,  total: 35  },
];

const PRIX_DISPO_WR = [
  { type: "1 ch", j30: 1947, j90: 1902, j180: 1902, j365: 1879 },
  { type: "2 ch", j30: 2448, j90: null, j180: 2300, j365: 2300 },
  { type: "3 ch", j30: null, j90: null, j180: null,  j365: 3106 },
];

const UNITES_EN_COURS = [
  { imm: "Will & Rich", unite: "317", modele: "B04", ch: 2, loyer_dem: 2240, dispo: "2026-01-01", jours: 74 },
  { imm: "Will & Rich", unite: "409", modele: "A01", ch: 1, loyer_dem: 1980, dispo: "2026-03-01", jours: 25 },
  { imm: "Will & Rich", unite: "602", modele: "A11", ch: 1, loyer_dem: 1890, dispo: "2026-03-01", jours: 7  },
  { imm: "Will & Rich", unite: "207", modele: "A03", ch: 1, loyer_dem: 1965, dispo: "2026-03-01", jours: 3  },
  { imm: "Will & Rich", unite: "404", modele: "A02", ch: 1, loyer_dem: 1950, dispo: "2026-04-01", jours: 12 },
  { imm: "Will & Rich", unite: "402", modele: "A02", ch: 1, loyer_dem: 1950, dispo: "2026-06-01", jours: 28 },
  { imm: "Will & Rich", unite: "511", modele: "A04", ch: 1, loyer_dem: 1970, dispo: "2026-06-01", jours: 7  },
  { imm: "Will & Rich", unite: "301", modele: "B01", ch: 2, loyer_dem: 2625, dispo: "2026-06-01", jours: 5  },
  { imm: "Will & Rich", unite: "206", modele: "B02", ch: 2, loyer_dem: 2175, dispo: "2025-07-01", jours: 350, alerte: true },
  { imm: "McCord",      unite: "406", modele: "A03", ch: 1, loyer_dem: 1850, dispo: "2026-03-01", jours: 182 },
  { imm: "McCord",      unite: "220", modele: "B6.b",ch: 2, loyer_dem: 2690, dispo: "2026-05-01", jours: 27  },
  { imm: "McCord",      unite: "614", modele: "B11", ch: 2, loyer_dem: 2715, dispo: "2026-05-01", jours: 39  },
  { imm: "McCord",      unite: "309", modele: "A1",  ch: 1, loyer_dem: 1950, dispo: "2026-06-01", jours: 40  },
  { imm: "McCord",      unite: "320", modele: "B6",  ch: 2, loyer_dem: 2720, dispo: "2026-06-01", jours: 90  },
  { imm: "McCord",      unite: "701", modele: "B14", ch: 2, loyer_dem: 2690, dispo: "2026-06-01", jours: 11  },
  { imm: "McCord",      unite: "113", modele: "C1",  ch: 3, loyer_dem: 3495, dispo: "2026-06-01", jours: 6   },
  { imm: "Sherwin",     unite: "320", modele: "A01", ch: 1, loyer_dem: 1695, dispo: "2026-03-01", jours: 14  },
  { imm: "Sherwin",     unite: "127", modele: "M06", ch: 3, loyer_dem: 4500, dispo: "2026-03-01", jours: 12  },
  { imm: "Sherwin",     unite: "310", modele: "B03", ch: 2, loyer_dem: 2605, dispo: "2026-06-01", jours: 11  },
  { imm: "Sherwin",     unite: "322", modele: "B01", ch: 2, loyer_dem: 2550, dispo: "2026-07-01", jours: 4   },
  { imm: "Sherwin",     unite: "315", modele: "C01.B",ch:3, loyer_dem: 3405, dispo: "2026-07-01", jours: 2   },
  { imm: "Sherwin",     unite: "506", modele: "A02", ch: 1, loyer_dem: 2015, dispo: "2026-08-01", jours: 0   },
];

const delaiData = {
  rows: [
    { year: "2024", studio: "—", c1: 47,  c2: 61, c3: 85, all: 55 },
    { year: "2025", studio: 89,  c1: 105, c2: 86, c3: 82, all: 90 },
    { year: "2026", studio: "—", c1: 14,  c2: 40, c3: "—", all: 21, partial: true },
  ],
};

const deltaData = {
  rows: [
    { year: "2024", studio: "—",    c1: "+3,7%", c2: "+2,4%", c3: "+0,5%", all: "+3,1%" },
    { year: "2025", studio: "—",    c1: "-0,4%", c2: "+2,7%", c3: "0,0%",  all: "+0,4%" },
    { year: "2026", studio: "—",    c1: "-1,0%", c2: "-4,2%", c3: "—",     all: "-1,7%", partial: true },
  ],
};

const prixPi2Data = {
  rows: [
    { imm: "Will & Rich", model: "A01", type: "1 ch", y22: "2,62$", y24: "2,96$", y25: "2,88$", y26: "3,02$", delta: "+10,1%" },
    { imm: "Will & Rich", model: "A02", type: "1 ch", y22: "2,76$", y24: "3,18$", y25: "3,12$", y26: "3,16$", delta: "+13,0%" },
    { imm: "Will & Rich", model: "A03", type: "1 ch", y22: "2,60$", y24: "2,84$", y25: "2,85$", y26: "—",     delta: "+9,6%"  },
    { imm: "Will & Rich", model: "A06", type: "1 ch", y22: "2,64$", y24: "2,87$", y25: "2,80$", y26: "—",     delta: "+6,1%"  },
    { imm: "Will & Rich", model: "B01", type: "2 ch", y22: "2,57$", y24: "2,97$", y25: "2,93$", y26: "3,02$", delta: "+14,0%" },
    { imm: "Will & Rich", model: "B02", type: "2 ch", y22: "2,65$", y24: "2,97$", y25: "3,01$", y26: "—",     delta: "+13,6%" },
    { imm: "Will & Rich", model: "B03", type: "2 ch", y22: "2,82$", y24: "—",     y25: "3,08$", y26: "2,89$", delta: "+9,2%"  },
    { imm: "Will & Rich", model: "B04", type: "2 ch", y22: "2,60$", y24: "2,99$", y25: "3,01$", y26: "—",     delta: "+15,8%" },
    { imm: "Will & Rich", model: "C01", type: "3 ch", y22: "2,76$", y24: "3,07$", y25: "2,90$", y26: "—",     delta: "+5,1%"  },
    { imm: "Will & Rich", model: "C03", type: "3 ch", y22: "2,81$", y24: "3,07$", y25: "3,10$", y26: "—",     delta: "+10,3%" },
    { imm: "Will & Rich", model: "C04", type: "3 ch", y22: "—",     y24: "2,93$", y25: "2,86$", y26: "—",     delta: "—"      },
    { imm: "McCord", model: "A01", type: "1 ch", y22: "—", y24: "2,84$", y25: "2,96$", y26: "—", delta: "+4,2%"  },
    { imm: "McCord", model: "A03", type: "1 ch", y22: "—", y24: "3,01$", y25: "—",     y26: "—", delta: "—"      },
    { imm: "McCord", model: "A05", type: "1 ch", y22: "—", y24: "3,30$", y25: "—",     y26: "—", delta: "—"      },
    { imm: "McCord", model: "A15", type: "1 ch", y22: "—", y24: "3,70$", y25: "—",     y26: "—", delta: "—"      },
    { imm: "McCord", model: "B09", type: "2 ch", y22: "—", y24: "3,21$", y25: "—",     y26: "—", delta: "—"      },
    { imm: "McCord", model: "B11", type: "2 ch", y22: "—", y24: "2,97$", y25: "—",     y26: "—", delta: "—"      },
    { imm: "McCord", model: "B20", type: "2 ch", y22: "—", y24: "3,20$", y25: "—",     y26: "—", delta: "—"      },
    { imm: "McCord", model: "C01", type: "3 ch", y22: "—", y24: "2,52$", y25: "—",     y26: "—", delta: "—"      },
    { imm: "Sherwin", model: "A01",   type: "1 ch", y22: "—", y24: "—", y25: "3,37$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "A01.a", type: "1 ch", y22: "—", y24: "—", y25: "3,40$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "A02.b", type: "1 ch", y22: "—", y24: "—", y25: "3,14$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "A06.d", type: "1 ch", y22: "—", y24: "—", y25: "3,18$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "B01",   type: "2 ch", y22: "—", y24: "—", y25: "3,36$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "B05.b", type: "2 ch", y22: "—", y24: "—", y25: "3,12$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "B06",   type: "2 ch", y22: "—", y24: "—", y25: "2,97$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "C01",   type: "3 ch", y22: "—", y24: "—", y25: "2,75$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "C02",   type: "3 ch", y22: "—", y24: "—", y25: "2,78$", y26: "—", delta: "—" },
    { imm: "Sherwin", model: "C03",   type: "3 ch", y22: "—", y24: "—", y25: "2,69$", y26: "—", delta: "—" },
  ],
};

const MODELS_DATA = {
  "Will & Rich": {
    "A01": { superficie: 656, chambres: 1, units: [
      {no: "208", loyer_actuel: 1865, loyer_norm: 1949}, {no: "209", loyer_actuel: 1865, loyer_norm: 1949},
      {no: "210", loyer_actuel: 1865, loyer_norm: 1949}, {no: "212", loyer_actuel: 1865, loyer_norm: 1949},
      {no: "308", loyer_actuel: 1850, loyer_norm: 1969}, {no: "309", loyer_actuel: 1885, loyer_norm: 1969},
      {no: "310", loyer_actuel: 1933, loyer_norm: 1969}, {no: "312", loyer_actuel: 1830, loyer_norm: 1969},
    ]},
    "A02": { superficie: 580, chambres: 1, units: [
      {no: "203", loyer_actuel: 1900, loyer_norm: 1910}, {no: "303", loyer_actuel: 1875, loyer_norm: 1930},
      {no: "304", loyer_actuel: 1875, loyer_norm: 1930}, {no: "305", loyer_actuel: 1910, loyer_norm: 1930},
      {no: "403", loyer_actuel: 1875, loyer_norm: 1970}, {no: "404", loyer_actuel: 1915, loyer_norm: 1950},
    ]},
    "B01": { superficie: 867, chambres: 2, units: [
      {no: "201", loyer_actuel: 2200, loyer_norm: 2250}, {no: "301", loyer_actuel: 2525, loyer_norm: 2625},
      {no: "401", loyer_actuel: 2625, loyer_norm: 2550}, {no: "601", loyer_actuel: 2480, loyer_norm: 2480},
    ]},
  },
  "McCord": {
    "A01": { superficie: 660, chambres: 1, units: [
      {no: "117", loyer_actuel: 1875, loyer_norm: 1875}, {no: "217", loyer_actuel: 1875, loyer_norm: 1970},
      {no: "309", loyer_actuel: 1970, loyer_norm: 1950}, {no: "317", loyer_actuel: 1850, loyer_norm: 1920},
    ]},
    "B11": { superficie: 879, chambres: 2, units: [
      {no: "514", loyer_actuel: 2560, loyer_norm: 2710}, {no: "614", loyer_actuel: 2570, loyer_norm: 2715},
      {no: "714", loyer_actuel: 2610, loyer_norm: 2610}, {no: "814", loyer_actuel: 2715, loyer_norm: 2715},
    ]},
  },
  "Sherwin": {
    "A01": { superficie: 560, chambres: 1, units: [
      {no: "716", loyer_actuel: 1885, loyer_norm: 1885}, {no: "717", loyer_actuel: 1885, loyer_norm: 1885},
      {no: "718", loyer_actuel: 1885, loyer_norm: 1885}, {no: "719", loyer_actuel: 1885, loyer_norm: 1885},
    ]},
    "C01": { superficie: 1216, chambres: 3, units: [
      {no: "115", loyer_actuel: 3315, loyer_norm: 3315}, {no: "215", loyer_actuel: 3345, loyer_norm: 3345},
      {no: "315", loyer_actuel: 3405, loyer_norm: 3405}, {no: "311", loyer_actuel: 3320, loyer_norm: 3320},
    ]},
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt$ = (n) => n == null ? "—" : `${n.toLocaleString("fr-CA")} $`;
const typeLabel = { 0: "Studio", 1: "1 ch", 2: "2 ch", 3: "3 ch" };

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const LightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.text,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
    }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: C.textSub, fontSize: 11 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: C.text, marginBottom: 2, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block", flexShrink: 0 }} />
          <span style={{ color: C.textSub }}>{p.name}:</span>
          <b>{typeof p.value === "number" && p.value < 10 ? `${p.value.toFixed(2)} $/pi²` : `${p.value}${p.name?.includes("ours") ? "j" : ""}`}</b>
        </div>
      ))}
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.surface,
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    padding: "20px 22px",
    ...style
  }}>{children}</div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 16 }}>
    <h2 style={{
      margin: 0, fontSize: 13, fontWeight: 600, color: C.text,
      letterSpacing: "-0.01em",
    }}>{children}</h2>
    {sub && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{sub}</div>}
  </div>
);

const Th = ({ children, center }) => (
  <th style={{
    padding: "10px 14px", textAlign: center ? "center" : "left",
    fontSize: 11, fontWeight: 500, color: C.textMuted,
    background: C.bg, borderBottom: `1px solid ${C.border}`,
    whiteSpace: "nowrap", letterSpacing: "0.02em",
  }}>{children}</th>
);

const Td = ({ children, center, bold, mono }) => (
  <td style={{
    padding: "10px 14px", fontSize: 13, color: C.text,
    fontWeight: bold ? 600 : 400,
    textAlign: center ? "center" : "left",
    borderBottom: `1px solid ${C.border}`,
    fontFamily: mono ? "'SF Mono', 'Fira Code', monospace" : "inherit",
  }}>{children}</td>
);

const FilterBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: "5px 12px", borderRadius: 6,
    border: `1px solid ${active ? C.accent : C.border}`,
    background: active ? C.accent : C.surface,
    color: active ? "#fff" : C.textSub,
    fontWeight: active ? 500 : 400, fontSize: 12,
    cursor: "pointer",
    transition: "all 0.15s",
  }}>{children}</button>
);

const DeltaBadge = ({ value }) => {
  if (value === "—") return <span style={{ color: C.textMuted }}>—</span>;
  const num = parseFloat(value);
  const isPos = num > 0;
  const isNeg = num < 0;
  return (
    <span style={{
      display: "inline-block",
      background: isPos ? C.greenBg : isNeg ? C.redBg : "#f3f4f6",
      color: isPos ? C.green : isNeg ? C.red : C.textSub,
      borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 600,
      fontFamily: "'SF Mono', monospace",
    }}>{value}</span>
  );
};

const StatusPill = ({ jours }) => {
  const isUrgent = jours > 120;
  const isMed = jours > 60;
  const color = isUrgent ? C.red : isMed ? C.yellow : C.green;
  const bg = isUrgent ? C.redBg : isMed ? C.yellowBg : C.greenBg;
  const label = isUrgent ? "Urgent" : isMed ? "À suivre" : "Normal";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: bg, color, borderRadius: 20,
      padding: "3px 10px", fontSize: 11, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
};

const KpiCard = ({ label, value, sub, highlight }) => (
  <div style={{
    background: highlight ? C.accent : C.surface,
    border: `1px solid ${highlight ? C.accent : C.border}`,
    borderRadius: 10, padding: "20px 22px", flex: 1, minWidth: 130,
    boxShadow: highlight ? "0 2px 8px rgba(17,24,39,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
  }}>
    <div style={{ fontSize: 11, fontWeight: 500, color: highlight ? "rgba(255,255,255,0.7)" : C.textMuted, marginBottom: 8, letterSpacing: "0.02em" }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 700, color: highlight ? "#fff" : C.text, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: highlight ? "rgba(255,255,255,0.55)" : C.textMuted, marginTop: 6 }}>{sub}</div>}
  </div>
);

const ImmBadge = ({ imm }) => {
  const styles = {
    "Will & Rich": { bg: "#111827", color: "#fff" },
    "McCord":      { bg: "#f3f4f6", color: "#374151" },
    "Sherwin":     { bg: "#e5e7eb", color: "#6b7280" },
  };
  const s = styles[imm] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      background: s.bg, color: s.color,
      borderRadius: 5, padding: "2px 8px",
      fontSize: 10, fontWeight: 600,
      textTransform: "uppercase", letterSpacing: "0.06em",
      whiteSpace: "nowrap",
    }}>{imm}</span>
  );
};

// ─── VIEWS ────────────────────────────────────────────────────────────────────

const VueGlobale = () => {
  const totalUnits  = SUMMARY.reduce((a, s) => a + s.total, 0);
  const totalVacant = SUMMARY.reduce((a, s) => a + s.vacant, 0);
  const totalCours  = SUMMARY.reduce((a, s) => a + s.en_location, 0);
  const total2026   = SUMMARY.reduce((a, s) => a + s.loue_2026, 0);

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <KpiCard label="Unités totales" value={totalUnits} sub="3 immeubles" highlight />
        <KpiCard label="En location active" value={totalCours} sub="Mis en marché" />
        <KpiCard label="Vacant" value={totalVacant} sub="Libre immédiatement" />
        <KpiCard label="Loués 2026" value={total2026} sub="Depuis le 1er janvier" />
      </div>

      {/* Immeuble cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {SUMMARY.map(s => (
          <Card key={s.immeuble} style={{ padding: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{s.immeuble}</div>
              <span style={{
                background: s.taux_vacance > 0.05 ? C.redBg : C.greenBg,
                color: s.taux_vacance > 0.05 ? C.red : C.green,
                borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500,
              }}>{(s.taux_vacance * 100).toFixed(1)}% vacant</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { l: "Total", v: s.total },
                { l: "En cours", v: s.en_location },
                { l: "Vacant", v: s.vacant, alert: s.vacant > 0 },
              ].map(item => (
                <div key={item.l} style={{ textAlign: "center", background: C.bg, borderRadius: 8, padding: "12px 4px" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: item.alert ? C.red : C.text, letterSpacing: "-0.02em" }}>{item.v}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 500, marginTop: 2 }}>{item.l}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 4, background: C.border, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${((s.total - s.en_location - s.vacant) / s.total) * 100}%`,
                background: C.accent, borderRadius: 4,
              }} />
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>
              {((s.total - s.en_location - s.vacant) / s.total * 100).toFixed(0)}% en bail actif
            </div>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <SectionTitle sub="Nombre de baux signés par année · tous immeubles">Activité locative annuelle</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={LOCATIONS_PAR_ANNEE} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="annee" tick={{ fontSize: 12, fill: C.textMuted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
            <Tooltip content={<LightTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: C.textSub }} />
            <Bar dataKey="wr" name="Will & Rich" stackId="a" fill={C.wr} radius={[0,0,0,0]} />
            <Bar dataKey="mc" name="McCord"      stackId="a" fill={C.mc} />
            <Bar dataKey="sh" name="Sherwin"     stackId="a" fill={C.sh} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>* 2026 : données partielles au 17 fév.</div>
      </Card>
    </div>
  );
};

const VuePrix = () => {
  const [filterImm,  setFilterImm]  = useState("Tous");
  const [filterType, setFilterType] = useState("Tous");
  const imms  = ["Tous", "Will & Rich", "McCord", "Sherwin"];
  const types = ["Tous", "1 ch", "2 ch", "3 ch"];

  const filtered = prixPi2Data.rows.filter(r =>
    (filterImm  === "Tous" || r.imm  === filterImm) &&
    (filterType === "Tous" || r.type === filterType)
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle sub="$/pi² moyen par immeuble · baux signés">Évolution prix au pi² — 2024 → 2026</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PRIX_PI2_PAR_ANNEE}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="annee" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
              <YAxis domain={[2.7, 3.2]} tick={{ fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toFixed(2)}$`} />
              <Tooltip content={<LightTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="wr" name="Will & Rich" stroke={C.wr} strokeWidth={2} dot={{ r: 3, fill: C.wr }} connectNulls />
              <Line type="monotone" dataKey="mc" name="McCord"      stroke={C.mc} strokeWidth={2} dot={{ r: 3, fill: C.mc }} connectNulls />
              <Line type="monotone" dataKey="sh" name="Sherwin"     stroke="#9ca3af" strokeWidth={2} dot={{ r: 3, fill: "#9ca3af" }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle sub="Comparaison par type d'unité · 2025">Prix au pi² par type d'unité</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PRIX_PI2_PAR_TYPE_2025} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
              <YAxis domain={[2.5, 3.4]} tick={{ fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toFixed(2)}$`} />
              <Tooltip content={<LightTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="wr" name="Will & Rich" fill={C.wr} radius={[3,3,0,0]} />
              <Bar dataKey="mc" name="McCord"      fill={C.mc} radius={[3,3,0,0]} />
              <Bar dataKey="sh" name="Sherwin"     fill="#d1d5db" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <SectionTitle sub="$/pi² par modèle · évolution historique">Prix au pi² par modèle</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.textMuted, marginRight: 4 }}>Immeuble</span>
              {imms.map(v => <FilterBtn key={v} active={filterImm === v} onClick={() => setFilterImm(v)}>{v}</FilterBtn>)}
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.textMuted, marginRight: 4 }}>Type</span>
              {types.map(v => <FilterBtn key={v} active={filterType === v} onClick={() => setFilterType(v)}>{v}</FilterBtn>)}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>{filtered.length} modèle{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Immeuble", "Modèle", "Type", "2022", "2024", "2025", "2026 YTD", "Δ"].map(h => (
                <Th key={h} center={!["Immeuble","Modèle","Type"].includes(h)}>{h}</Th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg }}>
                  <Td><ImmBadge imm={row.imm} /></Td>
                  <Td bold>{row.model}</Td>
                  <Td>
                    <span style={{
                      background: row.type === "1 ch" ? C.blueBg : row.type === "2 ch" ? C.yellowBg : C.greenBg,
                      color: row.type === "1 ch" ? C.blue : row.type === "2 ch" ? C.yellow : C.green,
                      borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 500,
                    }}>{row.type}</span>
                  </Td>
                  {[row.y22, row.y24, row.y25].map((v, j) => (
                    <Td key={j} center mono>{v === "—" ? <span style={{ color: C.textMuted }}>—</span> : v}</Td>
                  ))}
                  <Td center mono><b>{row.y26 === "—" ? <span style={{ color: C.textMuted }}>—</span> : row.y26}</b></Td>
                  <Td center><DeltaBadge value={row.delta} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle sub="Loyer moyen des unités disponibles selon l'horizon · Will & Rich">Prix moyens historiques — Will & Rich</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Type", "30 jours", "90 jours", "180 jours", "365 jours"].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {PRIX_DISPO_WR.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg }}>
                <Td bold>{r.type}</Td>
                {[r.j30, r.j90, r.j180, r.j365].map((v, j) => (
                  <Td key={j} mono>{v ? `${v.toLocaleString("fr-CA")} $` : <span style={{ color: C.textMuted }}>—</span>}</Td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const VueDélai = () => {
  const delayColor = (v) => v == null || typeof v !== "number" ? C.textMuted : v <= 35 ? C.green : v <= 60 ? C.yellow : C.red;
  const delayBg    = (v) => v == null || typeof v !== "number" ? "transparent" : v <= 35 ? C.greenBg : v <= 60 ? C.yellowBg : C.redBg;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle sub="Jours entre mise en marché et signature">Délai moyen par type d'unité</SectionTitle>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={DELAI_PAR_ANNEE} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="annee" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `${v}j`} />
              <Tooltip content={<LightTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={60} stroke={C.yellow} strokeDasharray="4 3" label={{ value: "60j", fill: C.yellow, fontSize: 10 }} />
              <Bar dataKey="studio" name="Studio"     fill="#d1d5db" radius={[3,3,0,0]} />
              <Bar dataKey="c1"     name="1 chambre"  fill={C.wr}    radius={[3,3,0,0]} />
              <Bar dataKey="c2"     name="2 chambres" fill={C.mc}    radius={[3,3,0,0]} />
              <Bar dataKey="c3"     name="3 chambres" fill="#9ca3af" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle sub="Δ moyen annuel — positif = loyer signé supérieur au demandé">Performance loyer obtenu vs demandé</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Année", "Studio", "1 ch", "2 ch", "3 ch", "Tous"].map(h => <Th key={h} center={h !== "Année"}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {deltaData.rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg }}>
                    <Td bold>{row.year}{row.partial && <span style={{ color: C.textMuted, fontSize: 11 }}> *</span>}</Td>
                    {[row.studio, row.c1, row.c2, row.c3, row.all].map((v, j) => (
                      <td key={j} style={{ padding: "10px 14px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
                        <DeltaBadge value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10 }}>
            Positif = pouvoir de marché · Négatif = concessions · * partiel
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle sub="Référence complète avec code couleur">Délai moyen de location — tableau de référence</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Année", "Studio", "1 chambre", "2 chambres", "3 chambres", "Tous types"].map(h => <Th key={h} center={h !== "Année"}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {delaiData.rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg }}>
                <Td bold>{row.year}{row.partial && <span style={{ color: C.textMuted, fontSize: 11 }}> *</span>}</Td>
                {[row.studio, row.c1, row.c2, row.c3, row.all].map((v, j) => (
                  <td key={j} style={{
                    padding: "10px 14px", textAlign: "center",
                    borderBottom: `1px solid ${C.border}`,
                    fontFamily: "'SF Mono', monospace",
                    fontWeight: 600, fontSize: 12,
                    color: typeof v === "number" ? delayColor(v) : C.textMuted,
                    background: typeof v === "number" ? delayBg(v) : "transparent",
                  }}>
                    {typeof v === "number" ? `${v}j` : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: 11, color: C.textMuted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.greenBg, border: `1px solid ${C.green}`, display: "inline-block" }} /> ≤ 35j excellent</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.yellowBg, border: `1px solid ${C.yellow}`, display: "inline-block" }} /> 36–60j acceptable</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: C.redBg, border: `1px solid ${C.red}`, display: "inline-block" }} /> &gt; 60j à surveiller</span>
        </div>
      </Card>
    </div>
  );
};

const VueUnites = () => {
  const [filterImm, setFilterImm] = useState("Tous");
  const [filterCh,  setFilterCh]  = useState("Tous");

  const filtered = UNITES_EN_COURS.filter(u =>
    (filterImm === "Tous" || u.imm === filterImm) &&
    (filterCh  === "Tous" || u.ch === parseInt(filterCh))
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["Tous", "Will & Rich", "McCord", "Sherwin"].map(v => (
            <FilterBtn key={v} active={filterImm === v} onClick={() => setFilterImm(v)}>{v}</FilterBtn>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["Tous","Tout"], ["0","Studio"], ["1","1 ch"], ["2","2 ch"], ["3","3 ch"]].map(([v,l]) => (
            <FilterBtn key={v} active={filterCh === v} onClick={() => setFilterCh(v)}>{l}</FilterBtn>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginLeft: "auto" }}>
          {filtered.length} unité{filtered.length > 1 ? "s" : ""} en location active
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Immeuble", "Unité", "Modèle", "Type", "Loyer demandé", "Disponibilité", "Jours en marché", "Statut"].map(h => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i} style={{
                  background: u.alerte ? "#fff5f5" : i % 2 === 0 ? C.surface : C.bg,
                  borderLeft: u.alerte ? `3px solid ${C.red}` : "3px solid transparent",
                }}>
                  <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                    <ImmBadge imm={u.imm} />
                  </td>
                  <Td bold>{u.unite}</Td>
                  <Td><span style={{ color: C.textMuted, fontSize: 12 }}>{u.modele}</span></Td>
                  <Td>
                    <span style={{
                      background: C.bg, borderRadius: 5,
                      padding: "2px 8px", fontSize: 11, fontWeight: 500,
                      color: C.textSub,
                    }}>{typeLabel[u.ch]}</span>
                  </Td>
                  <Td mono bold>{fmt$(u.loyer_dem)}</Td>
                  <Td mono><span style={{ color: C.textMuted }}>{u.dispo}</span></Td>
                  <Td mono>
                    <span style={{ fontWeight: 600, color: u.jours > 120 ? C.red : u.jours > 60 ? C.yellow : C.green }}>
                      {u.jours}j
                    </span>
                  </Td>
                  <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                    <StatusPill jours={u.jours} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const VueAnalyseModele = () => {
  const [selImm, setSelImm] = useState("Will & Rich");
  const [selModel, setSelModel] = useState("A01");

  const availableModels = Object.keys(MODELS_DATA[selImm] || {});
  const modelData = MODELS_DATA[selImm]?.[selModel];

  if (!modelData) return <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>Sélectionnez un modèle</div>;

  const { units, superficie, chambres } = modelData;
  const loyers_actuels = units.map(u => u.loyer_actuel);
  const loyers_norm = units.map(u => u.loyer_norm);

  const avg_actuel = loyers_actuels.reduce((a,b)=>a+b,0) / loyers_actuels.length;
  const avg_norm   = loyers_norm.reduce((a,b)=>a+b,0) / loyers_norm.length;
  const median_actuel = [...loyers_actuels].sort((a,b)=>a-b)[Math.floor(loyers_actuels.length/2)];
  const min_actuel = Math.min(...loyers_actuels);
  const max_actuel = Math.max(...loyers_actuels);
  const etendue = max_actuel - min_actuel;
  const variance = loyers_actuels.reduce((sum, val) => sum + Math.pow(val - avg_actuel, 2), 0) / loyers_actuels.length;
  const ecart_type = Math.sqrt(variance);
  const coef_var = (ecart_type / avg_actuel) * 100;
  const prix_pi2_actuel = avg_actuel / superficie;
  const prix_pi2_norm   = avg_norm / superficie;
  const total_actuel = loyers_actuels.reduce((a,b)=>a+b,0);
  const total_norm   = loyers_norm.reduce((a,b)=>a+b,0);
  const augmentation = total_norm - total_actuel;
  const pct_aug = (augmentation / total_actuel) * 100;
  const creation_valeur_annuelle = augmentation * 12;

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Immeuble</div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.keys(MODELS_DATA).map(imm => (
              <FilterBtn key={imm} active={selImm === imm} onClick={() => { setSelImm(imm); setSelModel(Object.keys(MODELS_DATA[imm])[0]); }}>
                {imm}
              </FilterBtn>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Modèle</div>
          <div style={{ display: "flex", gap: 6 }}>
            {availableModels.map(m => (
              <FilterBtn key={m} active={selModel === m} onClick={() => setSelModel(m)}>{m}</FilterBtn>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>Sélection</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>{selImm} — {selModel}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{chambres} chambre{chambres > 1 ? "s" : ""} · {superficie} pi²</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle sub={`${units.length} unités · Loyer actuel vs normalisé`}>Liste des unités</SectionTitle>
          <div style={{ overflowY: "auto", maxHeight: 380 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, background: C.bg, zIndex: 1 }}>
                <tr>
                  {["Unité", "Loyer actuel", "Loyer normalisé", "Δ"].map(h => <Th key={h} center={h !== "Unité"}>{h}</Th>)}
                </tr>
              </thead>
              <tbody>
                {units.map((u, i) => {
                  const delta = u.loyer_norm - u.loyer_actuel;
                  const pct = (delta / u.loyer_actuel) * 100;
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg }}>
                      <Td bold>{u.no}</Td>
                      <Td center mono>{fmt$(u.loyer_actuel)}</Td>
                      <Td center mono><b>{fmt$(u.loyer_norm)}</b></Td>
                      <Td center>
                        <span style={{ color: delta > 0 ? C.green : delta < 0 ? C.red : C.textMuted, fontWeight: 600, fontSize: 12 }}>
                          {delta > 0 ? `+${delta.toFixed(0)} $` : delta < 0 ? `${delta.toFixed(0)} $` : "—"}
                          {delta !== 0 && <span style={{ fontSize: 10, marginLeft: 3, opacity: 0.7 }}>({pct > 0 ? '+' : ''}{pct.toFixed(1)}%)</span>}
                        </span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Total mensuel actuel</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>{fmt$(total_actuel)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: C.textMuted }}>Total normalisé</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>{fmt$(total_norm)}</div>
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px dashed ${C.border}` }}>
            <div style={{ textAlign: "center", color: C.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 8, opacity: 0.3 }}>📐</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>Plan de l'unité</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginTop: 4 }}>Modèle {selModel}</div>
              <div style={{ fontSize: 12, marginTop: 6, color: C.textMuted }}>{chambres} chambre{chambres > 1 ? "s" : ""} · {superficie} pi²</div>
              <div style={{ fontSize: 11, marginTop: 10, color: C.textMuted, fontStyle: "italic" }}>À ajouter ultérieurement</div>
            </div>
          </Card>

          <Card style={{ flex: 1 }}>
            <SectionTitle sub="Distribution des loyers actuels">Statistiques</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px", fontSize: 12 }}>
              {[
                ["Moyenne", fmt$(avg_actuel)],
                ["Médiane", fmt$(median_actuel)],
                ["Min", fmt$(min_actuel)],
                ["Max", fmt$(max_actuel)],
                ["Étendue", fmt$(etendue)],
                ["Écart-type", `${ecart_type.toFixed(2)} $`],
                ["Variation", `${coef_var.toFixed(1)}%`],
                ["Normalisation", fmt$(avg_norm)],
              ].map(([label, val], i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div style={{ color: C.textMuted, fontSize: 11 }}>{label}</div>
                  <div style={{ textAlign: "right", fontWeight: 600, fontFamily: "'SF Mono', monospace", fontSize: 12 }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Prix au pi²</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Actuel</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{prix_pi2_actuel.toFixed(2)} $</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Normalisé</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{prix_pi2_norm.toFixed(2)} $</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card style={{ background: C.bg, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 4 }}>Création de valeur potentielle</div>
            <div style={{ fontSize: 13, color: C.textSub, marginBottom: 12 }}>Si normalisation de tous les loyers au niveau cible</div>
            <div style={{ display: "flex", gap: 32, alignItems: "baseline" }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Augmentation mensuelle</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.green, letterSpacing: "-0.02em" }}>+{fmt$(augmentation)}</div>
                <div style={{ fontSize: 12, color: C.green, marginTop: 2 }}>+{pct_aug.toFixed(2)}%</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Valeur annuelle</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>{fmt$(creation_valeur_annuelle)}</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 56, opacity: 0.15 }}>💎</div>
        </div>
      </Card>
    </div>
  );
};

const VueGestionDonnees = () => {
  const [section, setSection] = useState("immeubles");

  const sections = [
    { id: "immeubles", label: "Immeubles", icon: "🏢" },
    { id: "modeles",   label: "Modèles",   icon: "📐" },
    { id: "appartements", label: "Appartements", icon: "🚪" },
    { id: "locations", label: "Locations", icon: "📝" },
  ];

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    background: C.surface, border: `1px solid ${C.border2}`,
    borderRadius: 7, color: C.text, fontSize: 13,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 11, color: C.textMuted, display: "block", marginBottom: 5, fontWeight: 500 };
  const btnPrimary = {
    padding: "10px 16px", background: C.accent, border: "none", borderRadius: 7,
    color: "#fff", fontWeight: 500, fontSize: 13, cursor: "pointer", marginTop: 8, width: "100%",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            padding: "9px 16px",
            background: section === s.id ? C.accent : C.surface,
            border: `1px solid ${section === s.id ? C.accent : C.border}`,
            borderRadius: 7, color: section === s.id ? "#fff" : C.textSub,
            fontWeight: section === s.id ? 500 : 400, fontSize: 13,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>{s.icon}</span><span>{s.label}</span>
          </button>
        ))}
      </div>

      <Card>
        <SectionTitle sub={
          section === "immeubles" ? "Ajouter ou modifier des immeubles" :
          section === "modeles"   ? "Définir les modèles standards d'unités" :
          section === "appartements" ? "Créer les unités physiques" :
          "Enregistrer les locations"
        }>
          {sections.find(s => s.id === section)?.label}
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Formulaire côté gauche */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ fontSize: 13, color: C.text, margin: "0 0 4px 0", fontWeight: 600 }}>
              Ajouter {section === "immeubles" ? "un immeuble" : section === "modeles" ? "un modèle" : section === "appartements" ? "un appartement" : "une location"}
            </h3>

            {section === "immeubles" && <>
              <div><label style={labelStyle}>NOM</label><input type="text" placeholder="Will & Rich" style={inputStyle} /></div>
              <div><label style={labelStyle}>ADRESSE</label><input type="text" placeholder="123 Rue Example, Montréal" style={inputStyle} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>SUPERFICIE TOTALE (pi²)</label><input type="number" placeholder="75000" style={inputStyle} /></div>
                <div><label style={labelStyle}>ANNÉE CONSTRUCTION</label><input type="number" placeholder="2020" style={inputStyle} /></div>
              </div>
            </>}

            {section === "modeles" && <>
              <div><label style={labelStyle}>IMMEUBLE</label>
                <select style={inputStyle}><option>Will & Rich</option><option>McCord</option><option>Sherwin</option></select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>CODE MODÈLE</label><input type="text" placeholder="A01" style={inputStyle} /></div>
                <div><label style={labelStyle}>SUPERFICIE (pi²)</label><input type="number" placeholder="656" style={inputStyle} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>CHAMBRES</label><input type="number" placeholder="1" min="0" max="5" style={inputStyle} /></div>
                <div><label style={labelStyle}>SALLES DE BAIN</label><input type="number" step="0.5" placeholder="1" style={inputStyle} /></div>
              </div>
            </>}

            {section === "appartements" && <>
              <div><label style={labelStyle}>IMMEUBLE</label>
                <select style={inputStyle}><option>Will & Rich</option><option>McCord</option><option>Sherwin</option></select>
              </div>
              <div><label style={labelStyle}>MODÈLE</label>
                <select style={inputStyle}><option>A01 (656 pi², 1 ch)</option><option>B04 (763 pi², 2 ch)</option><option>C01 (1032 pi², 3 ch)</option></select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>NUMÉRO D'UNITÉ</label><input type="text" placeholder="208" style={inputStyle} /></div>
                <div><label style={labelStyle}>ÉTAGE</label><input type="number" placeholder="2" min="1" style={inputStyle} /></div>
              </div>
            </>}

            {section === "locations" && <>
              <div><label style={labelStyle}>IMMEUBLE</label>
                <select style={inputStyle}><option>Will & Rich</option><option>McCord</option><option>Sherwin</option></select>
              </div>
              <div><label style={labelStyle}>UNITÉ</label>
                <select style={inputStyle}><option>208 (A01, 1 ch)</option><option>301 (B01, 2 ch)</option><option>127 (M06, 3 ch)</option></select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>DATE MISE EN MARCHÉ</label><input type="date" style={inputStyle} /></div>
                <div><label style={labelStyle}>DATE DISPONIBILITÉ</label><input type="date" style={inputStyle} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>LOYER DEMANDÉ ($)</label><input type="number" placeholder="1950" style={inputStyle} /></div>
                <div><label style={labelStyle}>LOYER SIGNÉ ($)</label><input type="number" placeholder="1950" style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>STATUT</label>
                <select style={inputStyle}><option>En marché</option><option>Bail signé</option><option>Bail actif</option><option>Terminé</option></select>
              </div>
            </>}

            <button style={btnPrimary}>+ Ajouter</button>
          </div>

          {/* Liste côté droit */}
          <div>
            <h3 style={{ fontSize: 13, color: C.text, margin: "0 0 12px 0", fontWeight: 600 }}>Existants</h3>
            {section === "immeubles" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SUMMARY.map((imm, i) => (
                  <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{imm.immeuble}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{imm.total} unités</div>
                    </div>
                    <button style={{ padding: "5px 10px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textSub, fontSize: 11, cursor: "pointer" }}>
                      Modifier
                    </button>
                  </div>
                ))}
              </div>
            )}
            {section === "modeles" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["A01 — 656 pi² — 1 ch", "A02 — 580 pi² — 1 ch", "B01 — 867 pi² — 2 ch", "B04 — 763 pi² — 2 ch", "C01 — 1032 pi² — 3 ch"].map((mod, i) => (
                  <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12, color: C.text, fontFamily: "'SF Mono', monospace" }}>{mod}</div>
                    <button style={{ padding: "3px 8px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5, color: C.textMuted, fontSize: 11, cursor: "pointer" }}>✏️</button>
                  </div>
                ))}
              </div>
            )}
            {(section === "appartements" || section === "locations") && (
              <div style={{ color: C.textMuted, fontSize: 13, padding: "24px 0" }}>
                Sélectionnez un immeuble pour afficher les unités existantes.
              </div>
            )}
          </div>
        </div>
      </Card>

      {section === "locations" && (
        <Card style={{ marginTop: 16, background: C.bg }}>
          <SectionTitle sub="3 dernières entrées">Historique récent</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Unité", "Début bail", "Loyer signé", "Délai", "Statut"].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {[
                { unite: "208", debut: "2024-05-01", loyer: "2 280 $", delai: "22j", delaiColor: C.green, statut: "Actif", statColor: C.green },
                { unite: "317", debut: "2024-04-01", loyer: "2 240 $", delai: "74j", delaiColor: C.red, statut: "Actif", statColor: C.green },
                { unite: "406", debut: "2023-05-01", loyer: "1 850 $", delai: "182j", delaiColor: C.yellow, statut: "Terminé", statColor: C.textMuted },
              ].map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? C.surface : C.bg }}>
                  <Td bold>{r.unite}</Td>
                  <Td mono>{r.debut}</Td>
                  <Td mono>{r.loyer}</Td>
                  <Td><span style={{ fontWeight: 600, color: r.delaiColor }}>{r.delai}</span></Td>
                  <td style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 12, color: r.statColor, fontWeight: 500 }}>{r.statut}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────────────────────────

export default function MondevDashboard() {
  const [tab, setTab] = useState("global");

  const tabs = [
    { id: "global",  label: "Vue globale"       },
    { id: "prix",    label: "Prix au pi²"       },
    { id: "delai",   label: "Délai & Delta"     },
    { id: "unites",  label: "Unités en cours"   },
    { id: "modeles", label: "Analyse par modèle" },
    { id: "gestion", label: "Gestion données"   },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: C.surface, color: C.text,
        padding: "0 32px",
        display: "flex", alignItems: "center",
        borderBottom: `1px solid ${C.border}`,
        height: 60,
        gap: 24,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 24, borderRight: `1px solid ${C.border}` }}>
          <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, color: "#fff" }}>M</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: "-0.01em" }}>Mondev</span>
        </div>

        {/* Title */}
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>Rapport de location interne</span>
          <span style={{ fontSize: 13, color: C.textMuted, marginLeft: 8 }}>Will &amp; Rich · McCord · Sherwin</span>
        </div>

        {/* Date */}
        <div style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} />
          Mis à jour le 17 février 2026
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: C.surface, padding: "0 32px", display: "flex", gap: 0, borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "14px 18px", background: "none", border: "none",
            borderBottom: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
            color: tab === t.id ? C.text : C.textMuted,
            fontWeight: tab === t.id ? 600 : 400, fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
            fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 32px 48px" }}>
        {tab === "global"  && <VueGlobale />}
        {tab === "prix"    && <VuePrix />}
        {tab === "delai"   && <VueDélai />}
        {tab === "unites"  && <VueUnites />}
        {tab === "modeles" && <VueAnalyseModele />}
        {tab === "gestion" && <VueGestionDonnees />}
      </div>
    </div>
  );
}
