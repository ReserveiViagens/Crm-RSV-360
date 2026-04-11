import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pmsClient } from "@/lib/pms-client";
import type { PMSResponse } from "@/lib/pms-client";

// Types for auth (adjust based on actual PMS API response)
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}

export function usePMSLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => pmsClient.login(credentials),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["pms-profile"] });
      }
    },
  });
}

export function usePMSRegister() {
  return useMutation({
    mutationFn: (userData: RegisterData) => pmsClient.register(userData),
  });
}

export function usePMSProfile() {
  return useQuery<PMSResponse<UserProfile>>({
    queryKey: ["pms-profile"],
    queryFn: () => pmsClient.getProfile(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}