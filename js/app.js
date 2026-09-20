/* app.js — entry point: boots state, renders the active view, owns all event handling. */
import { DATA, CHAPTERS } from './data.js';
import { state, loadState, persist, applyTheme } from './state.js';
import { byId, validateData, reduceMotion, chapterOf } from './utils.js';
import { renderTabs, say, toTop, scrollToEl, highlight } from './ui.js';
import { signalData } from './insights.js';
import { surpriseCandidates, surpriseFor } from './connections.js';
import { renderStory } from './story.js';
import { renderInsights } from './patterns.js';
import { renderExplore } from './explore.js';
import { renderMap } from './map.js';

/* ============================= MAIN RENDER ============================= */
function render(){
  var main = document.getElementById('main');
  var wasSearching = document.activeElement && document.activeElement.id==='searchInput';
  try{
    renderTabs();
    if(state.tab==='story') main.innerHTML = renderStory();
    else if(state.tab==='insights') main.innerHTML = renderInsights();
    else if(state.tab==='explore') main.innerHTML = renderExplore();
    else main.innerHTML = renderMap();
  }catch(err){
    if(window.console) console.error('Life in Receipts render error:', err);
    main.innerHTML = '<div class="empty-state"><h2>Something went wrong</h2><p>The story could not be rendered. Refresh the page to try again.</p></div>';
    return;
  }
  var input = document.getElementById('searchInput');
  if(input && wasSearching){
    var end = input.value.length;
    input.focus();
    try{ input.setSelectionRange(end,end); }catch(e){}
  }
  if(state.flash){ highlight(state.flash); state.flash = null; }
}

/* ============================= EVENTS ============================= */
document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest('[data-action]') : null;
  if(!el) return;
  var action = el.getAttribute('data-action');

  if(action==='set-tab'){ state.tab = el.getAttribute('data-tab'); state.expanded=null; persist('lir_tab', state.tab); render(); toTop(); return; }
  if(action==='start-story'){ state.storyStarted=true; state.tab='story'; render(); say('Chapter 1 of '+CHAPTERS.length); return; }
  if(action==='skip-intro'){ var iv=document.getElementById('intro'); if(iv) iv.classList.add('hide'); return; }
  if(action==='chain-seed'){ state.chainSeed = el.getAttribute('data-id'); state.chainFocus=null; render(); say('Chain rebuilt.'); return; }
  if(action==='chain-open'){
    var cid = el.getAttribute('data-id');
    state.chainSeed = state.chainSeed===cid ? null : cid;
    state.expanded = cid; render(); say(state.chainSeed? 'Connections revealed.' : 'Connections hidden.'); return;
  }
  if(action==='chain-node'){
    var nid = el.getAttribute('data-id');
    state.expanded = nid; state.chainFocus = nid; state.mapSel = nid; state.flash = nid;
    if(state.tab==='explore'){ state.tag=null; state.category='all'; state.search=''; }
    var nd = byId(nid); render(); say(nd ? 'Opened '+nd.title : 'Opened moment'); return;
  }
  if(action==='explore-insight'){
    var ids = el.getAttribute('data-ids'); var itag = el.getAttribute('data-tag');
    state.insightIds = ids ? ids.split(',') : [];
    state.chainSeed = state.insightIds[0]||null; state.chainFocus=null;
    render();
    scrollToEl(document.getElementById('evidence'));
    say(state.insightIds.length+' receipts shown as evidence.');
    return;
  }
  if(action==='signal'){
    var key = el.getAttribute('data-key');
    var sg = signalData().filter(function(x){ return x.key===key; })[0];
    if(sg){ state.insightIds = sg.items.map(function(d){ return d.id; }); render();
      scrollToEl(document.getElementById('evidence'));
      say(sg.label+': '+sg.count+' receipts.'); }
    return;
  }
  if(action==='surprise'){
    var cands = surpriseCandidates();
    var pick = cands[Math.floor(Math.random()*cands.length)] || DATA[0];
    state.tab='insights'; state.chainSeed=pick.id; state.chainFocus=pick.id; state.surprise=surpriseFor(pick);
    persist('lir_tab','insights'); render();
    var note = document.querySelector('.surprise-note');
    scrollToEl(note || document.querySelector('.chain-node'), 'center');
    say('Surprise: '+pick.title);
    return;
  }
  if(action==='set-category-jump'){ state.tab='explore'; state.tag=null; state.search=''; state.category=el.getAttribute('data-cat'); persist('lir_tab','explore'); render(); toTop(); return; }
  if(action==='chapter-prev'){ state.chapter = Math.max(0, state.chapter-1); state.storyStarted=true; state.expanded=null; render(); say('Chapter '+(state.chapter+1)+': '+CHAPTERS[state.chapter].title); window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); return; }
  if(action==='chapter-next'){ state.chapter = Math.min(CHAPTERS.length-1, state.chapter+1); state.storyStarted=true; state.expanded=null; render(); say('Chapter '+(state.chapter+1)+': '+CHAPTERS[state.chapter].title); window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); return; }
  if(action==='chapter-dot'){ state.chapter = parseInt(el.getAttribute('data-index'),10); state.storyStarted=true; state.expanded=null; render(); say('Chapter '+(state.chapter+1)+': '+CHAPTERS[state.chapter].title); return; }
  if(action==='goto-chapter'){ state.tab='story'; state.storyStarted=true; state.chapter=parseInt(el.getAttribute('data-index'),10); state.expanded=null; persist('lir_tab','story'); render(); window.scrollTo({top:0}); return; }
  if(action==='toggle-card'){ var id = el.getAttribute('data-id'); state.expanded = state.expanded===id? null : id; render(); return; }
  if(action==='toggle-fav'){
    e.stopPropagation();
    var fid = el.getAttribute('data-id');
    var i = state.favs.indexOf(fid);
    if(i>-1) state.favs.splice(i,1); else state.favs.push(fid);
    persist('lir_favs', state.favs); render(); return;
  }
  if(action==='set-category'){ state.category = el.getAttribute('data-cat'); render(); return; }
  if(action==='set-tag'){ say('Following a thread in Explore.'); state.tab='explore'; state.tag = el.getAttribute('data-tag'); state.category='all'; persist('lir_tab','explore'); render(); return; }
  if(action==='set-tag-mapjump'){ state.tab='explore'; state.tag = el.getAttribute('data-tag'); state.category='all'; persist('lir_tab','explore'); render(); window.scrollTo({top:0}); return; }
  if(action==='clear-tag'){ state.tag=null; render(); return; }
  if(action==='clear-filters'){ state.tag=null; state.category='all'; state.search=''; render(); return; }
  if(action==='map-select'){ state.mapSel = el.getAttribute('data-id'); render(); return; }
});

