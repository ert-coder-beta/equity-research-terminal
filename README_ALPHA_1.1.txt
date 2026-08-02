ERT Alpha 1.1 INTEGRATED RESEARCH

This build starts from the exact latest index.html supplied by the user.

Included:
- One shared live-data state across page changes; top status is restored after every render.
- Last successful live snapshot cached locally; reload immediately restores it and then auto-refreshes.
- Removed the large global "Latest live financial anchor" block.
- Overview now contains a smaller Latest Financial Snapshot below the market/valuation KPIs.
- Financial Statements now have:
  * Annual + TTM view
  * Quarterly view
  * Income Statement / Balance Sheet / Cash Flow tabs
  * Quarterly standalone values derived from SEC YTD facts where necessary
  * Q4 derived as FY minus 9M YTD
- DCF fair value is recalculated from validated latest TTM revenue/FCF, current shares/net cash and current forecast drivers.
- Current valuation ratios use live/validated data:
  * P/E
  * PEG
  * EV/Sales
  * EV/EBIT
  * EV/FCF
- Clicking valuation multiples opens an Inspector with formula, actual input numbers, period and source status.
- Added clickable five-year analysis for:
  * Revenue growth
  * EPS growth
  * FCF growth
  * Operating margin
  * CapEx
  Each opens a 5Y graph and underlying numbers in the Inspector.
- CapEx Inspector explicitly separates reported total from non-disclosed maintenance/growth/one-off classification.
- Market page suppresses all demo consensus values when live consensus is unavailable.
- Report redesigned with:
  * coloured executive KPI dashboard
  * strengths/risks panels
  * 5Y revenue/EPS chart
  * operating margin/FCF margin chart
  * OCF/CapEx/FCF chart
  * Bear/Base/Bull DCF chart
  * colour-coded investment scorecard
  * watch-next timeline
  * sources/methodology section
- Version: Alpha 1.1 INTEGRATED RESEARCH

Deployment:
1. GitHub: replace index.html.
2. Cloudflare Worker: replace worker/src/index.js and Deploy.
3. Open ERT. The saved API URL is retained in localStorage.
4. The app auto-loads cached data immediately and refreshes live data automatically.
