# Comunicação entre este projeto (RSV360) e um 2º repositório

## 1) Como este projeto se comunica hoje (base para integração)

Este repositório já expõe três canais principais que podem ser consumidos por outro projeto:

1. **REST API em `/api/*`** (Express).
2. **WebSocket em `/ws`** para eventos em tempo real por excursão.
3. **Webhooks de entrada** para receber eventos externos.

Referências no código:

- API e servidor HTTP: `server/index.ts` + `server/routes.ts`.
- Socket em tempo real: `server/socket.ts`.
- Integrações externas já existentes:
  - WhatsApp/Evolution API (`server/services/whatsapp.service.ts`)
  - Gateway de pagamento/Pix (`server/services/payment.service.ts`)

## 2) Endpoints-chave para integração com o outro repositório

### REST (consumo direto)

- Autenticação e sessão: `/api/auth/*`
- Excursões: `/api/excursoes`, `/api/excursoes/:id`
- Reservas: `/api/excursoes/:id/reservas`
- Convites/grupo: `/api/excursoes/:id/invites`, `/api/invites/*`
- Pagamentos Pix: `/api/pagamento/gerar-pix`, `/api/pagamento/status/:transactionId`
- Canal WhatsApp admin: `/api/waas/*`

### Tempo real (WebSocket)

Conectar em `ws://<host>/ws` (ou `wss://` em produção) e enviar:

```json
{ "type": "subscribe", "excursaoId": "ID_DA_EXCURSAO" }
```

Eventos emitidos por este sistema:

- `estado_grupo`
- `pix_expirado`
- `vigilancia`

### Webhooks (entrada de eventos vindos do outro sistema)

- Webhook de pagamento: `POST /api/webhook/payment`
- Webhook de WhatsApp/Evolution: `POST /api/waas/webhook`

## 3) Plano recomendado para comunicação entre os 2 repositórios

1. **Definir responsabilidade de cada lado**
   - Projeto A (este): motor de excursão, reservas, convites, Pix, WhatsApp.
   - Projeto B (outro repo): por exemplo CRM, ERP, BI, app mobile, checkout externo etc.

2. **Escolher padrão de integração por caso**
   - **Consulta/escrita síncrona**: REST (`/api/*`).
   - **Atualização imediata de tela**: WebSocket (`/ws`).
   - **Evento assíncrono confiável**: webhook com retry e assinatura.

3. **Criar contrato único (OpenAPI + eventos)**
   - JSON de request/response versionado.
   - Tabela de eventos: nome, payload, origem, idempotência.
   - Política de erros e códigos HTTP.

4. **Segurança**
   - Chave de API entre serviços (`Authorization: Bearer ...`).
   - Assinatura HMAC nos webhooks.
   - `x-request-id` para rastreamento e idempotência.

5. **Observabilidade**
   - Log estruturado com `request-id`.
   - Métricas de latência/erro por endpoint.
   - DLQ/reprocessamento para eventos críticos.

## 4) Variáveis de ambiente que normalmente precisam estar alinhadas

- Sessão/base: `SESSION_SECRET`, `BASE_URL`, `PORT`, `NODE_ENV`
- Google OAuth (se usado): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- WhatsApp/Evolution: `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE_NAME`
- Gateway Pix: `GATEWAY_API_URL`, `GATEWAY_API_KEY`, `RESERVEI_RECIPIENT_ID`, `ORGANIZER_RECIPIENT_ID`

## 5) Próximo passo para fechar a análise dos dois projetos

Para eu te entregar a integração **exata entre os dois repositórios**, preciso do segundo repo (URL/caminho) para mapear:

- quais endpoints ele já expõe,
- qual autenticação ele usa,
- quais eventos ele envia/consome,
- e te devolver um diagrama final com fluxo ponta a ponta.
