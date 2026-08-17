/**
 * CampusX One course cross-links, per CLAUDE.md §10.
 *
 * This mapping is editorial, not parsed from the level files — it is exactly
 * the mapping given in the brief. `status: 'soon'` marks catalog items the
 * brief flags as unreleased. Confirm titles and anchors against the live
 * catalog before launch; anything not listed here simply renders no card.
 */

export interface Course {
  title: string;
  status?: 'live' | 'soon';
  /** Note shown under the title (e.g. the brief's "notes" qualifier). */
  note?: string;
}

export const CAMPUSX_ONE_URL = 'https://learnwith.campusx.in/#cxo-pricing';
export const CAMPUSX_URL = 'https://learnwith.campusx.in/';

export const coursesByLevel: Record<number, Course[]> = {
  0: [
    { title: 'Python', status: 'live' },
    { title: 'Git & GitHub', status: 'live' },
    { title: 'SQL', status: 'live' },
    { title: 'Docker', status: 'live' },
    { title: 'Advanced FastAPI', status: 'live' },
    { title: 'Flask', status: 'live' },
  ],
  1: [{ title: 'LLM 101', status: 'soon' }],
  2: [
    { title: 'GenAI using LangChain', status: 'live' },
    { title: 'GenAI using Open Source Models', status: 'live' },
    { title: 'GenAI using Gemini', status: 'live' },
  ],
  3: [{ title: 'Prompt Engineering', status: 'live' }],
  4: [{ title: 'Advanced RAG', status: 'live' }],
  5: [
    { title: 'LangGraph', status: 'live', note: 'notes' },
    { title: 'CrewAI', status: 'live' },
    { title: 'Agno', status: 'live' },
    { title: 'MCP', status: 'live', note: 'notes' },
    { title: 'Building Multi-Agent Systems', status: 'soon' },
    { title: 'AI Agents using Google ADK', status: 'soon' },
    { title: 'Memory in LLMs', status: 'soon' },
  ],
  6: [{ title: 'Context Engineering', status: 'soon' }],
  7: [{ title: 'LLM Evaluations', status: 'soon' }],
  8: [{ title: 'LLM Guardrails', status: 'soon' }],
  10: [
    { title: 'LLMOps', status: 'soon' },
    { title: 'Docker', status: 'live' },
  ],
  11: [{ title: 'DLCV', status: 'live' }],
};

export const coursesFor = (level: number): Course[] => coursesByLevel[level] ?? [];
