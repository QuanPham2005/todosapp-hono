export type DbEnv = {
    DATABASE_URL?: string;
};
export declare function getNeonClient(env?: DbEnv): any;
export declare function getDb(env?: DbEnv): any;
export declare function connectDb(env?: DbEnv): Promise<void>;
export declare const db: any;
export declare const pool: any;
//# sourceMappingURL=client.d.ts.map