// Preset scenarios — embedded copies of examples/*.json (sync asserted by test).
export const PRESETS = [
  {
    id: 'weekend-chatbot',
    title: 'Weekend chatbot — prove the value',
    blurb: 'A prompt plus a model behind a clickable UI. Nothing else exists yet — and that is correct.',
    requirements: { interface: true },
  },
  {
    id: 'docs-rag',
    title: 'Docs Q&A over company knowledge',
    blurb: 'Answers must cite private documents, persist sessions, explain runs, and be reachable.',
    requirements: { interface: true, privateData: true, state: true, observe: true, deploy: true },
  },
  {
    id: 'support-agent',
    title: 'Production support agent',
    blurb: 'Multi-step triage that reads docs, files tickets, and posts to Slack — with traces on every run.',
    requirements: { interface: true, multiStep: true, privateData: true, actions: true, state: true, observe: true, deploy: true },
  },
  {
    id: 'full-lab',
    title: 'Full lab — every requirement on',
    blurb: 'All eight requirements ticked: the complete map lights, including the dev-time layer.',
    requirements: { interface: true, multiStep: true, privateData: true, actions: true, codeAssist: true, state: true, observe: true, deploy: true },
  },
];
