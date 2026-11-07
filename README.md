# Hello-md ⚡

> **Precision GitHub Profile README Generator**  
> Real data from GitHub GraphQL. AI writes only grounded prose. Code assembles everything else.

Hello-md generates a professional, fact-grounded GitHub profile README from any public GitHub username. It features live streaming generation, an interactive markdown editor with real-time preview, single-section AI regeneration, and 1-click publishing directly to your `username/username` repository.

---

## ✨ Features

- **Grounded Fact Ingestion:** Queries public GitHub profile metrics, top languages, stargazers, and repository contributions via GitHub GraphQL. The AI never invents facts or links.
- **Multi-Stage Streaming:** Real-time Server-Sent Events (SSE) pipeline displaying live progress across Ingestion, Prose Generation, and Deterministic Assembly.
- **Dual AI Engine with Automatic Failover:** Primary generation via Groq Cloud (Llama 3.3 / Qwen), automatically failing over to Google Gemini on rate limits or cooldowns.
- **Interactive Markdown Editor:** CodeMirror 6 markdown editor with live GitHub-styled preview, instant syntax highlighting, and section-by-section regeneration.
- **1-Click GitHub Export:** Authenticated users can commit their generated `README.md` directly to their personal profile repository (`user/user`) via the GitHub REST API.
- **Bring Your Own Key (BYOK):** Optional client-side API key configuration (Groq or Gemini) stored strictly in localStorage for unmetered generations.
- **Production-Ready Architecture:** MongoDB caching (7-day LLM cache, 1-hour GitHub facts cache, 2-day rate-limiting quotas) with automatic TTL cleanup.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript, Node.js runtime
- **Database:** MongoDB Atlas (native driver with Zod schemas)
- **Authentication:** NextAuth.js (Auth.js) with GitHub OAuth provider
- **AI Inference:** Groq Cloud (`openai` SDK) & Google Gemini (`@google/genai`)
- **Editor & Preview:** CodeMirror 6, `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-sanitize`
- **Styling & UI:** Tailwind CSS, Radix UI primitives, GSAP animations

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/Hello-md.git
cd Hello-md
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your credentials:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hellomd
AUTH_SECRET=your_generated_32_character_secret
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
GROQ_API_KEY=gsk_your_groq_api_key
GEMINI_API_KEY=AIzaSy_your_gemini_api_key
```

### 3. Initialize Database Indexes
```bash
npm run db:indexes
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment

For deployment to **Vercel**, **Docker**, or **VPS**, see the complete step-by-step instructions in [**`HOSTING.md`**](./HOSTING.md).

---

## 📄 License

MIT License. Designed and built with Next.js and Tailwind CSS.

