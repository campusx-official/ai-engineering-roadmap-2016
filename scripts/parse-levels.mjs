/**
 * Build-time parser: level*.txt  ->  src/data/levels.json
 *
 * The .txt files are the single source of truth for all level content. Nothing
 * here invents copy: every string written to levels.json is lifted verbatim
 * from a source file. Where a field cannot be found, the level gets an entry in
 * `todos[]` instead of a plausible-looking guess.
 *
 * Run: npm run parse   (also runs automatically before dev/build)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* Canonical location, per CLAUDE.md §2. The repo root is kept as a fallback so
   a stray level*.txt dropped there is still picked up rather than silently
   ignored — the first directory containing any level*.txt wins. */
const CONTENT_DIRS = [join(root, 'AI ENGINEER ROADMAP'), root];

const PHASES = [
  { id: 'foundations', name: 'Foundations',        levels: [0, 1, 2, 3],  theme: 'software, LLM 101, orchestration, prompting', color: 'violet',  icon: 'blocks' },
  { id: 'retrieval',   name: 'Retrieval',          levels: [4],           theme: 'embeddings, vector search, RAG',              color: 'blue',    icon: 'search' },
  { id: 'agentic',     name: 'Agentic',            levels: [5, 6],        theme: 'agents, context engineering',                 color: 'emerald', icon: 'bot' },
  { id: 'trust',       name: 'Evaluation & Trust', levels: [7, 8],        theme: 'evals, security',                             color: 'amber',   icon: 'shield-check' },
  { id: 'production',  name: 'Production',         levels: [9, 10, 11],   theme: 'system design, LLMOps, managed platforms',    color: 'cyan',    icon: 'server' },
  { id: 'frontier',    name: 'Frontier & Proof',   levels: [12, 13, 14],  theme: 'multimodal, fine-tuning, projects',           color: 'rose',    icon: 'sparkles' },
  { id: 'interview',   name: 'Interview',          levels: [15],          theme: 'positioning, scenarios, mock loops',           color: 'slate',   icon: 'handshake' },
];

/* One Lucide icon per level. Chosen to match the level's subject; the icon set
   is fixed (Lucide, one weight) per the brand guardrails. */
const LEVEL_ICONS = {
  0: 'terminal', 1: 'brain', 2: 'plug', 3: 'message-square-code', 4: 'library-big',
  5: 'bot', 6: 'layout-panel-left', 7: 'flask-conical', 8: 'shield-half', 9: 'network',
  10: 'gauge', 11: 'cloud-cog', 12: 'audio-lines', 13: 'sliders-horizontal', 14: 'trophy',
  15: 'briefcase-business',
};

/* Keyword -> Lucide icon for module rows. First match wins, so the list runs
   most-specific first: broad words like "agent" or "model" appear near the end,
   otherwise every module in the agents level would share one icon.
   `circle-dot` is the fallback so a module never renders without an icon. */
