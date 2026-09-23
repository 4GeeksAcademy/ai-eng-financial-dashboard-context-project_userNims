---
title: "Documentación operativa verificada"
description: "Mantiene los comandos, archivos de configuración y rutas de salud documentados de acuerdo con el repositorio real."
globs:
  - "README*.md"
  - "project-summary.md"
  - "engineering-findings.md"
  - "AGENTS.md"
applicationType: autoAttached
---

# Regla

La IA debe documentar únicamente comandos, archivos y URLs comprobados; debe verificar que los archivos de configuración referenciados existen, no debe describir un `healthcheck` si Compose no lo declara, y debe mantener sincronizadas las versiones española e inglesa del README cuando ambas describan el mismo flujo.

## Evidencia
- `README.md` y `README.es.md`: documentan `docker compose up --build`, puertos y una copia de `frontend/.env.example`.
- `frontend/src/App.tsx`: lee opcionalmente `VITE_API_BASE_URL`; `frontend/.env.example` existe y debe mantenerse alineado con esa lectura.
- `docker-compose.yml`: no contiene una sección `healthcheck`.
- `AGENTS.md`: referencia `.agents/rules`, `.agents/skills` y `memory-bank` como ubicaciones de instrucciones.

## Validación
- Comparar cada instrucción con los archivos presentes y ejecutar `docker compose config`; si se documenta una variable o healthcheck, comprobar que el archivo o la sección existe en la configuración efectiva.
