import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pmsClient } from "@/lib/pms-client";
import type { PMSResponse } from "@/lib/pms-client";

// Types for properties (adjust based on actual PMS API response)
export interface Property {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'pousada' | 'apartamento';
  description: string;
  location: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  amenities: string[];
  images?: string[];
  rating?: number;
  priceRange: {
    min: number;
    max: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function usePMSProperties() {
  return useQuery<PMSResponse<Property[]>>({
    queryKey: ["pms-properties"],
    queryFn: () => pmsClient.getProperties(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function usePMSProperty(id: string) {
  return useQuery<PMSResponse<Property>>({
    queryKey: ["pms-property", id],
    queryFn: () => pmsClient.getProperty(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}