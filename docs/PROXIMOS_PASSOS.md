# Próximos Passos - Roadmap de Melhorias UI/UX

## Status Atual ✅

### Completado (FASE 1-3)
- **Tokens CSS**: Sistema de design com variáveis para cores, spacing, tipografia, sombras, raios
- **Componentes Padronizados**: ProductCard, PriceDisplay, TicketCard, StatusBadge, SearchBar, FilterChips, etc
- **Admin Shells**: AdminShell, AdminSidebar, AdminTopBar para padrão de layout
- **Páginas Admin Migradas**: 
  - ✅ clientes.tsx
  - ✅ crm.tsx
  - ✅ financeiro.tsx
  - ✅ contratos.tsx
  - ✅ relatorio-mensal.tsx
  - ✅ waas-dashboard.tsx
  - ✅ gamification-dashboard.tsx
- **Tamanhos de Cards**: Tokens para discovery, product, premium, deal, tour cards
- **TicketsGrid**: Atualizada com tokens CSS (grid, imagens com aspect-ratio, cores)

---

## Próximos Passos - Roadmap Priorizado

### FASE 4: Dashboards Admin (2-3 dashboards) - MEDIA PRIORIDADE
| # | Página | Tipo | Status |
|---|--------|------|--------|
| 1 | `admin/financial-dashboard.tsx` | Admin | TODO |
| 2 | `superadmin/live-chat.tsx` | Admin | TODO |

**Ações**:
- Migrar para AdminShell + PageContainer
- Utilizar componentes UI padronizados (DataTable, Cards, Badges)
- Aplicar tokens CSS em todos os estilos

---

### FASE 5: Páginas Catálogo (3-4 páginas) - ALTA PRIORIDADE
| # | Página | Tamanho Card | Status |
|---|--------|--------------|--------|
| 1 | `home.tsx` | 280px (discovery) | TODO |
| 2 | `hoteis.tsx` | 360px (premium) | TODO |
| 3 | `flash-deals.tsx` | 300px (deal) | TODO |
| 4 | `catalogo-excursoes.tsx` | 340px (tour) | TODO |

**Ações**:
- Criar componentes especializados (HotelCard, FlashDealCard)
- Migrar para usar ProductCard com tokens
- Manter aspect-ratios estratégicos
- Implementar grid responsivo com `.rsv-grid-cards`

---

### FASE 6: Componentes Especializados - ALTA PRIORIDADE
| Componente | Base | Features |
|-----------|------|----------|
| `HotelCard` | ProductCard | Múltiplas imagens, ratings, reviews |
| `FlashDealCard` | ProductCard | Timer urgência, progress bar |
| `ExcursionCard` | ProductCard | Datas, vagas, organizador |
| `RatingStars` | Componente novo | Visual padronizado |

---

### FASE 7: Melhorias UX - MEDIA PRIORIDADE
| Tarefa | Impacto | Esforço |
|--------|--------|--------|
| Breadcrumbs em fluxos profundos | Navegação | Baixo |
| Sidebar collapsível desktop | Mais espaço | Baixo |
| Animações TicketsGrid (hover, load) | UX | Médio |
| Responsive design (mobile-first) | Compatibilidade | Alto |
| Validação de formulários | UX | Médio |

---

### FASE 8: Pages Adicionais - BAIXA PRIORIDADE
| Página | Shell | Status |
|--------|-------|--------|
| `home-new.tsx` | PublicPageShell | TODO |
| `promocoes.tsx` | CatalogPageShell | TODO |
| `perfil.tsx` | AppMobileShell | TODO |
| `minhas-reservas.tsx` | AppMobileShell | TODO |

---

## Recomendação para Próxima Ação

Sugiro começar pela **FASE 5** (Páginas Catálogo) porque:

1. **Alto impacto**: Maior visibilidade para usuários
2. **Componentes prontos**: ProductCard, PriceDisplay já existem
3. **Padrão claro**: Tokens de tamanho já definidos
4. **Demonstra valor**: Consistência visual imediata

### Começo recomendado:
1. Migrar `home.tsx` com ProductCard (discovery 280px)
2. Criar `HotelCard` e migrar `hoteis.tsx` (premium 360px)
3. Criar `FlashDealCard` com animações e migrar `flash-deals.tsx`
4. Finalizar `catalogo-excursoes.tsx`

Tempo estimado: 4-6 horas

---

## Checklist por Página

### home.tsx
- [ ] Ler estrutura atual
- [ ] Identificar seções de cards
- [ ] Substituir por ProductCard com `.rsv-grid-discovery`
- [ ] Aplicar tokens CSS aos estilos inline
- [ ] Testar responsividade

### hoteis.tsx
- [ ] Criar HotelCard (extends ProductCard)
- [ ] Suportar múltiplas imagens (thumbnails)
- [ ] Adicionar rating stars
- [ ] Grid com `.rsv-grid-premium`
- [ ] Testar filtros e search

### flash-deals.tsx
- [ ] Criar FlashDealCard (extends ProductCard)
- [ ] Implementar countdown timer com urgência visual
- [ ] Adicionar progress bar de vendas
- [ ] Animação pulsante quando < 1h
- [ ] Grid com `.rsv-grid-cards`

### catalogo-excursoes.tsx
- [ ] Criar ExcursionCard (extends ProductCard)
- [ ] Adicionar datas, vagas, organizador
- [ ] Suportar features de excursão
- [ ] Grid com tamanho 340px

