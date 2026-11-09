# Guía de contribución

¡Gracias por querer mejorar este proyecto! Sigue estos pasos para que tu cambio pase el pipeline a la primera.

## 1. Preparar el entorno

```bash
git clone https://github.com/jcbeltre/Electiva1.git
cd Electiva1
npm install
npm test
```

Si `npm test` pasa en tu máquina, el entorno está listo (Node.js 20 o superior).

## 2. Flujo de trabajo

1. Crea una rama desde `main` con un nombre descriptivo:
   `git checkout -b feat/eliminar-tareas` o `fix/validar-titulo`
2. Haz cambios pequeños y enfocados.
3. **Agrega o actualiza pruebas** para todo comportamiento nuevo o corregido.
4. Verifica localmente antes de subir:
   ```bash
   npm run lint
   npm test
   ```
5. Haz *commit* con mensajes claros (ver convención abajo) y sube la rama:
   `git push -u origin feat/eliminar-tareas`
6. Abre un *pull request* hacia `main`. El pipeline se ejecuta automáticamente.
7. Un PR solo debe fusionarse cuando las etapas **Lint, Pruebas y Build Docker** estén en verde.

## 3. Convención de commits

Formato: `tipo: descripción corta en infinitivo`

| Tipo | Uso |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de un error |
| `test` | Agregar o cambiar pruebas |
| `docs` | Documentación |
| `ci` | Cambios en el pipeline |
| `refactor` | Reorganizar código sin cambiar comportamiento |

Ejemplos: `feat: agregar DELETE /api/tareas/:id`, `test: cubrir título demasiado largo`.

## 4. Estándares de código

- JavaScript con `const`/`let` (nunca `var`), punto y coma y 2 espacios de indentación.
- Mensajes de error de la API en español, con el formato `{ "error": "..." }`.
- Cada endpoint nuevo necesita al menos una prueba del caso exitoso y una del caso de error.
- La cobertura no debe bajar del umbral definido en `package.json`.

## 5. Reportar problemas

Abre un *issue* con: qué esperabas, qué pasó, pasos para reproducirlo y la versión de Node.js.
