export type Study = {
  problem: string;
  approach: string[];
  result: string;
  why?: { layer: string; choice: string; reason: string }[];
};

export const studies: Record<string, Study> = {
  "2care": {
    problem:
      "Patients phone a hospital to book, reschedule or cancel appointments. The agent has to handle all of it by voice, in Indian English, with doctor names a speech model often mishears.",
    approach: [
      "Vapi orchestrates the call. Every tool call (list_doctors, check_slots, book, reschedule, cancel, lookup) routes through a single FastAPI webhook.",
      "The system prompt forces the agent to call list_doctors first, use the exact name returned, and never invent slots.",
      "Fuzzy matching maps what the STT heard, like \"Harry Prasad\", to Dr. K. Hariprasad. Confirmation codes spoken as \"A-P-L-minus-6-7-8\" are cleaned to APL678.",
      "Seeded with 10 real Apollo Greams Road doctors, their departments and available days.",
      "A live dashboard shows appointments, a doctor calendar with a free/booked slot grid, and Vapi call logs with transcripts.",
    ],
    result: "Sub-1.5s end-to-end latency and a 100% pass rate across 17 automated eval scenarios. Built for the Voice Agent-a-thon, which I won.",
    why: [
      { layer: "Voice platform", choice: "Vapi", reason: "Best tool-call support and built-in backchanneling" },
      { layer: "STT", choice: "Deepgram Nova-2 (en-IN)", reason: "Tuned for Indian English, about 130ms latency" },
      { layer: "LLM", choice: "GPT-4o-mini", reason: "Fast, cheap, follows structured flows well" },
      { layer: "TTS", choice: "Azure Neerja Neural", reason: "Natural Indian voice, no custom credentials" },
      { layer: "Backend", choice: "FastAPI + Postgres on Railway", reason: "Thin, typed, one-push deploys; SQLite locally" },
    ],
  },
  kiro: {
    problem:
      "A worried parent calls a child digital-wellness service and rambles, often in Telugu or Hindi dialects. Every case needs to reach a psychologist with the context already captured.",
    approach: [
      "Listens warmly, asks one question at a time and mirrors back what it hears.",
      "Works in English, Hindi, Telugu (Telangana and Andhra dialects) and most other Indian languages.",
      "Turns the conversation into a structured case file: child's age, family setup, concern category, sentiment and a provisional severity score.",
      "Leaves the parent with a practical tip and a reassuring \"our team will be in touch soon\". It never diagnoses.",
    ],
    result: "Every call becomes a structured case for the psychologist, at about $0.085 per call minute on Vapi, Gemini Flash, Cartesia and Soniox.",
  },
  geometra: {
    problem:
      "In a two-pass LLM chatbot, Pass 2 applied its own rules unreliably because they competed inside a 22,000-character prompt. The printer case proved it: the same model scored 10/12 inside Pass 2 and 15/15 in isolation.",
    approach: [
      "Layer 1: deterministic regex short-circuits answer pricing, greetings, ticket requests, print-shop policy and known exclusions at zero LLM cost.",
      "Layer 2: small isolated classifiers make the open-ended judgments, like printer type and whether something is measurable at all, instead of hand-enumerating every dish, animal and object.",
      "Layer 3: Pass 1 reformulates the question and resolves references; Pass 2 answers from retrieved FAQ context.",
      "Three independent safety layers, each failing open: a multilingual wordlist, the OpenAI moderation API and Pass 2's own refusal rule.",
      "Qdrant for vectors, Supabase for storage, ticket escalation to the team, and a startup guard that refuses to boot on data-losing config.",
    ],
    result: "363 automated tests, and a design principle measured repeatedly: let each layer claim only what it can answer reliably.",
  },
  reelhaus: {
    problem:
      "A student club needs one place to publish events, show off past highlights, take registrations and collect payments, instead of juggling forms, chats and spreadsheets.",
    approach: [
      "Public site: a landing page for upcoming events, a highlights carousel from past events, and Team and Join Us pages.",
      "Registration flow: name, email, phone and roll number, a ticket counter with a per-registration limit, live seats-available and price per ticket.",
      "Online checkout: the form hands off to a payment step through Cashfree (shown here in test mode).",
      "Admin area for managing events behind its own login.",
      "Built together with Manikanta Boda.",
    ],
    result: "A working event portal with ticketed registration and online payments, built as a two-person team.",
  },
  broca: {
    problem:
      "People managing Type 1 diabetes have scattered data: glucose readings, lab reports, grocery bills. Broca turns it into decisions a patient can act on.",
    approach: [
      "Glycemic Control Console: CGM analytics scored against ATTD/ADA Time-in-Range targets, plus a predictive hypoglycemia early-warning that forecasts lows 30 minutes ahead. It is signal processing, not a model call.",
      "Report Analyzer: reads lab PDFs or photos and extracts 23 biomarkers across blood count, thyroid, lipid, renal, liver, glucose and vitamin panels, interprets each against reference ranges and exports a branded PDF.",
      "Health Trends tracks every marker over time. A chatbot answers medical questions, with a safety layer that escalates emergency symptoms before any model is consulted.",
      "Bill Analyzer reads a grocery receipt via OCR, and the Diet Planner builds a week of meals from what was bought, adjusted for the latest bloodwork.",
    ],
    result: "83% of hypoglycemic episodes caught at roughly two false alarms a day. Not a medical device; no dosing advice.",
  },
  recovery: {
    problem: "Post-surgery patients can deteriorate between check-ins, and clinicians need to know who to call first.",
    approach: [
      "Hybrid symptom analysis combined with real-time risk scoring.",
      "Automated alerts through Twilio when risk crosses a threshold.",
      "AI-generated clinical summaries for the care team.",
    ],
    result: "92% accuracy in post-surgery risk classification and a 60% reduction in escalation response time.",
  },
  emolens: {
    problem: "Detect how someone feels from more than one signal, quickly enough to be useful in real time.",
    approach: [
      "Multimodal emotion detection across 7 emotion categories using NLP and deep learning.",
      "Real-time inference pipeline replacing batch processing.",
    ],
    result: "88% accuracy across 7 emotions and 35% lower prediction latency than the batch baseline.",
  },
  mlc: {
    problem:
      "Match every business in Source 1 to its records in Sources 2 and 3, across countries and scripts, with no external data, APIs or lookups.",
    approach: [
      "Normalize names and addresses, and infer missing states.",
      "Blocking: generate candidate pairs per country and state partition.",
      "41 pair features, then LightGBM (at most 500 trees) scores each pair.",
      "Each record is assigned to its single best-scoring candidate if the probability clears a threshold tuned for macro F0.5 on held-out states; otherwise it matches nothing.",
      "Learned an Indian-script to English word dictionary from training pairs, then re-normalized and re-blocked those records.",
      "Tested rarity-weighted (IDF) and sibling-agreement features, and shipped the final model without them.",
    ],
    result: "Score 97.0, top 1.53% (98.47th percentile) with Team Horizon (Harsha, Manikanta, Murali and me). Ran on a laptop: Windows 11, 16 GB RAM, no GPU.",
  },
};
