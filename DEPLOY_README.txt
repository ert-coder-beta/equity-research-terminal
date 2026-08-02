ERT CORE.2.8 LIVE CONSENSUS VALIDATED

Deploy Cloudflare first:
- replace Worker with worker/src/index.js
- keep ALPHA_VANTAGE_API_KEY as a Cloudflare Secret
- deploy
- test /api/consensus?ticker=GOOG once

Then deploy index.html to GitHub Pages.

This version:
- parses Alpha Vantage's actual `estimates` array
- uses FY revenue/EPS average, low, high and analyst count
- preserves 7/30/60/90-day EPS estimate history where returned
- keeps /api/all separate from Alpha Vantage
- keeps 24h Worker/browser cache
- does not invent analyst share-price targets
- preserves Valuation, P/E detail, Financials, Inspector and Report baseline
