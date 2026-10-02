export const profile = {
  name: "BVS Satya Prabhas",
  role: "Voice AI Engineer",
  site: "https://satyaprabhas.dev",
  loom: "https://www.loom.com/share/b423f7c32faa438f856cd574de618c2d",
  loomEmbed: "https://www.loom.com/embed/b423f7c32faa438f856cd574de618c2d",
  tagline: "I build voice agents that listen, reason and act, and ML systems that hold up in production.",
  email: "satyaprabhasbulusu@gmail.com",
  github: "https://github.com/Satyav8",
  linkedin: "https://www.linkedin.com/in/satyaprabhas--/",
  codechef: "https://www.codechef.com/users/satya_v8",
  leetcode: "https://leetcode.com/u/omVRbHjefT/",
};

export const heroStats = [
  { value: 97.0, decimals: 1, label: "Amazon ML Challenge score", suffix: "" },
  { value: 1.53, decimals: 2, label: "Amazon ML Challenge 2026 rank", prefix: "Top ", suffix: "%" },
  { value: 2, decimals: 0, label: "Hackathon winner", suffix: "×" },
  { value: 4, decimals: 0, label: "AI internships", suffix: "" },
];

export const marquee = [
  "Python", "FastAPI", "React", "LLM Integration", "Voice AI", "NLP", "Vapi", "Deepgram",
  "LightGBM", "PostgreSQL", "Qdrant", "Supabase", "Docker", "Railway", "Twilio", "OCR",
];

export type Project = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  metrics: { v: string; l: string }[];
  stack: string[];
  links: { label: string; href: string }[];
  featured?: boolean;
  shot?: { src: string; alt: string };
  gallery?: { src: string; alt: string }[];
};

