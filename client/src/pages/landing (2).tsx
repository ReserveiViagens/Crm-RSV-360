import { useEffect } from "react"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HeroSection } from "@/components/home/HeroSection"
import { TrustBar } from "@/components/home/TrustBar"
import { ProfileSelector } from "@/components/home/ProfileSelector"
import { ParksSection } from "@/components/home/ParksSection"
import { BenefitsSection } from "@/components/home/BenefitsSection"
import { HowItWorksSection } from "@/components/home/HowItWorksSection"
import { SocialProofSection } from "@/components/home/SocialProofSection"
import { WhatsAppHelpSection } from "@/components/home/WhatsAppHelpSection"
import { CombosSection } from "@/components/home/CombosSection"
import { WeatherPreviewSection } from "@/components/home/WeatherPreviewSection"
import { FaqSection } from "@/components/home/FaqSection"
import { FinalCtaSection } from "@/components/home/FinalCtaSection"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
import { useCMSContent, getCMSHeroTyped, getCMSSeo, getCMSTheme, useCMSThemeEffect } from "@/hooks/useCMSContent"

export default function LandingPage() {
  const { data: cmsContent } = useCMSContent("home")
  const seo = getCMSSeo(cmsContent)
  const theme = getCMSTheme(cmsContent)
  const cmsHero = getCMSHeroTyped(cmsContent)

  useEffect(() => {
    if (seo?.metaTitle) document.title = seo.metaTitle
    return () => { document.title = "RSV360 — Caldas Novas e Rio Quente" }
  }, [seo?.metaTitle])

  useCMSThemeEffect(theme)

  return (
    <div data-testid="landing-page" className="rsv-public-shell rsv-home" style={{ minHeight: "100vh", background: theme?.backgroundColor ?? "#fff" }}>
      <HomeHeader />
      <main>
        <HeroSection
          headline={cmsHero?.headline ?? null}
          subheadline={cmsHero?.subheadline ?? null}
          bgColor={(cmsHero?.bgColor as string | undefined) ?? null}
          imageUrl={cmsHero?.imageUrl ?? null}
        />
        <TrustBar />
        <ProfileSelector />
        <ParksSection />
        <BenefitsSection />
        <HowItWorksSection />
        <SocialProofSection />
        <WhatsAppHelpSection />
        <CombosSection />
        <WeatherPreviewSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <HomeFooter />
      <MobileCTABar />
      <div className="mobile-bottom-spacer" />
      <style>{`
        @media (max-width: 768px) {
          .mobile-bottom-spacer { height: 74px; }
        }
      `}</style>
    </div>
  )
}
