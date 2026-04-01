## Deploy Frontend no Vercel - Quick Start

### O que foi feito
✅ `vercel.json` criado com configuração SPA (Single Page Application)
✅ Frontend configurado para usar Vite (build mais rápido e eficiente)
✅ Output directory configurado para `dist/public`
✅ Rewrites SPA ativadas (qualquer rota desconhecida → `/index.html`)

---

## Configurar Deploy (PRÓXIMO PASSO)

### 1. Prepare o Repositório
```bash
# Ensure vercel.json is committed
git add vercel.json
git commit -m "feat: add vercel config for SPA deployment"
git push origin sincronizacao-de-repositorio
```

### 2. Link no Dashboard Vercel

#### Opção A: Conexão automática do GitHub
1. Acesse https://vercel.com/dashboard
2. Clique "Add New" → "Project"
3. Selecione repo `ReserveiViagens/Crm-RSV-360`
4. Deixe tudo padrão, vá até o final

#### Opção B: Configuração Manual
1. Em "Project Settings" Configure:
   ```
   Root Directory: /
   Framework: Other
   Build Command: npm install && npm exec vite build
   Output Directory: dist/public
   ```

2. Em "Environment Variables" Adicione:
   ```
   SESSION_SECRET = [gerar valor seguro]
   DATABASE_URL = [sua string de conexão]
   NODE_ENV = production
   ```

### 3. Verificar Build Local (Recomendado)
```bash
# Instalar dependências
npm install

# Build frontend
npm exec vite build

# Verificar output
ls -la dist/public/
```

Se tudo está ok, você verá `index.html` em `dist/public/`.

---

## Próximas Etapas Após Deploy

### Etapa 3: Conectar API (/api/*)

Editar `vercel.json` para reescrever `/api/*` para seu backend:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm exec vite build",
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://seu-backend-url.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Onde colocar seu backend:**
- Railway: `https://seu-app-railway.railway.app/api/$1`
- Heroku: `https://seu-app-heroku.herokuapp.com/api/$1`
- Docker próprio: `https://seu-dominio.com/api/$1`

### Etapa 4: Testar Conexão API

Após configura o rewrite e atualizar VITE_API_BASE_URL:
```bash
# Frontend deve se conectar a /api/*
# Vercel reescreve para seu backend automaticamente
```

---

## Decisão Backend (FUTURO)

Depois de ter frontend estável, avaliar:

| Opção | Vantagem | Desvantagem |
|-------|----------|-----------|
| **Express Externo** (ATUAL) | Websockets, Complexidade total | Deploy separado |
| **Vercel Functions** | Sem infra gerenciar | Sem websockets, Custo por requisição |
| **Next.js API** | Tudo integrado | Aprender nova arquitetura |

**Recomendação:** Manter Express por enquanto. Chat em tempo real precisa de websockets.

---

## Troubleshooting

| Erro | Causa | Solução |
|------|-------|--------|
| 404 na raiz | SPA rewrite não aplicado | Verificar `vercel.json` está correto |
| Build falha | Vite não acha dependências | Rodar `npm install` localmente |
| CSS/JS não carregam | Asset path errado | Verificar `vite.config.ts` (root, alias) |
| API retorna 404 | Rewrite `/api/*` não funciona | Verificar backend externo acessível |
| CORS error | Backend não permite frontend | Adicionar CORS headers ou usar proxy |

---

## Arquivos Criados/Modificados

```
✅ vercel.json (novo)
✅ .env.example (atualizado com VITE_API_BASE_URL)
✅ client/src/lib/api-config.ts (novo - helpers para chamadas API)
📄 DEPLOY_VERCEL_PLAN.md (guia completo)
```

---

## Próximo Deploy

```bash
# Fazer push das mudanças
git add -A
git commit -m "config: prepare deployment to Vercel"
git push origin sincronizacao-de-repositorio

# Vercel fará deploy automaticamente
# Monitorar em: https://vercel.com/dashboard
```

**Tempo estimado:** 2-3 minutos para primeira build

---

**Pronto!** 🚀 O frontend está configurado para deploy. Aguardando configuração do backend externo.
