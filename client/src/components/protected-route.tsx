import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#F9FAFB",
      }}>
        <Loader2 style={{ width: 32, height: 32, color: "#2563EB", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/entrar" />;
  }

  if (roles && roles.length > 0) {
    const hasRole = roles.includes(user.role);
    if (!hasRole) {
      return <Redirect to="/" />;
    }
  }

  return <>{children}</>;
}
