import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
// 1. Lấy chuỗi kết nối
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';
// 2. Khởi tạo và ép kiểu thẳng thừng về any để vượt qua bộ lọc nghiêm ngặt của TS
const sql = neon(connectionString);
// 3. Khởi tạo Drizzle instance với neon-http
export const db = drizzle(sql);
/** Verifies database reachability before handling API requests. */
export async function connectDb() {
    await sql `SELECT 1`;
}
// Giữ lại object giả lập pool để các file khác không bị lỗi import
export const pool = {
    end: async () => Promise.resolve(),
    on: () => { }
};
//# sourceMappingURL=client.js.map