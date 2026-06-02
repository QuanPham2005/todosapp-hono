import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDb } from './db/client';
import apiRoutes from './routes/index';

const app = new Hono();

// 1. Đặt cấu hình CORS bao quát toàn bộ ứng dụng ở ngay ĐẦU FILE
app.use(
  '*',
  cors({
    origin: '*', // Cho phép tất cả các domain tiếp cận trong môi trường Cloudflare
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600, // Giữ tùy chọn cấu hình thử nghiệm trong 10 phút để tăng tốc độ load
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