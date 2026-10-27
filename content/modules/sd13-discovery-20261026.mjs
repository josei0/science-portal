import { readFileSync } from 'node:fs';
import { livingThingsModule } from './sd13-living-things-20261027.mjs';

// Preserve the user's live edits captured on 27 October. Publication of the
// replacement is scoped to module 34; modules 33 and 35 must not be rewritten.
const edited = JSON.parse(readFileSync(new URL('./sd13-user-edited-20261027.json', import.meta.url)));
const toPayload = ({ id, topic_order, created_at, ...payload }) => payload;
export const modules = [toPayload(edited.find(m => m.id === 33)), livingThingsModule, toPayload(edited.find(m => m.id === 35))];
