import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  role: string;
  fotoUrl: string;
  provider: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return { user: user ?? null, isLoading };
}

export function useLogin() {
  const [, setLocation] = useLocation();
  return useMutation({
    mutationFn: async (data: { identificador: string; senha: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json() as Promise<AuthUser>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
      setLocation("/perfil");
    },
  });
}

export function useRegister() {
  const [, setLocation] = useLocation();
  return useMutation({
    mutationFn: async (data: {
      nome: string;
      email: string;
      telefone: string;
      cpf?: string;
      senha: string;
      confirmarSenha: string;
      termos: boolean;
    }) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json() as Promise<AuthUser>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
      setLocation("/perfil");
    },
  });
}

export function useLogout() {
  const [, setLocation] = useLocation();
  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/entrar");
    },
  });
}
