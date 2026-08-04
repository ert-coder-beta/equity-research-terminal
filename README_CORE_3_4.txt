ERT CORE 3.4 — FULL REGRESSION + CAPEX RETURN ANALYSIS

DEPLOY
1. Cloudflare: worker/src/index.js
2. GitHub Pages: index.html

Verified management facts used by the new CapEx module
- Alphabet FY2026 CapEx guidance: $175–185bn; Base midpoint $180bn.
- FY2025 actual CapEx: sourced from SEC live annual data in ERT.
- Google Cloud backlog: $240bn at Q4 2025.
- Alphabet said Cloud remained in a tight supply environment and just over half of FY2026 ML compute was expected to go to Cloud.
- This build does NOT claim a verified exact FY2027 CapEx guidance number or a post-2026 normalisation timetable.

New Valuation module
FCF Forecast Engine
→ AI / CapEx Investment Return Analysis
→ SBC valuation bridge
→ Why is Fair Value different from Market Price?

The CapEx module includes:
- FY2026 guided CapEx
- Incremental CapEx vs FY2025 actual
- Cloud backlog
- CapEx / ERT FY2026 revenue
- Bear / Base / Bull table
- Market-implied annual incremental FCF
- Implied return on incremental CapEx
- Simple payback period
- 5% / 10% / 15% / 20% / 25% CapEx-return sensitivity
- FACT / ASSUMPTION / CALCULATED / MARKET-IMPLIED Inspector evidence
- Known vs Unknown evidence section

Interaction fix
- Inspector/data-cell clicks update ONLY the Inspector. Main page is not rebuilt.
- All same-page renders preserve the actual .content scrollTop/scrollLeft.
- Existing input stable typing remains.
- This is a whole-ERT interaction fix, not only a WACC/Forecast input patch.

Regression report is included in REGRESSION_REPORT.txt.
