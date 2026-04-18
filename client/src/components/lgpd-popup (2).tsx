import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

interface LGPDPopupProps {
  onAccept: () => void
  onDecline: () => void
}

export default function LGPDPopup({ onAccept, onDecline }: LGPDPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show popup after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleAccept = () => {
    localStorage.setItem("reservei-lgpd-consent", "accepted")
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem("reservei-lgpd-consent", "declined")
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 sm:slide-in-from-bottom-0">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Privacidade e Cookies</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência de navegação, personalizar 
                conteúdo e anúncios, fornecer funcionalidades de redes sociais e analisar nosso tráfego. Ao continuar 
                navegando, você concorda com nossa{" "}
                <a href="/politica-privacidade" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </a>{" "}
                e o uso de cookies conforme descrito.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleAccept} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Aceitar Todos
            </Button>
            <Button onClick={handleDecline} variant="outline" className="flex-1">
              Apenas Essenciais
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Você pode alterar suas preferências a qualquer momento nas configurações.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
