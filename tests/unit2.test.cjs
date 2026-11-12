const {test}=require('node:test');
const assert=require('node:assert/strict');
const {boot,KEY}=require('./helpers.cjs');
const UKEY='wordsteps-grade8-unit2-v1';
const clone=x=>JSON.parse(JSON.stringify(x));
function scenario(name,fn,options={}){test(name,()=>{const a=boot({unit:null,...options});try{fn(a);}finally{a.close();}});}
function current(a){return a.w.UnitTwo.getState().session;}
function chooseFirst(a){a.click('[data-u2-choice]');}
function word(a){return a.w.UNIT2_DATA.words.find(w=>w.id===current(a).ids[current(a).index]);}
function correct(a){const s=current(a),w=word(a),p=s.prompts[s.index];return s.mode===1?w.he:s.mode===2?(w.clozes[p.variant].answer||w.en):w.usage[p.variant].correct;}
function answer(a,ok=true){const value=correct(a);const p=current(a).prompts[current(a).index];const i=p.choices.findIndex(c=>ok?c===value:c!==value);a.click(`[data-u2-choice="${i}"]`);}

scenario('UNIT2-BOOT: numeric newest unit is default; four distinct Sod Hamila modes only',a=>{
  assert.equal(a.w.WordUnits.activeId,'unit-2');
  assert.equal(a.$('#unit-selector').value,'unit-2');
  assert.equal(a.$('#unit1-root').hidden,true);
  assert.equal(a.$('#unit2-root').hidden,false);
  assert.equal(a.all('[data-u2-mode]').length,4);
  assert.deepEqual(a.all('[data-u2-mode]').map(b=>Number(b.dataset.u2Mode)),[0,1,2,3]);
  assert.match(a.$('#unit2-root').textContent,/לומדים בתמונה/);
  assert.match(a.$('#unit2-root').textContent,/בוחרים פירוש/);
  assert.match(a.$('#unit2-root').textContent,/משלימים משפט/);
  assert.match(a.$('#unit2-root').textContent,/באיזה משפט המילה מתאימה/);
  assert.doesNotMatch(a.$('#unit2-root').textContent,/פנדלים|Present Simple/);
  a.w.WordUnits.select('unit-1');
  assert.equal(a.w.eval('SOURCE_WORDS.length'),58);
  assert.equal(a.$('#unit2-root').hidden,true);
});

scenario('UNIT2-ISOLATION: answering and reset do not mutate Unit 1 stored bytes',a=>{
  const before=a.w.localStorage.getItem(KEY);
  a.click('[data-u2-mode="1"]');chooseFirst(a);
  assert.equal(a.w.localStorage.getItem(KEY),before);
  a.w.UnitTwo.home();
  a.click('#u2-reset');
  assert.equal(a.w.localStorage.getItem(KEY),before);
  assert.equal(a.w.eval('game.xp'),70);
},{stored:{stats:{abroad:{attempts:2,focus:true}},game:{xp:70,missions:1,correct:4,days:[],awards:[]}}});

scenario('UNIT2-LOCK: first answer is locked and exact session survives a reload',a=>{
  a.click('[data-u2-mode="2"]');
  const before=clone(current(a));
  const button=a.$('[data-u2-choice]');button.click();
  const after=clone(a.w.UnitTwo.getState());button.click();
  assert.deepEqual(clone(a.w.UnitTwo.getState()),after);
  assert.equal(a.all('[data-u2-choice]:not(:disabled)').length,0);
  const text=a.$('#unit2-root').textContent;
  const b=boot({unit:null,unit2Stored:after});
  try{
    assert.equal(b.$('#u2-resume'),null);
    assert.equal(b.$('[data-u2-choice]'),null);
    b.click('[data-u2-mode="'+after.session.mode+'"]');
    assert.deepEqual(clone(current(b)),after.session);
    assert.deepEqual(clone(current(b).ids),before.ids);
    assert.equal(b.$('#unit2-root').textContent,text);
    assert.equal(b.all('[data-u2-choice]:not(:disabled)').length,0);
    b.click('#u2-next');assert.equal(current(b).index,1);
  }finally{b.close();}
});

