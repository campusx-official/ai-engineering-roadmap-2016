/**
 * Interview Prep — the second "After the 100 days" section of 100 Days of AI
 * Engineering. Hand-authored content, rendered by
 * src/pages/100-days/interview-prep.astro.
 */

export const INTERVIEW_HREF = '/100-days/interview-prep/';

export type QuestionType = 'Concept' | 'Scenario' | 'Debugging' | 'Design' | 'Defense';

export interface Question {
  number: number;
  type: QuestionType;
  question: string;
  /** What a strong answer covers. */
  answer: string;
}

export interface QuestionGroup {
  title: string;
  /** The 100 Days module this group matches, if any. */
  module?: number;
  intro?: string;
  questions: Question[];
}

export const interviewSummary =
  'The 100 questions AI engineering interviews keep coming back to, from core concepts to system design, with what a strong answer covers.';

export const questionTypes: { type: QuestionType; meaning: string }[] = [
  { type: 'Concept', meaning: 'explain how something works and when to use it.' },
  { type: 'Scenario', meaning: 'decide what to do in a specific situation.' },
  { type: 'Debugging', meaning: 'find the cause of a problem in a live system.' },
  { type: 'Design', meaning: 'design a system from a short brief.' },
  { type: 'Defense', meaning: 'explain and justify your own work.' },
];

type Row = [QuestionType, string, string];

function group(title: string, start: number, rows: Row[], extra: Partial<QuestionGroup> = {}): QuestionGroup {
  return {
    title,
    ...extra,
    questions: rows.map(([type, question, answer], i) => ({ number: start + i, type, question, answer })),
  };
}

