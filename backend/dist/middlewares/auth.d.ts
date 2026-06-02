import type { Context, Next } from 'hono';
import type { UserRole } from '../types';
export declare const createToken: (payload: {
    id: number;
    email: string;
    role: UserRole;
}) => string;
export declare const verifyAuth: (c: Context, next: Next) => Promise<void | (Response & import("hono").TypedResponse<{
    error: string;
}, 401, "json">)>;
export declare const requireAdmin: (c: Context, next: Next) => Promise<void | (Response & import("hono").TypedResponse<{
    error: string;
}, 403, "json">)>;
//# sourceMappingURL=auth.d.ts.map