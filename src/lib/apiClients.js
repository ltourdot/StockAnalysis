// src/lib/apiClients.js
// External market data API wrappers — Alpha Vantage + Financial Modeling Prep

const AV_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
const FMP_KEY = process.env.REACT_APP_FMP_KEY;

const AV_BASE = 'https://www.alphavantage.co/query';
const FMP_BASE = 'https://financialmodelingprep.com/api/v3';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

// ── Alpha Vantage ────────────────────────────────────────────────────────────

export async function fetchQuote(ticker) {
  if (!AV_KEY || AV_KEY === 'your_alpha_vantage_key_here') return null;
  try {
    const data = await fetchJSON(`${AV_BASE}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${AV_KEY}`);
    const q = data['Global Quote'];
    if (!q || !q['05. price']) return null;
    return {
      price: parseFloat(q['05. price']),
      change: parseFloat(q['09. change']),
      changePct: parseFloat(q['10. change percent']),
      high52: parseFloat(q['03. high']),
      low52: parseFloat(q['04. low']),
      volume: parseInt(q['06. volume']),
    };
  } catch {
    return null;
  }
}

export async function fetchCompanyOverview(ticker) {
  if (!AV_KEY || AV_KEY === 'your_alpha_vantage_key_here') return null;
  try {
    const data = await fetchJSON(`${AV_BASE}?function=OVERVIEW&symbol=${ticker}&apikey=${AV_KEY}`);
    if (!data.Symbol) return null;
    return {
      name: data.Name,
      sector: data.Sector,
      industry: data.Industry,
      description: data.Description,
      marketCap: parseFloat(data.MarketCapitalization) / 1e6,
      pe: parseFloat(data.PERatio),
      peg: parseFloat(data.PEGRatio),
      pb: parseFloat(data.PriceToBookRatio),
      eps: parseFloat(data.EPS),
      beta: parseFloat(data.Beta),
      sharesOutstanding: parseFloat(data.SharesOutstanding) / 1e6,
      dividendYield: parseFloat(data.DividendYield),
      profitMargin: parseFloat(data.ProfitMargin),
      operatingMargin: parseFloat(data.OperatingMarginTTM),
      roe: parseFloat(data.ReturnOnEquityTTM),
      revenueTTM: parseFloat(data.RevenueTTM) / 1e6,
      grossProfitTTM: parseFloat(data.GrossProfitTTM) / 1e6,
      ebitda: parseFloat(data.EBITDA) / 1e6,
      revenueGrowthYOY: parseFloat(data.QuarterlyRevenueGrowthYOY),
      earningsGrowthYOY: parseFloat(data.QuarterlyEarningsGrowthYOY),
      analystTarget: parseFloat(data.AnalystTargetPrice),
      week52High: parseFloat(data.Week52High),
      week52Low: parseFloat(data.Week52Low),
    };
  } catch {
    return null;
  }
}

// ── Financial Modeling Prep ──────────────────────────────────────────────────

export async function fetchFMPFinancials(ticker) {
  if (!FMP_KEY || FMP_KEY === 'your_fmp_key_here') return null;
  try {
    const [income, balance, cashflow, ratios, keyMetrics] = await Promise.allSettled([
      fetchJSON(`${FMP_BASE}/income-statement/${ticker}?limit=4&apikey=${FMP_KEY}`),
      fetchJSON(`${FMP_BASE}/balance-sheet-statement/${ticker}?limit=4&apikey=${FMP_KEY}`),
      fetchJSON(`${FMP_BASE}/cash-flow-statement/${ticker}?limit=4&apikey=${FMP_KEY}`),
      fetchJSON(`${FMP_BASE}/ratios/${ticker}?limit=1&apikey=${FMP_KEY}`),
      fetchJSON(`${FMP_BASE}/key-metrics/${ticker}?limit=1&apikey=${FMP_KEY}`),
    ]);

    const inc = income.value?.[0];
    const bal = balance.value?.[0];
    const cf = cashflow.value?.[0];
    const rat = ratios.value?.[0];
    const km = keyMetrics.value?.[0];
    const inc1 = income.value?.[1]; // prior year
    const inc3 = income.value?.[3]; // 3yr ago

    if (!inc) return null;

    return {
      // Income Statement
      revenue: inc.revenue / 1e6,
      revenue1YrAgo: inc1?.revenue / 1e6 || null,
      revenue3YrAgo: inc3?.revenue / 1e6 || null,
      grossProfit: inc.grossProfit / 1e6,
      operatingIncome: inc.operatingIncome / 1e6,
      ebitda: inc.ebitda / 1e6,
      netIncome: inc.netIncome / 1e6,
      epsDiluted: inc.epsdiluted,
      eps1YrAgo: inc1?.epsdiluted || null,
      eps3YrAgo: inc3?.epsdiluted || null,
      interestExpense: inc.interestExpense / 1e6,
      cogs: inc.costOfRevenue / 1e6,
      da: inc.depreciationAndAmortization / 1e6,

      // Balance Sheet
      totalAssets: bal?.totalAssets / 1e6,
      currentAssets: bal?.totalCurrentAssets / 1e6,
      currentLiabilities: bal?.totalCurrentLiabilities / 1e6,
      cash: bal?.cashAndCashEquivalents / 1e6,
      totalDebt: bal?.totalDebt / 1e6,
      shareholdersEquity: bal?.totalStockholdersEquity / 1e6,
      goodwill: (bal?.goodwill + bal?.intangibleAssets) / 1e6,
      inventory: bal?.inventory / 1e6,
      accountsReceivable: bal?.netReceivables / 1e6,
      accountsPayable: bal?.accountPayables / 1e6,

      // Cash Flow
      operatingCashFlow: cf?.operatingCashFlow / 1e6,
      capex: Math.abs(cf?.capitalExpenditure / 1e6),
      freeCashFlow: cf?.freeCashFlow / 1e6,
      fcf1YrAgo: cashflow.value?.[1]?.freeCashFlow / 1e6 || null,

      // Ratios
      peRatio: rat?.priceEarningsRatio,
      pbRatio: rat?.priceToBookRatio,
      evToEbitda: km?.enterpriseValueOverEBITDA,
      roe: rat?.returnOnEquity,
      roic: rat?.returnOnInvestedCapital,
      currentRatio: rat?.currentRatio,
      quickRatio: rat?.quickRatio,
      debtToEquity: rat?.debtEquityRatio,
      interestCoverage: rat?.interestCoverage,
      grossMargin: rat?.grossProfitMargin,
      operatingMargin: rat?.operatingProfitMargin,
      netMargin: rat?.netProfitMargin,
      dso: rat?.daysSalesOutstanding,
      dpo: rat?.daysPayablesOutstanding,
      dio: rat?.daysOfInventoryOnHand,
      ccc: km?.cashConversionCycle,
    };
  } catch (e) {
    console.warn('FMP fetch failed:', e.message);
    return null;
  }
}

// ── Merge all available market data ─────────────────────────────────────────

export async function fetchAllMarketData(ticker) {
  const [quote, overview, fmp] = await Promise.allSettled([
    fetchQuote(ticker),
    fetchCompanyOverview(ticker),
    fetchFMPFinancials(ticker),
  ]);

  return {
    quote: quote.value || null,
    overview: overview.value || null,
    fmp: fmp.value || null,
    sources: [
      quote.value ? 'Alpha Vantage (real-time)' : null,
      overview.value ? 'Alpha Vantage (overview)' : null,
      fmp.value ? 'Financial Modeling Prep' : null,
    ].filter(Boolean),
  };
}
