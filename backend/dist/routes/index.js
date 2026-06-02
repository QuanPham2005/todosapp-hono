import { Hono } from 'hono';
import authRoutes from './auth';
import todoRoutes from './todos';
import adminRoutes from './admin';
const api = new Hono();
api.route('/auth', authRoutes);
api.route('/todos', todoRoutes);
api.route('/admin', adminRoutes);
export default api;
//# sourceMappingURL=index.js.map