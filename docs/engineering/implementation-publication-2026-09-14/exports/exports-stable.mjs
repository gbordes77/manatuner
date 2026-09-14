import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import baseRecords from '../../../../tests/fixtures/scryfall-audit.json' with {type:'json'};
import sampleRecords from '../../../../tests/fixtures/scryfall-sample-audit.json' with {type:'json'};
const records=[...baseRecords,...sampleRecords,
{name:'Savannah Lions',mana_cost:'{W}',cmc:1,type_line:'Creature — Cat',oracle_text:'',colors:['W'],color_identity:['W'],layout:'normal'},
{name:"Atraxa, Praetors' Voice",mana_cost:'{G}{W}{U}{B}',cmc:4,type_line:'Legendary Creature — Phyrexian Angel',oracle_text:'',colors:['G','W','U','B'],color_identity:['G','W','U','B'],layout:'normal'},
{name:'Negate',mana_cost:'{1}{U}',cmc:2,type_line:'Instant',oracle_text:'Counter target noncreature spell.',colors:['U'],color_identity:['U'],layout:'normal'}];
const out=process.env.EXPORT_OUTPUT || decodeURIComponent(new URL('./stable/',import.meta.url).pathname);fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const evidence=[];
for(const [id,deck,width,theme,total,commander] of [
 ['constructed','24 Plains\n36 Savannah Lions',390,'dark',60,0],
 ['commander','Commander\n1 Atraxa, Praetors\' Voice\n\nDeck\n43 Forest\n56 Llanowar Elves\n\nSideboard\n2 Negate',1440,'light',99,1],
 ['formula','59 Plains\n1 =1+1',390,'light',60,0]
]){
 const page=await browser.newPage({viewport:{width,height:900}}); page.setDefaultTimeout(30000);
 await page.addInitScript(theme=>{localStorage.setItem('manatuner-onboarding-completed','true');localStorage.setItem('manatuner-theme',theme);},theme);
 await page.route('https://api.scryfall.com/**',async route=>{
  const req=route.request();let names;
  if(req.url().includes('/cards/collection')){names=req.postDataJSON().identifiers.map(x=>x.name.toLowerCase());await route.fulfill({json:{object:'list',data:records.filter(c=>names.includes(c.name.toLowerCase()))}});}
  else{const url=new URL(req.url()); const name=url.searchParams.get('exact')||url.searchParams.get('fuzzy');const card=records.find(c=>c.name.toLowerCase()===name?.toLowerCase());await route.fulfill({status:card?200:404,json:card||{object:'error',code:'not_found'}});}
 });
 await page.goto((process.env.EXPORT_BASE_URL || 'http://127.0.0.1:4197')+'/analyzer');
 await page.getByPlaceholder(/paste your decklist/i).fill(deck);
 await page.getByRole('button',{name:'Analyze Manabase',exact:true}).click();
 await page.getByTestId('analysis-results').waitFor();
 await page.getByTestId('tab-blueprint').click();
 for(const [kind,label] of [['json',/JSON/],['csv',/CSV/],...(id==='formula'?[]:[['pdf',/PDF/]])]){
  await page.getByRole('button',{name:'Export Blueprint',exact:true}).click();
  const pending=page.waitForEvent('download');await page.getByRole('menuitem',{name:label}).click();await(await pending).saveAs(out+id+'.'+kind);
 }
 const exported=JSON.parse(fs.readFileSync(out+id+'.json','utf8'));
 assert.equal(exported.analysis.totalCards,total);
 assert.equal(exported.analysis.cards.filter(c=>c.isCommander&&!c.isSideboard).reduce((n,c)=>n+c.quantity,0),commander);
 if(id==='formula') assert.match(fs.readFileSync(out+id+'.csv','utf8'),/deck,'=1\+1,1,/);
 await page.getByRole('button',{name:'Export Blueprint',exact:true}).click();
 await page.getByRole('menuitem',{name:/Text report/}).click();
 const report=await page.getByRole('textbox',{name:'Analysis report'}).inputValue();
 assert.ok(report.includes(`Library: ${total} cards`));
 assert.ok(report.includes(`Good (2–4 lands): ${exported.analysis.mulliganAnalysis.goodHand.toFixed(2)}%`));
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download text',exact:true}).click();await(await pending).saveAs(out+id+'.txt');
 assert.equal(fs.readFileSync(out+id+'.txt','utf8'),report);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
 await page.screenshot({path:out+id+'-text.png',fullPage:true});
 await page.getByRole('button',{name:'Close',exact:true}).click();
 const blocks=await page.getByTestId('blueprint-card').evaluate(card=>{const root=card.getBoundingClientRect();return {width:root.width,height:root.height,blocks:Array.from(card.querySelectorAll('[data-pdf-block]')).map(e=>{const r=e.getBoundingClientRect();return {top:r.top-root.top,bottom:r.bottom-root.top,title:e.textContent.slice(0,90)}})}});
 fs.writeFileSync(out+id+'-blocks.json',JSON.stringify(blocks,null,2));
 await page.screenshot({path:out+id+'-blueprint.png',fullPage:true});
 evidence.push({id,width,theme,total,commander,lands:exported.analysis.totalLands,goodHand:exported.analysis.mulliganAnalysis.goodHand,reportMatchesDownload:true});
 await page.close();
}
fs.writeFileSync(out+'results.json',JSON.stringify(evidence,null,2));
await browser.close();
