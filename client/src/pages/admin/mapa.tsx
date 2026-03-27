import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Hotel,
  Waves,
  Star,
  Bus,
  Filter,
  Eye,
  X,
} from "lucide-react";

type TipoMarcador = "hotel" | "parque" | "atracao" | "ponto_embarque";

interface MarcadorMapa {
  id: string;
  tipo: TipoMarcador;
  nome: string;
  descricao: string;
  endereco: string;
  lat: number;
  lng: number;
  rating?: number;
  capacidade?: number;
  status: "ativo" | "inativo" | "manutencao";
}

const MARCADORES: MarcadorMapa[] = [
  { id: "1", tipo: "parque", nome: "Hot Park", descricao: "O maior parque aquático da América Latina", endereco: "Rio Quente, GO", lat: -17.7773, lng: -48.7565, rating: 4.8, capacidade: 8000, status: "ativo" },
  { id: "2", tipo: "parque", nome: "Parque das Fontes", descricao: "Parque com fontes termais naturais", endereco: "Caldas Novas, GO", lat: -17.7408, lng: -48.6248, rating: 4.5, capacidade: 3000, status: "ativo" },
  { id: "3", tipo: "hotel", nome: "Náutico Hotel", descricao: "Hotel 5 estrelas com piscinas termais", endereco: "Av. Orcalino, Caldas Novas, GO", lat: -17.7450, lng: -48.6200, rating: 4.7, capacidade: 200, status: "ativo" },
  { id: "4", tipo: "hotel", nome: "Rio Quente Resorts", descricao: "Resort completo com acesso ao Hot Park", endereco: "Rio Quente, GO", lat: -17.7810, lng: -48.7480, rating: 4.6, capacidade: 500, status: "ativo" },
  { id: "5", tipo: "hotel", nome: "Thermas DiRoma", descricao: "Complexo hoteleiro com parque aquático próprio", endereco: "Caldas Novas, GO", lat: -17.7530, lng: -48.6320, rating: 4.4, capacidade: 350, status: "ativo" },
  { id: "6", tipo: "atracao", nome: "Caldas Aquática", descricao: "Parque aquático de médio porte", endereco: "Caldas Novas, GO", lat: -17.7380, lng: -48.6150, rating: 4.2, capacidade: 1500, status: "ativo" },
  { id: "7", tipo: "atracao", nome: "Splash Diroma", descricao: "Parque aquático integrado ao DiRoma", endereco: "Caldas Novas, GO", lat: -17.7490, lng: -48.6280, rating: 4.3, capacidade: 2000, status: "manutencao" },
  { id: "8", tipo: "ponto_embarque", nome: "Terminal Belo Horizonte", descricao: "Ponto de embarque principal — BH", endereco: "Av. Amazonas, BH, MG", lat: -19.9167, lng: -43.9345, rating: undefined, capacidade: undefined, status: "ativo" },
  { id: "9", tipo: "ponto_embarque", nome: "Terminal Goiânia", descricao: "Ponto de embarque Goiânia", endereco: "Av. Goiás Norte, Goiânia, GO", lat: -16.6864, lng: -49.2643, rating: undefined, capacidade: undefined, status: "ativo" },
  { id: "10", tipo: "ponto_embarque", nome: "Terminal Brasília", descricao: "Ponto de embarque Brasília/DF", endereco: "SGAN 916, Brasília, DF", lat: -15.7801, lng: -47.9292, rating: undefined, capacidade: undefined, status: "inativo" },
];

const TIPO_CONFIG: Record<TipoMarcador, { label: string; cor: string; bg: string; icone: React.ReactNode }> = {
  parque: { label: "Parque Aquático", cor: "#0284c7", bg: "#E0F2FE", icone: <Waves style={{ width: 14, height: 14 }} /> },
  hotel: { label: "Hotel / Resort", cor: "#7c3aed", bg: "#EDE9FE", icone: <Hotel style={{ width: 14, height: 14 }} /> },
  atracao: { label: "Atração", cor: "#16a34a", bg: "#DCFCE7", icone: <Star style={{ width: 14, height: 14 }} /> },
  ponto_embarque: { label: "Ponto de Embarque", cor: "#b45309", bg: "#FEF3C7", icone: <Bus style={{ width: 14, height: 14 }} /> },
};

const STATUS_CONFIG: Record<string, { label: string; cor: string }> = {
  ativo: { label: "Ativo", cor: "#16a34a" },
  inativo: { label: "Inativo", cor: "#9ca3af" },
  manutencao: { label: "Em Manutenção", cor: "#d97706" },
};