scenario('UNIT2-PICTURE: meanings open immediately; previous and resume preserve progress without a quiz score',a=>{
  a.click('[data-u2-mode="0"]');assert.equal(a.$('#u2-reveal'),null);assert.equal(a.$('#u2-again'),null);
  assert.ok(a.$('.u2-feedback'));assert.equal(a.$('#u2-prev').disabled,true);
  const saved=a.w.UnitTwo.getState();
  const b=boot({unit:null,unit2Stored:saved});
  try{b.click('[data-u2-mode="0"]');assert.ok(b.$('#u2-understood'));assert.equal(b.$('#u2-reveal'),null);}finally{b.close();}
  const id=current(a).ids[0];a.click('#u2-understood');
  assert.equal(a.w.UnitTwo.getState().stats[id].focus,false);
  assert.equal(current(a).correct,0);
  const stats=clone(a.w.UnitTwo.getState().stats);a.click('#u2-prev');assert.equal(current(a).index,0);
  assert.equal(a.$('#u2-prev').disabled,true);assert.deepEqual(clone(a.w.UnitTwo.getState().stats),stats);
  a.click('#u2-understood');assert.equal(current(a).index,1);assert.deepEqual(clone(a.w.UnitTwo.getState().stats),stats);
  a.w.UnitTwo.start(0,[id]);a.click('#u2-understood');
  assert.equal(a.w.UnitTwo.getState().stats[id].focus,false);
  assert.doesNotMatch(a.$('#unit2-root').textContent,/100%|0%/);
});

scenario('UNIT2-SWITCH: switching units preserves a paused Unit 2 question',a=>{
  a.click('[data-u2-mode="3"]');chooseFirst(a);
  const saved=clone(a.w.UnitTwo.getState());
  a.w.WordUnits.select('unit-1');a.mode(2);
  a.w.WordUnits.select('unit-2');
  assert.deepEqual(clone(a.w.UnitTwo.getState()),saved);
  a.click('[data-u2-mode="3"]');assert.deepEqual(clone(current(a)),saved.session);
  const b=boot({unit:null,unit2Stored:saved});
  try{assert.equal(b.w.WordUnits.activeId,'unit-2');}finally{b.close();}
});

for(const bad of ['{broken',JSON.stringify({schemaVersion:1,stats:null,session:{mode:99}}),JSON.stringify({schemaVersion:1,contentVersion:'obsolete',stats:{'__proto__':{focus:true}},session:{ids:['<img src=x onerror=alert(1)>'],index:-3,mode:1}})]){
  scenario('UNIT2-RECOVERY: malformed storage cannot inject markup or block a new round '+bad.slice(0,25),a=>{
    assert.equal(a.w.WordUnits.activeId,'unit-2');
    assert.equal(a.$('#unit2-root img[onerror]'),null);
    a.click('[data-u2-mode="1"]');assert.equal(a.all('[data-u2-choice]').length,4);
    chooseFirst(a);assert.ok(a.$('#u2-next'));
  },{unit2Stored:bad});
}

scenario('UNIT2-STORAGE: blocked storage still permits answering with a visible warning',a=>{
  a.click('[data-u2-mode="1"]');chooseFirst(a);
  assert.ok(a.$('#u2-next'));
  assert.match(a.w.document.body.textContent,/שמירה|לשמור/);
},{storageBlocked:true});

module.exports={current};

scenario('UNIT2-DATA: 14 unique terms, 20 attributed source clozes plus 36 authored and 28 pairs',a=>{
  const words=a.w.UNIT2_DATA.words;assert.equal(words.length,14);
  assert.equal(new Set(words.map(w=>w.id)).size,14);
  const ids=new Set(),source=[];let authored=0,pairs=0;
  for(const w of words){
    assert.equal(w.clozes.length,4);assert.equal(w.usage.length,2);
    assert.equal(new Set([w.he,...w.meaningDistractors]).size,4);
    assert.ok(w.alt&&w.image&&w.hint);
    for(const q of w.clozes){
      assert.ok(!ids.has(q.id));ids.add(q.id);
      assert.equal((q.text.match(/___/g)||[]).length,1);
      assert.equal(q.answer,w.en);assert.ok(q.hint&&q.translation);
      assert.equal(new Set([q.answer,...q.distractors]).size,4);
      if(q.sourceKind==='worksheet'){source.push(q);assert.ok(q.sourceFile&&q.originalText);}
      else {assert.equal(q.sourceKind,'authored');assert.ok(q.sourceNote);authored++;}
    }
    for(const q of w.usage){assert.ok(!ids.has(q.id));ids.add(q.id);assert.notEqual(q.correct,q.incorrect);assert.ok(q.hint);assert.equal(q.sourceKind,'authored');pairs++;}
  }
  assert.equal(source.length,20);assert.equal(authored,36);assert.equal(pairs,28);
  assert.deepEqual(source.map(q=>q.sourceQuestion).sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i+1));
  assert.equal(source.find(q=>q.sourceQuestion===6).answer,'huge');
  assert.equal(source.find(q=>q.sourceQuestion===13).answer,'situation');
  assert.ok(!source.find(q=>q.sourceQuestion===13).distractors.includes('area'));
  for(const term of ['lose hope','rescue team'])assert.equal(words.filter(w=>w.en===term).length,1);
});

