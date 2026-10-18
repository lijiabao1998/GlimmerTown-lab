'use strict';

// No game/browser tests here. These fixtures exercise the CI proof decision and
// its real Git tree/ancestry checks, including deliberate broken evidence.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { WORKFLOW, MAX_WAIT_MS, POLL_MS, JOB_STEPS, decideReuse, githubApi, inspectTree, snapshot, publish } = require('./reuse-push-ci.cjs');
const H = 'a'.repeat(40), B = 'b'.repeat(40), M = 'c'.repeat(40), T = 'd'.repeat(40), X = 'e'.repeat(40);
const REPO = 'owner/repo';
const clone = x => structuredClone(x);
function fixture() {
  const f = {
    env: { GITHUB_EVENT_NAME: 'pull_request', GITHUB_REPOSITORY: REPO,
      GITHUB_SHA: M, GITHUB_WORKFLOW_SHA: M, GITHUB_RUN_ID: '200',
      GITHUB_REF: 'refs/pull/7/merge', GITHUB_WORKFLOW_REF: `${REPO}/${WORKFLOW}@refs/pull/7/merge` },
    pr: { number: 7, state: 'open', merge_commit_sha: M,
      head: { sha: H, ref: 'gpt/example', repo: { full_name: REPO } },
      base: { sha: B, ref: 'main', repo: { full_name: REPO } } },
    current: { id: 200, event: 'pull_request', workflow_id: 99, path: WORKFLOW, head_sha: H, repository: { full_name: REPO } },
    run: { id: 100, event: 'push', workflow_id: 99, path: WORKFLOW, head_sha: H,
      head_branch: 'gpt/example', run_attempt: 1, status: 'completed', conclusion: 'success',
      repository: { full_name: REPO }, head_repository: { full_name: REPO } },
    calls: [], sleeps: [], clock: 0,
  };
  f.event = { pull_request: clone(f.pr) };
  f.jobs = { total_count: 3, jobs: Object.entries(JOB_STEPS).map(([name, required], i) => ({
    id: 1000 + i, name, run_id: 100, run_attempt: 1, head_sha: H, workflow_name: 'smoke',
    status: 'completed', conclusion: 'success', steps: [...required, ...(name === 'fp' ? [`CI fp base ${B}`] : [])]
      .map(name => ({ name, status: 'completed', conclusion: 'success' })),
  })) };
  f.gitValues = new Map([
    ['rev-parse HEAD', M], [`show -s --format=%P ${M}`, `${B} ${H}`],
    [`merge-base --is-ancestor ${B} ${H}`, ''], [`rev-parse ${H}^{tree}`, T], [`rev-parse ${M}^{tree}`, T],
    [`show ${M}:${WORKFLOW}`, 'same workflow\n'], [`show ${H}:${WORKFLOW}`, 'same workflow\n'],
  ]);
  f.git = args => {
    const key = args.join(' ');
    if (!f.gitValues.has(key)) throw new Error('git missing object');
    const value = f.gitValues.get(key);
    if (value instanceof Error) throw value;
    return value;
  };
  f.api = async route => {
    f.calls.push(route);
    if (f.interceptor) {
      const changed = f.interceptor(route, f);
      if (changed !== undefined) return clone(changed);
    }
    if (route === `/repos/${REPO}/pulls/7`) return clone(f.pr);
    if (route === `/repos/${REPO}/actions/runs/200`) return clone(f.current);
    if (route === `/repos/${REPO}/actions/runs/100`) return clone(f.run);
    if (route.startsWith(`/repos/${REPO}/actions/workflows/99/runs?`)) return { workflow_runs: f.list ?? [clone(f.run)] };
    if (route === `/repos/${REPO}/actions/runs/100/attempts/1/jobs?per_page=100`) return clone(f.jobs);
    throw new Error('unexpected route');
  };
  f.decide = (options = {}) => decideReuse({ env: f.env, event: f.event, git: f.git, api: f.api,
    now: () => f.clock, sleep: async ms => { f.sleeps.push(ms); f.clock += ms; }, waitMs: 0, ...options });
  return f;
}

async function rejected(mutator, options) {
  const f = fixture();
  mutator(f);
  const result = await f.decide(options);
  assert.equal(result.reuse, false, JSON.stringify(result));
  return { f, result };
}

