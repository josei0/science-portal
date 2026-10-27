import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { modules } from '../content/modules/sd13-discovery-20261026.mjs';

const require = createRequire(import.meta.url);
function renderComponent(file, props, runEffects = false) {
  const state = [], effects = [];
  let cursor = 0;
  const react = { ...React,
    useState: initial => { const i = cursor++; if (!(i in state)) state[i] = typeof initial === 'function' ? initial() : initial; return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value; }]; },
    useEffect: effect => effects.push(effect),
  };
  const compiled = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const exports = {};
  const loader = name => {
    if (name === 'react') return react;
    if (name === 'framer-motion') return {
      motion: new Proxy({}, { get: (_, tag) => props => {
        const domProps = Object.fromEntries(Object.entries(props).filter(([key]) => !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'layout'].includes(key)));
        return React.createElement(tag, domProps);
      } }),
      AnimatePresence: React.Fragment,
    };
    if (name === '../../../actions') return { submitGameScore: () => { throw new Error('This check must never submit scores'); } };
    if (name === '@/lib/audio') return { sfx: new Proxy({}, { get: () => () => {} }) };
    return require(name);
  };
  runInNewContext(compiled, { exports, require: loader, console, setTimeout, clearTimeout });
  let tree = exports.default(props);
  if (runEffects) {
    effects.splice(0).forEach(effect => effect());
    cursor = 0;
    tree = exports.default(props);
  }
  return renderToStaticMarkup(tree);
}
const editorPath = 'src/app/dashboard/teacher/materials/components/';
const games = { sequence: 'SequenceGame', fill_blanks: 'FillBlanksGame', dynamic_match: 'DynamicMatch' };
for (const m of modules) {
  const editor = renderComponent(`${editorPath}GameBuilder.tsx`, { gameType: m.game_type, data: m.game_data, onChange: () => {} });
  const quiz = renderComponent(`${editorPath}QuizBuilder.tsx`, { data: m.quiz_data, onChange: () => {} });
  assert.equal((quiz.match(/<textarea\b/g) ?? []).length, 6);
  if (m.game_type === 'fill_blanks') {
    assert.equal((editor.match(/<textarea\b/g) ?? []).length, 8);
    assert.doesNotMatch(editor, /Belum ada soal/);
    for (const q of m.game_data.fill_blanks) assert.ok(editor.includes(q.sentence));
  } else if (m.game_type === 'sequence') {
    for (const item of m.game_data.sequence) assert.ok(editor.includes(item.content));
  } else {
    for (const pair of m.game_data.dynamic_match.pairs) for (const item of pair.items) assert.ok(editor.includes(item));
  }
  const game = renderComponent(`src/app/dashboard/module/[id]/games/${games[m.game_type]}.tsx`, {
    materialId: 0, currentHighscore: 0, gameData: m.game_data, onProgressUpdate: () => {},
  }, true);
  assert.doesNotMatch(game, /Example A|Apple|Fotosintesis|>First</);
  if (m.game_type === 'sequence') for (const item of m.game_data.sequence) assert.ok(game.includes(item.content));
  if (m.game_type === 'dynamic_match') for (const p of m.game_data.dynamic_match.pairs) for (const item of p.items) assert.ok(game.includes(item));
  if (m.game_type === 'fill_blanks') {
    for (const q of m.game_data.fill_blanks) assert.ok(game.includes(q.answer));
    assert.ok(game.includes(m.game_data.fill_blanks[0].sentence.split('[BLANK]')[0].trim()));
    assert.doesNotMatch(game, /\[BLANK\]|\[b\d\]/);
  }
  console.log(`PASS: ${m.title} — actual teacher editor, 6-question quiz editor, student game initialization`);
}