export default function MapaAdminPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<import("leaflet").Map | null>(null);
  const markersLayerRef = useRef<import("leaflet").LayerGroup | null>(null);

  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [selecionado, setSelecionado] = useState<MarcadorMapa | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const marcadoresFiltrados = MARCADORES.filter((m) => {
    const matchTipo = filtroTipo === "todos" || m.tipo === filtroTipo;
    const matchStatus = filtroStatus === "todos" || m.status === filtroStatus;
    return matchTipo && matchStatus;
  });

  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      if (leafletMapRef.current) return;

      const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = LEAFLET_CSS;
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current!, {
        center: [-17.75, -48.68],
        zoom: 9,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      leafletMapRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;

    import("leaflet").then((L) => {
      if (!markersLayerRef.current) return;
      markersLayerRef.current.clearLayers();

      marcadoresFiltrados.forEach((m) => {
        const cfg = TIPO_CONFIG[m.tipo];
        const statusCor = STATUS_CONFIG[m.status].cor;

        const icon = L.divIcon({
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${cfg.cor};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
            <div style="transform:rotate(45deg);color:#fff;font-size:13px;">●</div>
          </div>
          <div style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);background:white;border:1px solid ${cfg.cor};border-radius:4px;padding:1px 5px;font-size:10px;white-space:nowrap;font-weight:600;color:${cfg.cor};box-shadow:0 1px 3px rgba(0,0,0,0.15)">${m.nome.length > 16 ? m.nome.substring(0, 15) + "…" : m.nome}</div>`,
        });

        const marker = L.marker([m.lat, m.lng], { icon }).addTo(markersLayerRef.current!);
        marker.on("click", () => setSelecionado(m));
        marker.bindTooltip(m.nome, { direction: "top", offset: [0, -28] });
      });
    });
  }, [marcadoresFiltrados]);

  return (
    <div data-testid="page-mapa-admin" style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "16px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <Link href="/admin/dashboard">
          <button data-testid="button-voltar" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <MapPin style={{ width: 26, height: 26 }} /> Mapa Operacional
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.85 }}>Hotéis, parques, atrações e pontos de embarque</p>
        </div>
        <button
          data-testid="button-toggle-filtros"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}
        >
          <Filter style={{ width: 16, height: 16 }} />
          {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {mostrarFiltros && (
          <div style={{ width: 280, background: "#fff", borderRight: "1px solid #e5e7eb", padding: 20, overflowY: "auto", flexShrink: 0 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>Filtros</h3>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Tipo de Local</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { value: "todos", label: "Todos os tipos" },
                  ...Object.entries(TIPO_CONFIG).map(([key, cfg]) => ({ value: key, label: cfg.label })),
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    data-testid={`filtro-tipo-${value}`}
                    onClick={() => setFiltroTipo(value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: filtroTipo === value ? "#2563EB" : "#e5e7eb",
                      background: filtroTipo === value ? "#EFF6FF" : "#fff",
                      color: filtroTipo === value ? "#2563EB" : "#374151",
                      fontSize: 13,
                      fontWeight: filtroTipo === value ? 700 : 400,
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {value !== "todos" && TIPO_CONFIG[value as TipoMarcador].icone}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Status</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { value: "todos", label: "Todos" },
                  { value: "ativo", label: "Ativo" },
                  { value: "inativo", label: "Inativo" },
                  { value: "manutencao", label: "Em Manutenção" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    data-testid={`filtro-status-${value}`}
                    onClick={() => setFiltroStatus(value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: filtroStatus === value ? "#2563EB" : "#e5e7eb",
                      background: filtroStatus === value ? "#EFF6FF" : "#fff",
                      color: filtroStatus === value ? "#2563EB" : "#374151",
                      fontSize: 13,
                      fontWeight: filtroStatus === value ? 700 : 400,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Legenda</p>
              {Object.entries(TIPO_CONFIG).map(([key, cfg]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: cfg.cor, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#374151" }}>{cfg.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 10 }}>{marcadoresFiltrados.length} locais exibidos</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
                {marcadoresFiltrados.map((m) => {
                  const cfg = TIPO_CONFIG[m.tipo];
                  return (
                    <button
                      key={m.id}
                      data-testid={`lista-local-${m.id}`}
                      onClick={() => {
                        setSelecionado(m);
                        if (leafletMapRef.current) {
                          leafletMapRef.current.flyTo([m.lat, m.lng], 14, { duration: 1 });
                        }
                      }}
                      style={{ background: selecionado?.id === m.id ? cfg.bg : "#f9fafb", border: `1px solid ${selecionado?.id === m.id ? cfg.cor : "#e5e7eb"}`, borderRadius: 6, padding: "6px 10px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.nome}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, position: "relative" }}>
          <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: 500 }} />

          {selecionado && (
            <div
              data-testid="painel-detalhe-local"
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                width: 300,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                zIndex: 1000,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: TIPO_CONFIG[selecionado.tipo].bg, color: TIPO_CONFIG[selecionado.tipo].cor }}>
                      {TIPO_CONFIG[selecionado.tipo].icone} {TIPO_CONFIG[selecionado.tipo].label}
                    </span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{selecionado.nome}</h4>
                </div>
                <button data-testid="button-fechar-detalhe" onClick={() => setSelecionado(null)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <X style={{ width: 18, height: 18, color: "#9ca3af" }} />
                </button>
              </div>

              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>{selecionado.descricao}</p>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <MapPin style={{ width: 14, height: 14, color: "#9ca3af", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>{selecionado.endereco}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                {selecionado.rating !== undefined && (
                  <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "8px 10px" }}>
                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px" }}>Rating</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#d97706", margin: 0 }}>★ {selecionado.rating}</p>
                  </div>
                )}
                {selecionado.capacidade !== undefined && (
                  <div style={{ background: "#F0F9FF", borderRadius: 8, padding: "8px 10px" }}>
                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px" }}>Capacidade</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#0284c7", margin: 0 }}>{selecionado.capacidade.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_CONFIG[selecionado.status].cor, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_CONFIG[selecionado.status].cor }}>{STATUS_CONFIG[selecionado.status].label}</span>
              </div>

              <div style={{ marginTop: 14 }}>
                <button
                  data-testid="button-ver-no-mapa"
                  onClick={() => {
                    if (leafletMapRef.current) {
                      leafletMapRef.current.flyTo([selecionado.lat, selecionado.lng], 15, { duration: 1.2 });
                    }
                  }}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <Eye style={{ width: 14, height: 14 }} /> Centralizar no mapa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
