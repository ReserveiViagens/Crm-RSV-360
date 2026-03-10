import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye, EyeOff, MapPin, ArrowLeft, Loader2,
  Lock, AtSign, Phone, CreditCard, Chrome,
} from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema } from "@shared/schema";

type LoginForm = z.infer<typeof loginSchema>;

type FieldType = "email" | "telefone" | "cpf" | "desconhecido";

function detectFieldType(value: string): FieldType {
  if (!value) return "desconhecido";
  if (value.includes("@")) return "email";
  const digits = value.replace(/\D/g, "");
  // Has parens = phone format (62) 9...
  if (value.includes("(")) return "telefone";
  // CPF formatted: 000.000.000-00
  if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value.trim())) return "cpf";
  // 11 raw digits without hyphen = CPF; 10-11 digits with hyphen = phone
  if (value.includes("-") && digits.length >= 10) return "telefone";
  if (digits.length === 11) return "cpf";
  if (digits.length === 10) return "telefone";
  return "desconhecido";
}

const FIELD_CONFIG: Record<FieldType, { label: string; placeholder: string; icon: any; cor: string; bg: string }> = {
  email: { label: "E-mail detectado", placeholder: "seu@email.com", icon: AtSign, cor: "#2563EB", bg: "#EFF6FF" },
  telefone: { label: "Telefone detectado", placeholder: "(62) 99999-9999", icon: Phone, cor: "#059669", bg: "#ECFDF5" },
  cpf: { label: "CPF detectado", placeholder: "000.000.000-00", icon: CreditCard, cor: "#7C3AED", bg: "#F5F3FF" },
  desconhecido: { label: "", placeholder: "E-mail, telefone ou CPF", icon: AtSign, cor: "#9CA3AF", bg: "transparent" },
};

export default function EntrarPage() {
  const [showPass, setShowPass] = useState(false);
  const [fieldType, setFieldType] = useState<FieldType>("desconhecido");
  const [googleConfigured, setGoogleConfigured] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();
  const login = useLogin();

  useEffect(() => {
    fetch("/api/auth/google/status").then(r => r.json()).then(d => setGoogleConfigured(d.configured));

    const params = new URLSearchParams(window.location.search);
    const erro = params.get("erro");
    if (erro === "google-nao-configurado") {
      toast({ title: "Google não configurado", description: "Peça ao administrador para configurar o login com Google.", variant: "destructive" });
    }
  }, []);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identificador: "", senha: "" },
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate(data, {
      onError: (err: any) => {
        toast({ title: "Erro ao entrar", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleIdentifierChange = (value: string) => {
    form.setValue("identificador", value);
    setFieldType(detectFieldType(value));
  };

  const config = FIELD_CONFIG[fieldType];
  const Icon = config.icon;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column" }}>
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "20px 20px 60px",
      }}>
        <Link href="/" style={{ color: "#fff", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, textDecoration: "none" }}>
          <ArrowLeft style={{ width: 20, height: 20 }} />
          <span style={{ fontSize: 14 }}>Início</span>
        </Link>

        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)", margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MapPin style={{ width: 28, height: 28, color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
            RSV<span style={{ color: "#F57C00" }}>360</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: 0 }}>
            Sua porta de entrada para Caldas Novas
          </p>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 20px 40px", marginTop: -32 }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: 28,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)", maxWidth: 440, margin: "0 auto",
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: "0 0 4px" }}>Bem-vindo de volta!</h2>
          <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>
            Entre com e-mail, CPF ou telefone
          </p>

          {/* Social Login */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <a
              href="/api/auth/google"
              data-testid="button-google"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E5E7EB",
                background: "#fff", textDecoration: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 600, color: "#374151",
                transition: "all 0.15s",
              }}
            >
              <SiGoogle style={{ width: 18, height: 18, color: "#EA4335" }} />
              Continuar com Google
              {!googleConfigured && (
                <span style={{ fontSize: 10, background: "#FEF3C7", color: "#92400E", padding: "2px 6px", borderRadius: 6, marginLeft: "auto" }}>
                  Configurar
                </span>
              )}
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>ou entre com sua conta</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <FormField
                control={form.control}
                name="identificador"
                render={({ field }) => (
                  <FormItem>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <FormLabel style={{ color: "#374151", fontWeight: 600, fontSize: 13 }}>Login</FormLabel>
                      {fieldType !== "desconhecido" && (
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: config.cor,
                          background: config.bg, padding: "2px 8px", borderRadius: 6,
                        }}>
                          {config.label}
                        </span>
                      )}
                    </div>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Icon style={{
                          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                          width: 16, height: 16,
                          color: fieldType !== "desconhecido" ? config.cor : "#9CA3AF",
                          transition: "color 0.2s",
                        }} />
                        <Input
                          {...field}
                          placeholder={config.placeholder}
                          data-testid="input-identificador"
                          style={{
                            paddingLeft: 40,
                            borderColor: fieldType !== "desconhecido" ? config.cor : undefined,
                            transition: "border-color 0.2s",
                          }}
                          onChange={(e) => handleIdentifierChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <FormLabel style={{ color: "#374151", fontWeight: 600, fontSize: 13 }}>Senha</FormLabel>
                      <button type="button" style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                        Esqueci minha senha
                      </button>
                    </div>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" }} />
                        <Input
                          {...field}
                          type={showPass ? "text" : "password"}
                          placeholder="••••••••"
                          data-testid="input-senha"
                          style={{ paddingLeft: 40, paddingRight: 40 }}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }} data-testid="toggle-password">
                          {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={login.isPending}
                data-testid="button-entrar"
                style={{
                  width: "100%", height: 48,
                  background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4,
                }}
              >
                {login.isPending ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : null}
                {login.isPending ? "Entrando..." : "Entrar"}
              </Button>

              <div style={{ textAlign: "center", fontSize: 14, color: "#6B7280" }}>
                Ainda não tem conta?{" "}
                <Link href="/cadastrar" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }} data-testid="link-cadastrar">
                  Cadastre-se grátis
                </Link>
              </div>
            </form>
          </Form>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#9CA3AF", maxWidth: 440, margin: "24px auto 0" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <AtSign style={{ width: 12, height: 12 }} /> E-mail
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Phone style={{ width: 12, height: 12 }} /> Telefone
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <CreditCard style={{ width: 12, height: 12 }} /> CPF
            </span>
          </div>
          Ao entrar, você concorda com nossos{" "}
          <Link href="/politica-de-privacidade" style={{ color: "#2563EB", textDecoration: "none" }}>Termos e Privacidade</Link>
        </div>
      </div>
    </div>
  );
}
