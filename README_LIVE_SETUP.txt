ERT Alpha 0.9.5.2 LIVE FINANCIALS

Fix:
- Financials page now has a dedicated LIVE SEC TTM table above the old historical FY2020–FY2024 table.
- Live rows include Revenue, Cost of revenue, R&D, Sales & Marketing, G&A, Operating income, Pretax income, Tax, Net income, Diluted EPS where SEC XBRL tags are available.
- Cash flow live panel includes OCF, CapEx, FCF and Net Cash.
- Old 2020–2024 table remains clearly historical context instead of pretending to be the latest financial statement.

Cloudflare Worker must be updated to this package's worker/src/index.js because richer live financial fields are returned by the backend.