const MODULE_ICON_RULES = [
  // unmistakable, subject-defining terms
  [/capstone|ship a|ship it|portfolio & |portfolio and /i, 'flag'],
  [/\bmcp\b|model context protocol|\ba2a\b/i, 'plug-zap'],
  [/langgraph|graph-based|state machine/i, 'git-branch'],
  [/sandbox|code execution|sandboxed/i, 'terminal'],
  [/red.?team|jailbreak|injection|exfiltration/i, 'bug'],
  [/guardrail|moderation|guardrails/i, 'shield-half'],
  [/privacy|\bpii\b|secrets|data privacy/i, 'lock'],
  [/threat model|security|secure/i, 'shield'],
  [/responsib|governance|ethic|compliance|regulat/i, 'scale'],

  // interview level: these read as "<topic> interview scenarios", so they must
  // be matched before the topic rules claim them
  [/interview strategy|role positioning/i, 'compass'],
  [/llmops & production debugging|production debugging/i, 'activity'],
  [/staying current|chasing hype/i, 'newspaper'],
  [/portfolio defense|project & portfolio/i, 'presentation'],
  [/behavioral communication|communication for/i, 'speech'],

  // eval sub-topics (an entire level is "evals" — split it finely)
  [/introduction to/i, 'book-open'],
  [/offline vs online|offline and online/i, 'arrow-left-right'],
  [/benchmarking|anatomy of a benchmark|leaderboard/i, 'chart-column'],
  [/evolution of|progression of/i, 'trending-up'],
  [/custom model eval|custom eval/i, 'crosshair'],
  [/eval suite|building an eval/i, 'list-checks'],
  [/eval-driven|continuous loop/i, 'repeat'],
  [/metrics? &|evaluation methods/i, 'ruler'],
  [/rag eval/i, 'search-check'],
  [/agent eval/i, 'bot'],
  [/evals in ci|regression testing/i, 'git-pull-request'],
  [/production evals|feedback loop/i, 'refresh-cw'],

  // fine-tuning sub-topics
  [/should you fine.?tune/i, 'circle-question-mark'],
  [/preference tuning|\bdpo\b/i, 'thumbs-up'],
  [/reinforcement fine.?tuning|\brft\b/i, 'award'],
  [/distill/i, 'shrink'],
  [/data curation/i, 'file-text'],

  // modality sub-topics
  [/multimodal foundations|beyond text/i, 'shapes'],
  [/images? become tokens/i, 'grid-2x2'],
  [/sound becomes tokens|audio becomes tokens/i, 'audio-waveform'],
  [/documents?, charts|visual rag/i, 'scan-text'],
  [/multimodal embeddings|cross-modal/i, 'vector-square'],
  [/image generation|video generation/i, 'image'],
  [/realtime voice|voice agent/i, 'audio-lines'],
  [/vision|document understanding/i, 'eye'],
  [/speech|\bstt\b|\btts\b/i, 'mic'],
  [/on-device|\bedge\b/i, 'smartphone'],

  // rag & context sub-topics
  [/rag with frameworks/i, 'boxes'],
  [/similarity & semantic|semantic search/i, 'radar'],
  [/vector database|ann search/i, 'database'],
  [/sparse & hybrid|hybrid retrieval/i, 'blend'],
  [/retrieval evaluation/i, 'flask-conical'],
  [/rag architecture|when to use it/i, 'network'],
  [/baseline rag|from scratch/i, 'hammer'],
  [/rag variants|advanced patterns/i, 'git-fork'],
  [/context window as a resource/i, 'gauge'],
  [/selection & assembly|context selection/i, 'list-filter'],
  [/compression|compaction/i, 'archive'],
  [/long-context strategies/i, 'scroll-text'],

  // ops & delivery (must precede the broad deploy/test rules below)
  [/ci\/cd/i, 'infinity'],
  [/containeriz|application serving/i, 'container'],
  [/three ways to consume|consumption path/i, 'git-fork'],
  [/platform anatomy|bedrock|vertex ai|azure ai foundry/i, 'layout-grid'],
  [/identity, networking|tenancy/i, 'key-round'],
  [/regions?, residency|residency & compliance/i, 'globe-lock'],
  [/capacity, quotas|quotas? & cost/i, 'gauge'],
  [/open-weight model platform|inference provider/i, 'server-cog'],
  [/model routers?|llm gateway/i, 'route'],
  [/managed building blocks|build or buy/i, 'blocks'],
  [/portability|lock-in|migration/i, 'arrow-left-right'],
  [/managed ai platform|managed platform/i, 'cloud-cog'],
  [/\baws\b|deployment on/i, 'cloud-upload'],
  [/experiment tracking/i, 'git-compare'],
  [/application development|app development/i, 'hammer'],

  // practice areas
  [/judge|llm-as-a/i, 'gavel'],
  [/golden dataset|test.case|test set|regression|\bci\b/i, 'clipboard-check'],
  [/eval|metric/i, 'flask-conical'],
  [/observab|tracing|monitor|alert|dashboard|feedback loop/i, 'activity'],
  [/cost|econom|pricing|budget|billing/i, 'wallet'],
  [/cach(e|ing)/i, 'database-zap'],
  [/latency|inference optim|throughput|performance optim/i, 'zap'],
  [/deploy|container|docker|ci\/cd|serving|llmops vs|prompt & config/i, 'ship'],

  // retrieval stack
  [/rerank/i, 'arrow-down-up'],
  [/query transform|rag-fusion|hyde/i, 'shuffle'],
  [/\brag\b|retriev/i, 'search'],
  [/embedding|vector|similarity|semantic search/i, 'vector-square'],
  [/chunk/i, 'scissors'],
  [/ingest|document processing|\bpdf\b|data curation|persistence/i, 'file-text'],

  // agents & context
  [/multi-agent|orchestrator|crew|team|specialist/i, 'users'],
  [/memory|offload|state/i, 'save'],
  [/context window|compress|compact|context selection|context engineering|long-context|context cach/i, 'layout-panel-left'],
  [/react|planning|reflection/i, 'route'],
  [/tools? for|designing good tools|tool calling|function \/ tool|function call|tool context|tool security/i, 'wrench'],
  [/reliab|failure recovery|retries|robust|fallback|graceful/i, 'life-buoy'],
  [/framework|librar/i, 'boxes'],

  // model & prompt craft
  [/tokeniz/i, 'scissors-line-dashed'],
  [/attention|transformer|inside an llm/i, 'brain-circuit'],
  [/pretrain|post-train|how llms learn|training/i, 'graduation-cap'],
  [/sampling|generation param|temperature/i, 'sigma'],
  [/reasoning|test-time|decomposition/i, 'workflow'],
  [/choosing|landscape|model routing|gateway|routing/i, 'git-fork'],
  [/fine.?tun|lora|qlora|\bdpo\b|\brft\b|distill|preference/i, 'sliders-horizontal'],
  [/system prompt|anatomy of a prompt|few-shot|zero-shot|prompt/i, 'message-square-code'],
  [/structured output|schema|\bjson\b/i, 'braces'],
  [/grounding|citation|abstention/i, 'quote'],
  [/stream/i, 'radio'],
  [/async|concurren|batch/i, 'split'],

  // engineering fundamentals
  [/ai-assisted|coding agent|agentic coding|pair programming/i, 'bot-message-square'],
  [/\bgit\b|collaborat|version control/i, 'git-branch'],
  [/\bapi\b|http|rest|endpoint|fastapi|web:/i, 'globe'],
  [/database|\bsql\b|postgres/i, 'database'],
  [/python/i, 'terminal'],

  // modalities & applications
  [/multimodal|vision|image|speech|voice|audio|realtime|on-device|\bedge\b/i, 'audio-lines'],
  [/research/i, 'telescope'],
  [/resume|screening|business/i, 'briefcase'],
  [/architecture|system.design|pipeline|orchestrat|case stud/i, 'network'],
  [/workflow|multi-step/i, 'workflow'],

  [/capabilit(y|ies) & failure|failure modes/i, 'triangle-alert'],
  [/controlling output|output control/i, 'type'],
  [/q&a platform|document q&a/i, 'messages-square'],

  // broadest terms last
  [/what (is|an)|actually is|fundamentals|101|foundations/i, 'book-open'],
  [/agent|autonom/i, 'bot'],
  [/\bmodel\b|inference/i, 'cpu'],
];