document.addEventListener('keydown', function(e){
  if(e.key==='Escape' && state.expanded){ state.expanded=null; state.chainSeed=null; render(); return; }
  var tagName = e.target && e.target.tagName;
  if(state.tab==='story' && tagName!=='INPUT' && (e.key==='ArrowLeft'||e.key==='ArrowRight')){
    var nx = e.key==='ArrowRight' ? Math.min(CHAPTERS.length-1,state.chapter+1) : Math.max(0,state.chapter-1);
    if(nx!==state.chapter){ state.chapter=nx; state.storyStarted=true; state.expanded=null; render(); say('Chapter '+(nx+1)+': '+CHAPTERS[nx].title); }
    return;
  }
  if(e.key==='Enter' || e.key===' '){
    var el = e.target.closest ? e.target.closest('[data-action="toggle-card"]') : null;
    if(el && e.target===el){ e.preventDefault(); el.click(); }
  }
});

document.addEventListener('input', function(e){
  if(e.target && e.target.id==='searchInput'){ state.search = e.target.value; renderExploreOnly(); }
});
function renderExploreOnly(){
  var main = document.getElementById('main');
  var input = document.getElementById('searchInput');
  var start = input.selectionStart, end = input.selectionEnd;
  main.innerHTML = renderExplore();
  var newInput = document.getElementById('searchInput');
  if(newInput){ newInput.focus(); try{ newInput.setSelectionRange(start,end); }catch(err){} }
}

document.getElementById('themeBtn').addEventListener('click', function(){
  var current = state.theme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
  state.theme = current==='dark' ? 'light' : 'dark';
  persist('lir_theme', state.theme);
  applyTheme();
});

/* ============================= INIT ============================= */
loadState();
validateData();
applyTheme();
render();

var introTimer = setTimeout(function(){
  var intro = document.getElementById('intro');
  if(intro) intro.classList.add('hide');
}, reduceMotion() ? 50 : 1900);
document.addEventListener('keydown', function(e){
  var intro = document.getElementById('intro');
  if(intro && !intro.classList.contains('hide')){ intro.classList.add('hide'); clearTimeout(introTimer); }
}, { once:true });


