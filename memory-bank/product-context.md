# Contexto del producto

## Propósito

El proyecto implementa un dashboard de métricas financieras que carga movimientos financieros desde una API y presenta indicadores clave, gráficos de ingresos/egresos y porcentaje de beneficio — evidencia: `README.md`, `frontend/src/App.tsx`, `frontend/src/components/dashboard/income-outcome-chart.tsx`, `frontend/src/components/dashboard/profit-percent-chart.tsx`.

## Usuarios y flujo principal

La interfaz muestra un encabezado de resumen ejecutivo y componentes de indicadores y gráficos — evidencia: `frontend/src/App.tsx`, `frontend/src/components/dashboard/dashboard-header.tsx`, `frontend/src/components/dashboard/kpi-row.tsx`.

El flujo observable es: la aplicación React solicita `GET /api/metrics`, calcula KPIs y datos mensuales, y renderiza el dashboard; si la solicitud falla, muestra un mensaje de error — evidencia: `frontend/src/App.tsx`, `frontend/src/lib/financial-utils.ts`.

No se pudo comprobar un rol, organización o perfil de usuario concreto. El texto “Executive metrics dashboard” describe la pantalla, pero no identifica por sí solo a sus usuarios — evidencia: `frontend/src/components/dashboard/dashboard-header.tsx`.

## Funcionalidades comprobadas

- Carga de movimientos financieros desde `GET /api/metrics` — evidencia: `frontend/src/App.tsx`, `backend/app/routes.py`.
- Cálculo de ingresos, egresos, beneficio y porcentaje de beneficio — evidencia: `frontend/src/lib/financial-utils.ts`, `frontend/src/components/dashboard/kpi-row.tsx`.
- Agregación mensual para los gráficos — evidencia: `frontend/src/lib/financial-utils.ts`, `frontend/src/components/dashboard/income-outcome-chart.tsx`, `frontend/src/components/dashboard/profit-percent-chart.tsx`.
- Filtrado de métricas por fechas, categoría y tipo de operación — evidencia: `backend/app/routes.py`, `backend/tests/test_routes.py`.
- Facetas, resúmenes por día/semana/mes, categorías principales, comparación, alertas y vistas B2B/B2C — evidencia: `backend/app/routes.py`, `backend/tests/test_routes.py`.
- Estado de carga y mensaje de error en el frontend — evidencia: `frontend/src/App.tsx`, `frontend/src/components/ui/skeleton.tsx`.

## Límites

- La API genera datos mock deterministas con `seed=42`; no se comprobó una base de datos ni una fuente externa — evidencia: `backend/app/routes.py`.
- No se comprobó autenticación, autorización, persistencia, edición de movimientos ni un flujo de usuario autenticado — evidencia: no aparecen esas capacidades en las rutas inspeccionadas ni en `backend/requirements.txt`.
- La interfaz fija el periodo `2024 - Full Year`, mientras el backend genera fechas relativas a `date.today()`; la coherencia del periodo queda pendiente — evidencia: `frontend/src/App.tsx`, `frontend/src/components/dashboard/dashboard-header.tsx`, `backend/app/routes.py`.
