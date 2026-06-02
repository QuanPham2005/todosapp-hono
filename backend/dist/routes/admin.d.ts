import { Hono } from 'hono';
declare const adminRoutes: Hono<{
    Bindings: import("../db/client").DbEnv;
}, import("hono/types").BlankSchema, "/">;
export default adminRoutes;
//# sourceMappingURL=admin.d.ts.map