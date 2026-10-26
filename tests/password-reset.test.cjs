/* eslint-disable @typescript-eslint/no-require-imports -- Node's built-in test runner uses CommonJS here. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const recoveryCode = 'test-only-recovery-credential-0123456789ABC';
const studentId = '00000000-0000-4000-8000-000000000001';
const teacherId = '00000000-0000-4000-8000-000000000002';

// Compile the real action modules in memory, replacing only external dependencies.
function loadActions(file, dependencies, env) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    process: { env },
    require(name) {
      if (name === 'node:crypto') return require(name);
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  }, { filename: file });
  return exports;
}

function setup(options = {}) {
  const calls = { updates: [], pages: [], admin: 0 };
  const users = options.users ?? [{ id: studentId, email: 'student@scienceportal.local' }];
  const roles = options.roles ?? { [studentId]: 'student', [teacherId]: 'teacher' };
  const profiles = () => {
    let id;
    return {
      select() { return this; },
      eq(_column, value) { id = value; return this; },
      async single() {
        return { data: roles[id] ? { role: roles[id] } : null, error: options.profileError ?? null };
      },
    };
  };
  const admin = {
    from: profiles,
    auth: { admin: {
      async listUsers({ page, perPage }) {
        calls.pages.push(page);
        if (options.throwList) throw new Error('PRIVATE backend connection details');
        return { data: { users: users.slice((page - 1) * perPage, page * perPage) }, error: options.listError ?? null };
      },
      async updateUserById(id, value) {
        calls.updates.push({ id, ...value });
        if (options.throwUpdate) throw new Error('PRIVATE service-role credential');
        return { data: { user: options.emptyUpdate ? null : { id } }, error: options.updateError ?? null };
      },
    } },
  };
  const client = {
    from: profiles,
    auth: { async getUser() {
      if (options.throwAuth) throw new Error('PRIVATE auth details');
      return { data: { user: options.loggedOut ? null : { id: options.callerId ?? teacherId } }, error: null };
    } },
  };
  const env = { PASSWORD_RESET_ACCESS_CODE: recoveryCode, TEACHER_ACCESS_CODE: 'signup-only', ...options.env };
  const actions = loadActions('src/app/(auth)/reset-password/actions.ts', {
    '@/lib/supabase/server': { createClient: async () => client },
    '@/lib/supabase/admin': { createAdminClient() { calls.admin++; return admin; } },
  }, env);
  return { actions, calls };
}

test('logged-in teacher can reset a student', async () => {
  const { actions, calls } = setup();
  assert.equal((await actions.resetStudentPassword(studentId, 'new-password')).success, true);
  assert.equal(calls.updates[0].id, studentId);
});

test('anonymous callers, students, and missing profiles cannot use teacher reset', async () => {
  for (const options of [{ loggedOut: true }, { callerId: studentId }, { roles: {} }, { profileError: {} }]) {
    const { actions, calls } = setup(options);
    assert.ok((await actions.resetStudentPassword(studentId, 'new-password')).error);
    assert.equal(calls.updates.length, 0);
  }
});

test('teacher reset refuses teacher and nonexistent targets', async () => {
  const { actions, calls } = setup();
  for (const id of [teacherId, '00000000-0000-4000-8000-000000000099']) {
    assert.ok((await actions.resetStudentPassword(id, 'new-password')).error);
  }
  assert.equal(calls.updates.length, 0);
});

test('all public reset entry points reject fallback, signup, missing, and invalid recovery codes', async () => {
  for (const options of [
    {},
    { env: { PASSWORD_RESET_ACCESS_CODE: undefined } },
    { env: { PASSWORD_RESET_ACCESS_CODE: 'short' } },
    { env: { TEACHER_ACCESS_CODE: recoveryCode } },
  ]) {
    const { actions, calls } = setup(options);
    for (const code of ['BUKAPINTU', 'GURU2024', 'signup-only', '', null, 123, {}, 'x'.repeat(257)]) {
      for (const reset of [actions.resetStudentPasswordPublic, actions.resetTeacherPassword]) {
        assert.ok((await reset('student', code, 'new-password')).error);
      }
    }
    if (options.env) assert.ok((await actions.resetStudentPasswordPublic('student', recoveryCode, 'new-password')).error);
    assert.equal(calls.admin, 0);
  }
});

test('public reset finds a normalized username beyond page one', async () => {
  const users = Array.from({ length: 1100 }, (_, i) => ({ id: `other-${i}`, email: `other${i}@scienceportal.local` }));
  users.push({ id: studentId, email: 'Student@scienceportal.local' });
  const { actions, calls } = setup({ users });
  assert.equal((await actions.resetStudentPasswordPublic(' STUDENT ', recoveryCode, 'new-password')).success, true);
  assert.equal(calls.pages.length, 12);
  assert.equal(calls.updates.length, 1);
});

test('public reset enforces target role and does not trust user metadata', async () => {
  const users = [{ id: teacherId, email: 'teacher@scienceportal.local', user_metadata: { role: 'student' } }];
  const { actions, calls } = setup({ users });
  assert.ok((await actions.resetStudentPasswordPublic('teacher', recoveryCode, 'new-password')).error);
  assert.equal((await actions.resetTeacherPassword('teacher', recoveryCode, 'new-password')).success, true);
  assert.equal(calls.updates.length, 1);
  const forged = setup({ users, roles: { [teacherId]: 'student' } });
  assert.ok((await forged.actions.resetTeacherPassword('teacher', recoveryCode, 'new-password')).error);
  assert.equal(forged.calls.updates.length, 0);
});

test('unknown username terminates even when the final page is full', async () => {
  const users = Array.from({ length: 100 }, (_, i) => ({ id: `${i}`, email: `${i}@scienceportal.local` }));
  const { actions, calls } = setup({ users });
  assert.ok((await actions.resetStudentPasswordPublic('missing', recoveryCode, 'new-password')).error);
  assert.equal(calls.pages.length, 2);
  assert.equal(calls.updates.length, 0);
});

test('malformed inputs and invalid passwords never mutate an account', async () => {
  const { actions, calls } = setup();
  for (const password of [null, 123456, {}, '', '12345', 'x'.repeat(129)]) {
    assert.ok((await actions.resetStudentPassword(studentId, password)).error);
    assert.ok((await actions.resetStudentPasswordPublic('student', recoveryCode, password)).error);
  }
  for (const username of [null, {}, '', ' ', 'student@example.com', 'two words', 'x'.repeat(65)]) {
    assert.ok((await actions.resetTeacherPassword(username, recoveryCode, 'new-password')).error);
  }
  assert.ok((await actions.resetStudentPassword('not-a-uuid', 'new-password')).error);
  assert.equal(calls.admin, 0);
});

test('backend failures are handled without leaking internal details or reporting success', async () => {
  for (const options of [
    { throwList: true }, { listError: { message: 'PRIVATE API key' } },
    { throwUpdate: true }, { updateError: { message: 'PRIVATE API key' } },
    { profileError: { message: 'PRIVATE SQL error' } }, { emptyUpdate: true },
  ]) {
    const { actions } = setup(options);
    const result = await actions.resetStudentPasswordPublic('student', recoveryCode, 'new-password');
    assert.ok(result.error);
    assert.ok(!result.error.includes('PRIVATE'));
    assert.ok(!result.success);
  }
  const { actions } = setup({ throwAuth: true });
  assert.ok((await actions.resetStudentPassword(studentId, 'new-password')).error);
});

test('password policy errors have useful messages', async () => {
  for (const code of ['weak_password', 'same_password']) {
    const { actions } = setup({ updateError: { code } });
    const result = await actions.resetStudentPassword(studentId, 'new-password');
    assert.match(result.error, /Password/);
  }
});

test('teacher signup rejects fallback codes and grants roles only through the admin client', async () => {
  let signups = 0;
  let promotions = 0;
  const actions = loadActions('src/app/(auth)/actions.ts', {
    'next/navigation': { redirect() { throw new Error('REDIRECT'); } },
    '@/lib/supabase/server': { createClient: async () => ({ auth: {
      async signUp(input) {
        signups++;
        assert.equal(input.options.data.role, 'student');
        return { data: { user: { id: teacherId, identities: [{}] } }, error: null };
      },
      async getUser() { return { data: { user: null } }; },
    } }) },
    '@/lib/supabase/admin': { createAdminClient: () => ({ from: () => ({
      update(value) { assert.equal(value.role, 'teacher'); return this; },
      eq(_column, id) { assert.equal(id, teacherId); return this; },
      select() { return this; },
      async single() { promotions++; return { error: null }; },
    }) }) },
  }, { TEACHER_ACCESS_CODE: 'configured-code' });
  const form = new FormData();
  form.set('username', 'teacher');
  form.set('role', 'teacher');
  for (const code of ['BUKAPINTU', 'GURU2024']) {
    form.set('teacherCode', code);
    assert.ok((await actions.registerAction(form)).error);
  }
  assert.equal(signups, 0);
  form.set('teacherCode', 'configured-code');
  await assert.rejects(actions.registerAction(form), /REDIRECT/);
  assert.equal(signups, 1);
  assert.equal(promotions, 1);
});
