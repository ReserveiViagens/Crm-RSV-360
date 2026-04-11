import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pmsClient } from "@/lib/pms-client";
import type { PMSResponse } from "@/lib/pms-client";

// Types for users (adjust based on actual PMS API response)
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'agent';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function usePMSUsers() {
  return useQuery<PMSResponse<User[]>>({
    queryKey: ["pms-users"],
    queryFn: () => pmsClient.getUsers(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function usePMSUser(id: string) {
  return useQuery<PMSResponse<User>>({
    queryKey: ["pms-user", id],
    queryFn: () => pmsClient.getUser(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreatePMSUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
      pmsClient.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pms-users"] });
    },
  });
}

export function useUpdatePMSUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      pmsClient.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pms-users"] });
      queryClient.invalidateQueries({ queryKey: ["pms-user"] });
    },
  });
}