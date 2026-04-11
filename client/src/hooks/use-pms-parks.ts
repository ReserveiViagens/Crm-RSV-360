import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pmsClient } from "@/lib/pms-client";
import type { PMSResponse } from "@/lib/pms-client";

// Types for parks (adjust based on actual PMS API response)
export interface Park {
  id: string;
  name: string;
  description: string;
  type: 'aquatic' | 'theme' | 'adventure' | 'nature';
  location: string;
  attractions: string[];
  facilities: string[];
  images?: string[];
  price: number;
  operatingHours: {
    open: string;
    close: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function usePMSParks() {
  return useQuery<PMSResponse<Park[]>>({
    queryKey: ["pms-parks"],
    queryFn: () => pmsClient.getParks(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function usePMSPark(id: string) {
  return useQuery<PMSResponse<Park>>({
    queryKey: ["pms-park", id],
    queryFn: () => pmsClient.getPark(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}