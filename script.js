let currentTicker = "GOOG";
let activeStatement = "incomeStatement";

const $ = id => document.getElementById(id);
const fmtMoney = v => `$${Number(v).toFixed(2)}`;
const fmtB = v => `$${Number(v).toFixed(1)}B`;
const pct = v => `${Number(v).toFixed(1)}%`;
const latest = arr => arr[arr.length - 1];
const previous = arr => arr[arr.length - 2];
const yoy = arr => (latest(arr) / previous(arr) - 1) * 100;
const cagr = arr => (Math.pow(latest(arr) / arr[0], 1 / (arr.length - 1)) - 1) * 100;
const margin = (num, den) => num / den * 100;
const cssClass = v => v > 0 ? "positive" : v < 0 ? "negative" : "neutral";

function currentData(){ return COMPANY_DATA[currentTicker]; }

function selectedFcf(d){
  const basis = $("basisInput")?.value || "reported";
  const reported = latest(d.fcf);
  const sbcAdjusted = reported - latest(d.sbc);
  const maintenance = latest(d.capex) * d.maintenanceCapexPct / 100;
  const owner = latest(d.ocf) - maintenance - latest(d.sbc);
  return basis === "sbcAdjusted" ? sbcAdjusted : basis === "ownerEarnings" ? owner : reported;
}

function dcfFor(growthOverride=null,waccOverride=null,terminalOverride=null){
  const d=currentData();
  const base=selectedFcf(d);
  const growth=(growthOverride ?? Number($("growthInput").value))/100;
  const wacc=(waccOverride ?? Number($("waccInput").value))/100;
  const terminal=(terminalOverride ?? Number($("terminalInput").value))/100;
  const shares=Number($("sharesInput").value);
  const netCash=Number($("netCashInput").value);
  let fcf=base,pv=0;
  for(let y=1;y<=5;y++){fcf*=1+growth;pv+=fcf/Math.pow(1+wacc,y);}
  const tv=fcf*(1+terminal)/(wacc-terminal);
  const pvTv=tv/Math.pow(1+wacc,5);
  return {perShare:(pv+pvTv+netCash)/shares,pv,pvTv,equity:pv+pvTv+netCash,base};
}

function reverseGrowth(){
  const target=Number($("priceInput").value);
  let low=-40,high=50;
  for(let i=0;i<120;i++){
    const mid=(low+high)/2;
    if(dcfFor(mid).perShare<target) low=mid; else high=mid;
  }
  return (low+high)/2;
}

function setText(id,text,cls=null){
  const el=$(id); if(!el)return; el.textContent=text; if(cls)el.className=cls;
}

function loadCompany(){
  const d=currentData();
  setText("companyName",d.name);setText("companyTicker",currentTicker);setText("companyDescription",d.description);
  $("priceInput").value=d.price;$("sharesInput").value=d.shares;$("fcfInput").value=latest(d.fcf);
  $("netCashInput").value=d.netCash;$("growthInput").value=d.growthAssumption;$("waccInput").value=d.wacc;$("terminalInput").value=d.terminalGrowth;
  $("basisInput").value="reported";
  renderAll();
}

function renderAll(){
  renderDashboard(); renderFinancials(); renderGrowth(); renderReturns(); renderCashFlow(); renderCapital(); renderValuation(); renderAudit();
}

function renderDashboard(){
  const d=currentData(),r=dcfFor(),price=Number($("priceInput").value),mos=(r.perShare-price)/r.perShare*100,ig=reverseGrowth(),gap=Number($("growthInput").value)-ig;
  setText("dashboardPrice",fmtMoney(price));setText("dashboardIntrinsic",fmtMoney(r.perShare));
  setText("dashboardMos",pct(mos),cssClass(mos));setText("dashboardRevenue",fmtB(latest(d.revenue)));
  setText("dashboardRevenueGrowth",`${yoy(d.revenue)>=0?"+":""}${pct(yoy(d.revenue))}`,cssClass(yoy(d.revenue)));
  setText("dashboardFcf",fmtB(latest(d.fcf)));setText("dashboardFcfMargin",`${pct(margin(latest(d.fcf),latest(d.revenue)))} margin`);
  const roic=calculateRoic(d);setText("dashboardRoic",pct(roic));
  const quality=qualityScore(d);setText("dashboardQuality",`${quality.toFixed(1)} / 10`);
  setText("dashboardImplied",pct(ig));setText("dashboardBaseGrowth",pct(Number($("growthInput").value)));
  setText("dashboardGap",`${gap>=0?"+":""}${pct(gap)}`,cssClass(gap));
  setText("dashboardStatus",mos>=0?"Below base-case value":"Above base-case value",cssClass(mos));
  renderLineChart(d);
}

