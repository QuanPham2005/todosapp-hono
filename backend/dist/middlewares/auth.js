import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretdevtoken';
const JWT_EXPIRES_IN = '7d';
export const createToken = (payload) => {
    return sign({
        sub: String(payload.id),
        email: payload.email,
        role: payload.role,
    }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
const getTokenFromRequest = (c) => {
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }
    return undefined;
};
export const verifyAuth = async (c, next) => {
    const token = getTokenFromRequest(c);
    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    try {
        const payload = verify(token, JWT_SECRET);
        const user = {
            id: Number(payload.sub),
            email: payload.email,
            role: payload.role,
        };
        c.set('user', user);
        return next();
    }
    catch (error) {
        return c.json({ error: 'Invalid or expired token' }, 401);
    }
};
export const requireAdmin = async (c, next) => {
    const user = c.get('user');
    if (!user || user.role !== 'ADMIN') {
        return c.json({ error: 'Forbidden' }, 403);
    }
    return next();
};
//# sourceMappingURL=auth.js.map