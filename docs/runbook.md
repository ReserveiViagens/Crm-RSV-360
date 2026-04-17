# Runbook RSV360 — Guia de Operação

**Última atualização:** 2026-03-27  
**Serviço:** RSV360 — Reservei Viagens  
**Ambiente:** Replit (desenvolvimento) / Replit Deployments (produção)

---

## 1. Contatos de Escalation

| Papel | Nome | Canal |
|-------|------|-------|
| Dev Principal | — | GitHub Issues / WhatsApp |
| Suporte Nível 2 | — | Slack #rsv360-alertas |
| Gateway Pix | Suporte do Gateway | Email: suporte@gateway.com.br |
| Evolution API | Suporte WA | Dashboard da Evolution API |

---

## 2. Reverter Deploy (Rollback)

### Replit Deployments
1. Acesse o painel de Deploy no Replit
2. Clique em **Deployments** → selecione o deploy anterior
3. Clique em **Rollback to this deployment**
4. Aguarde o health check passar (GET /api/status deve retornar `{"ok":true}`)

### Git Rollback (local)
```bash
# Ver histórico de commits
git log --oneline -10

# Reverter para commit específico
git revert <commit-sha>
git push origin main

# Ou reset duro (CUIDADO — apaga commits locais)
git reset --hard <commit-sha>
git push --force origin main
```

---

## 3. Reprocessar Fila de Entregas com Falha

### Verificar entregas pendentes
```bash
curl -s https://SEU_DOMINIO/api/admin/metrics \
  -H "Cookie: connect.sid=SEU_TOKEN" | jq '.pendingDeliveries'
```

### Reenviar voucher manualmente (via API Admin)
```bash
curl -X POST https://SEU_DOMINIO/api/admin/orders/ORDER_ID/resend \
  -H "Cookie: connect.sid=SEU_TOKEN"
```

### Verificar logs de entrega
No Replit, acesse **Logs** do deployment e filtre por `[voucher-delivery]`.

### Causas comuns de falha
| Causa | Diagnóstico | Solução |
|-------|-------------|---------|
| SMTP não configurado | `SMTP_HOST` vazio | Configurar variáveis SMTP_* |
| WhatsApp desconectado | Evolution API offline | Reconectar instância no dashboard |
| Gateway timeout | Log `[gateway]` com erro 5xx | Aguardar/reintentar |

---

## 4. Invalidar Links de Voucher Comprometidos

O link de voucher usa UUID v4 + token HMAC-SHA256. Para invalidar:

### Opção A: Rotacionar o segredo HMAC (invalida TODOS os vouchers ativos)
1. Gere um novo segredo: `openssl rand -hex 32`
2. Atualize a variável de ambiente `VOUCHER_SECRET` no Replit
3. Reinicie o serviço (todos os links antigos ficam inválidos)

### Opção B: Revogar pedido específico (sem afetar outros)
Atualmente não há endpoint de revogação por pedido individual. Implemente se necessário:
- Adicione campo `revokedAt` no `ticketTransactions`
- Verifique o campo no endpoint `GET /api/orders/:id/voucher`

---

## 5. Diagnóstico de Problemas Comuns

### App não inicia
```bash
# Verificar logs do workflow
# No Replit: Workflow "Start application" → Console

# Verificar healthcheck
curl http://localhost:5000/api/status
```

### Rate limit acionado (429)
| Endpoint | Limite | Janela |
|----------|--------|--------|
| `/api/orders/:id/voucher` | 10 req | 1 min por IP |
| `/api/webhooks/tickets` | 30 req | 1 min por IP |
| `/api/recommendations/*` | 60 req | 1 min por IP |

### Alertas críticos no admin
1. Acesse `/admin` → painel **Alertas Críticos**
2. Identifique o tipo de alerta (VOUCHER_PDF_FAILURE, DOUBLE_DELIVERY_FAILURE, etc.)
3. Siga os procedimentos da seção correspondente neste runbook
4. Clique **Reconhecer** após resolver

---

## 6. Verificações de Saúde

```bash
# Healthcheck completo
curl -s https://SEU_DOMINIO/api/status | jq .

# Métricas admin
curl -s https://SEU_DOMINIO/api/admin/metrics \
  -H "Cookie: connect.sid=SEU_TOKEN" | jq '.summary'

# Alertas ativos
curl -s https://SEU_DOMINIO/api/admin/alerts \
  -H "Cookie: connect.sid=SEU_TOKEN" | jq '.alerts | length'
```

---

## 7. Variáveis de Ambiente Críticas

Consulte `.env.example` na raiz do projeto para a lista completa.  
Variáveis obrigatórias em produção:

- `SESSION_SECRET` — sem isso, sessões são inseguras
- `VOUCHER_SECRET` — sem isso, usa fallback inseguro de desenvolvimento
- `GATEWAY_API_URL` + `GATEWAY_API_KEY` — sem isso, modo demo ativo
- `WEBHOOK_SECRET` — sem isso, webhooks são aceitos sem autenticação
