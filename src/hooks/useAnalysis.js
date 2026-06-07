// src/hooks/useAnalysis.js
import { useState, useCallback } from 'react';
import { SEC_EXTRACTION_PROMPT, ANALYSIS_PROMPT } from '../lib/prompts';
import { fetchAllMarketData } from '../lib/apiClients';

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-4-20250514';

function parseClaudeJSON(data) {
  const text = (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
    .trim();
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean);
}

async function callClaude({ system, userContent, tools, maxTokens = 4000 }) {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: userContent }],
  };
  if (tools) body.tools = tools;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  return res.json();
}

// Merge FMP / AV data into the Claude-extracted JSON
function mergeMarketData(extracted, marketData) {
  const { quote, overview, fmp } = marketData;
  if (!extracted) return extracted;
  const merged = { ...extracted };

  if (fmp) {
    // FMP is the most comprehensive — use it to fill gaps
    const is = merged.income_statement || {};
    const bs = merged.balance_sheet || {};
    const cf = merged.cash_flow || {};
    const md = merged.market_data || {};

    merged.income_statement = {
      revenue: is.revenue ?? fmp.revenue,
      revenue_1yr_ago: is.revenue_1yr_ago ?? fmp.revenue1YrAgo,
      revenue_3yr_ago: is.revenue_3yr_ago ?? fmp.revenue3YrAgo,
      gross_profit: is.gross_profit ?? fmp.grossProfit,
      operating_income: is.operating_income ?? fmp.operatingIncome,
      ebitda: is.ebitda ?? fmp.ebitda,
      net_income: is.net_income ?? fmp.netIncome,
      eps_diluted: is.eps_diluted ?? fmp.epsDiluted,
      eps_1yr_ago: is.eps_1yr_ago ?? fmp.eps1YrAgo,
      eps_3yr_ago: is.eps_3yr_ago ?? fmp.eps3YrAgo,
      interest_expense: is.interest_expense ?? fmp.interestExpense,
      depreciation_amortization: is.depreciation_amortization ?? fmp.da,
      cost_of_goods_sold: is.cost_of_goods_sold ?? fmp.cogs,
    };
    merged.balance_sheet = {
      total_assets: bs.total_assets ?? fmp.totalAssets,
      current_assets: bs.current_assets ?? fmp.currentAssets,
      current_liabilities: bs.current_liabilities ?? fmp.currentLiabilities,
      cash: bs.cash ?? fmp.cash,
      total_debt: bs.total_debt ?? fmp.totalDebt,
      shareholders_equity: bs.shareholders_equity ?? fmp.shareholdersEquity,
      goodwill_intangibles: bs.goodwill_intangibles ?? fmp.goodwill,
      inventory: bs.inventory ?? fmp.inventory,
      accounts_receivable: bs.accounts_receivable ?? fmp.accountsReceivable,
      accounts_payable: bs.accounts_payable ?? fmp.accountsPayable,
    };
    merged.cash_flow = {
      operating_cash_flow: cf.operating_cash_flow ?? fmp.operatingCashFlow,
      capex: cf.capex ?? fmp.capex,
      free_cash_flow: cf.free_cash_flow ?? fmp.freeCashFlow,
      fcf_1yr_ago: cf.fcf_1yr_ago ?? fmp.fcf1YrAgo,
    };
    merged.market_data = {
      stock_price: md.stock_price ?? quote?.price,
      market_cap: md.market_cap ?? overview?.marketCap,
      enterprise_value: md.enterprise_value,
      pe_ratio: md.pe_ratio ?? fmp.peRatio ?? overview?.pe,
      beta: md.beta ?? overview?.beta,
      shares_outstanding: md.shares_outstanding ?? overview?.sharesOutstanding,
      '52_week_high': md['52_week_high'] ?? quote?.high52 ?? overview?.week52High,
      '52_week_low': md['52_week_low'] ?? quote?.low52 ?? overview?.week52Low,
      price_to_book: md.price_to_book ?? fmp.pbRatio ?? overview?.pb,
      ev_to_ebitda: md.ev_to_ebitda ?? fmp.evToEbitda,
    };
    if (!merged.other) merged.other = {};
    merged.other.sector = merged.other.sector ?? overview?.sector ?? fmp.sector;
    merged.other.industry = merged.other.industry ?? overview?.industry;
    merged.data_sources = [
      ...(merged.data_sources || []),
      ...marketData.sources,
    ];
  } else if (quote || overview) {
    if (!merged.market_data) merged.market_data = {};
    if (quote?.price) merged.market_data.stock_price = merged.market_data.stock_price ?? quote.price;
    if (overview?.marketCap) merged.market_data.market_cap = merged.market_data.market_cap ?? overview.marketCap;
    if (overview?.beta) merged.market_data.beta = merged.market_data.beta ?? overview.beta;
    if (overview?.pe) merged.market_data.pe_ratio = merged.market_data.pe_ratio ?? overview.pe;
  }

  return merged;
}

