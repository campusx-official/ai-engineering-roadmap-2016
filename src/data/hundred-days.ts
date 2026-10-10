/**
 * 100 Days of AI Engineering — a compressed companion track to the 16-level
 * roadmap. About an hour a day, and one project that grows across every module
 * instead of a capstone per level.
 *
 * Hand-authored content (there is no .txt source for this track). Modules are
 * added to `hundredDaysModules` in order; the overview page, the 100-day grid
 * and the module routes all read from this list.
 */
import type { PhaseId } from './levels';

export const TOTAL_DAYS = 100;
export const DAYS_BASE = '/100-days';

export interface Bullet {
  /** Short sentence-case title, shown before expanding. */
  title: string;
  text: string;
}

export interface Unit {
  id: string;
  title: string;
  icon: string;
  /** Inclusive day range; a single day is [n, n]. */
  days: [number, number];
  minutes: number;
  bullets: Bullet[];
  mentalModel?: string;
  tryIt?: string;
  outcome?: string;
}

export interface Milestone {
  title: string;
  days: [number, number];
  minutes: number;
  /** One line saying what gets built, shown above the steps. */
  build?: string;
  steps: string[];
  passCriteria: string[];
  about: string;
}

export interface SkippedTopic {
  topic: string;
  why: string;
  /** Roadmap levels that cover it, each linking to the module that does. */
  where: { level: number; href: string }[];
}

export interface DaysModule {
  number: number;
  slug: string;
  title: string;
  /** Colour band, borrowed from the roadmap phase this material comes from. */
  phase: PhaseId;
  icon: string;
  summary: string;
  days: [number, number];
  hours: string;
  before: string;
  /** The framework the module teaches with throughout, if it has one. */
  builtWith?: string;
  outcome: string;
  units: Unit[];
  /** The step this module adds to the 100-day project, if it has one. */
  milestone?: Milestone;
  skipped: SkippedTopic[];
  /** Roadmap level whose CampusX courses this module shares. */
  coursesFromLevel: number;
  /** Roadmap level this module is the short version of; that level links here. */
  shortVersionOf?: number;
}

