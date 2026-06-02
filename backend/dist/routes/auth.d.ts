import { Hono } from 'hono';
declare const auth: Hono<{
    Bindings: import("../db/client").DbEnv;
}, import("hono/types").BlankSchema, "/">;
export default auth;
//# sourceMappingURL=auth.d.ts.map