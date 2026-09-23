---
title: "Seguridad y ejecución de servicios"
description: "Evita trasladar configuraciones de desarrollo, depuración y CORS abierto a despliegues que requieran una política restringida."
globs:
  - "backend/app/main.py"
  - "backend/Dockerfile"
  - "docker-compose.yml"
applicationType: autoAttached
---

# Regla

La IA debe mantener debugpy, `--reload` y el puerto `5678` limitados al desarrollo; antes de ampliar o conservar CORS debe definir orígenes, métodos y cabeceras necesarios para el entorno objetivo, sin comodines en producción.

## Evidencia
- `backend/app/main.py`: configura `CORSMiddleware` con comodines y credenciales.
- `backend/Dockerfile`: inicia debugpy en `0.0.0.0:5678` y Uvicorn con `--reload`.
- `docker-compose.yml`: publica el puerto `5678`.

## Validación
- Inspeccionar la configuración efectiva con `docker compose config` y comprobar que un perfil de producción no publica `5678`, no usa `--reload` y restringe CORS.
