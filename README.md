# ProofLens AI — Evidence Intelligence Platform
> **“Don't Just Trust AI. Verify It.”**  
> *Transforming AI-generated answers into evidence-backed research insights.*  
> **Hackathon Edition — IIIT Delhi 2026**

---

## 🏛️ Product Overview & Architecture

**ProofLens AI (Neural Proof)** is an AI-powered evidence verification platform. When users submit AI-generated text, research summaries, or factual claims, the system:
1. Decomposes the answer into checkable atomic propositions.
2. Retrieves ground-truth evidence across authoritative journals, public policy archives, and real-time indexed web records (via TinyFish API & live scientific corpora).
3. Evaluates claims against retrieved evidence using calibrated truth assessments (*Supported*, *Partially Supported / Overstated*, *Contradicted / Outdated*, or *Insufficient Evidence*).
4. Atomically persists audit reports, claims, evidence sources, and relationship links in **Neon Serverless PostgreSQL**.
5. Renders a comprehensive two-column forensic audit report, interactive topological **Evidence Map**, and persistent historical archive.

---

## 🗄️ Neon PostgreSQL Relational Database Architecture

The application uses **SQLAlchemy 2.x** with connection pooling (`QueuePool`, `pool_pre_ping=True`, and 5-minute connection recycling) specifically tuned for Neon's autosuspend serverless architecture, with migrations managed by **Alembic**.

```
  ┌─────────────────────────────────────────────────────────┐
  │                 verification_reports                    │
  │  (id, question, submitted_text, status, overall_verdict,│
  │   confidence_score, summary, claims_count, metadata)    │
  └───────────────────────────┬─────────────────────────────┘
                              │ 1:N (ondelete="CASCADE")
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │                        claims                           │
  │  (id, report_id, claim_index, claim_text, verdict,      │
  │   confidence_score, explanation, evidence_summary)      │
  └───────────────────────────┬─────────────────────────────┘
                              │ 1:N
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │                    claim_evidence                       │
  │  (id, claim_id, source_id, relationship, snippet,      │
  │   relevance_score, explanation, created_at)             │
  └───────────────────────────▲─────────────────────────────┘
                              │ N:1
                              │
  ┌───────────────────────────┴─────────────────────────────┐
  │                        sources                          │
  │  (id, canonical_url [UNIQUE], title, publisher,         │
  │   source_type, published_at, doi, source_content)       │
  └─────────────────────────────────────────────────────────┘
```

### Database Tables & Schema Specifications:

1. **`verification_reports`**:
   - `id`: String(64) Primary Key (e.g., `np_...` or UUID)
   - `user_id`: String(64), Nullable indexed identifier for user association
   - `question`: User's original prompt / query
   - `submitted_text`: Verbatim text submitted for verification
   - `status`: `pending`, `completed`, or `failed`
   - `overall_verdict`: `supported`, `partially_supported`, `contradicted`, or `insufficient_evidence`
   - `confidence_score`: Overall credibility score (0–100%)
   - `summary`: Concise audit explanation
   - `model_name`: Engine/model identifier
   - `claims_count` / `sources_count`: Totals analyzed
   - `processing_time_ms`: Processing latency
   - `result_metadata`: JSONB / JSON storing metrics, parameters, and telemetry
   - `created_at` / `updated_at`: Timestamps with timezone

2. **`claims`**:
   - `id`: String(64) Primary Key
   - `report_id`: Foreign Key referencing `verification_reports.id` (Cascading delete)
   - `claim_index`: Order index within submitted answer (preserves ordering)
   - `claim_text`: Extracted factual statement
   - `verdict`: `supported`, `partially_supported`, `contradicted`, or `insufficient_evidence`
   - `confidence_score`: Claim-level calibrated confidence (0–100%)
   - `explanation`: Detailed truth assessment reasoning
   - `status_label`: Human-readable status label
   - `evidence_summary`: Concise source finding

3. **`sources`**:
   - `id`: String(64) Primary Key
   - `canonical_url`: Normalized URL (`UNIQUE` index) with tracking parameter stripping (`utm_*`, `ref`, etc.) to prevent redundant records
   - `title`: Source title or journal name
   - `publisher`: Publisher or institution (e.g. *NREL, Nature, The Lancet, StudentAid.gov*)
   - `source_type`: `academic_paper`, `research_article`, or `website`
   - `published_at`: Publication date string
   - `source_content`: Verbatim quoted excerpt
   - `reliability_score`: Authority / relevance score (0.0–1.0)
   - `doi`: Permanent DOI or archive identifier

4. **`claim_evidence`**:
   - Junction table linking `claims` and `sources` (N:M relationship)
   - `relationship`: `supports`, `contradicts`, `mixed`, or `contextual`
   - `evidence_snippet`: Relevant excerpt from the source
   - `relevance_score`: Relevance metric
   - `explanation`: Explanation of evidentiary relevance

---

## 📁 Repository Structure

