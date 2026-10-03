# GPT-003 — British architectural prototypes, first selection round

Status: acceptance written before implementation. Prototype only; no merge or deployment.
Base: main `9be7bc069a9f3dcb5bd71787dc4ab8e672b4f7d1` (verified 2026-10-03).
Product `index.html`: 9,627,011 bytes; SHA256 `5c60ef1809599419b9e456a136da2b6e9e499b6069d4b5d10f8e7b222932585a`.
User request: 按照 Claude 的標準做一輪英式建築. Samples first; owner selects before any integration.

## Scope and provisional IDs

- UKP01: 2×2 Victorian brick terrace. Connected domestic massing, repeated bay/door rhythm, slate roof and party-wall chimney stacks, modest front boundary. Residential scale.
- UKP02: 2×2 corner public house. Two street-facing elevations, working corner entrance, deep painted timber/glazed ground floor, brick upper rooms, articulated roof and chimneys. Distinct from a terrace with a sign pasted on.
- UKP03: 3×3 municipal library/reading hall. Public entrance, long reading-room volume with purposeful daylight openings, subsidiary wing/service entry and civic forecourt. No generic tower or column-ring stand-in.

All three use native Canvas-generated hard pixels and true 2:1 ground-plane projection. No permanent numeric building IDs. No new normal catalog entries. Test-only renderer is loaded after normal boot; harness temporarily substitutes matching-footprint sprites for actual city rendering then restores them.

## Method

Follow the concrete lessons of T702 (complete form, correct two-face isometry, shared geometry for day/night, iterate rendered pixels), T711 (inspect inside actual city rather than floating sprite), T699 (controlled A/B and no incidental changes). Architectural reference URLs and exact form decisions will be recorded during research. Existing product colors, global shadows/night look, simulation RNG, save format and normal catalog stay unchanged. Prototype generation is deterministic and opt-in.

## Acceptance before construction

1. Product HTML remains byte-identical to baseline. GAME_VER/GAME_ANCHOR, AUTORUN-LOG.md, fp.json and DECISIONS.md remain unchanged. No changes to main or rejected PR7.
2. Exactly three identifiable forms. At z1.2 and z2 in the real city each remains readable against existing neighboring buildings, with plausible street connection, grounded footprint and coherent scale. Pixel approval is a human/design judgment separate from test status.
3. Sprite dimensions/anchors: UKP01/02 136×150 (68,148), UKP03 208×220 (104,218). Solid pixels avoid canvas edges and projected ground footprint. No detached under-ground pixels. Cast shadow stays on plot; no large opaque rectangle.
4. Night pixels occur only on visible day surfaces; windows and actual fixtures light, not entire walls/roofs. Night city shots must demonstrate actual game lighting path and no light leaking through nearer surfaces.
5. Test harness verifies deterministic rebuilds, existing sprite identities restored, no unexpected storage writes during prototype build, real draw inclusion, isolated slot 3 and clean console. Existing full fingerprint check remains unchanged.
6. Remote GitHub Actions: smoke ×3, `node fp.js --check`, dedicated geometry/night/render guard. Never call an unrun test passed. Local game tests are not run by GPT per repository instructions.
7. Deliver direct sprites, city day/night samples at two practical zooms, a combined context view and an honest iteration log. Record CI URLs/SHAs, boot cost, prototype build time/bytes, failed drafts and known limitations. Original image ZIP parts ≤10 MB.

## Test isolation and rollback

Renderer only exists in separate prototype JS, not index.html. Opt-in harness owns temporary overrides and uses `window.__noBritishPrototypes003` as escape valve. CI workflow restricted to `gpt/british-prototypes` with contents: read and no deployment, no secrets/new credentials. Existing Pages workflow only listens to main smoke; branch runs do not deploy. No deletion/migration of any production site is involved.

## Construction record

- Entry: main rechecked; clean isolated checkout; HTML digest measured. Read AGENTS, AUTORUN, CLAUDE, DECISIONS, T702/T711/T699 and STYLE-THEOTOWN.
- Architectural research, implementation and visual iterations pending.
- Smoke, fingerprint, pixel guard and samples: not run yet.

## Unfinished / known limits

Prototype forms and harness are not implemented at this card commit. No performance, visuals or test success is claimed. Existing main boot is heavy; prototype code will not add default boot cost. These are visual proposals, not completed gameplay integration, construction animation or permanent catalog additions. Mobile and user hardware performance are not measured.
