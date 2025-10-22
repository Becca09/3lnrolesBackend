import express from 'express';
import cors from 'cors';
import rolesRouter from './api/roles/rolesRouter.js';
import path from 'path';

const app = express();

// Middleware
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// Static assets: serve images from /public at /static
app.use('/static', express.static(path.join(process.cwd(), 'public')));

// Routes
app.use('/api/roles', rolesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
