/**
 * Typed view over the generated levels.json.
 *
 * levels.json is produced by scripts/parse-levels.mjs from the level*.txt
 * source files. Nothing in the UI ever reads a .txt at runtime.
 */
import raw from './levels.json';
import { topics } from './topics';
import { signature } from '../lib/sig.mjs';

export type PhaseId =
  | 'foundations' | 'retrieval' | 'agentic' | 'trust' | 'production' | 'frontier';

export interface Phase {
  id: PhaseId;
  name: string;
  levels: number[];
  theme: string;
  color: string;
  icon: string;
}

export interface Objective {
  text: string;
  /** Authored short topic; the bullet shown before expanding. */
  label?: string;
  /** Sub-heading the objective sat under in the source ("Session 1 · …"). */
  group?: string;
}

export interface Module {
  id: string;
  name: string;
  sessionCount: number | null;
  icon: string;
  objectives: Objective[];
  /** Commentary that followed the module's Outcome line in the source. */
  notes: string[];
  outcome?: string;
  tryIt?: string;
  mentalModel?: string;
  finalResult?: string;
  isCapstone: boolean;
  /** Marked `[gap]` in the source file. */
  isGap: boolean;
}

/** A stack tag: either something you install/call, or something you learn. */
export interface StackTag {
  label: string;
  kind: 'tool' | 'concept';
}

export interface Level {
  number: number;
  slug: string;
  title: string;
  sourceFile: string;
  scope: string;
  prereqStated: string | null;
  phase: PhaseId;
  icon: string;
  modules: Module[];
  stack: StackTag[];
  /** Module id of the ship-it capstone, if the source defines one. */
  project: string | null;
  totalSessions: number;
  statedSessions: number | null;
  completionOutcomes: string[];
  /** Fields the source file did not provide — surfaced, never invented. */
  todos: string[];
}

export const phases = raw.phases as Phase[];
export const levels = raw.levels as Level[];

/**
 * Pair each objective with its authored short label. A module is skipped
 * whenever its source text has drifted from what the labels were written
 * against, so a stale label can never be attached to the wrong sentence — that
 * module simply renders full sentences until `npm run topics` is re-run.
 */
for (const level of levels) {
  for (const module of level.modules) {
    const set = topics[module.id];
    if (!set || set.labels.length !== module.objectives.length) continue;
    if (set.sig !== signature(module.objectives.map((o) => o.text))) continue;
    module.objectives.forEach((o, i) => {
      const label = set.labels[i];
      if (label) o.label = label;
    });
  }
}

export const totalLevels = raw.totalLevels as number;
export const totalSessions = raw.totalSessions as number;
export const totalModules = raw.totalModules as number;

export const getLevel = (n: number): Level | undefined =>
  levels.find((l) => l.number === n);

export const getPhase = (id: PhaseId): Phase =>
  phases.find((p) => p.id === id)!;

export const phaseOfLevel = (n: number): Phase =>
  phases.find((p) => p.levels.includes(n))!;

export const capstoneOf = (level: Level): Module | null =>
  level.modules.find((m) => m.id === level.project) ?? null;

/** Every ship-it module. The merged RAG level carries two. */
export const capstonesOf = (level: Level): Module[] =>
  level.modules.filter((m) => m.isCapstone);

export const conceptsOf = (level: Level): StackTag[] =>
  level.stack.filter((t) => t.kind === 'concept');

export const toolsOf = (level: Level): StackTag[] =>
  level.stack.filter((t) => t.kind === 'tool');

/** Modules minus the capstones — those get their own callouts. */
export const teachingModules = (level: Level): Module[] =>
  level.modules.filter((m) => !m.isCapstone);

export const prevLevel = (n: number) => getLevel(n - 1) ?? null;
export const nextLevel = (n: number) => getLevel(n + 1) ?? null;

/** Sessions in every level up to and including n — powers the cumulative meter. */
export const cumulativeSessions = (n: number): number =>
  levels.filter((l) => l.number <= n).reduce((sum, l) => sum + l.totalSessions, 0);

/**
 * Presentation-only: the source "Scope:" lines start mid-sentence. Capitalising
 * the first character is formatting, not editing — the words are untouched.
 */
export const sentence = (s: string): string =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

/** Widest level, used to scale the session bars against a common baseline. */
export const maxLevelSessions = Math.max(...levels.map((l) => l.totalSessions));
