// Aplicación web mínima: lista de tareas en memoria + endpoints de salud y métricas.
const express = require('express');
const path = require('path');

// Longitud máxima permitida para el título de una tarea (Práctica 3).
const MAX_TITULO = 100;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  let tareas = [];
  // Contador independiente: evita ids repetidos cuando se borran tareas.
  let siguienteId = 1;
  const metricas = { solicitudes: 0, errores: 0, inicio: Date.now() };

  // Registro (log) simple de cada solicitud: base para el monitoreo.
  app.use((req, res, next) => {
    metricas.solicitudes++;
    const t0 = Date.now();
    res.on('finish', () => {
      if (res.statusCode >= 500) metricas.errores++;
      if (process.env.NODE_ENV !== 'test') console.log(JSON.stringify({ nivel: 'info', metodo: req.method, ruta: req.path, estado: res.statusCode, ms: Date.now() - t0 }));
    });
    next();
  });

  app.get('/health', (req, res) => res.json({ estado: 'ok' }));

  app.get('/metrics', (req, res) => res.json({
    solicitudes: metricas.solicitudes,
    errores: metricas.errores,
    tareas: tareas.length,
    segundosActivo: Math.round((Date.now() - metricas.inicio) / 1000)
  }));

  app.get('/api/tareas', (req, res) => res.json(tareas));

  app.post('/api/tareas', (req, res) => {
    const titulo = (req.body && typeof req.body.titulo === 'string') ? req.body.titulo.trim() : '';
    if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });
    if (titulo.length > MAX_TITULO) {
      return res.status(400).json({ error: `El título no puede superar ${MAX_TITULO} caracteres` });
    }
    const tarea = { id: siguienteId++, titulo, completada: false };
    tareas.push(tarea);
    res.status(201).json(tarea);
  });

  app.patch('/api/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === Number(req.params.id));
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    tarea.completada = !tarea.completada;
    res.json(tarea);
  });

  // Funcionalidad nueva de la Práctica 3: eliminar una tarea.
  app.delete('/api/tareas/:id', (req, res) => {
    const id = Number(req.params.id);
    const existe = tareas.some(t => t.id === id);
    if (!existe) return res.status(404).json({ error: 'Tarea no encontrada' });
    tareas = tareas.filter(t => t.id !== id);
    res.status(204).end();
  });

  return app;
}

module.exports = { createApp, MAX_TITULO };
