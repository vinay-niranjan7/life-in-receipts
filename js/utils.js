/* utils.js — pure helpers shared by every module: formatting, lookups, grouping. */
import { CHAPTERS, DATA, TYPES, TYPE_ICON } from './data.js';

export function iconSvg(type){ return '<svg class="icon" style="--dot:var(--t-'+type+')" viewBox="0 0 24 24">'+TYPE_ICON[type]+'</svg>'; }

export var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export function fmtDate(iso){ var p=iso.split('-'); return MONTHS[parseInt(p[1],10)-1]+' '+parseInt(p[2],10); }
export function monthKey(iso){ var p=iso.split('-'); return p[0]+'-'+p[1]; }
export function monthLabel(iso){ var p=iso.split('-'); return MONTHS[parseInt(p[1],10)-1]+" '"+p[0].slice(2); }

/* ---- lookups & grouping ---- */
export function byId(id){ for(var i=0;i<DATA.length;i++){ if(DATA[i].id===id) return DATA[i]; } return null; }
export function uniq(a){ var s={},o=[]; a.forEach(function(x){ if(x!=null && !s[x]){ s[x]=1; o.push(x); } }); return o; }
export function dayNum(iso){ var p=iso.split('-'); return Date.UTC(+p[0],+p[1]-1,+p[2])/86400000; }
export var FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export function monthName(mk){ return MONTHS[parseInt(mk.split('-')[1],10)-1]; }
export function monthFull(mk){ return FULL_MONTHS[parseInt(mk.split('-')[1],10)-1]; }
export function tagsIn(items){ return uniq(items.map(function(d){ return d.tag; }).filter(Boolean)); }
export function monthsOf(items){ return uniq(items.map(function(d){ return monthKey(d.date); })).sort(); }
export function typesOf(items){ return uniq(items.map(function(d){ return d.type; })); }
export function monthGroups(){
  var m={}; DATA.forEach(function(d){ var k=monthKey(d.date); (m[k]=m[k]||[]).push(d); });
  Object.keys(m).forEach(function(k){ m[k].sort(function(a,b){ return a.date<b.date?-1:1; }); });
  return m;
}
export function listMonths(){ return Object.keys(monthGroups()).sort(); }

/* ---- validation & filters ---- */
export function validateData(){
  var validTypes = {};
  TYPES.forEach(function(t){ validTypes[t]=true; });
  var issues = [];
  DATA.forEach(function(d,i){
    if(!d.id || !d.date || !d.title || !validTypes[d.type] || !chapterOf(d.chapter)){
      issues.push('Invalid receipt at index '+i);
    }
  });
  if(issues.length && window.console) console.warn('Life in Receipts data validation:', issues);
  return issues.length===0;
}

export function byChapter(n){ return DATA.filter(function(d){ return d.chapter===n; }); }
export function byTag(tag){ return DATA.filter(function(d){ return d.tag===tag; }); }
export function chapterOf(n){ return CHAPTERS[n-1]; }

export function threadSpan(tag){
  var items = byTag(tag).slice().sort(function(a,b){ return a.date<b.date?-1:1; });
  if(!items.length) return '';
  return fmtDate(items[0].date)+' – '+fmtDate(items[items.length-1].date);
}
export function allTags(){
  var seen={}, out=[];
  DATA.forEach(function(d){ if(d.tag && !seen[d.tag]){ seen[d.tag]=1; out.push({tag:d.tag,label:d.tagLabel}); } });
  return out;
}

export function esc(value){
  return String(value==null?'':value)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* first-appearance chapter per tag, for "new thread / continuing" language */
export var tagFirstChapter = {};
DATA.forEach(function(d){ if(d.tag && !(d.tag in tagFirstChapter)) tagFirstChapter[d.tag]=d.chapter; });

/* ---- environment ---- */
export function reduceMotion(){ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