function renderLineChart(d){
  const svg=$("dashboardChart"),W=760,H=300,pad=45,max=Math.max(...d.revenue)*1.08;
  const x=i=>pad+i*(W-pad*2)/(d.years.length-1), y=v=>H-pad-v/max*(H-pad*2);
  const path=arr=>arr.map((v,i)=>(i?"L":"M")+x(i)+","+y(v)).join(" ");
  let out=`<line class="axis" x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}"/>`;
  [0,.25,.5,.75,1].forEach(t=>{const yy=pad+t*(H-pad*2);out+=`<line class="axis" opacity=".45" x1="${pad}" y1="${yy}" x2="${W-pad}" y2="${yy}"/>`;});
  out+=`<path class="revenue-line" d="${path(d.revenue)}"/><path class="fcf-line" d="${path(d.fcf)}"/>`;
  d.years.forEach((yr,i)=>{out+=`<circle class="revenue-dot" cx="${x(i)}" cy="${y(d.revenue[i])}" r="4"/><circle class="fcf-dot" cx="${x(i)}" cy="${y(d.fcf[i])}" r="4"/><text x="${x(i)}" y="${H-12}" fill="#94a6ba" font-size="12" text-anchor="middle">${yr}</text>`;});
  svg.innerHTML=out;
}

function tableHtml(rows,years,extraHeaders=[]){
  let html=`<thead><tr><th>USD billions</th>${years.map(y=>`<th>${y}</th>`).join("")}${extraHeaders.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>`;
  rows.forEach(r=>{html+=`<tr><td>${r.label}</td>${r.values.map(v=>`<td>${typeof v==="number"?v.toFixed(1):v}</td>`).join("")}${(r.extra||[]).map(v=>`<td class="${typeof v==="object"?v.cls:""}">${typeof v==="object"?v.text:v}</td>`).join("")}</tr>`;});
  return html+"</tbody>";
}

function renderFinancials(){
  const d=currentData(); let rows=[];
  if(activeStatement==="incomeStatement"){
    rows=[
      {label:"Revenue",values:d.revenue},{label:"Gross profit",values:d.grossProfit},
      {label:"Operating income",values:d.operatingIncome},{label:"Net income",values:d.netIncome},
      {label:"Gross margin",values:d.grossProfit.map((v,i)=>`${margin(v,d.revenue[i]).toFixed(1)}%`)},
      {label:"Operating margin",values:d.operatingIncome.map((v,i)=>`${margin(v,d.revenue[i]).toFixed(1)}%`)},
      {label:"Net margin",values:d.netIncome.map((v,i)=>`${margin(v,d.revenue[i]).toFixed(1)}%`)}
    ];
  } else if(activeStatement==="balanceSheet"){
    rows=[
      {label:"Cash & investments",values:d.cash},{label:"Total assets",values:d.assets},
      {label:"Total debt",values:d.debt},{label:"Total liabilities",values:d.liabilities},
      {label:"Total equity",values:d.equity},{label:"Net cash",values:d.cash.map((v,i)=>v-d.debt[i])}
    ];
  } else {
    rows=[
      {label:"Operating cash flow",values:d.ocf},{label:"Capital expenditure",values:d.capex},
      {label:"Free cash flow",values:d.fcf},{label:"Stock-based compensation",values:d.sbc},
      {label:"Share repurchases",values:d.buybacks},{label:"Dividends",values:d.dividends}
    ];
  }
  $("financialTable").innerHTML=tableHtml(rows,d.years);
}

