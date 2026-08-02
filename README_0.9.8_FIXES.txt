ERT Alpha 0.9.8 LIVE NORMALISED

Fixes in this build:
- Annual diluted-share series normalised to million shares (fixes historical EV multiple unit explosion).
- Historical P/E, PEG, EV/Sales, EV/EBIT and EV/FCF recompute from live SEC annual fundamentals + live market history.
- NaN / Infinity guards for YoY, CAGR, PEG and valuation metrics.
- Latest five complete SEC fiscal years are selected dynamically by the Worker when available.
- TTM remains separate from fiscal-year history.
- Base FCF forecast drivers re-anchor after Live Refresh to latest annual revenue growth, OCF margin and CapEx/revenue blended with recent history.
- Bear/Bull scenarios are generated around the live Base; Custom manual inputs are preserved.

DEPLOY BOTH FILES:
1) Cloudflare Worker: worker/src/index.js -> replace Worker code -> Deploy.
2) GitHub Pages: index.html -> replace repository index.html -> Commit + Push.
3) Open ERT, Ctrl+F5, then Refresh Live Data.
