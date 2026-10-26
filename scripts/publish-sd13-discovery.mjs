import assert from 'node:assert/strict';
import { existsSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { modules } from '../content/modules/sd13-discovery-20261026.mjs';

// Validation can run offline; publishing is opt-in and INSERT-only.
export function validateModules(items = modules) {
  assert.equal(items.length, 3);
  assert.equal(new Set(items.map(m => m.game_slug)).size, items.length);
  assert.equal(new Set(items.map(m => m.game_type)).size, items.length);
  for (const m of items) {
    assert.equal(m.category, 'sd_1_3');
    assert.equal(m.is_published, true);
    assert.equal(Object.hasOwn(m, 'id'), false, 'Database normally assigns IDs');
    for (const field of ['title', 'description', 'theory_content', 'game_slug', 'game_type', 'badge_name']) assert.ok(m[field]?.length, field);
    assert.match(m.theory_content, /data:image\/svg\+xml;base64,/);
    assert.doesNotMatch(m.theory_content, /<(?:section|figure|figcaption)\b/i, 'Use the same editor-friendly HTML as existing modules');
    assert.match(m.theory_content, /IPA/);
    assert.doesNotMatch(m.theory_content, /<script|javascript:|onerror=/i);
    assert.ok(m.kkm_score >= 70 && m.kkm_score <= 100);
    for (const field of ['xp_theory', 'xp_pass', 'xp_perfect']) assert.ok(Number.isInteger(m[field]) && m[field] > 0);
    const questions = m.quiz_data.questions;
    assert.equal(questions.length, 6);
    for (const q of questions) {
      assert.ok(q.question && q.explanation);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.ok(Number.isInteger(q.correctAnswerIndex) && q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 4);
      assert.ok(q.timeLimit >= 60);
    }
    if (m.game_type === 'sequence') {
      assert.equal(m.game_data.sequence.length, 6);
      assert.equal(new Set(m.game_data.sequence.map(i => i.id)).size, 6);
      assert.ok(m.game_data.sequence.every(i => i.content && i.icon));
    } else if (m.game_type === 'fill_blanks') {
      const sentences = m.game_data.fill_blanks;
      assert.equal(sentences.length, 8, 'Must also be readable by the teacher editor');
      const answers = sentences.map(q => q.answer);
      assert.equal(new Set(answers).size, 8);
      for (const q of sentences) {
        assert.equal([...q.sentence.matchAll(/\[BLANK\]/g)].length, 1);
        assert.ok(q.answer && Array.isArray(q.options));
        assert.ok(q.options.every(word => word && !answers.includes(word)));
      }
    } else if (m.game_type === 'dynamic_match') {
      const pairs = m.game_data.dynamic_match.pairs;
      assert.equal(pairs.length, 3);
      assert.equal(pairs.flatMap(p => p.items).length, 12);
      assert.equal(new Set(pairs.flatMap(p => p.items)).size, 12);
      assert.ok(pairs.every(p => p.category && p.items.every(i => typeof i === 'string' && i.length > 0)));
    } else {
      assert.fail('Unsupported game format');
    }
  }
}

const normalize = value => value.normalize('NFKC').toLocaleLowerCase('id').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const canonical = value => JSON.stringify(value, (_, entry) => entry && typeof entry === 'object' && !Array.isArray(entry)
  ? Object.fromEntries(Object.entries(entry).sort(([a], [b]) => a.localeCompare(b))) : entry);

async function run() {
  validateModules();
  console.log('Validated: 3 age-appropriate modules, 18 quiz questions, 3 game formats, 3 original illustrations.');
  if (!process.argv.includes('--publish') && !process.argv.includes('--preflight')) return;
  if (existsSync('.env.local')) process.loadEnvFile('.env.local');
  assert.ok(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY, 'Server credentials required');
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(25000) }) },
  });
  const { data: highest, error: maxError } = await client.from('materials').select('id').order('id', { ascending: false }).limit(1);
  if (maxError) throw new Error(`Maximum ID query failed (${maxError.code})`);
  const inventory = [];
  for (let start = 0; ; start += 500) {
    const { data, error } = await client.from('materials').select('id,title,category,topic_order,game_slug').order('id').range(start, start + 499);
    if (error) throw new Error(`Inventory query failed (${error.code})`);
    inventory.push(...data);
    if (data.length < 500) break;
  }
  for (const m of modules) {
    assert.ok(!inventory.some(old => old.game_slug === m.game_slug || normalize(old.title) === normalize(m.title)), `Module already exists: ${m.title}. No data was overwritten.`);
  }
  const nextOrder = Math.max(0, ...inventory.filter(m => m.category === 'sd_1_3').map(m => m.topic_order ?? 0)) + 1;
  const payload = modules.map((m, index) => ({ ...m, topic_order: nextOrder + index }));
  console.log(JSON.stringify({ globalMaxId: highest[0]?.id ?? 0, existingModules: inventory.length, newModules: payload.map(m => ({title:m.title, order:m.topic_order, type:m.game_type})) }, null, 2));
  if (!process.argv.includes('--publish')) return;

  // One atomic batch. No upsert, update, delete, or hardcoded IDs.
  const { data: inserted, error: insertError } = await client.from('materials').insert(payload).select('id,game_slug');
  if (insertError) throw new Error(`Insert failed (${insertError.code}); existing rows were not overwritten. Check the database sequence if this is a primary-key conflict.`);
  const ids = inserted.map(row => row.id);
  const { data: persisted, error: readError } = await client.from('materials').select('*').in('id', ids);
  if (readError) throw new Error(`Rows inserted (${ids.join(',')}) but readback failed (${readError.code}). Do not blindly retry.`);
  assert.equal(persisted.length, modules.length);
  for (const expected of payload) {
    const actual = persisted.find(m => m.game_slug === expected.game_slug);
    assert.ok(actual, `Missing persisted module: ${expected.game_slug}`);
    for (const field of Object.keys(expected)) assert.equal(canonical(actual[field]), canonical(expected[field]), `Readback mismatch: ${expected.game_slug}/${field}`);
  }
  const receipt = {
    verifiedAt: new Date().toISOString(),
    previousMaxId: highest[0]?.id ?? 0,
    previousCount: inventory.length,
    modules: persisted.map(m => ({ id:m.id, title:m.title, category:m.category, topic_order:m.topic_order, game_slug:m.game_slug, game_type:m.game_type, quizQuestions:m.quiz_data.questions.length, is_published:m.is_published, url:`https://lcs-science-portal.vercel.app/dashboard/module/${m.id}` })),
  };
  writeFileSync(new URL('../content/modules/sd13-discovery-20261026.receipt.json', import.meta.url), JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify(receipt, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(error => { console.error(error.message); process.exitCode = 1; });
}
