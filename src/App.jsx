// src/App.jsx
import { useState, useEffect } from 'react';
import { useAnalysis } from './hooks/useAnalysis';
import Setup from './components/Setup';
import Dashboard from './components/Dashboard';
import ProgressBar from './components/ProgressBar';

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

export default function App() {
  const { status, loading, rawData, result, error, analyze, reset } = useAnalysis();
  const [activeTab, setActiveTab] = useState('setup');

  const ws = calcWeighted(result);
  const wsNum = parseFloat(ws);
  const wsColor = wsNum >= 7 ? '#22c55e' : wsNum >= 5 ? '#f59e0b' : '#ef4444';

  // Switch to results tab when analysis completes
  useEffect(() => {
    if (result && !loading) {
      setActiveTab('results');
    }
  }, [result, loading]);

  function handleAnalyze(params) {
    setActiveTab('setup');
    analyze(params);
  }

  function handleReset() {
    reset();
    setActiveTab('setup');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#f9fafb', fontFamily: 'Georgia, serif', padding: '20px 16px' }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030712; }
        ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 2px; }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#f9fafb' }}>
              Equity Intelligence
            </h1>
            <span style={{ fontSize: 10, color: '#374151', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Fundamental Dashboard
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.5 }}>
            SEC EDGAR · Alpha Vantage · Financial Modeling Prep · Claude AI analysis
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: '#0d1117', borderRadius: 8, padding: 3, border: '1px solid #111827' }}>
          {[
            ['setup', 'Analysis Setup'],
            ['results', result ? `Results · ${result.ticker || ''} ${ws ? `· ${ws}/10` : ''}` : 'Results'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: '9px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: activeTab === id ? '#111827' : 'transparent',
              color: activeTab === id ? (id === 'results' && ws ? wsColor : '#f9fafb') : '#4b5563',
              fontSize: 13, fontWeight: activeTab === id ? 700 : 400,
              fontFamily: 'Georgia, serif', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <div>
            {loading && <ProgressBar step={status.step} message={status.message} />}
            {!loading && <Setup onAnalyze={handleAnalyze} loading={loading} error={error} />}
            {error && !loading && (
              <div style={{ marginTop: 16, padding: '14px 16px', background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: 8 }}>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: '#fca5a5' }}>{error}</p>
                <button onClick={handleReset} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                  Try again →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          result
            ? <Dashboard result={result} rawData={rawData} onReset={handleReset} />
            : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <p style={{ color: '#374151', fontSize: 14 }}>No analysis yet. Return to Setup and enter a ticker.</p>
                <button onClick={() => setActiveTab('setup')} style={{ marginTop: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}>
                  Go to Setup →
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
}
