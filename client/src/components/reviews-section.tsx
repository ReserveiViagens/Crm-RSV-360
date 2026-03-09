import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  date: string
  location: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Maria Silva",
    rating: 5,
    comment: "Experiência incrível! O hotel era maravilhoso e o parque aquático foi diversão garantida para toda a família. Recomendo muito!",
    date: "Há 2 dias",
    location: "São Paulo, SP"
  },
  {
    id: 2,
    name: "João Santos",
    rating: 5,
    comment: "Melhor preço que encontrei! A equipe da Reservei Viagens foi super atenciosa e tudo saiu perfeito.",
    date: "Há 5 dias",
    location: "Brasília, DF"
  },
  {
    id: 3,
    name: "Ana Costa",
    rating: 5,
    comment: "Caldas Novas é maravilhosa! O pacote incluía tudo e ainda economizamos bastante. Voltaremos com certeza!",
    date: "Há 1 semana",
    location: "Goiânia, GO"
  },
  {
    id: 4,
    name: "Carlos Oliveira",
    rating: 5,
    comment: "Atendimento excelente do início ao fim. Os hotéis parceiros são de primeira qualidade. Vale cada centavo!",
    date: "Há 1 semana",
    location: "Cuiabá, MT"
  },
  {
    id: 5,
    name: "Juliana Pereira",
    rating: 5,
    comment: "Férias perfeitas! As crianças adoraram o parque aquático e nós aproveitamos muito a estrutura do hotel. Super recomendo!",
    date: "Há 2 semanas",
    location: "Campo Grande, MS"
  }
]

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
      />
    ))
  }

  const currentReview = reviews[currentIndex]

  return (
    <div className="space-y-4">
      <Card 
        className="bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-lg">{currentReview.name}</h4>
              <p className="text-sm text-gray-500">{currentReview.location}</p>
            </div>
            <div className="flex gap-1">{renderStars(currentReview.rating)}</div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-3">{currentReview.comment}</p>
          <p className="text-xs text-gray-500">{currentReview.date}</p>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoPlaying(false)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
            }`}
            aria-label={`Ver avaliação ${index + 1}`}
          />
        ))}
      </div>

      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <div className="flex">{renderStars(5)}</div>
          <span className="text-sm font-semibold text-blue-600">5.0 de 5.0</span>
          <span className="text-sm text-gray-600">({reviews.length} avaliações)</span>
        </div>
      </div>
    </div>
  )
}
