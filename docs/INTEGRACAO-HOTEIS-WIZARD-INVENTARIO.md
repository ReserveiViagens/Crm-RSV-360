# INTEGRACAO-HOTEIS-WIZARD — Inventário Fase A + mapa Fase B

**Data:** 2026-07-13  
**S1:** `Crm-RSV-360` · **S2:** `rsv360`  
**Tipo:** read-only inventário + decisão de mapa (owner)

---

## 1) S1 `/hoteis` e CTA

| Item | Achado |
|------|--------|
| Arquivo | `client/src/pages/hoteis.tsx` |
| CTA principal | Botão **Reservar Agora** — **antes** abria WhatsApp `wa.me` |
| CTA compare | Idem WhatsApp |
| Dados | Array hardcoded `hotels` (`id`, `title`, …) + merge opcional CMS search |
| IDs S1 | `hot-park`, `golden-dolphin`, `diroma`, `lacqua`, `prive` |

## 2) Redirect `/cotacao`

`server/routes.ts`: `res.redirect(307, \`${getMarketingLabUrl()}${req.originalUrl}\`)`  
→ **preserva query string** (`originalUrl`).

## 3) S2 wizard — params

`packages/shared/src/cotacao/entrada-contextual.ts`:

`hotel`, `checkin`/`checkIn`, `checkout`/`checkOut`, `adults`, `children`, `apenasHotel`, `ref`, `canal`

Deeplink com `hotel` → `hotelTravado=true`.  
Unlock: `onHotelIndisponivel()` / `editarPassoColapsado(1)` em `WizardContext.tsx`.

Analytics: bootstrap já passa `canal`/`ref` no track de entrada (`WizardContext`).

## 4) Vitrine S2 (migration 0033) — 11 hotéis

| slug | título 0033 |
|------|-------------|
| atrium-thermas | Atrium Thermas |
| lacqua-diroma | Lacqua diRoma |
| a-guas-da-fonte | Águas da Fonte |
| aldeia-do-lago | Aldeia do Lago |
| alta-vista-thermas | Alta Vista Thermas |
| aquarius-residence | Aquarius Residence |
| priva-das-thermas-i | Privé das Thermas I |
| diroma-fiori | DiRoma Fiori |
| sol-das-caldas | Sol das Caldas |
| diroma-acqua-park | diRoma Acqua Park |
| golden-dolphin-supreme | Golden Dolphin Supreme |

## 5) Mapa final (Passo 1 — nome-ok)

| S1 id | Título S1 | Slug S2 | Decisão | Motivo |
|-------|-----------|---------|---------|--------|
| `lacqua` | Lacqua Di Roma | `lacqua-diroma` | **MAPEAR** | Mesmo empreendimento (diRoma / Di Roma) |
| `diroma` | Di Roma Acqua Park | `diroma-acqua-park` | **MAPEAR** | Mesmo empreendimento |
| `golden-dolphin` | Golden Dolphin **Grand** Hotel | `golden-dolphin-supreme` | **OMITIR** | Grand ≠ Supreme (owner) |
| `prive` | Privé Caldas Novas | `priva-das-thermas-i` | **OMITIR** | Nomes distintos |
| `hot-park` | Hot Park Rio Quente | — | **OMITIR** | Parque/resort fora da etapa A hotéis |

## 6) Veredito

- Infra redirect + params wizard: **já OK**
- Menor PR: CTA S1 + `hoteis-cotacao-map.ts` + WhatsApp secundário
- Param `origem=`: **não** usar — `canal`/`ref` bastam
- Risco hotel errado mitigado omitindo Grand→Supreme

## 7) Riscos

| Risco | Mitigação |
|-------|-----------|
| Hotel travado sem disponibilidade | `onHotelIndisponivel` + editar passo 1 |
| Cards sem mapa | Fallback `/cotacao?canal=s1-hoteis&ref=hoteis` |

---

*Fase A aprovada; Fase B segue este mapa.*
