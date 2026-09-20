/* story.js — the chapter narrative view. */
import { DATA, CHAPTERS } from './data.js';
import { state } from './state.js';
import { esc, byChapter, allTags, listMonths, tagFirstChapter } from './utils.js';
import { cardHTML } from './ui.js';

/* ============================= RENDER: STORY ============================= */
export function renderStory(){
  var idx = state.chapter;
  var ch = CHAPTERS[idx];
  var items = byChapter(ch.id);

  var threadsHere = {};
  items.forEach(function(d){ if(d.tag && !threadsHere[d.tag]) threadsHere[d.tag]=d.tagLabel; });
  var threadChips = Object.keys(threadsHere).map(function(tag){
    var isNew = tagFirstChapter[tag]===ch.id;
    return '<span class="thread-tag">'+(isNew?'new thread — ':'continuing — ')+'<b>'+esc(threadsHere[tag])+'</b></span>';
  }).join('');

  var html = '';
  if(idx===0 && !state.storyStarted){
    var mCount = listMonths().length;
    html += '<section class="hero" aria-labelledby="heroTitle">';
    html += '<p class="kicker">Reconstructed archive · 2026</p>';
    html += '<h2 id="heroTitle">Your digital life,<br>reconstructed.</h2>';
    html += '<div class="hero-figs"><div><b>'+DATA.length+'</b>moments</div><div><b>'+CHAPTERS.length+'</b>chapters</div><div><b>'+mCount+'</b>months</div><div><b>'+allTags().length+'</b>recurring threads</div></div>';
    html += '<p class="lede">A search, a notebook, a playlist, a library, a photo. Apart they are noise. Read in order, they show one habit forming — and five more competing with it.</p>';
    html += '<div class="cta-row"><button class="btn btn-primary" data-action="start-story">Start the story →</button>'+
            '<button class="btn" data-action="set-tab" data-tab="insights">✦ Discover patterns</button></div>';
    html += '</section>';
  }
  html += '<div class="chapter-nav-top"><span class="kicker">Chapter '+ch.id+' of '+CHAPTERS.length+'</span>'+
          '<div class="chapter-dots">'+CHAPTERS.map(function(c,i){ return '<button class="'+(i===idx?'on':'')+'" data-action="chapter-dot" data-index="'+i+'" aria-label="Chapter '+c.id+'"></button>'; }).join('')+'</div></div>';
  html += '<div class="chapter-head">';
  html += '<h2>'+esc(ch.title)+'</h2>';
  html += '<p class="chapter-range">'+esc(ch.range)+' · 2026</p>';
  html += '<p class="chapter-blurb">'+esc(ch.blurb)+'</p>';
  if(threadChips) html += '<div class="threads-row">'+threadChips+'</div>';
  html += '</div>';

  html += '<div class="spine">'+items.map(function(d,i){
    return '<div class="spine-item '+(i%2?'right':'left')+'" style="--dot:var(--t-'+d.type+')">'+cardHTML(d)+'</div>';
  }).join('')+'</div>';

  html += '<div class="chapter-foot">'+
    '<button data-action="chapter-prev" '+(idx===0?'disabled':'')+'>← Previous chapter</button>'+
    '<span style="font-size:11.5px;color:var(--ink-faint)">'+items.length+' moments in this chapter</span>'+
    '<button data-action="chapter-next" '+(idx===CHAPTERS.length-1?'disabled':'')+'>Next chapter →</button>'+
  '</div>';

  return html;
}
