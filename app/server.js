const express = require('express');
const app = express();

// Health endpoint (returns success)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Crash endpoint (simulates failure)
app.get('/crash', (req, res) => {
    throw new Error('Intentional crash!');
});

// Optional: Add a root endpoint if not already present
app.get('/', (req, res) => {
    res.send('Hello from the self-healing app!');
});

// Error handler to catch crashes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;