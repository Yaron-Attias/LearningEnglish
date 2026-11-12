/* The latest published unit is the default on every document load. */
(() => {
  'use strict';
  const legacy = document.getElementById('unit1-root');
  const modern = document.getElementById('unit2-root');
  const selector = document.getElementById('unit-selector');
  if (!legacy || !modern || !selector) return;
  const catalog = [{id:'unit-1',number:1,title:'New Mosaic · Unit 1',published:true,hasContent:SOURCE_WORDS.length>0}];
  if (window.UNIT2_DATA && window.UnitTwo) catalog.push({id:window.UNIT2_DATA.id,number:window.UNIT2_DATA.number,title:window.UNIT2_DATA.title,published:window.UNIT2_DATA.published===true,hasContent:window.UNIT2_DATA.words.length>0});
  const available = catalog.filter(unit=>unit.published&&unit.hasContent&&Number.isFinite(unit.number));
  let activeId = null, activation = 0;
  for (const unit of available) { const option=document.createElement('option');option.value=unit.id;option.textContent=unit.title;selector.append(option); }
  // Guard all penalty callbacks, including a retained callback after teardown.
  const mount=window.WordPenalty.mount;
  window.WordPenalty.mount=(host,options)=>{
    const token=activation,guarded={...options};
    for(const [key,value] of Object.entries(options))if(typeof value==='function')guarded[key]=(...args)=>{
      if(activeId==='unit-1'&&activation===token)return value(...args);
    };
    return mount(host,guarded);
  };
  // Hidden legacy controls cannot record answers through stale DOM events.
  for(const type of ['click','submit','change','keydown'])legacy.addEventListener(type,event=>{
    if(activeId!=='unit-1'){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  function select(id) {
    if(!available.some(unit=>unit.id===id))return false;
    if(id===activeId)return true;
    activation++;
    stopPenalty?.();stopPenalty=null;
    window.speechSynthesis?.cancel();
    window.UnitTwo?.deactivate();
    touchStart=null;
    activeId=id;selector.value=id;
    legacy.hidden=id!=='unit-1';modern.hidden=id!=='unit-2';
    legacy.inert=legacy.hidden;modern.inert=modern.hidden;
    if(id==='unit-2')window.UnitTwo.activate();
    else {mode=0;locked=false;buildDeck();}
    return true;
  }
  selector.addEventListener('change',()=>select(selector.value));
  window.WordUnits=Object.freeze({select,get activeId(){return activeId;},get catalog(){return available.map(unit=>({...unit}));}});
  const latest=[...available].sort((a,b)=>b.number-a.number)[0];
  if(latest)select(latest.id);
})();
