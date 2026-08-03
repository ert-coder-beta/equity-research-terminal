ERT CORE 3.0 — SCENARIO TRACE

- Financial Statements: USD million throughout, except EPS (USD/share).
- Business Quant revenue is converted from USD to USD million.
- Explicit FY2021–FY2025 headers.
- FCF engine: FY2025A (Y0 SEC actual) + FY2026E–FY2030E.
- Adds Revenue, Street Revenue, ERT vs Street, Revenue growth, OCF margin, CapEx intensity, FCF margin and FCF.
- Base keeps SEC latest + recent-history blend.
- Bear/Bull are data-derived:
  Revenue Y1 = midpoint between ERT Base Y1 and Business Quant Low/High implied growth.
  Scenario revenue spread fades to 25% by Y5.
  OCF/CapEx spreads = 50% of 5Y historical standard deviation, capped at 0.5–3.0ppt.
- Bear/Base/Bull/Custom open Inspector trace with FACT / ASSUMPTION / CALCULATED.
- Custom remains editable.
- No-refresh navigation hotfix preserved.

Deploy: replace GitHub index.html only. Existing Business Quant Worker can stay unchanged.
