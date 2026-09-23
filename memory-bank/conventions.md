# Convenciones

## Naming

- El contrato de datos usa `snake_case`: `create_date`, `operation_type` y `business_type` — evidencia: `backend/app/routes.py`, `frontend/src/lib/financial-types.ts`.
- Los tipos Python se expresan con aliases `Literal` para operación, categoría, negocio y agrupación — evidencia: `backend/app/routes.py`.
- Las funciones y endpoints backend usan nombres descriptivos como `get_metrics_summary` y `build_top_categories` — evidencia: `backend/app/routes.py`.

## Estructura de componentes

- La entrada de React está en `frontend/src/main.tsx` y la aplicación principal en `frontend/src/App.tsx` — evidencia: `frontend/index.html`, `frontend/src/main.tsx`.
- Los componentes de dashboard están bajo `frontend/src/components/dashboard/`; los componentes UI reutilizables están bajo `frontend/src/components/ui/` — evidencia: árbol de `frontend/src/components/` y imports de `frontend/src/App.tsx`.
- Las utilidades, tipos y mock data están bajo `frontend/src/lib/` — evidencia: `frontend/src/lib/financial-utils.ts`, `frontend/src/lib/financial-types.ts`, `frontend/src/lib/mock-data.ts`.

## Rutas y respuestas

- Las rutas financieras usan el prefijo `/api/metrics` y subrutas descriptivas; `/health` es una ruta operacional — evidencia: `backend/app/routes.py`.
- Las respuestas principales declaran `response_model` con modelos Pydantic — evidencia: decoradores `@router.get(..., response_model=...)` en `backend/app/routes.py`.
- El frontend usa el proxy de Vite para las rutas relativas `/api/...` — evidencia: `frontend/vite.config.ts`, `frontend/src/App.tsx`.

## Pruebas

- El backend usa Pytest y `TestClient`; las pruebas están en `backend/tests/test_routes.py` — evidencia: `backend/requirements.txt`, `backend/tests/test_routes.py`.
- El frontend usa Vitest mediante los scripts de `frontend/package.json`; las pruebas actuales están en `frontend/src/lib/financial-utils.test.ts` — evidencia: esos archivos.

## Documentación

- El README inglés y el español documentan el stack, `docker compose up --build`, puertos y la configuración de `VITE_API_BASE_URL` — evidencia: `README.md`, `README.es.md`.
- `AGENTS.md` indica revisar `.agents/rules`, `.agents/skills` y `memory-bank` antes de actuar — evidencia: `AGENTS.md`.
- No se comprobó un estándar adicional de documentación de endpoints más allá del esquema OpenAPI generado por FastAPI — evidencia: `backend/app/main.py` y ausencia de archivos específicos de API inspeccionados.
