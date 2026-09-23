# Financial Metrics Dashboard

<!-- hide -->

By [@marcogonzalo](https://github.com/marcogonzalo) and [other contributors](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project/graphs/contributors) at [4Geeks Academy](https://4geeksacademy.com/)

[![build by developers](https://img.shields.io/badge/build_by-Developers-blue)](https://4geeks.com)
[![4Geeks Academy](https://img.shields.io/twitter/follow/4geeksacademy?style=social&logo=x)](https://x.com/4geeksacademy)

_Estas instrucciones están [disponibles en español](./README.es.md)._

**Before you start**: 📗 [Read the instructions](https://4geeks.com/lesson/how-to-start-a-project) on how to start a coding project.

<!-- endhide -->

---

_Financial metrics dashboard with a React + TypeScript frontend and a FastAPI backend._

## Tech stack

| Layer | Technology | Version | Role in the project |
|---|---|---|---|
| **Runtime (frontend)** | Node.js | 24 | Runs Vite, npm and the React dev server. Fixed by `frontend/Dockerfile`. |
| **Runtime (backend)** | Python | 3.13 | Runs the FastAPI server. Fixed by `backend/Dockerfile`. |
| **Frontend framework** | React | ^19.2.4 | Renders the dashboard UI and manages component state (`src/App.tsx`). |
| **Language** | TypeScript | ~6.0.2 | Adds static types to the frontend; compiles to ES2023 (`tsconfig.app.json`). |
| **Bundler / Dev server** | Vite | ^8.0.4 | Builds and serves the SPA; proxies `/api` to the backend (`vite.config.ts`). |
| **CSS framework** | Tailwind CSS | ^4.2.2 | Utility-first styling via the `@tailwindcss/vite` plugin (`src/index.css`). |
| **Charting** | Recharts | ^3.8.1 | Renders income/outcome and profit charts in `src/components/dashboard/`. |
| **API framework** | FastAPI | * | Defines REST endpoints and Pydantic models (`backend/app/main.py`, `routes.py`). |
| **ASGI server** | Uvicorn | * | Serves the FastAPI app; launched via debugpy for remote debugging (`Dockerfile`). |
| **Validation** | Pydantic | * | Data models and query parameter validation (bundled with FastAPI). |
| **Testing (frontend)** | Vitest | ^4.1.4 | Unit tests with V8 coverage (`npm run test`). |
| **Testing (backend)** | Pytest | * | Python tests; see `backend/tests/`. |
| **Linting** | ESLint | ^9.39.4 | Static analysis for TS/TSX with react-hooks and react-refresh plugins (`eslint.config.js`). |
| **Utility CSS helpers** | clsx, tailwind-merge, CVA | ^2.1.1 / ^3.5.0 / ^0.7.1 | Conditional class merging in UI components (`components/ui/card.tsx`). |
| **Icons** | Lucide React | ^1.8.0 | Icon library used across dashboard components. |
| **HTTP client (tests)** | httpx | * | Used in backend tests (`backend/requirements.txt`). |

> \* These dependencies are listed in `backend/requirements.txt` without pinned versions. Run `pip install` to resolve the latest compatible release.

## Recommended steps

1. Fork this repository to your account.
2. Open your fork in GitHub Codespaces or clone it and run it in your local environment.
3. Run your AI agent to inspect both frontend and backend.
4. Document the proposed rules and memory bank in your fork.
5. Refine and validate the rules until they fit the project's real workflow.

## Expected agents directory structure

```text
./.agents
└─ /rules
   └─ <rule-name>.md
└─ /skills
   └─ /<skill-name>
      └─ /SKILL.md
```

## How to run locally

```bash
docker compose up --build
```

The frontend uses the Vite proxy for `/api` by default, so no extra environment variables are required in local development or Codespaces.
If you need to target a different backend origin, copy `frontend/.env.example` to `.env` and set `VITE_API_BASE_URL`.

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API documentation: http://localhost:8000/docs

---

This and many other projects are built by students as part of the [Career Programs](https://4geeksacademy.com/compare-programs) at [4Geeks Academy](https://4geeksacademy.com). By [@marcogonzalo](https://github.com/marcogonzalo) and [other contributors](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project/graphs/contributors). Find out more about [AI Engineering](https://4geeksacademy.com/en/coding-bootcamps/ai-engineering), [Data Science & Machine Learning](https://4geeksacademy.com/en/coding-bootcamps/data-science-ml), [Cybersecurity](https://4geeksacademy.com/en/coding-bootcamps/cybersecurity) and [Full-Stack Software Developer with AI](https://4geeksacademy.com/en/coding-bootcamps/full-stack-developer).
