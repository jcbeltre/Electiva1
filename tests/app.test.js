// Pruebas unitarias de los endpoints (una por comportamiento).
const request = require('supertest');
const { createApp, MAX_TITULO } = require('../src/app');

describe('API de tareas', () => {
  let app;
  beforeEach(() => { app = createApp(); });

  test('GET /health responde ok', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
    expect(r.body.estado).toBe('ok');
  });

  test('POST /api/tareas crea una tarea', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 'Configurar pipeline' });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ id: 1, titulo: 'Configurar pipeline', completada: false });
  });

  test('POST /api/tareas sin título devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({});
    expect(r.status).toBe(400);
  });

  test('PATCH /api/tareas/:id alterna completada', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Escribir pruebas' });
    const r = await request(app).patch('/api/tareas/1');
    expect(r.body.completada).toBe(true);
  });

  test('PATCH de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).patch('/api/tareas/99');
    expect(r.status).toBe(404);
  });

  test('GET /metrics cuenta solicitudes y tareas', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Medir' });
    const r = await request(app).get('/metrics');
    expect(r.body.tareas).toBe(1);
    expect(r.body.solicitudes).toBeGreaterThanOrEqual(2);
  });

  // ---- Pruebas nuevas de la Práctica 3 ----

  test('DELETE /api/tareas/:id elimina la tarea y responde 204', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Tarea a borrar' });
    const r = await request(app).delete('/api/tareas/1');
    expect(r.status).toBe(204);
    const lista = await request(app).get('/api/tareas');
    expect(lista.body).toHaveLength(0);
  });

  test('DELETE de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).delete('/api/tareas/99');
    expect(r.status).toBe(404);
    expect(r.body.error).toBe('Tarea no encontrada');
  });

  test('POST con un título demasiado largo devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 'a'.repeat(MAX_TITULO + 1) });
    expect(r.status).toBe(400);
  });

  test('POST acepta un título de exactamente el largo máximo', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 'a'.repeat(MAX_TITULO) });
    expect(r.status).toBe(201);
  });

  test('los ids no se repiten después de borrar una tarea', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Uno' });
    await request(app).post('/api/tareas').send({ titulo: 'Dos' });
    await request(app).delete('/api/tareas/1');
    const r = await request(app).post('/api/tareas').send({ titulo: 'Tres' });
    expect(r.body.id).toBe(3);
  });
});
