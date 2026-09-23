---
title: "Flujo de pruebas por servicio"
description: "Mantiene las herramientas de prueba existentes y exige cubrir contratos, validaciones y estados de carga del dashboard."
globs:
  - "backend/tests/**/*.py"
  - "frontend/src/**/*.test.ts"
  - "frontend/package.json"
applicationType: autoAttached
---

# Regla

La IA debe usar Pytest para el backend y Vitest para el frontend; cada cambio de endpoint debe cubrir al menos un caso válido y uno de validación según el contrato HTTP acordado, y cada cambio de carga de datos frontend debe cubrir los estados loading, success y error cuando sean aplicables.

## Evidencia
- `backend/tests/test_routes.py`: usa `pytest` y `TestClient` para probar `/health` y las rutas de métricas.
- `frontend/package.json`: define los scripts `test`, `test:watch` y `test:coverage` con Vitest.
- `frontend/src/lib/financial-utils.test.ts`: contiene las pruebas frontend existentes.
- `frontend/src/App.tsx`: implementa los estados `loading` y `error` alrededor de `fetchFinancialData`.

## Validación
- Ejecutar `docker compose run --rm backend pytest tests` y `npm run test` dentro del entorno frontend; verificar que la nueva prueba queda incluida en el comando del servicio y que sus códigos HTTP coinciden con el contrato implementado.
