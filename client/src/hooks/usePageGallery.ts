import { useQuery } from "@tanstack/react-query";

export interface GalleryItem {
  id: string;
  type: "image" | "video" | "document";
  url: string;
  altText: string | null;
  originalName: string;
}

export interface PageGalleryData {
  images: GalleryItem[];
  video: GalleryItem | null;
}

async function fetchPageGallery(slug: string): Promise<PageGalleryData> {
  try {
    const res = await fetch(`/api/website/pages/${slug}/gallery`, {
      credentials: "include",
    });
    if (!res.ok) return { images: [], video: null };
    const json = await res.json();
    if (!json.success) return { images: [], video: null };
    return {
      images: Array.isArray(json.images) ? (json.images as GalleryItem[]) : [],
      video: json.video ?? null,
    };
  } catch {
    return { images: [], video: null };
  }
}

export function usePageGallery(slug: string) {
  return useQuery<PageGalleryData>({
    queryKey: ["/api/website/pages", slug, "gallery"],
    queryFn: () => fetchPageGallery(slug),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