/* Named products, libraries, services, CLIs, model checkpoints and databases —
   the things you install, call or pay for. Everything else in STACK_VOCAB is a
   concept: a technique, protocol, format, metric, practice or regulation.
   The split drives the two columns of the Stack section on a level page.

   Judgement calls worth knowing: protocols (MCP, A2A) and specifications
   (OpenAPI, JSON Schema) are concepts, while the clients that speak them
   (Postman, curl) are tools; training techniques (LoRA, DPO, SFT) are concepts
   while the libraries implementing them (PEFT, Unsloth, Axolotl) are tools;
   SQL is a concept and PostgreSQL is the tool. */
const STACK_TOOLS = new Set([
  'Python', 'uv', 'pytest', 'Pydantic', 'FastAPI', 'PostgreSQL', 'Git', 'GitHub',
  'Docker', 'curl', 'Postman', 'Bruno', 'OpenAI SDK', 'Anthropic SDK',
  'LangChain', 'LangGraph', 'LlamaIndex', 'DSPy', 'pgvector', 'Qdrant',
  'CrewAI', 'Agno', 'Google ADK', 'OpenAI Agents SDK', 'E2B', 'Modal',
  'DeepEval', 'RAGAS', 'Langfuse', 'Phoenix', 'vLLM', 'MLflow', 'Streamlit',
  'Chroma', 'Docker Compose', 'Docker Hub', 'GitHub Actions', 'AWS', 'EC2',
  'CodeDeploy', 'Auto Scaling', 'Secrets Manager', 'Prometheus', 'Grafana',
  'Node Exporter', 'Guardrails AI', 'NeMo Guardrails', 'Whisper', 'Kokoro',
  'PEFT', 'Unsloth', 'Axolotl',
]);

