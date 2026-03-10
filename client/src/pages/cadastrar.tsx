import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye, EyeOff, MapPin, ArrowLeft, Loader2,
  User, Mail, Phone, Lock, CheckCircle2,
} from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRegister } from "@/hooks/use-auth";
import { registerSchema } from "@shared/schema";

type RegisterForm = z.infer<typeof registerSchema>;

const BENEFITS = [
  "Ofertas exclusivas para membros",
  "Rastreie suas reservas em tempo real",
  "Suporte via WhatsApp 24h",
];

export default function CadastrarPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const register = useRegister();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      confirmarSenha: "",
      termos: false,
    },
  });

  const onSubmit = (data: RegisterForm) => {
    register.mutate(data, {
      onError: (err: any) => {
        toast({ title: "Erro no cadastro", description: err.message, variant: "destructive" });
      },
    });
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column" }}>
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "20px 20px 60px",
      }}>
        <Link href="/entrar" style={{ color: "#fff", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, textDecoration: "none" }}>
          <ArrowLeft style={{ width: 20, height: 20 }} />
          <span style={{ fontSize: 14 }}>Voltar</span>
        </Link>

        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)", margin: "0 auto 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MapPin style={{ width: 28, height: 28, color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
            Crie sua conta grátis
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>
            Junte-se a milhares de viajantes em Caldas Novas
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
          {BENEFITS.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 style={{ width: 14, height: 14, color: "#34D399" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 20px 40px", marginTop: -32 }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: 28,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)", maxWidth: 440, margin: "0 auto",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 20px" }}>Suas informações</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "#374151", fontWeight: 600, fontSize: 13 }}>Nome completo</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <User style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" }} />
                        <Input {...field} placeholder="Seu nome completo" data-testid="input-nome" style={{ paddingLeft: 40 }} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "#374151", fontWeight: 600, fontSize: 13 }}>E-mail</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" }} />
                        <Input {...field} type="email" placeholder="seu@email.com" data-testid="input-email" style={{ paddingLeft: 40 }} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "#374151", fontWeight: 600, fontSize: 13 }}>WhatsApp / Telefone</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Phone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" }} />
                        <Input
                          {...field}
                          placeholder="(62) 99999-9999"
                          data-testid="input-telefone"
                          style={{ paddingLeft: 40 }}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
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
                    <FormLabel style={{ color: "#374151", fontWeight: 600, fontSize: 13 }}>Senha</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" }} />
                        <Input
                          {...field}
                          type={showPass ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          data-testid="input-senha"
                          style={{ paddingLeft: 40, paddingRight: 40 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}
                        >
                          {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "#374151", fontWeight: 600, fontSize: 13 }}>Confirmar senha</FormLabel>
                    <FormControl>
                      <div style={{ position: "relative" }}>
                        <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9CA3AF" }} />
                        <Input
                          {...field}
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repita a senha"
                          data-testid="input-confirmar-senha"
                          style={{ paddingLeft: 40, paddingRight: 40 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}
                        >
                          {showConfirm ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termos"
                render={({ field }) => (
                  <FormItem>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4 }}>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-termos"
                          style={{ marginTop: 2, flexShrink: 0 }}
                        />
                      </FormControl>
                      <span style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
                        Li e concordo com os{" "}
                        <Link href="/politica-de-privacidade" style={{ color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
                          Termos de Uso e Política de Privacidade
                        </Link>
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={register.isPending}
                data-testid="button-cadastrar"
                style={{
                  width: "100%", height: 48,
                  background: "linear-gradient(135deg, #F57C00 0%, #EF4444 100%)",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  marginTop: 6,
                }}
              >
                {register.isPending ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : null}
                {register.isPending ? "Criando conta..." : "Criar conta grátis"}
              </Button>

              <div style={{ textAlign: "center", fontSize: 14, color: "#6B7280" }}>
                Já tem conta?{" "}
                <Link href="/entrar" style={{ color: "#2563EB", fontWeight: 700, textDecoration: "none" }} data-testid="link-entrar">
                  Entrar
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