test('exact same tree, workflow, baseline and full successful jobs can be reused', async () => {
  const f = fixture();
  const result = await f.decide();
  assert.equal(result.reuse, true);
  assert.equal(result.sourceRunId, 100);
  assert.equal(result.sourceRunUrl, `https://github.com/${REPO}/actions/runs/100/attempts/1`);
  assert.equal(result.head, H); assert.equal(result.base, B); assert.equal(result.tree, T);
  assert.equal(result.jobs.length, 3);
  assert.match(result.workflowDigest, /^[a-f0-9]{64}$/);
  assert.equal(f.calls.filter(x => x.endsWith('/pulls/7')).length, 2);
});

test('each existing job confirms the same full proof without waiting', async () => {
  const f = fixture();
  assert.equal((await f.decide({ sourceRunId: '100' })).reuse, true);
  assert.equal(f.sleeps.length, 0);
  assert.equal(f.calls.some(x => x.includes('/workflows/')), false);
});

for (const event of ['push', 'workflow_dispatch', 'pull_request_target']) test(`never skips for ${event}`, async () => {
  const { f } = await rejected(f => { f.env.GITHUB_EVENT_NAME = event; });
  assert.equal(f.calls.length, 0);
});
for (const branch of ['main', 'claude/test', 'feature/test', 'gpt', 'codex']) test(`ineligible branch ${branch}`, () => rejected(f => { f.event.pull_request.head.ref = branch; }));
for (const branch of ['codex/test', 'grok/test', 'glm/test', 'kimi/test', 'gpt/test', 'dsk/test']) test(`eligible writer branch ${branch}`, async () => {
  const f = fixture(); f.event.pull_request.head.ref = f.pr.head.ref = f.run.head_branch = branch;
  assert.equal((await f.decide()).reuse, true);
});
for (const side of ['head', 'base']) test(`fork or other repository in ${side}`, () => rejected(f => { f.event.pull_request[side].repo.full_name = 'fork/repo'; }));
for (const key of ['GITHUB_SHA', 'GITHUB_WORKFLOW_SHA']) test(`missing or invalid ${key}`, () => rejected(f => { f.env[key] = 'bad'; }));
test('non-main base', () => rejected(f => { f.event.pull_request.base.ref = 'release'; }));
test('head checkout cannot masquerade as PR merge checkout', () => rejected(f => { f.env.GITHUB_REF = 'refs/heads/gpt/example'; }));
test('different executing workflow ref', () => rejected(f => { f.env.GITHUB_WORKFLOW_REF = `${REPO}/evil.yml@refs/pull/7/merge`; }));
for (const [key, value] of [
  ['rev-parse HEAD', X], [`show -s --format=%P ${M}`, `${X} ${H}`],
  [`show -s --format=%P ${M}`, `${B} ${X}`], [`show -s --format=%P ${M}`, H],
  [`merge-base --is-ancestor ${B} ${H}`, new Error('not ancestor')],
  [`rev-parse ${M}^{tree}`, X], [`show ${H}:${WORKFLOW}`, 'different source workflow'],
]) test(`reject Git proof: ${key} = ${value}`, () => rejected(f => { f.gitValues.set(key, value); }));
test('executed workflow version differs even if PR head/merge agree', () => rejected(f => {
  f.env.GITHUB_WORKFLOW_SHA = X; f.gitValues.set(`show ${X}:${WORKFLOW}`, 'older workflow');
}));
for (const [key, value] of [['workflow_id', 88], ['path', '.github/workflows/fake.yml'], ['head_sha', X], ['event', 'workflow_dispatch'], ['id', 201]]) {
  test(`wrong current workflow ${key}`, () => rejected(f => { f.current[key] = value; }));
}
for (const [key, value] of [['workflow_id', 88], ['path', '.github/workflows/fake.yml'], ['head_sha', X], ['head_branch', 'gpt/other'], ['event', 'pull_request'], ['run_attempt', 0], ['id', 200]]) {
  test(`spoofed source ${key}`, () => rejected(f => { f.run[key] = value; }));
}
test('other source repository', () => rejected(f => { f.run.repository.full_name = 'fork/repo'; }));
test('source head from a fork', () => rejected(f => { f.run.head_repository.full_name = 'fork/repo'; }));
for (const conclusion of ['failure', 'cancelled', 'skipped', 'neutral', 'timed_out', null]) test(`run ${conclusion} is not success`, () => rejected(f => { f.run.conclusion = conclusion; }));
for (const status of ['queued', 'in_progress', 'waiting', 'pending']) test(`run ${status} is not completed`, () => rejected(f => { f.run.status = status; }));
for (const name of Object.keys(JOB_STEPS)) {
  for (const conclusion of ['failure', 'cancelled', 'skipped', null]) test(`${name} ${conclusion} is not success`, () => rejected(f => {
    f.jobs.jobs.find(x => x.name === name).conclusion = conclusion;
  }));
  test(`${name} pending with spoofed success is rejected`, () => rejected(f => { f.jobs.jobs.find(x => x.name === name).status = 'in_progress'; }));
  test(`${name} is required`, () => rejected(f => { f.jobs.jobs = f.jobs.jobs.filter(x => x.name !== name); f.jobs.total_count--; }));
  for (const [key, value] of [['run_id', 101], ['run_attempt', 2], ['head_sha', X], ['workflow_name', 'fake'], ['id', null]]) {
    test(`${name} wrong ${key}`, () => rejected(f => { f.jobs.jobs.find(x => x.name === name)[key] = value; }));
  }
  for (const step of JOB_STEPS[name]) {
    test(`${name} actual step must run: ${step}`, () => rejected(f => {
      f.jobs.jobs.find(x => x.name === name).steps.find(x => x.name === step).conclusion = 'skipped';
    }));
  }
}
test('duplicate job names are ambiguous', () => rejected(f => { f.jobs.jobs.push(clone(f.jobs.jobs[0])); f.jobs.total_count++; }));
test('partial jobs page is not enough', () => rejected(f => { f.jobs.total_count = 4; }));
test('missing jobs list', () => rejected(f => { f.jobs = {}; }));
test('missing steps list', () => rejected(f => { delete f.jobs.jobs[0].steps; }));
test('duplicate successful step is ambiguous', () => rejected(f => { f.jobs.jobs[0].steps.push(clone(f.jobs.jobs[0].steps[0])); }));
test('actual fp base must equal PR base, not merely share the same tree', () => rejected(f => {
  f.jobs.jobs[1].steps.find(x => x.name.startsWith('CI fp base')).name = `CI fp base ${X}`;
}));
test('missing fp base evidence from old workflow forces full checks', () => rejected(f => { f.jobs.jobs[1].steps.pop(); }));
test('same-name fake success with no test steps cannot skip', () => rejected(f => { for (const job of f.jobs.jobs) job.steps = []; }));
for (const side of ['head', 'base']) test(`PR ${side} changed before decision`, () => rejected(f => { f.pr[side].sha = X; }));
test('closed PR forces full checks', () => rejected(f => { f.pr.state = 'closed'; }));
test('merge commit refreshed or unknown', () => rejected(f => { f.pr.merge_commit_sha = null; }));
for (const side of ['head', 'base']) test(`PR ${side} race during jobs fetch`, () => rejected(f => {
  f.interceptor = route => { if (route.includes('/jobs?')) f.pr[side].sha = X; };
}));
test('rerun starts during jobs fetch', () => rejected(f => {
  f.interceptor = route => { if (route.includes('/jobs?')) { f.run.run_attempt = 2; f.run.status = 'in_progress'; } };
}));
test('rerun changes between listing and run details', () => rejected(f => {
  f.list = [clone(f.run)]; f.run.run_attempt = 2;
}));
test('checkout changes during API verification', () => rejected(f => {
  f.interceptor = route => { if (route.includes('/jobs?')) f.gitValues.set('rev-parse HEAD', X); };
}));
test('never hides a newer failure behind an older successful run', () => rejected(f => {
  f.list = [clone(f.run), { ...clone(f.run), id: 101, conclusion: 'failure' }];
}));
test('API denial/outage on any proof request falls back', async () => {
  for (const marker of ['/runs/200', '/pulls/7', '/workflows/', '/runs/100', '/jobs?']) {
    await rejected(f => { f.interceptor = route => { if (route.includes(marker)) throw new Error('403 or outage'); }; });
  }
});
test('malformed list falls back', () => rejected(f => { f.interceptor = route => route.includes('/workflows/') ? {} : undefined; }));
test('source absent waits at most 25 minutes with bounded polls', async () => {
  const { f } = await rejected(f => { f.list = []; }, { waitMs: MAX_WAIT_MS * 10 });
  assert.equal(f.clock, MAX_WAIT_MS);
  assert.equal(f.sleeps.length, MAX_WAIT_MS / POLL_MS);
  assert.ok(f.calls.length < 160);
});
test('pending push eventually succeeds and is verified', async () => {
  const f = fixture(); f.run.status = 'in_progress';
  f.interceptor = () => { if (f.clock >= POLL_MS * 2) f.run.status = 'completed'; };
  assert.equal((await f.decide({ waitMs: MAX_WAIT_MS })).reuse, true);
  assert.equal(f.clock, POLL_MS * 2);
});
test('pending push fails during wait and triggers immediate full checks', async () => {
  const { f } = await rejected(f => {
    f.run.status = 'in_progress';
    f.interceptor = () => { if (f.clock >= POLL_MS) { f.run.status = 'completed'; f.run.conclusion = 'failure'; } };
  }, { waitMs: MAX_WAIT_MS });
  assert.equal(f.clock, POLL_MS);
});
test('confirmation never polls pending source', async () => {
  const { f } = await rejected(f => { f.run.status = 'in_progress'; }, { sourceRunId: '100' });
  assert.equal(f.sleeps.length, 0);
});
test('confirmation rejects invalid source ID', () => rejected(() => {}, { sourceRunId: '100\nreuse=true' }));

