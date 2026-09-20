/* map.js — the eight-month Life Map, recurring threads and receipt coverage. */
import { DATA, CHAPTERS, TYPES, TYPE_LABEL } from './data.js';
import { state } from './state.js';
import { esc, uniq, byTag, chapterOf, allTags, threadSpan, monthKey, monthLabel, fmtDate } from './utils.js';
import { cardHTML } from './ui.js';

/* ============================= RENDER: MAP ============================= */
export function renderMap(){
  var byMonth = {};
  DATA.forEach(function(d){ var k=monthKey(d.date); (byMonth[k]=byMonth[k]||[]).push(d); });
  var months = Object.keys(byMonth).sort();

  var busiest = months.reduce(function(a,b){ return byMonth[b].length>byMonth[a].length? b:a; }, months[0]);
  var tags = allTags();
  var topTag = tags.reduce(function(best,t){ var c=byTag(t.tag).length; return (!best||c>best.c)?{t:t,c:c}:best; }, null);
  var firstDate = DATA[0].date, lastDate = DATA[DATA.length-1].date;

  var html = '';
  html += '<div class="section-head"><p class="kicker">Life Map</p><h2 style="font-size:26px;">The eight months, at a glance</h2></div>';

  html += '<div class="stat-grid">'+
    '<div class="stat-card"><div class="num">'+DATA.length+'</div><div class="lbl">receipts collected across '+months.length+' months</div></div>'+
    '<div class="stat-card"><div class="num">'+esc(monthLabel(busiest+'-01'))+'</div><div class="lbl">busiest month — '+byMonth[busiest].length+' moments logged</div></div>'+
    '<div class="stat-card"><div class="num">'+esc(topTag?topTag.t.label:'—')+'</div><div class="lbl">most recurring thread — '+(topTag?topTag.c:0)+' appearances, '+esc(topTag?threadSpan(topTag.t.tag):'')+'</div></div>'+
    '<div class="stat-card"><div class="num">'+CHAPTERS.length+'</div><div class="lbl">chapters found across one eight-month journey</div></div>'+
  '</div>';

  html += '<h3 style="font-size:15px;margin-bottom:10px;">Every month, colour-coded by chapter</h3>';
  html += '<div class="map-scroll"><div class="map-row">';
  months.forEach(function(mk){
    var items = byMonth[mk];
    var chId = items[0].chapter;
    var band = chapterOf(chId).band;
    html += '<div class="month-col">';
    var maxM = months.reduce(function(a,k){ return Math.max(a, byMonth[k].length); },1);
    var filled = Math.max(1, Math.round(items.length/maxM*6));
    var themeTags = uniq(items.map(function(d){ return d.tag; })).map(function(t){ return byTag(t)[0].tagLabel; });
    var themeTxt = themeTags.length ? themeTags.join(' · ') : 'college routine';
    html += '<div class="month-band" style="--band:'+band+'"><b>'+monthLabel(mk+'-01')+'</b>'+
      '<span class="mcount"><span class="density" role="img" aria-label="'+items.length+' receipts">'+
      [0,1,2,3,4,5].map(function(i){ return '<i class="'+(i<filled?'':'off')+'"></i>'; }).join('')+
      '</span>'+items.length+' moments</span></div>';
    html += '<p class="month-themes">'+esc(themeTxt)+'<br>Ch '+chId+' · '+esc(chapterOf(chId).title)+'</p>';
    items.forEach(function(d){
      html += '<button class="dot-btn '+(state.mapSel===d.id?'sel':'')+'" data-action="map-select" data-id="'+esc(d.id)+'" aria-label="'+esc(d.title)+' · '+esc(fmtDate(d.date))+'">'+
        '<span class="type-dot" style="--dot:var(--t-'+esc(d.type)+')"></span><span class="lbl">'+esc(d.title)+'</span></button>';
    });
    html += '</div>';
  });
  html += '</div></div>';

  if(state.mapSel){
    var sel = DATA.filter(function(d){return d.id===state.mapSel;})[0];
    if(sel) html += '<div class="map-detail">'+cardHTML(sel)+'</div>';
  }

  html += '<h3 style="font-size:15px;margin-bottom:10px;">Recurring threads</h3>';
  html += '<div class="threads-panel">'+tags.map(function(t){
    var n = byTag(t.tag).length;
    return '<button class="thread-row" data-action="set-tag-mapjump" data-tag="'+esc(t.tag)+'" aria-label="Explore '+esc(t.label)+' thread, '+n+' moments">'+
      '<span class="tname">'+esc(t.label)+'</span><span class="tspan">'+esc(threadSpan(t.tag))+'</span><span class="tcount">'+n+'×</span></button>';
  }).join('')+'</div>';

  var typeCoverage = TYPES.map(function(t){
    return {type:t, count:DATA.filter(function(d){return d.type===t;}).length};
  }).filter(function(x){return x.count>0;});
  html += '<h3 style="font-size:15px;margin:28px 0 10px;">Receipt coverage</h3>';
  html += '<div class="chip-row" aria-label="Receipt type coverage">'+typeCoverage.map(function(x){
    return '<button class="chip" data-action="set-category-jump" data-cat="'+x.type+'">'+esc(TYPE_LABEL[x.type])+' ('+x.count+')</button>';
  }).join('')+'</div>';

  return html;
}
