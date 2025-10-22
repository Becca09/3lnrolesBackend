import express from 'express';
import cors from 'cors';
import rolesRouter from './api/roles/rolesRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files (for local/dev). On Vercel, static files are served from /public at the root.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

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
