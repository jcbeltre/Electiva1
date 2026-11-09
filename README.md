# Lista de Tareas DevOps — Práctica 3 (Electiva 1, ITLA)

![CI/CD](https://github.com/jcbeltre/Electiva1/actions/workflows/ci.yml/badge.svg)

Aplicación web mínima (lista de tareas) con un pipeline **CI/CD en GitHub Actions** que revisa el código, ejecuta pruebas con cobertura, construye una imagen Docker y despliega el frontend a **GitHub Pages**.

- **Repositorio:** https://github.com/jcbeltre/Electiva1.git
- **Sitio publicado (GitHub Pages):** https://jcbeltre.github.io/Electiva1/
- **Autor:** Juan Carlos Beltre Reynoso — Matrícula 202093-18

> **Nota:** GitHub Pages solo sirve archivos estáticos. En el sitio publicado se ve el frontend en "modo estático"; la API (`/api/tareas`) funciona al ejecutar la app localmente o con Docker.

## Contenido

| Pieza | Archivo | Para qué sirve |
|---|---|---|
| App Node.js/Express | `src/app.js`, `src/server.js` | API de tareas + `/health` y `/metrics` |
| Frontend estático | `public/index.html` | Se publica en GitHub Pages |
| Pruebas unitarias | `tests/app.test.js` | Jest + Supertest, un comportamiento por prueba |
| Pruebas de integración | `tests/integration.test.js` | Flujos completos entre varios endpoints |
| Contenedor | `Dockerfile` | Imagen de producción con *healthcheck* |
| Pipeline | `.github/workflows/ci.yml` | Lint → Pruebas → Build Docker → Deploy |
| Documentación | `docs/` | Pipeline, despliegue y guion de la demo |

## Requisitos

- Cuenta de GitHub (repositorio **público**, Actions es gratuito)
- Git y **Node.js 20+**
- Opcional: Docker Desktop para probar el contenedor local

## Ejecutar en local

```bash
npm install
npm test          # pruebas unitarias + integración + cobertura
npm start         # http://localhost:3000
```

Con Docker:

```bash
docker build -t tareas-devops .
docker run -p 3000:3000 tareas-devops
```

## API

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/health` | Estado del servicio | 200 |
| GET | `/metrics` | Solicitudes, errores, tareas, tiempo activo | 200 |
| GET | `/api/tareas` | Lista las tareas | 200 |
| POST | `/api/tareas` | Crea una tarea (`{ "titulo": "..." }`, máx. 100 caracteres) | 201, 400 |
| PATCH | `/api/tareas/:id` | Alterna completada | 200, 404 |
| DELETE | `/api/tareas/:id` | Elimina una tarea *(nuevo en Práctica 3)* | 204, 404 |

## Pruebas y cobertura

- `npm run test:unit` — pruebas unitarias de cada endpoint.
- `npm run test:integration` — flujos completos (crear → completar → listar → eliminar, métricas, frontend estático).
- `npm test` — ejecuta todo y genera el reporte de cobertura en `coverage/`. La configuración de Jest en `package.json` **falla el pipeline si la cobertura baja del umbral** (80 % sentencias, líneas y funciones; 70 % ramas).

## El pipeline, etapa por etapa

El workflow `.github/workflows/ci.yml` se ejecuta en cada *push* y *pull request* hacia `main` (y manualmente con `workflow_dispatch`).

| # | Etapa (job) | Qué hace | Si falla |
|---|---|---|---|
| 1 | **Lint** | Instala dependencias y revisa la sintaxis con `npm run lint` | Se detiene todo el pipeline |
| 2 | **Pruebas y cobertura** | Ejecuta pruebas unitarias, de integración y `npm test` con umbral de cobertura; guarda el reporte como artefacto | No se construye ni se despliega |
| 3 | **Build Docker** | Construye la imagen, levanta el contenedor y consulta `/health` | No se despliega |
| 4 | **Despliegue a GitHub Pages** | Publica la carpeta `public/` (solo en *push* a `main`) | La página anterior se mantiene |

Más detalle, diagrama y explicación de las decisiones en [`docs/PIPELINE.md`](docs/PIPELINE.md).

## Despliegue

Los pasos para activar GitHub Pages y publicar están en [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md). En resumen: **Settings → Pages → Source: GitHub Actions**, y cada *push* a `main` que pase las etapas 1–3 publica el sitio.

## Contribuir

Lee la [guía de contribución](CONTRIBUTING.md) antes de abrir un *pull request*.

## Licencia

MIT
