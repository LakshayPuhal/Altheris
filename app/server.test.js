const request = require('supertest');
const app = require('./server');

describe('API Endpoints', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });

  test('GET /crash should return 500', async () => {
    const response = await request(app).get('/crash');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Something went wrong!');
  });

  test('Flaky test that sometimes fails', () => {
    const random = Math.random();
    console.log(`Random value: ${random}`);
    expect(random).toBeGreaterThan(0.3); // Fails ~30% of the time
  });
});