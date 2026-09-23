---
title: "Convenciones de la API backend"
description: "Estandariza las rutas de métricas, los modelos de respuesta y el entry point de FastAPI para evitar contratos inconsistentes."
globs:
  - "backend/app/**/*.py"
  - "backend/Dockerfile"
applicationType: autoAttached
---

# Regla

La IA debe añadir las rutas de datos financieros bajo `/api/metrics`, mantener las rutas operacionales como `/health`, declarar modelos de respuesta explícitos cuando corresponda, conservar `snake_case` en el JSON y mantener `app.main:app` como entry point del servicio.

## Evidencia
- `backend/app/routes.py`: las rutas de datos existentes son `/api/metrics` y sus subrutas; `health` es la ruta operacional `/health`; `FinancialMovement` usa `snake_case`.
- `backend/app/main.py`: crea `app` e incluye `router`.
- `backend/Dockerfile`: inicia Uvicorn con `app.main:app`.

## Validación
- Añadir o modificar una ruta y ejecutar `docker compose run --rm backend pytest tests`; comprobar también que `docker compose config` conserva el entry point esperado.
