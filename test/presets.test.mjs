import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PRESETS } from '../public/presets.mjs';
import { mapRequirements } from '../public/mapper.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

test('every preset has a synced example fixture with identical requirements', async () => {
  const files = (await readdir(`${root}examples`)).filter(f => f.endsWith('.json'));
  const fixtures = await Promise.all(
    files.map(async f => JSON.parse(await readFile(`${root}examples/${f}`, 'utf8'))),
  );
  assert.equal(fixtures.length, PRESETS.length, 'example count must match preset count');
  for (const preset of PRESETS) {
    const fixture = fixtures.find(f => f.id === preset.id);
    assert.ok(fixture, `missing examples/${preset.id}.json`);
    assert.deepEqual(fixture.requirements, preset.requirements, `${preset.id} requirements drifted`);
    assert.equal(fixture.title, preset.title, `${preset.id} title drifted`);
  }
});

test('presets span the range: minimal to full', () => {
  const counts = PRESETS.map(p => mapRequirements(p.requirements).counts.active).sort((a, b) => a - b);
  assert.equal(counts[0], 2, 'minimal preset lights interface + llm');
  assert.equal(counts.at(-1), 8, 'full preset lights all eight');
});
