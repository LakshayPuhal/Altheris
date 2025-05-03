const express = require('express');
const client = require('prom-client');
const app = express();

const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status']
});

app.use((req, res, next) => {
    const end = res.end;
    res.end = function () {
        httpRequestCounter.inc({ method: req.method, path: req.url, status: res.statusCode });
        end.apply(res, arguments);
    };
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' }); // Ensure this returns 200
});

app.get('/crash', (req, res) => {
    res.status(500).json({ error: 'Something went wrong!' });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});