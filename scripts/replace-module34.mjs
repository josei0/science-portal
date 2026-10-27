import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {livingThingsModule} from '../content/modules/sd13-living-things-20261027.mjs';
import {validateModules} from './publish-sd13-discovery.mjs';

const before=JSON.parse(readFileSync(new URL('../content/modules/module34-before-replacement-20261027.json',import.meta.url)));
const canonical=value=>JSON.stringify(value,(_,entry)=>entry&&typeof entry==='object'&&!Array.isArray(entry)?Object.fromEntries(Object.entries(entry).sort(([a],[b])=>a.localeCompare(b))):entry);
const hash=value=>createHash('sha256').update(canonical(value)).digest('hex');
const after={...before,...livingThingsModule};
const normalize=value=>value.normalize('NFKC').toLocaleLowerCase('id').replace(/[^\p{L}\p{N}]+/gu,' ').trim();

async function run(){
  validateModules();
  assert.equal(before.id,34);assert.equal(before.game_slug,'sd13-laboratorium-terapung-tenggelam');
  assert.doesNotMatch(livingThingsModule.theory_content,/Ayo Mencoba|Ingat dan Mainkan|Bacaan pendamping|Mintalah bantuan guru/);
  console.log('Validated replacement: 6 quiz questions, 8 reasoning blanks, original illustration, concise user-approved theory structure.');
  if(!process.argv.includes('--apply')&&!process.argv.includes('--preflight'))return;
  if(existsSync('.env.local'))process.loadEnvFile('.env.local');
  assert.ok(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY,'Server credentials required');
  const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false},global:{fetch:(u,o)=>fetch(u,{...o,signal:AbortSignal.timeout(25000)})}});
  const {data:max,error:me}=await db.from('materials').select('id').order('id',{ascending:false}).limit(1);if(me)throw new Error(me.code);
  const inventory=[];for(let start=0;;start+=500){const {data,error}=await db.from('materials').select('*').order('id').range(start,start+499);if(error)throw new Error(error.code);inventory.push(...data);if(data.length<500)break;}
  const current=inventory.find(m=>m.id===34);
  assert.ok(current&&(hash(current)===hash(before)||hash(current)===hash(after)),'Module 34 changed after review. Reconcile before applying.');
  assert.ok(!inventory.some(m=>m.id!==34&&(m.game_slug===after.game_slug||normalize(m.title)===normalize(after.title))),'Duplicate module detected');
  const {count:progressCount,error:pe}=await db.from('progress').select('id',{count:'exact',head:true}).eq('material_id',34);if(pe)throw new Error(pe.code);
  if(hash(current)!==hash(after))assert.equal(progressCount,0,'Students have started the old topic; preserve their records and review replacement strategy.');
  console.log(JSON.stringify({maxId:max[0]?.id,count:inventory.length,targetId:34,newTitle:after.title,existingProgress:progressCount},null,2));
  if(!process.argv.includes('--apply'))return;
  if(hash(current)!==hash(after)){
    const {data,error}=await db.from('materials').update(livingThingsModule).eq('id',34).eq('game_slug',before.game_slug).eq('title',before.title).select('*').single();
    if(error)throw new Error(`Replacement failed (${error.code})`);assert.equal(hash(data),hash(after));
  }
  for(let offset=0;offset<inventory.length;offset+=100){const original=inventory.slice(offset,offset+100);const {data,error}=await db.from('materials').select('*').in('id',original.map(m=>m.id));if(error)throw new Error(error.code);assert.equal(data.length,original.length);for(const old of original)assert.equal(hash(data.find(m=>m.id===old.id)),hash(old.id===34?after:old),`Unexpected change in ${old.id}`);}
  const publicDb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}});
  const {data:publicRow,error:re}=await publicDb.from('materials').select('*').eq('id',34).single();if(re)throw new Error(re.code);assert.equal(hash(publicRow),hash(after));
  const receipt={verifiedAt:new Date().toISOString(),id:34,title:after.title,url:'https://lcs-science-portal.vercel.app/dashboard/module/34',maxId:max[0]?.id,totalModules:inventory.length,otherModulesUnchanged:inventory.length-1,preservedUserEdits:inventory.filter(m=>[33,35].includes(m.id)).map(m=>({id:m.id,hash:hash(m)})),beforeHash:hash(before),afterHash:hash(after),published:after.is_published,publicReadVerified:true};
  writeFileSync(new URL('../content/modules/module34-replacement-20261027.receipt.json',import.meta.url),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
}
run().catch(error=>{console.error(error.message);process.exitCode=1;});