scenario('UNIT2-COVERAGE: every image, meaning, 56 clozes and 28 usage pairs runs through the UI',a=>{
  const coverage={0:new Set(),1:new Set(),2:new Set(),3:new Set()};
  for(const mode of [0,1,2,3])for(let round=0;round<(mode===2?4:mode===3?2:1);round++){
    a.w.UnitTwo.start(mode);
    for(let i=0;i<14;i++){
      const s=current(a),w=word(a),p=s.prompts[s.index];
      assert.equal(s.ids.length,14);
      coverage[mode].add(w.id+':'+p.variant);
      if(mode===0){assert.equal(a.$('.u2-illustration').getAttribute('alt'),w.alt);assert.match(a.$('.u2-feedback').textContent,new RegExp(w.he));a.click('#u2-understood');}
      else{
        assert.equal(a.all('[data-u2-choice]').length,mode===3?2:4);
        answer(a);assert.ok(a.$('.u2-correct'));
        if(mode===2)assert.ok(a.$('.u2-feedback').textContent.includes(w.clozes[p.variant].hint));
        if(mode===3)assert.ok(a.$('.u2-feedback').textContent.includes(w.usage[p.variant].hint));
        a.click('#u2-next');
      }
    }
    if(mode){assert.match(a.$('#unit2-root').textContent,/הסבב הושלם/);assert.match(a.$('#unit2-root').textContent,/14 מתוך 14/);a.click('#u2-finish-home');}
    else{assert.equal(current(a).index,13);assert.equal(a.$('#u2-understood').disabled,true);assert.match(a.$('#u2-understood').textContent,/המילה האחרונה/);a.w.UnitTwo.home();}
  }
  assert.deepEqual(Object.values(coverage).map(x=>x.size),[14,14,56,28]);
});

scenario('UNIT2-RETRY: mistakes retry only missed words, next stage restores full roster',a=>{
  a.w.UnitTwo.start(1);const missed=current(a).ids[0];
  for(let i=0;i<14;i++){answer(a,i!==0);a.click('#u2-next');}
  assert.match(a.$('#unit2-root').textContent,/13 מתוך 14/);
  assert.equal(a.w.UnitTwo.getState().stats[missed].focus,true);
  a.click('#u2-retry');assert.deepEqual(clone(current(a).ids),[missed]);
  answer(a);a.click('#u2-next');
  assert.equal(a.w.UnitTwo.getState().stats[missed].focus,false);
  a.click('#u2-finish-home');a.click('[data-u2-mode="2"]');assert.equal(current(a).mode,2);assert.equal(current(a).ids.length,14);
});

scenario('UNIT2-ROTATION: per-word cloze cycle ignores other modes and reload',a=>{
  const id=a.w.UNIT2_DATA.words[0].id;
  const seen=[];
  for(let i=0;i<5;i++){
    a.w.UnitTwo.start(2,[id]);seen.push(current(a).prompts[0].variant);
    const count=a.w.UnitTwo.getState().variants.cloze[id];
    a.w.UnitTwo.home();a.w.UnitTwo.resume();
    assert.equal(a.w.UnitTwo.getState().variants.cloze[id],count);
    a.w.UnitTwo.start(1,[id]);answer(a);a.click('#u2-next');
    a.w.UnitTwo.start(3,[id]);answer(a);a.click('#u2-next');
  }
  assert.deepEqual(seen,[0,1,2,3,0]);
});

