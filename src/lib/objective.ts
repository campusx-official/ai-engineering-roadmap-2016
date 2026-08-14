/**
 * Presentation helpers for objective text.
 *
 * The source sentences are long (median 89 chars, p90 135) and arrive as an
 * undifferentiated list, which reads as a wall. These helpers add scanning
 * structure WITHOUT changing a single word:
 *
 *  - `splitLead`  — where a sentence already contains a "lead: detail" break,
 *                   surface the lead so the eye can skip the enumeration.
 *  - `markTerms`  — bold the concrete technical nouns so a reader can find
 *                   "pytest" or "pgvector" without reading the whole line.
 */

/** Concrete, unambiguous technical nouns — products, protocols, formats, APIs.
 *  Deliberately excludes generic vocabulary ("streaming", "tracing", "memory"),
 *  which would highlight half the sentence and defeat the purpose. */
const TERMS = [
  // languages, runtimes, tooling
  'Python', 'pytest', 'uv', 'pyproject.toml', '.gitignore', '.dockerignore',
  'Pydantic', 'dataclass', 'FastAPI', 'Flask', 'Docker', 'Dockerfile', 'Git', 'GitHub',
  'PostgreSQL', 'SQL', 'pgvector', 'Qdrant', 'curl', 'Postman', 'Bruno',
  'OpenAPI', 'Swagger', 'JSON Schema', 'JSON', 'CSV', 'HTTP', 'REST', 'README',
  // orchestration & agents
  'LangChain', 'LangGraph', 'LlamaIndex', 'DSPy', 'CrewAI', 'Agno', 'MCP', 'A2A',
  'OpenAI Agents SDK', 'ADK', 'E2B', 'Modal', 'ReAct',
  // retrieval
  'BM25', 'HNSW', 'IVF', 'ANN', 'RRF', 'HyDE', 'RAG-Fusion', 'Self-RAG', 'CRAG',
  'Graph RAG', 'Adaptive RAG', 'RAG', 'Recall@k', 'Precision@k', 'MRR',
  // evals & ops
  'DeepEval', 'RAGAS', 'Langfuse', 'Phoenix', 'MLflow', 'LLM-as-a-Judge', 'BLEU', 'ROUGE',
  'F1', 'CI/CD', 'CI', 'vLLM', 'TTFT', 'KV', 'SLA',
  'GitHub Actions', 'Docker Compose', 'Docker Hub', 'Streamlit', 'Chroma',
  'Prometheus', 'Grafana', 'Node Exporter', 'Guardrails AI', 'NeMo Guardrails',
  'AWS', 'EC2', 'CodeDeploy', 'Auto Scaling', 'Secrets Manager', 'Load Balancer', '.env',
  // training
  'QLoRA', 'LoRA', 'PEFT', 'Unsloth', 'Axolotl', 'SFT', 'RLHF', 'RLAIF', 'DPO', 'RFT',
  // multimodal
  'Whisper', 'Kokoro', 'STT', 'TTS', 'OCR', 'PDF', 'PDFs', 'DOCX', 'HTML',
  // security & governance
  'PII', 'EU AI Act', 'DPDP',
  /* Deliberately absent: 'LLM' / 'LLMs'. They are the subject of nearly every
     sentence on the site, so highlighting them is noise rather than an anchor. */
];

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Longest first so "QLoRA" wins over "LoRA" and "Graph RAG" over "RAG". */
const TERM_RE = new RegExp(
  `(?<![\\w@.-])(${[...TERMS].sort((a, b) => b.length - a.length).map(escapeRe).join('|')})(?![\\w@])`,
  'g',
);

/**
 * Drops trailing list punctuation. Several source files write a run-on list one
 * fragment per line ("at least 3 useful tools," / "explicit state,"); as
 * standalone bullets those trailing commas read as typos.
 */
export const trimTrailingPunctuation = (s: string): string => s.replace(/[,;]\s*$/, '');

/** HTML-escaped text with technical terms wrapped in <b class="term">. */
export function markTerms(text: string): string {
  return escapeHtml(text).replace(TERM_RE, '<b class="term">$1</b>');
}

/**
 * Splits "Understand relational data modeling: tables, rows, columns…" into a
 * lead and the detail that follows. Returns `lead: null` when the sentence has
 * no such break (about 89% of them) — those render as a single run of text.
 */
export function splitLead(text: string): { lead: string | null; rest: string } {
  const m = text.match(/^(.{15,85}?[:;])\s+(.+)$/s);
  if (!m) return { lead: null, rest: text };
  return { lead: m[1], rest: m[2] };
}

/** Convenience: both treatments applied, ready for `set:html`. */
export function renderObjective(text: string): { lead: string | null; rest: string } {
  const { lead, rest } = splitLead(trimTrailingPunctuation(text));
  return { lead: lead ? markTerms(lead) : null, rest: markTerms(rest) };
}
