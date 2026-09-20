/* data.js — the dataset and its static vocabulary. No rendering logic lives here. */
/* ============================= DATA ============================= */
export var CHAPTERS = [
  { id:1, title:'A Semester Begins', range:'Jan 1 – Jan 31', band:'var(--t-note)', blurb:"January starts with the fourth semester. College work is back, but so is a new goal: taking DSA seriously alongside everything else." },
  { id:2, title:'Learning to Show Up', range:'Feb 1 – Mar 31', band:'var(--t-search)', blurb:"DSA becomes part of the routine. College keeps moving, and online and offline events start filling the calendar. There are no wins yet — just another attempt, and then another." },
  { id:3, title:'The Exam Stretch', range:'Apr 1 – May 31', band:'var(--t-place)', blurb:"The semester gets heavier. College work and exams take priority, while the habit of learning and participating doesn't disappear. The fourth semester finally ends in May." },
  { id:4, title:'A Month to Reset', range:'Jun 1 – Jun 30', band:'var(--t-movie)', blurb:"One month away from college. Core Java gets a revision, Spring Boot begins, suspense and thriller movies fill some evenings, and BGMI makes its way into the downtime." },
  { id:5, title:'Everything Starts Again', range:'Jul 1 – Jul 31', band:'var(--t-event)', blurb:"The next semester begins. DSA and development continue, while college brings back assignments, classes and the pressure to keep up with everything." },
  { id:6, title:'Finding the Balance', range:'Aug 1 – Aug 31', band:'var(--t-place)', blurb:"By August, the challenge isn't choosing one thing. It's managing DSA, development, event participation, volunteering and college studies at the same time." }
];

