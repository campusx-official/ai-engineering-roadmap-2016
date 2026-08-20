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
  /** Direct course link. Falls back to the CampusX One pricing page. */
  url?: string;
  /** Where the course lives, when it is not a CampusX One catalog item. */
  source?: string;
}

export const CAMPUSX_ONE_URL = 'https://learnwith.campusx.in/#cxo-pricing';
export const CAMPUSX_URL = 'https://learnwith.campusx.in/';

/** Python, Git & GitHub and SQL are all covered by the DSMP 2.0 course. */
const DSMP_URL =
  'https://learnwith.campusx.in/courses/Data-Science-Mentorship-Program-DSMP-20-653f50d1e4b0d2eae855480a';

/** The agentic-coding curriculum behind M0.6 — free, on YouTube. */
const AGENTIC_CODING_URL =
  'https://www.youtube.com/playlist?list=PLKnIA16_RmvaYH3poI0oJvbDF4zEvpq8W';

export const coursesByLevel: Record<number, Course[]> = {
  0: [
    { title: 'Python', status: 'live', url: DSMP_URL },
    { title: 'Git & GitHub', status: 'live', url: DSMP_URL },
    { title: 'SQL', status: 'live', url: DSMP_URL },
    {
      title: 'Docker',
      status: 'live',
      url: 'https://learnwith.campusx.in/courses/Docker-for-Machine-Learning-68a022773f7a067efc5df47e',
    },
    {
      title: 'Advanced FastAPI',
      status: 'live',
      url: 'https://learnwith.campusx.in/courses/FastAPI-6873cb2075f40c2715c809fe',
    },
    {
      title: 'Flask',
      status: 'live',
      url: 'https://learnwith.campusx.in/courses/Web-and-API-Development-using-Flask-6839ae3fb109825d2ca6526d',
    },
    {
      title: 'Agentic Coding using Claude Code',
      status: 'live',
      url: AGENTIC_CODING_URL,
      source: 'YouTube playlist',
    },
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
  9: [{ title: 'AI System Design', status: 'soon' }],
  10: [{ title: 'LLMOps', status: 'soon' }],
  /* Level 12 is LLM 101 for the other modalities, so it maps to the same course. */
  12: [{ title: 'LLM 101', status: 'soon' }],
  15: [{ title: 'AI Engineer Interview Prep', status: 'live' }],
};

export const coursesFor = (level: number): Course[] => coursesByLevel[level] ?? [];

/**
 * Recommended reading. Deliberately separate from `Course`: these are not
 * CampusX catalog items, so they must not carry the "On CampusX One" label or
 * link to the pricing page. `url` is optional — a reference with no link still
 * renders, just without the outbound affordance.
 */
export interface Book {
  title: string;
  author: string;
  url?: string;
}

export const booksByLevel: Record<number, Book[]> = {
  9: [
    {
      title: 'AI Engineering',
      author: 'Chip Huyen',
      url: 'https://www.amazon.in/AI-Engineering-Building-Applications-Foundation/dp/9355426666',
    },
  ],
};

export const booksFor = (level: number): Book[] => booksByLevel[level] ?? [];