test('API wrapper is read-only, rejects redirects, limits calls, and keeps token out of URL', async () => {
  const env = { GITHUB_REPOSITORY: REPO, GITHUB_API_URL: 'https://api.github.com', GITHUB_TOKEN: 'test-secret' };
  const calls = [];
  const api = githubApi(env, { fetchImpl: async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => ({ ok: true }) }; } });
  for (let i = 0; i < 160; i++) await api(`/repos/${REPO}/pulls/7`);
  await assert.rejects(api(`/repos/${REPO}/pulls/7`), /budget/);
  assert.equal(calls.length, 160);
  for (const { url, options } of calls) {
    assert.equal(url.includes('test-secret'), false);
    assert.equal(options.redirect, 'error');
    assert.equal(options.method, undefined); // fetch default GET
    assert.equal(options.headers.Authorization, 'Bearer test-secret');
    assert.ok(options.signal instanceof AbortSignal);
  }
});
test('API wrapper rejects bad configuration, exhausted time, and non-2xx', async () => {
  const env = { GITHUB_REPOSITORY: REPO, GITHUB_API_URL: 'https://api.github.com', GITHUB_TOKEN: 'test-secret' };
  const fake = { fetchImpl: async () => ({ ok: false }) };
  await assert.rejects(githubApi(env, fake)(`/repos/${REPO}/pulls/7`));
  await assert.rejects(githubApi({ ...env, GITHUB_API_URL: 'https://evil.example' }, fake)(`/repos/${REPO}/pulls/7`));
  await assert.rejects(githubApi({ ...env, GITHUB_TOKEN: '' }, fake)(`/repos/${REPO}/pulls/7`));
  await assert.rejects(githubApi(env, fake)('/repos/other/repo/pulls/7'));
  await assert.rejects(githubApi(env, { ...fake, budget: 0 })(`/repos/${REPO}/pulls/7`));
});

