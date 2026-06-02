import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDb } from './db/client';
import apiRoutes from './routes/index';

const app = new Hono();

// 1. Đảm bảo CORS nằm ở ĐẦU TIÊN để phản hồi các request OPTIONS từ trình duyệt
app.use(
  '/api/*',
  cors({
    // Cho phép '*', hoặc điền chính xác link Pages (KHÔNG CÓ DẤU GẠCH CHÉO Ở CUỐI)
    origin: (origin) => {
      if (!origin) return '*';
      if (origin.endsWith('.pages.dev') || origin.startsWith('http://localhost')) {
        return origin; // Tự động chấp nhận tất cả các domain con của pages.dev và localhost
      }
      return '*';
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);

// 2. Kết nối DB thông minh
app.use('/api/*', async (_c, next) => {
  await connectDb();
  return next();
});

app.get('/api/health', (c) => {
  return c.json({ status: 'OK' });
});

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json(
    { error: err.message || 'Internal Server Error' },
    500
  );
});

// Đăng ký các tuyến đường API chính thức
app.route('/api', apiRoutes);

export default app;