/* Controlled vocabulary for the stack pills. A tag is emitted ONLY if its
   pattern actually occurs in that level's source text — this is extraction from
   the .txt files, never authored-in tooling. */
const STACK_VOCAB = [
  ['Python', /\bPython\b/], ['uv', /\buv\b/], ['pytest', /\bpytest\b/], ['type hints', /\btype hints\b/],
  ['Pydantic', /\bPydantic\b/], ['FastAPI', /\bFastAPI\b/], ['HTTP/REST', /\bREST\b/], ['JSON', /\bJSON\b/],
  ['OpenAPI', /\bOpenAPI\b/], ['PostgreSQL', /\bPostgreSQL\b/], ['SQL', /\bSQL\b/], ['Git', /\bGit\b/],
  ['GitHub', /\bGitHub\b/], ['Docker', /\bDocker\b/], ['curl', /\bcurl\b/], ['Postman', /\bPostman\b/],
  ['Bruno', /\bBruno\b/], ['async', /\basync\b|\basynchronous\b/i],
  ['OpenAI SDK', /\bOpenAI\/Anthropic SDKs\b|\bOpenAI SDK\b/], ['Anthropic SDK', /\bOpenAI\/Anthropic SDKs\b/],
  ['LangChain', /\bLangChain\b/], ['LangGraph', /\bLangGraph\b/], ['LlamaIndex', /\bLlamaIndex\b/],
  ['DSPy', /\bDSPy\b/], ['streaming', /\bstream(ing|ed)?\b/i], ['tool calling', /\btool.calling\b|\bfunction \/ tool calling\b/i],
  ['structured outputs', /\bstructured outputs?\b/i], ['JSON Schema', /\bJSON Schema\b/],
  ['prompt caching', /\bprompt caching\b|\bcontext caching\b/i], ['few-shot', /\bfew-shot\b/],
  ['system prompts', /\bsystem prompt\b/i], ['prompt injection', /\bprompt injection\b/i],
  ['OCR', /\bOCR\b/], ['chunking', /\bchunk(ing|s)?\b/i], ['embeddings', /\bembeddings?\b/i],
  ['pgvector', /\bpgvector\b/], ['Qdrant', /\bQdrant\b/], ['ANN', /\bANN\b|Approximate Nearest Neighbor/],
  ['HNSW', /\bHNSW\b/], ['IVF', /\bIVF\b/], ['BM25', /\bBM25\b/], ['hybrid retrieval', /\bhybrid retrieval\b/i],
  ['RRF', /\bRRF\b|Reciprocal Rank Fusion/], ['Recall@k', /\bRecall@k\b/], ['reranking', /\brerank(ing|ers?)?\b/i],
  ['HyDE', /\bHyDE\b/], ['RAG-Fusion', /\bRAG-Fusion\b/], ['Self-RAG', /\bSelf-RAG\b/], ['CRAG', /\bCRAG\b/],
  ['Adaptive RAG', /\bAdaptive RAG\b/], ['Graph RAG', /\bGraph RAG\b/], ['citations', /\bcitations?\b/i],
  ['ReAct', /\bReAct\b/], ['MCP', /\bMCP\b/], ['A2A', /\bA2A\b/], ['CrewAI', /\bCrewAI\b/], ['Agno', /\bAgno\b/],
  ['Google ADK', /\bADK\b/], ['OpenAI Agents SDK', /\bOpenAI Agents SDK\b/], ['E2B', /\bE2B\b/],
  ['Modal', /\bModal\b/], ['checkpointing', /\bcheckpointing\b/i], ['human-in-the-loop', /\bhuman-in-the-loop\b/i],
  ['summarization', /\bsummariz(ation|e|ing)\b/i], ['scratchpads', /\bscratchpads?\b/i],
  ['DeepEval', /\bDeepEval\b/], ['RAGAS', /\bRAGAS\b/], ['LLM-as-a-Judge', /\bLLM-as-a-Judge\b/i],
  ['MMLU', /\bMMLU\b(?!-)/], ['MMLU-Pro', /\bMMLU-Pro\b/], ['TruthfulQA', /\bTruthfulQA\b/],
  ['AGIEval', /\bAGIEval\b/], ['GPQA', /\bGPQA\b/], ['SimpleQA', /\bSimpleQA\b/],
  ["Humanity's Last Exam", /Humanity['\u2019]s Last Exam/],
  ['RAG Triad', /\bRAG Triad\b/i], ['contextual recall', /\bContextual Recall\b/i],
  ['contextual precision', /\bContextual Precision\b/i],
  ['contextual relevancy', /\bContextual Relevanc(y|e)\b/i],
  ['faithfulness', /\bfaithful(ness)?\b/i], ['answer relevance', /\bAnswer Relevance\b/i],
  ['golden dataset', /\bGolden Dataset\b/i], ['Text-to-SQL', /\bText-to-SQL\b/i],
  ['jailbreaks', /\bjailbreak/i], ['data drift', /\bdata drift\b/i],
  ['Langfuse', /\bLangfuse\b/], ['Phoenix', /\bPhoenix\b/], ['tracing', /\btrac(ing|es?)\b/i],
  ['CI', /\bCI\b/], ['F1', /\bF1\b/], ['MRR', /\bMRR\b/], ['BLEU/ROUGE', /\bBLEU\/ROUGE\b/],
  ['moderation', /\bmoderation\b/i], ['guardrails', /\bguardrails?\b/i], ['least privilege', /\bleast privilege\b/i],
  ['sandboxing', /\bsandbox(ed|ing)?\b/i], ['PII', /\bPII\b/], ['EU AI Act', /\bEU AI Act\b/],
  ['DPDP', /\bDPDP\b/], ['model routing', /\bmodel rout(ing|er)\b/i], ['model gateway', /\bmodel gateway\b|\bgateways?\b/i],
  ['semantic caching', /\bsemantic caching\b/i], ['circuit breakers', /\bcircuit breakers?\b/i],
  ['vLLM', /\bvLLM\b/], ['quantization', /\bquantiz(ation|ed)\b/i], ['KV cache', /\bKV.cache\b/i],
  ['feature flags', /\bfeature flags\b/i], ['canary', /\bcanary\b/i], ['drift detection', /\bdrift\b/i],
  ['MLflow', /\bMLflow\b/], ['Streamlit', /\bStreamlit\b/], ['Chroma', /\bChroma\b/],
  ['Docker Compose', /\bDocker Compose\b/], ['Docker Hub', /\bDocker Hub\b/],
  ['GitHub Actions', /\bGitHub Actions\b/], ['AWS', /\bAWS\b/], ['EC2', /\bEC2\b/],
  ['CodeDeploy', /\bCodeDeploy\b/], ['Auto Scaling', /\bAuto Scaling\b/],
  ['Secrets Manager', /\bSecrets Manager\b/], ['load balancer', /\bLoad Balancer\b/i],
  ['Prometheus', /\bPrometheus\b/], ['Grafana', /\bGrafana\b/], ['Node Exporter', /\bNode Exporter\b/],
  ['Guardrails AI', /\bGuardrails AI\b/], ['NeMo Guardrails', /\bNeMo Guardrails\b/],
  ['Whisper', /\bWhisper\b/], ['Kokoro', /\bKokoro\b/], ['STT', /\bSTT\b/], ['TTS', /\bTTS\b/],
  ['visual RAG', /\bvisual RAG\b/i], ['image generation', /\bimage generation\b/i],
  ['LoRA', /\bLoRA\b/], ['QLoRA', /\bQLoRA\b/], ['PEFT', /\bPEFT\b/], ['Unsloth', /\bUnsloth\b/],
  ['Axolotl', /\bAxolotl\b/], ['SFT', /\bSFT\b/], ['DPO', /\bDPO\b/], ['RLHF', /\bRLHF\b/],
  ['RFT', /\bRFT\b/], ['distillation', /\bdistill(ation|\b)/i], ['tokenization', /\btokeniz(ation|er)\b/i],
  ['attention', /\battention\b/i], ['transformers', /\btransformer\b/i],
];

const MODULE_RE = /^([MP])(\d+)\.(\d+)\s*[·•]\s*(.+?)\s*[—–-]+\s*\(?sessions:\s*(\d+)\)?\s*(\[gap\])?\s*$/i;
const NAMED_CAPSTONE_RE = /^Level\s+(\d+)\s+Capstone\s*[·•]\s*(.+?)\s*$/i;
const LEVEL_TITLE_RE = /^Level\s+(\d+)\s*[·•]\s*(.+?)\s*$/;
const COMPLETION_RE = /^Level\s+\d+\s+completion outcome\s*$/i;
const SESSION_SUB_RE = /^Session\s+\d+\s*[·•]\s*(.+)$/i;

/**
 * Some modules group their objectives under bare sub-headings that carry no
 * "Session N ·" prefix ("Component-level evaluation", "Failure recovery",
 * "Coding assistant"). Objectives in these files are always full sentences
 * ending in a period, so a short capitalised line with no terminal punctuation
 * is a heading rather than content.
 *
 * `inColonList` is the guard that makes this safe: after a line ending in a
 * colon, short capitalised lines are the items being introduced, not headings.
 * That is what keeps the RAG Triad's "Contextual Relevancy / Faithfulness /
 * Answer Relevance" as list items. Arrows and middots mark flow and option
 * lines, which are content too.
 */
function isBareSubheading(line, inColonList) {
  return (
    !inColonList &&
    line.length <= 45 &&
    !/[.,;:!?]$/.test(line) && // objectives are full sentences; headings are not
    !/[→·•]/.test(line) && //     arrows and middots mark flow and option lines
    /^[A-Z]/.test(line) //        headings are capitalised, list fragments are not
  );
}

const LABELS = [
  ['outcome', /^Outcome:\s*/i],
  ['tryIt', /^Try:\s*/i],
  ['mentalModel', /^Mental model:\s*/i],
  ['finalResult', /^Final result:\s*/i],
];

function findContentDir() {
  for (const dir of CONTENT_DIRS) {
    if (existsSync(dir) && readdirSync(dir).some((f) => /^level\d+.*\.txt$/i.test(f))) return dir;
  }
  throw new Error(`No level*.txt files found in:\n  ${CONTENT_DIRS.join('\n  ')}`);
}

function pickModuleIcon(name) {
  for (const [re, icon] of MODULE_ICON_RULES) if (re.test(name)) return icon;
  return 'circle-dot';
}

function extractStack(text) {
  const seen = new Set();
  const tags = [];
  for (const [label, re] of STACK_VOCAB) {
    if (re.test(text) && !seen.has(label)) {
      seen.add(label);
      tags.push({ label, kind: STACK_TOOLS.has(label) ? 'tool' : 'concept' });
    }
  }
  return tags;
}

function parseLevel(file, raw) {
  const lines = raw.split(/\r?\n/).map((l) => l.trim());
  const todos = [];

  const titleLine = lines.find((l) => LEVEL_TITLE_RE.test(l));
  if (!titleLine) throw new Error(`${file}: no "Level N · Title" line`);
  const [, numStr, title] = titleLine.match(LEVEL_TITLE_RE);
  const number = Number(numStr);

  // Scope / Goal one-liner, plus the optional metadata line L1 carries.
  const scopeLine = lines.find((l) => /^(Scope|Goal):\s*/i.test(l));
  const scope = scopeLine ? scopeLine.replace(/^(Scope|Goal):\s*/i, '') : '';
  if (!scope) todos.push('Missing "Scope:"/"Goal:" line — level has no one-line summary.');

  const metaLine = lines.find((l) => /^Prerequisites:/i.test(l)) || '';
  const prereqStated = metaLine ? (metaLine.match(/^Prerequisites:\s*([^·]+)/i)?.[1] || '').trim() : '';

  const modules = [];
  const completionOutcomes = [];
  let cur = null;
  let inCompletion = false;
  let group = null;
  let inColonList = false;

  const pushLine = (line) => {
    if (!cur) return;
    for (const [key, re] of LABELS) {
      if (re.test(line)) { cur[key] = line.replace(re, ''); return; }
    }
    const sub = line.match(SESSION_SUB_RE);
    if (sub) { group = sub[1]; inColonList = false; return; }

    if (isBareSubheading(line, inColonList)) { group = line; return; }

    // A colon opens a short list whose items must not be read as headings.
    if (/:$/.test(line)) inColonList = true;
    else if (/\.$/.test(line)) inColonList = false;

    // Everything after the module's Outcome: is commentary, not an objective.
    if (cur.outcome || cur.finalResult) cur.notes.push(line);
    else cur.objectives.push(group ? { text: line, group } : { text: line });
  };

  for (const line of lines) {
    if (!line) continue;

    if (COMPLETION_RE.test(line)) { inCompletion = true; cur = null; continue; }
    if (inCompletion) {
      if (/^By the end of this level/i.test(line)) continue;
      completionOutcomes.push(line);
      continue;
    }

    const m = line.match(MODULE_RE);
    if (m) {
      const [, kind, lvl, idx, name, sessions, gap] = m;
      cur = {
        id: `${kind.toUpperCase()}${lvl}.${idx}`,
        name,
        sessionCount: Number(sessions),
        icon: pickModuleIcon(name),
        objectives: [], notes: [],
        isCapstone: /capstone/i.test(name),
        isGap: Boolean(gap),
      };
      group = null;
      inColonList = false;
      modules.push(cur);
      continue;
    }

    const nc = line.match(NAMED_CAPSTONE_RE);
    if (nc) {
      cur = {
        id: `L${nc[1]} Capstone`,
        name: nc[2],
        sessionCount: null, // this file states no session count for its capstone
        icon: 'flag',
        objectives: [], notes: [],
        isCapstone: true,
        isGap: false,
      };
      group = null;
      inColonList = false;
      modules.push(cur);
      continue;
    }

    if (line === titleLine || line === scopeLine || line === metaLine) continue;
    pushLine(line);
  }

  if (!modules.length) todos.push('No modules parsed — check the module header format.');
  /* completionOutcomes is still parsed and kept in the data, but the level pages
     no longer render it, so a missing section is not a defect worth flagging. */

  const capstone = modules.find((m) => m.isCapstone) || null;
  /* A projects level is entirely P-prefixed builds, so it has no separate
     capstone — detected structurally rather than by hardcoding its number. */
  const isProjectsLevel = modules.length > 0 && modules.every((m) => m.id.startsWith('P'));
  if (!capstone && !isProjectsLevel) todos.push('No capstone/ship-it module found.');

  const totalSessions = modules.reduce((n, m) => n + (m.sessionCount || 0), 0);

  // Cross-check against a stated duration where the file gives one.
  const stated = raw.match(/Suggested duration:\s*(\d+)\s*sessions/i);
  if (stated && Number(stated[1]) !== totalSessions) {
    todos.push(`Stated duration (${stated[1]}) != sum of module sessions (${totalSessions}).`);
  }

  const phase = PHASES.find((p) => p.levels.includes(number));

  return {
    number,
    slug: `level-${number}`,
    title,
    sourceFile: file,
    scope,
    prereqStated: prereqStated || null,
    phase: phase.id,
    icon: LEVEL_ICONS[number] || 'circle-dot',
    modules,
    stack: extractStack(raw),
    project: capstone ? capstone.id : null,
    totalSessions,
    statedSessions: stated ? Number(stated[1]) : null,
    completionOutcomes,
    todos,
  };
}

const dir = findContentDir();
const files = readdirSync(dir)
  .filter((f) => /^level\d+.*\.txt$/i.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const levels = files.map((f) => parseLevel(f, readFileSync(join(dir, f), 'utf8')))
  .sort((a, b) => a.number - b.number);

const expected = Array.from({ length: 16 }, (_, i) => i);
const missing = expected.filter((n) => !levels.some((l) => l.number === n));
if (missing.length) throw new Error(`Missing level files for: ${missing.join(', ')}`);

const out = {
  generatedFrom: dir.replace(root, '.'),
  totalLevels: levels.length,
  totalSessions: levels.reduce((n, l) => n + l.totalSessions, 0),
  totalModules: levels.reduce((n, l) => n + l.modules.length, 0),
  phases: PHASES,
  levels,
};

mkdirSync(join(root, 'src/data'), { recursive: true });
writeFileSync(join(root, 'src/data/levels.json'), JSON.stringify(out, null, 2));

const flagged = levels.filter((l) => l.todos.length);
console.log(`parsed ${levels.length} levels · ${out.totalModules} modules · ${out.totalSessions} sessions`);
for (const l of flagged) for (const t of l.todos) console.log(`  TODO L${l.number}: ${t}`);