scenario('UNIT2-STALE: detached callbacks after switching units cannot grade',a=>{
  a.w.UnitTwo.start(1);const old=a.$('[data-u2-choice]');
  const before=clone(a.w.UnitTwo.getState());a.w.WordUnits.select('unit-1');old.click();
  assert.deepEqual(clone(a.w.UnitTwo.getState()),before);
  a.w.WordUnits.select('unit-2');a.w.UnitTwo.open(1);old.click();
  assert.deepEqual(clone(a.w.UnitTwo.getState()),before);
});

scenario('UNIT2-SUMMARY: restored completion does not emit duplicate completion analytics',a=>{
  let completions=0;a.w.WordUsage={answer(){},complete(){completions++;}};
  a.w.UnitTwo.start(1,[a.w.UNIT2_DATA.words[0].id]);answer(a);a.click('#u2-next');
  assert.equal(completions,1);a.w.UnitTwo.home();a.click('[data-u2-mode="1"]');assert.equal(completions,1);
});

scenario('UNIT2-SLOTS: four exercise tiles independently preserve exact progress and locked answers across reload',a=>{
 const slots={};for(const mode of [0,1,2,3]){a.w.UnitTwo.open(mode);if(mode===0)a.click('#u2-understood');else{answer(a);a.click('#u2-next');answer(a,false);}slots[mode]=clone(current(a));a.w.UnitTwo.home();}
 const saved=clone(a.w.UnitTwo.getState()),stats=clone(saved.stats),variants=clone(saved.variants);
 const b=boot({unit:null,unit2Stored:saved});try{for(const mode of [3,0,2,1]){b.click('[data-u2-mode="'+mode+'"]');assert.deepEqual(clone(current(b)),slots[mode]);if(mode)assert.equal(b.all('[data-u2-choice]:not(:disabled)').length,0);b.w.UnitTwo.home();}assert.deepEqual(clone(b.w.UnitTwo.getState().stats),stats);assert.deepEqual(clone(b.w.UnitTwo.getState().variants),variants);assert.equal(b.$('#u2-resume'),null);}finally{b.close();}
});
scenario('UNIT2-RESULT-SLOT: completed quiz returns to results until explicit new round',a=>{
 a.w.UnitTwo.open(1);for(let i=0;i<14;i++){answer(a);a.click('#u2-next');}
 const finished=clone(current(a)),stats=clone(a.w.UnitTwo.getState().stats);assert.ok(a.$('#u2-new-round'));a.w.UnitTwo.home();a.click('[data-u2-mode="1"]');assert.deepEqual(clone(current(a)),finished);assert.match(a.$('#unit2-root').textContent,/14 מתוך 14/);
 const b=boot({unit:null,unit2Stored:a.w.UnitTwo.getState()});try{b.click('[data-u2-mode="1"]');assert.deepEqual(clone(current(b)),finished);b.click('#u2-new-round');assert.equal(current(b).index,0);assert.equal(current(b).completed,false);assert.deepEqual(clone(b.w.UnitTwo.getState().stats),stats);}finally{b.close();}
});
scenario('UNIT2-PHOTO-END: last picture stays visible and previous remains usable after completion and reload',a=>{
 a.w.UnitTwo.open(0);for(let i=0;i<14;i++)a.click('#u2-understood');const saved=clone(a.w.UnitTwo.getState());assert.equal(current(a).index,13);assert.equal(a.$('#u2-understood').disabled,true);assert.equal(a.$('#u2-prev').disabled,false);assert.ok(a.$('.u2-illustration'));assert.equal(a.$('#u2-new-round'),null);
 const b=boot({unit:null,unit2Stored:saved});try{b.click('[data-u2-mode="0"]');assert.equal(current(b).index,13);assert.equal(b.$('#u2-understood').disabled,true);const stats=clone(b.w.UnitTwo.getState().stats);b.click('#u2-prev');assert.equal(current(b).index,12);b.click('#u2-understood');assert.equal(current(b).index,13);assert.deepEqual(clone(b.w.UnitTwo.getState().stats),stats);}finally{b.close();}
});
scenario('UNIT2-MIGRATION: legacy schema1 round and counts migrate into its own main slot',a=>{
 a.w.UnitTwo.start(2);answer(a,false);const old=clone(a.w.UnitTwo.getState());old.schemaVersion=1;delete old.sessions;const expected=clone(old.session);
 const b=boot({unit:null,unit2Stored:old});try{b.click('[data-u2-mode="2"]');assert.deepEqual(clone(current(b)),expected);assert.deepEqual(clone(b.w.UnitTwo.getState().stats),old.stats);assert.equal(b.w.UnitTwo.getState().schemaVersion,2);assert.deepEqual(clone(b.w.UnitTwo.getState().sessions['mode:2']),expected);}finally{b.close();}
});
scenario('UNIT2-CORRUPT-SLOT: malformed exercise slot does not erase other exercise progress or stats',a=>{
 a.w.UnitTwo.open(1);answer(a);a.w.UnitTwo.open(2);answer(a,false);const saved=clone(a.w.UnitTwo.getState()),good=clone(saved.sessions['mode:1']);saved.sessions['mode:2'].index=-1;saved.session=null;
 const b=boot({unit:null,unit2Stored:saved});try{b.click('[data-u2-mode="1"]');assert.deepEqual(clone(current(b)),good);assert.deepEqual(clone(b.w.UnitTwo.getState().stats),saved.stats);b.w.UnitTwo.home();b.click('[data-u2-mode="2"]');assert.equal(current(b).index,0);assert.equal(current(b).answer,null);}finally{b.close();}
});
scenario('UNIT2-FOCUS-SLOTS: focus practice and a single picture never overwrite main exercise slots',a=>{
 a.w.UnitTwo.open(1);answer(a,false);const main=clone(current(a)),id=main.ids[0];a.w.UnitTwo.home();a.click('#u2-start-focus');assert.deepEqual(clone(current(a).ids),[id]);answer(a,false);a.click('#u2-next');a.w.UnitTwo.home();a.click('[data-u2-word="'+id+'"]');assert.equal(current(a).mode,0);assert.deepEqual(clone(current(a).ids),[id]);a.click('#u2-understood');a.w.UnitTwo.home();a.click('[data-u2-mode="1"]');assert.deepEqual(clone(current(a)),main);
});

