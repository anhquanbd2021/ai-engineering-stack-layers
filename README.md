# Stack Mapper — companion demo

Interactive lab for the article *You Don't Need 50 Tools — You Need the 8
Layers Underneath*. Tick **requirements**, not tools, and watch which of the
eight layers of an AI application stack activate — and which tool fills each
slot today.

Zero dependencies — Node 20+ only. The layer catalog, activation mapper, and
scenario presets are plain ES modules shared by the browser UI, the CLI report,
and the test suite.

## The map

| Layer | Question it answers | Slot today |
|---|---|---|
| Frontend | How does a human touch this? | Next.js / Streamlit |
| Orchestration | Who decides what happens next? | LangGraph / CrewAI |
| Retrieval (RAG) | How does the model learn your data? | embeddings + vector DB |
| Model (LLM) | Which model does the thinking, on whose hardware? | Ollama / hosted APIs |
| Tools (MCP) | How does the model act on the world? | MCP → GitHub, Slack, DBs, APIs |
| Code Agents | Who writes the code — including this app? | Claude Code / Aider (dev-time) |
| Data + Observability | Where does state live — can you see inside a run? | SQLite/DuckDB/Supabase + Phoenix |
| Deployment | How does it leave your laptop? | Docker / Cloudflare Workers / Hugging Face |

## Run it

```text
npm start       # serve the lab on :3000
npm test        # mapper + preset sync + server
npm run scan    # layer-activation matrix on examples/
npm run check   # both
```

## Scenarios

- `examples/weekend-chatbot.json` — a prompt, a model, a clickable UI: 2 of 8
  layers, and that minimal map is *correct*.
- `examples/docs-rag.json` — docs Q&A: retrieval, persistence, observability,
  deployment: 5 of 8.
- `examples/support-agent.json` — multi-step agent with tool calls and traces:
  7 of 8.
- `examples/full-lab.json` — every requirement on: all eight layers, including
  the dev-time code-agent layer.

## Honest limits

- Tool picks are opinionated current defaults, not endorsements — the layer
  questions are the durable part; the tools will rotate.
- The map models *which layers exist*, not configuration, capacity, or cost.
- Requirements are binary toggles; real thresholds (QPS, document volume,
  latency budgets) shift the tool picks *inside* a layer, not the layer list.
- A checked requirement proves a layer belongs — it does not prove the tool
  inside it is right for your constraints.

This is an educational demo, not production infrastructure.