export const hundredDaysModules: DaysModule[] = [
  {
    number: 1,
    slug: 'llm-fundamentals',
    title: 'LLM Fundamentals',
    phase: 'foundations',
    icon: 'brain-circuit',
    summary:
      'Learn how LLMs behave, what they cost, where they fail, and how to choose one from measurements rather than leaderboard rank.',
    days: [1, 5],
    hours: 'about 4 hours',
    before: 'Basic Python, calling an API, and an API key for at least one model provider.',
    outcome:
      'Explain why an LLM gives fluent wrong answers, estimate what a request will cost and how long it will take, and choose a model from measurements rather than rank.',
    coursesFromLevel: 1,
    shortVersionOf: 1,
    units: [
      {
        id: '1.1',
        title: 'What an LLM Does',
        icon: 'sparkles',
        days: [1, 1],
        minutes: 45,
        bullets: [
          {
            title: 'Next-token prediction',
            text: 'An LLM generates text by predicting the next token, choosing one, adding it, and repeating.',
          },
          {
            title: 'What an LLM is not',
            text: 'It is not a database, a search engine or a fixed program, and it does not look up stored answers.',
          },
          {
            title: 'The path through the model',
            text: 'Text becomes tokens, tokens become numbers the model can work with, its layers refine them, and it outputs the likelihood of each possible next token.',
          },
          {
            title: 'What parameter counts mean',
            text: 'Sizes like 8B or 70B count what the model has learned; more can mean more capability, but bigger is not automatically better for your task.',
          },
          {
            title: 'Why chat models behave as they do',
            text: 'Extra training on instructions and human feedback is why assistants follow instructions, answer conversationally, refuse some requests and hedge.',
          },
        ],
        mentalModel: 'Text → Tokens → Numbers → Model layers → Next-token likelihoods',
        tryIt: 'Send the same prompt five times and note how the answers vary.',
        outcome:
          'Explain in two sentences how an LLM produces an answer and why it can sound confident while being wrong.',
      },
      {
        id: '1.2',
        title: 'Tokens, Context and Latency',
        icon: 'binary',
        days: [2, 2],
        minutes: 80,
        bullets: [
          {
            title: 'Tokens, not words',
            text: 'Models read and charge in tokens, and the same sentence can be split differently by different models.',
          },
          {
            title: 'Why some text costs more',
            text: 'Hindi, mixed Hindi-English, code and numbers often use far more tokens than plain English for the same meaning.',
          },
          {
            title: 'Input vs output tokens',
            text: 'You pay for both; output is usually priced higher and is generated one token at a time.',
          },
          {
            title: 'Latency you can feel',
            text: 'Time to first token and generation speed decide how fast a response feels; long answers take longer than long questions.',
          },
          {
            title: 'What fills the context window',
            text: "Instructions, conversation history, documents, examples, tool results and the model's own answer all share one limit.",
          },
          {
            title: 'Context is not knowledge or memory',
            text: "What's in the window is temporary, the model's training knowledge is fixed, and long-term memory is something you have to build.",
          },
          {
            title: "Bigger windows aren't better windows",
            text: "Facts buried in the middle of long inputs are often missed, and extra text dilutes the model's focus.",
          },
        ],
        tryIt:
          'Count the tokens in an English paragraph, its Hindi translation, a piece of code and a list of numbers. Then estimate the cost of sending each one 10,000 times.',
        outcome:
          'Estimate what a request will cost and roughly how long it will take, and decide whether a task needs more context or better-chosen context.',
      },
      {
        id: '1.3',
        title: 'Controlling Output',
        icon: 'sliders-horizontal',
        days: [3, 3],
        minutes: 50,
        bullets: [
          {
            title: 'Temperature',
            text: 'Lower temperature makes answers more consistent; higher makes them more varied.',
          },
          {
            title: 'Length limits and stop points',
            text: 'Cap how long an answer can be and where it should stop, to control cost and format.',
          },
          {
            title: 'Match randomness to the task',
            text: 'Keep it low for extracting facts, classifying and factual answers; raise it for brainstorming and creative work.',
          },
          {
            title: 'Reasoning models',
            text: 'Some models think longer before answering, which helps on hard math, code, planning and multi-step problems.',
          },
          {
            title: 'When reasoning is wasted',
            text: 'For extraction, rewriting, simple classification and summaries, a fast model is usually just as good and much cheaper.',
          },
          {
            title: 'The trade-off',
            text: 'More reasoning can improve quality but costs more and takes longer; reasoning models may also ignore some settings like temperature.',
          },
        ],
        tryIt:
          'Run one fact-extraction task and one creative task at low and high temperature. Then give three hard problems to a fast model and a reasoning model, and compare accuracy, speed and cost.',
        outcome: 'Choose settings and the type of model based on the task instead of guessing.',
      },
      {
        id: '1.4',
        title: 'Where LLMs Fail',
        icon: 'triangle-alert',
        days: [4, 4],
        minutes: 45,
        bullets: [
          {
            title: 'Common strengths',
            text: 'Summarizing, rewriting and extracting information, classifying, coding, translating and handling messy text.',
          },
          {
            title: 'Common failure modes',
            text: 'Making things up, arithmetic slips, shaky reasoning, ignoring instructions, sensitivity to wording, outdated knowledge and giving different answers each time.',
          },
          {
            title: 'Why models make things up',
            text: 'They are trained to produce a likely continuation, not to check facts, so fluent wrong answers are expected behavior.',
          },
          {
            title: 'Ask "how reliably?", not "can it?"',
            text: 'The real question is how often a model gets your task right in your situation.',
          },
        ],
        tryIt:
          "Write 10 questions: some the model should know, some it can't know, some built on a false premise, and some missing key information. Record each answer and how confident it sounds.",
        outcome:
          'Predict which tasks an LLM will handle well and which need safeguards such as giving it the right documents, checking its output, or a human review.',
      },
      {
        id: '1.5',
        title: 'Choosing a Model',
        icon: 'scale',
        days: [5, 5],
        minutes: 30,
        bullets: [
          {
            title: 'Closed vs open models',
            text: 'Models from API providers offer top capability with less control; open models you can run yourself offer control and privacy but take more work.',
          },
          {
            title: 'No single best model',
            text: 'The right model depends on your task, budget, speed needs and data rules.',
          },
          {
            title: 'Knowledge cutoffs',
            text: "Anything newer than a model's training date has to be given to it, through documents or tools.",
          },
          {
            title: 'Pin your version',
            text: 'The model behind a familiar name can change or be retired, so choose a specific version and re-test when it changes.',
          },
          {
            title: 'Leaderboards narrow the field; your examples decide',
            text: 'Use public rankings to pick a shortlist, then test the shortlist on your own questions.',
          },
          {
            title: 'Five things to compare',
            text: 'Quality on your task, speed, cost per request, how much input it can take, and any privacy or feature needs.',
          },
          {
            title: 'How to choose',
            text: 'Define the task → shortlist → test on your own examples → compare quality, speed and cost → look at the failures → decide.',
          },
        ],
        outcome: 'Choose a model based on results from your own examples rather than popularity or rankings.',
      },
    ],
    skipped: [
      {
        topic: 'Attention and transformer internals',
        why: "Interesting, but doesn't change what you build",
        where: [{ level: 1, href: '/level/1/#m1-3' }],
      },
      {
        topic: 'Mixture-of-Experts',
        why: 'Matters when hosting models, not when calling an API',
        where: [
          { level: 1, href: '/level/1/#m1-3' },
          { level: 11, href: '/level/11/#m11-6' },
        ],
      },
      {
        topic: 'Training methods in detail',
        why: 'One paragraph covers what you need',
        where: [
          { level: 1, href: '/level/1/#m1-4' },
          { level: 13, href: '/level/13/#m13-3' },
        ],
      },
      {
        topic: 'Advanced sampling settings',
        why: 'Temperature covers most real use',
        where: [{ level: 1, href: '/level/1/#m1-7' }],
      },
      {
        topic: 'Cloud AI platforms and model licenses',
        why: 'Deployment decisions for later',
        where: [
          { level: 1, href: '/level/1/#m1-10' },
          { level: 11, href: '/level/11/#m11-2' },
        ],
      },
      {
        topic: 'Named benchmarks',
        why: 'One rule replaces them: shortlist, then test',
        where: [{ level: 1, href: '/level/1/#m1-11' }],
      },
    ],
  },
  {
    number: 2,
    slug: 'building-with-llm-apis',
    title: 'Building with LLM APIs',
    phase: 'foundations',
    icon: 'plug',
    summary:
      'Use LangChain to turn single model calls into a reliable app: conversations, streaming, structured answers, tools, multi-step chains, error handling and cost tracking.',
    days: [7, 15],
    hours: 'about 9 hours',
    before:
      'Module 1 (LLM Fundamentals), the model you chose in its milestone, and your 10 project questions.',
    builtWith: 'LangChain',
    outcome:
      'Build an assistant in LangChain that holds a conversation, streams its answers, returns structured data your code can trust, uses tools safely, recovers from failures, and tells you what every request cost.',
    coursesFromLevel: 2,
    shortVersionOf: 2,
    units: [
      {
        id: '2.1',
        title: 'LangChain Basics and Conversations',
        icon: 'messages-square',
        days: [7, 7],
        minutes: 60,
        bullets: [
          {
            title: 'What LangChain is for',
            text: 'LangChain gives you one consistent way to call models, build prompts, use tools and chain steps together, whichever provider you use.',
          },
          {
            title: 'Chat models',
            text: 'Connect to the model you chose in Module 1 through LangChain, and switch providers by changing one line.',
          },
          {
            title: 'Messages and roles',
            text: "A conversation is a list of messages: system instructions, the user's words and the assistant's earlier replies.",
          },
          {
            title: 'The model has no memory',
            text: 'Each call starts fresh, so your app must send the conversation history every time.',
          },
          {
            title: 'Prompt templates',
            text: 'Write a prompt once with placeholders, then fill them in for each request instead of building strings by hand.',
          },
          {
            title: 'Keep your keys secret',
            text: "Store API keys outside your code and never put them in anything that runs in a user's browser.",
          },
          {
            title: 'Read the whole response',
            text: 'Look at the token usage and why the answer stopped, not just the text; they tell you what it cost and whether it was cut off.',
          },
        ],
        tryIt:
          'Have a three-turn conversation using a prompt template. Then drop the history from the third call and see what the model forgets.',
        outcome:
          'Call any model through LangChain, keep a conversation going, and explain why the model "remembers" only what you send it.',
      },
      {
        id: '2.2',
        title: 'Streaming',
        icon: 'zap',
        days: [8, 8],
        minutes: 60,
        bullets: [
          {
            title: 'Show answers as they arrive',
            text: 'Streaming sends the answer piece by piece, so users see text immediately instead of waiting.',
          },
          {
            title: 'Streaming in LangChain',
            text: 'The same model, template or chain you already built can stream with no extra setup.',
          },
          {
            title: 'Perceived speed',
            text: 'Time to first token matters more to users than total time; streaming makes an app feel faster without making it faster.',
          },
          {
            title: 'Put the pieces back together',
            text: 'Collect the streamed pieces into the full answer so you can save, check or log it.',
          },
          {
            title: 'When streams break',
            text: 'Handle a user cancelling, a dropped connection, or an answer that stops halfway.',
          },
        ],
        tryIt:
          'Ask for a long answer with and without streaming, and time when the first word appears in each case.',
        outcome:
          'Stream answers to the user and still end up with a complete, saved response, even when the stream is interrupted.',
      },
      {
        id: '2.3',
        title: 'Structured Outputs',
        icon: 'braces',
        days: [9, 10],
        minutes: 90,
        bullets: [
          {
            title: "Don't just ask for JSON",
            text: "Asking politely for JSON fails sometimes; use LangChain's structured-output support so the model must return the shape you define.",
          },
          {
            title: 'Describe the shape you want',
            text: 'Define the fields, which are required, allowed values and nested lists as a schema, so your code knows exactly what it will get.',
          },
          {
            title: 'Check before you use it',
            text: 'Validate every structured answer before it reaches the rest of your app.',
          },
          {
            title: "Valid isn't the same as correct",
            text: 'Perfectly formatted output can still contain wrong information.',
          },
          {
            title: 'Generate → check → decide',
            text: 'When an answer fails validation, retry, ask the model to fix it, or reject it with a clear error.',
          },
        ],
        tryIt:
          'Extract name, date, amount and category from 10 messy text receipts. Count how many come back valid, and how many are valid but wrong.',
        outcome:
          "Get structured data from a model that your code can rely on, and handle the cases where it can't.",
      },
      {
        id: '2.4',
        title: 'Tool Calling',
        icon: 'wrench',
        days: [11, 12],
        minutes: 120,
        bullets: [
          {
            title: 'The model asks; your code acts',
            text: 'The model picks a tool and fills in its inputs; your app actually runs it.',
          },
          {
            title: 'Defining tools in LangChain',
            text: 'Turn an ordinary function into a tool with a name, a description of when to use it, and typed inputs, then attach your tools to the model.',
          },
          {
            title: 'The full loop',
            text: 'User message → model asks for a tool → your code runs it → the result goes back to the model → the model gives its final answer.',
          },
          {
            title: 'Matching results to requests',
            text: 'Each tool request has an ID; send each result back with the right ID so the model knows which answer is which.',
          },
          {
            title: 'More than one call',
            text: 'Handle several tool calls in one turn, the same tool called twice, and cases where one result decides the next call.',
          },
          {
            title: 'When tools fail',
            text: 'Expect missing or invalid inputs and failing tools, and send a useful error back to the model instead of crashing.',
          },
          {
            title: 'Designing good tools',
            text: 'Use precise names, few inputs and clear descriptions; overlapping or vague tools make the model pick the wrong one.',
          },
          {
            title: 'Never trust tool inputs',
            text: 'Check every input the model provides, especially before anything that changes or deletes data.',
          },
          {
            title: 'Tool descriptions are instructions',
            text: 'The model reads them to decide what to do, so write them as carefully as a prompt.',
          },
        ],
        tryIt:
          'Give the model a weather tool and a currency tool. Ask a question that needs both, then one that needs neither, and check what it chose each time.',
        outcome:
          'Build the complete tool-calling loop in LangChain and give a model tools it uses correctly and safely.',
      },
      {
        id: '2.5',
        title: 'Chaining Steps Together',
        icon: 'workflow',
        days: [13, 13],
        minutes: 60,
        bullets: [
          {
            title: 'Beyond one call',
            text: 'Real features often chain several model calls, tools and ordinary code together.',
          },
          {
            title: 'Chains in LangChain',
            text: 'Connect a prompt, a model and an output step into one chain you can run, stream and reuse like a single piece.',
          },
          {
            title: 'Three common patterns',
            text: 'A fixed sequence of steps, routing a request to the right path, and running parts in parallel then combining the results.',
          },
          {
            title: 'When to split a task',
            text: 'Several small, focused steps are often more reliable and easier to debug than one giant prompt.',
          },
          {
            title: 'Chains vs agents',
            text: 'In a chain your code decides the steps; in an agent the model decides. Agents come later in the track.',
          },
        ],
        tryIt:
          'Build a chain that classifies a user question by type, then routes it to a different prompt for each type.',
        outcome: 'Design a feature as a chain of small steps, and know when that beats a single prompt.',
      },
      {
        id: '2.6',
        title: 'Handling Failures',
        icon: 'life-buoy',
        days: [14, 14],
        minutes: 60,
        bullets: [
          {
            title: 'What goes wrong',
            text: 'Wrong keys, bad requests, rate limits, server errors, timeouts, inputs that are too long, and malformed answers.',
          },
          {
            title: 'Retry or give up',
            text: "Retry temporary problems like server errors and rate limits; fail immediately on problems that won't fix themselves, like a bad key.",
          },
          {
            title: 'Retries in LangChain',
            text: 'Add automatic retries to any model or chain, with a cap on attempts, and set a time limit on every call.',
          },
          {
            title: 'Backup models',
            text: 'Give a model or chain a fallback to use when it fails, knowing the backup may answer differently.',
          },
          {
            title: "Don't overload the API",
            text: "When running many requests at once, limit how many run together so you don't hit rate limits.",
          },
          {
            title: 'Fail gracefully',
            text: 'When nothing works, give the user a clear message instead of an error.',
          },
        ],
        tryIt:
          'Point your chain at a wrong model name, then at a very short timeout, and confirm each failure triggers the right retry or fallback.',
        outcome:
          'Make your app survive the everyday failures of model APIs without crashing or retrying forever.',
      },
      {
        id: '2.7',
        title: 'Cost, Logging and Tracing',
        icon: 'receipt',
        days: [15, 15],
        minutes: 60,
        bullets: [
          {
            title: 'Record every request',
            text: 'Model, input and output tokens, time taken, retries, errors, tools used and estimated cost.',
          },
          {
            title: 'Think in traces',
            text: 'One user question can trigger several model and tool calls; tracing groups them so you can follow the whole journey.',
          },
          {
            title: 'Tracing LangChain apps',
            text: "Turn on tracing (for example with LangSmith) or hook into LangChain's callbacks to capture every step automatically.",
          },
          {
            title: 'Find the problem step',
            text: 'Use traces to see which step failed, which used the most tokens, and where the time went.',
          },
        ],
        tryIt:
          'Run your 10 project questions through your app with tracing on and produce a short report: total cost, average time per question, and the most expensive question.',
        outcome: 'Know exactly what your app costs to run and find the slow or failing step in any request.',
      },
    ],
    skipped: [
      {
        topic: 'Calling provider APIs directly',
        why: 'LangChain makes the same calls; learn one way well first',
        where: [{ level: 2, href: '/level/2/#m2-1' }],
      },
      {
        topic: 'Concurrency and batch processing in depth',
        why: 'One rule covers it here: limit how many requests run at once',
        where: [{ level: 2, href: '/level/2/#m2-8' }],
      },
      {
        topic: 'Where to put retry logic',
        why: 'A design detail that matters at larger scale',
        where: [{ level: 2, href: '/level/2/#m2-9' }],
      },
      {
        topic: 'LlamaIndex, LangGraph and DSPy',
        why: 'Learning one framework well beats surveying four; LangGraph returns when you build agents',
        where: [{ level: 2, href: '/level/2/#m2-11' }],
      },
      {
        topic: 'Comparing orchestration frameworks',
        why: "Useful once you've built with more than one",
        where: [{ level: 2, href: '/level/2/#m2-11' }],
      },
    ],
  },
];

export const daysModuleHref = (m: DaysModule) => `${DAYS_BASE}/${m.slug}/`;

/** "Day 1" or "Days 5–6". */
export const dayRange = ([a, b]: [number, number]) => (a === b ? `Day ${a}` : `Days ${a}–${b}`);

/** "45 min", "120 min" — always minutes, as the track is written. */
export const formatMinutes = (m: number) => `${m} min`;

/** The module that is the short version of a roadmap level. */
export const shortVersionOfLevel = (n: number): DaysModule | undefined =>
  hundredDaysModules.find((m) => m.shortVersionOf === n);
