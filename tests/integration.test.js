// Pruebas de integración: recorren flujos completos entre varios endpoints
// (en lugar de probar cada endpoint por separado).
const request = require('supertest');
const { createApp } = require('../src/app');

describe('Flujos de integración', () => {
  let app;
  beforeEach(() => { app = createApp(); });

  test('ciclo de vida: crear, completar, listar y eliminar', async () => {
    const creada = await request(app).post('/api/tareas').send({ titulo: 'Desplegar a Pages' });
    expect(creada.status).toBe(201);

    const completada = await request(app).patch(`/api/tareas/${creada.body.id}`);
    expect(completada.body.completada).toBe(true);

    const lista = await request(app).get('/api/tareas');
    expect(lista.body).toEqual([{ id: 1, titulo: 'Desplegar a Pages', completada: true }]);

    const borrada = await request(app).delete(`/api/tareas/${creada.body.id}`);
    expect(borrada.status).toBe(204);

    const vacia = await request(app).get('/api/tareas');
    expect(vacia.body).toEqual([]);
  });

  test('/metrics refleja las tareas creadas y eliminadas', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'A' });
    await request(app).post('/api/tareas').send({ titulo: 'B' });
    await request(app).delete('/api/tareas/1');
    const m = await request(app).get('/metrics');
    expect(m.body.tareas).toBe(1);
    expect(m.body.errores).toBe(0);
  });

  test('cada instancia de la app tiene su propio estado', async () => {
    const otra = createApp();
    await request(app).post('/api/tareas').send({ titulo: 'Solo en la primera' });
    const lista = await request(otra).get('/api/tareas');
    expect(lista.body).toHaveLength(0);
  });

  test('la raíz sirve el frontend estático (public/index.html)', async () => {
    const r = await request(app).get('/');
    expect(r.status).toBe(200);
    expect(r.headers['content-type']).toMatch(/html/);
    expect(r.text).toContain('Lista de tareas');
  });
});
