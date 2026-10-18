'use strict';

// GPT-034: optimization only. Anything unproven returns reuse=false and the
// original PR tests run. This helper never writes to GitHub or fetches artifacts.
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');

const WORKFLOW = '.github/workflows/smoke.yml';
const MAX_WAIT_MS = 25 * 60 * 1000;
const POLL_MS = 30 * 1000;
const SHA = /^[a-f0-9]{40}$/;
const JOB_STEPS = {
  smoke: [
    '煙霧測試',
    '煙霧第 2、3 次（PR、分支寫入者推送、非 main 的手動觸發；不能在本機跑煙霧的寫入者靠 CI 湊滿 3 連綠）',
    '上傳樣張與紀錄',
  ],
  fp: ['指紋（fp.js --check）', '上傳指紋紀錄與本次烘出的基線'],
  'fiscal-load': ['完整原生財務回歸（含舊檔、日結算、例外與負控制）', '保存完整財務回歸報告與畫布'],
};
const fail = reason => ({ reuse: false, reason });
const success = value => value?.status === 'completed' && value?.conclusion === 'success';
const positiveId = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;

function snapshot(env, event) {
  const pr = event.pull_request;
  if (env.GITHUB_EVENT_NAME !== 'pull_request' || !pr) return null;
  if (!/^[\w.-]+\/[\w.-]+$/.test(env.GITHUB_REPOSITORY || '')) return null;
  if (pr.head?.repo?.full_name !== env.GITHUB_REPOSITORY ||
      pr.base?.repo?.full_name !== env.GITHUB_REPOSITORY || pr.base?.ref !== 'main') return null;
  // Only branches on which the original push workflow runs all three smoke passes.
  if (!/^(codex|grok|glm|kimi|gpt|dsk)\/.+/.test(pr.head?.ref || '')) return null;
  if (![pr.head.sha, pr.base.sha, env.GITHUB_SHA, env.GITHUB_WORKFLOW_SHA].every(v => SHA.test(v || ''))) return null;
  if (!positiveId(pr.number) || !positiveId(env.GITHUB_RUN_ID)) return null;
  if (env.GITHUB_REF !== `refs/pull/${pr.number}/merge` ||
      env.GITHUB_WORKFLOW_REF !== `${env.GITHUB_REPOSITORY}/${WORKFLOW}@${env.GITHUB_REF}`) return null;
  return {
    repository: env.GITHUB_REPOSITORY, number: pr.number, branch: pr.head.ref,
    head: pr.head.sha, base: pr.base.sha, merge: env.GITHUB_SHA,
    runId: Number(env.GITHUB_RUN_ID), workflowSha: env.GITHUB_WORKFLOW_SHA,
  };
}

function samePR(pr, s) {
  return pr?.state === 'open' && pr.number === s.number &&
    pr.head?.repo?.full_name === s.repository && pr.base?.repo?.full_name === s.repository &&
    pr.head?.ref === s.branch && pr.base?.ref === 'main' &&
    pr.head?.sha === s.head && pr.base?.sha === s.base && pr.merge_commit_sha === s.merge;
}

function inspectTree(s, git) {
  if (git(['rev-parse', 'HEAD']) !== s.merge) throw new Error('checkout changed');
  const parents = git(['show', '-s', '--format=%P', s.merge]).split(' ');
  if (parents.length !== 2 || parents[0] !== s.base || parents[1] !== s.head) throw new Error('merge parents changed');
  git(['merge-base', '--is-ancestor', s.base, s.head]);
  const tree = git(['rev-parse', `${s.head}^{tree}`]);
  if (!SHA.test(tree) || git(['rev-parse', `${s.merge}^{tree}`]) !== tree) throw new Error('tree differs');
  const workflow = git(['show', `${s.merge}:${WORKFLOW}`]);
  if (git(['show', `${s.head}:${WORKFLOW}`]) !== workflow ||
      git(['show', `${s.workflowSha}:${WORKFLOW}`]) !== workflow) throw new Error('workflow version differs');
  return { tree, workflowDigest: createHash('sha256').update(workflow).digest('hex') };
}

