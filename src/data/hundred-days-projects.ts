/**
 * Projects — the "After the 100 days" portfolio section of 100 Days of AI
 * Engineering. Hand-authored content, rendered by src/pages/100-days/projects.astro.
 */

export const PROJECTS_HREF = '/100-days/projects/';

export interface Project {
  number: number;
  title: string;
  level: string;
  build: string;
  forWho: string;
  skills: string;
  /** Module numbers this project builds on. */
  buildsOn: number[];
  mustHaves: string[];
  stretch: string;
  data: string;
  done: string;
}

export const projectsSummary =
  'Turn what you learned into a portfolio: build two or three projects that each show a different skill, to the same standard you used in the course.';

export const whyBuild =
  'Everyone who finishes the track has an app like yours. These projects show range: each one uses a different skill, with real test results, security testing and a live deployment.';

export const howToUse: string[] = [
  'Build two or three projects, not ten.',
  'Make each one different.',
  'Pick for the job you want.',
  'Finish each in two to four weeks.',
];

export const guidelines: string[] = [
  'A real problem and a real user',
  'A baseline first',
  'A test set of 30+ cases, with before-and-after scores',
  'A security pass, with proof attacks are blocked',
  'Live, with a link anyone can try',
  'Cost per request and response time',
  'A README with results, trade-offs and failures',
  'A two-to-three-minute demo video',
];

export const checklist: string[] = [
  'I can explain the problem and user in two sentences.',
  'I measured a baseline first.',
  'My test set has 30+ cases, with baseline and final scores.',
  'My judge agrees with my own scores.',
  'I tried 10+ attacks, and all are blocked.',
  'No secrets or personal data in my code, logs or repository.',
  "It's live, and someone else has used it.",
  'I report cost per request and response time.',
  'My README covers the design, results, trade-offs and a failure.',
  'I have a demo video.',
  'I can answer: Why this design? What breaks at 100× the traffic? How would I halve the cost?',
];

