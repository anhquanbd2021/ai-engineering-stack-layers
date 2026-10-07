import test from 'node:test';
import assert from 'node:assert/strict';
import { mapRequirements, REQUIREMENTS } from '../public/mapper.mjs';
import { LAYERS } from '../public/layers.mjs';

test('minimal app activates a minimal map: only the model layer', () => {
  const map = mapRequirements({});
  assert.equal(map.counts.active, 1);
  assert.equal(map.counts.total, 8);
  assert.deepEqual(map.active.map(l => l.id), ['llm']);
  assert.equal(map.layers.find(l => l.id === 'llm').reasons.length, 1);
});

test('each requirement activates exactly its layer(s)', () => {
  const cases = {
    interface: 'interface',
    multiStep: 'orchestration',
    privateData: 'rag',
    actions: 'tools',
    codeAssist: 'codeagents',
    deploy: 'deployment',
  };
  for (const [req, layer] of Object.entries(cases)) {
    const map = mapRequirements({ [req]: true });
    assert.ok(map.layers.find(l => l.id === layer).active, `${req} should activate ${layer}`);
    assert.equal(map.counts.active, 2, `${req} + always-on llm = 2 layers`);
  }
});

test('state and observe both feed the data + observability layer', () => {
  const st = mapRequirements({ state: true });
  const data = st.layers.find(l => l.id === 'data');
  assert.ok(data.active);
  assert.equal(data.reasons.length, 1);

  const both = mapRequirements({ state: true, observe: true });
  const d2 = both.layers.find(l => l.id === 'data');
  assert.ok(d2.active);
  assert.equal(d2.reasons.length, 2, 'two requirements, one layer');
  assert.equal(both.counts.active, 2);
});

test('inactive layers carry no tool picks; active ones do', () => {
  const map = mapRequirements({ interface: true });
  for (const layer of map.layers) {
    assert.equal(layer.active, layer.tools.length > 0, layer.id);
  }
});

test('code agents are flagged dev-time — around the app, not in it', () => {
  const map = mapRequirements({ codeAssist: true });
  const layer = map.layers.find(l => l.id === 'codeagents');
  assert.ok(layer.active);
  assert.ok(layer.devTime);
  for (const l of map.layers) {
    if (l.id !== 'codeagents') assert.equal(l.devTime, false, l.id);
  }
});

test('unknown requirement keys throw instead of silently mapping wrong', () => {
  assert.throws(() => mapRequirements({ everything: true }), /unknown requirement/);
});

test('full requirement set lights all eight layers', () => {
  const all = Object.fromEntries(REQUIREMENTS.map(r => [r.id, true]));
  const map = mapRequirements(all);
  assert.equal(map.counts.active, 8);
  assert.equal(map.skipped.length, 0);
});

test('catalog: every layer has a question, a failure, and at least one tool slot', () => {
  for (const layer of LAYERS) {
    assert.ok(layer.question.length > 10, layer.id);
    assert.ok(layer.failure.length > 10, layer.id);
    assert.ok(layer.slots.length >= 1, layer.id);
    for (const slot of layer.slots) {
      assert.ok(slot.tool.length > 0 && slot.bestFor.length > 0, layer.id);
    }
  }
});
