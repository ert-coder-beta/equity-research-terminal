export function money(value,currency="USD"){return new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:2}).format(value)}
export function number(value){return new Intl.NumberFormat("en-US",{maximumFractionDigits:1}).format(value)}
export function percent(value){return `${value.toFixed(1)}%`}