export const projects: Project[] = [
  {
    number: 1,
    title: 'Invoice and Receipt Extractor',
    level: 'Intermediate',
    build:
      'A pipeline that reads scanned bills, invoices and receipts, extracts key fields, checks them, and sends uncertain cases to a person for review.',
    forWho: 'Small businesses and finance teams who type invoice details in by hand.',
    skills: 'Document parsing, vision models, structured output, validation, human review.',
    buildsOn: [1, 2, 4],
    mustHaves: [
      'Extract vendor, date, invoice number, line items, tax and total into a fixed structure.',
      'Check the results: line items add up to the total, dates and tax numbers are valid.',
      'Send low-confidence or failed extractions to a review screen instead of saving them.',
      'Show which part of the page each value came from.',
    ],
    stretch: 'Handle handwritten receipts; support Hindi and English bills; export to a spreadsheet or accounting tool.',
    data: 'Public receipt and invoice datasets, plus your own bills with personal details removed.',
    done: 'Field-level accuracy on 30+ documents is reported, and no invalid record is saved without review.',
  },
  {
    number: 2,
    title: 'Data Question Answerer',
    level: 'Intermediate',
    build:
      'An assistant that answers plain-language questions about a real dataset by writing and running database queries, and explains the answer with the figures behind it.',
    forWho: "People who need answers from data but don't write SQL.",
    skills: 'Text-to-SQL, routing, query safety, explaining results.',
    buildsOn: [2, 3, 4],
    mustHaves: [
      'Load a real dataset into a database and describe every table and column in plain language.',
      'Turn questions into queries, run them with read-only access, and show the query and result.',
      "Retry failed queries within a limit, and say so when a question can't be answered from the data.",
      'Block anything that changes data, and limit how many rows can be returned.',
    ],
    stretch: 'Draw charts for answers; mix database answers with answers from related documents.',
    data: "India's Open Government Data platform (data.gov.in), or another public dataset you understand well.",
    done: 'Accuracy on 30+ questions with known answers is reported, including questions that need joins, totals and filters.',
  },
  {
    number: 3,
    title: 'Research Agent with Cited Reports',
    level: 'Intermediate to Advanced',
    build:
      'An agent that takes a research question, searches the web and documents, and writes a structured report where every claim links to its source.',
    forWho: 'Analysts, students and anyone who spends hours collecting sources.',
    skills: 'Multi-agent design, long-running tasks, context management, citation checking.',
    buildsOn: [4, 5],
    mustHaves: [
      'Break a question into sub-questions and research them in parallel.',
      'Attach every claim to a source, and check that each source actually supports its claim.',
      'Say clearly where sources disagree or where evidence is thin.',
      'Stay within a time and cost limit for each report.',
    ],
    stretch: 'Let the user steer the research mid-way; compare a single agent with a multi-agent version.',
    data: 'Live web search, plus a set of reports or papers in a field you know.',
    done: 'Citation accuracy on 10+ reports is measured, and cost and time per report are stated.',
  },
  {
    number: 4,
    title: 'Codebase Assistant',
    level: 'Advanced',
    build:
      'An agent that answers questions about a GitHub repository and proposes fixes for issues, checking each fix by running the tests in a sandbox.',
    forWho: 'Developers joining a new codebase or working through a bug backlog.',
    skills: 'Coding agents, sandboxed execution, harness engineering, context management.',
    buildsOn: [5],
    mustHaves: [
      'Answer questions about the code with references to the exact files and lines.',
      'Propose a fix for an issue, run the tests in a sandbox, and show the result.',
      'Never run code outside the sandbox or change the repository without approval.',
      'Keep long code-reading tasks within a context and cost limit.',
    ],
    stretch: 'Open a pull request with the fix after approval; measure how changes to the harness affect success.',
    data: 'Open-source repositories with good test suites and real, closed issues you can check against.',
    done: 'The success rate on 20+ real issues is reported, with sandbox tests confirming each fix.',
  },
  {
    number: 5,
    title: 'Voice Booking Agent',
    level: 'Advanced',
    build:
      'A voice agent that books, changes and cancels appointments in a natural conversation, in English and mixed Hindi-English.',
    forWho: 'Clinics, salons and service businesses that take bookings by phone.',
    skills: 'Speech-to-text and text-to-speech, response speed, interruptions, tool use.',
    buildsOn: [1, 5],
    mustHaves: [
      'Keep the gap between the caller finishing and the agent replying short enough to feel natural, and measure it.',
      'Handle interruptions, pauses and unclear speech.',
      'Check availability and create bookings through tools, confirming details before saving.',
      "Hand over to a person when the agent can't help.",
    ],
    stretch: 'Phone-number integration; reminders by message; support for another Indian language.',
    data: 'Recordings you make yourself across different accents and noise levels.',
    done: 'Task success on 20+ test calls and the average response delay are reported.',
  },
  {
    number: 6,
    title: 'Contract and Policy Comparer',
    level: 'Intermediate',
    build:
      'A tool that compares two versions of a contract or policy and explains what changed and why it matters, with citations to both versions.',
    forWho: 'Small-business owners, HR teams and anyone reviewing updated terms.',
    skills: 'Long documents, structured comparison, citations, grounded explanations.',
    buildsOn: [3, 4],
    mustHaves: [
      "Match sections between versions, even when they've moved or been renumbered.",
      'List additions, removals and changes, each linked to the exact text in both versions.',
      'Flag changes in key areas such as payment, liability, termination and data use.',
      "Never present the tool's output as legal advice.",
    ],
    stretch: 'Compare against a standard template; summarize changes for a non-expert reader.',
    data: 'Public terms of service and privacy policies, which often have older versions archived online.',
    done: 'Accuracy at finding real changes on 15+ document pairs is reported, including changes it missed.',
  },
  {
    number: 7,
    title: 'Visual Product Search',
    level: 'Intermediate',
    build: 'A search over a product catalog that finds items from a photo or a description.',
    forWho: 'Online shoppers and small online stores.',
    skills: 'Image and text embeddings, multimodal retrieval, filters, evaluating search.',
    buildsOn: [1, 4],
    mustHaves: [
      'Search by uploaded photo, by text, or both together.',
      'Filter by price, category and other product details.',
      'Compare joint image-text search with searching generated captions.',
      'Measure search quality on queries with known correct results.',
    ],
    stretch: '"Find something like this but cheaper"; explain why each result matched.',
    data: 'Public product-image datasets, or a catalog you build from a store that permits it.',
    done: 'Recall@10 on 30+ queries is reported for both search approaches.',
  },
  {
    number: 8,
    title: 'Browser Task Agent',
    level: 'Advanced',
    build:
      'An agent that completes a real multi-step task on websites, such as comparing prices across stores or filling in a long form, and asks for approval before anything that commits you.',
    forWho: 'Anyone who repeats the same tedious web tasks.',
    skills: 'Computer-use and browser agents, approval gates, safety, recovery.',
    buildsOn: [5],
    mustHaves: [
      'Complete a chosen task end to end on real websites.',
      'Ask for approval before submitting, paying or sending anything.',
      'Recover when a page changes, loads slowly or shows an unexpected pop-up.',
      'Resist instructions hidden in web pages that try to redirect the agent.',
    ],
    stretch: 'Compare a browser agent with an API-based approach for the same task; record each run for review.',
    data: 'Websites whose terms allow automated use, or test sites built for this purpose.',
    done: 'Task success on 20+ runs and the result of 10+ hidden-instruction attacks are reported.',
  },
  {
    number: 9,
    title: 'Fine-Tuned Small Model',
    level: 'Intermediate to Advanced',
    build:
      'A small open model, fine-tuned for one narrow task, that matches or beats a large prompted model at much lower cost.',
    forWho: 'Teams running a high-volume task where large-model costs add up.',
    skills: 'Data curation, LoRA fine-tuning, evaluation, cost analysis, serving.',
    buildsOn: [3, 6],
    mustHaves: [
      'Choose a narrow task, such as classifying customer messages written in mixed Hindi-English.',
      'Build a clean training set and a held-out test set that the model never trains on.',
      'Measure a prompted large model as the baseline.',
      'Fine-tune with LoRA, then compare accuracy, cost and response time.',
      'Serve the tuned model behind an API.',
    ],
    stretch: 'Try distillation from a larger model; compare full fine-tuning with LoRA.',
    data: 'Public datasets for your task, plus examples you write or generate and check by hand.',
    done: 'A results table compares the tuned and prompted models on accuracy, cost per thousand requests and response time.',
  },
  {
    number: 10,
    title: 'Published MCP Server',
    level: 'Beginner to Intermediate',
    build:
      'An MCP server for a public API or developer tool, released so other people can connect it to their own AI apps.',
    forWho: 'Developers who use that API or tool with AI assistants.',
    skills: 'MCP design, tool design, documentation, supporting real users.',
    buildsOn: [5],
    mustHaves: [
      'Expose useful tools, resources and prompts with clear names, descriptions and inputs.',
      'Handle errors, authentication and rate limits properly.',
      'Test it with an MCP inspector and at least two different AI apps.',
      'Publish it with setup instructions and examples.',
    ],
    stretch: 'Get it listed in a public MCP directory; collect feedback from early users.',
    data: 'Any public API you know well.',
    done: "It's published, works in two AI apps, and at least one other person has used it.",
  },
  {
    number: 11,
    title: 'Personal Knowledge Agent',
    level: 'Intermediate',
    build:
      'An agent that remembers and connects your notes, bookmarks and documents over time, answers questions about them, and reminds you of related things.',
    forWho: 'Students and professionals with scattered notes.',
    skills: 'Memory, context management, retrieval, privacy.',
    buildsOn: [4, 5],
    mustHaves: [
      'Add notes from at least two sources and answer questions across them with citations.',
      'Remember preferences and facts, and update them when they change.',
      'Let the user see, edit and delete everything the agent remembers.',
      'Keep the data private, with an option to run on a local model.',
    ],
    stretch: 'Weekly summaries of what you saved; spotting connections between notes.',
    data: 'Your own notes, or a public collection of notes and articles.',
    done: 'Memory accuracy on 20+ test cases is reported, including updates and deletions.',
  },
  {
    number: 12,
    title: 'Cost-Cutting Model Gateway',
    level: 'Advanced',
    build:
      'A gateway that sits in front of several model providers and cuts cost with caching, routing and fallbacks, with a dashboard showing usage and savings.',
    forWho: 'Teams running AI apps with growing model bills.',
    skills: 'Production infrastructure, caching, routing, reliability, monitoring.',
    buildsOn: [6],
    mustHaves: [
      'One endpoint for several providers, with per-team keys and budgets.',
      'Exact and semantic caching, with rules for what must never be cached.',
      'Route easy requests to cheaper models, and fail over when a provider is down.',
      'A dashboard of requests, cost, savings, errors and response time.',
    ],
    stretch: "Check that routing doesn't lower answer quality; alerts on budget overruns.",
    data: 'Replayed traffic from your course project.',
    done: 'Savings and quality are measured on replayed traffic, and failover works when a provider is shut off.',
  },
];

export const portfolios: { role: string; projects: number[] }[] = [
  { role: 'AI application engineer', projects: [1, 3, 12] },
  { role: 'Agent engineer', projects: [4, 8, 10] },
  { role: 'Applied ML or model-focused engineer', projects: [2, 7, 9] },
  { role: 'Voice or multimodal engineer', projects: [5, 7, 1] },
];

export const portfolioNote = 'Your course project counts too. Pair it with two projects that show different skills.';

export const avoid: { title: string; body: string }[] = [
  {
    title: 'Another "chat with your PDF" app',
    body: "Your course project already covers this, and so does everyone else's portfolio.",
  },
  {
    title: 'High-risk uses without safeguards',
    body: 'Automated résumé screening, medical or legal advice, and credit decisions can harm people. Avoid them unless you include bias testing, human review and clear limits.',
  },
  {
    title: 'Thin wrappers',
    body: 'An app that only forwards prompts to a model shows little engineering.',
  },
  {
    title: "Using data you don't have the right to use",
    body: 'Check the license or terms of every dataset and website.',
  },
];

export const projectAnchor = (n: number) => `project-${n}`;
