import { useState } from "react";
import { ArrowLeft, HelpCircle, MessageCircle, ChevronDown, ChevronUp, Send, Home, Search, CalendarDays, User, CheckCircle2, Clock, AlertCircle, ExternalLink, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

type BottomTab = {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
};

type StatusChamado = "aberto" | "em_andamento" | "resolvido";

type Chamado = {
  id: string;
  assunto: string;
  categoria: string;
  data: string;
  status: StatusChamado;
  ultimaMensagem: string;
};

const BOTTOM_TABS: BottomTab[] = [
  { icon: Home, label: "Home", href: "/", active: false },
  { icon: Search, label: "Busca", href: "/catalogo-excursoes", active: false },
  { icon: CalendarDays, label: "Reservas", href: "/minhas-reservas", active: false },
  { icon: User, label: "Perfil", href: "/perfil", active: false },
];

const FAQ_ITEMS = [
  {
    id: "faq-1",
    pergunta: "Como cancelo ou altero minha reserva?",
    resposta: "Para cancelar ou alterar sua reserva, acesse 'Minhas Reservas', selecione a reserva desejada e clique em 'Gerenciar'. Cancelamentos feitos com mais de 7 dias de antecedência têm reembolso integral. Entre 3 e 7 dias, 50% de reembolso. Menos de 3 dias, não há reembolso.",
  },
  {
    id: "faq-2",
    pergunta: "Como funciona o parcelamento?",
    resposta: "Aceitamos pagamento em até 12x no cartão de crédito com pequena taxa de juros a partir de 3x. Para pagamentos à vista via Pix, oferecemos 5% de desconto adicional. O valor da parcela mínima é de R$ 50,00.",
  },
  {
    id: "faq-3",
    pergunta: "Os ingressos têm data de validade?",
    resposta: "Sim. Os ingressos comprados têm validade de 90 dias a partir da data de compra, salvo quando uma data específica foi selecionada no momento da compra. Você pode consultar e transferir as datas no menu 'Meus Ingressos'.",
  },
  {
    id: "faq-4",
    pergunta: "Como funciona o programa de pontos?",
    resposta: "A cada R$ 1,00 gasto em reservas e ingressos, você acumula 1 ponto RSV. Os pontos podem ser trocados por descontos em futuras compras (100 pontos = R$ 1,00) ou por upgrades de quarto e experiências exclusivas. Pontos expiram após 12 meses sem movimentação.",
  },
  {
    id: "faq-5",
    pergunta: "O que está incluso na excursão?",
    resposta: "As excursões incluem transporte (saída do ponto de embarque escolhido), hospedagem com café da manhã, ingressos nos parques indicados no pacote e assistência do guia RSV360. Refeições do almoço e jantar são por conta do viajante, salvo quando indicado 'all inclusive'.",
  },
  {
    id: "faq-6",
    pergunta: "Como entro em contato com meu guia/organizador?",
    resposta: "Após a confirmação da reserva, você receberá o contato do seu organizador RSV360 via WhatsApp. Também é possível acessar o chat do organizador diretamente na tela de detalhes da sua reserva.",
  },
  {
    id: "faq-7",
    pergunta: "Quais são as formas de pagamento aceitas?",
    resposta: "Aceitamos cartão de crédito (Visa, Mastercard, Elo, American Express), cartão de débito, Pix e boleto bancário. Pagamentos via boleto têm prazo de compensação de até 2 dias úteis.",
  },
];

const CATEGORIAS = ["Selecione uma categoria", "Reservas e Check-in", "Pagamentos e Reembolso", "Ingressos e Parques", "Excursões e Guias", "Programa de Pontos", "Problemas Técnicos", "Outros"];

const STATUS_CHAMADO: Record<StatusChamado, { label: string; cor: string; bg: string; icon: LucideIcon }> = {
  aberto: { label: "Aberto", cor: "#F57C00", bg: "#FFF7ED", icon: AlertCircle },
  em_andamento: { label: "Em andamento", cor: "#2563EB", bg: "#EFF6FF", icon: Clock },
  resolvido: { label: "Resolvido", cor: "#22C55E", bg: "#F0FDF4", icon: CheckCircle2 },
};

const MOCK_CHAMADOS: Chamado[] = [
  {
    id: "SUP-2024-015",
    assunto: "Dúvida sobre reembolso do cancelamento",
    categoria: "Pagamentos e Reembolso",
    data: "2024-03-20",
    status: "em_andamento",
    ultimaMensagem: "Nossa equipe está analisando seu pedido e responderá em até 24h.",
  },
  {
    id: "SUP-2024-008",
    assunto: "Ingresso não aparece na minha conta",
    categoria: "Ingressos e Parques",
    data: "2024-02-14",
    status: "resolvido",
    ultimaMensagem: "Problema resolvido! Os ingressos foram adicionados à sua conta.",
  },
];

const fmtData = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

export default function SuportePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [faqAberto, setFaqAberto] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"faq" | "contato" | "chamados">("faq");
  const [form, setForm] = useState({ nome: user?.nome ?? "", email: user?.email ?? "", categoria: "Selecione uma categoria", mensagem: "" });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.categoria === "Selecione uma categoria") {
      toast({ title: "Atenção", description: "Selecione uma categoria para continuar.", variant: "destructive" });
      return;
    }
    if (!form.mensagem.trim() || form.mensagem.trim().length < 20) {
      toast({ title: "Atenção", description: "Descreva seu problema com pelo menos 20 caracteres.", variant: "destructive" });
      return;
    }
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setForm({ ...form, mensagem: "", categoria: "Selecione uma categoria" });
      toast({ title: "Mensagem enviada!", description: "Protocolo gerado. Nossa equipe responderá em até 24h no e-mail cadastrado." });
    }, 1200);
  };

  return (
    <div data-testid="page-suporte" style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)", padding: "16px 16px 24px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Link href="/perfil" style={{ color: "#fff", display: "flex" }}>
            <ArrowLeft style={{ width: 24, height: 24 }} data-testid="button-voltar-suporte" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Central de Suporte</h1>
        </div>

        <a
          href="https://wa.me/5562999999999?text=Ol%C3%A1%2C+preciso+de+ajuda+com+minha+reserva+RSV360"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="button-whatsapp-suporte"
          style={{ display: "flex", alignItems: "center", gap: 10, background: "#25D366", borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "#fff" }}
        >
          <MessageCircle style={{ width: 22, height: 22, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Falar com Suporte no WhatsApp</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>Atendimento seg–sex, 8h às 20h</div>
          </div>
          <ExternalLink style={{ width: 16, height: 16, opacity: 0.8 }} />
        </a>
      </div>

      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        {(["faq", "contato", "chamados"] as const).map((aba) => {
          const labels = { faq: "FAQ", contato: "Contato", chamados: "Chamados" };
          const ativo = abaAtiva === aba;
          return (
            <button
              key={aba}
              data-testid={`aba-${aba}`}
              onClick={() => setAbaAtiva(aba)}
              style={{ flex: 1, padding: "12px 8px", border: "none", background: "transparent", fontSize: 13, fontWeight: ativo ? 700 : 500, color: ativo ? "#2563EB" : "#6B7280", cursor: "pointer", borderBottom: ativo ? "2px solid #2563EB" : "2px solid transparent", transition: "all 0.2s" }}
            >
              {labels[aba]}
              {aba === "chamados" && MOCK_CHAMADOS.filter(c => c.status !== "resolvido").length > 0 && (
                <span style={{ marginLeft: 6, background: "#F57C00", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  {MOCK_CHAMADOS.filter(c => c.status !== "resolvido").length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "16px 16px 100px" }}>
        {abaAtiva === "faq" && (
          <div data-testid="painel-faq">
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 14 }}>Perguntas frequentes dos nossos viajantes</p>
            {FAQ_ITEMS.map((item) => {
              const aberto = faqAberto === item.id;
              return (
                <div key={item.id} data-testid={`faq-${item.id}`} style={{ background: "#fff", borderRadius: 12, marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <button
                    onClick={() => setFaqAberto(aberto ? null : item.id)}
                    style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}
                    data-testid={`faq-toggle-${item.id}`}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
                      <HelpCircle style={{ width: 16, height: 16, color: "#2563EB", flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", lineHeight: 1.4 }}>{item.pergunta}</span>
                    </div>
                    {aberto
                      ? <ChevronUp style={{ width: 16, height: 16, color: "#9CA3AF", flexShrink: 0 }} />
                      : <ChevronDown style={{ width: 16, height: 16, color: "#9CA3AF", flexShrink: 0 }} />}
                  </button>
                  {aberto && (
                    <div data-testid={`faq-resposta-${item.id}`} style={{ padding: "0 16px 14px 42px" }}>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{item.resposta}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {abaAtiva === "contato" && (
          <div data-testid="painel-contato">
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>Preencha o formulário e responderemos em até 24h úteis.</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Nome</label>
                <input
                  data-testid="input-nome-suporte"
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                  placeholder="Seu nome completo"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, color: "#1F2937", background: "#fff", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>E-mail</label>
                <input
                  data-testid="input-email-suporte"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="seu@email.com"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, color: "#1F2937", background: "#fff", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Categoria</label>
                <select
                  data-testid="select-categoria-suporte"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, color: form.categoria === "Selecione uma categoria" ? "#9CA3AF" : "#1F2937", background: "#fff", boxSizing: "border-box", appearance: "none" }}
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c} disabled={c === "Selecione uma categoria"}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Mensagem</label>
                <textarea
                  data-testid="input-mensagem-suporte"
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  required
                  rows={5}
                  placeholder="Descreva seu problema ou dúvida em detalhes..."
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, color: "#1F2937", background: "#fff", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                />
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{form.mensagem.length} / min. 20 caracteres</span>
              </div>
              <button
                type="submit"
                data-testid="button-enviar-suporte"
                disabled={enviando}
                style={{ padding: "13px 0", borderRadius: 12, background: "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: enviando ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: enviando ? 0.7 : 1 }}
              >
                {enviando ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <Send style={{ width: 16, height: 16 }} />
                    Enviar mensagem
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {abaAtiva === "chamados" && (
          <div data-testid="painel-chamados">
            {!user ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <HelpCircle style={{ width: 48, height: 48, color: "#D1D5DB", margin: "0 auto 12px" }} />
                <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>Faça login para ver seus chamados</p>
                <Link href="/entrar">
                  <button style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Entrar
                  </button>
                </Link>
              </div>
            ) : MOCK_CHAMADOS.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <CheckCircle2 style={{ width: 48, height: 48, color: "#22C55E", margin: "0 auto 12px" }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Nenhum chamado aberto</p>
                <p style={{ fontSize: 12, color: "#9CA3AF" }}>Tudo certo por aqui! Se precisar de ajuda, use o formulário de contato.</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 14 }}>
                  {MOCK_CHAMADOS.filter(c => c.status !== "resolvido").length} chamado{MOCK_CHAMADOS.filter(c => c.status !== "resolvido").length !== 1 ? "s" : ""} em aberto
                </p>
                {MOCK_CHAMADOS.map((c) => {
                  const cfg = STATUS_CHAMADO[c.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={c.id} data-testid={`card-chamado-${c.id}`} style={{ background: "#fff", borderRadius: 14, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                      <div style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", margin: "0 0 2px" }}>{c.assunto}</p>
                            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{c.id} · {fmtData(c.data)}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, background: cfg.bg, padding: "4px 10px", borderRadius: 8, flexShrink: 0 }}>
                            <StatusIcon style={{ width: 13, height: 13, color: cfg.cor }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: cfg.cor }}>{cfg.label}</span>
                          </div>
                        </div>
                        <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
                          <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 2px", fontWeight: 600 }}>Última atualização:</p>
                          <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.4 }}>{c.ultimaMensagem}</p>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <span style={{ fontSize: 10, background: "#F3F4F6", color: "#6B7280", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{c.categoria}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", padding: "8px 0 12px", zIndex: 30 }}>
        {BOTTOM_TABS.map((tab, i) => (
          <Link key={i} href={tab.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: 2 }}>
            <tab.icon style={{ width: 22, height: 22, color: tab.active ? "#2563EB" : "#9CA3AF" }} />
            <span style={{ fontSize: 10, fontWeight: tab.active ? 700 : 500, color: tab.active ? "#2563EB" : "#9CA3AF" }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
