// Requirement -> layer activation. The map lights a layer when a requirement
// demands it — never because a tutorial listed it.
import { LAYERS } from './layers.mjs';

export const REQUIREMENTS = [
  { id: 'interface', label: 'a human must use it (not just read logs)' },
  { id: 'multiStep', label: 'tasks branch, retry, or run more than two model calls' },
  { id: 'privateData', label: 'answers must come from your data, not public memory' },
  { id: 'actions', label: 'the model must act on GitHub, Slack, DBs, APIs' },
  { id: 'codeAssist', label: 'an agent should help write this app (dev-time)' },
  { id: 'state', label: 'conversations and results must persist' },
  { id: 'observe', label: 'every run must be traceable and explainable' },
  { id: 'deploy', label: 'a second person must reach it' },
];

const RULES = [
  { req: 'interface', layer: 'interface', reason: 'a human must use it' },
  { req: 'multiStep', layer: 'orchestration', reason: 'tasks branch, retry, or run more than two model calls' },
  { req: 'privateData', layer: 'rag', reason: 'answers must come from your data, not public memory' },
  { req: 'actions', layer: 'tools', reason: 'the model must act on external systems' },
  { req: 'codeAssist', layer: 'codeagents', reason: 'the dev loop is part of the velocity budget' },
  { req: 'state', layer: 'data', reason: 'conversations and results must persist' },
  { req: 'observe', layer: 'data', reason: 'every run must be traceable and explainable' },
  { req: 'deploy', layer: 'deployment', reason: 'a second person must reach it' },
];

// The model layer is always on: every AI application answers the model
// question — even if only by defaulting to a hosted API.
const ALWAYS_ON = { layer: 'llm', reason: 'every AI app answers the model question — even by defaulting' };

const KNOWN_REQUIREMENTS = new Set(REQUIREMENTS.map(r => r.id));

export function mapRequirements(requirements = {}) {
  for (const key of Object.keys(requirements)) {
    if (!KNOWN_REQUIREMENTS.has(key)) {
      throw new Error(`unknown requirement: "${key}" — known: ${[...KNOWN_REQUIREMENTS].join(', ')}`);
    }
  }

  const reasons = new Map();
  const addReason = (layerId, reason) => {
    if (!reasons.has(layerId)) reasons.set(layerId, []);
    reasons.get(layerId).push(reason);
  };
  addReason(ALWAYS_ON.layer, ALWAYS_ON.reason);
  for (const rule of RULES) {
    if (requirements[rule.req]) addReason(rule.layer, rule.reason);
  }

  const layers = LAYERS.map(layer => ({
    ...layer,
    active: reasons.has(layer.id),
    reasons: reasons.get(layer.id) || [],
    tools: reasons.has(layer.id) ? layer.slots : [],
  }));

  const active = layers.filter(l => l.active);
  return {
    requirements,
    layers,
    active,
    skipped: layers.filter(l => !l.active),
    counts: { active: active.length, skipped: layers.length - active.length, total: layers.length },
  };
}