export const projects: Project[] = [
  {
    id: "2care",
    title: "Apollo Voice Receptionist",
    kicker: "Voice AI · Voice Agent-a-thon winner",
    summary:
      "Built for the Voice Agent-a-thon, which I won. A phone agent for Apollo Hospitals, Chennai. Patients call, speak naturally and book, reschedule or cancel appointments with no human involved. Fuzzy doctor-name matching and phonetic confirmation-code cleanup keep it accurate on noisy calls.",
    metrics: [
      { v: "<1.5s", l: "response latency" },
      { v: "100%", l: "eval pass, 17 scenarios" },
    ],
    stack: ["Vapi", "Deepgram Nova-2", "GPT-4o-mini", "Azure TTS", "FastAPI", "PostgreSQL"],
    links: [
      { label: "Live dashboard", href: "https://web-production-c64ce.up.railway.app" },
      { label: "GitHub", href: "https://github.com/Satyav8/2Care" },
    ],
    featured: true,
    shot: { src: "/assets/2care-dashboard.webp", alt: "Apollo Reception Dashboard showing appointments, doctor roster and call logs tabs" },
  },
  {
    id: "kiro",
    title: "KIRO — Child Wellness Voice Agent",
    kicker: "Voice AI · Internship",
    summary:
      "The front door for Keep It Real Online India. A worried parent calls and speaks in English, Hindi, Telugu (Telangana and Andhra dialects) or most Indian languages. KIRO listens, asks one question at a time and turns the call into a structured case file with age, family setup, concern, sentiment and a provisional severity score. It never diagnoses, and every case reaches a psychologist with context.",
    metrics: [
      { v: "EN·HI·TE", l: "plus other Indian languages" },
      { v: "$0.085", l: "per call minute" },
    ],
    stack: ["Vapi", "Gemini Flash", "Cartesia", "Soniox"],
    links: [],
    featured: true,
  },
  {
    id: "geometra",
    title: "S.A.M — Geometra Support Chatbot",
    kicker: "LLM Systems · Internship",
    summary:
      "A two-pass LLM chatbot built as layers that each answer only what they can answer reliably. Regex short-circuits handle pricing, greetings and policy at zero LLM cost, small isolated classifiers handle open-ended judgments, and three independent safety layers fail open instead of breaking.",
    metrics: [
      { v: "363", l: "automated tests" },
      { v: "3", l: "safety layers" },
    ],
    stack: ["OpenAI", "Qdrant", "Supabase", "Python"],
    links: [],
    featured: true,
  },
  {
    id: "reelhaus",
    title: "ReelHaus — Club Events Platform",
    kicker: "Full-stack · Co-built with Manikanta Boda",
    summary:
      "An events platform for the ReelHaus club that I built alongside Manikanta Boda. Members browse upcoming events and past highlights, meet the team and join, while an admin area manages events. Registration shows live seat counts and per-ticket pricing, then hands off to an online payment checkout.",
    metrics: [],
    stack: ["TypeScript", "Event ticketing", "Admin dashboard", "Cashfree payments"],
    links: [
      { label: "GitHub", href: "https://github.com/Satyav8/ReelHaus-Dev" },
      { label: "Co-built with Manikanta Boda", href: "https://manikantaboda.online/" },
    ],
    featured: true,
    gallery: [
      { src: "/assets/reelhaus-home.webp", alt: "ReelHaus landing page: Exclusive club events by ReelHaus" },
      { src: "/assets/reelhaus-highlights.webp", alt: "ReelHaus highlights from past events carousel" },
      { src: "/assets/reelhaus-register.webp", alt: "ReelHaus event registration form with seats available and ticket price" },
    ],
  },
  {
    id: "broca",
    title: "Broca — Healthcare AI Assistant",
    kicker: "Health AI · Internship",
    summary:
      "A Type 1 diabetes companion. Its Glycemic Control Console scores CGM data against ATTD/ADA targets and forecasts dangerous lows 30 minutes ahead using signal processing, not a model call. It also reads lab reports (23 biomarkers) and turns grocery receipts into diet plans.",
    metrics: [
      { v: "83%", l: "hypos caught, ~2 false alarms/day" },
      { v: "23", l: "biomarkers extracted" },
    ],
    stack: ["FastAPI", "Streamlit", "SQLite", "Groq", "OCR"],
    links: [{ label: "GitHub", href: "https://github.com/Satyav8/Broca_assistance" }],
    shot: { src: "/assets/broca-home.webp", alt: "Broca Healthcare AI home screen with platform activity and feature navigation" },
  },
  {
    id: "recovery",
    title: "Recovery Intelligence",
    kicker: "Health AI",
    summary:
      "A post-operative monitoring platform with real-time risk scoring, automated Twilio alerts and AI-generated clinical summaries.",
    metrics: [
      { v: "92%", l: "risk classification accuracy" },
      { v: "-60%", l: "escalation response time" },
    ],
    stack: ["FastAPI", "React", "SQLAlchemy", "Twilio"],
    links: [{ label: "GitHub", href: "https://github.com/Satyav8/Recovery-Monitoring-System" }],
  },
  {
    id: "emolens",
    title: "EmoLens",
    kicker: "Deep Learning",
    summary:
      "A multimodal emotion detection system across 7 emotion categories, served through a real-time inference pipeline.",
    metrics: [
      { v: "88%", l: "accuracy, 7 emotions" },
      { v: "-35%", l: "prediction latency" },
    ],
    stack: ["Python", "NLP", "Deep Learning"],
    links: [{ label: "GitHub", href: "https://github.com/Satyav8/Emo_lens" }],
  },
  {
    id: "mlc",
    title: "Amazon ML Challenge 2026 — Entity Resolution",
    kicker: "Machine Learning · Team Horizon",
    summary:
      "Match every business in one source to its records in two others. Pipeline: normalize, block, 41 pair features, LightGBM, then one-to-one assignment with a threshold tuned for macro F0.5. Includes an Indian-script to English dictionary learned from training pairs. No GPU, no external data.",
    metrics: [
      { v: "97.0", l: "score" },
      { v: "Top 1.53%", l: "98.47 percentile" },
    ],
    stack: ["LightGBM", "Python", "Parquet", "Feature Engineering"],
    links: [],
  },
];

export const moreRepos = [
  { name: "Geometra", lang: "Python" },
  { name: "ConnectHub", lang: "JavaScript" },
  { name: "Bleeding_Detector", lang: "Python" },
  { name: "ML_coach", lang: "Python" },
  { name: "AI_Fitness", lang: "Python" },
  { name: "Air_Beats", lang: "Python" },
  { name: "CC_Audio_translator", lang: "Python" },
  { name: "Student_Mgmt_Portal", lang: "HTML" },
];

