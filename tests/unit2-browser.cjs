// Real Chromium UI coverage, isolated storage, served from local dist only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
let playwright;try{playwright=require('playwright-core');}catch{playwright=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'));}
const dist=path.resolve(__dirname,'../dist'),reportDir=path.join(__dirname,'reports');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{const route=decodeURIComponent((req.url||'/').split('?')[0]);const file=path.resolve(dist,'.'+(route==='/'?'/index.html':route));if(!file.startsWith(dist+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();}else{res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);}});});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await playwright.chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[],coverage=[new Set(),new Set(),new Set(),new Set()],viewports=[],headerChecks=[];let dialogs=0;
 page.on('dialog',async dialog=>{dialogs++;await dialog.dismiss();});
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://**/*',route=>route.abort());
 const base='http://127.0.0.1:'+server.address().port;
 try{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#unit-selector').inputValue(),'unit-2');
  assert.equal(await page.locator('#u2-resume').count(),0);
  for(const width of [320,390,430,480,600,640,768,1440]){
   await page.setViewportSize({width,height:900});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'home overflow '+width);
   const header=await page.evaluate(()=>{const h=document.querySelector('.page>header'),nav=document.querySelector('.unit-navigation'),select=document.getElementById('unit-selector'),a=h.getBoundingClientRect(),b=nav.getBoundingClientRect(),c=select.getBoundingClientRect(),logo=h.querySelector('a').getBoundingClientRect(),pill=h.querySelector('.grade-caption').getBoundingClientRect(),overlap=r=>Math.min(b.right,r.right)>Math.max(b.left,r.left)+1&&Math.min(b.bottom,r.bottom)>Math.max(b.top,r.top)+1;return {inHeader:nav.parentElement===h,centerGap:Math.abs(a.left+a.width/2-b.left-b.width/2),fits:c.left>=a.left&&c.right<=a.right,height:a.height,overlap:overlap(logo)||overlap(pill)};});
   assert.equal(header.inHeader,true);assert.equal(header.fits,true);assert.equal(header.overlap,false,'header overlaps at '+width);if(width>=768){assert.ok(header.height<90);}
   headerChecks.push({width,...header});
   if(width===1440)await page.screenshot({path:path.join(reportDir,'unit2-home-desktop.png'),fullPage:true});
   viewports.push(width);
  }
  await page.setViewportSize({width:390,height:844});
  for(const mode of [0,1,2,3])for(let round=0;round<(mode===2?4:mode===3?2:1);round++){
   await page.locator(`[data-u2-mode="${mode}"]`).click();
   if(round)await page.locator('#u2-new-round').click();
   for(let i=0;i<14;i++){
    const item=await page.evaluate(()=>{const s=UnitTwo.getState().session,p=s.prompts[s.index],w=UNIT2_DATA.words.find(w=>w.id===p.wordId);return {id:w.id,variant:p.variant,correct:s.mode===1?w.he:s.mode===2?w.clozes[p.variant].answer:s.mode===3?w.usage[p.variant].correct:null,hint:s.mode===2?w.clozes[p.variant].hint:s.mode===3?w.usage[p.variant].hint:w.hint,choices:p.choices};});
    coverage[mode].add(item.id+':'+item.variant);
    if(mode===0){
     await page.locator('.u2-illustration').evaluate(img=>img.decode());
     assert.equal(await page.locator('#u2-reveal').count(),0);
     assert.ok((await page.locator('.u2-feedback').innerText()).includes(item.hint));
     await page.locator('#u2-understood').click();
    }else{
     await page.locator(`[data-u2-choice="${item.choices.indexOf(item.correct)}"]`).click();
     assert.equal(await page.locator('[data-u2-choice]:enabled').count(),0);
     assert.ok((await page.locator('.u2-feedback').innerText()).includes(item.hint));
     assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('u2-feedback')),true);
     if(i===0&&round===0)await page.screenshot({path:path.join(reportDir,'unit2-mode-'+mode+'-mobile.png'),fullPage:true});
     if(i===0&&round===0){
      for(const width of viewports){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'feedback overflow '+mode+' '+width);}
      await page.setViewportSize({width:390,height:844});
      const before=await page.evaluate(()=>JSON.stringify(UnitTwo.getState()));await page.reload({waitUntil:'domcontentloaded'});
      await page.locator(`[data-u2-mode="${mode}"]`).click();assert.deepEqual(await page.evaluate(()=>UnitTwo.getState()),JSON.parse(before));
      assert.equal(await page.locator('[data-u2-choice]:enabled').count(),0);
     }
     await page.locator('#u2-next').click();
    }
   }
   if(mode){assert.ok((await page.locator('#unit2-root').innerText()).includes('הסבב הושלם'));await page.locator('#u2-finish-home').click();}
   else{assert.equal(await page.locator('#u2-understood').isDisabled(),true);assert.equal(await page.locator('#u2-understood').innerText(),'המילה האחרונה');await page.locator('#u2-back').click();}
  }
  assert.deepEqual(coverage.map(x=>x.size),[14,14,56,28]);
  await page.screenshot({path:path.join(reportDir,'unit2-home-mobile.png'),fullPage:true});
  await page.locator('#unit-selector').selectOption('unit-1');assert.equal(await page.locator('#unit1-root').isVisible(),true);
  await page.locator('#unit-selector').selectOption('unit-2');assert.equal(await page.locator('#unit2-root').isVisible(),true);
  assert.deepEqual(errors,[]);
  assert.equal(dialogs,0);
  const result={at:new Date().toISOString(),browser:'Edge Chromium headless',coverage:coverage.map(x=>x.size),viewports,headerChecks,dialogs,errors,scope:'Unit 2 only: every variant, image decodes, locked-answer reloads, responsive header/overflow, focus, new rounds and absence of replacement dialogs; not physical-device or student comprehension validation.'};
  fs.writeFileSync(path.join(reportDir,'unit2-browser.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