scenario('UNIT2-MIGRATION-PHOTO: old completed pictures reopen their last card without a quiz result',a=>{
 a.w.UnitTwo.start(0);for(let i=0;i<14;i++)a.click('#u2-understood');const saved=clone(a.w.UnitTwo.getState());saved.schemaVersion=1;delete saved.sessions;saved.session.index=14;saved.session.completed=true;for(const p of saved.session.prompts)delete p.learned;
 const b=boot({unit:null,unit2Stored:saved});try{b.click('[data-u2-mode="0"]');assert.equal(current(b).index,13);assert.equal(b.$('#u2-understood').disabled,true);assert.equal(b.$('#u2-finish-home'),null);assert.ok(b.$('.u2-illustration'));const stats=clone(b.w.UnitTwo.getState().stats);b.click('#u2-prev');b.click('#u2-understood');assert.deepEqual(clone(b.w.UnitTwo.getState().stats),stats);}finally{b.close();}
});

scenario('UNIT2-CORRUPT-COMPLETED-PHOTO: missing prompts cannot erase a following valid slot or word statistics',a=>{
 a.w.UnitTwo.open(1);answer(a,false);const saved=clone(a.w.UnitTwo.getState()),good=clone(saved.sessions['mode:1']),stats=clone(saved.stats);
 saved.sessions={'mode:0':{mode:0,ids:a.w.UNIT2_DATA.words.map(w=>w.id),index:14,prompts:[],answer:null,revealed:false,correct:0,missed:[],completed:true},'mode:1':good};saved.session=null;
 const b=boot({unit:null,unit2Stored:saved});try{assert.equal(b.w.UnitTwo.getState().sessions['mode:0'],undefined);b.click('[data-u2-mode="1"]');assert.deepEqual(clone(current(b)),good);assert.deepEqual(clone(b.w.UnitTwo.getState().stats),stats);const stored=JSON.parse(b.w.localStorage.getItem(UKEY));assert.deepEqual(stored.sessions['mode:1'],good);assert.deepEqual(stored.stats,stats);}finally{b.close();}
});
