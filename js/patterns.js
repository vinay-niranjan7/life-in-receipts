/* patterns.js — the discovery view: life signals, generated patterns,
   what changed month to month, and the connect-the-dots chain. */
import { DATA, CHAPTERS } from './data.js';
import { state } from './state.js';
import { esc, byId, chapterOf, allTags, typesOf, listMonths, monthName } from './utils.js';
import { signalData, buildInsights, monthShifts } from './insights.js';
import { chainHTML } from './connections.js';
import { cardHTML } from './ui.js';

/* ============================= RENDER: INSIGHTS ============================= */
export function renderInsights(){
  var html = '';
  var sig = signalData(), maxSig = sig[0] ? sig[0].count : 1;
  var ms = listMonths();

  html += '<div class="section-head"><p class="kicker">Patterns</p><h2 style="font-size:26px;">What the receipts add up to</h2>'+
          '<p class="chapter-blurb" style="margin-top:8px">Every number and every claim below is counted from the '+DATA.length+' receipts — nothing is assumed about the person behind them.</p></div>';

  if(state.surprise){
    html += '<div class="surprise-note" role="status">'+state.surprise+'</div>';
  }

  /* ---- Life signals ---- */
  html += '<div class="stat-grid">'+
    '<div class="stat-card"><div class="num">'+DATA.length+'</div><div class="lbl">moments on record</div></div>'+
    '<div class="stat-card"><div class="num">'+CHAPTERS.length+'</div><div class="lbl">chapters</div></div>'+
    '<div class="stat-card"><div class="num">'+ms.length+'</div><div class="lbl">months, '+monthName(ms[0])+' → '+monthName(ms[ms.length-1])+'</div></div>'+
    '<div class="stat-card"><div class="num">'+allTags().length+'</div><div class="lbl">recurring threads</div></div>'+
    '<div class="stat-card"><div class="num">'+typesOf(DATA).length+'</div><div class="lbl">kinds of receipt</div></div>'+
  '</div>';

  html += '<div class="sub-head"><h3>Life signals</h3><span class="note">receipts matched to each signal — select one to see them</span></div>';
  html += '<div class="bars">'+sig.map(function(x){
    var pct = Math.round(x.count/maxSig*100);
    return '<button class="bar-row" data-action="signal" data-key="'+esc(x.key)+'" aria-label="'+esc(x.label)+': '+x.count+' receipts across '+x.months.length+' months">'+
      '<span class="bname">'+esc(x.label)+'</span>'+
      '<span class="bar-track"><span class="bar-fill" style="width:'+pct+'%"></span></span>'+
      '<span class="bnum">'+x.count+' receipts · '+x.months.length+' mo</span></button>';
  }).join('')+'</div>';

  /* ---- Discovered patterns ---- */
  var ins = buildInsights();
  html += '<div class="sub-head"><h3>Discovered patterns</h3><span class="note">'+ins.length+' derived from the dataset</span></div>';
  html += '<div class="insight-grid">'+ins.map(function(x){
    return '<article class="insight-card">'+
      '<span class="stamp">'+esc(x.stamp)+'</span>'+
      '<h4>'+esc(x.title)+'</h4>'+
      '<p>'+esc(x.text)+'</p>'+
      '<div class="ev-chips">'+x.chips.map(function(c){ return '<span class="ev-chip">'+esc(c)+'</span>'; }).join('')+'</div>'+
      '<button class="btn" data-action="explore-insight" data-id="'+esc(x.id)+'" data-tag="'+esc(x.tag||'')+'" data-ids="'+esc(x.ids.join(','))+'" '+
      'aria-label="Explore the evidence for: '+esc(x.title)+'">Explore this pattern →</button>'+
    '</article>';
  }).join('')+'</div>';

  if(state.insightIds && state.insightIds.length){
    var picked = state.insightIds.map(byId).filter(Boolean);
    html += '<div class="sub-head"><h3>Evidence</h3><span class="note">'+picked.length+' receipts behind that pattern</span></div>';
    html += '<div class="explore-grid" id="evidence">'+picked.map(function(d){ return cardHTML(d); }).join('')+'</div>';
  }

  /* ---- What changed ---- */
  html += '<div class="sub-head"><h3>What changed, month by month</h3><span class="note">select a month to open its chapter</span></div>';
  html += '<div class="changes">'+monthShifts().map(function(x){
    return '<button class="change-row" data-action="goto-chapter" data-index="'+(x.chapter-1)+'" style="--band:'+chapterOf(x.chapter).band+'" '+
      'aria-label="'+esc(x.label)+': open chapter '+x.chapter+'">'+
      '<span class="cmonth">'+esc(x.label)+'</span>'+
      '<span><span class="ctext">'+x.text+'</span><span class="cmeta">'+esc(x.meta)+'</span></span></button>';
  }).join('')+'</div>';

  /* ---- Connect the dots ---- */
  var seedIds = ['r03','r27','r10','r39','r29'].filter(function(id){ return !!byId(id); });
  var seed = state.chainSeed && byId(state.chainSeed) ? state.chainSeed : seedIds[0];
  html += '<div class="sub-head"><h3>Connect the dots</h3><span class="note">pick a starting receipt — the chain is rebuilt from shared threads, words and dates</span></div>';
  html += '<div class="seed-row">'+seedIds.map(function(id){
    var d = byId(id);
    return '<button class="chip '+(seed===id?'active':'')+'" data-action="chain-seed" data-id="'+esc(id)+'" aria-pressed="'+(seed===id)+'">'+esc(d.title)+'</button>';
  }).join('')+
  '<button class="chip" data-action="surprise">✦ Surprise me</button></div>';
  html += chainHTML(seed, state.chainFocus||null);

  return html;
}
