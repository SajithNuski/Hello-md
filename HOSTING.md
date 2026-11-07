# Production Hosting & Deployment Guide — Hello-md

This guide provides end-to-end instructions for deploying **Hello-md** to production.

---

## 1. Architecture & Hosting Requirements

| Component | Recommended Solution | Notes |
| :--- | :--- | :--- |
| **App & API Server** | **Vercel** *(Recommended)* or **Docker / Node VPS** | Next.js 14 App Router with Server-Sent Events (SSE) streaming |
| **Database** | **MongoDB Atlas** (Free Tier M0+) | Stores user accounts, README drafts, rate-limiting quotas, and LLM caches |
| **Authentication** | **GitHub OAuth App** | Scopes: `read:user`, `public_repo` |
| **Fact Ingestion** | **GitHub Personal Access Token (PAT)** | Higher rate limits (5,000 req/hr) for public fact queries |
| **AI Inference** | **Groq Cloud** (Primary) + **Google Gemini** (Fallback) | Token-efficient JSON completions |

> [!IMPORTANT]
> **Serverless & Streaming Requirement**: The README generation endpoint (`/api/readmes`) streams live progress via Server-Sent Events (`ReadableStream`). Reverse proxies (such as Nginx or Cloudflare) must have **proxy buffering disabled** (`X-Accel-Buffering: no`).

---

## 2. Pre-Deployment Credentials & Keys

Collect the following environment variables before initiating deployment:

### A. Generate Cryptographic Secrets
Run the following in your terminal to generate secure random keys:

```bash
# 1. NextAuth Session Secret (Minimum 32 characters)
openssl rand -base64 32

# 2. Token Encryption Key (32-byte Base64 key for AES-256-GCM token storage)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### B. MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an **M0 (Free)** cluster.
2. In **Database Access**, create a database user with read/write permissions.
3. In **Network Access**, add an IP access entry:
   - For **Vercel / Serverless**: Allow access from anywhere (`0.0.0.0/0`).
   - For **Dedicated VPS**: Add your server's static public IP.
4. Click **Connect** > **Drivers** > **Node.js** and copy your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hellomd?retryWrites=true&w=majority
   ```

### C. Create a GitHub OAuth App
1. Go to your GitHub account: **Settings** > **Developer Settings** > **OAuth Apps** > **New OAuth App**.
2. Fill out the application details:
   - **Application name:** `Hello-md`
   - **Homepage URL:** `https://your-domain.com` (or your temporary Vercel URL)
   - **Authorization callback URL:**
     ```
     https://your-domain.com/api/auth/callback/github
     ```
3. Click **Register application**.
4. Copy the **Client ID** (`GITHUB_ID`).
5. Click **Generate a new client secret** and copy the **Client Secret** (`GITHUB_SECRET`).

### D. GitHub Server Token (Read-Only Fact Ingestion)
To prevent hitting anonymous GitHub GraphQL rate limits (60 req/hr), generate a read-only token:
1. Go to **Settings** > **Developer Settings** > **Personal access tokens** > **Fine-grained tokens** (or Tokens Classic).
2. Generate a token with public read access (no special permissions required).
3. Assign it to `GITHUB_SERVER_TOKEN`.

