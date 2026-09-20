/* insights.js — derived statistics: life signals, discovered patterns, what changed.
   Every number here is counted from DATA at runtime; nothing is hardcoded. */
import { DATA, CHAPTERS, TYPE_NOUN, TYPE_LABEL } from './data.js';
import { allTags, byTag, chapterOf, monthsOf, typesOf, listMonths, monthGroups,
         monthKey, monthName, monthFull, tagsIn, uniq, esc } from './utils.js';

/* qualitative signals — derived by matching the dataset, not hardcoded totals */
export var SIGNALS = [
  { key:'learning', label:'Learning',       tag:'dsa',    test:function(d){ return ['dsa','java','spring'].indexOf(d.tag)>-1 || /dsa|roadmap|revision|practice|tutorial|problem|notebook|notes|study|library/i.test(d.title+' '+(d.meta||'')); } },
  { key:'participation', label:'Participation', tag:'events', test:function(d){ return ['events','volunteer'].indexOf(d.tag)>-1 || /event|hackathon|volunteer|particip/i.test(d.title+' '+(d.meta||'')); } },
  { key:'development', label:'Development',  tag:'spring', test:function(d){ return ['java','spring'].indexOf(d.tag)>-1 || /spring boot|rest api|development|coding|core java/i.test(d.title+' '+(d.meta||'')); } },
  { key:'college', label:'College & exams',  tag:null,     test:function(d){ return /college|semester|exam|class|campus|assignment/i.test(d.title+' '+(d.meta||'')+' '+(d.detail||'')); } },
  { key:'downtime', label:'Downtime',        tag:'movies', test:function(d){ return d.type==='movie' || /bgmi|thriller|movie night|playlist/i.test(d.title+' '+(d.meta||'')); } }
];
export function signalData(){
  var out = SIGNALS.map(function(sg){
    var items = DATA.filter(sg.test);
    return { key:sg.key, label:sg.label, tag:sg.tag, count:items.length, items:items, months:monthsOf(items) };
  }).filter(function(x){ return x.count>0; });
  out.sort(function(a,b){ return b.count-a.count; });
  return out;
}

