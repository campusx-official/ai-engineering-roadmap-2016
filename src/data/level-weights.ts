/**
 * How much each level matters, scored out of 10 with a reason, from two angles:
 * getting hired (interviews) and doing the job (day-to-day work). Shown side by
 * side at the top of every level page. Keyed by level number; edit the text
 * here, not in the page. Wrap a phrase in **double asterisks** to show it in
 * bold.
 */
export interface LevelWeight {
  score: number;
  reason: string;
}

export const WEIGHT_MAX = 10;

/** How much the level matters in AI engineering interviews and screening. */
export const interviewWeights: Record<number, LevelWeight> = {
  0: {
    score: 9,
    reason:
      'Many AI engineer roles **screen candidates as software engineers first**, with coding rounds, backend questions, and API design. If you fail these, **you never reach the AI rounds**.',
  },
  1: {
    score: 8,
    reason:
      'Conceptual questions are **very common in screening rounds**: tokens, attention, temperature, hallucination, context limits. Shaky answers here **end the interview early**, because they suggest you’ve only used LLMs, not understood them.',
  },
  2: {
    score: 8,
    reason:
      '**Take-home assignments and live coding rounds** are usually built on this: call a model, get structured output, use a tool, handle failures. You show it more than you’re asked about it, so it matters **mainly through projects**.',
  },
  3: {
    score: 5,
    reason:
      'Interviewers **rarely ask about it in depth**; they assume you can do it. It doesn’t set you apart, and listing it on a resume as a headline skill **can look junior**.',
  },
  4: {
    score: 10,
    reason:
      'The **most frequently asked topic** and the most common requirement in job descriptions. Expect detailed questions on chunking, embeddings, hybrid search, reranking, and why retrieval fails. You need to be **very strong here**.',
  },
  5: {
    score: 9,
    reason:
      'One of the **hottest topics** in current job descriptions. Tool calling, MCP, LangGraph, and multi-agent setups are keywords that **pass resume filters** and come up often in interviews.',
  },
  6: {
    score: 6,
    reason:
      '**Rarely asked as a topic by name**. It mostly helps you give better answers in RAG and agent questions, which can set you apart in **senior-level discussions**.',
  },
  7: {
    score: 8,
    reason:
      'Increasingly a decisive question: “**How would you know your system works?**” Most candidates answer weakly, so a concrete answer (test sets, LLM-as-judge, metrics) **sets you apart sharply**.',
  },
  8: {
    score: 5,
    reason:
      '**Expect one question**, usually about prompt injection, and it’s rarely a deciding factor. **Knowing the basics is enough** unless you’re applying for security roles.',
  },
  9: {
    score: 9,
    reason:
      'Mid-level and senior hiring usually includes a **dedicated round**, such as “design a chatbot over company documents.” It’s where **scope, trade-offs, and seniority** get judged.',
  },
  10: {
    score: 7,
    reason:
      'Saying you **deployed and monitored** something on your resume shows you’ve worked in production. Docker, AWS, and CI/CD keywords also help with **automated screening**. Interview questions on it are moderate: cost, monitoring, versioning.',
  },
  11: {
    score: 6,
    reason:
      'Matters a lot at enterprises and IT services companies, where Bedrock, Azure OpenAI, or Vertex experience is often a **hard filter**. **At startups it matters much less**.',
  },
  12: {
    score: 4,
    reason:
      '**Seldom asked** unless the role is specifically about vision, speech, or documents. **Low payoff** for general applications.',
  },
  13: {
    score: 7,
    reason:
      'You’ll rarely do it on the job, but interviewers love asking about “**fine-tuning vs RAG**” and LoRA basics, and it’s a common job-description keyword. **Knowing the concepts is worth more** than hands-on training experience.',
  },
  14: {
    score: 10,
    reason:
      'The **biggest factor in getting shortlisted**. Without real, **deployed projects**, a resume from a new AI engineer usually gets no response, and most interview conversations are built around them.',
  },
  15: {
    score: 9,
    reason:
      'It directly **turns what you know into answers**. Being able to explain trade-offs and project decisions under pressure is a separate skill, and **strong candidates fail without practising it**.',
  },
};

/** How much the level matters in day-to-day AI engineering work. */
export const jobWeights: Record<number, LevelWeight> = {
  0: {
    score: 10,
    reason:
      'Most of the work is **regular software engineering**: APIs, databases, testing, debugging, deployments. Most production incidents are **ordinary software bugs**, not model problems.',
  },
  1: {
    score: 7,
    reason:
      'It shapes good decisions about **cost, latency, and model behaviour**, and helps you debug odd outputs. But you use it as **background knowledge**, not every day.',
  },
  2: {
    score: 10,
    reason:
      'This is the **core of the daily work**: calling models, getting structured output, tool use, retries, streaming, handling rate limits and timeouts. **Almost every feature** you build goes through it.',
  },
  3: {
    score: 8,
    reason:
      'You **write and revise prompts constantly**. Small changes to instructions often fix problems faster than code changes, so it **matters more on the job than in interviews**.',
  },
  4: {
    score: 9,
    reason:
      'Most business AI products need answers **grounded in company data**. A lot of real work goes into **fixing bad retrieval, stale data, and messy documents**.',
  },
  5: {
    score: 7,
    reason:
      'More and more common, but many production tasks are better handled by **simple fixed workflows**. Knowing **when not to build an agent** is part of the skill.',
  },
  6: {
    score: 8,
    reason:
      'Once systems grow, quality depends heavily on **what goes into the model’s input**. It’s often the **hidden cause** of a system getting worse over time or becoming expensive.',
  },
  7: {
    score: 10,
    reason:
      'Without evals, **every change is a guess**. Teams that measure ship faster and with more confidence, and this is where much of the **senior-level work** happens.',
  },
  8: {
    score: 7,
    reason:
      '**Prompt injection and data leaks** are real risks in any system that uses tools or private data. **One incident can be very costly**, but daily effort is moderate unless you’re in a regulated industry.',
  },
  9: {
    score: 8,
    reason:
      'Matters for **every architecture decision**: which model, how much retrieval, cost vs quality. It grows in importance **as you become more senior**.',
  },
  10: {
    score: 9,
    reason:
      'Monitoring, versioning, cost tracking, and safe rollouts take up a **large share of the work** once a product has real users.',
  },
  11: {
    score: 7,
    reason:
      'Often required, since companies frequently run AI inside their **existing cloud for compliance**. You mostly **learn the specific platform on the job**.',
  },
  12: {
    score: 5,
    reason:
      '**Very important in some domains** (documents, speech, vision), **not needed in many others**.',
  },
  13: {
    score: 3,
    reason:
      '**Rarely needed**. Better prompts, retrieval, or a different model usually solve the problem more cheaply. Mostly done by **specialist teams**.',
  },
  14: {
    score: 6,
    reason:
      'Building end-to-end gives you the **instincts the job needs**, but once you’re employed, **real work replaces portfolio projects**.',
  },
  15: {
    score: 1,
    reason:
      '**No direct use on the job**, apart from occasionally interviewing other candidates.',
  },
};
