# Panel de Métricas Financieras

<!-- hide -->

Por [@marcogonzalo](https://github.com/marcogonzalo) y [otros contribuidores](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project/graphs/contributors) en [4Geeks Academy](https://4geeksacademy.com/)

[![build by developers](https://img.shields.io/badge/build_by-Developers-blue)](https://4geeks.com)
[![4Geeks Academy](https://img.shields.io/twitter/follow/4geeksacademy?style=social&logo=x)](https://x.com/4geeksacademy)

_These instructions are [available in English](./README.md)._

**Antes de empezar**: 📗 [Lee las instrucciones](https://4geeks.com/es/lesson/como-comenzar-un-proyecto-de-codificacion) sobre cómo comenzar un proyecto de programación.

<!-- endhide -->

---

_Dashboard de métricas financieras con frontend en React + TypeScript y backend en FastAPI._

## Stack tecnológico

| Capa | Tecnología | Versión | Función en el proyecto |
|---|---|---|---|
| **Runtime (frontend)** | Node.js | 24 | Ejecuta Vite, npm y el servidor de desarrollo de React. Fijado en `frontend/Dockerfile`. |
| **Runtime (backend)** | Python | 3.13 | Ejecuta el servidor FastAPI. Fijado en `backend/Dockerfile`. |
| **Framework frontend** | React | ^19.2.4 | Renderiza la interfaz del dashboard y gestiona el estado de componentes (`src/App.tsx`). |
| **Lenguaje** | TypeScript | ~6.0.2 | Aporta tipos estáticos al frontend; compila a ES2023 (`tsconfig.app.json`). |
| **Bundler / Dev server** | Vite | ^8.0.4 | Compila y sirve la SPA; proxea `/api` al backend (`vite.config.ts`). |
| **Framework CSS** | Tailwind CSS | ^4.2.2 | Estilos utility-first mediante el plugin `@tailwindcss/vite` (`src/index.css`). |
| **Gráficos** | Recharts | ^3.8.1 | Renderiza los gráficos de ingresos/egresos y beneficio en `src/components/dashboard/`. |
| **Framework API** | FastAPI | * | Define los endpoints REST y los modelos Pydantic (`backend/app/main.py`, `routes.py`). |
| **Servidor ASGI** | Uvicorn | * | Sirve la aplicación FastAPI; se lanza vía debugpy para depuración remota (`Dockerfile`). |
| **Validación** | Pydantic | * | Modelos de datos y validación de parámetros de consulta (incluido con FastAPI). |
| **Testing (frontend)** | Vitest | ^4.1.4 | Pruebas unitarias con cobertura V8 (`npm run test`). |
| **Testing (backend)** | Pytest | * | Pruebas Python; ver `backend/tests/`. |
| **Linting** | ESLint | ^9.39.4 | Análisis estático para TS/TSX con plugins react-hooks y react-refresh (`eslint.config.js`). |
| **Utilidades CSS** | clsx, tailwind-merge, CVA | ^2.1.1 / ^3.5.0 / ^0.7.1 | Fusión condicional de clases en componentes UI (`components/ui/card.tsx`). |
| **Iconos** | Lucide React | ^1.8.0 | Biblioteca de iconos usada en los componentes del dashboard. |
| **HTTP client (tests)** | httpx | * | Usado en los tests del backend (`backend/requirements.txt`). |

> \* Estas dependencias aparecen en `backend/requirements.txt` sin versiones fijadas. Ejecuta `pip install` para resolver la última versión compatible.

## Pasos recomendados

1. Haz un fork de este repositorio a tu cuenta.
2. Abre tu fork en GitHub Codespaces o clónalo y ejecútalo en tu entorno local.
3. Ejecuta tu agente de IA para inspeccionar frontend y backend.
4. Documenta las reglas propuestas y el banco de memoria en tu fork.
5. Ajusta y valida las reglas hasta que sean aplicables al flujo real del proyecto.

## Estructura esperada del directorio para agentes

```text
./.agents
└─ /rules
   └─ <nombre-regla>.md
└─ /skills
   └─ /<nombre-skill>
      └─ /SKILL.md
```

## Cómo ejecutar en local

```bash
docker compose up --build
```

El frontend usa por defecto el proxy de Vite para `/api`, así que no necesitas variables de entorno extra ni en desarrollo local ni en Codespaces.
Si necesitas apuntar a otro backend, copia `frontend/.env.example` como `.env` y define `VITE_API_BASE_URL`.

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Documentación API: http://localhost:8000/docs

---

Este y muchos otros proyectos son construidos por estudiantes como parte de los [Coding Bootcamps](https://4geeksacademy.com/) de 4Geeks Academy. Encuentra más acerca de los [cursos](https://4geeksacademy.com/es/comparar-programas) de [Ingeniería de IA](https://4geeksacademy.com/es/coding-bootcamps/ingenieria-ia), [Data Science & Machine Learning](https://4geeksacademy.com/es/coding-bootcamps/curso-datascience-machine-learning), [Ciberseguridad](https://4geeksacademy.com/es/coding-bootcamps/curso-ciberseguridad) y [Full-Stack Software Developer con IA](https://4geeksacademy.com/es/coding-bootcamps/programador-full-stack).
