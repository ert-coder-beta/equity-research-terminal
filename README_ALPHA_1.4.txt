ERT Alpha 1.4 FORWARD RESEARCH

WHAT CHANGED
- Financial Statements:
  * Annual History = completed FY only (no TTM column).
  * Current Year = Q1/Q2/etc actuals + YTD total + Company Guidance + ERT FY estimate.
  * Historical Quarters kept as a separate view.
  * TTM is retained only for valuation ratios, not presented as a fiscal year.

- Forecast / DCF:
  * Forecast columns are labelled FY2026E–FY2030E, not Y1–Y5.
  * Base is transparent:
    - FY2026E Revenue growth = current YTD YoY actual.
    - Revenue growth normalises toward an explicit Y5 rule.
    - FY2026E OCF margin = current YTD OCF / Revenue.
    - FY2026E CapEx/Revenue = current YTD CapEx / Revenue.
    - OCF and CapEx ratios normalise toward their 5Y medians.
  * DCF uses the same FY2026E–FY2030E forecast engine.
  * Forecast table is width-constrained so all five years fit beside the Inspector.

- Analysis:
  * Revenue growth / EPS growth / FCF growth / Operating margin / CapEx show FY2025A and FY2026E.
  * Clickable trend view distinguishes Actual vs Forecast.

- Report:
  * Restored Company & Business Overview.
  * Restored Business / Revenue Mix qualitative analysis.
  * Restored Three-minute Summary, Strengths, Risks and Scorecard.
  * Charts supplement the written analysis; they do not replace it.
  * KPI cards have explicit dark text and are no longer white-on-white.
  * Charts have labelled axes and point values.

- Consensus:
  * Business Quant adapter added for live Revenue/EPS analyst estimates.
  * Street estimates are explicitly separate from company guidance.
  * No demo price target is used.
  * Business Quant does not provide a price-target field in this adapter.

BUSINESS QUANT SETUP
1. Get a Business Quant API key.
2. Cloudflare > Workers & Pages > ert-live-data > Settings > Variables and Secrets.
3. Add secret:
   BUSINESS_QUANT_API_KEY = your key
4. Deploy the Worker from worker/src/index.js.
5. Refresh Live Data in ERT.

Optional company guidance:
Only add sourced, dated company guidance. The Worker accepts an optional secret:
COMPANY_GUIDANCE_JSON
If absent, the app says "Not provided / not connected" instead of inventing guidance.

DEPLOYMENT
- GitHub: replace index.html.
- Cloudflare: replace worker/src/index.js and Deploy (required for Business Quant consensus support).
