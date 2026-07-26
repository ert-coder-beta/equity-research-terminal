const ids = {
  price: document.getElementById("price"),
  fcf: document.getElementById("fcf"),
  netCash: document.getElementById("netCash"),
  shares: document.getElementById("shares"),
  growth: document.getElementById("growth"),
  wacc: document.getElementById("wacc"),
  terminalGrowth: document.getElementById("terminalGrowth"),
  valuationBasis: document.getElementById("valuationBasis")
};

function calculateDcf(growthOverride = null) {
  const fcf = Number(ids.valuationBasis.value);
  const netCash = Number(ids.netCash.value);
  const shares = Number(ids.shares.value);
  const growth = (growthOverride ?? Number(ids.growth.value)) / 100;
  const wacc = Number(ids.wacc.value) / 100;
  const terminalGrowth = Number(ids.terminalGrowth.value) / 100;

  let projectedFcf = fcf;
  let forecastPv = 0;

  for (let year = 1; year <= 5; year += 1) {
    projectedFcf *= 1 + growth;
    forecastPv += projectedFcf / Math.pow(1 + wacc, year);
  }

  const terminalValue =
    projectedFcf * (1 + terminalGrowth) / (wacc - terminalGrowth);
  const terminalPv = terminalValue / Math.pow(1 + wacc, 5);
  const equityValue = forecastPv + terminalPv + netCash;

  return {
    perShare: equityValue / shares,
    forecastPv,
    terminalPv,
    equityValue
  };
}

function solveReverseDcf() {
  const targetPrice = Number(ids.price.value);
  let low = -30;
  let high = 40;

  for (let i = 0; i < 100; i += 1) {
    const midpoint = (low + high) / 2;
    if (calculateDcf(midpoint).perShare < targetPrice) {
      low = midpoint;
    } else {
      high = midpoint;
    }
  }

  return (low + high) / 2;
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

function update() {
  const result = calculateDcf();
  const price = Number(ids.price.value);
  const growth = Number(ids.growth.value);
  const marginOfSafety = ((result.perShare - price) / result.perShare) * 100;
  const reverseGrowth = solveReverseDcf();
  const expectationGap = growth - reverseGrowth;

  const low = calculateDcf(growth - 2).perShare;
  const high = calculateDcf(growth + 2).perShare;

  document.getElementById("currentPrice").textContent = money(price);
  document.getElementById("intrinsicValue").textContent = money(result.perShare);
  document.getElementById("dcfResult").textContent = money(result.perShare);
  document.getElementById("marginSafety").textContent =
    `${marginOfSafety.toFixed(1)}%`;
  document.getElementById("valuationRange").textContent =
    `Indicative range: ${money(low)}–${money(high)}`;
  document.getElementById("reverseGrowth").textContent =
    `${reverseGrowth.toFixed(1)}%`;
  document.getElementById("baseCaseGrowth").textContent =
    `${growth.toFixed(1)}%`;
  document.getElementById("expectationGap").textContent =
    `${expectationGap >= 0 ? "+" : ""}${expectationGap.toFixed(1)}%`;

  document.getElementById("marginSafety").className =
    marginOfSafety >= 0 ? "positive" : "negative";
  document.getElementById("expectationGap").className =
    expectationGap >= 0 ? "positive" : "negative";

  document.getElementById("explanation").textContent =
`Base cash flow: $${Number(ids.valuationBasis.value).toFixed(1)}B
Five-year FCF growth: ${growth.toFixed(1)}%
WACC: ${Number(ids.wacc.value).toFixed(1)}%
Terminal growth: ${Number(ids.terminalGrowth.value).toFixed(1)}%

Present value of forecast FCF: $${result.forecastPv.toFixed(1)}B
Present value of terminal value: $${result.terminalPv.toFixed(1)}B
Net cash added: $${Number(ids.netCash.value).toFixed(1)}B
Equity value: $${result.equityValue.toFixed(1)}B
Shares outstanding: ${Number(ids.shares.value).toFixed(1)}B

Intrinsic value per share: ${money(result.perShare)}`;
}

Object.values(ids).forEach((element) => {
  element.addEventListener("input", update);
  element.addEventListener("change", update);
});

update();
