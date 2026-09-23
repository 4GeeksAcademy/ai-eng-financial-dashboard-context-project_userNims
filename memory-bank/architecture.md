# Arquitectura

## Frontend

- Lenguaje y framework: TypeScript con React — verificado en `frontend/package.json`, `frontend/src/main.tsx`.
- Entrada: `frontend/index.html` carga `/src/main.tsx`; `frontend/src/main.tsx` monta `App` — verificado en `frontend/index.html`, `frontend/src/main.tsx`.
- Scripts: `dev`, `build`, `lint`, `preview`, `test`, `test:watch` y `test:coverage` — verificado en `frontend/package.json`.

## Backend

- Lenguaje y framework: Python con FastAPI; Uvicorn sirve la aplicación — verificado en `backend/app/main.py`, `backend/requirements.txt`, `backend/Dockerfile`.
- Entrada: `app.main:app` — verificado en `backend/Dockerfile`, `backend/app/main.py`.
- Rutas o routers: `backend/app/main.py` incluye el router de `backend/app/routes.py`; existen `/health`, `/api/metrics`, `/api/metrics/facets`, `/api/metrics/summary`, `/api/metrics/categories/top`, `/api/metrics/comparison`, `/api/metrics/alerts`, `/api/metrics/b2b` y `/api/metrics/b2c` — verificado en `backend/app/main.py`, `backend/app/routes.py`.

## Infraestructura

- Compose/Docker: `docker-compose.yml` define los servicios `frontend` y `backend`; `frontend/Dockerfile` usa Node 24 y `backend/Dockerfile` usa Python 3.13 — verificado en `docker-compose.yml`, `frontend/Dockerfile`, `backend/Dockerfile`.
- Variables de entorno: `frontend/.env.example` existe; `frontend/src/App.tsx` lee opcionalmente `VITE_API_BASE_URL` y usa una cadena vacía por defecto. No se comprobó otra configuración de entorno — evidencia: `frontend/.env.example`, `frontend/src/App.tsx`.
- Compose publica `5173` para frontend, `8000` para backend y `5678` para debugpy — verificado en `docker-compose.yml`.

## Comunicación

- Proxy, base URL y contratos: Vite proxifica `/api` a `http://backend:8000`; el frontend solicita `/api/metrics`; el backend devuelve modelos Pydantic como `FinancialMovement` — evidencia: `frontend/vite.config.ts`, `frontend/src/App.tsx`, `backend/app/routes.py`.
- La comunicación local no requiere una variable adicional cuando se usa el proxy; un origen alternativo puede configurarse mediante `VITE_API_BASE_URL` — evidencia: `README.md`, `frontend/src/App.tsx`.
