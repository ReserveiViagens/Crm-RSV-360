import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  unauthorizedRedirect?: string;
}

export default function ProtectedRoute({ children, roles, unauthorizedRedirect }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const toastFired = useRef(false);

  const needsAuth = !isLoading && !user;
  const needsRole = !isLoading && user && roles && roles.length > 0 && !roles.includes(user.role);

  useEffect(() => {
    if (toastFired.current) return;
    if (needsAuth) {
      toastFired.current = true;
      toast({ title: "Acesso restrito", description: "Faça login para acessar esta página.", variant: "destructive" });
    } else if (needsRole) {
      toastFired.current = true;
      toast({ title: "Permissão insuficiente", description: "Você não tem permissão para acessar esta página.", variant: "destructive" });
    }
  }, [needsAuth, needsRole, toast]);

  if (isLoading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#F9FAFB",
      }}>
        <Loader2 data-testid="loading-protected" style={{ width: 32, height: 32, color: "#2563EB", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (needsAuth) {
    return <Redirect to="/entrar" />;
  }

  if (needsRole) {
    return <Redirect to={unauthorizedRedirect ?? "/"} />;
  }

  return <>{children}</>;
}
