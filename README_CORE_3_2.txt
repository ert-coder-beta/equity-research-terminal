ERT CORE 3.2 — SBC · 52W · INPUT FIX

Deploy BOTH:
1) Cloudflare Worker: replace with worker/src/index.js and Deploy.
2) GitHub Pages: replace index.html.

Changes
- Worker now returns daily OHLC and rolling 52-week intraday high/low with dates.
- Worker now retrieves SEC annual/TTM stock-based compensation (SBC).
- Financial live sync updates the SBC annual row from SEC.
- Overview shows 52W High, 52W Low, range position and range bar.
- Market page shows 52W High/Low/position and plots 52W High/Low horizontal lines on the price chart.
- 52W Inspector explains high/low dates, distance from high/low and method.
- Valuation shows Fair Value before SBC and after SBC.
- After-SBC DCF = OCF − CapEx − SBC; it does not apply an additional full SBC dilution deduction.
- SBC forecast is based on historical SBC / Revenue; Bear/Bull use data-derived historical dispersion.
- Forecast Engine adds SBC, SBC/Revenue and SBC-adjusted FCF rows.
- Input bug fixed: typing does NOT rerender after every keystroke. Commit happens on blur/change/Enter; Escape reverts.
- Scroll position is restored after an input commit.
- FY2026 CapEx scenario anchors:
    Bear = $205bn (guidance high)
    Base = $200bn (guidance midpoint)
    Bull = $195bn (guidance low)
  FY2027 is NOT marked aligned unless ERT CapEx is above the FY2026 guidance high; exact FY2027 guidance is still unknown.
