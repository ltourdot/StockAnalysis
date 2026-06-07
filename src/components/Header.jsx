// src/components/Header.jsx
import { Pill, ACTION_COLORS, fmt } from './ui';

const WEIGHTS = { profitability: 0.25, balance_sheet: 0.20, cash_flow: 0.25, working_capital: 0.05, valuation: 0.15, growth: 0.10 };

function calcWeighted(result) {
  if (!result) return null;
  let total = 0, w = 0;
  Object.entries(WEIGHTS).forEach(([k, wt]) => {
    const s = result[k]?.section_score;
    if (s != null) { total += s * wt; w += wt; }
  });
  return w > 0 ? (total / w).toFixed(1) : null;
}

export default function Header({ result, quote, onReset }) {
  const ws = calcWeighted(result);
  const wsNum = parseFloat(ws);
  const wsColor = wsNum >= 7 ? '#22c55e' : wsNum >= 5 ? '#f59e0b' : '#ef4444';
  const actionColor = ACTION_COLORS[result.thesis?.action] || '#6b7280';
  const price = quote?.price ?? result.market_data?.stock_price;
  const change = quote?.change;
  const changePct = quote?.changePct;

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 12, padding: '22px 24px', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#f9fafb' }}>
              {result.company || 'Company'}
            </h2>
            {result.ticker && (
              <span style={{ fontFamily: 'monospace', fontSize: 13, background: '#111827', padding: '2px 10px', borderRadius: 4, color: '#9ca3af' }}>
                {result.ticker}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#4b5563', marginBottom: 10 }}>
            {result.sector && <span>{result.sector}</span>}
            {result.sector && result.fiscal_period && <span style={{ margin: '0 6px' }}>·</span>}
            {result.fiscal_period && <span>{result.fiscal_period}</span>}
          </div>

          {/* Live price */}
          {price && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#f9fafb', fontFamily: 'monospace' }}>${parseFloat(price).toFixed(2)}</span>
              {change != null && (
                <span style={{ fontSize: 13, color: change >= 0 ? '#22c55e' : '#ef4444', fontFamily: 'monospace' }}>
                  {change >= 0 ? '+' : ''}{change?.toFixed(2)} ({changePct?.toFixed(2)}%)
                </span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {result.thesis?.action && <Pill text={result.thesis.action} color={actionColor} />}
            {result.thesis?.conviction != null && (
              <span style={{ fontSize: 12, color: '#4b5563' }}>
                Conviction <strong style={{ color: '#9ca3af' }}>{result.thesis.conviction}/10</strong>
              </span>
            )}
            {result.thesis?.moat_type && (
              <span style={{ fontSize: 12, color: '#4b5563' }}>
                Moat: <strong style={{ color: '#9ca3af', textTransform: 'capitalize' }}>{result.thesis.moat_type.replace(/_/g, ' ')}</strong>
              </span>
            )}
            {result.thesis?.target_entry_price && (
              <span style={{ fontSize: 12, color: '#4b5563' }}>
                Target entry: <strong style={{ color: '#22c55e' }}>${result.thesis.target_entry_price}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Score + reset */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Weighted Score</div>
            <div style={{ fontSize: 44, fontWeight: 800, color: wsColor, lineHeight: 1 }}>
              {ws}<span style={{ fontSize: 20, color: '#374151' }}>/10</span>
            </div>
          </div>
          <button onClick={onReset} style={{ background: 'none', border: '1px solid #1f2937', color: '#4b5563', fontSize: 12, cursor: 'pointer', padding: '6px 14px', borderRadius: 6 }}>
            ← New Analysis
          </button>
        </div>
      </div>

      {/* Executive summary */}
      {result.overall?.executive_summary && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #111827' }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: '#9ca3af', fontStyle: 'italic' }}>
            {result.overall.executive_summary}
          </p>
        </div>
      )}

      {/* Strengths + concerns */}
      {(result.overall?.top_3_strengths?.length || result.overall?.top_3_concerns?.length) ? (
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {result.overall?.top_3_strengths?.length > 0 && (
            <div style={{ background: '#052e16', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Strengths</div>
              {result.overall.top_3_strengths.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: '#86efac', marginBottom: 3, display: 'flex', gap: 6 }}>
                  <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>{s}
                </div>
              ))}
            </div>
          )}
          {result.overall?.top_3_concerns?.length > 0 && (
            <div style={{ background: '#1c0a0a', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Concerns</div>
              {result.overall.top_3_concerns.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: '#fca5a5', marginBottom: 3, display: 'flex', gap: 6 }}>
                  <span style={{ color: '#ef4444', flexShrink: 0 }}>△</span>{s}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
