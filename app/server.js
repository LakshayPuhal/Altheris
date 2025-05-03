const express = require('express');
const client = require('prom-client');
const winston = require('winston');
const app = express();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'app.log' })
    ]
});

const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status']
});

app.use((req, res, next) => {
    const start = Date.now();
    const end = res.end;
    res.end = function () {
        const duration = Date.now() - start;
        httpRequestCounter.inc({ method: req.method, path: req.url, status: res.statusCode });
        logger.info(`${req.method} ${req.url}`, { status: res.statusCode, duration });
        end.apply(res, arguments);
    };
    next();
});

app.get('/health', (req, res) => {
    res.status(500).json({ status: 'unhealthy' });
});

app.get('/crash', (req, res) => {
    res.status(500).json({ error: 'Something went wrong!' });
    logger.error('Crash endpoint triggered');
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(3000, () => {
    logger.info('Server running on port 3000');
});