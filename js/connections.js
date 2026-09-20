/* connections.js — relationship scoring and the Connect-the-dots chain.
   A chain is walked step by step: each next receipt is chosen against the CURRENT
   receipt, never against the original seed, so every connector shown is true of the
   pair it sits between. */
import { DATA, TYPE_LABEL } from './data.js';
import { byId, byTag, dayNum, fmtDate, esc, iconSvg, typesOf, uniq } from './utils.js';

var STOP = {'the':1,'and':1,'for':1,'with':1,'this':1,'that':1,'session':1,'during':1,'another':1,
            'between':1,'still':1,'more':1,'into':1,'some':1,'time':1,'starts':1,'begins':1,'again':1};

export function words(d){
  return (d.title+' '+(d.meta||'')).toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/)
    .filter(function(w){ return w.length>3 && !STOP[w]; });
}
export function sharedWords(a,b){
  var wb = words(b);
  return uniq(words(a).filter(function(w){ return wb.indexOf(w)>-1; }));
}

/* Relationship priority: same thread > shared topic > same chapter > close date > new format */
export function relScore(a,b){
  var sc = 0;
  if(a.tag && b.tag && a.tag===b.tag) sc += 60;
  sc += Math.min(sharedWords(a,b).length,2) * 20;
  if(a.chapter===b.chapter) sc += 15;
  var gap = Math.abs(dayNum(a.date)-dayNum(b.date));
  if(gap<=10) sc += 16; else if(gap<=21) sc += 10; else if(gap<=45) sc += 2; else if(gap<=75) sc -= 14; else sc -= 22;
  if(b.date > a.date) sc += 10;          // a chain reads better moving forward in time
  if(a.type!==b.type) sc += 8;
  return sc;
}

/* Walk: seed → best neighbour of seed → best neighbour of that one → … */
export function buildChain(seedId, max){
  max = max || 5;
  var seed = byId(seedId);
  if(!seed) return [];
  var chain = [seed], used = {};
  used[seed.id] = 1;
  while(chain.length < max){
    var current = chain[chain.length-1], best = null, bestScore = 0;
    DATA.forEach(function(d){
      if(used[d.id]) return;
      var sc = relScore(current,d);
      if(sc > bestScore){ bestScore = sc; best = d; }
    });
    if(!best || bestScore < 25) break;   // weak link — end the chain rather than fake one
    used[best.id] = 1;
    chain.push(best);
  }
  return chain;
}

/* The reason printed on a connector is recomputed from the pair it joins. */
export function linkReason(a,b){
  var gap = Math.round(Math.abs(dayNum(a.date)-dayNum(b.date)));
  var unit = gap===1 ? ' day' : ' days';
  var when = gap===0 ? 'same day' : (a.date < b.date ? gap+unit+' later' : gap+unit+' earlier');
  if(a.tag && b.tag && a.tag===b.tag) return 'same thread · '+a.tagLabel+' · '+when;
  var shared = sharedWords(a,b);
  if(shared.length) return 'same subject · '+shared[0]+' · '+when;
  if(a.chapter===b.chapter) return 'same chapter · '+when;
  return when;
}

export function chainHTML(seedId, focusId){
  var chain = buildChain(seedId);
  if(chain.length<2) return '<p class="result-count">No strong links for this one.</p>';
  var html = '<div class="chain">';
  chain.forEach(function(d,i){
    if(i) html += '<div class="chain-link">'+esc(linkReason(chain[i-1],d))+'</div>';
    html += '<button class="chain-node '+(d.id===focusId?'here':'')+'" data-action="chain-node" data-id="'+esc(d.id)+'" '+
      'aria-label="Open '+esc(d.title)+', '+esc(fmtDate(d.date))+'">'+iconSvg(d.type)+
      '<span class="cn-body"><span class="cn-title">'+esc(d.title)+(d.id===focusId?' <span class="cn-here">you are here</span>':'')+'</span>'+
      '<span class="cn-meta">'+esc(TYPE_LABEL[d.type])+' · '+esc(fmtDate(d.date))+' · Chapter '+d.chapter+'</span></span></button>';
  });
  html += '</div>';
  return html;
}

/* ---- surprise me ---- */
export function surpriseCandidates(){
  return DATA.filter(function(d){ return buildChain(d.id).length>=4; });
}
export function surpriseFor(d){
  var chain = buildChain(d.id);
  var threads = uniq(chain.map(function(x){ return x.tag; }).filter(Boolean));
  var types = typesOf(chain), chs = uniq(chain.map(function(x){ return x.chapter; }));
  var why;
  if(threads.length>=2) why = 'this moment sits where the '+threads.map(function(t){ return byTag(t)[0].tagLabel; }).join(' and ')+' threads meet.';
  else if(chs.length>=2) why = 'its links reach across '+chs.length+' different chapters.';
  else why = 'it connects '+types.length+' different kinds of receipt inside one stretch of days.';
  return 'You landed on <b>'+esc(d.title)+'</b> ('+esc(fmtDate(d.date))+') — '+why+
         ' The chain below starts from it.';
}
