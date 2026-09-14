import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const root=process.cwd();
const campaign=resolve(root,'docs/engineering/implementation-publication-2026-09-14');
const output=resolve(campaign,'final-07/oracles');
const started=performance.now();
const modules={};
for(const [key,file] of Object.entries({hyper:'src/services/castability/hypergeom.ts',parser:'src/services/deckParser.ts',url:'src/utils/urlCodec.ts',resolver:'src/services/cardResolver.ts'})) {
 const outfile=resolve(output,`${key}.mjs`);
 await build({entryPoints:[resolve(root,file)],outfile,bundle:true,platform:'node',format:'esm',logLevel:'silent'});
 modules[key]=await import(pathToFileURL(outfile));
}
const rows=[];
const check=(id,expected,actual,pass,detail={})=>rows.push({id,expected,actual,status:pass?'RÉUSSI':'ÉCHOUÉ',...detail});
// Independent exact integer enumeration of unordered subsets. No engine formula imported.
function choose(n,k){if(k<0||k>n)return 0n;let r=1n;for(let i=1;i<=k;i++)r=r*BigInt(n-i+1)/BigInt(i);return r;}
for(const [fixture,N,K,sb,cmd] of [['F40-17',40,17,0,0],['F60-20',60,20,0,0],['F60-24',60,24,0,0],['F60-SB',60,24,3,0],['F100-CMD',99,43,0,1]]) {
 const source=readFileSync(resolve(root,`docs/quality/precommunication-2026-09-13/fixtures/${fixture}.txt`),'utf8');
 const parsed=modules.parser.parseDecklist(source);
 const quantities=Object.fromEntries(['main','sideboard','commander'].map(section=>[section,parsed.entries.filter(e=>e.section===section).reduce((n,e)=>n+e.quantity,0)]));
 check(`${fixture}-population`,{main:N,sideboard:sb,commander:cmd},quantities,quantities.main===N&&quantities.sideboard===sb&&quantities.commander===cmd,{sha256:createHash('sha256').update(source).digest('hex')});
 for(let threshold=0;threshold<=8;threshold++) {
  let favorable=0n;for(let k=threshold;k<=7;k++)favorable+=choose(K,k)*choose(N-K,7-k);
  const expected=Number(favorable)/Number(choose(N,7));
  const actual=modules.hyper.hypergeom.atLeast(N,K,7,threshold);
  check(`${fixture}-opening-at-least-${threshold}`,expected,actual,Math.abs(expected-actual)<=1e-12,{tolerance:1e-12,absoluteError:Math.abs(expected-actual)});
 }
}
const u=new URL('https://audit.invalid/analyzer');
globalThis.window={location:u,history:{replaceState(_a,_b,url){window.location=new URL(url,window.location.origin)}}};
const text='24 Plains\n36 Savannah Lions';
const shared=modules.url.buildShareUrl({deckList:text,deckName:'Audit é, "deck"',tab:2});
window.location=new URL(shared);
check('new-share-roundtrip',text,modules.url.parseShareParams()?.deckList,modules.url.parseShareParams()?.deckList===text);
window.location=new URL(`https://audit.invalid/analyzer?d=${modules.url.encodeDeck(text)}&name=Legacy&tab=2`);
const first=modules.url.parseShareParams();
const migrated=window.location.href;
const afterReload=modules.url.parseShareParams();
check('legacy-share-after-migration-reload',text,afterReload?.deckList??null,afterReload?.deckList===text,{firstRead:first?.deckList,migrated});
check('garbage-share','',modules.url.decodeDeck('%%%not-base64%%%'),modules.url.decodeDeck('%%%not-base64%%%')==='');
const oversized='x'.repeat(30000);
const encodeRejected=modules.url.encodeDeck(oversized)==='';
check('share-30000-rejected-before-encode',true,encodeRejected,encodeRejected);
check('share-30000-decoded-text-rejected','',modules.url.decodeDeck(Buffer.from(oversized).toString('base64url')),modules.url.decodeDeck(Buffer.from(oversized).toString('base64url'))==='');
let rejected=false;try{modules.parser.parseDecklist(oversized)}catch{rejected=true}
check('parser-30000-rejected',true,rejected,rejected);
// All fetches are mocked in memory. No Scryfall request leaves this process.
const times=[];globalThis.fetch=async()=>{times.push(performance.now());return new Response('',{status:404});};
for(let i=0;i<6;i++)await modules.resolver.fetchCardFromScryfallWithMeta(`Audit missing ${i}`);
const duration=times.at(-1)-times[0];
check('resolver-fallback-spacing-at-least-100ms',100,Math.min(...times.slice(1).map((v,i)=>v-times[i])),times.slice(1).every((v,i)=>v-times[i]>=99),{requestCount:times.length,durationMs:duration,mode:'local mock immediate HTTP 404; no remote load'});
const result={at:new Date().toISOString(),durationMs:performance.now()-started,scope:'source modules bundled by esbuild; no UI/candidate execution; no stochastic oracle',passed:rows.filter(r=>r.status==='RÉUSSI').length,failed:rows.filter(r=>r.status==='ÉCHOUÉ').length,rows};
writeFileSync(resolve(output,'independent-results-final.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
process.exitCode=result.failed?1:0;
