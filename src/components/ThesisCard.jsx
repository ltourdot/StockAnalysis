// src/components/ThesisCard.jsx
import { ACTION_COLORS } from './ui';

export default function ThesisCard({ thesis }) {
  if (!thesis) return null;
  const actionColor = ACTION_COLORS[thesis.action] || '#6b7280';

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1e3a5f', borderRadius: 12, padding: '20px 22px', marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
        Investment Thesis
      </div>

      {thesis.one_sentence && (
        <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.65, color: '#e5e7eb', fontStyle: 'italic' }}>
          "{thesis.one_sentence}"
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {thesis.bull_case && (
          <div style={{ background: '#052e16', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bull Case</div>
            <p style={{ margin: 0, fontSize: 12, color: '#86efac', lineHeight: 1.55 }}>{thesis.bull_case}</p>
          </div>
        )}
        {thesis.bear_case && (
          <div style={{ background: '#1c0a0a', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 800, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bear Case</div>
            <p style={{ margin: 0, fontSize: 12, color: '#fca5a5', lineHeight: 1.55 }}>{thesis.bear_case}</p>
          </div>
        )}
      </div>

      {thesis.key_risk && (
        <div style={{ padding: '10px 14px', background: '#1c1500', borderRadius: 6, borderLeft: '3px solid #f59e0b', marginBottom: 10 }}>
          <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Key Risk · </span>
          <span style={{ fontSize: 12, color: '#fde68a' }}>{thesis.key_risk}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #111827' }}>
        {thesis.action && (
          <div>
            <div style={{ fontSize: 10, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Action</div>
            <span style={{
              fontSize: 14, fontWeight: 800, color: actionColor,
              background: `${actionColor}18`, padding: '3px 14px', borderRadius: 20, border: `1px solid ${actionColor}40`,
            }}>{thesis.action}</span>
          </div>
        )}
        {thesis.conviction != null && (
          <div>
            <div style={{ fontSize: 10, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Conviction</div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#9ca3af' }}>{thesis.conviction}/10</span>
          </div>
        )}
        {thesis.target_entry_price != null && (
          <div>
            <div style={{ fontSize: 10, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Target Entry</div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#22c55e' }}>${thesis.target_entry_price}</span>
          </div>
        )}
        {thesis.moat_type && (
          <div>
            <div style={{ fontSize: 10, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Moat</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'capitalize' }}>{thesis.moat_type.replace(/_/g, ' ')}</span>
          </div>
        )}
      </div>

      {thesis.position_size_note && (
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#4b5563', fontStyle: 'italic' }}>{thesis.position_size_note}</p>
      )}
    </div>
  );
}
