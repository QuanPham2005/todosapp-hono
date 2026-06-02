import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDb } from './db/client';
import apiRoutes from './routes/index';

const app = new Hono();
const allowedOrigins = ['https://todosapp-hono.pages.dev', 'http://localhost:5173'];

const corsConfig = {
  origin: allowedOrigins,
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
};

// 1. Đặt cấu hình CORS bao quát toàn bộ ứng dụng ở ngay ĐẦU FILE
app.use(
  '*',
  cors(corsConfig)
);
app.options('*', cors(corsConfig));

// 2. Kết nối DB thông minh
app.use('/api/*', async (c, next) => {
  // Preflight requests should not depend on database availability.
  if (c.req.method === 'OPTIONS') {
    return next();
  }
  await connectDb();
  return next();
});

app.get('/api/health', (c) => {
  return c.json({ status: 'OK' });
});

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  const origin = c.req.header('Origin');
  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Vary', 'Origin');
    c.header('Access-Control-Expose-Headers', 'Content-Length,X-Kuma-Revision');
  }
  return c.json(
    { error: err.message || 'Internal Server Error' },
    500
  );
});

// Đăng ký các tuyến đường API chính thức
app.route('/api', apiRoutes);

export default app;