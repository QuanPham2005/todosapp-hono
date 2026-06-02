import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
// Đường dẫn kết nối dự phòng từ ảnh image_8f8c18.png (sau khi bạn đã điền mật khẩu thực tế)
const HARDCODED_POOLER_URL = 'postgresql://neondb_owner:npg_6jTmIMEZgs2A@ep-plain-breeze-ap86n8gk-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
/** Hàm lấy chuỗi kết nối an toàn trên mọi môi trường của Cloudflare Workers */
function getConnectionString(env) {
    // 1. Ưu tiên lấy từ biến môi trường động của Hono Request context
    if (env?.DATABASE_URL)
        return env.DATABASE_URL;
    // 2. Kiểm tra biến môi trường toàn cục (globalThis) đặc thù của Workers
    const globalEnv = globalThis.DATABASE_URL || globalThis.env?.DATABASE_URL;
    if (globalEnv)
        return globalEnv;
    // 3. Trả về đường dẫn pooler thực tế của Neon để làm điểm tựa an toàn chống sập
    return HARDCODED_POOLER_URL;
}
/** Khởi tạo Neon HTTP Client */
export function getNeonClient(env) {
    const connectionString = getConnectionString(env);
    return neon(connectionString, {
        fetchOptions: { keepalive: true } // Giữ kết nối HTTP sống động, giảm độ trễ Cold Start
    });
}
/** Khởi tạo Drizzle ORM Instance */
export function getDb(env) {
    return drizzle(getNeonClient(env));
}
/** Hàm kiểm tra và kích hoạt Database (Sửa lỗi nát luồng .query) */
export async function connectDb(env) {
    try {
        const sql = getNeonClient(env);
        // Đúng cú pháp của Neon HTTP Client, kích hoạt database trong tích tắc
        await sql `SELECT 1`;
    }
    catch (error) {
        console.error('[db/client] Không thể ping tới Neon Database:', error);
    }
}
// ⚠️ KHÔNG khởi tạo trực tiếp instance tĩnh toàn cục bằng biến trống nữa để tránh nhận nhầm localhost!
// Thay vào đó, xuất ra một proxy object thông minh tự động tìm kiếm kết nối đúng
export const db = new Proxy({}, {
    get(_, prop) {
        const activeDb = getDb();
        return activeDb[prop];
    }
});
// Giữ lại mock-pool phục vụ việc tương thích ngược với các file route cũ
export const pool = {
    end: async () => Promise.resolve(),
    on: () => undefined,
};
//# sourceMappingURL=client.js.map