### E. AI Inference API Keys
- **Groq:** Sign up at [Groq Console](https://console.groq.com/keys) and generate an API key (`GROQ_API_KEY`).
- **Google Gemini:** Sign up at [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key (`GEMINI_API_KEY`).

---

## 3. Environment Variables Reference

Here is the complete production environment variable specification:

```env
# Runtime
NODE_ENV=production

# Public Base URL (Required for NextAuth callbacks)
NEXTAUTH_URL=https://your-domain.com

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/hellomd?retryWrites=true&w=majority

# NextAuth & Encryption
AUTH_SECRET=your_generated_32_byte_base64_secret_here
TOKEN_ENC_KEY=your_generated_32_byte_base64_encryption_key_here

# GitHub OAuth
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret

# GitHub API Server Token (Optional, highly recommended for rate-limit protection)
GITHUB_SERVER_TOKEN=ghp_yourPersonalAccessTokenHere

# Primary AI Provider (Groq)
GROQ_API_KEY=gsk_yourGroqApiKeyHere
GROQ_MODELS=openai/gpt-oss-120b,openai/gpt-oss-20b,qwen/qwen3.8-27b

# Fallback AI Provider (Google Gemini)
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
GEMINI_MODEL=gemini-3.8-flash

# Quotas & Limits
DAILY_GENERATIONS=3
AI_TIMEOUT_MS=20000
```

---

## 4. Option A: Deploy to Vercel (Recommended)

Vercel provides native Next.js App Router support, automatic SSL, edge caching, and seamless SSE streaming out of the box.

### Step 1: Push Code to GitHub
Ensure all your changes are committed and pushed to your remote GitHub repository:
```bash
git add .
git commit -m "feat: ready for production hosting"
git push origin main
```

### Step 2: Import Project into Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** > **Project**.
3. Select your GitHub repository (`Hello-md`) and click **Import**.

### Step 3: Configure Environment Variables
In the **Environment Variables** section on Vercel, add each variable listed in Section 3:
- `NEXTAUTH_URL` = `https://your-project.vercel.app` (update when custom domain is attached)
- `AUTH_SECRET`
- `TOKEN_ENC_KEY`
- `MONGODB_URI`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GITHUB_SERVER_TOKEN`
- `GROQ_API_KEY`
- `GEMINI_API_KEY`

### Step 4: Deploy
1. Click **Deploy**.
2. Once deployed, run the database index initialization script (see Section 6).
3. If using a custom domain, add it under **Project Settings** > **Domains**, and update:
   - `NEXTAUTH_URL` in Vercel Environment Variables.
   - **Authorization callback URL** in your GitHub OAuth App settings.

---

## 5. Option B: Deploy with Docker / VPS

For self-hosting on Ubuntu, Debian, AWS EC2, or DigitalOcean:

### Step 1: Production Dockerfile
Create a `Dockerfile` in the root of the project:

```dockerfile
# 1. Base Image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# 2. Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# 4. Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["npm", "run", "start"]
```

### Step 2: Build and Run Container
```bash
# Build Docker image
docker build -t hello-md:latest .

# Run Docker container with environment file
docker run -d \
  --name hello-md \
  -p 3000:3000 \
  --env-file .env.production \
  --restart always \
  hello-md:latest
```

### Step 3: Nginx Reverse Proxy Configuration (Crucial for SSE Streaming)
When placing Nginx in front of Next.js, configure `proxy_buffering off` to allow SSE streaming chunks to pass through without buffering:

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Disable buffering for live Server-Sent Events (SSE)
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    listen 443 ssl;
    # SSL cert configuration (e.g. Certbot)
}
```

---

## 6. Database Initialization (Indexes & TTLs)

After connecting to your production MongoDB Atlas cluster, run the index creation script once to configure unique constraints and automatic TTL expirations:

```bash
# Run locally pointing to your production MongoDB cluster:
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/hellomd?retryWrites=true&w=majority" npm run db:indexes
```

**Collections and Indexes created:**
- `users`: `{ githubId: 1 }` (unique)
- `githubFacts`: `{ login: 1 }` (unique), `{ fetchedAt: 1 }` (TTL: 1 hour)
- `readmes`: `{ ownerId: 1, updatedAt: -1 }`
- `llmCache`: `{ key: 1 }` (unique), `{ createdAt: 1 }` (TTL: 7 days)
- `usage`: `{ subjectId: 1, day: 1 }` (unique), `{ createdAt: 1 }` (TTL: 2 days)
- `providerState`: `{ provider: 1, model: 1 }` (unique)

---

## 7. Post-Deployment Verification Checklist

Verify that all subsystems operate correctly in production:

1. **Telemetry & Quota Check:**
   - Open `https://your-domain.com/api/usage`.
   - Verify it returns HTTP 200 with `remaining: 3` and `limit: 3`.
2. **Landing Page & Tone Selection:**
   - Open `https://your-domain.com/` and confirm the UI renders cleanly without styling or font glitches.
3. **SSE Streaming & Generation:**
   - Enter a public GitHub username (e.g. `torvalds`) and click **Generate README**.
   - Confirm all 3 stages execute:
     - 1. Fetch Data (Facts ingested from GitHub)
     - 2. Generation (AI prose written)
     - 3. Assembly (Deterministic markdown formatted)
   - Confirm automatic redirection to `/editor/[id]`.
4. **Editor & Live Preview:**
   - Verify the CodeMirror editor updates the markdown preview in real-time.
5. **GitHub OAuth & Direct Repo Commit:**
   - Click **Sign in with GitHub**. Confirm authorization redirects back with an unmetered session.
   - Click **Export** > **Push to GitHub** to test direct repository commits.
6. **Bring Your Own Key (BYOK):**
   - Click the **BYOK** button in the header, input a Groq or Gemini API key, and confirm that the quota pill changes to `Unmetered (BYOK)`.

---

## 8. Common Troubleshooting

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| **NextAuth Callback Error / Redirect Loop** | `NEXTAUTH_URL` or GitHub OAuth callback mismatch | Ensure `NEXTAUTH_URL` matches your exact production HTTPS domain, and the GitHub OAuth App callback URL ends with `/api/auth/callback/github`. |
| **Streaming Stepper Hangs / No Real-Time Logs** | Proxy buffering SSE responses | Ensure reverse proxy has `proxy_buffering off` and response headers include `X-Accel-Buffering: no`. |
| **MongoDB Connection Timeout** | Atlas Network Access IP Whitelist blocking traffic | In MongoDB Atlas Network Access, ensure `0.0.0.0/0` is whitelisted for Vercel/serverless environments. |
| **GitHub Fact Ingestion 403 / 429** | Anonymous IP rate limit exhausted on GitHub | Set `GITHUB_SERVER_TOKEN` in environment variables with a personal access token. |
| **AI Busy / Cooldown Triggered** | Provider rate limit exceeded on free tier | Configure both `GROQ_API_KEY` and `GEMINI_API_KEY` so automatic fallback is active. |

