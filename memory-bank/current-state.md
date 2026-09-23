# Estado actual

## Ejecución correcta

- `docker compose config` terminó correctamente y mostró los servicios `frontend` y `backend` — evidencia: comando ejecutado contra `docker-compose.yml`.
- `docker compose up --build` construyó las imágenes de ambos servicios — evidencia: `frontend/Dockerfile`, `backend/Dockerfile`, `docker-compose.yml` y logs de Compose.
- Los logs confirmaron que Uvicorn alcanzó `Application startup complete` y Vite quedó listo en `5173` — evidencia: logs de Compose.

## Pruebas pasadas

- Backend: `docker compose run --rm backend pytest tests` — 15 pruebas pasaron, con 2 warnings de deprecación de Starlette/AnyIO — evidencia: `backend/tests/test_routes.py`.
- Frontend: `docker compose run --rm frontend npm run test` — 5 pruebas pasaron — evidencia: `frontend/src/lib/financial-utils.test.ts`.
- Frontend lint: `docker compose run --rm frontend npm run lint` terminó sin errores — evidencia: `frontend/package.json`, `frontend/eslint.config.js`.
- Frontend build: `docker compose run --rm frontend npm run build` terminó correctamente; Vite emitió una advertencia de chunk mayor de 500 kB — evidencia: `frontend/package.json`, `frontend/vite.config.ts`.
- Validación de configuración: `docker compose config` terminó correctamente — evidencia: `docker-compose.yml`.

## Gaps observados

- No hay `healthcheck` en `docker-compose.yml`; `depends_on` solo expresa que el backend se inicia antes — evidencia: `docker-compose.yml`.
- No hay pruebas frontend para `App`, `fetchFinancialData` ni estados loading/success/error; las pruebas actuales cubren utilidades puras — evidencia: `frontend/src/App.tsx`, `frontend/src/lib/financial-utils.test.ts`.
- No hay pruebas para fechas invertidas, parámetros inválidos o respuestas vacías en backend — evidencia: `backend/tests/test_routes.py`.
- El periodo mostrado está fijado en `2024 - Full Year`/`2024 — Full Year`, aunque el backend genera fechas relativas a `date.today()` — evidencia: `frontend/src/App.tsx`, `frontend/src/components/dashboard/dashboard-header.tsx`, `backend/app/routes.py`.

## Riesgos pendientes

- CORS permite cualquier origen, método y cabecera junto con credenciales — evidencia: `backend/app/main.py`.
- Debugpy se escucha en `0.0.0.0:5678`, se publica el puerto `5678` y Uvicorn usa `--reload` — evidencia: `backend/Dockerfile`, `docker-compose.yml`.
- Las dependencias backend no están fijadas y el Dockerfile frontend usa `npm install` pese a existir `frontend/package-lock.json` — evidencia: `backend/requirements.txt`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/package-lock.json`.
- La inicialización puede producir solicitudes frontend antes de que el backend esté listo porque no existe una condición de salud en Compose — evidencia: `docker-compose.yml`, `backend/app/routes.py`.

## Prioridades futuras derivadas de evidencia

- Añadir un `healthcheck` Compose basado en `/health` y una dependencia del frontend condicionada a backend saludable — deriva del gap observable en `docker-compose.yml`.
- Cubrir estados de `App` y validaciones de parámetros con pruebas — deriva de la cobertura ausente observada en `frontend/src/App.tsx` y `backend/tests/test_routes.py`.
- Separar configuración de desarrollo y producción para debugpy, `--reload` y CORS — deriva de la exposición observable en `backend/app/main.py`, `backend/Dockerfile` y `docker-compose.yml`.
- Usar instalaciones reproducibles: `npm ci` con `frontend/package-lock.json` y versiones fijadas o lock para Python — deriva de `frontend/Dockerfile` y `backend/requirements.txt`.
- Resolver la discrepancia entre el periodo literal de la UI y las fechas relativas de la API — deriva de `frontend/src/App.tsx`, `frontend/src/components/dashboard/dashboard-header.tsx` y `backend/app/routes.py`.
