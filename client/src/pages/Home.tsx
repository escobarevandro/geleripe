import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";
import { Users, FileText, Heart, Shield } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Watermark background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/logos/leripe_sem_fundo.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: '30vw',
          opacity: 0.6,
        }}
        aria-hidden="true"
      />
      
      <div className="relative z-10">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && (
              <img src={APP_LOGO} alt="Logo" className="h-12 w-12 object-contain" />
            )}
            <h1 className="text-2xl font-bold text-black">{APP_TITLE}</h1>
          </div>
          <Button
            onClick={() => setLocation('/login')}
            variant="outline"
            className="bg-white text-black hover:bg-orange-50"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-black mb-6">
            Sistema de Gestão Escoteira - SGE
          </h2>
          <p className="text-xl text-black mb-8">
            Plataforma completa para gerenciamento de fichas de registro individual e fichas médicas dos escoteiros.
          </p>
          <Button
            onClick={() => setLocation('/login')}
            size="lg"
            className="bg-white text-black hover:bg-orange-50 text-lg px-8 py-6"
          >
            Acessar Sistema
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-black" />
            </div>
              <h3 className="text-xl font-semibold text-black mb-2">
              Cadastro de Associados
            </h3>
              <p className="text-black">
              Registre informações completas dos associados beneficiários e seus responsáveis legais.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              Fichas Médicas
            </h3>
            <p className="text-black">
              Mantenha registros médicos detalhados, incluindo alergias, medicamentos e condições de saúde.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              Segurança
            </h3>
            <p className="text-black">
              Dados protegidos com autenticação segura e controle de acesso administrativo.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              Cuidado Integral
            </h3>
            <p className="text-black">
              Informações organizadas para garantir o melhor cuidado e segurança dos escoteiros.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center text-black">
          <p>&copy; 2025 Grupo Escoteiro 5/RJ - LERIPE. Todos os direitos reservados.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
