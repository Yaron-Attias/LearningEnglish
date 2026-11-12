const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {boot,KEY}=require('./helpers.cjs');
const clone=x=>JSON.parse(JSON.stringify(x));
function scenario(name,fn,options={}){test(name,()=>{const a=boot(options);try{fn(a);}finally{a.close();}});}

scenario('PICTURE-AUDIO: all 14 pictures auto-speak once, rerender stays quiet and replay is on demand',a=>{
 a.w.WordUnits.select('unit-2');assert.equal(a.$('#u2-start-spelling'),null);assert.equal(a.all('[data-u2-mode]').length,4);
 a.w.UnitTwo.start(0);const ids=[...a.w.UnitTwo.getState().session.ids];
 for(let i=0;i<14;i++){
  const word=a.w.UNIT2_DATA.words.find(w=>w.id===ids[i]);assert.equal(a.spoken.length,i+1);assert.equal(a.spoken[i].text,word.en);
  assert.match(a.spoken[i].lang,/^en/);assert.equal(a.spoken[i].rate,0.85);
  assert.ok(a.$('#u2-speak').compareDocumentPosition(a.$('.u2-illustration'))&a.w.Node.DOCUMENT_POSITION_FOLLOWING);
  assert.ok(a.$('.u2-feedback'));assert.equal(a.$('#u2-reveal'),null);a.w.UnitTwo.resume();assert.equal(a.spoken.length,i+1);a.click('#u2-understood');
 }
 assert.equal(a.$('#u2-understood').disabled,true);assert.match(a.$('#u2-understood').textContent,/המילה האחרונה/);assert.doesNotMatch(a.$('#unit2-root').textContent,/אימון איות|אחוז/);
 a.w.UnitTwo.home();a.w.UnitTwo.start(0,[ids[0]]);const before=a.spoken.length;a.click('#u2-speak');assert.equal(a.spoken.length,before+1);
 a.w.UnitTwo.resume();assert.equal(a.spoken.length,before+1);
});

scenario('PICTURE-AUDIO: missing speech and browser rejection keep picture learning usable',a=>{
 a.w.WordUnits.select('unit-2');a.w.UnitTwo.start(0);assert.match(a.$('#u2-speech-status').textContent,/אינה זמינה/);
 a.click('#u2-speak');assert.ok(a.$('.u2-feedback'));assert.ok(a.$('#u2-understood'));
},{speech:false});

scenario('PICTURE-AUDIO: English voice preference and obsolete delayed events cannot play in another unit',a=>{
 a.w.WordUnits.select('unit-2');const synth=a.w.speechSynthesis;
 const us={lang:'en-US'},gb={lang:'en-GB'};synth.getVoices=()=>[{lang:'he-IL'},gb,us];a.w.UnitTwo.start(0);
 assert.equal(a.spoken.at(-1).voice,us);a.spoken.at(-1).onerror();assert.match(a.$('#u2-speech-status').textContent,/כפתור השמע/);
 a.w.UnitTwo.home();let late;synth.getVoices=()=>[];synth.addEventListener=(type,fn)=>late=fn;synth.removeEventListener=()=>{};
 a.w.UnitTwo.start(0);const count=a.spoken.length;a.w.WordUnits.select('unit-1');late();assert.equal(a.spoken.length,count);
});

scenario('REMOVED-SPELLING: old spelling session is discarded without erasing progress',a=>{
 a.w.WordUnits.select('unit-2');a.w.UnitTwo.start(0);const saved=clone(a.w.UnitTwo.getState());
 saved.schemaVersion=1;delete saved.sessions;saved.session.practice='spelling';saved.stats.area={attempts:3,checked:true,focus:true};
 const b=boot({unit:null,unit2Stored:saved});try{assert.equal(b.w.UnitTwo.getState().session,null);assert.deepEqual(clone(b.w.UnitTwo.getState().stats.area),saved.stats.area);assert.equal(b.$('#u2-start-spelling'),null);}finally{b.close();}
});

scenario('UAT-03: exercise tiles resume their own question without replacement confirmation',a=>{
 a.w.WordUnits.select('unit-2');a.w.UnitTwo.start(2);a.click('[data-u2-choice]');a.w.UnitTwo.home();
 const before=clone(a.w.UnitTwo.getState().session);let prompts=0;a.w.confirm=()=>{prompts++;throw Error('Unexpected confirmation');};
 a.click('[data-u2-mode="0"]');assert.equal(a.w.UnitTwo.getState().session.mode,0);a.w.UnitTwo.home();
 a.click('[data-u2-mode="2"]');assert.deepEqual(clone(a.w.UnitTwo.getState().session),before);assert.equal(prompts,0);assert.equal(a.$('#u2-resume'),null);
});

function right(a){const q=a.w.eval('mission[step]'),value=q.type===3?q.w.en:q.w.he;return a.all('[data-penalty-choice]').find(b=>b.textContent===value);}
function shot(a,question,role,number){
 assert.equal(a.$('#position').textContent,'שאלת אוצר מילים '+question);
 assert.match(a.$('#pa-arena .round').textContent,new RegExp(role));
 assert.match(a.$('#pa-arena .round').textContent,new RegExp('בעיטה '+number));
 if(number<=5)assert.match(a.$('#pa-arena .round').textContent,/מתוך 5/);
 else{assert.match(a.$('#pa-arena .round').textContent,/בעיטות הכרעה/);assert.doesNotMatch(a.$('#pa-arena .round').textContent,/מתוך/);}
 right(a).click();assert.equal(a.$('#position').textContent,'שאלת אוצר מילים '+question);
 a.click('#pa-arena .target.t1');a.click('#pa-arena .kick');
}
scenario('UAT-05: vocabulary questions and kicks remain distinct through six tied pairs',a=>{
 a.mode(4);assert.doesNotMatch(a.$('#position').textContent,/מתוך/);a.click('#pa-arena .kick');
 for(let i=0;i<6;i++){shot(a,i*2+1,'התקפה',i+1);shot(a,i*2+2,'הגנה',i+1);}
 assert.equal(a.$('#position').textContent,'שאלת אוצר מילים 13');
 const correct=right(a);a.all('[data-penalty-choice]').find(b=>b!==correct).click();
 assert.equal(a.$('#position').textContent,'שאלת אוצר מילים 13');
 a.all('[data-penalty-choice]').find(b=>!b.disabled&&b!==right(a)).click();
 assert.equal(a.$('#position').textContent,'שאלת אוצר מילים 13');
},{shotOutcome:()=>true});

scenario('UAT-04 and creator credits: accurate sources, identity, date and no email',a=>{
 const about=a.$('#about-dialog'),footer=a.$('main>footer');
 for(const link of a.all('.creator-credit a,#about-dialog a')){assert.equal(link.href,'https://github.com/Yaron-Attias');assert.equal(link.textContent,'Yaron-Attias');assert.equal(link.target,'_blank');assert.match(link.rel,/noopener/);assert.match(link.rel,/noreferrer/);}
 assert.doesNotMatch(about.outerHTML+footer.outerHTML,/mailto:|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
 assert.match(about.textContent,/20/);assert.match(about.textContent,/36/);assert.match(about.textContent,/28/);
 assert.match(about.textContent,/11.11.2026/);assert.match(about.textContent,/Unit 2/);
 assert.doesNotMatch(about.textContent,/כל משפטי התרגול.*מקוריים/);
});

scenario('UAT-07: Unit 1 uses singular for a single focus word',a=>{
 assert.equal(a.$('#focusCount').textContent,'מילה אחת');
},{stored:{stats:{abroad:{focus:true,attempts:1}}}});
