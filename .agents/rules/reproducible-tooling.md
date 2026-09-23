---
title: "Dependencias reproducibles"
description: "Reduce cambios accidentales entre builds fijando las resoluciones de Python y Node usadas por los contenedores."
globs:
  - "backend/requirements.txt"
  - "backend/Dockerfile"
  - "frontend/package.json"
  - "frontend/package-lock.json"
  - "frontend/Dockerfile"
applicationType: autoAttached
---

# Regla

La IA debe fijar o bloquear las versiones de dependencias antes de cambiar el entorno de ejecución y debe usar una instalación reproducible (`npm ci` cuando exista `package-lock.json`) en el build frontend.

## Evidencia
- `backend/requirements.txt`: las dependencias no tienen versiones fijadas.
- `backend/Dockerfile`: ejecuta `pip install -r requirements.txt` durante el build.
- `frontend/Dockerfile`: ejecuta `npm install` aunque existe `frontend/package-lock.json`.
- `frontend/package.json`: declara rangos `^`; la instalación reproducible debe apoyarse en el lockfile existente.

## Validación
- Verificar que `frontend/package-lock.json` existe, cambiar el build a `npm ci`, reconstruir el frontend y ejecutar `npm run build`; comprobar además que las dependencias backend tienen versiones fijadas o un lock reproducible.
