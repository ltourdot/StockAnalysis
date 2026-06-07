// src/components/ScoreGrid.jsx
import { SECTION_ACCENTS } from './ui';

const WEIGHTS = {
  profitability: { label: 'Profitability', weight: '25%' },
  balance_sheet: { label: 'Balance Sheet', weight: '20%' },
  cash_flow: { label: 'Cash Flow', weight: '25%' },
  working_capital: { label: 'Working Capital', weight: '5%' },
  valuation: { label: 'Valuation', weight: '15%' },
  growth: { label: 'Growth', weight: '10%' },
};

export default function ScoreGrid({ result }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
      {Object.entries(WEIGHTS).map(([key, { label, weight }]) => {
        const score = result[key]?.section_score;
        const accent = SECTION_ACCENTS[key] || '#6b7280';
        const color = score >= 7 ? '#22c55e' : score >= 5 ? '#f59e0b' : score != null ? '#ef4444' : '#374151';
        const pct = score != null ? (score / 10) * 100 : 0;

        return (
          <div key={key} style={{
            background: '#0d1117', border: `1px solid ${accent}18`,
            borderRadius: 10, padding: '14px 16px',
            borderTop: `3px solid ${score != null ? accent : '#1f2937'}`,
          }}>
            <div style={{ fontSize: 10, color: accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              {label}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>
                {score != null ? score : '—'}
              </div>
              <div style={{ fontSize: 10, color: '#374151', textAlign: 'right', lineHeight: 1.3 }}>
                <div style={{ color: '#4b5563' }}>weight</div>
                <div style={{ fontWeight: 700 }}>{weight}</div>
              </div>
            </div>
            {/* Mini bar */}
            <div style={{ height: 3, background: '#111827', borderRadius: 2 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 1s ease' }} />
            </div>
            {result[key]?.section_note && (
              <p style={{ margin: '8px 0 0', fontSize: 11, color: '#4b5563', lineHeight: 1.4 }}>
                {result[key].section_note.slice(0, 80)}{result[key].section_note.length > 80 ? '...' : ''}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