```
EvidenceChecking AI assistant/
├── backend/
│   ├── main.py             # FastAPI backend with Neon DB & TinyFish endpoints
│   ├── database.py         # Neon PostgreSQL engine, pooling, SSL & sessions
│   ├── models_db.py        # SQLAlchemy 2.x ORM models (Reports, Claims, Sources, Links)
│   ├── repository.py       # Atomic transactions, URL deduplication, pagination, queries
│   ├── models.py           # Pydantic schemas (DTOs & validation)
│   ├── tinyfish_service.py # TinyFish Search & Research API + fallback search
│   └── evidence_engine.py  # 5-step claim decomposition & evaluation engine
├── alembic/
│   ├── env.py              # Alembic environment supporting Neon pooled & unpooled URLs
│   ├── script.py.mako      # Migration template
│   └── versions/
│       └── 001_initial_neon_schema.py # Initial migration for 4 relational tables
├── tests/
│   └── test_database_integration.py   # 12 automated tests for DB, ORM, API, rollback
├── alembic.ini             # Alembic migration configuration
├── requirements.txt        # Python backend dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Protects secrets, *.env, *.log, caches
├── server.py               # Backend launcher (uvicorn runner)
├── index.html              # Frontend layout with Observatory, Workspace, Map & History
├── styles.css              # Editorial design system, badges, history cards, animations
├── api-service.js          # REST API connector linking frontend to FastAPI & Neon DB
├── app.js                  # Frontend coordinator, history pagination & state sync
├── constellation.js        # The Evidence Map (topological canvas graph)
├── hero-3d.js              # The Evidence Observatory (Three.js 3D lens)
├── demo-data.js            # Curated benchmarks (Scholarship Deadline, Solar Impact, etc.)
├── types.ts                # TypeScript interface definitions
└── README.md               # Complete documentation
```

---

## ⚡ Setting Up Neon PostgreSQL

### 1. Create a Neon Project
1. Visit [neon.tech](https://neon.tech) and sign in.
2. Click **Create Project** (e.g., name it `evidence-checking-assistant`).
3. Select your preferred region (e.g., `AWS us-east-2`).

### 2. Obtain Connection Strings
In the Neon Console **Dashboard**:
* **Pooled Connection (`DATABASE_URL`):**
  Select **Connection pooling** toggle `ON`.
  ```
  postgresql://neondb_owner:YOUR_PASSWORD@ep-proud-flower-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
  ```
* **Direct Connection (`DATABASE_URL_UNPOOLED`):**
  Select **Connection pooling** toggle `OFF`.
  ```
  postgresql://neondb_owner:YOUR_PASSWORD@ep-proud-flower-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
  ```

### 3. Configure Local Environment Variables
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```
Edit `.env` and paste your actual Neon connection strings:
```ini
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
TINYFISH_API_KEY=sk-tinyfish-your_key_here
PORT=8000
```
*(Note: `.env` is ignored by git to protect credentials.)*

---

## 🚀 Installation & Migrations

### 1. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 2. Run Database Migrations (Alembic)
Apply the initial schema to create the tables in Neon PostgreSQL:
```powershell
alembic upgrade head
```
To check current revision:
```powershell
alembic current
```

---

## 🏃 Running the Application

### Step 1: Start the FastAPI Backend (Port 8000)
```powershell
python server.py
```
* **Application Web UI:** [http://localhost:8000](http://localhost:8000)
* **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Database Health Check:** [http://localhost:8000/api/health/db](http://localhost:8000/api/health/db)
* **System Health:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

### Step 2: (Optional) Dedicated Static Web Server (Port 3000)
```powershell
python -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Comprehensive backend, TinyFish, and Neon DB status |
| `GET` | `/api/health/db` | Dedicated safe database connectivity check (no credentials leaked) |
| `POST` | `/api/verification/analyze` | Analyzes claims and **atomically saves** report to Neon DB |
| `GET` | `/api/reports` | Returns paginated verification audits (newest first) from Neon DB |
| `GET` | `/api/reports/{id}` | Retrieves full audit report by ID with claims and evidence |
| `DELETE` | `/api/reports/{id}` | Deletes audit report with cascading removal of claims/evidence |
| `POST` | `/api/verification/extract-claims` | Splits input into atomic checkable claims |
| `POST` | `/api/verification/search-evidence` | Queries TinyFish / live sources for ground-truth evidence |
| `GET` | `/api/presets` | Demonstrations (Scholarship Deadline, Solar Impact, CRISPR) |

---

## 🧪 Automated Testing

Run the test suite:
```powershell
python -m pytest tests/test_database_integration.py -v
```

All 12 automated tests validate:
- URL normalization (`postgres://` -> `postgresql://`)
- Safe credential masking (no password leaks)
- URL canonicalization & query parameter stripping
- Verdict mapping & status normalization
- Relational cascading deletion
- Atomic transactional persistence
- Transaction rollback on failure (zero partial records)
- History pagination and newest-first ordering
- Database health check endpoints
- Full verification analysis and retrieval workflow
- 404 handling on missing report IDs
- Dependency injection override testing

---

## 👥 Hackathon Team (HACKIIITD 2026)
* **Rahul Yadav**
* **Siddharth Jaiswal**
* **Suman Kumar Jha**
