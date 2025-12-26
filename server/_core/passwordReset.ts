import type { Express } from 'express';
import { eq, and } from 'drizzle-orm';
import { users, resetPasswordTokens } from '../../drizzle/schema';
import * as db from '../db';
import { hashPassword } from './auth';

// Gera um código numérico de 6 dígitos
function generateToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simula o envio de email (em produção, use um serviço de email real)
async function sendPasswordResetEmail(email: string, token: string) {
  console.log(`[DEV] Código de recuperação para ${email}: ${token}`);
  // Em produção, implemente o envio real de email aqui
}

export function registerPasswordResetRoutes(app: Express) {
  // Solicitar código de recuperação
  app.post('/api/auth/recuperar-senha/solicitar', async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    try {
      // Encontrar o usuário
      const [user] = await db.db()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (user.status === 'inativo') {
        return res.status(400).json({ error: 'Usuário inativo' });
      }

      // Gerar token
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

      // Salvar token
      await db.db()
        .insert(resetPasswordTokens)
        .values({
          userId: user.id,
          token,
          expiresAt,
          used: false,
        });

      // Enviar email
      await sendPasswordResetEmail(email, token);

      return res.json({ success: true });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return res.status(500).json({ error: 'Erro ao processar solicitação' });
    }
  });

  // Validar código
  app.post('/api/auth/recuperar-senha/validar', async (req, res) => {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({ error: 'Email e código são obrigatórios' });
    }

    try {
      // Encontrar o usuário
      const [user] = await db.db()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Validar token
      const [resetToken] = await db.db()
        .select()
        .from(resetPasswordTokens)
        .where(
          and(
            eq(resetPasswordTokens.userId, user.id),
            eq(resetPasswordTokens.token, codigo),
            eq(resetPasswordTokens.used, false)
          )
        )
        .limit(1);

      if (!resetToken) {
        return res.status(400).json({ error: 'Código inválido' });
      }

      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ error: 'Código expirado' });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Error validating reset token:', error);
      return res.status(500).json({ error: 'Erro ao validar código' });
    }
  });

  // Alterar senha
  app.post('/api/auth/recuperar-senha/alterar', async (req, res) => {
    const { email, codigo, novaSenha } = req.body;

    if (!email || !codigo || !novaSenha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
      // Encontrar o usuário
      const [user] = await db.db()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Validar token
      const [resetToken] = await db.db()
        .select()
        .from(resetPasswordTokens)
        .where(
          and(
            eq(resetPasswordTokens.userId, user.id),
            eq(resetPasswordTokens.token, codigo),
            eq(resetPasswordTokens.used, false)
          )
        )
        .limit(1);

      if (!resetToken) {
        return res.status(400).json({ error: 'Código inválido' });
      }

      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ error: 'Código expirado' });
      }

      // Atualizar senha
      const hashedPassword = await hashPassword(novaSenha);
      await db.db()
        .update(users)
        .set({ senha: hashedPassword })
        .where(eq(users.id, user.id));

      // Marcar token como usado
      await db.db()
        .update(resetPasswordTokens)
        .set({ used: true })
        .where(eq(resetPasswordTokens.id, resetToken.id));

      return res.json({ success: true });
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ error: 'Erro ao alterar senha' });
    }
  });
}