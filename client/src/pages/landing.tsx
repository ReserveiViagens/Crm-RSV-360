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

export default function LandingPage() {
  return (
    <div data-testid="landing-page" className="rsv-public-shell" style={{ minHeight: "100vh", background: "#fff" }}>
      <HomeHeader />
      <main>
        <HeroSection />
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
