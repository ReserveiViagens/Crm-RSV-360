## Plano de Deploy Vercel - CRM RSV 360

### Status Atual
✅ **ETAPA 1 CONCLUÍDA**: `vercel.json` criado na raiz do projeto

---

## Etapas de Implementação

### ETAPA 1: Criar vercel.json
**Status**: ✅ CONCLUÍDO

Arquivo `/vercel/share/v0-project/vercel.json` foi criado com configuração para:
- Build Frontend Vite: `npm exec vite build`
- Output Directory: `dist/public`
- Rewrite para SPA: Qualquer rota desconhecida → `/index.html`

---

### ETAPA 2: Configurar Vercel Dashboard
**Status**: ⏳ PRÓXIMO

**Passo a Passo:**

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New" → "Project"
3. Selecione o repositório `ReserveiViagens/Crm-RSV-360`
4. Configure assim:

```
ROOT DIRECTORY: /
FRAMEWORK PRESET: Other
BUILD COMMAND: npx vercel build
OUTPUT DIRECTORY: npx vercel build (irá usar o vercel.json)
ENVIRONMENT VARIABLES:
  - SESSION_SECRET: (gerar valor seguro)
  - DATABASE_URL: (sua connection string)
  - NODE_ENV: production
```

**Resultado esperado**: Home carrega sem 404

---

### ETAPA 3: Ligar /api/* para Backend Externo
**Status**: ⏳ AGUARDANDO ETAPA 2

**Informações do Backend Atual:**
- Local: `server/index.ts`
- Porta: 5000 (ou PORT env var)
- Express rodando em: `127.0.0.1:5000`
- Rotas: Registradas em `server/routes/`

**Opções de Proxy:**

#### OPÇÃO A: Usar Rewrite + Proxy no vercel.json (RECOMENDADO AGORA)

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://seu-backend-externo.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Instruções:**
1. Deploy seu backend em um servidor externo (por exemplo, Heroku, Railway, AWS EC2)
2. Obtenha a URL base do backend (ex: `https://backend-rsv360.railway.app`)
3. Atualize o `vercel.json` com o rewrite acima
4. Atualize variáveis de ambiente no frontend:
   - `VITE_API_BASE_URL=https://seu-backend-externo.com`

#### OPÇÃO B: Vercel Functions (Decisão futura)

Possibilidade de migrar rotas backend para Vercel Functions em `/api/`:
```
/api/auth/login → vercel function
/api/hotels → vercel function
etc
```

**Pré-requisitos para decisão:**
- Volume de requisições esperado
- Latência aceitável
- Custo de Vercel Functions
- Simplicidade de refatoração

---

### ETAPA 4: Verificação Pós-Deploy

**Checklist:**
- [ ] Frontend carrega na raiz (/)
- [ ] CSS e JS carregam sem erro
- [ ] Chamadas para /api/* chegam ao backend correto
- [ ] WebSockets funcionam (socket.io)
- [ ] Autenticação persiste com cookies
- [ ] Assets carregam corretamente

**Debug:**
```bash
# Local
npm run dev

# Vercel Preview
vercel --prod
```

---

### ETAPA 5: Decisão - Backend em Functions ou Next.js
**Status**: 🔮 FUTURO (Após deploy estável)

#### Análise para Migração:

| Aspecto | Express Atual | Vercel Functions | Next.js API |
|--------|--------------|-----------------|-----------|
| Complexidade | Baixa | Média | Alta |
| Custo | Variável | Por execução | Fixo |
| WebSockets | Sim | Não (stateless) | Limitado |
| Banco de Dados | Pool-based | Serverless | Pool-based |
| Tempo startup | < 100ms | < 1s | < 100ms |

**Recomendação:** 
- Manter Express externo por enquanto
- Chat em tempo real (WebSocket) exige estado
- Escalabilidade melhor com backend separado

---

## Estrutura Atual do Projeto

```
/
├── vercel.json (✅ CRIADO)
├── server/
│   ├── index.ts (Express + WebSocket)
│   ├── routes/ (APIs)
│   └── ...
├── client/
│   ├── src/ (React + Vite)
│   ├── index.html
│   └── ...
├── dist/
│   └── public/ (Build output de Vite)
└── package.json
```

---

## Próximos Passos Recomendados

1. **IMEDIATO**: Confirmar URL do backend externo
2. **HOJE**: Deploy frontend no Vercel
3. **TESTE**: Validar conexão /api/* com backend
4. **OPCIONAL**: Considerar migração backend (em 2-4 semanas)

---

## Contato com Suporte

Se encontrar erros:
- Verifique logs do Vercel: https://vercel.com/dashboard
- Logs da build: Em "Deployments" → último deploy → "View Function Logs"
- Debug local: `npm run dev`

**Erros comuns:**
- 404 na home → Rewrite SPA não aplicado (verificar vercel.json)
- CORS na API → Adicionar headers ou usar proxy
- WebSocket falha → Backend externo não acessível

---

**Versão**: v1.0
**Última atualização**: 31/03/2026
**Status**: Pronto para ETAPA 2 (Deploy Vercel)
