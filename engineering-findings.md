# Hallazgos de ingeniería

## Convenciones confirmadas

### 1. Contrato API con `snake_case`
- **Convención confirmada:** los modelos backend y el frontend usan nombres como `create_date`, `operation_type` y `business_type`.
- **Riesgo observado:** cambiar el formato de nombres en una sola capa rompe filtros, tipos o pruebas.
- **Evidencia por ruta y archivo:** `backend/app/routes.py` (`FinancialMovement`, `get_metrics`); `frontend/src/lib/financial-types.ts`; `frontend/src/App.tsx`.
- **Regla propuesta:** conservar `snake_case` en el contrato JSON; cualquier cambio debe actualizar backend, tipos, utilidades y tests juntos.
- **Tarea pequeña para validarla:** añadir una prueba que compruebe las claves exactas de una respuesta de `/api/metrics` y ejecutar `docker compose run --rm backend pytest tests`.

### 2. Rutas agrupadas bajo `/api/metrics`
- **Convención confirmada:** los endpoints de datos usan `/api/metrics` y subrutas descriptivas.
- **Riesgo observado:** una ruta nueva fuera de esa jerarquía puede quedar fuera del proxy o del contrato documentado.
- **Evidencia por ruta y archivo:** `backend/app/routes.py` (`get_metrics`, `get_metrics_facets`, `get_metrics_summary`, `get_top_categories`, `get_metrics_comparison`, `get_metrics_alerts`, `get_b2b_metrics`, `get_b2c_metrics`); `frontend/vite.config.ts` (proxy `/api`).
- **Regla propuesta:** las nuevas rutas de métricas deben usar `/api/metrics/...` y declarar modelos de respuesta explícitos.
- **Tarea pequeña para validarla:** añadir una prueba que recorra las rutas públicas de métricas y confirme el prefijo `/api/metrics`.

### 3. Separación de entry points por servicio
- **Convención confirmada:** React entra por `frontend/src/main.tsx`; FastAPI entra por `app.main:app`.
- **Riesgo observado:** mover cualquiera de esos puntos sin actualizar Docker o `index.html` deja el servicio sin arranque.
- **Evidencia por ruta y archivo:** `frontend/index.html`; `frontend/src/main.tsx`; `backend/Dockerfile`; `backend/app/main.py`.
- **Regla propuesta:** cualquier cambio de entry point debe actualizar su referencia de ejecución y comprobar el arranque de Compose.
- **Tarea pequeña para validarla:** ejecutar `docker compose config` y construir ambos servicios después de modificar un entry point de prueba.

### 4. Pruebas según herramienta del servicio
- **Convención confirmada:** backend usa Pytest y frontend usa Vitest mediante scripts npm.
- **Riesgo observado:** añadir pruebas con otra herramienta no se ejecutaría con los comandos existentes.
- **Evidencia por ruta y archivo:** `backend/tests/test_routes.py`; `backend/requirements.txt`; `frontend/package.json`; `frontend/src/lib/financial-utils.test.ts`.
- **Regla propuesta:** backend: Pytest; frontend: Vitest; toda nueva funcionalidad debe incluir pruebas en el conjunto correspondiente.
- **Tarea pequeña para validarla:** añadir un caso unitario para una nueva función y comprobar que aparece en el comando de test del servicio.

## Riesgos observados

### 5. CORS abierto
- **Convención confirmada:** la aplicación configura CORS globalmente en el arranque.
- **Riesgo observado:** `allow_origins=["*"]`, `allow_methods=["*"]`, `allow_headers=["*"]` y `allow_credentials=True` permiten una política demasiado amplia para un despliegue real.
- **Evidencia por ruta y archivo:** `backend/app/main.py` (`CORSMiddleware`).
- **Regla propuesta:** restringir orígenes, métodos y cabeceras a los entornos y operaciones necesarios; no usar comodines en producción.
- **Tarea pequeña para validarla:** añadir una prueba de CORS que permita el origen local esperado y rechace un origen no autorizado.

### 6. Debugpy y recarga expuestos
- **Convención confirmada:** el contenedor backend inicia Uvicorn mediante debugpy y `--reload`.
- **Riesgo observado:** el puerto `5678` se publica y debugpy escucha en `0.0.0.0`; además, `--reload` es una configuración de desarrollo.
- **Evidencia por ruta y archivo:** `backend/Dockerfile`; `docker-compose.yml` (puerto `5678`).
- **Regla propuesta:** habilitar debugpy y `--reload` solo en el perfil de desarrollo; no exponerlos en producción.
- **Tarea pequeña para validarla:** separar un perfil Compose de desarrollo y verificar que el perfil de producción no publica `5678` ni usa `--reload`.

