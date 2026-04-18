import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
import { Link } from "wouter"
import { Package, ArrowRight, Tag } from "lucide-react"

const WA_URL = "https://wa.me/5564993197555?text=Olá! Quero informações sobre combos e pacotes."

const COMBOS = [
  {
    id: 1,
    title: "Combo Família Completo",
    description: "Parque aquático + Hotel + Transfer incluso para toda a família",
    price: "R$ 890",
    tags: ["família", "parque", "hotel"],
    badge: "Mais vendido",
  },
  {
    id: 2,
    title: "Combo Casal Romântico",
    description: "Pousada charmosa + Jantar especial + Passeio pelas termas",
    price: "R$ 650",
    tags: ["casal", "termas", "jantar"],
    badge: "Destaque",
  },
  {
    id: 3,
    title: "Combo Aventura Total",
    description: "Parque de aventura + Rafting + Hospedagem 2 noites",
    price: "R$ 720",
    tags: ["aventura", "esportes", "hospedagem"],
    badge: null,
  },
  {
    id: 4,
    title: "Combo Termas Relax",
    description: "Acesso às termas premium + Massagem relaxante + Café da manhã",
    price: "R$ 480",
    tags: ["termas", "spa", "relaxamento"],
    badge: "Novidade",
  },
]

export default function CombosAcesse() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HomeHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Combos & Pacotes</h1>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Aproveite nossos combos especiais e economize na sua viagem para Caldas Novas. Pacotes completos com o melhor custo-benefício.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          {COMBOS.map((combo) => (
            <div key={combo.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-32 flex items-center justify-center relative">
                <Package className="w-16 h-16 text-white/60" />
                {combo.badge && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    {combo.badge}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-bold text-gray-900 text-lg mb-1">{combo.title}</h2>
                <p className="text-gray-500 text-sm mb-3">{combo.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {combo.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">{combo.price}</span>
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver detalhes <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-blue-900 text-lg mb-2">Quer um combo personalizado?</h3>
          <p className="text-blue-700 text-sm mb-4">Nossa equipe monta o pacote ideal para você e sua família.</p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Falar com especialista <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>

      <MobileCTABar />
      <HomeFooter />
    </div>
  )
}
