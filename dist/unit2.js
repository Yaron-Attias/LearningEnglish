/* Unit 2 has its own content, DOM, progress and resumable round. */
(() => {
  'use strict';
  const data = window.UNIT2_DATA;
  if (!data?.words?.length) return;
  const root = document.getElementById('unit2-root');
  const KEY = 'wordsteps-grade8-unit2-v1';
  const version = String(data.version);
  const titles = ['לומדים בתמונה', 'בוחרים פירוש', 'משלימים משפט', 'באיזה משפט המילה מתאימה?'];
  const subtitles = ['מגלים משמעות דרך איור ודוגמה', 'מילה אחת, ארבעה פירושים', 'בוחרים מילה לפי ההקשר', 'מזהים את השימוש הנכון במילה'];
  const byId = new Map(data.words.map(w => [w.id, w]));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const integer = n => Number.isSafeInteger(n) && n >= 0;
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const empty = () => ({schemaVersion:2, contentVersion:version, stats:Object.create(null), variants:{cloze:Object.create(null),usage:Object.create(null)}, sessions:Object.create(null), session:null});
  const shuffled = values => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i],result[j]] = [result[j],result[i]]; }
    return result;
  };
  let active = false, generation = 0, focusMode = 1, storageFailed = false;
  let state = empty(), currentSlot=null;
  const slotMode=key=>/^mode:[0-3]$/.test(key)?Number(key.slice(5)):/^focus:[1-3]$/.test(key)?Number(key.slice(6)):key.startsWith('word:')&&byId.has(key.slice(5))?0:null;
  function choicesFor(w, mode, variant) {
    if (mode === 1) return [w.he,...w.meaningDistractors];
    if (mode === 2) { const q = w.clozes[variant]; return [q.answer || w.en,...q.distractors]; }
    if (mode === 3) { const q = w.usage[variant]; return [q.correct,q.incorrect]; }
    return [];
  }
  function validSession(s) {
    if (!object(s) || !integer(s.mode) || s.mode > 3 || !Array.isArray(s.ids) || !s.ids.length || s.ids.length > data.words.length || new Set(s.ids).size !== s.ids.length || s.ids.some(id => !byId.has(id))) return false;
    if (!integer(s.index) || s.index > s.ids.length || !integer(s.correct) || s.correct > s.ids.length || !Array.isArray(s.missed) || s.missed.some(id => !s.ids.includes(id)) || new Set(s.missed).size !== s.missed.length) return false;
    if (typeof s.revealed !== 'boolean' || typeof s.completed !== 'boolean' || !Array.isArray(s.prompts) || s.prompts.length > s.ids.length) return false;
    if (s.prompts.length < s.index) return false;
    if(s.practice==='spelling')return false;
    for (let i = 0; i < s.prompts.length; i++) {
      const p = s.prompts[i], w = byId.get(s.ids[i]);
      if (!object(p) || p.wordId !== w.id || !integer(p.variant) || (p.learned !== undefined && typeof p.learned !== 'boolean')) return false;
      const max = s.mode === 2 ? w.clozes.length : s.mode === 3 ? w.usage.length : 1;
      if (p.variant >= max || !Array.isArray(p.choices)) return false;
      const expected = choicesFor(w,s.mode,p.variant);
      if (p.choices.length !== expected.length || new Set(p.choices).size !== p.choices.length || p.choices.some(v => typeof v !== 'string' || !expected.includes(v))) return false;
    }
    if (s.index < s.ids.length && s.prompts.length < s.index + 1) return false;
    if (s.answer !== null && (!integer(s.answer) || s.mode === 0 || s.index >= s.ids.length || s.answer >= s.prompts[s.index].choices.length)) return false;
    const evaluated = s.index + Number(s.answer !== null);
    if (s.correct > evaluated || (s.mode === 0 && s.correct !== 0) || (s.mode > 0 && (s.missed.length > evaluated || s.missed.some(id => !s.ids.slice(0,evaluated).includes(id))))) return false;
    if (s.completed && s.index !== s.ids.length) return false;
    if (s.mode > 0 && s.correct + s.missed.length !== evaluated) return false;
    return true;
  }
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (object(saved) && [1,2].includes(saved.schemaVersion)) {
      for (const w of data.words) {
        const s = saved.stats?.[w.id];
        if (object(s)) state.stats[w.id] = {attempts:integer(s.attempts)?s.attempts:0,checked:s.checked===true,focus:s.focus===true};
        for (const kind of ['cloze','usage']) {
          const n = saved.variants?.[kind]?.[w.id];
          if (integer(n)) state.variants[kind][w.id] = n;
        }
      }
      if(String(saved.contentVersion)===version){
        const sessions=saved.schemaVersion===2?saved.sessions:{[`mode:${saved.session?.mode}`]:saved.session};
        if(object(sessions))for(const [key,value] of Object.entries(sessions)){
          const mode=slotMode(key);
          if(mode===null||!validSession(value)||value.mode!==mode)continue;
          if(key.startsWith('word:')&&(value.ids.length!==1||value.ids[0]!==key.slice(5)))continue;
          const round=structuredClone(value);
          if(mode===0){for(let i=0;i<round.index;i++)round.prompts[i].learned=true;if(round.index===round.ids.length){round.index--;round.completed=false;}}
          state.sessions[key]=round;
        }
      }
      // Upgrade only the storage envelope; word statistics and variant rotation stay intact.
      localStorage.setItem(KEY,JSON.stringify({...state,session:undefined}));
    }
  } catch { /* Broken or unavailable storage never prevents practice. */ }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify({...state,session:undefined})); storageFailed = false; }
    catch { storageFailed = true; }
    const status = root.querySelector('#u2-storage-status');
    if (status) status.textContent = storageFailed ? 'השמירה אינה זמינה כרגע. אפשר להמשיך לתרגל בעמוד הזה.' : '';
  }
  function feedbackFocus(selector = 'h1') {
    const target = root.querySelector(selector);
    if (!target) return;
    target.tabIndex = -1;
    target.focus({preventScroll:true});
    if (selector !== 'h1') target.scrollIntoView?.({block:'nearest',behavior:'auto'});
  }
  function bind(selector, callback) {
    const token = generation;
    root.querySelectorAll(selector).forEach(el => el.addEventListener('click', event => {
      if (!active || token !== generation) return;
      callback(event,el);
    }));
  }
  function mark(id, ok) {
    const previous = state.stats[id];
    state.stats[id] = {attempts:(previous?.attempts || 0)+1,checked:true,focus:!ok};
  }
  function weakWords() { return data.words.filter(w => state.stats[w.id]?.focus); }
  function storageStatus() { return `<p id="u2-storage-status" class="u2-status" role="status">${storageFailed?'השמירה אינה זמינה כרגע. אפשר להמשיך לתרגל בעמוד הזה.':''}</p>`; }
  let pictureEntry=null, speechToken=0, voiceTimer=null, voiceListener=null;
  function stopSpeech(){
    speechToken++;clearTimeout(voiceTimer);voiceTimer=null;
    if(voiceListener)window.speechSynthesis?.removeEventListener?.('voiceschanged',voiceListener);
    voiceListener=null;window.speechSynthesis?.cancel?.();
  }
  function speak(word){
    stopSpeech();const token=speechToken;
    const valid=()=>active&&token===speechToken&&state.session?.mode===0&&pictureEntry?.session===state.session&&pictureEntry.index===state.session.index;
    const status=text=>{if(valid()){const el=root.querySelector('#u2-speech-status');if(el)el.textContent=text;}};
    if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){status('השמעה אינה זמינה בדפדפן הזה.');return;}
    const synth=window.speechSynthesis;
    let started=false;
    const play=()=>{
      if(!valid()||started)return;started=true;
      clearTimeout(voiceTimer);voiceTimer=null;
      if(voiceListener)synth.removeEventListener?.('voiceschanged',voiceListener);voiceListener=null;
      const voices=synth.getVoices?.()||[],voice=voices.find(v=>/^en-US$/i.test(v.lang))||voices.find(v=>/^en(?:-|$)/i.test(v.lang));
      const utterance=new window.SpeechSynthesisUtterance(word);utterance.lang=voice?.lang||'en-US';if(voice)utterance.voice=voice;utterance.rate=0.85;
      utterance.onstart=()=>status('');
      utterance.onerror=()=>status('ההשמעה לא התחילה. לחצו על כפתור השמע כדי לנסות שוב.');
      status('אם ההשמעה לא מתחילה, לחצו על כפתור השמע.');
      try{synth.speak(utterance);}catch{status('ההשמעה לא התחילה. לחצו על כפתור השמע כדי לנסות שוב.');}
    };
    if((synth.getVoices?.()||[]).length)play();
    else{voiceListener=play;synth.addEventListener?.('voiceschanged',voiceListener);voiceTimer=setTimeout(play,300);}
  }
  function home(moveFocus = true, keepFocusPanel = false) {
    if (!active) return;
    stopSpeech();pictureEntry=null;generation++;
    focusMode = 1;
    const weak = weakWords();
    root.innerHTML = `<section class="u2-hero"><h1>מתרגלים לקראת הבוחן</h1><p>${data.words.length} מילים וביטויים · לומדים, מבינים ומתרגלים</p></section>
      <div class="u2-grid">${titles.map((title,i)=>`<button class="u2-mode" data-u2-mode="${i}"><span class="u2-mode-icon" aria-hidden="true">${['▧','≡','…','✓'][i]}</span><span><strong>${title}</strong><small>${subtitles[i]}</small></span><span aria-hidden="true">←</span></button>`).join('')}</div>
      <section class="u2-panel u2-focus-panel"><div class="u2-panel-head"><h2>עוד קצת תרגול</h2><span>${weak.length===1?'מילה אחת לחיזוק':weak.length+' מילים לחיזוק'}</span></div>
      ${weak.length?`<p>חוזרים למילים שדרשו עוד ניסיון.</p><div class="u2-practice-tabs" role="group" aria-label="סוג התרגול">${['פירושים','השלמת משפט','שימוש נכון'].map((t,i)=>`<button data-u2-practice="${i+1}" aria-pressed="${i===0}" class="${i===0?'selected':''}">${t}</button>`).join('')}</div><button class="primary u2-full" id="u2-start-focus">התחל תרגול · ${weak.length===1?'מילה אחת':weak.length+' מילים'}</button><details class="u2-focus-manage" ${keepFocusPanel?'open':''}><summary>הצגת המילים וניהול התרגול (${weak.length})</summary>${weak.map(w=>`<div class="u2-focus-row"><strong dir="ltr">${esc(w.en)}</strong><button data-u2-word="${esc(w.id)}">לימוד</button><button data-u2-remove="${esc(w.id)}" aria-label="הסרת ${esc(w.en)} מהתרגול הנוסף">הסרה</button></div>`).join('')}</details>`:'<p>עוד אין מילים לחיזוק. מילים שדרשו עוד ניסיון יופיעו כאן.</p>'}</section>
      <details class="u2-word-list"><summary>כל המילים של Unit 2 (${data.words.length})</summary>${data.words.map(w=>`<div><bdi>${esc(w.en)}</bdi><span>${esc(w.he)}</span></div>`).join('')}</details>
      <div class="u2-local-note"><p>ההתקדמות נשמרת בדפדפן הזה, בנפרד מ־Unit 1.</p><button id="u2-reset">איפוס ההתקדמות ב־Unit 2</button></div>${storageStatus()}`;
    bind('[data-u2-mode]',(_,b)=>open(Number(b.dataset.u2Mode)));
    bind('[data-u2-practice]',(_,b)=>{
      focusMode=Number(b.dataset.u2Practice);
      root.querySelectorAll('[data-u2-practice]').forEach(t=>{const selected=t===b;t.classList.toggle('selected',selected);t.setAttribute('aria-pressed',String(selected));});
    });
    bind('#u2-start-focus',()=>openSlot(focusMode,weakWords().map(w=>w.id),`focus:${focusMode}`));
    bind('[data-u2-word]',(_,b)=>openSlot(0,[b.dataset.u2Word],`word:${b.dataset.u2Word}`));
    bind('[data-u2-remove]',(_,b)=>{
      state.stats[b.dataset.u2Remove].focus=false;persist();home(false,true);
      feedbackFocus(weakWords().length?'.u2-focus-manage summary':'.u2-focus-panel h2');
    });
    bind('#u2-reset',()=>{
      if (!confirm('לאפס את ההתקדמות והסבב השמור של Unit 2 בלבד?')) return;
      state=empty();currentSlot=null;persist();home();
    });
    if(moveFocus) feedbackFocus();
  }
  function openSlot(mode,ids,key){
    if(!active)return;
    if(state.sessions[key]){currentSlot=key;state.session=state.sessions[key];render();}
    else start(mode,ids,key);
  }
  function open(mode){if(integer(mode)&&mode<=3)openSlot(mode,data.words.map(w=>w.id),`mode:${mode}`);}
  function start(mode, ids = data.words.map(w=>w.id), key=`mode:${mode}`) {
    if (!active || !integer(mode) || mode>3 || !Array.isArray(ids) || slotMode(key)!==mode) return;
    const selected = [...new Set(ids)].filter(id=>byId.has(id));
    if (!selected.length) return;
    stopSpeech();currentSlot=key;
    state.session={mode,ids:shuffled(selected),index:0,prompts:[],answer:null,revealed:false,correct:0,missed:[],completed:false};
    state.sessions[key]=state.session;
    render();
  }
  function ensurePrompt() {
    const s=state.session,w=byId.get(s.ids[s.index]);
    if (!s.prompts[s.index]) {
      const kind=s.mode===2?'cloze':s.mode===3?'usage':null;
      let variant=0;
      if(kind){const n=state.variants[kind][w.id]||0;variant=n%(kind==='cloze'?w.clozes.length:w.usage.length);state.variants[kind][w.id]=(n+1)%1000000;}
      s.prompts[s.index]={wordId:w.id,variant,choices:shuffled(choicesFor(w,s.mode,variant))};
    }
    return s.prompts[s.index];
  }
  function highlight(text,word) { return String(text).split(word).map(esc).join(`<mark>${esc(word)}</mark>`); }
  function render(destination='heading') {
    if(!active)return;
    const s=state.session;
    if(!s)return home();
    const newPicture=s.mode===0&&(pictureEntry?.session!==s||pictureEntry.index!==s.index);
    if(s.mode!==0||newPicture){stopSpeech();pictureEntry=s.mode===0?{session:s,index:s.index}:null;}
    generation++;
    if(s.index>=s.ids.length)return finish();
    const p=ensurePrompt(),w=byId.get(p.wordId),q=s.mode===2?w.clozes[p.variant]:s.mode===3?w.usage[p.variant]:null;
    const example=w.clozes[0].text.replace('___',w.clozes[0].answer||w.en);
    const correct=s.mode===1?w.he:s.mode===2?(q.answer||w.en):s.mode===3?q.correct:null;
    let body='';
    if(s.mode===0){
      body=`<div class="u2-picture-heading"><h1 dir="ltr">${esc(w.en)}</h1><button id="u2-speak" aria-label="השמעת המילה באנגלית"><span aria-hidden="true">🔊</span><span class="u2-speak-label">השמעה</span></button></div><p id="u2-speech-status" class="u2-speech-status" role="status"></p><img class="u2-illustration" src="${esc(w.image)}" alt="${esc(w.alt)}" width="1280" height="720" decoding="async">
      <section class="u2-feedback"><h2>${esc(w.he)}</h2><p dir="ltr">${highlight(example,w.en)}</p><p>${esc(w.hint)}</p></section><div class="u2-actions"><button class="primary" id="u2-understood" ${s.index===s.ids.length-1&&p.learned?'disabled':''}>${s.index===s.ids.length-1&&p.learned?'המילה האחרונה':'הבנתי · ממשיכים'}</button><button id="u2-prev" ${s.index===0?'disabled':''}>מילה קודמת</button></div>`;
    }else{
      body=`<h1 ${s.mode!==2?'dir="ltr"':''}>${s.mode===2?'מה מתאים במשפט?':esc(w.en)}</h1>${s.mode===2?`<p class="u2-sentence" dir="ltr">${esc(q.text.replace('___','______'))}</p>`:`<p>${s.mode===1?'בחרו את הפירוש המתאים':'באיזה משפט השימוש במילה נכון?'}</p>`}
      <div class="u2-options" role="group" aria-label="אפשרויות תשובה">${p.choices.map((choice,i)=>{
        const answered=s.answer!==null,good=answered&&choice===correct,bad=answered&&i===s.answer&&!good;
        return `<button class="u2-option ${good?'u2-correct':bad?'u2-incorrect':''}" data-u2-choice="${i}" ${answered?'disabled':''}><span class="u2-option-copy" ${s.mode!==1?'dir="ltr"':''}>${s.mode===3?highlight(choice,w.en):esc(choice)}</span>${good?`<span class="u2-choice-tag">✓ התשובה הנכונה${i===s.answer?' · בחרת נכון':''}</span>`:bad?'<span class="u2-choice-tag">× התשובה שבחרת · ננסה שוב בתרגול הבא</span>':''}</button>`;
      }).join('')}</div>${s.answer!==null?`<section class="u2-feedback" role="status"><strong>${p.choices[s.answer]===correct?'נכון מאוד! ✓':'התשובה הנכונה מסומנת ב־✓.'}</strong>${s.mode===2?`<p dir="ltr">${highlight(q.text.replace('___',q.answer||w.en),q.answer||w.en)}</p>`:`<p>${esc(w.he)}</p>`}<p>${esc(q?.hint||w.hint)}</p></section><button id="u2-next" class="primary u2-full">${s.index+1===s.ids.length?'לתוצאות':'למילה הבאה ←'}</button>`:''}`;
    }
    root.innerHTML=`<section class="u2-study"><div class="u2-topline"><button id="u2-back">למסך הבית</button><span>${titles[s.mode]}<br>מילה ${s.index+1} מתוך ${s.ids.length}</span></div><div class="u2-progress" role="progressbar" aria-label="מילים שהושלמו בסבב" aria-valuemin="0" aria-valuemax="${s.ids.length}" aria-valuenow="${s.index}"><span style="width:${100*s.index/s.ids.length}%"></span></div>${body}${storageStatus()}</section>`;
    persist();
    bind('#u2-back',()=>home());
    bind('#u2-speak',()=>speak(w.en));
    bind('#u2-understood',()=>{if(!p.learned){mark(w.id,true);p.learned=true;}if(s.index===s.ids.length-1){persist();render();}else advance();});
    bind('#u2-prev',()=>{
      if(s.index===0)return;
      // Earlier cards were already completed, including rounds saved before learned was recorded.
      for(let i=0;i<s.index;i++)s.prompts[i].learned=true;
      s.index--;s.answer=null;s.revealed=false;render();
    });
    bind('#u2-next',advance);
    bind('[data-u2-choice]',(_,button)=>{
      if(s.answer!==null)return;
      s.answer=Number(button.dataset.u2Choice);
      const ok=p.choices[s.answer]===correct;
      mark(w.id,ok);if(ok)s.correct++;else s.missed.push(w.id);
      persist();window.WordUsage?.answer();render('feedback');
    });
    feedbackFocus(destination==='feedback'?'.u2-feedback':'h1');
    if(newPicture)speak(w.en);
  }
  function advance(){
    if(!active||!state.session)return;
    const s=state.session;s.index++;s.answer=null;s.revealed=false;
    render();
  }
  function finish(){
    const s=state.session;
    if(!s.completed){s.completed=true;persist();if(s.mode>0)window.WordUsage?.complete();}
    const percent=Math.round(100*s.correct/s.ids.length),circumference=2*Math.PI*48;
    root.innerHTML=`<section class="u2-study u2-panel u2-summary"><p class="u2-eyebrow">${titles[s.mode]}</p><h1>הסבב הושלם</h1>${s.mode?`<div class="u2-gauge" role="img" aria-label="${percent} אחוז תשובות נכונות בסבב"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="u2-gauge-track" cx="60" cy="60" r="48"/><circle class="u2-gauge-value" cx="60" cy="60" r="48" stroke-dasharray="${circumference*percent/100} ${circumference}"/></svg><strong dir="ltr">${percent}%</strong></div><p>ענית נכון על ${s.correct} מתוך ${s.ids.length}</p>`:'<p>פגשתם את כל המילים בסבב.</p>'}<p>${s.missed.length?`${s.missed.length===1?'מילה אחת מחכה':s.missed.length+' מילים מחכות'} לחזרה.`:'כל הכבוד על התרגול!'}</p>${s.missed.length?'<button class="primary u2-full" id="u2-retry">חזרה על המילים מהסבב</button>':''}<div class="u2-actions"><button id="u2-new-round">סבב חדש</button><button id="u2-finish-home">למסך הבית</button></div>${s.mode?`<p class="u2-muted">התוצאה מתייחסת לסבב הזה בלבד.</p>`:''}${storageStatus()}</section>`;
    bind('#u2-retry',()=>start(s.mode,[...new Set(s.missed)],`focus:${s.mode}`));
    bind('#u2-new-round',()=>start(s.mode,currentSlot===`mode:${s.mode}`?data.words.map(w=>w.id):[...s.ids],currentSlot));
    bind('#u2-finish-home',()=>home());
    feedbackFocus();
  }
  window.UnitTwo=Object.freeze({
    storageKey:KEY,
    activate(){active=true;generation++;home(false);},
    deactivate(){stopSpeech();pictureEntry=null;active=false;generation++;},
    resume(){if(active&&state.session)render();},
    home,open,start,
    getState(){return structuredClone(state);}
  });
})();
