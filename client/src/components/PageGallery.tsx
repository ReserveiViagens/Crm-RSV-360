import { useState, useEffect, useRef, useCallback } from "react"
import { Maximize2, X, Play, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { GalleryItem } from "@/hooks/usePageGallery"

interface PageGalleryProps {
  images: GalleryItem[]
  video: GalleryItem | null
  title?: string
}

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

function isExternalVideo(url: string) {
  return url.includes("youtube") || url.includes("youtu.be") || url.includes("vimeo")
}

export function PageGallery({ images, video, title = "Galeria de Fotos" }: PageGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxDirection, setLightboxDirection] = useState<"left" | "right">("right")
  const [lightboxAnimating, setLightboxAnimating] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()

  const navigateLightbox = useCallback((dir: "prev" | "next") => {
    setLightboxAnimating((animating) => {
      if (animating) return animating
      const newDir = dir === "next" ? "right" : "left"
      setLightboxDirection(newDir)
      setTimeout(() => {
        setLightboxIndex((i) =>
          dir === "next" ? (i < images.length - 1 ? i + 1 : 0) : (i > 0 ? i - 1 : images.length - 1)
        )
        setLightboxAnimating(false)
      }, 220)
      return true
    })
  }, [images.length])

  useEffect(() => {
    if (!api) return
    const update = () => setSelectedIndex(api.selectedScrollSnap())
    api.on("select", update)
    update()
    return () => { api.off("select", update) }
  }, [api])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft") navigateLightbox("prev")
      if (e.key === "ArrowRight") navigateLightbox("next")
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxOpen, navigateLightbox])

  if (images.length === 0 && !video) return null

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  const currentImage = images[lightboxIndex]

  return (
    <section
      ref={sectionRef}
      data-testid="page-gallery-section"
      style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 16px",
        transition: "opacity 500ms ease-out, transform 500ms ease-out",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      {images.length > 0 && (
        <>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1e3a5f",
              marginBottom: 16,
            }}
          >
            {title}
          </h2>

          <div style={{ position: "relative" }}>
            <Carousel
              setApi={setApi}
              opts={{ loop: false }}
              style={{ borderRadius: 14, overflow: "hidden" }}
            >
              <CarouselContent style={{ margin: 0 }}>
                {images.map((img, idx) => (
                  <CarouselItem key={img.id} style={{ padding: 0 }}>
                    <div
                      data-testid={`gallery-slide-${img.id}`}
                      style={{
                        position: "relative",
                        aspectRatio: "16/7",
                        cursor: "pointer",
                        overflow: "hidden",
                        background: "#0f172a",
                      }}
                      onClick={() => openLightbox(idx)}
                    >
                      <img
                        src={img.url}
                        alt={img.altText ?? img.originalName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 300ms ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)" }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0,0,0,0)",
                          transition: "background 200ms",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.2)" }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0)" }}
                      >
                        <Maximize2 style={{ width: 32, height: 32, color: "rgba(255,255,255,0.85)" }} />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {images.length > 1 && (
                <>
                  <button
                    data-testid="gallery-prev"
                    onClick={() => api?.scrollPrev()}
                    style={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.85)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                      zIndex: 10,
                    }}
                  >
                    <ChevronLeft style={{ width: 20, height: 20, color: "#1e3a5f" }} />
                  </button>
                  <button
                    data-testid="gallery-next"
                    onClick={() => api?.scrollNext()}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.85)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                      zIndex: 10,
                    }}
                  >
                    <ChevronRight style={{ width: 20, height: 20, color: "#1e3a5f" }} />
                  </button>
                </>
              )}
            </Carousel>
          </div>

          {images.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  data-testid={`gallery-dot-${idx}`}
                  onClick={() => api?.scrollTo(idx)}
                  style={{
                    width: idx === selectedIndex ? 12 : 8,
                    height: idx === selectedIndex ? 12 : 8,
                    borderRadius: "50%",
                    background: idx === selectedIndex ? "#2563EB" : "rgba(100,116,139,0.4)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 200ms ease",
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {video && (
        <div style={{ marginTop: images.length > 0 ? 32 : 0 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1e3a5f",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Play style={{ width: 18, height: 18, color: "#2563EB" }} />
            Vídeo em Destaque
          </h2>
          <div
            data-testid="gallery-video-section"
            style={{
              position: "relative",
              paddingTop: "56.25%",
              borderRadius: 14,
              overflow: "hidden",
              background: "#0f172a",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
          >
            {isExternalVideo(video.url) ? (
              <iframe
                src={getEmbedUrl(video.url) ?? video.url}
                title={video.altText ?? "Vídeo em Destaque"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            ) : (
              <video
                src={video.url}
                controls
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          style={{
            maxWidth: "92vw",
            width: "92vw",
            background: "rgba(0,0,0,0.96)",
            border: "none",
            padding: 0,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {currentImage && (
            <div
              data-testid="gallery-lightbox"
              style={{ position: "relative", width: "100%", background: "#000" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>
                  {lightboxIndex + 1} / {images.length}
                </span>
                <button
                  data-testid="gallery-lightbox-close"
                  onClick={() => setLightboxOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X style={{ width: 16, height: 16, color: "#fff" }} />
                </button>
              </div>

              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <img
                  key={lightboxIndex}
                  src={currentImage.url}
                  alt={currentImage.altText ?? currentImage.originalName}
                  style={{
                    width: "100%",
                    maxHeight: "85vh",
                    objectFit: "contain",
                    display: "block",
                    animation: lightboxAnimating
                      ? `lightbox-exit-${lightboxDirection} 220ms ease forwards`
                      : `lightbox-enter-${lightboxDirection} 220ms ease both`,
                  }}
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    data-testid="gallery-lightbox-prev"
                    onClick={() => navigateLightbox("prev")}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronLeft style={{ width: 28, height: 28, color: "#fff" }} />
                  </button>
                  <button
                    data-testid="gallery-lightbox-next"
                    onClick={() => navigateLightbox("next")}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronRight style={{ width: 28, height: 28, color: "#fff" }} />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
