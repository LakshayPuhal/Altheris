const request = require("supertest"); // Corrected require statement
const app = require("./main"); // Importing the main app

describe("API Endpoints", () => {
  // Test for /health endpoint
  test("GET /health should return 200", async () => {
    const response = await request(app).get("/health"); // Fixed incorrect path
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  // Test for /crash endpoint
  test("GET /crash should return 500", async () => {
    const response = await request(app).get("/crash");
    expect(response.status).toBe(500);
  });

  // Flaky test that sometimes fails randomly
  test("Flaky test that sometimes fails", () => {
    const random = Math.random(); // Generates a random number between 0 and 1
    console.log(`Random value: ${random}`); // Logs the random number
    expect(random).toBeGreaterThan(0.3); // Test passes if random > 0.3, otherwise fails
  });
});
