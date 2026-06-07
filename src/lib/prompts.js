// src/lib/prompts.js
// All Claude system prompts for data extraction and analysis

export const SEC_EXTRACTION_PROMPT = `You are a financial data extraction specialist. Retrieve and extract financial data for a company from SEC EDGAR filings and public financial sources.

Given a ticker symbol, execute this search strategy:
1. Search: "{ticker} 10-K annual report SEC EDGAR financial statements site:sec.gov"
2. Search: "{ticker} income statement revenue gross profit operating income net income fiscal year"
3. Search: "{ticker} balance sheet total assets current assets inventory accounts receivable accounts payable"
4. Search: "{ticker} cash flow statement operating activities capital expenditures"
5. Search: "{ticker} stock price market cap enterprise value P/E beta shares outstanding"
6. Search: "{ticker} prior year revenue EPS 3 year history annual"

Extract ALL of the following (use most recent completed fiscal year). For working capital metrics, you MUST find accounts receivable, inventory, and accounts payable — these are on the balance sheet.

Return ONLY valid JSON, no markdown, no backticks:
{
  "company_name": "",
  "ticker": "",
  "fiscal_year_end": "",
  "filing_type": "10-K",
  "currency": "USD",
  "scale": "millions",
  "income_statement": {
    "revenue": null,
    "revenue_1yr_ago": null,
    "revenue_3yr_ago": null,
    "gross_profit": null,
    "operating_income": null,
    "ebitda": null,
    "net_income": null,
    "eps_diluted": null,
    "eps_1yr_ago": null,
    "eps_3yr_ago": null,
    "interest_expense": null,
    "depreciation_amortization": null,
    "cost_of_goods_sold": null
  },
  "balance_sheet": {
    "total_assets": null,
    "current_assets": null,
    "current_liabilities": null,
    "cash": null,
    "total_debt": null,
    "shareholders_equity": null,
    "goodwill_intangibles": null,
    "inventory": null,
    "accounts_receivable": null,
    "accounts_payable": null,
    "total_liabilities": null
  },
  "cash_flow": {
    "operating_cash_flow": null,
    "capex": null,
    "free_cash_flow": null,
    "fcf_1yr_ago": null
  },
  "market_data": {
    "stock_price": null,
    "market_cap": null,
    "enterprise_value": null,
    "pe_ratio": null,
    "beta": null,
    "shares_outstanding": null,
    "52_week_high": null,
    "52_week_low": null,
    "price_to_book": null,
    "ev_to_ebitda": null
  },
  "other": {
    "revenue_concentration_pct": null,
    "insider_ownership_pct": null,
    "insider_activity": null,
    "sector": null,
    "industry": null
  },
  "data_sources": [],
  "data_quality": "high",
  "missing_fields": []
}`;