export function useAnalysis() {
  const [status, setStatus] = useState({ step: 0, message: '' });
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const setStep = (step, message) => setStatus({ step, message });

  const analyze = useCallback(async ({ ticker, file }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRawData(null);

    try {
      let extracted;

      if (file) {
        // ── PDF Upload Path ──────────────────────────────────────────────
        setStep(1, 'Reading filing document...');
        const base64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result.split(',')[1]);
          r.onerror = () => rej(new Error('File read failed'));
          r.readAsDataURL(file);
        });

        setStep(2, 'Extracting financial data from document...');
        const extractData = await callClaude({
          system: SEC_EXTRACTION_PROMPT.replace(/{ticker}/g, file.name.split('.')[0].toUpperCase()),
          userContent: [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
            { type: 'text', text: 'Extract all financial data from this SEC filing. Pull every figure from the income statement, balance sheet, and cash flow statement. Pay special attention to accounts receivable, inventory, and accounts payable for working capital calculations. Return the complete JSON.' },
          ],
          maxTokens: 3000,
        });
        extracted = parseClaudeJSON(extractData);

      } else {
        // ── Ticker Path ──────────────────────────────────────────────────
        setStep(1, `Querying SEC EDGAR for ${ticker.toUpperCase()}...`);

        // Run SEC extraction (via web search) and market API calls in parallel
        const [extractData, marketData] = await Promise.allSettled([
          callClaude({
            system: SEC_EXTRACTION_PROMPT.replace(/{ticker}/g, ticker.toUpperCase()),
            userContent: `Retrieve all financial data for ticker: ${ticker.toUpperCase()}. Search SEC EDGAR for the most recent 10-K. Collect income statement, balance sheet (especially accounts receivable, inventory, accounts payable), cash flow statement, and market data. Return complete JSON.`,
            tools: [{ type: 'web_search_20250305', name: 'web_search' }],
            maxTokens: 3000,
          }),
          fetchAllMarketData(ticker.toUpperCase()),
        ]);

        if (extractData.status === 'rejected') throw extractData.reason;
        extracted = parseClaudeJSON(extractData.value);

        setStep(2, 'Merging market data and SEC filings...');
        if (marketData.value) {
          extracted = mergeMarketData(extracted, marketData.value);
          if (marketData.value.sources.length) {
            extracted.data_sources = extracted.data_sources || [];
          }
        }
      }

      setRawData(extracted);
      setStep(3, 'Running fundamental analysis and building thesis...');

      const analysisData = await callClaude({
        system: ANALYSIS_PROMPT,
        userContent: `Analyze this financial data. Calculate all metrics including DSO, DIO, DPO, and CCC. Score every section. Build the complete investment thesis.\n\n${JSON.stringify(extracted, null, 2)}`,
        maxTokens: 5000,
      });

      const analysis = parseClaudeJSON(analysisData);
      setResult(analysis);
      setStep(4, 'Analysis complete.');

    } catch (e) {
      setError(e.message || 'Analysis failed. Check your API key and try again.');
      setStep(0, '');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus({ step: 0, message: '' });
    setLoading(false);
    setRawData(null);
    setResult(null);
    setError(null);
  }, []);

  return { status, loading, rawData, result, error, analyze, reset };
}
