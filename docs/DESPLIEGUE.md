# Instrucciones de despliegue

## A. Publicar en GitHub Pages (despliegue automático)

1. Crea un repositorio **público** y vacío en GitHub (sin README ni .gitignore).
2. Desde la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "feat: proyecto inicial de la Práctica 3"
   git branch -M main
   git remote add origin https://github.com/jcbeltre/Electiva1.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Abre la pestaña **Actions** y espera a que las 4 etapas terminen en verde.
5. La URL aparece en el job *4. Despliegue a GitHub Pages* y sigue el formato:
   `https://jcbeltre.github.io/Electiva1/`

A partir de ahí, **cada push a `main` que pase el pipeline vuelve a publicar el sitio**. No hay que hacer nada manual.

> Si la etapa 4 falla la primera vez porque Pages aún no estaba activado, activa Pages (paso 3) y usa **Actions → CI/CD → Re-run all jobs**.

## B. Ejecutar la aplicación completa con Docker

GitHub Pages solo publica archivos estáticos. Para usar la API completa:

```bash
docker build -t tareas-devops .
docker run -d -p 3000:3000 --name tareas tareas-devops
```

Verificación:

```bash
curl http://localhost:3000/health          # {"estado":"ok"}
curl -X POST http://localhost:3000/api/tareas \
     -H "Content-Type: application/json" -d '{"titulo":"Probar despliegue"}'
curl http://localhost:3000/metrics
```

Detener y limpiar:

```bash
docker stop tareas && docker rm tareas
```

## C. Ejecutar sin Docker

```bash
npm install
npm start   # http://localhost:3000
```

Variable opcional: `PORT` (por defecto 3000).

## D. Verificar un despliegue

- La página abre sin error 404.
- La etapa 4 del pipeline está en verde.
- El *environment* `github-pages` (barra lateral del repo) muestra la última fecha de despliegue.
