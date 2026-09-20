/* explore.js — search, category filters, thread filters and saved moments. */
import { DATA, TYPES, TYPE_LABEL } from './data.js';
import { state } from './state.js';
import { esc, byTag, chapterOf, allTags, threadSpan } from './utils.js';
import { cardHTML } from './ui.js';

/* ============================= RENDER: EXPLORE ============================= */
export function renderExplore(){
  var q = state.search.trim().toLowerCase();
  var results = DATA.filter(function(d){
    if(state.category!=='all' && d.type!==state.category) return false;
    if(state.tag && d.tag!==state.tag) return false;
    if(q){
      var hay = (d.title+' '+(d.meta||'')+' '+(d.detail||'')+' '+(d.tagLabel||'')+' '+chapterOf(d.chapter).title).toLowerCase();
      if(hay.indexOf(q)===-1) return false;
    }
    return true;
  });

  var counts = { all: DATA.length };
  TYPES.forEach(function(t){ counts[t] = DATA.filter(function(d){return d.type===t;}).length; });

  var html = '';
  html += '<div class="section-head"><p class="kicker">Explore</p><h2 style="font-size:26px;">Every receipt, in one place</h2></div>';
  html += '<div class="explore-bar">';
  html += '<div class="search-wrap"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.3" cy="10.3" r="6.3"/><path d="M20 20l-5-5"/></svg>'+
          '<label class="sr-only" for="searchInput">Search receipts</label><input id="searchInput" type="search" autocomplete="off" maxlength="120" placeholder="Search receipts... try &quot;DSA&quot; or &quot;Spring Boot&quot;" value="'+esc(state.search)+'" />'+
          '</div>';
  html += '<div class="chip-row">';
  html += '<button class="chip '+(state.category==='all'?'active':'')+'" data-action="set-category" data-cat="all">All ('+counts.all+')</button>';
  TYPES.forEach(function(t){
    html += '<button class="chip '+(state.category===t?'active':'')+'" data-action="set-category" data-cat="'+t+'">'+TYPE_LABEL[t]+' ('+counts[t]+')</button>';
  });
  html += '<button class="chip '+(state.category==='__fav'?'active':'')+'" data-action="set-category" data-cat="__fav">★ Saved ('+state.favs.length+')</button>';
  html += '</div>';
  html += '</div>';

  if(state.tag){
    var label = (allTags().filter(function(t){return t.tag===state.tag;})[0]||{}).label || state.tag;
    var n = byTag(state.tag).length;
    html += '<div class="tag-banner"><span>Following the <b>'+esc(label)+'</b> thread — '+n+' moments, '+esc(threadSpan(state.tag))+'</span><button data-action="clear-tag" aria-label="Clear thread filter">✕</button></div>';
  }

  if(state.category==='__fav') results = results.filter(function(d){ return state.favs.indexOf(d.id)>-1; });

  html += '<p class="result-count" role="status" aria-live="polite">'+results.length+' moment'+(results.length===1?'':'s')+'</p>';

  if(!results.length){
    html += '<div class="empty-state">Nothing matches that. Try a different search, or <button data-action="clear-filters" style="background:none;border:none;color:var(--thread);text-decoration:underline;cursor:pointer;font-family:inherit;font-size:inherit;">clear all filters</button>.</div>';
  } else {
    html += '<div class="explore-grid">'+results.map(function(d){ return cardHTML(d); }).join('')+'</div>';
  }
  return html;
}
