const express = require('express');
const config = require('dotenv').config;
const connectDB = require('./config/db');
const securityMiddleware = require('./middleware/security');

const orgRoutes = require('./routes/org');
const projectRoutes = require('./routes/project');
const testSuiteRoutes = require('./routes/testSuite');
const reportRoutes = require('./routes/report');
const apiKeyRoutes = require('./routes/apiKey');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

config();
const app = express();

// Security and parsing middleware
app.use(securityMiddleware);
app.use(express.json());

// API routes
app.use('/api/org', orgRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/testsuite', testSuiteRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/apikey', apiKeyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
