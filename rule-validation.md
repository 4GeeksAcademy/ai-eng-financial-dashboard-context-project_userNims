# Validación de reglas

## Regla
- Archivo: `.agents/rules/frontend-conventions.md`
- Tarea usada: Ejecutar el build y las pruebas del frontend; comprobar con datos de prueba que el periodo se calcula desde `movements[].create_date` y que las claves `create_date`, `operation_type` y `business_type` se conservan.

## Resultado
- Comportamiento esperado: la propuesta usa `frontend/src/App.tsx`, `frontend/src/lib/financial-utils.ts` y `frontend/src/lib/financial-types.ts`; deriva el periodo desde `movements[].create_date` y mantiene el contrato `snake_case`.
- Comportamiento obtenido: el agente detectó el literal `period="2024 - Full Year"` en `frontend/src/App.tsx` y el valor por defecto `2024 — Full Year` en `frontend/src/components/dashboard/dashboard-header.tsx`; propuso una utilidad `derivePeriodLabel` sin aplicarla.
- Evidencia: `frontend/src/App.tsx`; `frontend/src/components/dashboard/dashboard-header.tsx`; `frontend/src/lib/financial-types.ts`; `docker compose run --rm frontend npm run lint`; `docker compose run --rm frontend npm run test`; `docker compose run --rm frontend npm run build`.
- Estado: ✅ pasa
- Ajuste realizado: se aclaró que el periodo debe derivarse explícitamente de `movements[].create_date` y se añadió la evidencia del valor por defecto de `DashboardHeader`. El cambio de aplicación no fue aceptado.

## Regla
- Archivo: `.agents/rules/backend-api-conventions.md`
- Tarea usada: Añadir o modificar una ruta y ejecutar `docker compose run --rm backend pytest tests`; comprobar también que `docker compose config` conserva el entry point esperado.

## Resultado
- Comportamiento esperado: las rutas financieras nuevas permanecen bajo `/api/metrics`, `/health` se trata como ruta operacional, los modelos mantienen `snake_case` y el entry point sigue siendo `app.main:app`.
- Comportamiento obtenido: el agente confirmó las ocho rutas de datos bajo `/api/metrics`, la ruta operacional `/health`, los modelos de respuesta y `uvicorn app.main:app`; propuso validar fechas invertidas en `/api/metrics` sin aplicar el cambio.
- Evidencia: `backend/app/routes.py` (`health`, `get_metrics` y subrutas); `backend/app/main.py`; `backend/Dockerfile`; `docker compose config`; `docker compose run --rm backend pytest tests` con 15 pruebas exitosas.
- Estado: ✅ pasa
- Ajuste realizado: se aclaró en la regla que `/health` queda fuera del prefijo de datos y que la regla solo exige `/api/metrics` para rutas financieras. La propuesta de validación de fechas no fue aceptada.

## Regla
- Archivo: `.agents/rules/testing-workflow.md`
- Tarea usada: Ejecutar `docker compose run --rm backend pytest tests` y `npm run test` dentro del entorno frontend; verificar que la nueva prueba queda incluida en el comando del servicio y que sus códigos HTTP coinciden con el contrato implementado.

## Resultado
- Comportamiento esperado: backend usa Pytest, frontend usa Vitest y las pruebas de validación comprueban el código definido por el contrato, no un código supuesto.
- Comportamiento obtenido: el agente propuso un test de fechas invertidas que asumía `422`, aunque el código actual no define explícitamente ese contrato; la propuesta no fue aplicada. La suite backend pasó 15/15 y Vitest pasó 5/5.
- Evidencia: `backend/tests/test_routes.py`; `frontend/src/lib/financial-utils.test.ts`; `frontend/package.json`; resultados de `docker compose run --rm backend pytest tests` y `docker compose run --rm frontend npm run test`.
- Estado: ✅ pasa
- Ajuste realizado: se añadió “según el contrato HTTP acordado” y se exigió que los códigos HTTP coincidan con el contrato implementado. No se aceptó el test especulativo.

## Regla
- Archivo: `.agents/rules/security-and-runtime.md`
- Tarea usada: Inspeccionar la configuración efectiva con `docker compose config` y comprobar que un perfil de producción no publica `5678`, no usa `--reload` y restringe CORS.

## Resultado
- Comportamiento esperado: la regla debe identificar configuraciones de desarrollo expuestas y CORS demasiado permisivo en los archivos reales.
- Comportamiento obtenido: el agente confirmó `allow_origins=["*"]`, `allow_methods=["*"]`, `allow_headers=["*"]`, debugpy en `0.0.0.0:5678`, `--reload` y el mapeo `5678:5678`; propuso parametrizar CORS y separar perfiles sin aplicar esos cambios.
- Evidencia: `backend/app/main.py`; `backend/Dockerfile`; `docker-compose.yml`; `docker compose config`; comprobación estática `cors-wildcard=present`.
- Estado: ✅ pasa
- Ajuste realizado: ninguno adicional; la regla identifica configuraciones concretas y la propuesta permanece pendiente, como se solicitó.

## Regla
- Archivo: `.agents/rules/reproducible-tooling.md`
- Tarea usada: Verificar que `frontend/package-lock.json` existe, cambiar el build a `npm ci`, reconstruir el frontend y ejecutar `npm run build`; comprobar además que las dependencias backend tienen versiones fijadas o un lock reproducible.

## Resultado
- Comportamiento esperado: la regla debe distinguir entre la existencia del lockfile y su uso real durante el build.
- Comportamiento obtenido: el agente detectó que `frontend/package-lock.json` sí existe y que el problema real es `RUN npm install` en `frontend/Dockerfile`; propuso cambiarlo a `npm ci` sin aplicar el cambio. El build frontend pasó.
- Evidencia: `frontend/package-lock.json`; `frontend/Dockerfile`; `frontend/package.json`; `backend/requirements.txt`; `docker compose run --rm frontend npm run build`.
- Estado: ✅ pasa
- Ajuste realizado: se corrigió la regla para no afirmar que falta el lockfile y se limitó el riesgo a que Docker no lo utiliza. También se eliminó esa afirmación obsoleta de `engineering-findings.md`.

## Regla
- Archivo: `.agents/rules/documentation-workflow.md`
- Tarea usada: Comparar cada instrucción con los archivos presentes y ejecutar `docker compose config`; si se documenta una variable o healthcheck, comprobar que el archivo o la sección existe en la configuración efectiva.

## Resultado
- Comportamiento esperado: la documentación debe referenciar archivos realmente existentes y no afirmar que Compose tiene healthchecks cuando no los declara.
- Comportamiento obtenido: el agente inicialmente trató `frontend/.env.example` como inexistente por una búsqueda que omitía archivos ignorados; la comprobación directa confirmó que `frontend/.env.example` existe. También confirmó que `healthcheck` está ausente.
- Evidencia: `README.md`; `README.es.md`; `frontend/.env.example`; `frontend/src/App.tsx`; `docker-compose.yml`; `docker compose config`; comprobación estática `config-files-and-variable=ok` y `healthcheck=absent`.
- Estado: ✅ pasa
- Ajuste realizado: se corrigió la regla y `project-summary.md` para reflejar la existencia de `.env.example`; la regla ahora exige verificar archivos presentes y mantiene la advertencia real sobre la ausencia de `healthcheck`.
