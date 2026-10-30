import { ThemeId } from "../assemble/themes";
import { SectionItem } from "../db/collections";

export interface TemplateTokens {
  name: string;
  role: string;
  username: string;
  accentColor: string;
  font: string;
  stack: string;
}

export interface PresetTemplate {
  name: string;
  slug: string;
  role: string;
  tagline: string;
  persona: string;
  theme: ThemeId;
  accentColor: string;
  font: string;
  headerStyle: "wave" | "terminal" | "minimal";
  sectionOrder: string[];
  badgeStyle: "for-the-badge" | "flat-square" | "flat" | "plastic";
  isPublic: boolean;
  tags: string[];
  rawMarkdown: string;
  defaultTokens: TemplateTokens;
  previewMarkdown?: string;
  // Factory for editable editor sections
  createSections?: (tokens?: Partial<TemplateTokens>) => SectionItem[];
}

/**
 * Pure and deterministic template renderer.
 * Replaces tokens: {name}, {role}, {username}, {accentColor}, {font}, {stack}
 */
export function renderTemplateMarkdown(
  template: PresetTemplate,
  customTokens?: Partial<TemplateTokens>
): string {
  const tokens: TemplateTokens = {
    ...template.defaultTokens,
    ...(customTokens || {}),
  };

  let md = template.rawMarkdown;
  md = md.replaceAll("{name}", tokens.name);
  md = md.replaceAll("{role}", tokens.role);
  md = md.replaceAll("{username}", tokens.username);
  // Clean accent color (no leading # in URL parameters)
  const cleanAccent = tokens.accentColor.replace(/^#/, "");
  md = md.replaceAll("{accentColor}", cleanAccent);
  md = md.replaceAll("{font}", tokens.font);
  md = md.replaceAll("{stack}", tokens.stack);
  return md.trim();
}

/**
 * The 8 curated developer templates with real markdown sources and role-appropriate content.
 */
export const TEMPLATES_CONFIG: PresetTemplate[] = [
  {
    name: "The Fullstack Modernist",
    slug: "fullstack-modernist",
    role: "Full-Stack Engineer",
    tagline: "High-density layout for modern TypeScript, React, and cloud-native backend engineers.",
    persona: "fullstack",
    theme: "violet",
    accentColor: "#a78bfa",
    font: "Fira+Code",
    headerStyle: "wave",
    sectionOrder: ["intro", "about", "skills", "projects", "stats", "contact"],
    badgeStyle: "for-the-badge",
    isPublic: true,
    tags: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    defaultTokens: {
      name: "Alex Morgan",
      role: "Full-Stack Engineer",
      username: "octocat",
      accentColor: "7c3aed",
      font: "Fira+Code",
      stack: "ts,js,react,nextjs,nodejs,tailwind,postgres,mongodb,redis,docker",
    },
    rawMarkdown: `# Hi there, I'm {name} 👋

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0f172a,{accentColor}&height=180&section=header&text={role}&fontSize=42&fontAlignY=38&desc=Building%20modern%20web%20applications%20at%20scale&descAlignY=58&descSize=18&fontColor=ffffff&font={font}" width="100%" alt="{role} Header" />
</p>

## 👨‍💻 About Me
- 🔭 Engineering distributed fullstack web applications with modern TypeScript, React, and Node.js.
- 🌱 Architecting resilient microservices, edge compute workflows, and automated CI/CD pipelines.
- 💬 Ask me about **Next.js App Router, GraphQL federation, and PostgreSQL optimization**.
- ⚡ Focus: Clean architecture, strict type safety, and deterministic deployments.

## 🛠️ Tech Stack
<div align="center">
  <img src="https://skillicons.dev/icons?i={stack}&perline=10" alt="Tech Stack" />
</div>

## 📊 Engineering Analytics
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&theme=tokyonight&hide_border=true" alt="GitHub Stats" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username={username}&layout=compact&theme=tokyonight&hide_border=true" alt="Top Languages" />
</div>

## 📬 Connect With Me
<div align="center">
  <a href="https://linkedin.com"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://github.com/{username}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  <a href="https://x.com"><img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>
</div>`,
    createSections: (custom) => {
      const tokens = { ...TEMPLATES_CONFIG[0].defaultTokens, ...(custom || {}) };
      return [
        {
          key: "intro",
          markdown: `# Hi there, I'm ${tokens.name} 👋\n\n<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=0f172a,${tokens.accentColor}&height=180&section=header&text=${encodeURIComponent(tokens.role)}&fontSize=42&fontAlignY=38&desc=Building%20modern%20web%20applications%20at%20scale&descAlignY=58&descSize=18&fontColor=ffffff&font=${tokens.font}" width="100%" alt="${tokens.role} Header" />\n</p>`,
          source: "user",
          enabled: true,
          order: 0,
        },
        {
          key: "about",
          markdown: `## 👨‍💻 About Me\n- 🔭 Engineering distributed fullstack web applications with modern TypeScript, React, and Node.js.\n- 🌱 Architecting resilient microservices, edge compute workflows, and automated CI/CD pipelines.\n- 💬 Ask me about **Next.js App Router, GraphQL federation, and PostgreSQL optimization**.\n- ⚡ Focus: Clean architecture, strict type safety, and deterministic deployments.`,
          source: "user",
          enabled: true,
          order: 1,
        },
        {
          key: "skills",
          markdown: `## 🛠️ Tech Stack\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${tokens.stack}&perline=10" alt="Tech Stack" />\n</div>`,
          source: "user",
          enabled: true,
          order: 2,
        },
        {
          key: "projects",
          markdown: `## 🚀 Featured Projects\n- **[cloud-mesh](https://github.com/${tokens.username}/cloud-mesh)**: High-performance TypeScript edge gateway with sub-5ms routing.\n- **[nexus-ui](https://github.com/${tokens.username}/nexus-ui)**: Accessible, composable component library built with Tailwind and React.`,
          source: "user",
          enabled: true,
          order: 3,
        },
        {
          key: "stats",
          markdown: `## 📊 Engineering Analytics\n<div align="center">\n  <img src="https://github-readme-stats.vercel.app/api?username=${tokens.username}&show_icons=true&theme=tokyonight&hide_border=true" alt="GitHub Stats" />\n  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${tokens.username}&layout=compact&theme=tokyonight&hide_border=true" alt="Top Languages" />\n</div>`,
          source: "user",
          enabled: true,
          order: 4,
        },
        {
          key: "contact",
          markdown: `## 📬 Connect With Me\n<div align="center">\n  <a href="https://linkedin.com"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>\n  <a href="https://github.com/${tokens.username}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>\n  <a href="https://x.com"><img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>\n</div>`,
          source: "user",
          enabled: true,
          order: 5,
        },
      ];
    },
  },
  {
    name: "Neural & Systems Architect",
    slug: "neural-systems-architect",
    role: "AI & ML Researcher",
    tagline: "Designed for deep learning researchers, ML engineers, and data infrastructure builders.",
    persona: "ai",
    theme: "cyan",
    accentColor: "#22d3ee",
    font: "JetBrains+Mono",
    headerStyle: "wave",
    sectionOrder: ["intro", "skills", "about", "projects", "stats", "contact"],
    badgeStyle: "for-the-badge",
    isPublic: true,
    tags: ["Python", "PyTorch", "TensorFlow", "HuggingFace", "CUDA", "FastAPI"],
    defaultTokens: {
      name: "Dr. Elena Rostova",
      role: "AI & ML Researcher",
      username: "octocat",
      accentColor: "0891b2",
      font: "JetBrains+Mono",
      stack: "python,pytorch,tensorflow,fastapi,docker,linux,git,gcp,postgres,bash",
    },
    rawMarkdown: `# {name} | Deep Learning & Neural Systems 🧠

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0f172a,{accentColor}&height=180&section=header&text={role}&fontSize=42&fontAlignY=38&desc=Training%20foundational%20models%20and%20neural%20architectures&descAlignY=58&descSize=18&fontColor=ffffff&font={font}" width="100%" alt="{role} Header" />
</p>

## 🔬 Research & Specializations
- 🤖 Fine-tuning Transformer architectures, mixture-of-experts (MoE), and sparse attention layers.
- ⚡ High-throughput GPU inference with vLLM, TensorRT-LLM, FlashAttention, and CUDA.
- 📈 Vector indexing, embeddings clustering, and retrieval-augmented reasoning pipelines.
- 🎯 Investigating mechanistic interpretability in large reasoning models.

## 🛠️ Specialized AI Stack
<div align="center">
  <img src="https://skillicons.dev/icons?i={stack}&perline=10" alt="Specialized AI Stack" />
</div>

## 📚 Selected Research & Implementations
- **[sparse-attention-v2](https://github.com/{username}/sparse-attention-v2)**: Block-sparse FlashAttention kernel targeting NVIDIA Hopper GPUs.
- **[tensor-quant](https://github.com/{username}/tensor-quant)**: 4-bit and 3-bit activation-aware weight quantization library.

## 📬 Research Inquiries
<div align="center">
  <a href="https://huggingface.co"><img src="https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="Hugging Face" /></a>
  <a href="https://scholar.google.com"><img src="https://img.shields.io/badge/Google_Scholar-4285F4?style=for-the-badge&logo=googlescholar&logoColor=white" alt="Google Scholar" /></a>
  <a href="https://github.com/{username}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
</div>`,
    createSections: (custom) => {
      const tokens = { ...TEMPLATES_CONFIG[1].defaultTokens, ...(custom || {}) };
      return [
        {
          key: "intro",
          markdown: `# ${tokens.name} | Deep Learning & Neural Systems 🧠\n\n<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=0f172a,${tokens.accentColor}&height=180&section=header&text=${encodeURIComponent(tokens.role)}&fontSize=42&fontAlignY=38&desc=Training%20foundational%20models%20and%20neural%20architectures&descAlignY=58&descSize=18&fontColor=ffffff&font=${tokens.font}" width="100%" alt="${tokens.role} Header" />\n</p>`,
          source: "user",
          enabled: true,
          order: 0,
        },
        {
          key: "skills",
          markdown: `## 🛠️ Specialized AI Stack\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${tokens.stack}&perline=10" alt="Specialized AI Stack" />\n</div>`,
          source: "user",
          enabled: true,
          order: 1,
        },
        {
          key: "about",
          markdown: `## 🔬 Research & Specializations\n- 🤖 Fine-tuning Transformer architectures, mixture-of-experts (MoE), and sparse attention layers.\n- ⚡ High-throughput GPU inference with vLLM, TensorRT-LLM, FlashAttention, and CUDA.\n- 📈 Vector indexing, embeddings clustering, and retrieval-augmented reasoning pipelines.\n- 🎯 Investigating mechanistic interpretability in large reasoning models.`,
          source: "user",
          enabled: true,
          order: 2,
        },
        {
          key: "projects",
          markdown: `## 📚 Selected Research & Implementations\n- **[sparse-attention-v2](https://github.com/${tokens.username}/sparse-attention-v2)**: Block-sparse FlashAttention kernel targeting NVIDIA Hopper GPUs.\n- **[tensor-quant](https://github.com/${tokens.username}/tensor-quant)**: 4-bit and 3-bit activation-aware weight quantization library.`,
          source: "user",
          enabled: true,
          order: 3,
        },
        {
          key: "contact",
          markdown: `## 📬 Research Inquiries\n<div align="center">\n  <a href="https://huggingface.co"><img src="https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="Hugging Face" /></a>\n  <a href="https://scholar.google.com"><img src="https://img.shields.io/badge/Google_Scholar-4285F4?style=for-the-badge&logo=googlescholar&logoColor=white" alt="Google Scholar" /></a>\n  <a href="https://github.com/${tokens.username}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>\n</div>`,
          source: "user",
          enabled: true,
          order: 4,
        },
      ];
    },
  },
  {
    name: "Cloud Native SRE & Platform",
    slug: "cloud-native-sre",
    role: "DevOps & Cloud Engineer",
    tagline: "Engineered for site reliability engineers, Kubernetes operators, and cloud infrastructure leaders.",
    persona: "devops",
    theme: "amber",
    accentColor: "#f59e0b",
    font: "Fira+Code",
    headerStyle: "wave",
    sectionOrder: ["intro", "skills", "projects", "about", "stats", "contact"],
    badgeStyle: "flat-square",
    isPublic: true,
    tags: ["Kubernetes", "Docker", "Terraform", "AWS", "Go", "Linux"],
    defaultTokens: {
      name: "Marcus Vance",
      role: "Site Reliability Engineer",
      username: "octocat",
      accentColor: "d97706",
      font: "Fira+Code",
      stack: "kubernetes,docker,terraform,aws,go,linux,prometheus,grafana",
    },
    rawMarkdown: `# {name} | Cloud Infrastructure & Reliability ☁️

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=1c1917,{accentColor}&height=180&section=header&text={role}&fontSize=40&fontAlignY=38&desc=Zero-downtime%20orchestration%20and%20cloud%20architecture&descAlignY=58&descSize=18&fontColor=ffffff&font={font}" width="100%" alt="{role} Header" />
</p>

## 🛠️ Infrastructure & Cloud Toolchain
<div align="center">
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/Terraform-844FBA?style=flat-square&logo=terraform&logoColor=white" alt="Terraform" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black" alt="Linux" />
</div>

## 🌐 Reliability Engineering Tenets
- 🛡️ Zero-downtime blue/green orchestrations across multi-region EKS clusters.
- 📊 Automated telemetry pipelines with OpenTelemetry, Prometheus, and Grafana alerting.
- ⚙️ Declarative GitOps infrastructure enforcement via ArgoCD and Crossplane.
- 🔄 99.99% SLA availability targets through automated canary rollouts and circuit breakers.

## 📦 Open Source Infrastructure
- **[k8s-mesh-operator](https://github.com/{username}/k8s-mesh-operator)**: Custom Kubernetes controller for dynamic TLS mTLS certificate rotation.
- **[tf-aws-baseline](https://github.com/{username}/tf-aws-baseline)**: Production-ready Terraform modules for zero-trust cloud topologies.

## 📈 Streak Telemetry
<div align="center">
  <img src="https://streak-stats.demolab.com/?user={username}&theme=dark" alt="GitHub Streak" />
</div>`,
    createSections: (custom) => {
      const tokens = { ...TEMPLATES_CONFIG[2].defaultTokens, ...(custom || {}) };
      return [
        {
          key: "intro",
          markdown: `# ${tokens.name} | Cloud Infrastructure & Reliability ☁️\n\n<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=1c1917,${tokens.accentColor}&height=180&section=header&text=${encodeURIComponent(tokens.role)}&fontSize=40&fontAlignY=38&desc=Zero-downtime%20orchestration%20and%20cloud%20architecture&descAlignY=58&descSize=18&fontColor=ffffff&font=${tokens.font}" width="100%" alt="${tokens.role} Header" />\n</p>`,
          source: "user",
          enabled: true,
          order: 0,
        },
        {
          key: "skills",
          markdown: `## 🛠️ Infrastructure & Cloud Toolchain\n<div align="center">\n  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white" alt="Kubernetes" />\n  <img src="https://img.shields.io/badge/Terraform-844FBA?style=flat-square&logo=terraform&logoColor=white" alt="Terraform" />\n  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white" alt="AWS" />\n  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />\n  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white" alt="Go" />\n  <img src="https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black" alt="Linux" />\n</div>`,
          source: "user",
          enabled: true,
          order: 1,
        },
        {
          key: "about",
          markdown: `## 🌐 Reliability Engineering Tenets\n- 🛡️ Zero-downtime blue/green orchestrations across multi-region EKS clusters.\n- 📊 Automated telemetry pipelines with OpenTelemetry, Prometheus, and Grafana alerting.\n- ⚙️ Declarative GitOps infrastructure enforcement via ArgoCD and Crossplane.\n- 🔄 99.99% SLA availability targets through automated canary rollouts and circuit breakers.`,
          source: "user",
          enabled: true,
          order: 2,
        },
        {
          key: "projects",
          markdown: `## 📦 Open Source Infrastructure\n- **[k8s-mesh-operator](https://github.com/${tokens.username}/k8s-mesh-operator)**: Custom Kubernetes controller for dynamic TLS mTLS certificate rotation.\n- **[tf-aws-baseline](https://github.com/${tokens.username}/tf-aws-baseline)**: Production-ready Terraform modules for zero-trust cloud topologies.`,
          source: "user",
          enabled: true,
          order: 3,
        },
        {
          key: "stats",
          markdown: `## 📈 Streak Telemetry\n<div align="center">\n  <img src="https://streak-stats.demolab.com/?user=${tokens.username}&theme=dark" alt="GitHub Streak" />\n</div>`,
          source: "user",
          enabled: true,
          order: 4,
        },
      ];
    },
  },
  {
    name: "Terminal Hacker & Kernel Craftsman",
    slug: "terminal-hacker",
    role: "Open Source Contributor",
    tagline: "Retro terminal aesthetic featuring monospace banners, ASCII markers, and low-level engineering grit.",
    persona: "opensource",
    theme: "green",
    accentColor: "#22c55e",
    font: "JetBrains+Mono",
    headerStyle: "terminal",
    sectionOrder: ["intro", "about", "skills", "stats", "projects", "contact"],
    badgeStyle: "flat-square",
    isPublic: true,
    tags: ["Rust", "C", "C++", "Linux", "Git", "Bash"],
    defaultTokens: {
      name: "Kaelen Chen",
      role: "Kernel & Systems Contributor",
      username: "octocat",
      accentColor: "22c55e",
      font: "JetBrains+Mono",
      stack: "rust,c,cpp,linux,bash,git,docker,neovim",
    },
    rawMarkdown: `\`\`\`bash
$ whoami
> {username} // low-level kernel & async systems contributor
$ cat /etc/os-release | grep PRETTY_NAME
> PRETTY_NAME="Arch Linux x86_64"
$ uptime -p
> up 99.999% availability // deterministic algorithms only
\`\`\`

# 💻 Terminal Telemetry

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font={font}&size=18&duration=3000&pause=1000&color={accentColor}&center=true&vCenter=true&width=500&lines=Writing+high-performance+Rust+%26+C;Maintaining+open-source+systems;Deterministic+algorithms+only" alt="Terminal Typing" />
</div>

## ⚙️ Core Toolchain
<div align="center">
  <img src="https://skillicons.dev/icons?i={stack}&perline=8" alt="Low-level Tech Toolchain" />
</div>

## ⚡ Active Contributions
- 🐧 Linux kernel and eBPF tracing: zero-overhead network filter probes.
- 🦀 Memory-safe asynchronous networking primitives implemented in pure Rust.
- 📟 Bare-metal firmware development for RISC-V microcontroller targets.

## 📂 Repositories
- **[kernel-ebpf-flow](https://github.com/{username}/kernel-ebpf-flow)**: Minimal XDP packet router in C and Rust with zero copy.
- **[async-uring](https://github.com/{username}/async-uring)**: Ergonomic io_uring reactor loop for concurrent systems.`,
    createSections: (custom) => {
      const tokens = { ...TEMPLATES_CONFIG[3].defaultTokens, ...(custom || {}) };
      return [
        {
          key: "intro",
          markdown: `\`\`\`bash\n$ whoami\n> ${tokens.username} // low-level kernel & async systems contributor\n$ cat /etc/os-release | grep PRETTY_NAME\n> PRETTY_NAME="Arch Linux x86_64"\n$ uptime -p\n> up 99.999% availability // deterministic algorithms only\n\`\`\`\n\n# 💻 Terminal Telemetry\n\n<div align="center">\n  <img src="https://readme-typing-svg.herokuapp.com?font=${tokens.font}&size=18&duration=3000&pause=1000&color=${tokens.accentColor}&center=true&vCenter=true&width=500&lines=Writing+high-performance+Rust+%26+C;Maintaining+open-source+systems;Deterministic+algorithms+only" alt="Terminal Typing" />\n</div>`,
          source: "user",
          enabled: true,
          order: 0,
        },
        {
          key: "skills",
          markdown: `## ⚙️ Core Toolchain\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${tokens.stack}&perline=8" alt="Low-level Tech Toolchain" />\n</div>`,
          source: "user",
          enabled: true,
          order: 1,
        },
        {
          key: "about",
          markdown: `## ⚡ Active Contributions\n- 🐧 Linux kernel and eBPF tracing: zero-overhead network filter probes.\n- 🦀 Memory-safe asynchronous networking primitives implemented in pure Rust.\n- 📟 Bare-metal firmware development for RISC-V microcontroller targets.`,
          source: "user",
          enabled: true,
          order: 2,
        },
        {
          key: "projects",
          markdown: `## 📂 Repositories\n- **[kernel-ebpf-flow](https://github.com/${tokens.username}/kernel-ebpf-flow)**: Minimal XDP packet router in C and Rust with zero copy.\n- **[async-uring](https://github.com/${tokens.username}/async-uring)**: Ergonomic io_uring reactor loop for concurrent systems.`,
          source: "user",
          enabled: true,
          order: 3,
        },
      ];
    },
  },
  {
    name: "Frontend Artisan & UI Specialist",
    slug: "frontend-artisan",
    role: "Frontend Engineer / UI Craft",
    tagline: "Lively design-centric presentation emphasizing pixel perfection, micro-animations, and clean aesthetics.",
    persona: "designer",
    theme: "pink",
    accentColor: "#f472b6",
    font: "Poppins",
    headerStyle: "wave",
    sectionOrder: ["intro", "about", "skills", "projects", "contact"],
    badgeStyle: "for-the-badge",
    isPublic: true,
    tags: ["React", "Vue", "Tailwind", "Three.js", "Figma", "CSS"],
    defaultTokens: {
      name: "Sophia Lin",
      role: "Design & Frontend Artisan",
      username: "octocat",
      accentColor: "ec4899",
      font: "Poppins",
      stack: "figma,tailwind,react,vue,sass,ts,html,css,threejs,vite",
    },
    rawMarkdown: `# Crafting Digital Experiences ✨

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color={accentColor},f97316&height=180&section=header&text={role}&fontSize=40&fontAlignY=38&desc=Where%20deliberate%20design%20meets%20scalable%20code&descAlignY=58&descSize=18&fontColor=ffffff&font={font}" width="100%" alt="{role} Header" />
</p>

## 🎨 Creative & UI Toolkit
<div align="center">
  <img src="https://skillicons.dev/icons?i={stack}&perline=10" alt="UI Tools" />
</div>

## 💡 Design & Frontend Philosophy
- **Precision:** Optical balancing, consistent spacing tokens, and calibrated visual hierarchy.
- **Fluid Motion:** 60fps GPU-composited animations with CSS transforms, GSAP, and Framer Motion.
- **Inclusive Accessibility:** Full WCAG 2.1 AA compliance with keyboard navigation and screen-reader semantics.

## 🌟 Featured UI Components
- **[motion-primitives](https://github.com/{username}/motion-primitives)**: Collection of spring physics and layout-shift animations for React.
- **[fluid-tokens](https://github.com/{username}/fluid-tokens)**: Responsive typography and fluid clamp-scale design tokens.

## 📬 Collaborate
<div align="center">
  <a href="https://dribbble.com"><img src="https://img.shields.io/badge/Dribbble-EA4C89?style=for-the-badge&logo=dribbble&logoColor=white" alt="Dribbble" /></a>
  <a href="https://figma.com"><img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" /></a>
  <a href="https://github.com/{username}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
</div>`,
    createSections: (custom) => {
      const tokens = { ...TEMPLATES_CONFIG[4].defaultTokens, ...(custom || {}) };
      return [
        {
          key: "intro",
          markdown: `# Crafting Digital Experiences ✨\n\n<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=${tokens.accentColor},f97316&height=180&section=header&text=${encodeURIComponent(tokens.role)}&fontSize=40&fontAlignY=38&desc=Where%20deliberate%20design%20meets%20scalable%20code&descAlignY=58&descSize=18&fontColor=ffffff&font=${tokens.font}" width="100%" alt="${tokens.role} Header" />\n</p>`,
          source: "user",
          enabled: true,
          order: 0,
        },
        {
          key: "skills",
          markdown: `## 🎨 Creative & UI Toolkit\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${tokens.stack}&perline=10" alt="UI Tools" />\n</div>`,
          source: "user",
          enabled: true,
          order: 1,
        },
        {
          key: "about",
          markdown: `## 💡 Design & Frontend Philosophy\n- **Precision:** Optical balancing, consistent spacing tokens, and calibrated visual hierarchy.\n- **Fluid Motion:** 60fps GPU-composited animations with CSS transforms, GSAP, and Framer Motion.\n- **Inclusive Accessibility:** Full WCAG 2.1 AA compliance with keyboard navigation and screen-reader semantics.`,
          source: "user",
          enabled: true,
          order: 2,
        },
        {
          key: "projects",
          markdown: `## 🌟 Featured UI Components\n- **[motion-primitives](https://github.com/${tokens.username}/motion-primitives)**: Collection of spring physics and layout-shift animations for React.\n- **[fluid-tokens](https://github.com/${tokens.username}/fluid-tokens)**: Responsive typography and fluid clamp-scale design tokens.`,
          source: "user",
          enabled: true,
          order: 3,
        },
        {
          key: "contact",
          markdown: `## 📬 Collaborate\n<div align="center">\n  <a href="https://dribbble.com"><img src="https://img.shields.io/badge/Dribbble-EA4C89?style=for-the-badge&logo=dribbble&logoColor=white" alt="Dribbble" /></a>\n  <a href="https://figma.com"><img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" /></a>\n  <a href="https://github.com/${tokens.username}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>\n</div>`,
          source: "user",
          enabled: true,
          order: 4,
        },
      ];
    },
  },
  {
    name: "Distributed Backend Architect",
    slug: "distributed-backend-architect",
    role: "Backend Systems Lead",
    tagline: "Designed for engineers building high-throughput microservices, event streams, and relational data layers.",
    persona: "backend",
    theme: "indigo",
    accentColor: "#818cf8",
    font: "Fira+Code",
    headerStyle: "wave",
    sectionOrder: ["intro", "about", "skills", "projects", "stats", "contact"],
    badgeStyle: "for-the-badge",
    isPublic: true,
    tags: ["Go", "Java", "PostgreSQL", "Kafka", "Redis", "gRPC"],
    defaultTokens: {
      name: "Devon Reed",
      role: "Backend Systems Architect",
      username: "octocat",
      accentColor: "6366f1",
      font: "Fira+Code",
      stack: "go,java,postgres,redis,graphql,docker,kubernetes,git,linux,kafka",
    },
    rawMarkdown: `# {name} | Distributed Systems & High Throughput ⚡

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9,{accentColor}&height=180&section=header&text={role}&fontSize=40&fontAlignY=38&desc=Reliable%2C%20concurrent%2C%20and%20fault-tolerant%20infrastructure&descAlignY=58&descSize=18&fontColor=ffffff&font={font}" width="100%" alt="{role} Header" />
</p>

## 🏛️ Engineering Tenets
- ⚡ Concurrent goroutines with zero data races and deterministic context lifecycles.
- 📡 Event-driven event sourcing with Kafka partitions and idempotent consumers.
- 🗄️ Sub-10ms p99 query latency via strict PostgreSQL indexing and Redis caching tiers.
- 🔒 gRPC microservice communication with mutual TLS and protobuf schema contracts.

## 🛠️ Data & Messaging Stack
<div align="center">
  <img src="https://skillicons.dev/icons?i={stack}&perline=10" alt="Backend Stack" />
</div>

## 🚀 Distributed Architectures
- **[stream-engine](https://github.com/{username}/stream-engine)**: Distributed log-structured streaming broker in Go with raft consensus.
- **[cache-flow](https://github.com/{username}/cache-flow)**: Lock-free multi-level eviction cache with distributed invalidation.

## 📊 Analytics
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username={username}&show_icons=true&theme=tokyonight&hide_border=true" alt="Stats" />
</div>`,
    createSections: (custom) => {
      const tokens = { ...TEMPLATES_CONFIG[5].defaultTokens, ...(custom || {}) };
      return [
        {
          key: "intro",
          markdown: `# ${tokens.name} | Distributed Systems & High Throughput ⚡\n\n<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9,${tokens.accentColor}&height=180&section=header&text=${encodeURIComponent(tokens.role)}&fontSize=40&fontAlignY=38&desc=Reliable%2C%20concurrent%2C%20and%20fault-tolerant%20infrastructure&descAlignY=58&descSize=18&fontColor=ffffff&font=${tokens.font}" width="100%" alt="${tokens.role} Header" />\n</p>`,
          source: "user",
          enabled: true,
          order: 0,
        },
        {
          key: "about",
          markdown: `## 🏛️ Engineering Tenets\n- ⚡ Concurrent goroutines with zero data races and deterministic context lifecycles.\n- 📡 Event-driven event sourcing with Kafka partitions and idempotent consumers.\n- 🗄️ Sub-10ms p99 query latency via strict PostgreSQL indexing and Redis caching tiers.\n- 🔒 gRPC microservice communication with mutual TLS and protobuf schema contracts.`,
          source: "user",
          enabled: true,
          order: 1,
        },
        {
          key: "skills",
          markdown: `## 🛠️ Data & Messaging Stack\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${tokens.stack}&perline=10" alt="Backend Stack" />\n</div>`,
          source: "user",
          enabled: true,
          order: 2,
        },
        {
          key: "projects",
          markdown: `## 🚀 Distributed Architectures\n- **[stream-engine](https://github.com/${tokens.username}/stream-engine)**: Distributed log-structured streaming broker in Go with raft consensus.\n- **[cache-flow](https://github.com/${tokens.username}/cache-flow)**: Lock-free multi-level eviction cache with distributed invalidation.`,
          source: "user",
          enabled: true,
          order: 3,
        },
        {
          key: "stats",
          markdown: `## 📊 Analytics\n<div align="center">\n  <img src="https://github-readme-stats.vercel.app/api?username=${tokens.username}&show_icons=true&theme=tokyonight&hide_border=true" alt="Stats" />\n</div>`,
          source: "user",
          enabled: true,
          order: 4,
        },
      ];
    },
  },
  {
    name: "Minimal Monospace Engineer",
    slug: "minimal-monospace",
    role: "Software Craftsman",
    tagline: "Restrained, typography-first markdown with zero gratuitous images, built for documentation purists.",
    persona: "opensource",
    theme: "mono",
    accentColor: "#e6edf3",
    font: "Fira+Code",
    headerStyle: "minimal",
    sectionOrder: ["intro", "about", "skills", "projects", "contact"],
    badgeStyle: "flat-square",
    isPublic: true,
    tags: ["TypeScript", "Python", "Go", "Git", "Markdown"],
    defaultTokens: {
      name: "Julian Thorne",
      role: "Software Craftsman",
      username: "octocat",
      accentColor: "e6edf3",
      font: "Fira+Code",
      stack: "ts,python,go,git,markdown",
    },
    rawMarkdown: `# {name}
\`{role}\` • \`systems-architect\` • \`documentation-purist\`

> Focused on clean algorithms, modular software architecture, and deterministic systems.

---

### Specializations & Principles
- **Languages:** TypeScript, Python, Go, SQL, Shell
- **Engineering Tenets:** Test-driven design, zero third-party bloat, strict semantic versioning.
- **Documentation:** Accurate specification files, schema validation, zero decorative images.

---

### Featured Repositories
- **[compiler-core](https://github.com/{username}/compiler-core):** A lightweight bytecode virtual machine and lexer written in Go.
- **[fast-cache](https://github.com/{username}/fast-cache):** In-memory zero-allocation lock-free eviction cache.
- **[spec-gen](https://github.com/{username}/spec-gen):** Deterministic markdown API reference generator.

---

### Contact & Reference
[GitHub Profile](https://github.com/{username}) • [Technical Blog](https://example.com) • [PGP Public Key](https://example.com/pgp.txt)`,
    createSections: (custom) => {
      const tokens = { ...TEMPLATES_CONFIG[6].defaultTokens, ...(custom || {}) };
      return [
        {
          key: "intro",
          markdown: `# ${tokens.name}\n\`${tokens.role}\` • \`systems-architect\` • \`documentation-purist\`\n\n> Focused on clean algorithms, modular software architecture, and deterministic systems.`,
          source: "user",
          enabled: true,
          order: 0,
        },
        {
          key: "about",
          markdown: `### Specializations & Principles\n- **Languages:** TypeScript, Python, Go, SQL, Shell\n- **Engineering Tenets:** Test-driven design, zero third-party bloat, strict semantic versioning.\n- **Documentation:** Accurate specification files, schema validation, zero decorative images.`,
          source: "user",
          enabled: true,
          order: 1,
        },
        {
          key: "projects",
          markdown: `### Featured Repositories\n- **[compiler-core](https://github.com/${tokens.username}/compiler-core):** A lightweight bytecode virtual machine and lexer written in Go.\n- **[fast-cache](https://github.com/${tokens.username}/fast-cache):** In-memory zero-allocation lock-free eviction cache.\n- **[spec-gen](https://github.com/${tokens.username}/spec-gen):** Deterministic markdown API reference generator.`,
          source: "user",
          enabled: true,
          order: 2,
        },
        {
          key: "contact",
          markdown: `### Contact & Reference\n[GitHub Profile](https://github.com/${tokens.username}) • [Technical Blog](https://example.com) • [PGP Public Key](https://example.com/pgp.txt)`,
          source: "user",
          enabled: true,
          order: 3,
        },
      ];
    },
  },
  {
    name: "Cybersecurity & Threat Analyst",
    slug: "cybersecurity-threat-analyst",
    role: "Security Researcher",
    tagline: "Tailored for penetration testers, application security engineers, and red/blue team specialists.",
    persona: "security",
    theme: "red",
    accentColor: "#f87171",
    font: "JetBrains+Mono",
    headerStyle: "wave",
    sectionOrder: ["intro", "about", "skills", "projects", "stats", "contact"],
    badgeStyle: "flat-square",
    isPublic: true,
    tags: ["Python", "Bash", "Linux", "Docker", "Git"],
    defaultTokens: {
      name: "Soren K.",
      role: "Security Researcher",
      username: "octocat",
      accentColor: "dc2626",
      font: "JetBrains+Mono",
      stack: "python,bash,linux,docker,git,postman,c,cloudflare",
    },
    rawMarkdown: `# Application Security & Vulnerability Research 🛡️

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=111827,{accentColor}&height=180&section=header&text={role}&fontSize=42&fontAlignY=38&desc=Application%20security%2C%20threat%20modeling%20%26%20hardening&descAlignY=58&descSize=18&fontColor=ffffff&font={font}" width="100%" alt="{role} Header" />
</p>

## 🔒 Security Operations & Research
- 🔍 Static & Dynamic Application Security Testing (SAST/DAST) integration in automated CI/CD.
- 🛡️ Zero-trust network topologies, IAM principle-of-least-privilege, and container hardening.
- 🐛 Responsible vulnerability disclosure, CVE reproduction, and mitigation validation.
- 🕵️ Reverse engineering protocol binaries and inspecting cryptographic primitives.

## 🛠️ Security Toolkit
<div align="center">
  <img src="https://skillicons.dev/icons?i={stack}&perline=8" alt="Security Toolkit" />
</div>

## 🛡️ Tooling & Research Repos
- **[vuln-scan-cli](https://github.com/{username}/vuln-scan-cli)**: Fast asynchronous container dependency and CVE auditor in Python.
- **[auth-fuzzer](https://github.com/{username}/auth-fuzzer)**: OAuth2 state and token exchange security verification test suite.

## 📬 Security Disclosures
<div align="center">
  <a href="https://github.com/{username}"><img src="https://img.shields.io/badge/Security_Advisories-dc2626?style=for-the-badge&logo=github&logoColor=white" alt="Advisories" /></a>
  <a href="https://keybase.io"><img src="https://img.shields.io/badge/Keybase-33A0FF?style=for-the-badge&logo=keybase&logoColor=white" alt="Keybase" /></a>
</div>`,
    createSections: (custom) => {
      const tokens = { ...TEMPLATES_CONFIG[7].defaultTokens, ...(custom || {}) };
      return [
        {
          key: "intro",
          markdown: `# Application Security & Vulnerability Research 🛡️\n\n<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=111827,${tokens.accentColor}&height=180&section=header&text=${encodeURIComponent(tokens.role)}&fontSize=42&fontAlignY=38&desc=Application%20security%2C%20threat%20modeling%20%26%20hardening&descAlignY=58&descSize=18&fontColor=ffffff&font=${tokens.font}" width="100%" alt="${tokens.role} Header" />\n</p>`,
          source: "user",
          enabled: true,
          order: 0,
        },
        {
          key: "about",
          markdown: `## 🔒 Security Operations & Research\n- 🔍 Static & Dynamic Application Security Testing (SAST/DAST) integration in automated CI/CD.\n- 🛡️ Zero-trust network topologies, IAM principle-of-least-privilege, and container hardening.\n- 🐛 Responsible vulnerability disclosure, CVE reproduction, and mitigation validation.\n- 🕵️ Reverse engineering protocol binaries and inspecting cryptographic primitives.`,
          source: "user",
          enabled: true,
          order: 1,
        },
        {
          key: "skills",
          markdown: `## 🛠️ Security Toolkit\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${tokens.stack}&perline=8" alt="Security Toolkit" />\n</div>`,
          source: "user",
          enabled: true,
          order: 2,
        },
        {
          key: "projects",
          markdown: `## 🛡️ Tooling & Research Repos\n- **[vuln-scan-cli](https://github.com/${tokens.username}/vuln-scan-cli)**: Fast asynchronous container dependency and CVE auditor in Python.\n- **[auth-fuzzer](https://github.com/${tokens.username}/auth-fuzzer)**: OAuth2 state and token exchange security verification test suite.`,
          source: "user",
          enabled: true,
          order: 3,
        },
        {
          key: "contact",
          markdown: `## 📬 Security Disclosures\n<div align="center">\n  <a href="https://github.com/${tokens.username}"><img src="https://img.shields.io/badge/Security_Advisories-dc2626?style=for-the-badge&logo=github&logoColor=white" alt="Advisories" /></a>\n  <a href="https://keybase.io"><img src="https://img.shields.io/badge/Keybase-33A0FF?style=for-the-badge&logo=keybase&logoColor=white" alt="Keybase" /></a>\n</div>`,
          source: "user",
          enabled: true,
          order: 4,
        },
      ];
    },
  },
];

// Populate previewMarkdown on every template from the single renderer
TEMPLATES_CONFIG.forEach((t) => {
  t.previewMarkdown = renderTemplateMarkdown(t);
});
