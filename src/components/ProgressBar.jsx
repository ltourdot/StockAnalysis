// src/components/ProgressBar.jsx

const STEPS = ['Data Source', 'Extract Financials', 'Merge Market Data', 'Run Analysis', 'Complete'];

export default function ProgressBar({ step, message }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                background: i < step ? '#22c55e' : i === step ? '#3b82f6' : '#0d1117',
                color: i < step ? '#fff' : i === step ? '#fff' : '#374151',
                border: i === step ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'all 0.3s', flexShrink: 0,
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 9, color: i <= step ? '#9ca3af' : '#374151', marginTop: 4, textAlign: 'center', maxWidth: 60, lineHeight: 1.2 }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? '#22c55e' : '#111827', margin: '13px 4px 0', transition: 'all 0.4s' }} />
            )}
          </div>
        ))}
      </div>
      {message && (
        <div style={{ marginTop: 16, background: '#0d1117', border: '1px solid #111827', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 18, height: 18, border: '2px solid #1f2937', borderTopColor: '#3b82f6',
            borderRadius: '50%', flexShrink: 0,
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{message}</span>
        </div>
      )}
    </div>
  );
}
