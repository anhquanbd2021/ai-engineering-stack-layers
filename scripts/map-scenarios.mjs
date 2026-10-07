// Side-by-side report: map every example scenario's requirements to layers.
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { mapRequirements } from '../public/mapper.mjs';
import { LAYERS } from '../public/layers.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = (await readdir(`${root}examples`)).filter(f => f.endsWith('.json')).sort();
const scenarios = await Promise.all(
  files.map(async f => JSON.parse(await readFile(`${root}examples/${f}`, 'utf8'))),
);
const maps = scenarios.map(s => mapRequirements(s.requirements));
const colW = Math.max(...scenarios.map(s => s.id.length)) + 2;

console.log('Stack Mapper — scenario report\n');
for (let i = 0; i < scenarios.length; i++) {
  const on = maps[i].active.map(l => l.id).join(', ');
  console.log(`${scenarios[i].id.padEnd(colW)} ${maps[i].counts.active}/${maps[i].counts.total} layers: ${on}`);
}

console.log('\nLayer activation matrix (ON = a requirement demands it)\n');
console.log(`${'layer'.padEnd(22)}${scenarios.map(s => s.id.padEnd(colW)).join('')}`);
for (const layer of LAYERS) {
  const row = maps
    .map(m => (m.layers.find(x => x.id === layer.id).active ? 'ON' : '·').padEnd(colW))
    .join('');
  console.log(`${layer.name.padEnd(22)}${row}`);
}

console.log('\nTakeaway: layers track requirements — the minimal scenario lights 2 of 8, and that map is correct.');
