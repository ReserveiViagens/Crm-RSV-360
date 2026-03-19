# Comunicação entre este projeto (RSV360) e um 2º repositório

Este documento explica, de forma prática, como integrar este sistema com outro repositório.

## 1) O que este projeto já expõe para integração

Hoje, o RSV360 já oferece 3 canais principais:

1. **REST API** em `/api/*`
2. **WebSocket** em `/ws` (tempo real por excursão)
3. **Webhooks de entrada** para receber eventos de sistemas externos

Referências no código:

- Servidor/API: `server/index.ts` e `server/routes.ts`
- Socket: `server/socket.ts`
- Integrações externas existentes:
  - WhatsApp/Evolution API: `server/services/whatsapp.service.ts`
  - Gateway de pagamento/Pix: `server/services/payment.service.ts`

---

## 2) Padrão recomendado para integrar com o outro repo

Use esta regra simples:

- **Consultar/criar/editar dados** → REST
- **Atualizar tela em tempo real** (status do grupo, alertas) → WebSocket
- **Notificar eventos entre sistemas** (pagamento confirmado, mensagens externas) → Webhook

---

## 3) Endpoints mais importantes para começar

### 3.1 REST

- Auth/sessão:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- Excursões:
  - `GET /api/excursoes`
  - `GET /api/excursoes/:id`
  - `POST /api/excursoes`
- Reservas:
  - `GET /api/excursoes/:id/reservas`
  - `POST /api/excursoes/:id/reservas`
- Convites/grupo:
  - `POST /api/excursoes/:id/invites`
  - `POST /api/invites/validate`
  - `POST /api/invites/join`
- Pagamento Pix:
  - `POST /api/pagamento/gerar-pix`
  - `GET /api/pagamento/status/:transactionId`
- WhatsApp/Evolution:
  - `GET /api/waas/status`
  - `POST /api/waas/criar-grupo`
  - `POST /api/waas/:excursaoId/mensagem`

### 3.2 WebSocket

Conexão:

- Dev: `ws://localhost:5000/ws`
- Prod: `wss://SEU_DOMINIO/ws`

Após conectar, assine uma excursão:

```json
{ "type": "subscribe", "excursaoId": "ID_DA_EXCURSAO" }
```

Eventos principais emitidos:

- `estado_grupo`
- `pix_expirado`
- `vigilancia`

### 3.3 Webhooks que este projeto recebe

- Pagamento: `POST /api/webhook/payment`
- Evolution/WhatsApp: `POST /api/waas/webhook`

---

## 4) Fluxo de integração sugerido (MVP em 6 passos)

1. **Login no RSV360** (ou registro), guardando cookie de sessão.
2. **Listar excursões** em `GET /api/excursoes`.
3. **Gerar convite/reserva** conforme o caso de uso do outro sistema.
4. **Abrir WebSocket** e fazer `subscribe` na excursão.
5. **Gerar Pix** com `POST /api/pagamento/gerar-pix`.
6. **Receber confirmação** via webhook e refletir status em tempo real.

---

## 5) Contrato entre os dois repositórios (boa prática)

Para evitar retrabalho, formalize um “contrato” único:

- OpenAPI para REST (paths, payloads, erros)
- Catálogo de eventos (nome, formato, origem, idempotência)
- Política de versão (`v1`, `v2`) e depreciação
- Política de retry/backoff para webhooks

---

## 6) Segurança mínima recomendada

- Tráfego sempre com HTTPS/WSS em produção.
- Chave entre serviços no header `Authorization: Bearer <token>`.
- Webhooks com assinatura HMAC + timestamp (evita replay).
- `x-request-id` em todas as chamadas para rastreabilidade.

---

## 7) Variáveis de ambiente que precisam estar alinhadas

- Base/aplicação:
  - `PORT`, `NODE_ENV`, `BASE_URL`, `SESSION_SECRET`
- OAuth Google (se ativado):
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Evolution/WhatsApp:
  - `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE_NAME`
- Gateway Pix:
  - `GATEWAY_API_URL`, `GATEWAY_API_KEY`, `RESERVEI_RECIPIENT_ID`, `ORGANIZER_RECIPIENT_ID`

---

## 8) Exemplos rápidos (copiar/colar)

### 8.1 Login

```bash
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identificador":"demo@reservei.com.br","senha":"demo123"}'
```

### 8.2 Listar excursões (com cookie de sessão)

```bash
curl -i http://localhost:5000/api/excursoes \
  -H "Cookie: connect.sid=SEU_COOKIE_AQUI"
```

### 8.3 Gerar Pix

```bash
curl -i -X POST http://localhost:5000/api/pagamento/gerar-pix \
  -H "Content-Type: application/json" \
  -d '{"excursaoId":"abc123","amount":129900,"passengerName":"Maria","organizerCommission":15000}'
```

### 8.4 Webhook de pagamento (simulação)

```bash
curl -i -X POST http://localhost:5000/api/webhook/payment \
  -H "Content-Type: application/json" \
  -d '{"event":"transaction.paid","data":{"id":"txn_1","metadata":{"orderId":"abc123"},"customer":{"name":"Maria"},"amount":129900}}'
```

---

## 9) Checklist para conectar ao 2º repositório

- [ ] Definir qual sistema é “fonte da verdade” por entidade (cliente, reserva, pagamento)
- [ ] Documentar todos os endpoints/eventos usados
- [ ] Validar autenticação dos dois lados
- [ ] Implementar idempotência em webhooks
- [ ] Configurar observabilidade (logs + métricas + alertas)
- [ ] Rodar teste de ponta a ponta com cenário de pagamento e confirmação

---

## 10) Próximo passo para fechar a integração dos dois projetos

Para eu te devolver um desenho **100% fechado entre os dois repositórios**, me passe o link do **segundo** repo (ou os arquivos principais dele: rotas, auth e webhooks). Aí eu monto:

- matriz de integração A ↔ B,
- payload exato por endpoint/evento,
- e um diagrama final do fluxo ponta a ponta.
