import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pmsClient } from "@/lib/pms-client";
import type { PMSResponse } from "@/lib/pms-client";

// Types for enterprises (adjust based on actual PMS API response)
export interface Enterprise {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function usePMSEnterprises() {
  return useQuery<PMSResponse<Enterprise[]>>({
    queryKey: ["pms-enterprises"],
    queryFn: () => pmsClient.getEnterprises(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function usePMSEnterprise(id: string) {
  return useQuery<PMSResponse<Enterprise>>({
    queryKey: ["pms-enterprise", id],
    queryFn: () => pmsClient.getEnterprise(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}