/* ---- pattern / insight generation (all evidence read from DATA) ---- */
export function buildInsights(){
  var out = [], tags = allTags(), mAll = listMonths();

  /* 1. longest-running thread */
  var longest = null;
  tags.forEach(function(t){
    var items = byTag(t.tag), ms = monthsOf(items);
    if(!longest || ms.length>longest.ms.length || (ms.length===longest.ms.length && items.length>longest.items.length))
      longest = { t:t, items:items, ms:ms };
  });
  if(longest){
    out.push({
      id:'ins-longest', stamp:'PATTERN FOUND',
      title:'Learning became a continuous thread',
      text:longest.t.label+' appears in '+longest.items.length+' separate receipts, spread over '+longest.ms.length+
           ' of the '+mAll.length+' months on record ('+monthFull(longest.ms[0])+' → '+monthFull(longest.ms[longest.ms.length-1])+
           '). It never takes over a chapter — it keeps returning inside them.',
      chips:[ longest.items.length+' '+longest.t.label+' moments', longest.ms.length+' months', typesOf(longest.items).length+' receipt types' ],
      tag:longest.t.tag, ids:longest.items.map(function(d){return d.id;})
    });
  }

  /* 2. one thread, many receipt types */
  var cross = null;
  tags.forEach(function(t){
    var items = byTag(t.tag), ty = typesOf(items);
    if(!cross || ty.length>cross.ty.length) cross = { t:t, items:items, ty:ty };
  });
  if(cross && cross.ty.length>=3){
    out.push({
      id:'ins-cross', stamp:'CONNECTION',
      title:'The same thread shows up in different formats',
      text:'The '+cross.t.label+' thread is not one kind of record. The same habit leaves behind '+
           cross.ty.map(function(x){ return TYPE_NOUN[x]; }).join(', ')+
           '. Filed separately they look unrelated; filed together they are one story.',
      chips:cross.ty.map(function(x){ return TYPE_LABEL[x]+' · '+cross.items.filter(function(d){return d.type===x;}).length; }),
      tag:cross.t.tag, ids:cross.items.map(function(d){return d.id;})
    });
  }

  /* 3. emerging thread (first appearance after the first month) */
  var emerging = null;
  tags.forEach(function(t){
    var ms = monthsOf(byTag(t.tag));
    if(ms[0] <= mAll[0]) return;
    var score = ms.length * (mAll.indexOf(ms[0])+1);   // starts late AND keeps going
    if(!emerging || score>emerging.score) emerging = { t:t, ms:ms, items:byTag(t.tag), score:score };
  });
  if(emerging){
    var lastsToEnd = emerging.ms[emerging.ms.length-1]===mAll[mAll.length-1];
    out.push({
      id:'ins-emerging', stamp:'NEW SIGNAL',
      title:emerging.t.label+' starts mid-story',
      text:'No receipt mentions '+emerging.t.label+' before '+monthFull(emerging.ms[0])+'. From that month it appears in '+
           emerging.ms.length+' of the remaining '+(mAll.length-mAll.indexOf(emerging.ms[0]))+' months'+
           (lastsToEnd ? ', and it is still there in the last month on record' : '')+
           ' — a thread that began during the gap between semesters, not at the start.',
      chips:[ 'first seen '+monthFull(emerging.ms[0]), emerging.items.length+' moments',
              typesOf(emerging.items).length+' receipt types' ],
      tag:emerging.t.tag, ids:emerging.items.map(function(d){return d.id;})
    });
  }

  /* 4. the turning month: where the most new threads first appear */
  var firstSeen = {};
  DATA.slice().sort(function(a,b){ return a.date<b.date?-1:1; }).forEach(function(d){
    if(d.tag && !(d.tag in firstSeen)) firstSeen[d.tag] = monthKey(d.date);
  });
  var mg2 = monthGroups();
  var newPerMonth = {};
  Object.keys(firstSeen).forEach(function(tg){ (newPerMonth[firstSeen[tg]] = newPerMonth[firstSeen[tg]]||[]).push(tg); });
  var turn = Object.keys(newPerMonth).filter(function(mk){ return mk>mAll[0]; })
    .sort(function(a,b){ return newPerMonth[b].length-newPerMonth[a].length; })[0];
  if(turn && newPerMonth[turn].length>=2){
    var turnItems = monthGroups()[turn];
    var labels = newPerMonth[turn].map(function(tg){ return byTag(tg)[0].tagLabel; });
    var isCollege = function(d){ return /college|semester|exam|class|campus|assignment/i.test(d.title+' '+(d.meta||'')+' '+(d.detail||'')); };
    var collegeFree = mAll.filter(function(mk){ return !mg2[mk].some(isCollege); });
    var extra = (collegeFree.length===1 && collegeFree[0]===turn)
      ? ' It is also the only month in the whole record with no college receipt at all.' : '';
    out.push({
      id:'ins-turn', stamp:'TURNING POINT',
      title:monthFull(turn)+' is where the story changes direction',
      text:labels.length+' threads ('+labels.join(', ')+') appear for the first time inside '+monthFull(turn)+
           ' — more first appearances than any other month.'+extra,
      chips:labels.map(function(l){ return 'new: '+l; }).concat([ turnItems.length+' receipts in '+monthName(turn) ]),
      tag:null, ids:turnItems.map(function(d){return d.id;})
    });
  }

  /* 5. convergence: month holding the most distinct threads at once */
  var conv = null, mg = monthGroups();
  mAll.forEach(function(mk){
    var tg = tagsIn(mg[mk]);
    var tagged = mg[mk].filter(function(d){ return !!d.tag; }).length;
    if(!conv || tg.length>conv.tg.length || (tg.length===conv.tg.length && tagged>conv.tagged))
      conv = { mk:mk, tg:tg, items:mg[mk], tagged:tagged };
  });
  if(conv && conv.tg.length>=3){
    var others = mAll.filter(function(mk){ return mk!==conv.mk; });
    var avg = others.reduce(function(a,mk){ return a+tagsIn(mg[mk]).length; },0)/Math.max(1,others.length);
    out.push({
      id:'ins-converge', stamp:'CONVERGENCE',
      title:monthFull(conv.mk)+' runs every thread at once',
      text:monthFull(conv.mk)+' carries '+conv.items.length+' receipts across '+conv.tg.length+
           ' different threads ('+conv.tg.map(function(tg){ return byTag(tg)[0].tagLabel; }).join(', ')+
           '). Every other month averages '+(Math.round(avg*10)/10)+
           '. Nothing was dropped along the way — by the end, all of it is running at the same time.',
      chips:conv.tg.map(function(tg){ return byTag(tg)[0].tagLabel; }).concat([conv.items.length+' receipts']),
      tag:null, ids:conv.items.map(function(d){return d.id;})
    });
  }

  /* 6. persistence: a thread that returns in most chapters */
  var persist = null;
  tags.forEach(function(t){
    var chs = uniq(byTag(t.tag).map(function(d){ return d.chapter; }));
    if(!persist || chs.length>persist.chs.length) persist = { t:t, chs:chs, items:byTag(t.tag) };
  });
  if(persist && persist.chs.length>=3){
    out.push({
      id:'ins-persist', stamp:'RECURRENCE',
      title:persist.t.label+' survives every phase',
      text:'The '+persist.t.label+' thread reappears in '+persist.chs.length+' of the '+CHAPTERS.length+
           ' chapters — through exams, through a holiday, and through a new semester. The notes attached to it record attempts, not results.',
      chips:persist.chs.map(function(c){ return 'Ch '+c+' · '+chapterOf(c).title; }),
      tag:persist.t.tag, ids:persist.items.map(function(d){return d.id;})
    });
  }
  return out;
}