export var DATA = [
  r('r01','event','2026-01-01','4th semester begins','B.Tech CSE · new semester',null,1),
  r('r02','note','2026-01-04','Starting DSA seriously','',"College has started again. This semester, DSA has to happen alongside college work.",1),
  r('r03','search','2026-01-07','DSA roadmap for beginners','',null,1),
  r('r04','purchase','2026-01-12','DSA notebook','₹120 · notes and problem solving',null,1,'dsa','DSA'),
  r('r05','music','2026-01-18','Study playlist','Played while solving problems',null,1),
  r('r06','place','2026-01-24','College library','DSA + semester work',null,1),
  r('r07','note','2026-01-30','Trying to make DSA a habit','',"Not every day goes perfectly. The important part is coming back to it.",1,'dsa','DSA'),

  r('r08','event','2026-02-06','Online coding event','Participated · learning by doing',null,2),
  r('r09','search','2026-02-10','how to solve array problems','DSA practice',null,2,'dsa','DSA'),
  r('r10','event','2026-02-18','Online hackathon','Participated · no win this time',null,2,'events','Events'),
  r('r11','place','2026-02-23','College event','Offline participation',null,2,'events','Events'),
  r('r12','note','2026-03-02','Another event, another attempt','',"Winning would be nice. But stopping after not winning would make every previous attempt pointless.",2,'events','Events'),
  r('r13','music','2026-03-08','Late-night problem solving','DSA practice session',null,2,'dsa','DSA'),
  r('r14','event','2026-03-15','Offline technical event','Participated · experience gained',null,2,'events','Events'),
  r('r15','search','2026-03-22','binary tree questions','DSA practice',null,2,'dsa','DSA'),
  r('r16','note','2026-03-30','Still no win','',"No trophy yet. Still participating.",2,'events','Events'),

  r('r17','place','2026-04-05','College classroom','Semester work',null,3),
  r('r18','search','2026-04-12','DSA revision before exams','',null,3,'dsa','DSA'),
  r('r19','note','2026-04-20','Exam preparation mode','',"College studies need attention now. DSA continues, but exams come first.",3),
  r('r20','event','2026-04-26','Online event participation','Participated between college work',null,3,'events','Events'),
  r('r21','place','2026-05-05','Exam hall','4th semester exams',null,3),
  r('r22','note','2026-05-15','Fourth semester is almost over','',"A semester of college work, DSA, events and trying to keep everything moving.",3),
  r('r23','event','2026-05-25','4th semester ends','Exams completed',null,3),
  r('r24','note','2026-05-31','Holiday starts','',"One month without regular college. Time to reset and learn.",3),

  r('r25','search','2026-06-02','Core Java revision','OOP · Collections · Exceptions',null,4,'java','Core Java'),
  r('r26','note','2026-06-05','Revisiting Core Java','',"Before going deeper into Spring Boot, the Java basics need to feel solid again.",4,'java','Core Java'),
  r('r27','search','2026-06-10','Spring Boot beginner tutorial','',null,4,'spring','Spring Boot'),
  r('r28','place','2026-06-14','Study desk','Core Java + Spring Boot',null,4),
  r('r29','movie','2026-06-17','Suspense thriller night','Watched a mystery thriller',null,4,'movies','Suspense / Thriller'),
  r('r30','movie','2026-06-21','Another thriller','Movie night during the break',null,4,'movies','Suspense / Thriller'),
  r('r31','event','2026-06-23','BGMI session','Played with friends',null,4),
  r('r32','search','2026-06-27','Spring Boot REST API','Learning backend development',null,4,'spring','Spring Boot'),

  r('r33','event','2026-07-01','5th semester begins','College is back',null,5),
  r('r34','note','2026-07-03','Back to the full routine','',"DSA, development and college study now have to fit around the same schedule.",5),
  r('r35','search','2026-07-08','Spring Boot REST API practice','Development session',null,5,'spring','Spring Boot'),
  r('r36','event','2026-07-14','Online technical event','Participated',null,5,'events','Events'),
  r('r37','place','2026-07-18','College campus','Classes + assignments',null,5),
  r('r38','search','2026-07-22','DSA linked list problems','Practice session',null,5,'dsa','DSA'),
  r('r39','event','2026-07-28','College volunteering','Helped with an event',null,5,'volunteer','Volunteering'),
  r('r40','note','2026-07-31','Nothing gets dropped','',"The list is getting longer: DSA, development, events, volunteering and college.",5),

  r('r41','search','2026-08-03','DSA practice problems','Daily practice',null,6,'dsa','DSA'),
  r('r42','search','2026-08-07','Spring Boot project ideas','Development learning',null,6,'spring','Spring Boot'),
  r('r43','event','2026-08-10','Online event participation','Another opportunity to learn',null,6,'events','Events'),
  r('r44','event','2026-08-14','College volunteering','Helping with college activities',null,6,'volunteer','Volunteering'),
  r('r45','place','2026-08-18','College library','Study + DSA + development',null,6),
  r('r46','note','2026-08-21','Learning to manage everything','',"There is no single priority anymore. The challenge is making progress in all of them without letting college studies slip.",6),
  r('r47','music','2026-08-24','Late-night coding playlist','Development session',null,6,'spring','Spring Boot'),
  r('r48','event','2026-08-27','Technical event participation','Participated · still showing up',null,6,'events','Events'),
  r('r49','note','2026-08-31','Eight months in','',"No single moment defines these eight months. It is DSA, development, college, events, volunteering, exams, a month of learning, and the decision to keep going.",6),
  r('r50','photo','2026-01-28','Semester notes snapshot','4th semester · DSA notes',null,1,'dsa','DSA'),
  r('r51','message','2026-02-12','Event reminder','Technical event details and timing',null,2,'events','Events'),
  r('r52','photo','2026-06-14','Spring Boot notes snapshot','Learning setup during the break',null,4,'spring','Spring Boot'),
  r('r53','message','2026-07-29','Volunteering coordination','College activity planning',null,5,'volunteer','Volunteering')
];

export function r(id,type,date,title,meta,detail,chapter,tag,tagLabel){
  return {id:id,type:type,date:date,title:title,meta:meta,detail:detail,chapter:chapter,tag:tag||null,tagLabel:tagLabel||null};
}

export var TYPES = ['music','movie','place','purchase','photo','message','search','event','note'];
export var TYPE_NOUN = { music:'a played track', movie:'a film watched', place:'a place visited', purchase:'a purchase', photo:'a photo', message:'a message', search:'a search', event:'an event', note:'a written note' };
export var TYPE_LABEL = { music:'Music', movie:'Watched', place:'Place', purchase:'Purchase', photo:'Photo', message:'Message', search:'Searched', event:'Event', note:'Note' };
export var TYPE_ICON = {
  music:'<circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M9 18V6l12-2v10"/>',
  movie:'<circle cx="12" cy="12" r="9"/><path d="M10 9l6 3-6 3z"/>',
  place:'<path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.3"/>',
  purchase:'<path d="M6 3h9l3 3v15l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  photo:'<rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="10" r="1.5"/><path d="M3 16l5-4 4 3 4-5 5 6"/>',
  message:'<path d="M4 5h16v11H8l-4 4V5z"/>',
  search:'<circle cx="10.3" cy="10.3" r="6.3"/><path d="M20 20l-5-5"/>',
  event:'<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M4 10h16M8 3v4M16 3v4"/><path d="M9 14h3v3H9z"/>',
  note:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>'
};
