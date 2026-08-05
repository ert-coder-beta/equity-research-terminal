ERT CORE 4.0 — VALUATION DECISION ENGINE

Key architecture change:
- Primary fair value = 10-Year Explicit DCF.
- FY2026–FY2030: detailed forecast.
- FY2031–FY2035: explicit normalisation period.
- Terminal Value begins after FY2035.
- Bear/Base/Bull each run their own 10Y DCF.
- Custom remains fully interactive; FY31–35 can be auto-normalised or manually edited.
- Cross-checks (Normalised FCF DCF, Forward Earnings, EV/FCF) challenge the primary DCF and are NOT weighted into it.
- Overview shows ERT Primary Fair Value, Bear–Bull range and confidence.
- Legacy 5Y DCF remains only as a reference/audit.

Deploy:
1. GitHub: replace index.html.
2. Cloudflare Worker: worker/src/index.js is included and unchanged from the prior compatible worker.

Read before deploy:
- MASTER_CHECKLIST_COMPLETED.md
- REGRESSION_REPORT.txt
- TEST_SUMMARY.json
