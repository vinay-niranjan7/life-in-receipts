/* ui.js — shared rendering pieces: receipt cards, receipt detail, tabs, and the
   small DOM helpers (announcements, scrolling, highlight). */
import { DATA, CHAPTERS, TYPE_LABEL } from './data.js';
import { state } from './state.js';
import { esc, iconSvg, fmtDate, byTag, byChapter, chapterOf, threadSpan, dayNum, reduceMotion } from './utils.js';
import { chainHTML } from './connections.js';

/* ============================= CARD MARKUP ============================= */
export function cardHTML(d, opts){
  opts = opts||{};
  var expanded = state.expanded===d.id;
  var isFav = state.favs.indexOf(d.id)>-1;
  var detailId = 'detail-'+esc(d.id);
  var html = '';
  html += '<article class="receipt" data-id="'+esc(d.id)+'">';
  html += '<button class="fav-btn '+(isFav?'on':'')+'" data-action="toggle-fav" data-id="'+esc(d.id)+'" aria-label="'+(isFav?'Remove saved moment':'Save this moment')+'">'+(isFav?'★':'☆')+'</button>';
  html += '<div class="receipt-top">'+iconSvg(d.type)+'<span class="receipt-type" style="color:var(--t-'+esc(d.type)+')">'+esc(TYPE_LABEL[d.type])+'</span><span class="receipt-date">'+esc(fmtDate(d.date))+'</span></div>';
  html += '<button class="receipt-open" data-action="toggle-card" data-id="'+esc(d.id)+'" aria-expanded="'+expanded+'" aria-controls="'+detailId+'">';
  html += '<span class="receipt-title">'+esc(d.title)+'</span>';
  if(d.meta) html += '<span class="receipt-meta">'+esc(d.meta)+'</span>';
  html += '</button>';
  if(d.tag) html += '<div class="receipt-actions"><button class="thread-chip" data-action="set-tag" data-tag="'+esc(d.tag)+'">↻ '+esc(d.tagLabel)+'</button></div>';
  if(expanded) html += detailHTML(d);
  html += '</article>';
  return html;
}


export function detailHTML(d){
  var html = '<div class="detail-panel" id="detail-'+esc(d.id)+'">';
  html += d.detail ? ('<div>'+esc(d.detail)+'</div>') : '<div>No further notes on this one — some moments are just moments.</div>';
  var ch = chapterOf(d.chapter);
  html += '<div class="part-of">Part of <button data-action="goto-chapter" data-index="'+(d.chapter-1)+'">Chapter '+d.chapter+' · '+esc(ch.title)+'</button></div>';
  if(d.tag){
    var related = byTag(d.tag).filter(function(x){ return x.id!==d.id; });
    if(related.length){
      html += '<div class="part-of">Also part of the <b style="color:var(--thread)">'+esc(d.tagLabel)+'</b> thread ('+ (related.length+1) +' moments, '+esc(threadSpan(d.tag))+') — <button data-action="set-tag" data-tag="'+esc(d.tag)+'">see them all</button></div>';
    }
  }
  var near = DATA.filter(function(x){ return x.id!==d.id && Math.abs(dayNum(x.date)-dayNum(d.date))<=21; })
    .sort(function(a,b){ return Math.abs(dayNum(a.date)-dayNum(d.date)) - Math.abs(dayNum(b.date)-dayNum(d.date)); })
    .slice(0,3);
  var sameType = DATA.filter(function(x){ return x.id!==d.id && x.type===d.type; });

  html += '<div class="rel-block">';
  html += '<div class="rel-label">CONNECTED TO</div><div class="rel-links">';
  if(d.tag) html += '<button data-action="set-tag" data-tag="'+esc(d.tag)+'">↻ '+esc(d.tagLabel)+' thread · '+byTag(d.tag).length+'</button>';
  html += '<button data-action="goto-chapter" data-index="'+(d.chapter-1)+'">▣ Chapter '+d.chapter+' · '+byChapter(d.chapter).length+' moments</button>';
  if(sameType.length) html += '<button data-action="set-category-jump" data-cat="'+esc(d.type)+'">'+esc(TYPE_LABEL[d.type])+' receipts · '+(sameType.length+1)+'</button>';
  html += '</div>';
  if(near.length){
    html += '<div class="rel-label" style="margin-top:10px">NEARBY IN TIME</div><div class="rel-links">'+
      near.map(function(x){ return '<button data-action="chain-node" data-id="'+esc(x.id)+'">'+esc(x.title)+' · '+esc(fmtDate(x.date))+'</button>'; }).join('')+'</div>';
  }
  html += '<div style="margin-top:12px"><button class="btn" data-action="chain-open" data-id="'+esc(d.id)+'" aria-expanded="'+(state.chainSeed===d.id)+'">'+
          (state.chainSeed===d.id ? '✕ Hide the chain' : 'Connect the dots →')+'</button></div>';
  if(state.chainSeed===d.id){
    html += '<div style="margin-top:12px">'+chainHTML(d.id, d.id)+'</div>';
  }
  html += '</div>';
  html += '</div>';
  return html;
}

/* ============================= TAB NAV ============================= */
export var TAB_ICON = {
  story:'<path d="M4 4h11l5 5v11H4z"/><path d="M9 10h6M9 14h6M9 18h3"/>',
  insights:'<path d="M4 18l5-6 4 3 6-8"/><circle cx="9" cy="12" r="1.6"/><circle cx="13" cy="15" r="1.6"/>',
  explore:'<circle cx="10.3" cy="10.3" r="6.3"/><path d="M20 20l-5-5"/>',
  map:'<path d="M9 4v16M15 4v16"/><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"/>'
};
export function renderTabs(){
  var labels = { story:'The Story', insights:'Patterns', explore:'Explore', map:'Life Map' };
  var html = Object.keys(labels).map(function(t){
    return '<button class="tab-btn '+(state.tab===t?'active':'')+'" data-action="set-tab" data-tab="'+t+'" aria-current="'+(state.tab===t?'page':'false')+'">'+
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">'+TAB_ICON[t]+'</svg>'+labels[t]+'</button>';
  }).join('');
  document.getElementById('tabs').innerHTML = html;
}

/* ---- DOM helpers ---- */
export function say(msg){ var l=document.getElementById('live'); if(l) l.textContent = msg; }
export function toTop(){ window.scrollTo({ top:0, behavior: reduceMotion() ? 'auto':'smooth' }); }
export function scrollToEl(el, block){
  if(el) el.scrollIntoView({ block: block||'start', behavior: reduceMotion() ? 'auto':'smooth' });
}
export function highlight(id){
  var node = document.querySelector('[data-id="'+id+'"]');
  if(!node) return;
  var card = (node.closest && node.closest('.receipt')) || node;
  card.classList.add('flash');
  scrollToEl(card,'center');
}
