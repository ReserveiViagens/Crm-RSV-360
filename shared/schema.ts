import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull().default(""),
  nome: text("nome").notNull().default(""),
  email: text("email").notNull().unique(),
  telefone: text("telefone").notNull().default(""),
  cpf: text("cpf").notNull().default(""),
  role: text("role").notNull().default("user"),
  googleId: text("google_id").default(""),
  fotoUrl: text("foto_url").default(""),
  provider: text("provider").notNull().default("local"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const registerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().optional().transform(v => v?.replace(/\D/g, "") ?? ""),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  confirmarSenha: z.string(),
  termos: z.boolean().refine((v) => v === true, "Aceite os termos para continuar"),
}).refine((d) => d.senha === d.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export const loginSchema = z.object({
  identificador: z.string().min(1, "Informe seu e-mail, telefone ou CPF"),
  senha: z.string().min(1, "Informe a senha"),
});

export const atividadeWizardSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  icone: z.string().optional(),
});

export const insertAtividadeWizardSchema = atividadeWizardSchema.omit({ id: true });

export type AtividadeWizard = {
  id: string;
  label: string;
  descricao: string;
  icone?: string;
};

export type InsertAtividadeWizard = z.infer<typeof insertAtividadeWizardSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
