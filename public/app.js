import { LAYERS } from '/layers.mjs';
import { mapRequirements, REQUIREMENTS } from '/mapper.mjs';
import { PRESETS } from '/presets.mjs';

const $ = id => document.getElementById(id);

for (const preset of PRESETS) {
  const option = document.createElement('option');
  option.value = preset.id;
  option.textContent = preset.title;
  $('preset').append(option);
}

const requested = new URLSearchParams(location.search).get('example');
if (PRESETS.some(p => p.id === requested)) $('preset').value = requested;

for (const req of REQUIREMENTS) {
  const label = document.createElement('label');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.id = `req-${req.id}`;
  label.append(box, document.createTextNode(req.label));
  $('requirements').append(label);
  box.addEventListener('change', runAll);
}

function currentRequirements() {
  const req = {};
  for (const r of REQUIREMENTS) {
    if ($(`req-${r.id}`).checked) req[r.id] = true;
  }
  return req;
}

function loadPreset() {
  const p = PRESETS.find(x => x.id === $('preset').value);
  for (const r of REQUIREMENTS) {
    $(`req-${r.id}`).checked = Boolean(p.requirements[r.id]);
  }
  $('preset-blurb').textContent = p.blurb;
  history.replaceState(null, '', `/?example=${p.id}`);
  runAll();
}
$('preset').addEventListener('change', loadPreset);

function paintMap(map) {
  $('score').textContent = `${map.counts.active} of ${map.counts.total} layers active`;
  $('score').className = `badge ${map.counts.active <= 2 ? 'success' : map.counts.active <= 5 ? 'info' : 'warn'}`;
  $('layer-map').replaceChildren(...map.layers.map(layer => {
    const card = document.createElement('article');
    card.className = `layer-card ${layer.active ? 'lit' : 'dim'}`;
    const head = document.createElement('div');
    head.className = 'layer-head';
    const name = document.createElement('strong');
    name.textContent = layer.name;
    const tag = document.createElement('span');
    tag.className = 'badge';
    tag.textContent = layer.devTime ? 'dev-time' : layer.active ? 'active' : 'no requirement';
    head.append(name, tag);
    const q = document.createElement('p');
    q.className = 'layer-q';
    q.textContent = `“${layer.question}”`;
    card.append(head, q);
    if (layer.active) {
      const tools = document.createElement('ul');
      tools.className = 'layer-tools';
      for (const slot of layer.tools) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${slot.tool}</strong> — ${slot.bestFor}`;
        tools.append(li);
      }
      card.append(tools);
      const why = document.createElement('p');
      why.className = 'layer-why';
      why.textContent = `Requirement: ${layer.reasons.join(' + ')}`;
      card.append(why);
    } else {
      const off = document.createElement('p');
      off.className = 'layer-off muted';
      off.textContent = 'No requirement activates it — the layer stays out of the build.';
      card.append(off);
    }
    return card;
  }));
}

function paintAudit(map) {
  $('audit').replaceChildren(...map.layers.map(layer => {
    const li = document.createElement('li');
    li.className = `audit-row ${layer.active ? 'lit' : 'dim'}`;
    const state = layer.active ? 'ON ' : 'off';
    li.innerHTML = `<span class="audit-state">${state}</span> <strong>${layer.name}</strong> — ` +
      (layer.active ? layer.reasons.join(' + ') : `if you ever need it, the cost of skipping: ${layer.failure}`);
    return li;
  }));
}

function runAll() {
  const map = mapRequirements(currentRequirements());
  paintMap(map);
  paintAudit(map);
}

loadPreset();
