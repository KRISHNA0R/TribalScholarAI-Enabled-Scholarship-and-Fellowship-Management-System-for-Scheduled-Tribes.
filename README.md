<div align="center">

<img src="client/public/logotri.png" alt="TribalScholar AI logo" width="140" />

# TribalScholar AI

### ✨ *Every Tribal scholar — from eligibility to empowerment — verified, transparent, and in their own language.*

**AI-Enabled Scholarship & Fellowship Management System for Scheduled Tribes**
**Ministry of Tribal Affairs, Government of India**

> **SIH 2026  ·  Problem Statement `PS 26239`**  ·  Theme: *Smart Education*

<img src="client/public/banner.jpg" alt="TribalScholar AI — scholarship, verification and disbursement for Scheduled Tribes" width="100%" />

[![CI](https://github.com/KRISHNA0R/TribalScholarAI-Enabled-Scholarship-and-Fellowship-Management-System-for-Scheduled-Tribes/actions/workflows/ci.yml/badge.svg)](https://github.com/KRISHNA0R/TribalScholarAI-Enabled-Scholarship-and-Fellowship-Management-System-for-Scheduled-Tribes/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/Node-20-3FA512?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-16A34A.svg)](LICENSE)

**Languages:** `English` · `हिन्दी` · `বাংলা` · `ᱥᱟᱱᱛᱟᱲᱤ (Santali / Ol Chiki)`

`664 translation keys` · `13 namespaces` · `4 languages` · `full key parity enforced in CI`

### 🎬 Prototype Walkthrough

[![TribalScholar AI — prototype walkthrough](https://img.youtube.com/vi/fJboODcPgho/maxresdefault.jpg)](https://youtu.be/fJboODcPgho)

**▶ Watch on YouTube** → https://youtu.be/fJboODcPgho

*A 2-minute guided tour: login → AI scheme finder → 10-step application → document upload and
integrity verification → officer scrutiny → selection → DBT disbursement → multilingual support.*

</div>

---

<div align="center">

### 🌿 Mission

> *"The Ministry of Tribal Affairs exists for the integrated socio-economic development of the
> Scheduled Tribes — and education is its strongest instrument."*
> — Ministry of Tribal Affairs, Government of India

**TribalScholar AI puts that intent into software.** One platform carries a tribal student from
*discovering a scheme* → *submitting an application in their own language* → *getting documents
genuinely verified* → *being selected on transparent merit* → *receiving money in their Aadhaar-seeded
DBT account*. Every step is logged, every AI suggestion is human-reviewed, and nothing is approved by a
black box.

</div>

---

## 📌 What It Is

TribalScholar AI is a full-stack **scholarship lifecycle management platform** for Scheduled Tribe
students — from scheme discovery and application, through AI-assisted document verification and
officer scrutiny, to committee selection and Direct Benefit Transfer (DBT) disbursement.

It is built to mirror the real Ministry of Tribal Affairs workflow (Pre-Matric, Post-Matric, Top Class
Education, NFST Fellowship, National Overseas Scholarship) with an audit-grade, human-in-the-loop
verification model.

---

## 🧰 Tech Stack

### Frontend — `client/`

| Layer | Technology | Purpose |
|---|---|---|
| UI runtime | **React 18** + **React Router 6** | Component model & SPA routing |
| Build | **Vite 5** | Instant dev server, optimised production bundling |
| Styling | **Tailwind CSS 3** + design tokens | Forest-green / saffron tribal design system |
| State | React Context (`AccessibilityContext`) | Language, contrast mode, font scale |
| HTTP | **Axios** | Centralised client with JWT interceptor |
| Charts | **Recharts 2** | Analytics & disbursement dashboards |
| Icons | **Lucide React** | Consistent, accessible iconography |
| i18n | Custom `import.meta.glob` loader | 4 languages, per-namespace lazy discovery |
| Fonts | Plus Jakarta Sans + **Noto Sans Ol Chiki / Devanagari / Bengali** | Latin + Indic + tribal script coverage |

### Backend — `server/`

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | **Node.js 18+**, ES Modules | Single modern module system |
| API | **Express 4** | 12 RESTful route modules |
| Database | **MongoDB 8** via **Mongoose 8** | 14 indexed schemas |
| Auth | **JWT** (`jsonwebtoken`) + **bcryptjs** | Stateless role-based sessions |
| Security | **Helmet**, **CORS**, **express-rate-limit**, **express-validator** | Hardened perimeter |
| Uploads | **Multer** + magic-byte verification | Genuine file-signature validation |
| Logging | **Morgan** (dev) / structured `AuditLog` collection | Immutable trail |
| Runtime target | Node process **or** Vercel serverless function | Deploy-anywhere |

### Platform

| Concern | Solution |
|---|---|
| CI/CD | **GitHub Actions** — syntax check, i18n parity, integrity tests, client build |
| Hosting | **Vercel** — `vercel.json` with static SPA + `/api/*` serverless function |
| Database (cloud) | **MongoDB Atlas** (SRV) |
| Verification scripts | `npm run verify` — 14 integrity tests + 4-language key parity gate |

---

## 🏗️ Architecture

```
TribalScholarAI/
├── api/
│   ├── index.js            # Vercel serverless entry (no app.listen)
│   └── [...path].js        # catch-all so /api/* reaches Express unchanged
├── client/
│   ├── public/             # logotri.png (brand), banner.jpg (hero)
│   └── src/
│       ├── components/     # Header, Footer, shared UI
│       ├── context/        # AccessibilityContext (lang, contrast, font)
│       ├── i18n/
│       │   ├── index.js    # LANGUAGES + makeTranslator + glob loader
│       │   └── locales/    # en · hi · bn · sat  (13 namespaces, 664 keys)
│       ├── pages/          # Landing, Login, Register, Applicant Dashboard,
│       │                   # 10-step Wizard, Application Detail, Document Vault,
│       │                   # Scheme Catalog, Rule Builder, Analytics, Demo Hub…
│       └── services/api.js # Axios instance + JWT interceptor
├── server/
│   ├── app.js              # Express app factory (shared by both entrypoints)
│   ├── server.js           # Local / VPS entrypoint
│   ├── config/             # db.js, ensureDB.js, paths.js
│   ├── controllers/        # Business logic
│   ├── middleware/         # auth, upload, role, errors
│   ├── models/             # 14 Mongoose schemas
│   ├── routes/             # 12 route modules
│   ├── seed/               # Demo data + 5 official MoTA schemes
│   └── services/
│       ├── fileIntegrityService.js   # magic bytes · SHA-256 · structure parse
│       └── ai/                       # OCR · classification · anomaly detection
├── scripts/                # verify-i18n.mjs · verify-file-integrity.mjs
├── vercel.json
└── .github/workflows/ci.yml
```

**Request flow:** `Browser → Vercel Edge → /api/* serverless fn → Express → Mongoose → MongoDB Atlas`
and `Browser → client/dist static assets` (same origin, no CORS in production).

---

## 🔐 Real Document Verification

Document "authentication" is implemented as a **real integrity layer**, not a UI claim.
`server/services/fileIntegrityService.js` inspects actual file bytes:

| Check | What it proves | On failure |
|---|---|---|
| `FILE_NON_EMPTY` | Bytes were received | **Reject 400** |
| `SIGNATURE_MATCH` | Magic bytes match the claimed extension/MIME (catches renamed `.txt`/`.exe`/`.svg`) | **Reject 400** |
| `STRUCTURE_PARSE` | PNG IHDR / JPEG SOF / PDF header + page count parse — catches truncation & corruption | **Reject 400** |
| `READABILITY` | Smallest side ≥ 200px — OCR quality advisory | Flag for manual review |
| `SHA-256` | Hash computed over **file bytes** (not the filename) → duplicate & re-use detection | `DUPLICATE_HASH` anomaly flag |
| `CROSS_CHECK` | Certificate number, issuing authority, extracted income vs. the applicant's own profile | `*_MISMATCH` AI flags |

Rejected files are deleted, **no database record is created**, and a `DOCUMENT_REJECTED` event is
written to the immutable audit log.

> **Honest boundary.** These checks are genuine file-level forensics. They do **not** attest that a
> Ministry/State authority actually issued the document — that requires DigiLocker or issuer-side
> API credentials, which this deployment does not hold. Issuer attestation therefore remains an
> explicit human-officer step in the scrutiny module, and the UI says so.

Run the regression suite any time:

```bash
npm run verify:integrity
```

---

## 🌍 Multilingual by Design

A centralised i18n system, not scattered string swaps.

- **4 languages**, 13 namespaces, **664 keys each** — verified at full parity in CI.
- Auto-discovery via `import.meta.glob('./locales/*/*.js')` — adding a language is dropping in a folder.
- English fallback per key, so a missing translation degrades gracefully instead of blanking the UI.
- Choice persists in `localStorage` (`tribalscholar_lang`) across refresh and login, and drives
  `<html lang>` for correct screen-reader pronunciation.
- **Santali (`sat`)** renders in the native **Ol Chiki** script, bundled via Noto Sans Ol Chiki.

```bash
npm run verify:i18n
```

---

## 🚀 Quick Start (Local)

```bash
git clone https://github.com/KRISHNA0R/TribalScholarAI-Enabled-Scholarship-and-Fellowship-Management-System-for-Scheduled-Tribes..git
cd TribalScholarAI

npm run install:all          # root + server + client
cp .env.example server/.env  # then edit MONGO_URI and JWT_SECRET

# terminal 1 — MongoDB must be running first
npm run server               # http://localhost:5000

# terminal 2
npm run client               # http://localhost:5173
```

Seed demo data (5 official MoTA schemes, 6 role accounts, applications, audit history):

```bash
npm run seed
```

### Demo accounts — password `Demo@123`

| Role | Email |
|---|---|
| Applicant | `applicant@demo.com` |
| Verification Officer | `verifier@demo.com` |
| Scrutiny Committee | `scrutiny@demo.com` |
| Selection Committee | `committee@demo.com` |
| Finance / DBT | `finance@demo.com` |
| Administrator | `admin@demo.com` |

---

## ☁️ Deploy to Vercel

The repository is **deployment-ready** — `vercel.json` is committed.

1. **Push** the repo (done) and import it at [vercel.com/new](https://vercel.com/new).
2. Vercel auto-detects: `outputDirectory = client/dist`, function at `api/index.js`.
3. Add **Environment Variables** (Settings → Environment Variables):

   | Key | Value |
   |---|---|
   | `MONGO_URI` | `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/tribal_scholar_ai` |
   | `JWT_SECRET` | 96+ random hex characters |
   | `CLIENT_URL` | `https://<your-app>.vercel.app` |
   | `NODE_ENV` | `production` |
   | `AI_MODE` / `OCR_MODE` | `demo` |

4. In **MongoDB Atlas** → *Network Access*, allow Vercel's outgoing IPs (`0.0.0.0/0` for a public demo).
5. **Deploy.** Run `npm run seed` once locally against the Atlas URI to load schemes and demo data.

Verify with `https://<your-app>.vercel.app/api/health`.

> **Serverless note:** uploaded file bytes land in an ephemeral `/tmp` (the Vercel filesystem is
> read-only). All document *records*, hashes, verification results and audit entries persist in
> MongoDB, which is what the platform reads. For durable binary storage, swap Multer's disk storage
> for S3/Vercel Blob — the integrity service is storage-agnostic because it hashes the byte stream.

---

## ✅ Quality Gates

```bash
npm run verify     # integrity tests (14) + i18n parity (664 keys × 4 languages)
npm run build      # production client bundle
```

CI runs both on every push and publishes `client/dist` as a build artifact.

---

## 🎨 Design System

Deep forest-green primary, saffron accent, cream surfaces — a tribal identity that stays
professional rather than ornamental. Subtle motif work (`.tribal-divider`, `.tribal-texture`,
`.tribal-corners`), 40px minimum touch targets, visible `focus-visible` outlines, and a real
**Dark / Light mode** where dark mode forces pure-white text for contrast.

### 🖼️ Brand Assets

Both assets are committed in the repo and used everywhere — navbar, login, register, landing,
footer, favicon, and this README.

| Asset | Path | Size | Used as |
|---|---|---|---|
| **Logo** | [`client/public/logotri.png`](client/public/logotri.png) | 512 × 512 · 246 KB | Navbar, Login, Register, Landing, Footer, favicon, apple-touch-icon |
| **Hero banner** | [`client/public/banner.jpg`](client/public/banner.jpg) | 1920 × 706 · 237 KB | Landing hero (15% opacity + vignette), scheme showcase grid, README header |

Referenced from code as `/logotri.png` and `/banner.jpg` (Vite serves everything in
`client/public/` at the site root in both dev and production builds).

---

## 📜 Data Provenance

Scheme rules, income ceilings and benefit amounts are aligned to official MoTA publications:

- <https://tribal.nic.in/Scholarship.aspx>
- <https://tribal.nic.in/ScholarshiP.aspx>
- <https://dbttribal.gov.in/AllScheme.aspx>
- [MoTA Post-Matric ST Scholarship Guidelines (PDF)](https://tribal.nic.in/downloads/guidelines/post-matric/EDUPostMatricScholarshipPMSforSTstudents230513.pdf)

Each scheme record stores its own `officialUrl`, `officialSource` and `guidelinesVerifiedOn`, and the
UI surfaces a direct "Official Source" link. Figures such as the ₹2,50,000 income ceiling for Pre/Post-Matric
match the published guidelines.

---

## 👤 Author

**Krishna R** — <vloggermr797@gmail.com>

---

## 📄 License

MIT © TribalScholar AI
