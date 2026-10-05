# T724 — Cold-load power topology restore (original GPT-011)

## Scope and approval before implementation
Owner approved fixing the underlying load issue before the next riverside-market wave at 2026-10-05 10:15:55 UTC (reply: 「確認」 to the specific explanation and repair request). This is a narrowly scoped completion fix for the deployed museum round, with a separate PR. Main must remain unchanged until diagnosis and complete candidate tests pass. No PWA repair, unrelated economy change or market work.

Immutable baseline: deployed T723/v14.27, main759394f8bd48dbe77fb21e8604015e2d1ca56d21, HTML SHA25666fff895f7805b6d7945ba737f9d5414af6e911295c48d7509334678976f4921. All 2,895 sprite leaves,157 families,1,728 blocks, existing style and fingerprint bytes must remain exact. No save schema or player save modification.

## Observed defect and evidence status
Actual public-origin observer37294377776 verifies the deployed HTML, native museum construction, physical services, staffing, tourism and save bytes. After actual page reload and native Continue, the following ordinary day has poweredBld0/pop0 and disconnected power pools. This is a functional failure, separately from the pre-existing ancillary manifest/icon404 diagnostics.

Source audit identifies load wrapper __load515 → fiscalStep515 → fiscalInfrastructure515 → ensurePowerDispatch471, before begin(false) computes physical power reach. A cold cache may be marked clean while empty and later capacity refresh may not rebuild it. The chain is also present in T722, but source similarity alone is NOT proof of old-version runtime reproduction.

The first paired diagnostic37295865430 failed a QA input guard: Page.reload's native visibility autosave overwrote an older manually restored save after the warm-control day advanced. That run does not establish T722 cold behavior. Corrected diagnostic must run cold first from the live native save, then restore the identical original bytes for the warm control. Product changes remain pending that causal evidence.

## Acceptance criteria
1. Preserve raw unassisted T722 and T723 cold reload observations, two actual paused RAFs, subsequent ordinary days and exact same saved bytes. Never call an ensure/recompute helper in the pass path. Keep a separate paid-road recovery intervention visibly separate from clean cold-load success.
2. Only after causality is established, choose one uniquely anchored minimal load/cache-order repair. No new worker, power source, water allocation or synthetic service state. Native generation and allocation remain authoritative.
3. Real cold page reload → Continue → first ordinary day must retain actual power, population and staffed museum services without user road edits or test repair. Repeat reload and cover multiple towns, with and without the museum.
4. Disconnected and no-generation negative controls must remain unpowered; the repair must not fabricate supply. Preserve actual water/staff constraints, coverage ownership and save identity. Other save slots stay untouched.
5. Full original museum matrix and historical public-life/station/street-life runtime assertions remain unchanged behind strictly audited source/metadata gates. Existing warm-world tile/stat/RNG comparisons remain exact; any unexpected difference requires investigation, not a blanket ignored field.
6. Three smoke passes, full byte-exact2,895-leaf/157-family/1,728-block fingerprints and style checks; no baseline promotion or pixel exceptions. The approved museum art remains untouched.
7. Separate PR, exact-head full CI, then authorized T724/v14.28 release metadata, another exact release gate, merge and existing Pages deployment. Verify actual public HTML bytes, real browser cold reload and native following-day operation. Disclose existing PWA ancillary404s truthfully; exact duplicate-log classification is observer-only.

## Work record
Implementation not started. Unfinished: corrected causal paired runtime, minimal repair selection, complete candidate/release CI and final public verification. No success is claimed for the unresolved cold-load path.


## Causal evidence and selected minimal repair
Paired immutable runtime run37296616989 (observer3a58dc2095c93fecd2d16faaa270a3ad7856e1e1) completed on T722 and T723. Both show441 physically powered roads but zero cached districts and powered buildings through three unassisted cold-load days; native paid road placement restores one district and97 powered buildings. Warm controls are healthy; both paths use identical original native save bytes. This establishes the cache invalidation cause, rather than inferring it only from old source.

Selected repair is one successful-load postcondition: after both fiscal and observatory restore snapshots finish, mark the distribution topology dirty. The next normal computePower rebuilds it from real physical reach. It does not eagerly alter loaded tiles, dispatch electricity, invent people or modify saves. Existing metro provenance reset afterward does not access power. A bounded __noColdLoadPower011 escape switch permits a negative control; default is repaired. All approved art and release identifiers remain unchanged in this candidate.

Source-only exact-hunk/static checks are pending alongside dedicated real cold-reload, negative-source/disconnection, repeated-load and full historical matrix runtime. No runtime repair success claimed yet.


## Publication approval and T724 preparation

Owner approved the underlying repair at 2026-10-05 10:15:55 UTC, authorized the interrupted branch retry at 10:55:40 UTC, then explicitly approved this repair branch's PR, release testing, merge/deployment and official-site verification at 2026-10-05 11:08:46 UTC (reply: 「允許」). PR16 is limited to this cold-load repair. Existing approved building artwork is exact; no new visual review is needed.

Candidate 939324e15df208218a3db3e0117e5fcc916d6f4b passed all20 jobs in https://github.com/lijiabao1998/GlimmerTown-lab/actions/runs/37299836912 and push smoke37299836674. SHA-verified native artifacts show two real cold Continue cycles per scenario: without museum,97 powered buildings and street staffing17/8/3; with museum,104 powered buildings,21.27 employed museum staff and tourism30. Removed-source and disconnected-road controls correctly stay unserved; disabling the repair recreates the zero-district failure. All10 reloads preserve exact native save input bytes and other-slot/backups sentinels.

The full museum four-camera/day-night/construction/weather/gameplay matrix and historical public-life/station/street-life assertions passed. Three smoke passes, exact2,895 leaves/157 families/1,728 blocks and old warm-world full tile/stat/RNG checkpoints0/1/5/20/native-load/21 passed. No fp.json promotion or ignored gameplay differences. All runtime occurred solely in isolated GitHub Actions, slot3/port8199.

T724/v14.28 changes only three release labels in addition to the pinned one-hunk repair. This entry and r171 release log preserve prior history; no PWA files, save schema, approved art or unrelated market changes. Exact release-head full CI, merge/main smoke/Pages and real official-origin two-cycle cold-load verification remain pending here and are not presumed passed. Known PWA ancillary404s remain disclosed; the new read-only observer only recognizes precise diagnostics with independent matching404 evidence.
