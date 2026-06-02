import type { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import type { UserRole, UserSession } from '../types';

const { sign, verify } = jwt;

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretdevtoken';
const JWT_EXPIRES_IN = '7d';

export const createToken = (payload: { id: number; email: string; role: UserRole }) => {
  return sign(
    {
      sub: String(payload.id),
      email: payload.email,
      role: payload.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

const getTokenFromRequest = (c: Context): string | undefined => {
  const authHeader = c.req.header('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return undefined;
};

export const verifyAuth = async (c: Context, next: Next) => {
  const token = getTokenFromRequest(c);
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      role: UserRole;
    };

    const user: UserSession = {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };

    c.set('user', user);
    return next();
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};

export const requireAdmin = async (c: Context, next: Next) => {
  const user = c.get('user') as UserSession | undefined;
  if (!user || user.role !== 'ADMIN') {
    return c.json({ error: 'Forbidden' }, 403);
  }

  return next();
};