function sameRun(run, s, workflowId) {
  return positiveId(run?.id) && run.id !== s.runId && run.event === 'push' &&
    run.repository?.full_name === s.repository && run.head_repository?.full_name === s.repository &&
    run.head_sha === s.head && run.head_branch === s.branch &&
    run.workflow_id === workflowId && run.path === WORKFLOW && positiveId(run.run_attempt);
}

function inspectJobs(payload, run, s) {
  if (!Array.isArray(payload?.jobs) || payload.total_count !== payload.jobs.length || payload.jobs.length > 100) return null;
  const provenance = [];
  for (const [name, required] of Object.entries(JOB_STEPS)) {
    const matches = payload.jobs.filter(job => job.name === name);
    if (matches.length !== 1) return null;
    const job = matches[0];
    if (!success(job) || !positiveId(job.id) || job.run_id !== run.id ||
        job.run_attempt !== run.run_attempt || job.head_sha !== s.head || job.workflow_name !== 'smoke') return null;
    const names = name === 'fp' ? [...required, `CI fp base ${s.base}`] : required;
    if (!Array.isArray(job.steps)) return null;
    for (const stepName of names) {
      const steps = job.steps.filter(step => step.name === stepName);
      if (steps.length !== 1 || !success(steps[0])) return null;
    }
    provenance.push({ name, id: job.id, attempt: job.run_attempt, conclusion: job.conclusion, steps: names });
  }
  return provenance;
}

async function decideReuse({ env, event, git, api, now = Date.now,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), waitMs = MAX_WAIT_MS, sourceRunId }) {
  const s = snapshot(env, event);
  if (!s) return fail('event or branch is not eligible');
  let tree;
  try { tree = inspectTree(s, git); } catch { return fail('checkout, ancestry, merge tree, or workflow version is unproven'); }
  const deadline = now() + Math.min(Math.max(waitMs, 0), MAX_WAIT_MS);
  const prefix = `/repos/${s.repository}`;
  try {
    const current = await api(`${prefix}/actions/runs/${s.runId}`);
    if (current.id !== s.runId || current.event !== 'pull_request' || current.path !== WORKFLOW ||
        !positiveId(current.workflow_id) || current.head_sha !== s.head ||
        current.repository?.full_name !== s.repository) return fail('current workflow identity is unproven');
    if (sourceRunId !== undefined && !positiveId(sourceRunId)) return fail('source run id is invalid');
    // At most 51 polls, each 30 seconds apart, within 25 minutes. An API error
    // falls back immediately rather than spending more permission or retry budget.
    for (let poll = 0; poll <= MAX_WAIT_MS / POLL_MS; poll++) {
      if (!samePR(await api(`${prefix}/pulls/${s.number}`), s)) return fail('PR base, head, or merge changed');
      let candidate;
      if (sourceRunId !== undefined) {
        candidate = await api(`${prefix}/actions/runs/${sourceRunId}`);
      } else {
        const query = new URLSearchParams({ event: 'push', branch: s.branch, head_sha: s.head, per_page: '10' });
        const list = await api(`${prefix}/actions/workflows/${current.workflow_id}/runs?${query}`);
        if (!Array.isArray(list.workflow_runs)) return fail('run list is incomplete');
        // Only inspect the newest matching run; never hide a failing rerun with
        // an older successful run for the same SHA.
        candidate = list.workflow_runs.filter(run => sameRun(run, s, current.workflow_id)).sort((a, b) => b.id - a.id)[0];
      }
      if (candidate && !sameRun(candidate, s, current.workflow_id)) return fail('source workflow, SHA, or branch differs');
      if (candidate?.status === 'completed') {
        if (!success(candidate)) return fail('source push did not succeed');
        const run = await api(`${prefix}/actions/runs/${candidate.id}`);
        if (!sameRun(run, s, current.workflow_id) || !success(run) || run.run_attempt !== candidate.run_attempt) return fail('source run changed');
        const jobs = await api(`${prefix}/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs?per_page=100`);
        const provenance = inspectJobs(jobs, run, s);
        if (!provenance) return fail('full successful jobs, test steps, or fp base evidence is missing');
        // Catch a rerun or PR update that began during job inspection.
        const latest = await api(`${prefix}/actions/runs/${run.id}`);
        if (!sameRun(latest, s, current.workflow_id) || !success(latest) || latest.run_attempt !== run.run_attempt) return fail('source attempt changed during verification');
        if (!samePR(await api(`${prefix}/pulls/${s.number}`), s)) return fail('PR changed during verification');
        const rechecked = inspectTree(s, git);
        if (rechecked.tree !== tree.tree || rechecked.workflowDigest !== tree.workflowDigest) return fail('checkout changed during verification');
        return { reuse: true, reason: 'exact-tree push evidence verified', sourceRunId: run.id,
          sourceRunUrl: `https://github.com/${s.repository}/actions/runs/${run.id}/attempts/${run.run_attempt}`,
          attempt: run.run_attempt, head: s.head, merge: s.merge, base: s.base, branch: s.branch,
          tree: tree.tree, workflowId: current.workflow_id, workflowPath: WORKFLOW,
          workflowDigest: tree.workflowDigest, jobs: provenance };
      }
      if (sourceRunId !== undefined || now() >= deadline || poll === MAX_WAIT_MS / POLL_MS) break;
      await sleep(Math.min(POLL_MS, deadline - now()));
    }
    return fail('source push is absent or still pending at the bounded deadline');
  } catch {
    // Do not print API bodies, credentials, or exception objects in Actions logs.
    return fail('GitHub evidence unavailable; running full checks');
  }
}