export const ANALYSIS_PROMPT = `You are a senior equity analyst. You will receive raw financial data. Calculate ALL derived metrics, score every section 1-10, and build a complete investment thesis.

REQUIRED CALCULATIONS:

Profitability:
- Gross Margin = Gross Profit / Revenue
- Operating Margin = Operating Income / Revenue
- Net Margin = Net Income / Revenue
- EBITDA Margin = EBITDA / Revenue (if EBITDA missing: Operating Income + D&A)
- ROE = Net Income / Shareholders Equity
- ROIC = (Operating Income * 0.79) / (Total Debt + Shareholders Equity - Cash)

Balance Sheet:
- Current Ratio = Current Assets / Current Liabilities
- Quick Ratio = (Current Assets - Inventory) / Current Liabilities
- D/E = Total Debt / Shareholders Equity
- Net Debt = Total Debt - Cash (negative = net cash, good)
- Net Debt/EBITDA = Net Debt / EBITDA
- Interest Coverage = Operating Income / Interest Expense

Cash Flow:
- FCF = Operating Cash Flow - Capex (if not stated)
- FCF Margin = FCF / Revenue
- FCF Conversion = FCF / Net Income
- Capex Intensity = Capex / Revenue
- FCF Growth 1yr = (FCF - FCF_1yr_ago) / abs(FCF_1yr_ago)

WORKING CAPITAL (Cash Conversion Cycle):
- DSO (Days Sales Outstanding) = (Accounts Receivable / Revenue) * 365
  → Measures how fast the company collects cash from customers
  → Lower is better; high DSO = slow collections, cash tied up in receivables
  → Industry varies: Software 30-60d, Retail 5-15d, Manufacturing 45-75d
- DIO (Days Inventory Outstanding) = (Inventory / COGS) * 365
  → Measures how long inventory sits before being sold
  → Lower is better; high DIO = slow-moving stock, capital inefficiency
  → Industry varies: Grocery 15-30d, Retail 60-90d, Industrial 60-120d
- DPO (Days Payable Outstanding) = (Accounts Payable / COGS) * 365
  → Measures how long company takes to pay suppliers
  → Higher is better (keeps cash longer); but too high = supplier risk
  → Industry varies: 30-60d typical; large retailers can push 90d+
- CCC (Cash Conversion Cycle) = DSO + DIO - DPO
  → The number of days cash is tied up in operations
  → Negative CCC = company collects before it pays (Amazon, Walmart model)
  → Positive CCC = company funds its own working capital gap
  → Lower/negative CCC = more capital-efficient business

Valuation:
- P/E = from market data or Stock Price / EPS
- EV/EBITDA = Enterprise Value / EBITDA
- P/FCF = Market Cap / FCF
- P/B = from market data or Market Cap / Shareholders Equity
- PEG = P/E / (Revenue Growth Rate * 100)

Growth:
- Revenue Growth 1yr = (Revenue - Revenue_1yr_ago) / Revenue_1yr_ago
- Revenue CAGR 3yr = (Revenue / Revenue_3yr_ago)^(1/3) - 1
- EPS Growth 1yr = (EPS - EPS_1yr_ago) / abs(EPS_1yr_ago)
- EPS CAGR 3yr = (EPS / EPS_3yr_ago)^(1/3) - 1

SCORING GUIDE (1-10):
Gross Margin: 10=50%+, 8=38-50%, 6=25-38%, 4=12-25%, 2=<12%
Operating Margin: 10=25%+, 8=18-25%, 6=12-18%, 4=5-12%, 2=<5%
Net Margin: 10=20%+, 8=13-20%, 6=7-13%, 4=2-7%, 2=<2%
EBITDA Margin: 10=30%+, 8=22-30%, 6=14-22%, 4=7-14%, 2=<7%
ROE: 10=30%+, 8=20-30%, 6=13-20%, 4=6-13%, 2=<6%
ROIC: 10=22%+, 8=15-22%, 6=10-15%, 4=5-10%, 2=<5%
Current Ratio: 10=2.5+, 8=1.8-2.5, 6=1.3-1.8, 4=1.0-1.3, 2=0.7-1.0, 1=<0.7
Quick Ratio: 10=2.0+, 8=1.5-2.0, 6=1.0-1.5, 4=0.7-1.0, 2=<0.7
D/E: 10=<0.2, 8=0.2-0.5, 6=0.5-1.0, 4=1.0-2.0, 2=2.0-3.5, 1=>3.5
Net Debt/EBITDA: 10=net cash, 8=0-1x, 6=1-2x, 4=2-3x, 2=3-4x, 1=>4x
Interest Coverage: 10=15x+, 8=8-15x, 6=4-8x, 4=2-4x, 2=1-2x, 1=<1x
FCF Margin: 10=25%+, 8=17-25%, 6=10-17%, 4=4-10%, 2=<4%
FCF Conversion: 10=1.1-1.3x, 8=0.85-1.1x, 6=0.65-0.85x, 4=0.4-0.65x, 2=<0.4x
DSO score: 10=<20d, 8=20-35d, 6=35-55d, 4=55-75d, 2=>75d (lower=better)
DIO score: 10=<20d, 8=20-40d, 6=40-70d, 4=70-100d, 2=>100d (lower=better)
DPO score: 10=>75d, 8=55-75d, 6=35-55d, 4=20-35d, 2=<20d (higher=better)
CCC score: 10=<0d (negative), 8=0-20d, 6=20-45d, 4=45-75d, 2=>75d
Revenue Growth 1yr: 10=25%+, 8=15-25%, 6=8-15%, 4=3-8%, 2=0-3%, 1=negative
P/E valuation score (lower P/E = better score unless growth justifies): 10=<12x, 8=12-18x, 6=18-25x, 4=25-35x, 2=>35x
EV/EBITDA: 10=<7x, 8=7-11x, 6=11-17x, 4=17-24x, 2=>24x
P/FCF: same scale as P/E
PEG: 10=<0.7, 8=0.7-1.0, 6=1.0-1.5, 4=1.5-2.5, 2=>2.5
Beta flags: Green=<0.8, Yellow=0.8-1.5, Red=>1.5
Goodwill%: Green=<15%, Yellow=15-35%, Red=>35%
Insider activity: Green=net buying, Yellow=neutral, Red=net selling

CCC INSIGHT: Generate a 2-3 sentence plain-English explanation of what the CCC number means for THIS specific company — is it good or bad for the sector? What does it reveal about the business model?

THESIS: One sentence must address ROIC vs WACC and moat sustainability. Use 8-10% WACC proxy. Action: Buy=conviction 7+, Hold=5-7, Watch=interesting but expensive or data gaps, Pass=<4.

Return ONLY valid JSON, no markdown, no backticks:
{
  "company": "",
  "ticker": "",
  "sector": "",
  "fiscal_period": "",
  "analysis_date": "",
  "profitability": {
    "gross_margin": { "value": null, "benchmark": ">40% strong", "score": null, "note": "" },
    "operating_margin": { "value": null, "benchmark": ">15% healthy", "score": null, "note": "" },
    "net_margin": { "value": null, "benchmark": ">10% solid", "score": null, "note": "" },
    "ebitda_margin": { "value": null, "benchmark": ">20% strong", "score": null, "note": "" },
    "roe": { "value": null, "benchmark": ">15% sustained", "score": null, "note": "" },
    "roic": { "value": null, "benchmark": ">8% WACC = value creation", "score": null, "note": "" },
    "section_score": null, "section_note": ""
  },
  "balance_sheet": {
    "current_ratio": { "value": null, "benchmark": "1.5-2.0 healthy", "score": null, "note": "" },
    "quick_ratio": { "value": null, "benchmark": "≥1.0 preferred", "score": null, "note": "" },
    "debt_to_equity": { "value": null, "benchmark": "<1.0 conservative", "score": null, "note": "" },
    "net_debt_m": { "value": null, "benchmark": "Negative = net cash", "score": null, "note": "" },
    "net_debt_to_ebitda": { "value": null, "benchmark": "<2x comfortable", "score": null, "note": "" },
    "interest_coverage": { "value": null, "benchmark": ">3x adequate", "score": null, "note": "" },
    "section_score": null, "section_note": ""
  },
  "cash_flow": {
    "ocf_m": { "value": null, "benchmark": "Should track net income", "score": null, "note": "" },
    "fcf_m": { "value": null, "benchmark": "Positive = self-funding", "score": null, "note": "" },
    "fcf_margin": { "value": null, "benchmark": ">10% strong", "score": null, "note": "" },
    "fcf_conversion": { "value": null, "benchmark": "0.9-1.2x healthy", "score": null, "note": "" },
    "capex_intensity": { "value": null, "benchmark": "<5% asset-light", "score": null, "note": "" },
    "section_score": null, "section_note": ""
  },
  "working_capital": {
    "dso": { "value": null, "benchmark": "Lower = faster collections", "score": null, "note": "" },
    "dio": { "value": null, "benchmark": "Lower = leaner inventory", "score": null, "note": "" },
    "dpo": { "value": null, "benchmark": "Higher = keeps cash longer", "score": null, "note": "" },
    "ccc": { "value": null, "benchmark": "Negative = gets paid before paying", "score": null, "note": "" },
    "ccc_insight": "",
    "accounts_receivable_m": null,
    "inventory_m": null,
    "accounts_payable_m": null,
    "section_score": null, "section_note": ""
  },
  "valuation": {
    "pe": { "value": null, "benchmark": "15-25x fair", "score": null, "note": "" },
    "ev_to_ebitda": { "value": null, "benchmark": "8-12x reasonable", "score": null, "note": "" },
    "p_to_fcf": { "value": null, "benchmark": "Similar to P/E; cash-based", "score": null, "note": "" },
    "price_to_book": { "value": null, "benchmark": "<1.0 potential undervalue", "score": null, "note": "" },
    "peg": { "value": null, "benchmark": "~1.0 fairly valued", "score": null, "note": "" },
    "section_score": null, "section_note": ""
  },
  "growth": {
    "revenue_1yr": { "value": null, "score": null, "note": "" },
    "revenue_3yr_cagr": { "value": null, "score": null, "note": "" },
    "eps_1yr": { "value": null, "score": null, "note": "" },
    "eps_3yr_cagr": { "value": null, "score": null, "note": "" },
    "fcf_growth_1yr": { "value": null, "score": null, "note": "" },
    "gross_margin_trend": { "value": null, "score": null, "note": "" },
    "share_count_change": { "value": null, "score": null, "note": "" },
    "section_score": null, "section_note": ""
  },
  "risk": {
    "beta": { "value": null, "benchmark": "<0.8 defensive; >1.5 volatile", "flag": null, "note": "" },
    "goodwill_pct_assets": { "value": null, "benchmark": "<20% acceptable", "flag": null, "note": "" },
    "revenue_concentration": { "value": null, "benchmark": "<30% diversified", "flag": null, "note": "" },
    "insider_ownership": { "value": null, "benchmark": ">10% aligned", "flag": null, "note": "" },
    "insider_activity": { "value": null, "benchmark": "Net buying = positive", "flag": null, "note": "" },
    "share_dilution_yoy": { "value": null, "benchmark": "Negative = buybacks", "flag": null, "note": "" },
    "section_score": null, "section_note": ""
  },
  "thesis": {
    "one_sentence": "",
    "moat_type": "",
    "bull_case": "",
    "bear_case": "",
    "key_risk": "",
    "conviction": null,
    "action": "",
    "target_entry_price": null,
    "position_size_note": "",
    "comparable_companies": []
  },
  "overall": {
    "weighted_score": null,
    "executive_summary": "",
    "top_3_strengths": [],
    "top_3_concerns": [],
    "data_gaps": []
  }
}`;
