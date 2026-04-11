import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pmsClient } from "@/lib/pms-client";
import type { PMSResponse } from "@/lib/pms-client";

// Types for reservations (adjust based on actual PMS API response)
export interface Reservation {
  id: string;
  excursionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reservationDate: string;
  excursionDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function usePMSReservations() {
  return useQuery<PMSResponse<Reservation[]>>({
    queryKey: ["pms-reservations"],
    queryFn: () => pmsClient.getReservations(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function usePMSReservation(id: string) {
  return useQuery<PMSResponse<Reservation>>({
    queryKey: ["pms-reservation", id],
    queryFn: () => pmsClient.getReservation(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreatePMSReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) =>
      pmsClient.createReservation(reservationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pms-reservations"] });
    },
  });
}

export function useUpdatePMSReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reservation> }) =>
      pmsClient.updateReservation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pms-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["pms-reservation"] });
    },
  });
}