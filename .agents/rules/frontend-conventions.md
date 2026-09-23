---
title: "Convenciones del frontend financiero"
description: "Protege el contrato frontend-backend, los entry points de React y la coherencia del periodo mostrado por el dashboard."
globs:
  - "frontend/src/**/*.{ts,tsx}"
  - "frontend/index.html"
  - "frontend/vite.config.ts"
applicationType: autoAttached
---

# Regla

La IA debe conservar los nombres `snake_case` del contrato JSON, mantener el entry point en `frontend/src/main.tsx`, usar rutas `/api/metrics...` y derivar el periodo mostrado de `movements[].create_date` en lugar de fijarlo en un componente.

## Evidencia
- `frontend/src/App.tsx`: consume `/api/metrics` y fija `period="2024 - Full Year"`.
- `frontend/src/components/dashboard/dashboard-header.tsx`: también define `2024 — Full Year` como valor por defecto.
- `frontend/src/lib/financial-types.ts`: refleja campos como `create_date` y `operation_type`.
- `frontend/vite.config.ts`: proxifica `/api` hacia `http://backend:8000`.
- `frontend/index.html`: carga `/src/main.tsx`.

## Validación
- Ejecutar el build y las pruebas del frontend; comprobar con datos de prueba que el periodo se calcula desde `movements[].create_date` y que las claves `create_date`, `operation_type` y `business_type` se conservan.
