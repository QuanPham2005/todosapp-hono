import { Hono } from 'hono';
import { type DbEnv } from './db/client';
declare const app: Hono<{
    Bindings: DbEnv;
}, import("hono/types").BlankSchema, "/">;
export default app;
//# sourceMappingURL=index.d.ts.map