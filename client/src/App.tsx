import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
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
  const [location] = useLocation();

  useEffect(() => {
    // Add background logo only on the home route
    if (location === "/") {
      document.body.classList.add("has-bg-logo");
    } else {
      document.body.classList.remove("has-bg-logo");
    }
    // cleanup on unmount
    return () => {
      document.body.classList.remove("has-bg-logo");
    };
  }, [location]);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <div className="site-content">
            <Toaster />
            <Router />
          </div>
          {/* Watermark DOM element to ensure visibility over body background */}
          <div className="watermark" aria-hidden="true"></div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