/* ---- what changed: each month compared with the month immediately before it ---- */
export function monthShifts(){
  var mg = monthGroups(), ms = listMonths(), out = [];
  var firstMonth = {};
  DATA.slice().sort(function(a,b){ return a.date<b.date?-1:1; }).forEach(function(d){
    if(d.tag && !(d.tag in firstMonth)) firstMonth[d.tag] = monthKey(d.date);
  });
  var label = function(t){ return (byTag(t)[0]||{}).tagLabel || t; };
  var join = function(a){ return a.length<2 ? a.join('') : a.slice(0,-1).join(', ')+' and '+a[a.length-1]; };

  ms.forEach(function(mk,i){
    var items = mg[mk];
    var now  = tagsIn(items);
    var prev = i ? tagsIn(mg[ms[i-1]]) : [];
    var fresh      = now.filter(function(t){ return prev.indexOf(t)===-1; });
    var continuing = now.filter(function(t){ return prev.indexOf(t)>-1; });
    var quiet      = prev.filter(function(t){ return now.indexOf(t)===-1; });
    var parts = [], txt;

    if(i===0){
      txt = 'The record opens with <b>'+items.length+' receipts</b> in '+typesOf(items).length+' formats'+
            (now.length ? ', and one thread already running: <b>'+esc(join(now.map(label)))+'</b>.' : '.');
    } else {
      var brandNew = fresh.filter(function(t){ return firstMonth[t]===mk; });
      var returning = fresh.filter(function(t){ return firstMonth[t]!==mk; });
      if(brandNew.length)  parts.push('<b>new: '+esc(join(brandNew.map(label)))+'</b>');
      if(returning.length) parts.push('<b>returns: '+esc(join(returning.map(label)))+'</b>');
      if(continuing.length) parts.push('continuing: '+esc(join(continuing.map(label))));
      if(quiet.length)      parts.push('quiet: '+esc(join(quiet.map(label))));
      txt = parts.length ? parts.join(' · ')
                         : 'no tagged threads this month — '+items.length+' receipts, all college routine';
      txt += '.';
    }
    out.push({
      mk:mk, label:monthName(mk), month:monthFull(mk), count:items.length, chapter:items[0].chapter,
      fresh:fresh, continuing:continuing, quiet:quiet, tags:now, text:txt,
      meta:items.length+' receipts · '+typesOf(items).length+' receipt types · Chapter '+
           items[0].chapter+' — '+chapterOf(items[0].chapter).title
    });
  });
  return out;
}
