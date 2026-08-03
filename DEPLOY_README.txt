ERT CORE.2.9 — BUSINESS QUANT LIVE CONSENSUS

DEPLOY ORDER
1. Cloudflare Worker:
   - Keep BUSINESS_QUANT_API_KEY as a Secret.
   - Replace Worker code with worker/src/index.js.
   - Deploy.
   - Test /api/consensus?ticker=GOOG once.
2. GitHub Pages:
   - Replace the existing index.html with this package's index.html.

WHAT CHANGED
- Business Quant is the primary analyst-consensus provider.
- 24h Worker cache + 24h browser cache.
- FY2026 Revenue/EPS consensus, Low and High.
- Q3/Q4 2026 Revenue/EPS Street estimates.
- Financial Statements keeps 2026 current-year actuals and forward context in ONE table.
- Business Quant reported:null is preserved as null; it is not converted to zero.
- No analyst count is invented because the tested Business Quant response does not provide one.
- No analyst share-price target is invented.
- P/E Inspector shows trailing P/E plus Business Quant FY2026 forward P/E separately.
- FCF / CapEx consensus is not invented; ERT continues to model FCF from forecast drivers.
- Existing Valuation / Report charts / Evidence Inspector baseline is preserved.