function renderGrowth(){
  const d=currentData();
  const metrics=[["Revenue",d.revenue],["Gross profit",d.grossProfit],["Operating income",d.operatingIncome],["Net income",d.netIncome],["Operating cash flow",d.ocf],["Free cash flow",d.fcf]];
  let growth=`<thead><tr><th>Metric</th><th>Latest</th><th>YoY</th><th>5Y CAGR</th></tr></thead><tbody>`;
  metrics.forEach(([name,arr])=>{const y=yoy(arr),c=cagr(arr);growth+=`<tr><td>${name}</td><td>${latest(arr).toFixed(1)}</td><td class="${cssClass(y)}">${y>=0?"+":""}${pct(y)}</td><td class="${cssClass(c)}">${c>=0?"+":""}${pct(c)}</td></tr>`;});
  $("growthTable").innerHTML=growth+"</tbody>";
  const marginRows=[
    ["Gross margin",d.grossProfit.map((v,i)=>margin(v,d.revenue[i]))],
    ["Operating margin",d.operatingIncome.map((v,i)=>margin(v,d.revenue[i]))],
    ["Net margin",d.netIncome.map((v,i)=>margin(v,d.revenue[i]))],
    ["FCF margin",d.fcf.map((v,i)=>margin(v,d.revenue[i]))]
  ];
  let m=`<thead><tr><th>Metric</th>${d.years.map(y=>`<th>${y}</th>`).join("")}<th>Change</th></tr></thead><tbody>`;
  marginRows.forEach(([name,arr])=>{const ch=latest(arr)-arr[0];m+=`<tr><td>${name}</td>${arr.map(v=>`<td>${pct(v)}</td>`).join("")}<td class="${cssClass(ch)}">${ch>=0?"+":""}${ch.toFixed(1)} pts</td></tr>`;});
  $("marginTable").innerHTML=m+"</tbody>";
}

function calculateRoic(d){
  const taxRate=0.16,nopat=latest(d.operatingIncome)*(1-taxRate),invested=latest(d.equity)+latest(d.debt)-latest(d.cash);
  return nopat/invested*100;
}
function qualityScore(d){return Object.values(d.quality).reduce((a,b)=>a+b,0)/Object.keys(d.quality).length}
function renderReturns(){
  const d=currentData(),roic=calculateRoic(d),roe=margin(latest(d.netIncome),latest(d.equity)),roa=margin(latest(d.netIncome),latest(d.assets)),conv=margin(latest(d.fcf),latest(d.netIncome));
  setText("returnsRoic",pct(roic));setText("returnsRoe",pct(roe));setText("returnsRoa",pct(roa));setText("returnsConversion",pct(conv));
  $("qualityBreakdown").innerHTML=Object.entries(d.quality).map(([k,v])=>`<div class="score-row"><span>${k.replace("BalanceSheet","Balance sheet").replace("CapitalAllocation","Capital allocation")}</span><div class="score-track"><div class="score-fill" style="width:${v*10}%"></div></div><strong>${v.toFixed(1)}</strong></div>`).join("");
  const tax=16,nopat=latest(d.operatingIncome)*(1-tax/100),invested=latest(d.equity)+latest(d.debt)-latest(d.cash);
  $("roicExplain").textContent=`NOPAT = Operating income × (1 − tax rate)
= $${latest(d.operatingIncome).toFixed(1)}B × (1 − ${tax}%)
= $${nopat.toFixed(1)}B

Invested capital = Equity + Debt − Cash
= $${latest(d.equity).toFixed(1)}B + $${latest(d.debt).toFixed(1)}B − $${latest(d.cash).toFixed(1)}B
= $${invested.toFixed(1)}B

ROIC = NOPAT / Invested capital = ${pct(roic)}`;
  $("roeExplain").textContent=`ROE = Net income / Equity
= $${latest(d.netIncome).toFixed(1)}B / $${latest(d.equity).toFixed(1)}B
= ${pct(roe)}`;
  $("roaExplain").textContent=`ROA = Net income / Total assets
= $${latest(d.netIncome).toFixed(1)}B / $${latest(d.assets).toFixed(1)}B
= ${pct(roa)}`;
}

