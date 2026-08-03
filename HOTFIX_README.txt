ERT CORE 2.9.1 — NO-REFRESH NAVIGATION HOTFIX

Problem fixed:
Changing Overview / Financials / Analysis / Valuation / Market / Research / Report recreated the live status bar.
The new bar showed default/unavailable labels until Refresh Live Data was pressed again.

New behaviour:
- Initial page load fetches live data normally.
- Initial Business Quant consensus loads normally.
- After that, changing pages performs ZERO API requests.
- Price / SEC / US 10Y / Business Quant consensus are restored from in-memory state after every render.
- Manual Refresh Live Data is only needed when you actually want newer data.
- /api/all's intentionally isolated consensus placeholder can no longer overwrite a valid Business Quant consensus badge.

Deploy:
Only replace GitHub Pages index.html for this hotfix.
The CORE 2.9 Business Quant Worker does not need to be changed if /api/consensus is already returning available:true.
