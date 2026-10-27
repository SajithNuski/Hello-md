import { ThemeId } from "../assemble/themes";

export interface PresetTemplate {
  name: string;
  slug: string;
  role: string;
  tagline: string;
  persona: string;
  theme: ThemeId;
  accentColor: string;
  sectionOrder: string[];
  badgeStyle: "for-the-badge" | "flat-square" | "flat" | "plastic";
  isPublic: boolean;
  tags: string[];
  previewMarkdown: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    name: "The Fullstack Modernist",
    slug: "fullstack-modernist",
    role: "Full-Stack Engineer",
    tagline: "High-density layout for modern TypeScript, React, and cloud-native backend engineers.",
    persona: "fullstack",
    theme: "violet",
    accentColor: "#a78bfa",
    sectionOrder: ["intro", "about", "skills", "projects", "stats", "contact"],
    badgeStyle: "for-the-badge",
    isPublic: true,
    tags: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    previewMarkdown: `# Hi there, I'm a Full-Stack Engineer 👋

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0f172a,7c3aed&height=180&section=header&text=Full-Stack%20Engineer&fontSize=42&fontAlignY=38&desc=Building%20modern%20web%20applications%20at%20scale&descAlignY=58&descSize=18&fontColor=ffffff&font=Fira+Code" width="100%" alt="Header" />
</p>

<p align="center">
  <a href="https://github.com"><img src="https://img.shields.io/github/followers/octocat?style=for-the-badge&logo=github&color=7c3aed&labelColor=0f172a" alt="Followers" /></a>
  <img src="https://komarev.com/ghpvc/?username=octocat&color=7c3aed&style=for-the-badge&label=PROFILE+VIEWS" alt="Views" />
</p>

## 👨‍💻 About Me
- 🔭 I’m currently building distributed systems and high-performance web products.
- 🌱 Exploring modern web architectures, edge computing, and serverless infrastructure.
- 💬 Ask me about **React, Node.js, TypeScript, and Database Design**.
- ⚡ Fun fact: Clean architecture and automated tests are non-negotiable.

## 🛠️ Tech Stack
<div align="center">
  <img src="https://skillicons.dev/icons?i=ts,js,react,nextjs,nodejs,tailwind,postgres,mongodb,redis,docker&perline=10" alt="Tech Stack" />
</div>

## 📊 GitHub Analytics
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=octocat&show_icons=true&theme=tokyonight&hide_border=true" alt="Stats" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=octocat&layout=compact&theme=tokyonight&hide_border=true" alt="Languages" />
</div>

## 📬 Connect With Me
<div align="center">
  <a href="https://linkedin.com"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://x.com"><img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>
  <a href="https://github.com"><img src="https://img.shields.io/badge/Portfolio-7c3aed?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" /></a>
</div>
`,
  },
  {
    name: "Neural & Systems Architect",
    slug: "neural-systems-architect",
    role: "AI & ML Researcher",
    tagline: "Designed for deep learning researchers, ML engineers, and data infrastructure builders.",
    persona: "ai",
    theme: "cyan",
    accentColor: "#22d3ee",
    sectionOrder: ["intro", "skills", "about", "projects", "stats", "contact"],
    badgeStyle: "for-the-badge",
    isPublic: true,
    tags: ["Python", "PyTorch", "TensorFlow", "HuggingFace", "CUDA", "FastAPI"],
    previewMarkdown: `# Artificial Intelligence & Deep Learning Researcher 🧠

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0f172a,0891b2&height=180&section=header&text=AI%20%26%20ML%20Engineer&fontSize=42&fontAlignY=38&desc=Training%20foundational%20models%20and%20neural%20architectures&descAlignY=58&descSize=18&fontColor=ffffff&font=JetBrains+Mono" width="100%" alt="Header" />
</p>

## 🛠️ Specialized AI Stack
<div align="center">
  <img src="https://skillicons.dev/icons?i=python,pytorch,tensorflow,fastapi,docker,linux,git,gcp,postgres,bash&perline=10" alt="Tech Stack" />
</div>

## 🔬 Research & Focus
- 🤖 Fine-tuning Transformer architectures and LLM reasoning pipelines.
- ⚡ High-throughput GPU inference with vLLM, TensorRT-LLM, and CUDA.
- 📈 Statistical modeling, embeddings indexing, and vector similarity search.
`,
  },
  {
    name: "Cloud Native SRE & Platform",
    slug: "cloud-native-sre",
    role: "DevOps & Cloud Engineer",
    tagline: "Engineered for site reliability engineers, Kubernetes operators, and cloud infrastructure leaders.",
    persona: "devops",
    theme: "amber",
    accentColor: "#f59e0b",
    sectionOrder: ["intro", "skills", "projects", "about", "stats", "contact"],
    badgeStyle: "flat-square",
    isPublic: true,
    tags: ["Kubernetes", "Docker", "Terraform", "AWS", "Go", "Linux"],
    previewMarkdown: `# Cloud Infrastructure & Platform Engineering ☁️

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=1c1917,d97706&height=180&section=header&text=Site%20Reliability%20Engineer&fontSize=40&fontAlignY=38&desc=Zero-downtime%20orchestration%20and%20cloud%20architecture&descAlignY=58&descSize=18&fontColor=ffffff&font=Fira+Code" width="100%" alt="Header" />
</p>

## 🛠️ Infrastructure & Cloud Stack
<div align="center">
  ![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)
  ![Terraform](https://img.shields.io/badge/Terraform-844FBA?style=flat-square&logo=terraform&logoColor=white)
  ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
  ![Go](https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white)
  ![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black)
</div>

## 📈 System Metrics & Stats
<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=octocat&theme=dark" alt="Streak" />
</div>
`,
  },
  {
    name: "Terminal Hacker & Kernel Craftsman",
    slug: "terminal-hacker",
    role: "Open Source Contributor",
    tagline: "Retro terminal aesthetic featuring monospace banners, ASCII markers, and low-level engineering grit.",
    persona: "opensource",
    theme: "green",
    accentColor: "#22c55e",
    sectionOrder: ["intro", "about", "skills", "stats", "projects", "contact"],
    badgeStyle: "flat-square",
    isPublic: true,
    tags: ["Rust", "C", "C++", "Linux", "Git", "Bash"],
    previewMarkdown: `\`\`\`bash
$ whoami
> system_architect // low-level kernel & systems enthusiast
$ uptime
> 99.999% availability // deterministic systems
\`\`\`

# 💻 Terminal Telemetry

<div align="center">
  <a href="https://github.com/torvalds"><img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=20&duration=3000&pause=1000&color=22C55E&center=true&vCenter=true&width=500&lines=Writing+high-performance+Rust+%26+C;Maintaining+open-source+libraries;Deterministic+algorithms+only" alt="Typing SVG" /></a>
</div>

## ⚙️ Core Toolchain
<div align="center">
  <img src="https://skillicons.dev/icons?i=rust,c,cpp,linux,bash,git,docker,neovim&perline=8" alt="Low-level Tech" />
</div>

## ⚡ Active Contributions
- 🐧 Linux kernel and embedded firmware experimentation
- 🦀 Memory-safe asynchronous networking primitives in Rust
`,
  },
  {
    name: "Frontend Artisan & UI Specialist",
    slug: "frontend-artisan",
    role: "Frontend Engineer / UI Craft",
    tagline: "Lively design-centric presentation emphasizing pixel perfection, micro-animations, and clean aesthetics.",
    persona: "designer",
    theme: "pink",
    accentColor: "#f472b6",
    sectionOrder: ["intro", "about", "skills", "projects", "contact"],
    badgeStyle: "for-the-badge",
    isPublic: true,
    tags: ["React", "Vue", "Tailwind", "Three.js", "Figma", "CSS"],
    previewMarkdown: `# Crafting Digital Experiences ✨

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=ec4899,f97316&height=180&section=header&text=Design%20%26%20Frontend%20Artisan&fontSize=40&fontAlignY=38&desc=Where%20deliberate%20design%20meets%20scalable%20code&descAlignY=58&descSize=18&fontColor=ffffff&font=Poppins" width="100%" alt="Header" />
</p>

## 🎨 Creative & UI Toolkit
<div align="center">
  <img src="https://skillicons.dev/icons?i=figma,tailwind,react,vue,sass,ts,html,css,threejs,vite&perline=10" alt="UI Tools" />
</div>

## 💡 Design Philosophy
- **Precision:** 1px matters. Strict alignment, optical balancing, and zero arbitrary spacing.
- **Performance:** 60fps animations via GPU-composited CSS transforms and GSAP.
- **Accessibility:** Full WCAG AA compliance with ergonomic screen-reader navigability.
`,
  },
  {
    name: "Distributed Backend Architect",
    slug: "distributed-backend-architect",
    role: "Backend Systems Lead",
    tagline: "Designed for engineers building high-throughput microservices, event streams, and relational data layers.",
    persona: "backend",
    theme: "indigo",
    accentColor: "#818cf8",
    sectionOrder: ["intro", "about", "skills", "projects", "stats", "contact"],
    badgeStyle: "for-the-badge",
    isPublic: true,
    tags: ["Go", "Java", "PostgreSQL", "Kafka", "Redis", "gRPC"],
    previewMarkdown: `# Distributed Backend Systems ⚡

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9,6366f1&height=180&section=header&text=Backend%20Systems%20Architect&fontSize=40&fontAlignY=38&desc=Reliable%2C%20concurrent%2C%20and%20fault-tolerant%20infrastructure&descAlignY=58&descSize=18&fontColor=ffffff&font=Fira+Code" width="100%" alt="Header" />
</p>

## 🛠️ Data & Messaging Stack
<div align="center">
  <img src="https://skillicons.dev/icons?i=go,java,postgres,redis,graphql,docker,kubernetes,git,linux,postman&perline=10" alt="Backend Stack" />
</div>

## 🏛️ Engineering Tenets
- Concurrency patterns with zero race conditions
- Event-driven event sourcing and message streaming
- Sub-10ms p99 query latency through calibrated indexing
`,
  },
  {
    name: "Minimal Monospace Engineer",
    slug: "minimal-monospace",
    role: "Software Craftsman",
    tagline: "Restrained, typography-first markdown with zero gratuitous images, built for documentation purists.",
    persona: "student",
    theme: "mono",
    accentColor: "#e6edf3",
    sectionOrder: ["intro", "about", "skills", "projects", "contact"],
    badgeStyle: "flat-square",
    isPublic: true,
    tags: ["TypeScript", "Python", "Go", "Git", "Markdown"],
    previewMarkdown: `# John Doe

> Software engineer focused on clean algorithms, systems programming, and high-quality open-source software.

---

### Specializations
- **Languages:** TypeScript, Python, Go, SQL, Bash
- **Methodology:** Test-driven development, modular package design, deterministic builds
- **Documentation:** Markdown documentation, schema generation, API spec design

---

### Featured Repositories
- **[compiler-core](https://github.com):** A lightweight bytecode VM and lexer written in Go.
- **[cache-flow](https://github.com):** In-memory eviction caching with zero lock contention.

---

### Contact
[GitHub](https://github.com) • [LinkedIn](https://linkedin.com) • [Personal Blog](https://example.com)
`,
  },
  {
    name: "Cybersecurity & Threat Analyst",
    slug: "cybersecurity-threat-analyst",
    role: "Security Researcher",
    tagline: "Tailored for penetration testers, application security engineers, and red/blue team specialists.",
    persona: "security",
    theme: "red",
    accentColor: "#f87171",
    sectionOrder: ["intro", "about", "skills", "projects", "stats", "contact"],
    badgeStyle: "flat-square",
    isPublic: true,
    tags: ["Python", "Bash", "Linux", "Docker", "Git"],
    previewMarkdown: `# Application Security & Vulnerability Research 🛡️

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=111827,dc2626&height=180&section=header&text=Security%20Researcher&fontSize=42&fontAlignY=38&desc=Application%20security%2C%20threat%20modeling%20%26%20hardening&descAlignY=58&descSize=18&fontColor=ffffff&font=JetBrains+Mono" width="100%" alt="Header" />
</p>

## 🔒 Security Operations
- 🔍 Automated SAST/DAST pipeline integration & secrets scanning
- 🛡️ Zero-trust architecture & container hardening
- 🐛 Responsible vulnerability disclosure & bug bounty reporting

## 🛠️ Security Toolkit
<div align="center">
  <img src="https://skillicons.dev/icons?i=python,bash,linux,docker,git,postman,c,cloudflare&perline=8" alt="Security Stack" />
</div>
`,
  },
];
