/**
 * The Stack section of each level page, hand-picked per level.
 *
 * Like the labels in topics.ts, this is authored copy rather than text lifted
 * from the .txt files — but it is checked against them: `npm run parse` fails
 * if a tag's term does not occur in that level's source. A bare string is
 * matched as a whole word, case-insensitively; a [label, pattern] pair is used
 * where the source words it differently ("tokenizer" for "tokenization") or
 * where a case-insensitive match would be too loose.
 *
 * Tools are what you install, call or pay for: products, libraries, services,
 * CLIs and hosted models. Concepts are everything else: techniques, protocols,
 * formats, metrics, practices and regulations. Protocols and specs (MCP, A2A,
 * OpenAPI) are concepts while the clients that speak them (Postman, curl) are
 * tools; training techniques (LoRA, DPO, SFT) are concepts while the libraries
 * implementing them (PEFT, Unsloth, Axolotl) are tools; SQL is a concept and
 * PostgreSQL is the tool.
 *
 * Pick what a learner should come away able to name or use — not every term a
 * level mentions in passing. A level that names no products has no tools.
 */

export type StackEntry = string | [label: string, pattern: RegExp];

export interface LevelStack {
  tools: StackEntry[];
  concepts: StackEntry[];
}

export const stacks: Record<number, LevelStack> = {
  0: {
    tools: ['Python', 'uv', 'pytest', 'Pydantic', 'FastAPI', 'PostgreSQL', 'Git', 'GitHub', 'Docker', 'Postman', 'curl', 'Claude Code', 'Cursor'],
    concepts: [
      ['HTTP/REST', /\bREST\b/], 'JSON', 'OpenAPI', 'SQL', 'async', 'type hints',
      ['unit tests', /\bunit test/i], ['pull requests', /\bpull requests?\b/i],
      'environment variables', 'agentic coding',
    ],
  },
  1: {
    tools: ['LMArena'],
    concepts: [
      ['tokenization', /\btokeniz/i], 'embeddings', 'attention', ['transformers', /\btransformer/i],
      ['pretraining', /\bpre-?train/i], 'RLHF', 'context window', 'temperature', 'top-p',
      ['reasoning models', /\breasoning models?\b/i], 'Mixture-of-Experts',
      ['hallucination', /\bhallucinat/i], ['knowledge cutoff', /\btraining cutoff\b/i], 'TTFT',
      ['benchmarks', /\bbenchmarks?\b/i], ['model cards', /\bmodel cards?\b/i],
      ['open weights', /\bopen-weight\b/i],
    ],
  },
  2: {
    tools: [['OpenAI SDK', /\bOpenAI\b/], ['Anthropic SDK', /\bAnthropic\b/], 'Pydantic', 'LangChain', 'LangGraph', 'LlamaIndex', 'DSPy'],
    concepts: [
      'streaming', ['structured outputs', /\bstructured outputs?\b/i], 'tool calling', 'JSON Schema',
      'conversation state', 'async', ['batching', /\bbatch/i], ['retries', /\bretr(y|ies)\b/i],
      ['fallbacks', /\bfallbacks?\b/i], ['rate limits', /\brate limits?\b/i], 'token usage', 'tracing', 'TTFT',
    ],
  },
  3: {
    tools: [],
    concepts: [
      ['system prompts', /\bsystem prompts?\b/i], 'zero-shot', 'few-shot',
      ['reasoning prompting', /\breasoning-oriented prompting\b/i], ['task decomposition', /\bsubproblems\b/i],
      ['JSON output', /\bJSON\b/], ['schema enforcement', /\bschema enforcement\b/i],
      ['test sets', /\btest sets?\b/i], ['prompt versioning', /\bVersion prompts\b/i],
      'prompt caching', 'prompt injection',
    ],
  },
  4: {
    tools: ['pgvector', 'Qdrant', 'LangChain', 'LlamaIndex'],
    concepts: [
      'OCR', ['chunking', /\bchunk(ing|s)?\b/i], 'embeddings', ['semantic search', /\bsemantic.search\b/i],
      ['ANN', /\bANN\b/], ['HNSW', /\bHNSW\b/], 'BM25', 'hybrid retrieval', ['RRF', /\bRRF\b/], 'Recall@k',
      ['reranking', /\brerank/i], 'HyDE', 'RAG-Fusion', ['citations', /\bcitations?\b/i], 'abstention',
      'Self-RAG', ['CRAG', /\bCRAG\b/], 'Graph RAG',
    ],
  },
  5: {
    tools: ['LangGraph', 'CrewAI', 'Agno', ['Google ADK', /\bADK\b/], ['OpenAI Agents SDK', /\bAgents SDK\b/], 'E2B', 'Modal'],
    concepts: [
      ['ReAct', /\bReAct\b/], 'planning', 'reflection', ['MCP', /\bMCP\b/], ['A2A', /\bA2A\b/], 'tool calling',
      'memory', 'multi-agent', 'checkpointing', 'human-in-the-loop', ['sandboxing', /\bsandbox/i], 'tracing',
    ],
  },
  6: {
    tools: [],
    concepts: [
      'context window', 'context rot', 'context selection', 'compaction', ['summarization', /\bsummariz/i],
      'memory', ['state offloading', /\boffload/i], ['scratchpads', /\bscratchpads?\b/i],
      ['long-context strategies', /\blong-context\b/i], ['tool results', /\btool results?\b/i],
      ['context caching', /\b(context|prompt) caching\b/i],
    ],
  },
  7: {
    tools: ['DeepEval', 'RAGAS'],
    concepts: [
      'LLM-as-a-Judge', ['golden datasets', /\bgolden datasets?\b/i], ['offline evals', /\boffline\b/i],
      ['online evals', /\bonline\b/i], ['benchmarks', /\bbenchmarks?\b/i], ['MMLU', /\bMMLU\b/], ['GPQA', /\bGPQA\b/],
      'TruthfulQA', 'SimpleQA', ['regression testing', /\bregression/i], 'RAG Triad', 'faithfulness',
      'contextual precision', 'contextual recall', ['agent trajectories', /\btrajector(y|ies)\b/i],
      'tool selection', ['CI', /\bCI\b/],
    ],
  },
  8: {
    tools: [],
    concepts: [
      ['threat modeling', /\bthreat model/i], 'prompt injection', ['indirect injection', /\bindirect\b/i],
      ['data exfiltration', /\bexfiltration\b/i], ['jailbreaks', /\bjailbreak/i], ['guardrails', /\bguardrails?\b/i],
      'moderation', 'least privilege', ['sandboxing', /\bsandbox/i], ['PII', /\bPII\b/],
      ['secrets', /\bsecrets?\b/i], ['red teaming', /\bred.team/i], 'access control', 'EU AI Act', ['DPDP', /\bDPDP\b/],
    ],
  },
  9: {
    tools: [],
    concepts: [
      ['model routing', /\bmodel rout/i], ['model gateways', /\bgateways?\b/i], 'semantic caching', 'TTFT',
      'streaming', ['queues', /\bqueues?\b/i], ['rate limits', /\brate limits?\b/i],
      ['circuit breakers', /\bcircuit breakers?\b/i], ['fallbacks', /\bfallbacks?\b/i], 'graceful degradation',
      ['guardrails', /\bguardrails?\b/i], ['user feedback', /\bfeedback\b/i],
    ],
  },
  10: {
    tools: [
      'FastAPI', 'Streamlit', 'LangChain', 'LangGraph', 'Chroma', 'DeepEval', 'MLflow', 'Langfuse',
      'Guardrails AI', ['NeMo Guardrails', /\bNeMo\b/], 'Docker', 'Docker Compose', 'GitHub Actions',
      'AWS', 'EC2', 'CodeDeploy', 'Auto Scaling', 'Secrets Manager', 'Prometheus', 'Grafana', 'Node Exporter',
    ],
    concepts: [
      ['CI/CD', /\bCI\b/], ['experiment tracking', /\bexperiment tracking\b/i], ['prompt versioning', /\bprompt versioning\b/i],
      'tracing', ['containerization', /\bcontaineriz/i], ['load balancing', /\bload balancer\b/i],
      ['monitoring', /\bmonitoring\b/i],
    ],
  },
  11: {
    tools: [
      'Bedrock', 'Vertex AI', 'Azure AI Foundry', 'Hugging Face', 'Together', 'Fireworks', 'Groq', 'Replicate',
      'Modal', 'Baseten', 'RunPod', 'vLLM', 'TGI', 'Ollama', 'OpenRouter', 'Portkey', 'LiteLLM',
    ],
    concepts: [
      'workload identity', 'least privilege', ['private connectivity', /\bprivate (connectivity|network)/i],
      ['tenant isolation', /\btenant isolation\b/i], 'data residency', ['provisioned throughput', /\bprovisioned\b/i],
      ['quotas', /\bquotas?\b/i], 'continuous batching', ['KV cache', /\bKV-cache\b/i], 'quantization',
      ['model gateways', /\bgateways?\b/i], ['failover', /\bfail(s)? over\b|\bfailover\b/i], ['lock-in', /\block-in\b/i],
    ],
  },
  12: {
    tools: ['Whisper', 'Kokoro', 'CLIP'],
    concepts: [
      'vision encoder', ['image tokens', /\bimage tokens\b/i], 'OCR', 'visual RAG', ['diffusion', /\bdenois/i],
      'inpainting', 'speech-to-text', 'text-to-speech', ['speaker diarization', /\bdiarization\b/i],
      'word error rate', ['voice activity detection', /\bvoice activity detection\b/i], 'endpointing', 'barge-in',
      ['joint embeddings', /\bjoint embeddings?\b/i], 'quantization',
    ],
  },
  13: {
    tools: ['PEFT', 'Unsloth', 'Axolotl', 'TRL', 'vLLM', 'Ollama'],
    concepts: [
      ['SFT', /\bSFT\b/], ['LoRA', /\bLoRA\b/], ['QLoRA', /\bQLoRA\b/], ['DPO', /\bDPO\b/], ['RFT', /\bRFT\b/],
      'distillation', ['chat templates', /\bchat templates?\b/i], 'catastrophic forgetting',
      'reward hacking', ['preference data', /\bpreference data\b/i], ['held-out evaluation', /\bheld-out\b/i],
      'quantization',
    ],
  },
  14: {
    tools: ['FastAPI', 'LangGraph', 'GitHub'],
    concepts: [['MCP', /\bMCP\b/], 'multi-agent', 'tool calling', ['structured outputs', /\bstructured outputs?\b/i], 'tracing'],
  },
  15: {
    tools: [],
    concepts: [
      ['RAG', /\bRAG\b/], ['MCP', /\bMCP\b/], ['LoRA', /\bLoRA\b/], ['QLoRA', /\bQLoRA\b/], 'quantization',
      ['AI system design', /\bsystem.design\b/i], 'LLMOps', ['evals', /\beval/i],
      ['production debugging', /\bdebug/i], ['behavioral communication', /\bbehavioral communication\b/i],
    ],
  },
};
