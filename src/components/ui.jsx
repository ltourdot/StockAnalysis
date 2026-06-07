// src/components/ui.jsx
// Shared primitive components used across the dashboard

export function ScoreBar({ score, max = 10 }) {
  if (score == null) return <span style={{ color: '#374151', fontSize: 12 }}>N/A</span>;
  const pct = (score / max) * 100;
  const color = score >= 7 ? '#22c55e' : score >= 5 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 80, height: 4, background: '#1f2937', borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 30 }}>{score}/10</span>
    </div>
  );
}

export function Pill({ text, color }) {
  if (!text) return null;
  return (
    <span style={{
      padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
      background: `${color}1a`, color, border: `1px solid ${color}40`, letterSpacing: '0.04em',
    }}>{text}</span>
  );
}

export function SectionCard({ title, score, note, accent, children }) {
  return (
    <div style={{ background: '#0d1117', border: `1px solid ${accent}22`, borderRadius: 10, padding: '18px 20px', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: note ? 6 : 14 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: '#374151' }}>SECTION</span>
          <ScoreBar score={score} />
        </div>
      </div>
      {note && <p style={{ margin: '0 0 14px', fontSize: 12, color: '#6b7280', fontStyle: 'italic', lineHeight: 1.5 }}>{note}</p>}
      {children}
    </div>
  );
}

export function MetricRow({ label, value, valueType, benchmark, score, note }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid #111827' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb' }}>{label}</div>
          {benchmark && <div style={{ fontSize: 11, color: '#4b5563', marginTop: 1 }}>{benchmark}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f9fafb', fontFamily: 'monospace' }}>{fmt(value, valueType)}</span>
          <ScoreBar score={score} />
        </div>
      </div>
      {note && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, fontStyle: 'italic', lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

export function fmt(val, type) {
  if (val === null || val === undefined) return '—';
  const n = parseFloat(val);
  if (isNaN(n)) return String(val);
  if (type === 'pct') return `${(n * 100).toFixed(1)}%`;
  if (type === 'x') return `${n.toFixed(2)}x`;
  if (type === 'd') return `${n.toFixed(1)}d`;
  if (type === 'm') {
    if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}B`;
    return `$${n.toFixed(0)}M`;
  }
  if (type === '$') return `$${n.toFixed(2)}`;
  return String(val);
}

export const SECTION_ACCENTS = {
  profitability: '#60a5fa',
  balance_sheet: '#a78bfa',
  cash_flow: '#34d399',
  working_capital: '#fb923c',
  valuation: '#f472b6',
  growth: '#facc15',
  risk: '#94a3b8',
};

export const ACTION_COLORS = {
  Buy: '#22c55e',
  Hold: '#f59e0b',
  Pass: '#ef4444',
  Watch: '#3b82f6',
};

export const FLAG_COLORS = {
  Green: '#22c55e',
  Yellow: '#f59e0b',
  Red: '#ef4444',
};
