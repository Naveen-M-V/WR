import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './database/db.js';
import authRoutes from './routes/auth.js';
import { ensureAdminsSeeded } from './routes/auth.js';
import sectorsRoutes from './routes/sectors.js';
import companyRoutes from './routes/companies.js';
import stripeRoutes from './routes/stripe.js';
import contentRoutes from './routes/content.js';
import contactRoutes from './routes/contact.js';
import financeContactRoutes from './routes/financeContact.js';

// Initialize Express app
const app = express();

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    await ensureAdminsSeeded();
    
    const rawPort = Number(process.env.PORT) || 4000;
    const blockedPorts = new Set([6000]);
    const PORT = blockedPorts.has(rawPort) ? 4000 : rawPort;

    // Middleware
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : [];

    // Always include these base origins
    const defaultOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      'https://stage.whichrenewables.com',
      'http://stage.whichrenewables.com',
      'https://whichrenewables.com',
      'http://whichrenewables.com',
    ];

    const corsOrigins = [...new Set([...defaultOrigins, ...allowedOrigins])];

    app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, curl, mobile apps)
        if (!origin) return callback(null, true);
        if (corsOrigins.includes(origin)) return callback(null, true);
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
    }));
    // Stripe webhook needs raw body - must be before express.json()
    app.use('/api/webhook', express.raw({ type: 'application/json' }));
    app.use(express.json({ limit: '20mb' }));
    app.use(express.urlencoded({ extended: true, limit: '20mb' }));

    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
    app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')));

    // Request logging middleware
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/sectors', sectorsRoutes);
    app.use('/api/companies', companyRoutes);
    app.use('/api', stripeRoutes);
    app.use('/api/content', contentRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/finance-contact', financeContactRoutes);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({
        ok: true,
        message: 'Backend is running',
        timestamp: new Date().toISOString(),
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.path,
      });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  Which Renewables Backend Server       ║
╠════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}  ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  API Base: http://localhost:${PORT}/api      ║
╚════════════════════════════════════════╝
      `);
    });
    
  } catch (err) {
    console.error('[Server] Failed to start server:', err.message);
    process.exit(1);
  }
};

// Start the server
startServer();
