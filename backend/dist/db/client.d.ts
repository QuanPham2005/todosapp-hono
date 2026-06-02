export type DbEnv = {
    DATABASE_URL?: string;
};
/** Khởi tạo Neon HTTP Client */
export declare function getNeonClient(env?: DbEnv): any;
/** Khởi tạo Drizzle ORM Instance */
export declare function getDb(env?: DbEnv): any;
/** Hàm kiểm tra và kích hoạt Database (Sửa lỗi nát luồng .query) */
export declare function connectDb(env?: DbEnv): Promise<void>;
export declare const db: any;
export declare const pool: any;
//# sourceMappingURL=client.d.ts.map