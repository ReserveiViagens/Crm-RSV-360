import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
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

/* ─── Gamificação ────────────────────────────────────────── */

export const gamificacaoPontos = pgTable("gamificacao_pontos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pontos: integer("pontos").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gamificacaoHistorico = pgTable("gamificacao_historico", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  motivo: text("motivo").notNull(),
  valor: integer("valor").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gamificacaoConquistas = pgTable("gamificacao_conquistas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  conquistaId: text("conquista_id").notNull(),
  desbloqueadaEm: timestamp("desbloqueada_em").notNull().defaultNow(),
});

/* ─── Zod Schemas ────────────────────────────────────────── */

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

/* ─── Enums de Pedido ─────────────────────────────────── */

export const PaymentMethodSchema = z.enum(["PIX", "CARTAO", "DINHEIRO"]);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const OrderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "CANCELLED",
  "EXPIRED",
  "FAILED",
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/* ─── Produto / Ingresso ─────────────────────────────── */

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  unitPrice: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  image: z.string().url().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  comboDates: z.record(z.string()).optional(),
});

export const insertProductSchema = productSchema.omit({ id: true });
export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

/* ─── CartItem ───────────────────────────────────────── */

export const cartItemSchema = z.object({
  ticketId: z.string().min(1),
  name: z.string().min(1),
  unitPrice: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
  comboDates: z.record(z.string()).optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartItemSchema = CartItem;

/* ─── Cliente do Pedido ──────────────────────────────── */

export const orderCustomerSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(11, "CPF inválido")),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "Telefone inválido")),
});

export type OrderCustomer = z.infer<typeof orderCustomerSchema>;

/* ─── Pedido de Ingressos ────────────────────────────── */

export const orderSchema = z.object({
  id: z.string(),
  items: z.array(cartItemSchema).min(1, "Carrinho vazio"),
  customer: orderCustomerSchema,
  totalAmount: z.number().positive(),
  paymentMethod: PaymentMethodSchema,
  status: OrderStatusSchema,
  transactionId: z.string().optional(),
  qrCodeBase64: z.string().optional(),
  copyPasteCode: z.string().optional(),
  expirationDate: z.string().optional(),
  createdAt: z.string(),
});

export const insertOrderSchema = orderSchema.omit({ id: true, createdAt: true });
export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

/* ─── Types ──────────────────────────────────────────────── */

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

export type GamificacaoPontos = typeof gamificacaoPontos.$inferSelect;
export type GamificacaoHistorico = typeof gamificacaoHistorico.$inferSelect;
export type GamificacaoConquista = typeof gamificacaoConquistas.$inferSelect;
