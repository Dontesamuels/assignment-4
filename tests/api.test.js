// tests/api.test.js
const request = require('supertest');
const app = require('../server');

describe('Books API', () => {
  beforeEach(async () => {
    await request(app).get('/__reset'); // reset in-memory data
  });

  test('GET /api/books -> array', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/books/:id -> single book', async () => {
    const res = await request(app).get('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title');
  });

  test('GET non-existent book -> 404', async () => {
    const res = await request(app).get('/api/books/9999');
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/books -> create', async () => {
    const newBook = { title: 'Test Book', author: 'Test Author', copies: 5 };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ title: 'Test Book', author: 'Test Author', copies: 5 });
    expect(res.body).toHaveProperty('id');
  });

  test('PUT /api/books/:id -> update', async () => {
    const res = await request(app).put('/api/books/1').send({ title: 'Dune (Updated)' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Dune (Updated)');
  });

  test('DELETE /api/books/:id -> delete', async () => {
    const res = await request(app).delete('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);

    // confirm deletion
    const check = await request(app).get('/api/books/1');
    expect(check.statusCode).toBe(404);
  });
});
