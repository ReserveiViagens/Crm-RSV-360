import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pmsClient } from "@/lib/pms-client";
import type { PMSResponse } from "@/lib/pms-client";

// Types for excursions (adjust based on actual PMS API response)
export interface Excursion {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  images?: string[];
  category?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export function usePMSExcursions() {
  return useQuery<PMSResponse<Excursion[]>>({
    queryKey: ["pms-excursions"],
    queryFn: () => pmsClient.getExcursions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePMSExcursion(id: string) {
  return useQuery<PMSResponse<Excursion>>({
    queryKey: ["pms-excursion", id],
    queryFn: () => pmsClient.getExcursion(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreatePMSExcursion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (excursionData: Omit<Excursion, 'id' | 'createdAt' | 'updatedAt'>) =>
      pmsClient.createExcursion(excursionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pms-excursions"] });
    },
  });
}

export function useUpdatePMSExcursion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Excursion> }) =>
      pmsClient.updateExcursion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pms-excursions"] });
      queryClient.invalidateQueries({ queryKey: ["pms-excursion"] });
    },
  });
}