export const experience = [
  {
    org: "Geometra (Proyog)",
    role: "AI Engineer Intern",
    when: "2026",
    points: [
      "Designed S.A.M, a layered customer-support chatbot on Qdrant and Supabase.",
      "Found that rules compete inside a 22,000-character prompt, so moved decisions into deterministic and isolated layers. Measured the same model at 10/12 inside the big prompt and 15/15 in isolation.",
      "Shipped with 363 tests and a startup guard that refuses to boot on data-losing config.",
    ],
  },
  {
    org: "KIRO — Keep It Real Online India",
    role: "AI Engineer Intern",
    when: "2026",
    points: [
      "Built a multilingual voice agent handling Telugu, Hindi and English dialects.",
      "Structured free-flowing parent calls into case files with severity scoring for psychologists.",
    ],
  },
  {
    org: "Broca",
    role: "AI Engineer Intern",
    when: "2025",
    points: [
      "Built a diabetes clinical companion with predictive hypoglycemia early warning.",
      "Report analyzer with OCR and LLMs covering 95% of tested report formats; 70% faster interpretation.",
    ],
  },
  {
    org: "Octacomm Solutions",
    role: "AI/ML Engineering Intern",
    when: "Jul 2024 — Apr 2026",
    points: [
      "Built ML pipelines that lifted model accuracy by 18% through feature engineering, tuning and ETL testing.",
      "NLP and LLM analytics that cut manual analysis effort by 40% and data quality issues by 30%.",
      "AI-driven automation for communication platforms.",
    ],
  },
];

export type Moment = { img: string; title: string; text: string; tag: string; video?: string; wide?: boolean };

export const moments: Moment[] = [
  { img: "/assets/4.webp", tag: "Winner", title: "1st Place, Sudhee Hackathon at CBIT", text: "Our team took first place at the Sudhee Hackathon hosted at CBIT and received certificates from the faculty. I also represented the institute at the national-level hackathon by OpenAI." },
  { img: "/assets/5.webp", tag: "Recognition", title: "Certificates of Merit, CBIT", text: "Certificates of Merit from the CBIT hackathon, presented alongside my teammate." },
  { img: "/assets/6.webp", tag: "Session", title: "Git & GitHub Session", text: "A hands-on session on version control, from git init and add to commits and pushing to GitHub, taught live to students at my college." },
  { img: "/assets/tapasya-poster.webp", video: "/assets/tapasya-session.mp4", tag: "Guest session", title: "AI for Entrepreneurs: Tapasya Session", text: "Delivered a session on using AI for entrepreneurs to students at Tapasya, taking questions from the audience. Press play to watch." },
  { img: "/assets/3.webp", tag: "Lecture", title: "Lecture on Machine Learning", text: "Delivered a lecture on Machine Learning to fellow students." },
  { img: "/assets/devfest-2025.webp", tag: "Community", title: "Google DevFest Hyderabad 2025", text: "Part of Google Developer Groups Hyderabad's DevFest 2025." },
  { img: "/assets/iitg-ceremony.webp", wide: true, tag: "Graduation", title: "IIT Guwahati Certificate Distribution Ceremony", text: "Receiving my certificate on stage at IIT Guwahati." },
  { img: "/assets/iitg-batch.webp", wide: true, tag: "Graduation", title: "With the batch at IIT Guwahati", text: "The whole batch outside the IIT Guwahati main building, gamosas and certificate folders in hand." },
  { img: "/assets/1.webp", tag: "Graduation", title: "IIT Guwahati, DS & ML Minor", text: "Completed a Minor in Data Science and Machine Learning, September 2026." },
];

export const skills: Record<string, string[]> = {
  "Voice AI": ["Vapi", "Deepgram", "Soniox", "Cartesia", "Azure Neural TTS", "Twilio", "STT / TTS pipelines", "Tool calling", "Latency tuning"],
  "AI / ML": ["Machine Learning", "Deep Learning", "NLP", "LLM Integration", "Prompt Engineering", "OCR", "Hyperparameter Tuning", "Model Deployment"],
  "Data": ["ETL Testing", "Data Warehousing", "Data Validation", "Feature Engineering", "Data Analysis"],
  "Backend & Web": ["FastAPI", "Flask", "Node.js", "React.js", "PostgreSQL", "MongoDB", "MySQL", "REST APIs"],
  "Languages & Tools": ["Python", "Java", "JavaScript", "C", "Docker", "Git", "Postman", "Railway"],
};