export const questionGroups: QuestionGroup[] = [
  group('LLM Fundamentals', 1, [
    ['Concept', 'What does an LLM actually do when it generates text?', "It predicts the likelihood of every possible next token, picks one, adds it, and repeats; it's not looking up stored answers; sampling settings decide how the next token is picked; this explains both its flexibility and its fluent mistakes."],
    ['Concept', 'What is a token, and why do token counts matter?', 'Tokens are pieces of words that models read and charge by; they set cost, how much fits in the context window and how long generation takes; Hindi, mixed-language text, code and numbers often use more tokens for the same meaning.'],
    ['Concept', 'Why do LLMs make things up?', 'Models are trained to produce plausible text, not to check facts; gaps in knowledge, vague questions and missing context make it worse; reduce it with retrieval, citations, permission to say "I don\'t know", output checks and evals that measure it.'],
    ['Concept', "What is the context window, and why isn't a bigger one always better?", 'Instructions, history, documents, tool results and the answer all share one limit; long inputs cost more and respond slower; models often miss details buried in the middle; choosing the right context beats sending more.'],
    ['Concept', 'How does temperature affect output, and how do you choose it?', 'Low temperature makes output more predictable, high makes it more varied; use low for extraction, classification and facts, higher for brainstorming; reasoning models may ignore it; check consistency by running the same input several times.'],
    ['Concept', 'Why does a long answer take longer than a long question?', 'The input is processed largely in parallel, but the answer is generated one token at a time; time to first token and tokens per second are separate measures; streaming improves how fast it feels; capping output length cuts both time and cost.'],
    ['Scenario', "When would you use a reasoning model, and when wouldn't you?", 'Reasoning models help on multi-step logic, math, code and planning; they waste money and time on extraction, rewriting and simple classification; decide by testing both on your own examples and comparing accuracy, cost and speed.'],
    ['Concept', "What's the difference between a base model and a chat model?", "A base model is trained only to continue text; chat models get extra training on instructions and human feedback; that's why they follow instructions, answer conversationally and refuse some requests."],
    ['Scenario', 'How would you choose a model for a new feature?', 'Define the task and its requirements (quality, speed, cost, context size, data rules, features like tool calling); shortlist using public rankings; test on your own examples; look at the failures, not just the score; pin the version you choose.'],
    ['Concept', "Why can't you trust leaderboard rankings for your use case?", "Leaderboards use other people's tasks, prompts and definitions of a good answer; test questions may have leaked into training data; old benchmarks are saturated; use rankings to shortlist, then decide on your own data."],
    ['Concept', 'How do API models and open-weight models compare?', 'API models offer top capability and no infrastructure but less control and data leaves your boundary; open models offer control, privacy and cheaper costs at high volume but need hosting work; check licenses; hosted open models are a middle path.'],
    ['Concept', 'How do models handle images and PDFs, and what goes wrong?', 'Images become tokens and cost more at higher resolution; digital PDFs have text, scanned ones are images; models struggle with counting, tiny text, exact table values and invent details; send clean text when you have it.'],
  ], { module: 1 }),
  group('Building with LLM APIs', 13, [
    ['Concept', "LLM APIs don't remember anything. How do you build a multi-turn chat?", 'Your app stores the conversation and sends the history with every request; history grows cost and length, so trim or summarize it; what your app stores and what you send the model are separate decisions.'],
    ['Concept', 'How does tool calling work from start to finish?', 'You describe tools to the model; it returns a tool name and inputs instead of an answer; your code checks the inputs and runs the tool; you send the result back with its ID; the model continues or answers; it may call several tools.'],
    ['Concept', 'How do you get structured output you can rely on?', 'Use the model\'s structured-output feature with a schema, not "please return JSON"; validate every result; retry, repair or reject failures; remember that valid format doesn\'t mean correct content.'],
    ['Concept', 'What makes a good tool for an LLM?', 'A precise name and description of when to use it, few typed inputs, small and useful results, clear error messages, and no overlap with other tools; the description is effectively part of the prompt.'],
    ['Scenario', 'Which API errors should you retry, and how?', 'Retry temporary failures such as rate limits, server errors and timeouts, with growing waits, a little randomness and a cap on attempts; fail fast on bad keys and invalid requests; set timeouts on every call; fall back to another model when needed.'],
    ['Concept', 'What is streaming, and why use it?', "The answer is sent piece by piece as it's generated; it cuts the time until users see something without making the total faster; you still assemble and save the full response; handle cancellations and broken streams."],
    ['Scenario', 'When would you use a framework like LangChain instead of calling the API directly?', 'Frameworks speed up common patterns, switching providers and integrations; they add abstraction that can make debugging harder; either way you need to understand the underlying calls; choose based on the project, not popularity.'],
    ['Scenario', 'How would you run 10,000 documents through an LLM efficiently?', "Estimate cost first; run requests concurrently with a limit to respect rate limits; use cheaper batch APIs when results aren't urgent; retry failed items individually; save results as you go so a crash doesn't restart everything."],
    ['Concept', 'What should you record for every LLM request?', 'Model and version, prompt version, input and output tokens, time taken, cost, retries, errors and tool calls; link the steps of one user request into a single trace; keep personal data out of logs.'],
    ['Concept', "What's the difference between a chain and an agent?", "In a chain your code decides the steps; in an agent the model decides; chains are cheaper, faster and more predictable; use an agent only when the steps genuinely can't be known in advance."],
  ], { module: 2 }),
  group('Prompt Engineering', 23, [
    ['Concept', 'What goes into a good system prompt?', "The app's purpose, how it should behave, what it must not do, what to do when information is missing or out of scope, and what a good answer looks like; a few clear rules beat a long rulebook; keep per-request details out of it."],
    ['Concept', 'When do few-shot examples help, and how do you choose them?', 'Use them when the format or judgment you want is hard to describe; pick varied examples, including a tricky case; models copy examples closely, and order can matter; they add tokens to every request.'],
    ['Scenario', 'How do you know a prompt change is actually an improvement?', 'Score both versions on the same test set, never on one good answer; run each more than once to check consistency; compare cost and speed too; keep some questions aside to confirm the gain.'],
    ['Concept', 'How do you prompt a reasoning model differently?', 'Skip "think step by step"; give the goal, the relevant context, the constraints and what a good answer looks like; avoid micro-managing its steps; measure whether the extra reasoning pays for itself.'],
    ['Concept', 'What is prompt caching, and how do you design for it?', "Providers charge less for a prompt start they've recently seen; put fixed instructions and documents first and changing parts last; measure how often the cache is used and what it saves."],
    ['Concept', "What is prompt injection, and why can't a prompt alone stop it?", "Text from users or documents that tries to override your instructions, typed directly or hidden in content; models can't reliably tell instructions from data; real protection is in code: limited permissions, checked tool calls, output checks and human approval."],
    ['Scenario', 'How do you manage prompts in production?', 'Version prompts like code and record which version and model produced each result; test changes against the regression suite before release; roll out gradually; be able to roll back.'],
    ['Concept', 'Can you use a model to improve your prompts?', 'Yes, by giving a model your prompt and its failures, or with tools like DSPy that search for better instructions and examples; score every candidate on a test set; judge the winner on held-out questions to avoid overfitting; read what it produced.'],
  ], { module: 3 }),
  group('RAG', 31, [
    ['Scenario', "When should you use RAG, and when shouldn't you?", 'Use it for private, changing or large knowledge and when answers need sources; skip it when the model already knows enough, the task is just transforming text, or everything fits in the prompt; fine-tuning is for behavior, not facts.'],
    ['Concept', 'Walk me through a RAG pipeline.', 'Load and clean documents, split them into passages, embed and store them with their details; at question time, search, optionally rerank, assemble the best passages into the prompt, and generate an answer with citations.'],
    ['Scenario', 'How do you choose a chunking strategy?', "Follow the document's own structure where possible; small passages are precise but lose context, large ones keep context but add noise; keep titles and sections with each passage; compare options on a retrieval test set."],
    ['Concept', 'What are embeddings, and how do you choose an embedding model?', "Lists of numbers that place similar meanings close together; choose on retrieval quality with your own data and languages, plus cost and speed; embeddings from different models can't be mixed, so changing models means re-embedding."],
    ['Concept', 'Why use hybrid search?', 'Meaning-based search misses exact names, codes and numbers; keyword search catches them; combining both, for example with reciprocal rank fusion, works best on technical or mixed questions; measure the gain.'],
    ['Concept', "What does a reranker do, and when is it worth it?", 'It reads the question and each candidate passage together to judge relevance more accurately; retrieve many, rerank, keep the best few; it adds time and cost; measure whether it improves answers for your data.'],
    ['Scenario', "A user's question is vague or has several parts. How can retrieval still work?", 'Rewrite it into a clearer query, search with several versions and combine results, search with a draft answer, or split it into sub-questions; each adds calls, so use them only where they help.'],
    ['Scenario', 'How do you handle tables, scans and messy PDFs?', 'Use layout-aware parsers, text recognition or vision models for scans; keep tables whole with their headers; check extracted text against the original on samples; use the expensive approach only for documents that need it.'],
    ['Scenario', 'How would you answer questions that need numbers from a database?', 'Text-to-SQL with the table structure and column descriptions; read-only access, query checks and row limits; retry failed queries within a limit; show the query or figures; route each question to documents, the database or both.'],
    ['Concept', 'What is self-correcting RAG?', "Grade the retrieved passages and search again or fall back if they're weak; check the answer is supported before returning it; search in steps for multi-part questions; always cap retries to control cost."],
    ['Scenario', 'When is Graph RAG worth the effort?', "For questions about relationships or about a whole collection that no single passage answers; it's expensive to build and keep up to date; add it only when measured failures show plain retrieval can't cope."],
    ['Scenario', 'How do you stop a RAG system from making things up?', 'Instruct it to answer only from the passages; require citations and check they support the claims; let it say "I don\'t know" when evidence is weak; improve retrieval; measure faithfulness on a test set.'],
    ['Concept', 'How do you evaluate a RAG system?', 'Test retrieval on its own (did it find the right passage) and generation on its own (is the answer supported and relevant), then the full pipeline and user-facing quality; track cost and speed alongside.'],
    ['Scenario', 'How do you build a good test set for a RAG app?', 'Real questions with expected answers and source passages; include unanswerable, ambiguous and multi-part questions; use a model to suggest more but check each one yourself; keep adding real failures from production.'],
    ['Concept', 'How do you know your model-as-a-judge can be trusted?', 'Score a sample yourself and measure agreement; ask one clear pass-or-fail question per check; watch for biases toward longer answers, the first option or its own outputs; fix the judge until it agrees with you.'],
    ['Debugging', 'Retrieval finds the right passages, but answers are still wrong. What do you check?', 'How passages are assembled (too many, bad order, conflicting documents), the prompt, and whether the model answers faithfully when given the correct passages directly; test each piece separately to find the cause.'],
    ['Scenario', "How do you make sure changes don't make your app worse?", 'A versioned test set and a baseline; run the evaluation automatically on every change to prompts, settings, models or code; block releases that score worse; watch quality, cost and speed together.'],
    ['Concept', 'What is indirect prompt injection in a RAG app, and how do you defend against it?', 'Hidden instructions inside retrieved documents; treat retrieved text as data, never commands; limit what the model can do and check tool calls in code; check outputs for data-leaking links; control who can add documents.'],
    ['Scenario', "How do you make sure users only see documents they're allowed to see?", 'Store permissions with each passage and filter during search, not after the answer; keep customers fully separated; check caches, memory and citations, which can also leak restricted information.'],
    ['Scenario', 'How do you handle personal data in a RAG system?', "Detect and remove or mask it before indexing; keep it out of logs, traces and test sets; delete it everywhere when required; know your model provider's data retention; know the data protection rules that apply, such as India's DPDP Act."],
  ], { module: 4 }),
  group('Agents', 51, [
    ['Concept', 'What is an AI agent, and when should you not build one?', 'A model that decides its own next step in a loop, using tools until a goal is met; worth it for open-ended, multi-step tasks; when the steps can be written down, a fixed workflow is cheaper and more reliable.'],
    ['Concept', 'Explain the ReAct pattern.', 'The model alternates between deciding what to do and doing it, looks at each result, and decides again; it needs clear tools and stopping rules; planning first is an alternative for longer tasks.'],
    ['Scenario', 'How do you stop an agent from looping forever or overspending?', 'Limits on steps, time, retries and cost; detecting repeated actions; clear finish conditions; handing over to a person when stuck; budgets checked in code, not left to the model.'],
    ['Concept', 'Why use a framework like LangGraph for agents?', 'Explicit state, steps and branches you can inspect; saving progress so runs can resume; pausing for human approval; easier debugging than a hand-written loop as agents grow.'],
    ['Scenario', 'How do you add human approval to an agent?', 'Pause before any action that changes something; show exactly what the agent wants to do; let the person approve, reject or edit; resume from saved state; make actions safe to retry.'],
    ['Concept', 'What is MCP, and how is it different from tool calling?', 'Tool calling is how a model asks for an action; MCP is a standard for packaging tools, data and prompts in servers that any compatible app can connect to; host, client and server roles.'],
    ['Design', 'How would you design an MCP server for an internal system?', 'A few focused tools with clear descriptions and typed inputs, resources for reference data, useful errors and small results, authentication, minimal permissions, versioning, and testing with more than one app.'],
    ['Concept', 'How do you give an agent memory?', "Short-term memory within a task and long-term memory across conversations; store useful facts, past events and lessons rather than every message; look up only relevant memories; update, expire and delete them; keep each user's memories separate."],
    ['Concept', 'What is context engineering, and why does it matter for agents?', "Deciding what goes into the model's context at each step; context fills up fast in long runs and quality drops; summarize history, trim tool results, keep notes outside the context, load only needed tools, and cache fixed parts."],
    ['Scenario', 'How do you keep a long-running agent on track?', 'Summaries that keep the goal, decisions and unfinished work; plans and notes stored outside the context; trimmed tool results; sub-agents with fresh context for side tasks; saved progress so it can resume.'],
    ['Concept', 'What is harness engineering?', 'Everything around the model that makes it an agent: the loop, instructions, tools, context handling, checks on its work and permissions; most agent failures are fixed in the harness, not by a bigger model; change one thing at a time and measure.'],
    ['Scenario', 'When is a multi-agent system better than a single agent?', 'When parts of the task need different tools, permissions or models, or benefit from separate context and parallel work; costs include coordination, lost information between agents and higher spend; prove it beats one agent with numbers.'],
    ['Concept', 'Describe common multi-agent patterns.', 'A supervisor that delegates to specialists, handoffs in sequence, parallel specialists whose results are merged, and teams of teams; match the pattern to how the work naturally divides.'],
    ['Concept', 'How do you evaluate an agent?', 'Task success, choosing the right tools with the right inputs, a sensible path without loops or wasted steps, recovery from failures, cost and time per task, and safety; read traces; check any judge against your own scores.'],
    ['Scenario', 'How do you test whether an agent copes when things go wrong?', 'Make tools fail, return bad data or go missing on purpose; check whether it retries, switches approach or hands over; measure recovery rate, not just success when everything works; add these cases to the regression suite.'],
    ['Concept', 'Why are agents riskier than chatbots?', 'Agents take actions with real effects; the dangerous mix is untrusted input, access to private data or powerful tools, and a way to send data out; defend with minimal permissions, checks in code, approval and sandboxing.'],
    ['Scenario', 'How do you let an agent run code safely?', 'Run it in an isolated sandbox, never in your app; restrict file access, network, credentials, time and resources; treat any code, queries or commands the model writes as untrusted; return only the needed output.'],
    ['Concept', 'What are the security risks of connecting to third-party MCP servers?', 'Hidden instructions in tool descriptions or results, servers changing behavior after you approved them, and over-broad permissions; review servers like third-party code, pin versions and give each the narrowest access.'],
    ['Scenario', 'How do you red-team an agent?', 'Attack through user messages, documents, tool results, MCP and memory; try to make it misuse tools, exceed permissions, leak secrets or act without approval; measure how often attacks succeed; fix and add each one to the regression suite.'],
    ['Debugging', 'An agent works in testing but fails in production. How do you debug it?', 'Read production traces; compare real inputs with your test cases; check tool errors and slowness, context growth, and recent model or prompt changes; reproduce the failure; add it to the test set.'],
  ], { module: 5 }),
  group('Shipping to Production', 71, [
    ['Scenario', 'How would you take an LLM app to production?', 'An API with streaming, state kept in a database so the app can restart or scale, containers, a managed host, secrets kept out of code, separate test and live environments, health checks, authentication and per-user limits.'],
    ['Scenario', 'How do you stop a prompt change from breaking production?', 'Treat prompts as code, run the regression suite automatically and block worse versions, release to a small share of users first or test in the shadows, and roll back fast if needed.'],
    ['Concept', 'What would you monitor for an LLM app?', 'Requests, errors, typical and slowest response times, tokens, cost per request and per user, a live quality score on sampled answers, user feedback, and shifts in what users ask; alerts on each.'],
    ['Scenario', 'How do you collect and use user feedback?', 'Explicit ratings and comments plus signals like rephrasing or giving up; review them regularly; turn real failures into test cases; remember that feedback is sparse and biased toward unhappy users.'],
    ['Scenario', 'How would you cut your LLM costs in half?', "First measure where cost goes; then cache repeated answers and prompt prefixes, send simple requests to cheaper models, shorten prompts and outputs, use batch APIs, or fine-tune a small model; confirm quality didn't drop."],
    ['Scenario', 'How do you make an LLM app faster?', 'Stream answers, use smaller or faster models where possible, run independent steps in parallel, remove unnecessary sequential calls, cache, shorten outputs, and measure which step is actually slow first.'],
    ['Concept', 'What is semantic caching, and what are the risks?', 'Reusing an answer when a new question means the same as an earlier one; a wrong match returns a wrong answer; cached answers go stale; never share cached answers across users with different permissions or personal data.'],
    ['Concept', 'What is a model gateway, and why use one?', "One endpoint in front of several providers that handles keys, budgets, routing, failover and usage tracking; it becomes a critical dependency itself; providers aren't interchangeable, so test before switching."],
    ['Scenario', 'When would you host an open model yourself?', 'Strict data rules, high and steady volume, or the need for full control; costs include GPUs, operations and possibly lower quality; compare per-token and per-hour pricing at your real volume; use efficient serving and compressed models.'],
    ['Scenario', 'When should you fine-tune instead of using prompting or RAG?', 'Fine-tune for behavior, format, style or a narrow high-volume task, or to replace a large model with a small one; not for adding facts that change; only after better prompts and RAG have measurably run out.'],
    ['Concept', "Explain LoRA and why it's popular.", 'It freezes the base model and trains a small add-on, so it needs far less memory and compute; QLoRA goes further by training on a compressed model; add-ons are small and can be swapped on one base model.'],
    ['Scenario', 'How do you know a fine-tune actually worked?', "Compare it with a prompted baseline on a held-out set it never trained on; run the full regression suite to catch skills it lost; compare cost and speed; check that test data didn't leak into training."],
    ['Concept', 'What is distillation?', "Training a small model on a larger model's outputs for a specific task, so it performs almost as well for much less; check the provider's terms; evaluate it like any other model."],
    ['Scenario', 'Your main model provider has an outage. What happens in your app?', "Automatic failover to a backup provider through a gateway, graceful degradation, cached answers where safe, clear messages to users, alerts and a runbook; failover should be tested before it's needed."],
    ['Scenario', 'How do you roll out a new model version safely?', 'Pin versions so nothing changes silently; run the full evaluation suite; try it on real traffic in the shadows or on a small share of users; watch quality, cost and speed; keep a rollback ready.'],
  ], { module: 6 }),
  group('System Design', 86, [
    ['Design', 'Design a customer support assistant for a company with 10,000 help articles and 50,000 users a day.', 'Traffic and cost estimates; RAG with hybrid search and reranking; citations and handing over to a human; caching common questions; routing simple questions to cheaper models; evals, monitoring and feedback; fallback providers.'],
    ['Design', "Design an assistant over a company's internal documents with strict access control.", "Permissions applied during search, separation between teams, deployment inside the company's cloud or a private platform, audit logs, personal-data handling, and tests proving users can't see restricted content."],
    ['Design', 'Design a system that extracts data from one million scanned invoices a month.', 'A batch pipeline with parsing and vision models, schema validation, confidence scores and human review, throughput and cost per document, cheaper models for easy documents, and accuracy monitoring.'],
    ['Design', 'Design a coding assistant that can fix bugs in a large codebase.', 'Searching and selecting relevant code, managing context, running tests in a sandbox, proposing changes for human approval, measuring success on real past issues, and controlling cost per task.'],
    ['Design', 'Design a voice agent that books appointments.', 'Speech-to-text, model and text-to-speech in sequence versus a single speech model; a tight response-time budget; detecting when the caller has finished; handling interruptions; booking tools with confirmation; handing over to a person.'],
    ['Design', 'Design a research agent that produces cited reports.', 'Planning sub-questions, parallel search agents with separate context, checking every citation, time and cost budgets, long-running jobs with progress updates, and evaluating report accuracy.'],
  ], {
    intro:
      'For each design question, a strong answer moves through: clarify requirements → estimate traffic and cost → start with the simplest design → add pieces only where needed → plan for failures, security and evaluation → explain the trade-offs.',
  }),
  group('Debugging Scenarios', 92, [
    ['Debugging', 'RAG quality was fine at launch but dropped after a few weeks. How do you investigate?', 'Find what changed (documents, index, model version, prompt, the kinds of questions users ask); run the test set on the current version; test retrieval and generation separately; check for stale or duplicated documents; add the failures as tests.'],
    ['Debugging', 'Your agent suddenly costs three times more per task. What do you check?', 'Traces for more steps, loops or retries; growing context or larger tool results; a routing or model change; a drop in cache hits; then add or tighten cost and step limits.'],
    ['Debugging', 'Response times doubled overnight. What do you do?', "Find which step is slow (provider, search, tools, your own code); check traffic, rate limits and output length; fail over or degrade if it's the provider; follow the runbook and alert the right people."],
    ['Scenario', 'A prompt change improves quality but doubles cost. Do you ship it?', 'Put a value on the quality gain against the extra cost; find where the extra tokens come from; try to keep the gain more cheaply (caching, a cheaper model for part of the work); if you ship, roll out gradually and watch both.'],
    ['Debugging', 'Users say the assistant is making things up. How do you respond?', 'Collect real examples; sort them into retrieval misses, unsupported answers and outdated documents; measure faithfulness; strengthen "I don\'t know" behavior and citations; fix the root cause and add the cases to the test set.'],
  ]),
  group('Your Projects', 97, [
    ['Defense', 'Walk me through a project you built.', "The problem and who it's for, the simple baseline, the design and key decisions with the alternatives you rejected, results with numbers, a failure and what you changed, and what you'd do next."],
    ['Defense', 'Why did you use RAG, an agent or fine-tuning instead of something simpler?', "What you tried first, the measured shortcoming that justified the extra complexity, and the cost of that complexity; if you can't show the numbers, say what you'd measure."],
    ['Defense', 'What would break first if your project had 100 times the traffic?', "Rough capacity numbers; the likely first bottleneck (rate limits, database, search, cost); and how you'd fix it with caching, scaling, cheaper models or queues."],
    ['Defense', 'How do you keep up with AI without chasing hype?', 'A repeatable process: follow primary sources, test new models and tools on your own test set, compare cost and speed, and roll out gradually; give a real example of something you adopted or rejected and why.'],
  ]),
];

