# Equity Intelligence Dashboard

A fully automated fundamental analysis dashboard. Enter a ticker or upload a 10-K/10-Q PDF — the app pulls live data from SEC EDGAR and multiple market APIs, runs every metric through Claude AI, and delivers a scored, dashboard-style investment analysis.

## What It Analyzes

**Profitability** — Gross Margin, Operating Margin, Net Margin, EBITDA Margin, ROE, ROIC

**Balance Sheet** — Current Ratio, Quick Ratio, Debt/Equity, Net Debt, Net Debt/EBITDA, Interest Coverage

**Cash Flow Quality** — OCF, FCF, FCF Margin, FCF Conversion, Capex Intensity

**Working Capital (CCC)** — Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), Days Payable Outstanding (DPO), Cash Conversion Cycle

**Valuation** — P/E, EV/EBITDA, P/FCF, P/B, PEG Ratio

**Growth** — Revenue growth (1yr, 3yr CAGR), EPS growth, FCF growth, share dilution

**Risk** — Beta, Goodwill %, revenue concentration, insider activity, debt maturity

**Investment Thesis** — Moat type, bull/bear cases, conviction score, target entry price

## Data Sources

- **SEC EDGAR** — official filings (10-K, 10-Q) via Claude web search
- **Alpha Vantage** — real-time price, market cap, beta (free API key)
- **Financial Modeling Prep** — supplemental financial ratios (free tier)
- **PDF Upload** — paste or upload any 10-K directly

## Setup

```bash
git clone https://github.com/ltourdot/StockAnalysis.git
cd StockAnalysis
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm start
```

### API Keys Required

| Key | Where to Get | Cost |
|-----|-------------|------|
| `REACT_APP_ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Pay per use |
| `REACT_APP_ALPHA_VANTAGE_KEY` | [alphavantage.co](https://www.alphavantage.co/support/#api-key) | Free (25 req/day) |
| `REACT_APP_FMP_KEY` | [financialmodelingprep.com](https://financialmodelingprep.com/developer/docs) | Free (250 req/day) |

Alpha Vantage and FMP are optional — the app falls back to Claude web search if they're absent.

## Architecture

```
src/
  lib/
    prompts.js        — Claude system prompts (extraction + analysis)
    apiClients.js     — Alpha Vantage + FMP API wrappers
    calculations.js   — CCC, ROIC, ratio calculations
  hooks/
    useAnalysis.js    — Main analysis orchestration hook
  components/
    Dashboard.jsx     — Top-level dashboard layout
    Header.jsx        — Company header + overall score + action pill
    ScoreGrid.jsx     — 6-section score summary grid
    ThesisCard.jsx    — Investment thesis, bull/bear, key risk
    MetricSection.jsx — Reusable scored metric section
    WorkingCapital.jsx — DSO / DIO / DPO / CCC visualization
    RiskPanel.jsx     — Risk signal flags
    RawData.jsx       — Expandable raw extracted data
    Setup.jsx         — Ticker input + file upload UI
    ProgressBar.jsx   — Multi-step loading indicator
  App.jsx             — Root component + tab routing
  index.js            — Entry point
```

## Usage

1. **Ticker mode** — type any symbol (AAPL, NKE, MSFT) and hit Analyze. The app fetches live SEC filings + market data, extracts financials, and runs the full analysis. Takes ~45 seconds.

2. **Upload mode** — download a 10-K or 10-Q PDF from [SEC EDGAR](https://www.sec.gov/cgi-bin/browse-edgar), drop it into the upload zone. Best for smaller companies or when you want a specific filing period.

## Notes

- SEC EDGAR does not support browser CORS, so SEC data is retrieved via Claude's web search tool (server-side). Alpha Vantage and FMP are called directly from the browser.
- Alpha Vantage free tier: 25 requests/day, 5/minute. The app batches calls to stay within limits.
- All analysis runs through `claude-sonnet-4-20250514`. Adjust `max_tokens` in `prompts.js` if you hit limits on very large filings.
