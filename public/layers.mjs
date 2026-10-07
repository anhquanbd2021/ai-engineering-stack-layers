// The 8-layer AI application stack — one question, one tool slot, one failure
// mode per layer. Tool picks are current defaults, not endorsements.
export const LAYERS = [
  {
    id: 'interface',
    name: 'Frontend',
    question: 'How does a human touch this?',
    failure: 'a script only its author can run — or weeks of polished UI wrapped around a feature nobody validated',
    devTime: false,
    slots: [
      { tool: 'Next.js', bestFor: 'a production product UI' },
      { tool: 'Streamlit', bestFor: 'an internal demo that proves the value first' },
    ],
  },
  {
    id: 'orchestration',
    name: 'Orchestration',
    question: 'Who decides what happens next?',
    failure: 'if-chains around LLM calls nobody can trace — or a graph runtime carrying a single prompt',
    devTime: false,
    slots: [
      { tool: 'LangGraph', bestFor: 'explicit state-machine workflows with branches' },
      { tool: 'CrewAI', bestFor: 'role-based agent crews' },
    ],
  },
  {
    id: 'rag',
    name: 'Retrieval (RAG)',
    question: 'How does the model learn your data?',
    failure: 'confident fiction — the model answers from public memory, not your documents',
    devTime: false,
    slots: [
      { tool: 'Embeddings', bestFor: 'turning documents into searchable vectors' },
      { tool: 'Vector DB', bestFor: 'storing and querying them — pgvector, Chroma, Qdrant' },
    ],
  },
  {
    id: 'llm',
    name: 'Model (LLM)',
    question: 'Which model does the thinking, and on whose hardware?',
    failure: 'the choice made by a tutorial — not by latency, cost, and privacy requirements',
    devTime: false,
    slots: [
      { tool: 'Ollama + open models', bestFor: 'local control, zero per-token cost' },
      { tool: 'hosted APIs', bestFor: 'capability and zero ops' },
    ],
  },
  {
    id: 'tools',
    name: 'Tools (MCP)',
    question: 'How does the model act on the world?',
    failure: 'a read-only chatbot humans copy-paste for — or six hand-rolled API shims nobody maintains',
    devTime: false,
    slots: [
      { tool: 'MCP', bestFor: 'one protocol to GitHub, Slack, databases, and internal APIs' },
    ],
  },
  {
    id: 'codeagents',
    name: 'Code Agents',
    question: 'Who writes the code — including this app?',
    failure: 'a permanently slower loop between “the demo works” and “the system works”',
    devTime: true,
    slots: [
      { tool: 'Claude Code', bestFor: 'agentic coding sessions inside the repo' },
      { tool: 'Aider', bestFor: 'git-integrated pair editing' },
    ],
  },
  {
    id: 'data',
    name: 'Data + Observability',
    question: 'Where does state live — and can you see inside a run?',
    failure: 'bug reports you cannot reconstruct, prompt changes nobody can diff',
    devTime: false,
    slots: [
      { tool: 'SQLite / DuckDB / Supabase', bestFor: 'persisting conversations, results, user state' },
      { tool: 'Phoenix', bestFor: 'tracing and evaluating every model + tool call' },
    ],
  },
  {
    id: 'deployment',
    name: 'Deployment',
    question: 'How does it leave your laptop?',
    failure: 'a screen recording instead of a URL — no feedback, no real users, no incident worth fixing',
    devTime: false,
    slots: [
      { tool: 'Docker', bestFor: 'runs identically on any host' },
      { tool: 'Cloudflare Workers / Hugging Face', bestFor: 'light on-ramps for edge functions and model demos' },
    ],
  },
];