export const practiceSteps: { title: string; body: string }[] = [
  {
    title: 'Go module by module.',
    body: 'Answer each question out loud, then compare with the outline and note what you missed.',
  },
  {
    title: 'Use your own work.',
    body: 'For every question you can, add an example from your course project or the projects you built.',
  },
  {
    title: 'Practice design questions on paper.',
    body: 'Give yourself 30 minutes per design question, and draw the system as you talk.',
  },
  {
    title: 'Run a mock interview.',
    body: 'Ask a friend, mentor or an AI model to interview you with three rounds:',
  },
  { title: 'Score yourself after each round,', body: 'from 1 (weak) to 4 (strong), on:' },
  { title: 'Repeat', body: 'until you score 3 or more on every point in every round.' },
];

export const mockRounds: { title: string; body: string }[] = [
  {
    title: 'Round 1, scenarios and debugging:',
    body: 'three questions from questions 92–96 or the scenario questions in each module.',
  },
  { title: 'Round 2, system design:', body: 'one question from 86–91.' },
  { title: 'Round 3, project defense:', body: 'questions 97–99 about your own project, with follow-ups.' },
];

export const rubric: { title: string; body: string }[] = [
  { title: 'Requirements and assumptions:', body: 'did you clarify before answering?' },
  { title: 'Trade-offs:', body: 'did you weigh quality, speed, cost and risk?' },
  { title: 'Measurement:', body: "did you say how you'd know it worked?" },
  { title: 'Failure and security:', body: 'did you plan for what breaks and what can be attacked?' },
  { title: 'Communication:', body: 'was your answer clear and structured?' },
];

export const questionAnchor = (n: number) => `q-${n}`;
