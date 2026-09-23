# Decisiones verificadas

## Uso de Docker Compose

- **Decisión verificada:** el flujo documentado de ejecución usa `docker compose up --build` para levantar frontend y backend.
- **Evidencia:** `README.md`, `README.es.md`, `docker-compose.yml`.
- **Justificación:** el README lo documenta y Compose define ambos servicios.

## Proxy de `/api`

- **Decisión verificada:** el frontend usa rutas relativas `/api/...` y Vite las proxifica al servicio `backend:8000`.
- **Evidencia:** `frontend/src/App.tsx`, `frontend/vite.config.ts`.
- **Justificación:** la configuración de Vite define explícitamente el proxy y el frontend consume `/api/metrics`.

## Datos mock deterministas

- **Decisión verificada:** los endpoints generan movimientos con `generate_mock_movements(seed=42)`.
- **Evidencia:** `backend/app/routes.py`.
- **Justificación:** razón de producto o negocio no encontrada; el comportamiento está implementado y cubierto por pruebas.

## Debugging del backend en desarrollo

- **Decisión verificada:** el contenedor backend se inicia mediante debugpy, escucha en `0.0.0.0:5678` y ejecuta Uvicorn con `--reload`.
- **Evidencia:** `backend/Dockerfile`, `docker-compose.yml`.
- **Justificación:** razón documentada no encontrada; el README solo describe el flujo general de Compose.

## CORS amplio

- **Decisión verificada:** FastAPI configura CORS con comodines para orígenes, métodos y cabeceras, y permite credenciales.
- **Evidencia:** `backend/app/main.py`.
- **Justificación:** razón documentada no encontrada; queda como riesgo pendiente para un despliegue restringido.

## Ausencia de healthcheck en Compose

- **Decisión verificada:** Compose usa `depends_on` simple y no declara `healthcheck`.
- **Evidencia:** `docker-compose.yml`; el endpoint disponible es `GET /health` en `backend/app/routes.py`.
- **Justificación:** razón documentada no encontrada.

## Dependencias

- **Decisión verificada:** backend instala desde `requirements.txt` sin versiones fijadas; frontend usa `npm install` aunque existe `frontend/package-lock.json`.
- **Evidencia:** `backend/requirements.txt`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/package-lock.json`.
- **Justificación:** razón documentada no encontrada; se observó como riesgo de reproducibilidad.
