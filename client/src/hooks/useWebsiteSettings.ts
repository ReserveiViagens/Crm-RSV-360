import { useQuery } from "@tanstack/react-query";
import type { PublicSettingsResponse, PublicNavigationResponse } from "@shared/website-types";

async function req<T>(path: string): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  const body = await res.json();
  return body.data as T;
}

export function useWebsiteSettings() {
  return useQuery<PublicSettingsResponse>({
    queryKey: ["/api/website/settings"],
    queryFn: () => req<PublicSettingsResponse>("/api/website/settings"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useWebsiteNavigation() {
  return useQuery<PublicNavigationResponse>({
    queryKey: ["/api/website/navigation"],
    queryFn: () => req<PublicNavigationResponse>("/api/website/navigation"),
    staleTime: 1000 * 60 * 5,
  });
}
