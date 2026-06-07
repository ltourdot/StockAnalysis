// src/components/Dashboard.jsx
import Header from './Header';
import ScoreGrid from './ScoreGrid';
import ThesisCard from './ThesisCard';
import WorkingCapital from './WorkingCapital';
import RiskPanel from './RiskPanel';
import { SectionCard, MetricRow, SECTION_ACCENTS } from './ui';

export default function Dashboard({ result, rawData, quote }) {
  const r = result;

  return (
    <div>
      <Header result={r} quote={quote} onReset={() => window.location.reload()} />
      <ScoreGrid result={r} />
      <ThesisCard thesis={r.thesis} />

      {/* Profitability */}
      <SectionCard title="Profitability" score={r.profitability?.section_score} note={r.profitability?.section_note} accent={SECTION_ACCENTS.profitability}>
        <MetricRow label="Gross Margin" value={r.profitability?.gross_margin?.value} valueType="pct" benchmark={r.profitability?.gross_margin?.benchmark} score={r.profitability?.gross_margin?.score} note={r.profitability?.gross_margin?.note} />
        <MetricRow label="Operating Margin" value={r.profitability?.operating_margin?.value} valueType="pct" benchmark={r.profitability?.operating_margin?.benchmark} score={r.profitability?.operating_margin?.score} note={r.profitability?.operating_margin?.note} />
        <MetricRow label="Net Margin" value={r.profitability?.net_margin?.value} valueType="pct" benchmark={r.profitability?.net_margin?.benchmark} score={r.profitability?.net_margin?.score} note={r.profitability?.net_margin?.note} />
        <MetricRow label="EBITDA Margin" value={r.profitability?.ebitda_margin?.value} valueType="pct" benchmark={r.profitability?.ebitda_margin?.benchmark} score={r.profitability?.ebitda_margin?.score} note={r.profitability?.ebitda_margin?.note} />
        <MetricRow label="Return on Equity (ROE)" value={r.profitability?.roe?.value} valueType="pct" benchmark={r.profitability?.roe?.benchmark} score={r.profitability?.roe?.score} note={r.profitability?.roe?.note} />
        <MetricRow label="Return on Invested Capital (ROIC)" value={r.profitability?.roic?.value} valueType="pct" benchmark={r.profitability?.roic?.benchmark} score={r.profitability?.roic?.score} note={r.profitability?.roic?.note} />
      </SectionCard>

      {/* Balance Sheet */}
      <SectionCard title="Balance Sheet" score={r.balance_sheet?.section_score} note={r.balance_sheet?.section_note} accent={SECTION_ACCENTS.balance_sheet}>
        <MetricRow label="Current Ratio" value={r.balance_sheet?.current_ratio?.value} valueType="x" benchmark={r.balance_sheet?.current_ratio?.benchmark} score={r.balance_sheet?.current_ratio?.score} note={r.balance_sheet?.current_ratio?.note} />
        <MetricRow label="Quick Ratio" value={r.balance_sheet?.quick_ratio?.value} valueType="x" benchmark={r.balance_sheet?.quick_ratio?.benchmark} score={r.balance_sheet?.quick_ratio?.score} note={r.balance_sheet?.quick_ratio?.note} />
        <MetricRow label="Debt / Equity" value={r.balance_sheet?.debt_to_equity?.value} valueType="x" benchmark={r.balance_sheet?.debt_to_equity?.benchmark} score={r.balance_sheet?.debt_to_equity?.score} note={r.balance_sheet?.debt_to_equity?.note} />
        <MetricRow label="Net Debt" value={r.balance_sheet?.net_debt_m?.value} valueType="m" benchmark={r.balance_sheet?.net_debt_m?.benchmark} score={r.balance_sheet?.net_debt_m?.score} note={r.balance_sheet?.net_debt_m?.note} />
        <MetricRow label="Net Debt / EBITDA" value={r.balance_sheet?.net_debt_to_ebitda?.value} valueType="x" benchmark={r.balance_sheet?.net_debt_to_ebitda?.benchmark} score={r.balance_sheet?.net_debt_to_ebitda?.score} note={r.balance_sheet?.net_debt_to_ebitda?.note} />
        <MetricRow label="Interest Coverage" value={r.balance_sheet?.interest_coverage?.value} valueType="x" benchmark={r.balance_sheet?.interest_coverage?.benchmark} score={r.balance_sheet?.interest_coverage?.score} note={r.balance_sheet?.interest_coverage?.note} />
      </SectionCard>

      {/* Cash Flow */}
      <SectionCard title="Cash Flow Quality" score={r.cash_flow?.section_score} note={r.cash_flow?.section_note} accent={SECTION_ACCENTS.cash_flow}>
        <MetricRow label="Operating Cash Flow" value={r.cash_flow?.ocf_m?.value} valueType="m" benchmark={r.cash_flow?.ocf_m?.benchmark} score={r.cash_flow?.ocf_m?.score} note={r.cash_flow?.ocf_m?.note} />
        <MetricRow label="Free Cash Flow" value={r.cash_flow?.fcf_m?.value} valueType="m" benchmark={r.cash_flow?.fcf_m?.benchmark} score={r.cash_flow?.fcf_m?.score} note={r.cash_flow?.fcf_m?.note} />
        <MetricRow label="FCF Margin" value={r.cash_flow?.fcf_margin?.value} valueType="pct" benchmark={r.cash_flow?.fcf_margin?.benchmark} score={r.cash_flow?.fcf_margin?.score} note={r.cash_flow?.fcf_margin?.note} />
        <MetricRow label="FCF Conversion (FCF / Net Income)" value={r.cash_flow?.fcf_conversion?.value} valueType="x" benchmark={r.cash_flow?.fcf_conversion?.benchmark} score={r.cash_flow?.fcf_conversion?.score} note={r.cash_flow?.fcf_conversion?.note} />
        <MetricRow label="Capex Intensity" value={r.cash_flow?.capex_intensity?.value} valueType="pct" benchmark={r.cash_flow?.capex_intensity?.benchmark} score={r.cash_flow?.capex_intensity?.score} note={r.cash_flow?.capex_intensity?.note} />
      </SectionCard>

      {/* Working Capital / CCC */}
      <WorkingCapital wc={r.working_capital} />

      {/* Valuation */}
      <SectionCard title="Valuation" score={r.valuation?.section_score} note={r.valuation?.section_note} accent={SECTION_ACCENTS.valuation}>
        <MetricRow label="P/E Ratio" value={r.valuation?.pe?.value} valueType="x" benchmark={r.valuation?.pe?.benchmark} score={r.valuation?.pe?.score} note={r.valuation?.pe?.note} />
        <MetricRow label="EV / EBITDA" value={r.valuation?.ev_to_ebitda?.value} valueType="x" benchmark={r.valuation?.ev_to_ebitda?.benchmark} score={r.valuation?.ev_to_ebitda?.score} note={r.valuation?.ev_to_ebitda?.note} />
        <MetricRow label="Price / Free Cash Flow" value={r.valuation?.p_to_fcf?.value} valueType="x" benchmark={r.valuation?.p_to_fcf?.benchmark} score={r.valuation?.p_to_fcf?.score} note={r.valuation?.p_to_fcf?.note} />
        <MetricRow label="Price / Book" value={r.valuation?.price_to_book?.value} valueType="x" benchmark={r.valuation?.price_to_book?.benchmark} score={r.valuation?.price_to_book?.score} note={r.valuation?.price_to_book?.note} />
        <MetricRow label="PEG Ratio" value={r.valuation?.peg?.value} valueType="x" benchmark={r.valuation?.peg?.benchmark} score={r.valuation?.peg?.score} note={r.valuation?.peg?.note} />
      </SectionCard>

      {/* Growth */}
      <SectionCard title="Growth Trajectory" score={r.growth?.section_score} note={r.growth?.section_note} accent={SECTION_ACCENTS.growth}>
        <MetricRow label="Revenue Growth (1yr)" value={r.growth?.revenue_1yr?.value} valueType="pct" score={r.growth?.revenue_1yr?.score} note={r.growth?.revenue_1yr?.note} />
        <MetricRow label="Revenue CAGR (3yr)" value={r.growth?.revenue_3yr_cagr?.value} valueType="pct" score={r.growth?.revenue_3yr_cagr?.score} note={r.growth?.revenue_3yr_cagr?.note} />
        <MetricRow label="EPS Growth (1yr)" value={r.growth?.eps_1yr?.value} valueType="pct" score={r.growth?.eps_1yr?.score} note={r.growth?.eps_1yr?.note} />
        <MetricRow label="EPS CAGR (3yr)" value={r.growth?.eps_3yr_cagr?.value} valueType="pct" score={r.growth?.eps_3yr_cagr?.score} note={r.growth?.eps_3yr_cagr?.note} />
        <MetricRow label="FCF Growth (1yr)" value={r.growth?.fcf_growth_1yr?.value} valueType="pct" score={r.growth?.fcf_growth_1yr?.score} note={r.growth?.fcf_growth_1yr?.note} />
        <MetricRow label="Share Count Change (YoY)" value={r.growth?.share_count_change?.value} valueType="pct" score={r.growth?.share_count_change?.score} note={r.growth?.share_count_change?.note} />
      </SectionCard>

      {/* Risk */}
      <RiskPanel risk={r.risk} />

      {/* Data gaps */}
      {r.overall?.data_gaps?.length > 0 && (
        <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 8, padding: '14px 16px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: '#374151', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Metrics Not Calculated
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {r.overall.data_gaps.map(g => (
              <span key={g} style={{ fontSize: 11, padding: '2px 10px', background: '#111827', borderRadius: 4, color: '#6b7280' }}>{g}</span>
            ))}
          </div>
        </div>
      )}

      {/* Raw data toggle */}
      {rawData && (
        <details style={{ marginBottom: 20 }}>
          <summary style={{ fontSize: 12, color: '#374151', cursor: 'pointer', padding: '8px 0' }}>
            View raw extracted data →
          </summary>
          <pre style={{ fontSize: 11, color: '#4b5563', background: '#0d1117', padding: 14, borderRadius: 8, overflow: 'auto', lineHeight: 1.4, marginTop: 8, fontFamily: 'monospace' }}>
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
