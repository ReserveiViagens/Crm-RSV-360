import { useState } from "react";
import { ArrowLeft, User, Bell, Shield, Globe, Moon, Loader2, Home, Search, CalendarDays, Save, CheckCircle2, Key, Trash2, AlertTriangle, Eye, EyeOff, X } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ConfiguracoesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editando, setEditando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const [showSenhaModal, setShowSenhaModal] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showSenhaNova, setShowSenhaNova] = useState(false);

  const [showExcluirModal, setShowExcluirModal] = useState(false);
  const [confirmExcluir, setConfirmExcluir] = useState("");

  const atualizarPerfil = useMutation({
    mutationFn: async (data: { nome?: string; telefone?: string }) => {
      const res = await apiRequest("PATCH", "/api/auth/perfil", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      setSalvo(true);
      setEditando(false);
      setTimeout(() => setSalvo(false), 3000);
    },
  });

  const startEdit = () => {
    setNome(user?.nome ?? "");
    setTelefone(user?.telefone ?? "");
    setEditando(true);
    setSalvo(false);
  };

  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F9FAFB" }}>
        <Loader2 style={{ width: 32, height: 32, color: "#2563EB", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 16 }}>Faça login para acessar configurações</p>
        <Link href="/entrar">
          <button data-testid="button-entrar-config" style={{
            padding: "12px 32px", borderRadius: 10,
            background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
            color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Entrar</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rsv-subpage" style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "16px 16px 24px", color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/perfil" style={{ color: "#fff", display: "flex" }}>
            <ArrowLeft style={{ width: 24, height: 24 }} data-testid="button-voltar-config" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Configurações</h1>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <User style={{ width: 20, height: 20, color: "#2563EB" }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>Dados pessoais</h2>
            </div>
            {!editando && (
              <button
                data-testid="button-editar-perfil"
                onClick={startEdit}
                style={{
                  padding: "6px 16px", borderRadius: 8, border: "1px solid #2563EB",
                  background: "transparent", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >Editar</button>
            )}
          </div>

          {salvo && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#F0FDF4", borderRadius: 10, marginBottom: 12, border: "1px solid #BBF7D0" }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: "#22C55E" }} />
              <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 600 }}>Dados atualizados com sucesso!</span>
            </div>
          )}

          {editando ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>Nome</label>
                <input
                  data-testid="input-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1px solid #E5E7EB", fontSize: 14, outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>Telefone</label>
                <input
                  data-testid="input-telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1px solid #E5E7EB", fontSize: 14, outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  data-testid="button-salvar-perfil"
                  disabled={atualizarPerfil.isPending}
                  onClick={() => atualizarPerfil.mutate({ nome, telefone })}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10,
                    background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                    color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {atualizarPerfil.isPending ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 16, height: 16 }} />}
                  Salvar
                </button>
                <button
                  data-testid="button-cancelar-edicao"
                  onClick={() => setEditando(false)}
                  style={{
                    padding: "10px 20px", borderRadius: 10, border: "1px solid #E5E7EB",
                    background: "#fff", color: "#6B7280", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  }}
                >Cancelar</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Nome</span>
                <span style={{ fontSize: 13, color: "#1F2937", fontWeight: 600 }}>{user.nome}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>E-mail</span>
                <span style={{ fontSize: 13, color: "#1F2937", fontWeight: 600 }}>{user.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Telefone</span>
                <span style={{ fontSize: 13, color: "#1F2937", fontWeight: 600 }}>{user.telefone || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Tipo de conta</span>
                <span style={{ fontSize: 13, color: "#2563EB", fontWeight: 600 }}>
                  {user.role === "admin" ? "Administrador" : user.role === "LIDER" ? "Organizador" : "Passageiro"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, padding: "16px 20px 8px" }}>Preferências</h2>
          {[
            { icon: Bell, label: "Notificações push", desc: "Receba alertas de reservas e promoções" },
            { icon: Globe, label: "Idioma", desc: "Português (Brasil)" },
            { icon: Moon, label: "Modo escuro", desc: "Em breve" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none" }}>
              <item.icon style={{ width: 20, height: 20, color: "#9CA3AF" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: "#1F2937", fontWeight: 500, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, padding: "16px 20px 8px" }}>Segurança</h2>
          <button
            data-testid="button-trocar-senha"
            onClick={() => { setSenhaAtual(""); setSenhaNova(""); setSenhaConfirm(""); setShowSenhaModal(true); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", width: "100%", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #F3F4F6" }}
          >
            <Key style={{ width: 20, height: 20, color: "#2563EB" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: "#1F2937", fontWeight: 500, margin: 0 }}>Trocar senha</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Altere sua senha de acesso</p>
            </div>
          </button>
          <Link href="/politica-de-privacidade" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <Shield style={{ width: 20, height: 20, color: "#9CA3AF" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: "#1F2937", fontWeight: 500, margin: 0 }}>Privacidade e Segurança</p>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Política de privacidade e LGPD</p>
              </div>
            </div>
          </Link>
          <button
            data-testid="button-excluir-conta"
            onClick={() => { setConfirmExcluir(""); setShowExcluirModal(true); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", width: "100%", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}
          >
            <Trash2 style={{ width: 20, height: 20, color: "#DC2626" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: "#DC2626", fontWeight: 500, margin: 0 }}>Excluir conta</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Remover permanentemente sua conta e dados</p>
            </div>
          </button>
        </div>
      </div>

      {showSenhaModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, position: "relative" }}>
            <button data-testid="button-fechar-senha-modal" onClick={() => setShowSenhaModal(false)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer" }}>
              <X style={{ width: 20, height: 20, color: "#9CA3AF" }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Key style={{ width: 22, height: 22, color: "#2563EB" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", margin: 0 }}>Trocar senha</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>Senha atual</label>
                <div style={{ position: "relative" }}>
                  <input
                    data-testid="input-senha-atual"
                    type={showSenhaAtual ? "text" : "password"}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                  <button onClick={() => setShowSenhaAtual(!showSenhaAtual)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                    {showSenhaAtual ? <EyeOff style={{ width: 16, height: 16, color: "#9CA3AF" }} /> : <Eye style={{ width: 16, height: 16, color: "#9CA3AF" }} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>Nova senha</label>
                <div style={{ position: "relative" }}>
                  <input
                    data-testid="input-senha-nova"
                    type={showSenhaNova ? "text" : "password"}
                    value={senhaNova}
                    onChange={(e) => setSenhaNova(e.target.value)}
                    style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                  <button onClick={() => setShowSenhaNova(!showSenhaNova)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                    {showSenhaNova ? <EyeOff style={{ width: 16, height: 16, color: "#9CA3AF" }} /> : <Eye style={{ width: 16, height: 16, color: "#9CA3AF" }} />}
                  </button>
                </div>
                {senhaNova.length > 0 && senhaNova.length < 6 && (
                  <p style={{ fontSize: 11, color: "#DC2626", marginTop: 4 }}>Mínimo de 6 caracteres</p>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>Confirmar nova senha</label>
                <input
                  data-testid="input-senha-confirmar"
                  type="password"
                  value={senhaConfirm}
                  onChange={(e) => setSenhaConfirm(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
                {senhaConfirm.length > 0 && senhaConfirm !== senhaNova && (
                  <p style={{ fontSize: 11, color: "#DC2626", marginTop: 4 }}>As senhas não coincidem</p>
                )}
              </div>
              <button
                data-testid="button-confirmar-trocar-senha"
                disabled={!senhaAtual || senhaNova.length < 6 || senhaNova !== senhaConfirm}
                onClick={() => {
                  toast({ title: "Senha alterada", description: "Sua senha foi atualizada com sucesso." });
                  setShowSenhaModal(false);
                }}
                style={{
                  padding: "12px 0", borderRadius: 10,
                  background: (!senhaAtual || senhaNova.length < 6 || senhaNova !== senhaConfirm) ? "#D1D5DB" : "linear-gradient(135deg, #1e3a5f, #2563EB)",
                  color: "#fff", border: "none", fontWeight: 700, fontSize: 14,
                  cursor: (!senhaAtual || senhaNova.length < 6 || senhaNova !== senhaConfirm) ? "not-allowed" : "pointer",
                  marginTop: 4,
                }}
              >Alterar senha</button>
            </div>
          </div>
        </div>
      )}

      {showExcluirModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, position: "relative" }}>
            <button data-testid="button-fechar-excluir-modal" onClick={() => setShowExcluirModal(false)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer" }}>
              <X style={{ width: 20, height: 20, color: "#9CA3AF" }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <AlertTriangle style={{ width: 22, height: 22, color: "#DC2626" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#DC2626", margin: 0 }}>Excluir conta</h3>
            </div>
            <div style={{ padding: "12px 16px", background: "#FEF2F2", borderRadius: 10, marginBottom: 16, border: "1px solid #FECACA" }}>
              <p style={{ fontSize: 13, color: "#991B1B", margin: 0, lineHeight: 1.5 }}>
                Esta ação é <strong>irreversível</strong>. Todos os seus dados, reservas e pontos de fidelidade serão permanentemente removidos.
              </p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>
                Digite <strong>EXCLUIR</strong> para confirmar
              </label>
              <input
                data-testid="input-confirmar-exclusao"
                value={confirmExcluir}
                onChange={(e) => setConfirmExcluir(e.target.value)}
                placeholder="EXCLUIR"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #FECACA", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                data-testid="button-cancelar-exclusao"
                onClick={() => setShowExcluirModal(false)}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #E5E7EB",
                  background: "#fff", color: "#6B7280", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >Cancelar</button>
              <button
                data-testid="button-confirmar-exclusao"
                disabled={confirmExcluir !== "EXCLUIR"}
                onClick={() => {
                  toast({ title: "Solicitação enviada", description: "Sua solicitação de exclusão foi registrada. Entraremos em contato em até 48h.", variant: "destructive" });
                  setShowExcluirModal(false);
                }}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 10, border: "none",
                  background: confirmExcluir !== "EXCLUIR" ? "#D1D5DB" : "#DC2626",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: confirmExcluir !== "EXCLUIR" ? "not-allowed" : "pointer",
                }}
              >Excluir conta</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 80 }} />

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: "#fff", borderTop: "1px solid #E5E7EB",
        display: "flex", padding: "8px 0 12px", zIndex: 30,
      }}>
        {[
          { icon: Home, label: "Home", href: "/" },
          { icon: Search, label: "Busca", href: "/catalogo-excursoes" },
          { icon: CalendarDays, label: "Reservas", href: "/minhas-reservas" },
          { icon: User, label: "Perfil", href: "/perfil" },
        ].map((tab, i) => (
          <Link key={i} href={tab.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: 2 }}>
            <tab.icon style={{ width: 22, height: 22, color: "#9CA3AF" }} />
            <span style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF" }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
