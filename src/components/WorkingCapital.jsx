// src/components/WorkingCapital.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { SectionCard, ScoreBar, fmt } from './ui';

const ACCENT = '#fb923c';

function CCCBar({ dso, dio, dpo, ccc }) {
  if (dso == null && dio == null && dpo == null) return null;

  const data = [
    { name: 'DSO', value: dso ?? 0, color: '#60a5fa', label: 'Days Sales Outstanding' },
    { name: 'DIO', value: dio ?? 0, color: '#a78bfa', label: 'Days Inventory Outstanding' },
    { name: 'DPO', value: -(dpo ?? 0), color: '#34d399', label: 'Days Payable Outstanding (offset)' },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 8 }}>
        CCC = DSO + DIO − DPO = <strong style={{ color: ccc != null ? (ccc < 0 ? '#22c55e' : ccc < 30 ? '#f9fafb' : '#f59e0b') : '#9ca3af' }}>
          {ccc != null ? `${ccc.toFixed(1)} days` : '—'}
        </strong>
      </div>
      <div style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#111827" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={35} />
            <Tooltip
              contentStyle={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 6, fontSize: 12 }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value, name, props) => [`${Math.abs(value).toFixed(1)} days`, props.payload.label]}
            />
            <ReferenceLine x={0} stroke="#374151" />
            <Bar dataKey="value" radius={[0, 3, 3, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function WorkingCapital({ wc }) {
  if (!wc) return null;
  const { dso, dio, dpo, ccc, ccc_insight, accounts_receivable_m, inventory_m, accounts_payable_m, section_score, section_note } = wc;

  const metrics = [
    {
      label: 'Days Sales Outstanding (DSO)',
      value: dso?.value, type: 'd',
      color: '#60a5fa',
      score: dso?.score,
      benchmark: dso?.benchmark,
      note: dso?.note,
      explain: 'How long it takes to collect cash from customers after a sale.',
      better: 'lower',
    },
    {
      label: 'Days Inventory Outstanding (DIO)',
      value: dio?.value, type: 'd',
      color: '#a78bfa',
      score: dio?.score,
      benchmark: dio?.benchmark,
      note: dio?.note,
      explain: 'How long inventory sits before being sold.',
      better: 'lower',
    },
    {
      label: 'Days Payable Outstanding (DPO)',
      value: dpo?.value, type: 'd',
      color: '#34d399',
      score: dpo?.score,
      benchmark: dpo?.benchmark,
      note: dpo?.note,
      explain: 'How long the company takes to pay suppliers. Longer = keeps cash.',
      better: 'higher',
    },
    {
      label: 'Cash Conversion Cycle (CCC)',
      value: ccc?.value, type: 'd',
      color: ccc?.value != null && ccc.value < 0 ? '#22c55e' : '#f59e0b',
      score: ccc?.score,
      benchmark: ccc?.benchmark,
      note: ccc?.note,
      explain: 'DSO + DIO − DPO. Net days cash is tied up in operations. Negative = gets paid before paying suppliers.',
      better: 'lower',
    },
  ];

  return (
    <SectionCard title="Working Capital · Cash Conversion Cycle" score={section_score} note={section_note} accent={ACCENT}>
      <CCCBar dso={dso?.value} dio={dio?.value} dpo={dpo?.value} ccc={ccc?.value} />

      {/* Raw balance sheet inputs */}
      {(accounts_receivable_m != null || inventory_m != null || accounts_payable_m != null) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Accounts Receivable', value: accounts_receivable_m, color: '#60a5fa' },
            { label: 'Inventory', value: inventory_m, color: '#a78bfa' },
            { label: 'Accounts Payable', value: accounts_payable_m, color: '#34d399' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#030712', borderRadius: 6, padding: '10px 12px', borderLeft: `3px solid ${color}` }}>
              <div style={{ fontSize: 10, color: '#4b5563', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f9fafb', fontFamily: 'monospace' }}>{fmt(value, 'm')}</div>
            </div>
          ))}
        </div>
      )}

      {/* Metric rows */}
      {metrics.map(({ label, value, type, color, score, benchmark, note, explain, better }) => (
        <div key={label} style={{ padding: '11px 0', borderBottom: '1px solid #111827' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                {label}
                <span style={{ fontSize: 10, color: '#374151', fontStyle: 'normal' }}>({better} is better)</span>
              </div>
              {benchmark && <div style={{ fontSize: 11, color: '#4b5563', marginTop: 1, marginLeft: 14 }}>{benchmark}</div>}
              {explain && <div style={{ fontSize: 11, color: '#374151', marginTop: 1, marginLeft: 14 }}>{explain}</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f9fafb', fontFamily: 'monospace' }}>{fmt(value, type)}</span>
              <ScoreBar score={score} />
            </div>
          </div>
          {note && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, marginLeft: 14, fontStyle: 'italic', lineHeight: 1.4 }}>{note}</div>}
        </div>
      ))}

      {/* CCC insight */}
      {ccc_insight && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: '#1a1000', borderRadius: 8, borderLeft: `3px solid ${ACCENT}` }}>
          <div style={{ fontSize: 10, color: ACCENT, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Working Capital Insight
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#fed7aa', lineHeight: 1.6 }}>{ccc_insight}</p>
        </div>
      )}
    </SectionCard>
  );
}
