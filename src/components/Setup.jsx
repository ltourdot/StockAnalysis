// src/components/Setup.jsx
import { useState, useRef } from 'react';

const S = {
  wrap: { maxWidth: 680, margin: '0 auto' },
  label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#4b5563', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 8 },
  card: { background: '#0d1117', border: '1px solid #1f2937', borderRadius: 10, padding: '20px 22px', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s' },
  input: { flex: 1, background: '#0d1117', border: '1px solid #1f2937', borderRadius: 8, color: '#f9fafb', fontSize: 22, fontWeight: 700, padding: '12px 16px', fontFamily: 'monospace', letterSpacing: '0.06em', outline: 'none' },
  btn: { padding: '13px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' },
  btnDisabled: { padding: '13px 28px', background: '#0d1117', color: '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'not-allowed', whiteSpace: 'nowrap' },
  hint: { marginTop: 12, padding: '12px 14px', background: '#0d1117', border: '1px solid #111827', borderRadius: 8 },
  hintTitle: { margin: '0 0 6px', fontSize: 11, color: '#374151', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' },
  hintText: { margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.6 },
};

export default function Setup({ onAnalyze, loading, error }) {
  const [mode, setMode] = useState(null);
  const [ticker, setTicker] = useState('');
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'application/pdf') setFile(f);
  }

  return (
    <div style={S.wrap}>
      {!mode && (
        <div>
          <p style={S.label}>Select data source</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { id: 'ticker', icon: '📡', title: 'Live Lookup', badge: 'Automated', desc: 'Enter a ticker. Pulls SEC EDGAR filings, Alpha Vantage market data, and FMP financials automatically.' },
              { id: 'upload', icon: '📄', title: 'Upload Filing', badge: 'High precision', desc: 'Upload a 10-K or 10-Q PDF from SEC.gov. Best for smaller companies or specific filing periods.' },
            ].map(opt => (
              <div key={opt.id} style={S.card} onClick={() => setMode(opt.id)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{opt.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#e5e7eb' }}>{opt.title}</span>
                  <span style={{ fontSize: 10, padding: '1px 8px', borderRadius: 10, background: '#111827', color: '#6b7280' }}>{opt.badge}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.5 }}>{opt.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: '14px 16px', background: '#0d1117', border: '1px solid #1a2535', borderRadius: 8 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#3b82f6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Data Pipeline</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                ['SEC EDGAR', 'Annual 10-K via Claude web search'],
                ['Alpha Vantage', 'Real-time price, beta, market cap'],
                ['Financial Modeling Prep', 'Ratios, CCC, historical data'],
              ].map(([source, desc]) => (
                <div key={source} style={{ background: '#030712', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 3 }}>{source}</div>
                  <div style={{ fontSize: 11, color: '#374151' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'ticker' && (
        <div>
          <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: 12, cursor: 'pointer', padding: '0 0 16px' }}>← Back</button>
          <label style={S.label}>Ticker Symbol</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={ticker}
              onChange={e => setTicker(e.target.value.toUpperCase().replace(/[^A-Z.]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && ticker.trim() && onAnalyze({ ticker })}
              placeholder="AAPL"
              maxLength={6}
              style={S.input}
            />
            <button
              onClick={() => onAnalyze({ ticker })}
              disabled={!ticker.trim() || loading}
              style={ticker.trim() && !loading ? S.btn : S.btnDisabled}
            >
              Analyze →
            </button>
          </div>
          <div style={S.hint}>
            <p style={S.hintTitle}>What gets pulled</p>
            <p style={S.hintText}>
              SEC EDGAR 10-K (income statement, balance sheet, cash flows including A/R, inventory, A/P for CCC) · Alpha Vantage real-time quote and company overview · Financial Modeling Prep historical ratios and DSO/DIO/DPO. Takes 40–70 seconds.
            </p>
          </div>
        </div>
      )}

      {mode === 'upload' && (
        <div>
          <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: 12, cursor: 'pointer', padding: '0 0 16px' }}>← Back</button>
          <label style={S.label}>10-K or 10-Q PDF</label>
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${file ? '#22c55e' : '#1f2937'}`,
              borderRadius: 10, padding: '40px 20px', textAlign: 'center',
              cursor: 'pointer', background: '#0d1117', marginBottom: 12, transition: 'border-color 0.2s',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>{file ? '✅' : '📁'}</div>
            {file ? (
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#22c55e' }}>{file.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#4b5563' }}>{(file.size / 1024 / 1024).toFixed(1)} MB · Click to change</p>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#6b7280' }}>Drop PDF here or click to browse</p>
                <p style={{ margin: 0, fontSize: 12, color: '#374151' }}>10-K or 10-Q · PDF format</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
          </div>
          {file && (
            <button onClick={() => onAnalyze({ file })} disabled={loading}
              style={!loading ? S.btn : S.btnDisabled}>
              Analyze Filing →
            </button>
          )}
          <div style={{ ...S.hint, marginTop: 12 }}>
            <p style={S.hintTitle}>Where to get the file</p>
            <p style={S.hintText}>
              Go to <code style={{ color: '#60a5fa', fontSize: 11 }}>sec.gov/cgi-bin/browse-edgar</code>, search your ticker, filter by 10-K, open the filing, and download the main document PDF.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 16, padding: '14px 16px', background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#fca5a5' }}>{error}</p>
        </div>
      )}
    </div>
  );
}
