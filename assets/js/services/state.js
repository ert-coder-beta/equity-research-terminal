const STORAGE_KEY="ert-state-v1";
export function loadState(){const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):{ticker:"GOOG",page:"overview",notes:{}}}
export function saveState(state){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
