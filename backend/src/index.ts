import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDb } from './db/client';
import apiRoutes from './routes/index';

const app = new Hono();

app.use('*', async (_c, next) => {
  await connectDb();
  return next();
});

// Enable CORS for local development
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

app.get('/api/health', (c) => {
  return c.json({ status: 'OK' });
});

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json(
    { error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message || 'Internal Server Error' },
    500
  );
});

app.route('/api', apiRoutes);

export default app;
