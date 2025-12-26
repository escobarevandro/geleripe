import { compareSync, hashSync } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { COOKIE_NAME } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'local-development-secret');

export async function createJWT(userId: number) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1y')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: number };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  return hashSync(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return compareSync(password, hash);
}

export function registerAuthRoutes(app: Express) {
  // Register endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
      // Check if user already exists
      const existingUser = await db.db()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      // Create new user (MySQL / Drizzle: .returning() is not supported — use insertId then fetch)
      const hashedSenha = await hashPassword(password);
      const insertResult = await db.db()
        .insert(users)
        .values({
          email,
          senha: hashedSenha,
          status: "ativo",
        }) as any;

      const insertedId = insertResult && insertResult.insertId ? Number(insertResult.insertId) : undefined;

      let user;
      if (insertedId) {
        const [fetched] = await db.db()
          .select()
          .from(users)
          .where(eq(users.id, insertedId))
          .limit(1);
        user = fetched;
      }

      if (!user) {
        console.error("Insert succeeded but could not fetch user", insertResult);
        return res.status(500).json({ error: "Erro ao registrar usuário" });
      }

      // Generate JWT
      const token = await createJWT(user.id);

      // Set cookie
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
        }
      });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
      // Find user by email
      const [user] = await db.db()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user || !user.senha) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      // Verify password against 'senha' column
      if (!comparePassword(password, user.senha)) {
        return res.status(401).json({ error: "Senha incorreta" });
      }

      // Generate JWT
      const token = await createJWT(user.id);

      // Set cookie
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
        }
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Erro ao fazer login" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });

  // Get current user endpoint
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const payload = await verifyJWT(token);
      if (!payload) {
        return res.status(401).json({ error: "Token inválido" });
      }

      const [user] = await db.db()
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
        }
      });
    } catch (error) {
      console.error("Error getting current user:", error);
      return res.status(500).json({ error: "Erro ao obter usuário atual" });
    }
  });
}