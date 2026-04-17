import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { CMSPageContent, CMSSection, CMSTheme, CMSSeo, CMSHeroData } from "@shared/website-types";

async function fetchPublicPageContent(slug: string): Promise<CMSPageContent | null> {
  try {
    const res = await fetch(`/api/website/pages/${slug}/content`, { credentials: "include" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;
    const content = json.data as CMSPageContent;
    if (!content || typeof content !== "object") return null;
    return content;
  } catch {
    return null;
  }
}

export function useCMSContent(slug: string) {
  return useQuery<CMSPageContent | null>({
    queryKey: ["/api/website/pages", slug, "content"],
    queryFn: () => fetchPublicPageContent(slug),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function getCMSHero(content: CMSPageContent | null | undefined) {
  if (!content?.sections) return null;
  return content.sections.find((s: CMSSection) => s.type === "hero" && s.visible !== false)?.data ?? null;
}

export function getCMSTheme(content: CMSPageContent | null | undefined): CMSTheme | null {
  if (!content?.theme) return null;
  return content.theme;
}

export function getCMSSeo(content: CMSPageContent | null | undefined): CMSSeo | null {
  if (!content?.seo) return null;
  return content.seo;
}

export function getCMSHeroTyped(content: CMSPageContent | null | undefined): CMSHeroData | null {
  if (!content?.sections) return null;
  const raw = content.sections.find((s: CMSSection) => s.type === "hero" && s.visible !== false)?.data ?? null;
  if (!raw) return null;
  return raw as CMSHeroData;
}

export function getCMSHeroBg(hero: CMSHeroData | null | undefined, fallback: string): string {
  if (!hero) return fallback;
  if (hero.imageUrl) return `url(${hero.imageUrl}) center/cover no-repeat`;
  if (hero.bgColor) return hero.bgColor as string;
  return fallback;
}

export function useCMSThemeEffect(theme: CMSTheme | null): void {
  useEffect(() => {
    if (!theme) return;
    const vars = [
      theme.primaryColor ? "--cms-primary:" + theme.primaryColor : null,
      theme.backgroundColor ? "--cms-bg:" + theme.backgroundColor : null,
      theme.accentColor ? "--cms-accent:" + theme.accentColor : null,
      theme.textColor ? "--cms-text:" + theme.textColor : null,
    ].filter(Boolean).join(";")
    if (!vars) return;
    const styleId = "cms-theme-vars"
    let el = document.getElementById(styleId) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement("style")
      el.id = styleId
      document.head.appendChild(el)
    }
    el.textContent = ":root{" + vars + "}"
    return () => { if (el) el.textContent = "" }
  }, [theme?.primaryColor, theme?.backgroundColor, theme?.accentColor, theme?.textColor])
}
