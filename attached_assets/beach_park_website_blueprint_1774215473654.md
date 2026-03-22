# Beach Park E-commerce Ticketing Blueprint

This document is a comprehensive functional blueprint derived from the provided diagnostic document and interface screenshots. It serves as a structural specification for building a custom ticketing platform with paridade funcional (functional parity) to the Beach Park system.

## 1. Site Architecture & Navigation Flow

### Core Routes
- **Product Detail Page (PDP):** `/aqua-park/p` (Main ticketing page)
- **Cart/Checkout:** `/checkout/cart`
- **Customer Authentication:** `/customer/account/login`, `/customer/account/create`
- **Customer History:** `/sales/order/history`

### Funnel Flow
1. **Landing/Selection:** User enters domain and chooses the park (Aqua Park, Arvorar).
2. **PDP Access:** Navigates to `/aqua-park/p`.
3. **Date Selection:** Mandatory step before viewing prices. User selects date and clicks "Buscar Valores".
4. **Product Catalog Display:** System shows dynamic pricing based on date. Categories: 1 dia, passaportes, combos, especiais, cabanas.
5. **Configuration (Sub-flows):** For 2+ days or Combos, user selects additional dates.
6. **Cart Addition:** Item added to cart.
7. **Checkout & Auth:** User proceeds to checkout, logs in (Email/Google/Apple) or registers.
8. **Payment:** Selects payment method (Pix, Cartão de Crédito, etc.).
9. **Post-Purchase:** E-mail sent with voucher, order managed in "Meus Ingressos".

---

## 2. Product Catalog & Pricing Structure

Prices are dynamic based on the selected date. The below represents a snapshot from the provided screenshots.

### Ingressos (1 Dia)
| Produto | Preço Pix | Preço Cartão (até 10x) |
|---|---|---|
| Ingresso Adulto | R$ 265,00 | R$ 275,00 |
| Ingresso Criança | R$ 255,00 | R$ 265,00 |

### Passaportes
| Produto | Preço Pix | Preço Cartão (até 10x) | Detalhes |
|---|---|---|---|
| Passaporte 2 dias | R$ 399,00 | R$ 419,00 | Requer escolha de 2 datas |
| Passaporte Insano | R$ 469,00 | R$ 489,00 | 10 entradas, regras de validade aplicáveis |

### Combos (Aqua Park + Parque Arvorar)
| Produto | Preço Pix | Preço Cartão (até 10x) |
|---|---|---|
| 1 Dia Aqua + Arvorar | R$ 359,00 | R$ 379,00 |
| Passaporte 2 dias (Aqua + Arvorar) | R$ 498,00 | R$ 518,00 |
| Passaporte 10 dias (Aqua + Arvorar) | R$ 558,00 | R$ 578,00 |

### Ingressos Especiais (Meia Entrada / Benefícios Legais)
| Produto | Preço Pix | Preço Cartão (até 10x) | Regras |
|---|---|---|---|
| Ingresso PCD | R$ 160,00 | R$ 160,00 | Exige documentação na entrada |
| Ingresso Idoso | R$ 160,00 | R$ 160,00 | Exige documentação na entrada |
| Ingresso Gestante | R$ 160,00 | R$ 160,00 | Exige documentação na entrada |

### Add-ons (Cabanas)
*Note: Depending on date, these items show "Data Esgotada". They act as capacity-controlled add-ons.*
- Cabana Arrepius
- Cabana Continente
- Cabana Ilha
- Cabana Aruba
- Cabana Coqueiros (Novidade)

---

## 3. Business & Operational Rules

### Pricing & Availability
- **Date-Driven Pricing:** The date acts as the primary filter. Prices dynamically adjust based on the selected date.
- **Online vs. Box Office:** Differentiation in pricing to encourage online sales.
- **Payment Incentives:** Pix purchases receive a visible discount compared to Credit Card purchases.
- **Same-Day Purchases:** Often restrict payment methods to Pix to avoid chargebacks or operational delays.

### Cart & Checkout Logic
- **Cart Limit:** Maximum of 10 tickets/passports per order.
- **Complex Products (Passports & Combos):** 
  - 2-Day Passports require selecting 2 dates.
  - Combos spanning multiple parks require querying availability across distinct park calendars.
- **Rescheduling:** Permitted within validity periods and subject to availability (may involve paying fare differences).

### Checkout Requirements
- **Contact Info:** E-mail (Primary Key), Phone Number.
- **Personal Info:** First Name, Last Name, CPF.
- **Address:** Country, CEP, State, City, Address Line, Number, Neighborhood, Complement.
- **Payment Options:** Pix, Cartão de Crédito, Apple Pay, Samsung Pay (up to 10x sem juros).
- **Authentication:** Passwordless or Social Auth (Google, Apple) heavily prioritized for low-friction conversion.

---

## 4. Interface Elements & Page Modules

### 4.1. Header & Navigation
- **Promotional Bar:** "Desconto para pagamento via Pix", "Economize comprando pelo site", "Parcele em até 10x sem juros", "Acesso 1h antes (hóspedes)".
- **Navigation Tabs:** Aqua Park, Arvorar.
- **User Actions:** Minha Conta, Meus Ingressos.

### 4.2. Product Detail Page (PDP)
- **Hero/Header:** Direct and functional ("Vem curtir o melhor PARQUE AQUÁTICO").
- **Date Selector Component:** Mandatory field with a "Buscar Valores" button. Must be highly reactive.
- **Product Listing:**
  - Grouped by categories (1 Dia, Passaportes, Combos, etc.).
  - **Product Card UI:** Product Name, Pix Price, Cartão Price, Benefits summary, Availability Status ("Data Esgotada" or "+/-" quantity selectors), and "Saiba mais" modal trigger.
- **Cross-Sell/Upsell Blocks:** Prompts to upgrade to multipark combos (e.g., adding Parque Arvorar).
- **Testimonials Section:** Cards showing user reviews (e.g., Raquel, Sofia Santos, Tiago).
- **FAQ Section:** Expandable accordion for common questions.

### 4.3. Checkout Page
- **Step Indicator:** E-mail > Dados > Pagamento.
- **Form Layout:** Standardized e-commerce input fields with mandatory asterisks (*).
- **Order Summary (Sidebar/Floating):** 
  - Destination (e.g., Combos + Aqua Park).
  - Selected Dates and respective tickets.
  - Line-item prices and totals.
- **Coupon Code:** "Inserir cupom" field.

### 4.4. Footer
- **Social Media:** Facebook, Instagram, X, YouTube.
- **Site Map:** Aqua Park, Sobre Nós (Quem Somos, História, Blog), Suporte (Dúvidas, Política de Compras, Privacidade, Termos), Atendimento (Horários, Localização).
- **Security & Payments:** Badges for payment methods, Google Safe Browsing, Tripadvisor Awards.
- **Corporate Details:** CNPJ, Address (Porto das Dunas).

---
*Generated by energent.ai. This document maps the business logic, product catalog, and user interface requirements for a functional Beach Park ticketing portal.*