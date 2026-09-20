/* state.js — application state, localStorage persistence and theme. */
/* ============================= STATE ============================= */
export var state = { tab:'story', chapter:0, category:'all', tag:null, search:'', expanded:null, mapSel:null, favs:[], theme:null, chainSeed:null, surprise:null, flash:null, storyStarted:false };

export function loadState(){
  try{
    var t = localStorage.getItem('lir_theme'); if(t) state.theme=t;
    var f = localStorage.getItem('lir_favs'); if(f){ var parsed=JSON.parse(f); if(Array.isArray(parsed)) state.favs=parsed; }
    var tb = localStorage.getItem('lir_tab'); if(tb && ['story','insights','explore','map'].indexOf(tb)>-1) state.tab = tb;
  }catch(e){}
}
export function persist(key,val){ try{ localStorage.setItem(key, typeof val==='string'? val : JSON.stringify(val)); }catch(e){} }

export function applyTheme(){
  if(state.theme==='light'||state.theme==='dark'){
    document.documentElement.setAttribute('data-theme', state.theme);
    document.getElementById('themeBtn').textContent = state.theme==='dark' ? '☀' : '☾';
  } else {
    document.documentElement.removeAttribute('data-theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.getElementById('themeBtn').textContent = prefersDark ? '☀' : '☾';
  }
}
