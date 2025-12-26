import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validatePassword } from '@/lib/passwordValidation';

export function RecuperarSenhaPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'email' | 'codigo' | 'novaSenha'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [formData, setFormData] = useState({
    novaSenha: '',
    confirmaSenha: '',
  });

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/recuperar-senha/solicitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao solicitar código');
      }

      setSuccess('Código de recuperação enviado para seu email');
      setStep('codigo');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar código');
    } finally {
      setLoading(false);
    }
  };

  const handleValidarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/recuperar-senha/validar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, codigo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Código inválido');
      }

      setSuccess('Código validado com sucesso');
      setStep('novaSenha');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar código');
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar senha
    if (formData.novaSenha !== formData.confirmaSenha) {
      setError('As senhas não conferem');
      setLoading(false);
      return;
    }

    const validacao = validatePassword(formData.novaSenha);
    if (!validacao.isValid) {
      setError(validacao.errors.join('\\n'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/recuperar-senha/alterar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          codigo,
          novaSenha: formData.novaSenha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha');
      }

      setSuccess('Senha alterada com sucesso');
      setTimeout(() => {
        setLocation('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Recuperar Senha</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {step === 'email' && (
          <form onSubmit={handleSolicitarCodigo} className="space-y-4">
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Código de Recuperação'}
            </Button>
          </form>
        )}

        {step === 'codigo' && (
          <form onSubmit={handleValidarCodigo} className="space-y-4">
            <div>
              <Input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código de recuperação"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Validando...' : 'Validar Código'}
            </Button>
          </form>
        )}

        {step === 'novaSenha' && (
          <form onSubmit={handleAlterarSenha} className="space-y-4">
            <div>
              <Input
                type="password"
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleChange}
                placeholder="Nova senha"
                required
              />
            </div>

            <div>
              <Input
                type="password"
                name="confirmaSenha"
                value={formData.confirmaSenha}
                onChange={handleChange}
                placeholder="Confirme a nova senha"
                required
              />
            </div>

            <div className="text-sm text-gray-600">
              <p>A senha deve conter:</p>
              <ul className="list-disc list-inside">
                <li>Pelo menos 8 caracteres</li>
                <li>Uma letra maiúscula</li>
                <li>Uma letra minúscula</li>
                <li>Um número</li>
                <li>Um caractere especial</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Voltar para o login
          </a>
        </div>
      </Card>
    </div>
  );
}