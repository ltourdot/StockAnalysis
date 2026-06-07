// src/components/RiskPanel.jsx
import { SectionCard, FLAG_COLORS, fmt } from './ui';

const ACCENT = '#94a3b8';

export default function RiskPanel({ risk }) {
  if (!risk) return null;

  const rows = [
    { label: 'Beta', data: risk.beta, valueType: 'raw' },
    { label: 'Goodwill % of Assets', data: risk.goodwill_pct_assets, valueType: 'pct' },
    { label: 'Revenue Concentration', data: risk.revenue_concentration, valueType: 'pct' },
    { label: 'Insider Ownership', data: risk.insider_ownership, valueType: 'pct' },
    { label: 'Insider Activity', data: risk.insider_activity, valueType: 'text' },
    { label: 'Share Dilution (YoY)', data: risk.share_dilution_yoy, valueType: 'pct' },
  ];

  const flags = rows.map(r => r.data?.flag).filter(Boolean);
  const redCount = flags.filter(f => f === 'Red').length;
  const yellowCount = flags.filter(f => f === 'Yellow').length;

  return (
    <SectionCard title="Risk Signals" score={risk.section_score} note={risk.section_note} accent={ACCENT}>
      {/* Flag summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Red flags', count: redCount, color: '#ef4444' },
          { label: 'Yellow flags', count: yellowCount, color: '#f59e0b' },
          { label: 'Green', count: flags.filter(f => f === 'Green').length, color: '#22c55e' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 6, padding: '6px 12px', textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color }}>{count}</div>
            <div style={{ fontSize: 10, color: '#4b5563' }}>{label}</div>
          </div>
        ))}
      </div>

      {rows.map(({ label, data, valueType }) => {
        const flagColor = FLAG_COLORS[data?.flag] || '#374151';
        const displayVal = data?.value != null
          ? (valueType === 'pct' ? fmt(data.value, 'pct') : valueType === 'x' ? fmt(data.value, 'x') : String(data.value))
          : '—';

        return (
          <div key={label} style={{ padding: '10px 0', borderBottom: '1px solid #111827', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb' }}>{label}</div>
              {data?.benchmark && <div style={{ fontSize: 11, color: '#4b5563' }}>{data.benchmark}</div>}
              {data?.note && <div style={{ fontSize: 11, color: '#6b7280', fontStyle: 'italic', marginTop: 2, lineHeight: 1.4 }}>{data.note}</div>}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb', fontFamily: 'monospace', marginBottom: 4 }}>{displayVal}</div>
              {data?.flag && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10,
                  background: `${flagColor}18`, color: flagColor, border: `1px solid ${flagColor}40`,
                }}>{data.flag}</span>
              )}
            </div>
          </div>
        );
      })}
    </SectionCard>
  );
}
