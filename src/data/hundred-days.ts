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
    days: [1, 6],
    hours: 'about 6 hours',
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
          "Write 10 questions: some the model should know, some it can't know, some built on a false premise, and some missing key information. Record each answer and how confident it sounds. Keep this list; it becomes your first test set later in the track.",
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
];

export const daysModuleHref = (m: DaysModule) => `${DAYS_BASE}/${m.slug}/`;

/** "Day 1" or "Days 5–6". */
export const dayRange = ([a, b]: [number, number]) => (a === b ? `Day ${a}` : `Days ${a}–${b}`);

/** "45 min", "80 min"; whole hours read as hours. */
export const formatMinutes = (m: number) => (m % 60 === 0 ? `${m / 60} hr` : `${m} min`);

/** The module scheduled on a given day, if one has been published. */
export const moduleOfDay = (day: number): DaysModule | undefined =>
  hundredDaysModules.find((m) => m.days[0] <= day && day <= m.days[1]);

/** The module that is the short version of a roadmap level. */
export const shortVersionOfLevel = (n: number): DaysModule | undefined =>
  hundredDaysModules.find((m) => m.shortVersionOf === n);
