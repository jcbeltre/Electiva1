# Guion de la demostración (video de YouTube o PPT)

Duración sugerida: 6 a 8 minutos. Graba la pantalla con audio (OBS, Zoom o Teams) y súbelo a YouTube como **No listado**; pega el enlace en el informe.

## Preparación antes de grabar

- Repositorio ya subido y con al menos una ejecución verde en Actions.
- Terminal abierta en la carpeta del proyecto, navegador con el repo y la página de Actions.
- Cierra pestañas y notificaciones que no necesites mostrar.

## Escenas

| Min | Qué mostrar | Qué decir |
|---|---|---|
| 0:00 | Portada: nombre, matrícula, práctica | Presentación breve y objetivo de la práctica |
| 0:30 | Repo en GitHub (estructura de carpetas) | Qué es cada carpeta: `src`, `tests`, `public`, `.github/workflows`, `docs` |
| 1:30 | `src/app.js`: el endpoint `DELETE` | La funcionalidad nueva, el 404 y por qué se agregó `siguienteId` |
| 2:30 | `tests/`: pruebas nuevas | Diferencia entre pruebas unitarias e integración |
| 3:15 | Terminal: `npm test` | Mostrar la tabla de cobertura y el umbral |
| 4:00 | `ci.yml` | Las 4 etapas, `needs`, y cuándo se despliega |
| 5:00 | **Demo del rojo:** romper una prueba, push, Actions en rojo | Qué etapa falló y que las siguientes no corrieron |
| 6:00 | **Demo del verde:** corregir, push, Actions en verde | Despliegue automático a Pages |
| 7:00 | Abrir la URL de GitHub Pages | Sitio publicado y funcionando |
| 7:30 | Cierre | Qué aprendiste y qué mejorarías |

## Cómo provocar el pipeline en rojo (paso a paso)

1. Crea una rama o trabaja en `main`. En `tests/app.test.js`, cambia a propósito un valor esperado, por ejemplo:
   `expect(r.status).toBe(201);` → `expect(r.status).toBe(200);` en la prueba *POST crea una tarea*.
2. Súbelo:
   ```bash
   git add tests/app.test.js
   git commit -m "test: provocar fallo para demostrar el pipeline"
   git push
   ```
3. En **Actions** verás la ejecución en ❌. Haz captura de: el grafo de etapas (la 2 en rojo, la 3 y 4 sin ejecutar) y el log con el error de Jest.
4. Corrige el valor, vuelve a hacer commit y push:
   ```bash
   git add tests/app.test.js
   git commit -m "fix: restaurar la prueba y volver a verde"
   git push
   ```
5. Haz captura de la ejecución en ✅ con las 4 etapas completas y de la URL publicada.

## Capturas que debes tener para el informe

1. Estructura del repositorio.
2. `npm test` con la tabla de cobertura.
3. Pipeline en rojo (etapa que falló).
4. Pipeline en verde (4 etapas).
5. Settings → Pages configurado en GitHub Actions.
6. Sitio publicado en la URL de Pages.
7. Artefacto `reporte-cobertura` en la ejecución.