function renderCashFlow(){
  const d=currentData(),reported=latest(d.fcf),sbcAdj=reported-latest(d.sbc),maintenance=latest(d.capex)*d.maintenanceCapexPct/100,owner=latest(d.ocf)-maintenance-latest(d.sbc),growthCapex=latest(d.capex)-maintenance,ai=latest(d.capex)*d.aiCapexPct/100;
  setText("reportedFcf",fmtB(reported));setText("sbcAdjustedFcf",fmtB(sbcAdj));setText("ownerEarnings",fmtB(owner));setText("cashflowMargin",pct(margin(reported,latest(d.revenue))));
  setText("capexReported",fmtB(latest(d.capex)));setText("capexMaintenance",fmtB(maintenance));setText("capexGrowth",fmtB(growthCapex));setText("capexAi",fmtB(ai));
  const rows=[
    {label:"Operating cash flow",values:d.ocf},{label:"Capital expenditure",values:d.capex},
    {label:"Reported FCF",values:d.fcf},{label:"SBC-adjusted FCF",values:d.fcf.map((v,i)=>v-d.sbc[i])},
    {label:"Owner earnings",values:d.ocf.map((v,i)=>v-d.capex[i]*d.maintenanceCapexPct/100-d.sbc[i])}
  ];
  $("cashflowAnalysisTable").innerHTML=tableHtml(rows,d.years);
}

function renderCapital(){
  const d=currentData();
  const rows=[{label:"Share repurchases",values:d.buybacks},{label:"Stock-based compensation",values:d.sbc},{label:"Dividends",values:d.dividends},{label:"Capital expenditure",values:d.capex},{label:"Acquisitions",values:d.acquisitions}];
  $("capitalTable").innerHTML=tableHtml(rows,d.years);
  const items=[["Buybacks",latest(d.buybacks)],["SBC",latest(d.sbc)],["Dividends",latest(d.dividends)],["CapEx",latest(d.capex)],["Acquisitions",latest(d.acquisitions)]],max=Math.max(...items.map(x=>x[1]));
  $("capitalBars").innerHTML=items.map(([n,v])=>`<div class="bar-row"><span>${n}</span><div class="bar-track"><div class="bar-fill" style="width:${v/max*100}%"></div></div><strong>${fmtB(v)}</strong></div>`).join("");
}

function renderValuation(){
  const d=currentData(),r=dcfFor(),price=Number($("priceInput").value),ig=reverseGrowth(),base=Number($("growthInput").value),gap=base-ig;
  const low=dcfFor(base-2).perShare,high=dcfFor(base+2).perShare;
  setText("valuationResult",fmtMoney(r.perShare));setText("valuationRange",`Indicative range: ${fmtMoney(low)}–${fmtMoney(high)}`);
  setText("reverseResult",pct(ig));setText("reverseBase",pct(base));setText("reverseGap",`${gap>=0?"+":""}${pct(gap)}`,cssClass(gap));
  $("valuationExplain").textContent=`Valuation basis: ${$("basisInput").selectedOptions[0].text}
Base cash flow: $${r.base.toFixed(1)}B
Five-year growth: ${base.toFixed(1)}%
WACC: ${Number($("waccInput").value).toFixed(1)}%
Terminal growth: ${Number($("terminalInput").value).toFixed(1)}%

PV of forecast cash flows: $${r.pv.toFixed(1)}B
PV of terminal value: $${r.pvTv.toFixed(1)}B
Net cash added: $${Number($("netCashInput").value).toFixed(1)}B
Equity value: $${r.equity.toFixed(1)}B
Shares outstanding: ${Number($("sharesInput").value).toFixed(2)}B

Intrinsic value per share: ${fmtMoney(r.perShare)}`;
  const scenarios=[
    {name:"Bear",g:base-4,w:Number($("waccInput").value)+1,t:Number($("terminalInput").value)-.5},
    {name:"Base",g:base,w:Number($("waccInput").value),t:Number($("terminalInput").value)},
    {name:"Bull",g:base+4,w:Number($("waccInput").value)-1,t:Number($("terminalInput").value)+.5}
  ];
  $("scenarioGrid").innerHTML=scenarios.map(s=>{const v=dcfFor(s.g,s.w,s.t).perShare,mos=(v-price)/v*100;return `<div class="scenario-card"><h3>${s.name}</h3><div class="value">${fmtMoney(v)}</div><dl><dt>FCF growth</dt><dd>${pct(s.g)}</dd><dt>WACC</dt><dd>${pct(s.w)}</dd><dt>Terminal growth</dt><dd>${pct(s.t)}</dd><dt>Margin of safety</dt><dd class="${cssClass(mos)}">${pct(mos)}</dd></dl></div>`;}).join("");
  renderSensitivity();
  renderDashboard();
}