test('real Git: fast-forwardable merge tree passes; changed merge tree or stale base does not', () => {
  const dir = fs.mkdtempSync(path.join(__dirname, '.reuse-test-'));
  const git = args => execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trimEnd();
  try {
    git(['init', '-q']); git(['config', 'user.name', 'CI fixture']); git(['config', 'user.email', 'ci@example.invalid']);
    fs.mkdirSync(path.join(dir, '.github/workflows'), { recursive: true });
    fs.writeFileSync(path.join(dir, WORKFLOW), 'name: smoke\n');
    git(['add', '.']); git(['commit', '-qm', 'base']); const base = git(['rev-parse', 'HEAD']);
    git(['checkout', '-qb', 'gpt/test']); fs.writeFileSync(path.join(dir, 'fixture.txt'), 'head');
    git(['add', '.']); git(['commit', '-qm', 'head']); const head = git(['rev-parse', 'HEAD']);
    git(['checkout', '-qb', 'merge', base]); git(['merge', '--no-ff', 'gpt/test', '-m', 'test merge']);
    const merge = git(['rev-parse', 'HEAD']);
    const s = { base, head, merge, workflowSha: merge };
    assert.equal(inspectTree(s, git).tree, git(['rev-parse', `${head}^{tree}`]));
    fs.writeFileSync(path.join(dir, 'fixture.txt'), 'different merge tree'); git(['add', '.']);
    git(['commit', '--amend', '--no-edit']); const changed = git(['rev-parse', 'HEAD']);
    assert.throws(() => inspectTree({ ...s, merge: changed, workflowSha: changed }, git), /tree differs/);
    git(['checkout', '-qb', 'advanced-base', base]); fs.writeFileSync(path.join(dir, 'base-only.txt'), 'advanced base');
    git(['add', '.']); git(['commit', '-qm', 'base advanced']); const advanced = git(['rev-parse', 'HEAD']);
    git(['merge', '--no-ff', 'gpt/test', '-m', 'diverged merge']); const diverged = git(['rev-parse', 'HEAD']);
    assert.throws(() => inspectTree({ ...s, base: advanced, merge: diverged, workflowSha: diverged }, git));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('summary persists validated provenance; fallback output is explicitly false', async () => {
  const dir = fs.mkdtempSync(path.join(__dirname, '.reuse-output-'));
  try {
    const env = { GITHUB_OUTPUT: path.join(dir, 'outputs'), GITHUB_STEP_SUMMARY: path.join(dir, 'summary') };
    publish(await fixture().decide(), env);
    const summary = fs.readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8');
    for (const value of [H, B, M, T, 'fiscal-load', 'workflowDigest', 'attempts/1']) assert.ok(summary.includes(value));
    assert.equal(fs.readFileSync(env.GITHUB_OUTPUT, 'utf8'), 'reuse=true\nsource_run_id=100\n');
    publish({ reuse: false, reason: 'API unavailable' }, env);
    assert.match(fs.readFileSync(env.GITHUB_OUTPUT, 'utf8'), /reuse=false\nsource_run_id=\n$/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('trailing workflow-byte difference rejects reuse', () => rejected(f => {
  f.gitValues.set(`show ${H}:${WORKFLOW}`, 'same workflow\n\n');
}));

test('workflow keeps original commands, artifacts, limits, triggers and permission scope', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '..', 'workflows', 'smoke.yml'), 'utf8');
  const originalCommands = [
    'node smoke.js 2>&1 | tee smoke-run.txt; exit ${PIPESTATUS[0]}',
    'node smoke.js 2>&1 | tee smoke-run-2.txt',
    'node smoke.js 2>&1 | tee smoke-run-3.txt',
    'node fp.js --check --report-base="$RUNNER_TEMP/fp-base.json" --report-base-style="$RUNNER_TEMP/style-base.json" --dump=fp-rebake 2>&1 | tee fp-run.txt; exit ${PIPESTATUS[0]}',
    'node probeFiscalLoad026.cjs',
  ];
  for (const command of originalCommands) assert.ok(workflow.includes(command), command);
  for (const [name, required] of Object.entries(JOB_STEPS)) {
    for (const step of required) assert.ok(workflow.includes(`- name: ${step}`), `${name}/${step}`);
  }
  assert.ok(workflow.includes("branches: [main, 'claude/**', 'codex/**', 'grok/**', 'glm/**', 'kimi/**', 'gpt/**', 'dsk/**']"));
  assert.equal((workflow.match(/paths-ignore: \['\*\*\.md', 'docs\/\*\*'\]/g) || []).length, 2);
  assert.equal((workflow.match(/permissions:/g) || []).length, 1);
  assert.ok(workflow.includes('permissions:\n      contents: read'));
  assert.equal((workflow.match(/timeout-minutes: 15/g) || []).length, 2);
  assert.equal((workflow.match(/timeout-minutes: 25/g) || []).length, 1);
  assert.equal((workflow.match(/retention-days: 14/g) || []).length, 3);
  assert.ok(workflow.includes('group: smoke-${{ github.ref }}\n  cancel-in-progress: true'));
  assert.equal((workflow.match(/if: always\(\) && steps\.reuse\.outputs\.reuse != 'true'/g) || []).length, 3);
  assert.equal((workflow.match(/github\.event_name == 'pull_request' && needs\.reuse-push\.outputs\.reuse == 'true'/g) || []).length, 3);
  assert.ok(!workflow.includes('pull_request_target'));
  assert.ok(!workflow.includes('actions: read'));
  assert.ok(!workflow.includes('gh run cancel'));
});
