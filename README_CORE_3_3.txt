ERT CORE 3.3 — UI AUDIT + AUTO EARNINGS FLOW

Deploy both files:
1. Cloudflare Worker: worker/src/index.js
2. GitHub Pages: index.html

Included:
- Overview/Market five-marker bar: 52W Low, after-SBC FV, before-SBC FV, Current Price, 52W High.
- Price/value cards show signed $ and % comparisons; old Upside/Downside card removed.
- Analysis/event text overflow fixes.
- Custom scenario SBC / Revenue is editable FY2026E–FY2030E.
- Whole-app stable input handling for WACC, terminal growth, legacy forecast fields and Forecast Engine: no render per keystroke; Enter/change commits; Escape reverts; scroll restored.
- New /api/earnings-flow endpoint and auto-updating Overview earnings-flow diagram.
- SEC quarterly Income Statement facts expanded; Business Quant product-revenue segments used only when reconciled.
- 24h Worker/browser earnings-flow cache; Live Refresh refreshes the flow.
- Business Quant forecast null values remain null, not zero.