function renderSensitivity(){
  const baseW=Number($("waccInput").value),baseT=Number($("terminalInput").value),waccs=[baseW-1,baseW-.5,baseW,baseW+.5,baseW+1],terms=[baseT-1,baseT-.5,baseT,baseT+.5,baseT+1];
  let html=`<thead><tr><th>WACC \\ Terminal</th>${terms.map(t=>`<th>${pct(t)}</th>`).join("")}</tr></thead><tbody>`;
  waccs.forEach(w=>{html+=`<tr><td>${pct(w)}</td>${terms.map(t=>{const valid=w>t,val=valid?fmtMoney(dcfFor(null,w,t).perShare):"—",cls=Math.abs(w-baseW)<.01&&Math.abs(t-baseT)<.01?"sensitivity-current":"";return `<td class="${cls}">${val}</td>`;}).join("")}</tr>`;});
  $("sensitivityTable").innerHTML=html+"</tbody>";
}

function renderAudit(){
  const d=currentData();
  const rows=[
    ["Revenue","us-gaap:Revenues","FY 2025","Mapped"],
    ["Operating income","us-gaap:OperatingIncomeLoss","FY 2025","Mapped"],
    ["Net income","us-gaap:NetIncomeLoss","FY 2025","Mapped"],
    ["Operating cash flow","us-gaap:NetCashProvidedByUsedInOperatingActivities","FY 2025","Mapped"],
    ["CapEx","us-gaap:PaymentsToAcquirePropertyPlantAndEquipment","FY 2025","Review"],
    ["Maintenance CapEx","User assumption derived from reported CapEx","Forecast","Assumption"],
    ["Business quality","Formula-driven composite score","Latest","Calculated"]
  ];
  $("auditRows").innerHTML=rows.map(r=>`<div class="audit-row"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><strong class="${r[3]==="Mapped"?"positive":r[3]==="Review"?"neutral":"calculation"}">${r[3]}</strong></div>`).join("");
  const diff=latest(d.assets)-latest(d.liabilities)-latest(d.equity);
  $("balanceValidation").textContent=`Assets = Liabilities + Equity

${latest(d.assets).toFixed(1)} = ${latest(d.liabilities).toFixed(1)} + ${latest(d.equity).toFixed(1)}
Difference = ${diff.toFixed(1)}
Status = ${Math.abs(diff)<0.05?"PASS":"REVIEW"}`;
}

document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");$(btn.dataset.view).classList.add("active");
}));
document.querySelectorAll("#statementTabs button").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll("#statementTabs button").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");activeStatement=btn.dataset.statement;renderFinancials();
}));
$("tickerSelect").addEventListener("change",e=>{currentTicker=e.target.value;loadCompany();});
["priceInput","sharesInput","fcfInput","netCashInput","growthInput","waccInput","terminalInput","basisInput"].forEach(id=>$(id).addEventListener("input",renderValuation));
$("basisInput").addEventListener("change",renderValuation);

loadCompany();
