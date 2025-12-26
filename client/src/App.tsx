import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NovoAssociado from "./pages/NovoAssociado";
import EditarAssociado from "./pages/EditarAssociado";
import FichaMedica from "./pages/FichaMedica";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  [key: string]: any;
}

import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { RecuperarSenhaPage } from "./pages/RecuperarSenha";
import { APP_LOGO } from "@/const";

function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? <Component /> : null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={LoginPage} />
      <Route path={"/register"} component={RegisterPage} />
      <Route path={"/recuperar-senha"} component={RecuperarSenhaPage} />
      <Route path={"/dashboard"} component={() => <ProtectedRoute component={Dashboard} path="/dashboard" />} />
      <Route path="/associados/novo" component={() => <ProtectedRoute component={NovoAssociado} path="/associados/novo" />} />
      <Route path="/associados/:id/editar" component={() => <ProtectedRoute component={EditarAssociado} path="/associados/:id/editar" />} />
      <Route path="/associados/:id/ficha-medica" component={FichaMedica} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          {/* Decorative global logo overlay */}
          {APP_LOGO && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={APP_LOGO} alt="" className="app-logo-overlay" />
          )}
          <div className="site-content">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
