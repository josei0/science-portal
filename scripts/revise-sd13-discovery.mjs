import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { modules } from '../content/modules/sd13-discovery-20261026.mjs';
import { validateModules } from './publish-sd13-discovery.mjs';

const baseline = JSON.parse(readFileSync(new URL('../content/modules/sd13-discovery-20261026.before-revision.json', import.meta.url)));
const receiptPath = new URL('../content/modules/sd13-discovery-20261026.revision-receipt.json', import.meta.url);
const fields = ['title', 'description', 'theory_content', 'quiz_data', 'game_data'];
const canonical = value => JSON.stringify(value, (_, entry) => entry && typeof entry === 'object' && !Array.isArray(entry)
  ? Object.fromEntries(Object.entries(entry).sort(([a], [b]) => a.localeCompare(b))) : entry);
const hash = value => createHash('sha256').update(canonical(value)).digest('hex');
const normalize = value => value.normalize('NFKC').toLocaleLowerCase('id').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

async function run() {
  validateModules();
  assert.deepEqual(baseline.map(m => m.id).sort(), [33, 34, 35]);
  const planned = modules.map(module => {
    const before = baseline.find(m => m.game_slug === module.game_slug);
    assert.ok(before && before.category === 'sd_1_3');
    const patch = Object.fromEntries(fields.map(field => [field, module[field]]));
    return { before, patch, after: { ...before, ...patch } };
  });
  console.log('Validated revisions: 3 existing modules; only titles, descriptions, theory, quizzes, and game data change.');
  if (!process.argv.includes('--apply') && !process.argv.includes('--preflight')) return;
  if (existsSync('.env.local')) process.loadEnvFile('.env.local');
  assert.ok(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY, 'Server credentials required');
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(25000) }) },
  });
  const { data: highest, error: maxError } = await db.from('materials').select('id').order('id', { ascending: false }).limit(1);
  if (maxError) throw new Error(`Maximum ID query failed (${maxError.code})`);
  const inventory = [];
  for (let start = 0; ; start += 500) {
    const { data, error } = await db.from('materials').select('*').order('id').range(start, start + 499);
    if (error) throw new Error(`Inventory query failed (${error.code})`);
    inventory.push(...data);
    if (data.length < 500) break;
  }
  for (const { before, after } of planned) {
    const actual = inventory.find(m => m.id === before.id);
    assert.ok(actual && (hash(actual) === hash(before) || hash(actual) === hash(after)), `Module ${before.id} changed since review. Reconcile it before updating.`);
    assert.ok(!inventory.some(m => m.id !== before.id && (m.game_slug === after.game_slug || normalize(m.title) === normalize(after.title))), `Duplicate title/slug for ${before.id}`);
  }
  console.log(JSON.stringify({ globalMaxId: highest[0]?.id, totalModules: inventory.length, revisions: planned.map(p => ({ id: p.before.id, title: p.after.title })) }, null, 2));
  if (!process.argv.includes('--apply')) return;
  const receipt = { startedAt: new Date().toISOString(), countBefore: inventory.length, changedFields: fields, modules: [], verified: false };
  // Persist each successful step; a rerun recognises already-applied rows.
  for (const { before, patch, after } of planned) {
    const { data: current, error: currentError } = await db.from('materials').select('*').eq('id', before.id).single();
    if (currentError) throw new Error(`Read failed for ${before.id} (${currentError.code})`);
    if (hash(current) !== hash(after)) {
      assert.equal(hash(current), hash(before), `Module ${before.id} changed during review; stopped.`);
      const { data, error } = await db.from('materials').update(patch).eq('id', before.id).eq('game_slug', before.game_slug).eq('category', 'sd_1_3').eq('title', before.title).select('*').single();
      if (error) throw new Error(`Update failed for ${before.id} (${error.code}); inspect receipt before retrying.`);
      assert.equal(hash(data), hash(after), `Readback mismatch for ${before.id}`);
    }
    receipt.modules.push({ id: before.id, title: after.title, beforeHash: hash(before), afterHash: hash(after), url: `https://lcs-science-portal.vercel.app/dashboard/module/${before.id}` });
    writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
  }
  // Verify all pre-existing rows, including drafts, after the scoped updates.
  for (let start = 0; start < inventory.length; start += 100) {
    const originals = inventory.slice(start, start + 100);
    const { data, error } = await db.from('materials').select('*').in('id', originals.map(m => m.id));
    if (error) throw new Error(`Final verification failed (${error.code})`);
    assert.equal(data.length, originals.length);
    for (const original of originals) {
      const expected = planned.find(p => p.before.id === original.id)?.after ?? original;
      assert.equal(hash(data.find(m => m.id === original.id)), hash(expected), `Unexpected difference for module ${original.id}`);
    }
  }
  receipt.verified = true;
  receipt.verifiedAt = new Date().toISOString();
  receipt.otherModulesUnchanged = inventory.length - planned.length;
  writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify(receipt, null, 2));
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