function githubApi(env, { fetchImpl = fetch, now = Date.now, budget = MAX_WAIT_MS + 60_000 } = {}) {
  let requests = 0;
  const deadline = now() + budget;
  return async path => {
    if (++requests > 160 || now() >= deadline) throw new Error('API budget exhausted');
    if (env.GITHUB_API_URL !== 'https://api.github.com' || !env.GITHUB_TOKEN ||
        !path.startsWith(`/repos/${env.GITHUB_REPOSITORY}/`)) throw new Error('API configuration is unproven');
    const response = await fetchImpl(`${env.GITHUB_API_URL}${path}`, {
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28' },
      redirect: 'error', signal: AbortSignal.timeout(Math.max(1, Math.min(10_000, deadline - now()))),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  };
}

function publish(result, env) {
  // Output only validated numeric/string fields; never serialize the event/token.
  const lines = ['### PR CI reuse evidence', '', result.reuse ?
    `Reused [push run ${result.sourceRunId}, attempt ${result.attempt}](${result.sourceRunUrl}).` :
    `Full checks: ${result.reason}.`];
  if (result.reuse) lines.push('', '```json', JSON.stringify(result, null, 2), '```');
  if (env.GITHUB_STEP_SUMMARY) fs.appendFileSync(env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  if (env.GITHUB_OUTPUT) fs.appendFileSync(env.GITHUB_OUTPUT,
    `reuse=${result.reuse}\nsource_run_id=${result.reuse ? result.sourceRunId : ''}\n`);
  console.log(result.reuse ? `Verified push run ${result.sourceRunId}; full provenance is in the job summary.` : `Full checks: ${result.reason}.`);
}

async function main(env = process.env) {
  let result;
  try {
    const confirm = process.argv.includes('--confirm');
    const event = JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
    result = await decideReuse({ env, event,
      git: args => {
        const value = execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 10_000 });
        return args[0] === 'show' && args[1] !== '-s' ? value : value.trimEnd();
      },
      api: githubApi(env, { budget: confirm ? 60_000 : MAX_WAIT_MS + 60_000 }),
      waitMs: confirm ? 0 : MAX_WAIT_MS,
      sourceRunId: confirm ? env.CI_SOURCE_RUN_ID : undefined,
    });
  } catch { result = fail('reuse helper unavailable; running full checks'); }
  publish(result, env);
}

module.exports = { WORKFLOW, MAX_WAIT_MS, POLL_MS, JOB_STEPS, snapshot, samePR, inspectTree, sameRun, inspectJobs, decideReuse, githubApi, publish };
if (require.main === module) main().catch(() => { console.log('Reuse output unavailable; full checks remain required.'); process.exitCode = 1; });
