import { Hono } from 'hono';
declare const todoRoutes: Hono<{
    Bindings: import("../db/client").DbEnv;
}, import("hono/types").BlankSchema, "/">;
export default todoRoutes;
//# sourceMappingURL=todos.d.ts.map