### 7. Dependencias backend sin versiones fijadas
- **Convención confirmada:** las dependencias backend se instalan desde `requirements.txt` durante el build.
- **Riesgo observado:** `fastapi`, `uvicorn`, `debugpy`, `pytest`, `pytest-cov` y `httpx` no tienen versiones fijadas.
- **Evidencia por ruta y archivo:** `backend/requirements.txt`; `backend/Dockerfile` (`pip install --no-cache-dir -r requirements.txt`).
- **Regla propuesta:** fijar versiones o versionar un lock reproducible y actualizarlo de forma deliberada.
- **Tarea pequeña para validarla:** generar un archivo de versiones fijadas, reconstruir la imagen y ejecutar las 15 pruebas backend.

### 8. Instalación frontend no reproducible
- **Convención confirmada:** la imagen instala dependencias con npm y ejecuta Vite.
- **Riesgo observado:** el Dockerfile usa `npm install` aunque existe un lockfile frontend en el repositorio.
- **Evidencia por ruta y archivo:** `frontend/Dockerfile`; `frontend/package.json`; `frontend/package-lock.json`.
- **Regla propuesta:** versionar `frontend/package-lock.json` y usar `npm ci` en imágenes y CI.
- **Tarea pequeña para validarla:** generar el lockfile, cambiar el build a `npm ci` y ejecutar `npm run build`.

### 9. Arranque sin healthcheck Compose
- **Convención confirmada:** `frontend` depende de `backend` mediante `depends_on` simple.
- **Riesgo observado:** Compose puede iniciar el frontend antes de que FastAPI acepte conexiones; no existe sección `healthcheck`.
- **Evidencia por ruta y archivo:** `docker-compose.yml`; `backend/app/routes.py` (`health`).
- **Regla propuesta:** declarar un healthcheck para `/health` y hacer que el frontend dependa de un backend saludable.
- **Tarea pequeña para validarla:** añadir el healthcheck, arrancar Compose desde cero y comprobar `/health`, `/api/metrics` y la página frontend tras el estado saludable.

### 10. Documentación de `.env.example`
- **Convención confirmada:** el frontend lee opcionalmente `VITE_API_BASE_URL` y por defecto usa rutas relativas.
- **Riesgo observado:** el README depende de que `frontend/.env.example` permanezca alineado con la variable que consume la aplicación.
- **Evidencia por ruta y archivo:** `README.md`; `README.es.md`; `frontend/src/App.tsx`; `frontend/.env.example`.
- **Regla propuesta:** documentar solo archivos de configuración versionados; crear `.env.example` si la variable forma parte del flujo soportado.
- **Tarea pequeña para validarla:** comprobar que `frontend/.env.example` documenta `VITE_API_BASE_URL` y verificar un build con configuración por defecto.

### 11. Periodo de UI fijado y datos relativos
- **Convención confirmada:** el backend genera 12 meses relativos a `date.today()` y el frontend presenta un periodo literal.
- **Riesgo observado:** `DashboardHeader` puede mostrar `2024 - Full Year` aunque los movimientos pertenezcan a otro año.
- **Evidencia por ruta y archivo:** `frontend/src/App.tsx` (`period="2024 - Full Year"`); `backend/app/routes.py` (`_year_for_month`, `generate_mock_movements`).
- **Regla propuesta:** no fijar periodos de presentación con literales; derivarlos de la respuesta o compartir una fuente de configuración.
- **Tarea pequeña para validarla:** añadir una prueba con datos de otro año y comprobar que el encabezado cambia coherentemente.

### 12. Cobertura de errores limitada
- **Convención confirmada:** los tests cubren endpoints principales y filtros válidos.
- **Riesgo observado:** no hay casos para fechas invertidas, parámetros inválidos, respuestas vacías ni errores de carga frontend; las pruebas frontend cubren funciones puras, no `App` ni `fetch`.
- **Evidencia por ruta y archivo:** `backend/tests/test_routes.py`; `frontend/src/lib/financial-utils.test.ts`; `frontend/src/App.tsx`.
- **Regla propuesta:** cada endpoint debe tener al menos un caso válido y uno de validación/error; el frontend debe probar estados loading, success y error.
- **Tarea pequeña para validarla:** añadir un test de parámetro inválido en backend y un test de fallo de `fetch` en frontend.

### 13. Instrucciones de agentes referencian rutas ausentes
- **Convención confirmada:** `AGENTS.md` ordena revisar `.agents/rules`, `.agents/skills` y `memory-bank` antes de actuar.
- **Riesgo observado:** esas carpetas no existen en el checkout inspeccionado, por lo que el agente no puede aplicar reglas o memoria del proyecto desde esas ubicaciones.
- **Evidencia por ruta y archivo:** `AGENTS.md`; ausencia de `.agents/` y `memory-bank/`.
- **Regla propuesta:** mantener esas rutas si son parte del proceso, pero versionar su contenido; si son opcionales, declararlo explícitamente en `AGENTS.md`.
- **Tarea pequeña para validarla:** crear un archivo mínimo de reglas o actualizar `AGENTS.md` y comprobar que un agente puede localizarlo sin búsquedas fallidas.
