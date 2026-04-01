## Checklist de Deployment - Vercel

### PRÉ-DEPLOYMENT (Hoje)

- [ ] Ler `DEPLOY_VERCEL_QUICK_START.md`
- [ ] Verificar `vercel.json` existe na raiz
- [ ] Build local funciona: `npm exec vite build`
- [ ] Verificar `dist/public/index.html` existe
- [ ] Rodar `npm run check` (verificação de tipos)

### SETUP VERCEL (10 minutos)

- [ ] Ir para https://vercel.com/sign-up (ou login se já tem conta)
- [ ] Conectar GitHub ao Vercel
- [ ] Adicionar repositório `ReserveiViagens/Crm-RSV-360`
- [ ] Configurar:
  - Root Directory: `/`
  - Framework: `Other`
  - Build Command: deixar padrão (vai usar vercel.json)
  - Output Directory: deixar padrão (vai usar vercel.json)
- [ ] Adicionar Environment Variables (se necessário):
  - `SESSION_SECRET`
  - `DATABASE_URL`
  - `NODE_ENV=production`
- [ ] Clicar "Deploy"

### PÓS-DEPLOYMENT INICIAL (5 minutos)

- [ ] Aguardar build concluir (verde ✓)
- [ ] Clicar no link do projeto (preview.vercel.app)
- [ ] Home carrega sem erro?
- [ ] Clicar em navegação - sem 404?
- [ ] F5 em qualquer rota - sem 404?
- [ ] Console do browser - sem erros de CORS?

**Se tudo OK:** 🎉 Frontend está em produção!

---

### INTEGRAÇÃO COM BACKEND (Após tudo acima)

- [ ] Obter URL pública do backend Express
  - [ ] Backend rodando em Railway/Heroku/servidor próprio?
  - [ ] URL acessível externamente? (testar no navegador)
  
- [ ] Atualizar `vercel.json` com rewrite:
```json
{
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

- [ ] Commit e push:
```bash
git add vercel.json
git commit -m "config: add backend API proxy"
git push
```

- [ ] Vercel fará novo deploy automaticamente
- [ ] Aguardar build concluir
- [ ] Testar API calls funcionando

### VALIDAÇÃO COMPLETA

**Frontend:**
- [ ] Home carrega rápido (<2s)
- [ ] Navegação funciona
- [ ] Mobile layout responsivo
- [ ] Console sem erros

**API Integration:**
- [ ] Chamadas `/api/*` retornam dados
- [ ] Autenticação funciona
- [ ] Chat em tempo real funciona
- [ ] Nenhum erro de CORS

**Performance:**
- [ ] Lighthouse score > 80
- [ ] Build size < 500KB (gzipped)
- [ ] Time to interactive < 2s

**Segurança:**
- [ ] Cookies httpOnly confirmados
- [ ] Nenhuma key sensível exposta
- [ ] HTTPS ativo (automático no Vercel)

---

### PROBLEMAS COMUNS & SOLUÇÕES

#### ❌ 404 na raiz
```
Causa: SPA rewrite não funcionando
Solução:
1. Verificar vercel.json existe: cat vercel.json
2. Verificar "rewrites" está correto
3. Ir Dashboard → Settings → Build & Development
4. Confirmar Build Command e Output Directory
5. Forçar rebuild: Dashboard → Redeploy
```

#### ❌ Build fails
```
Causa: Erro no Vite ou dependências
Solução:
1. Ver logs: Dashboard → [Deployment] → View Function Logs
2. Rodar localmente: npm install && npm exec vite build
3. Fixar erro
4. Commit e push (redeploy automático)
```

#### ❌ CSS/JS não carregam
```
Causa: Assets path incorreto ou cache
Solução:
1. Hard refresh: Ctrl+Shift+Del (Chrome) → Clear all
2. Ou abrir em navegador privado
3. Verificar vite.config.ts paths
4. Se problema persiste, ver aba Network no DevTools
```

#### ❌ API retorna 404
```
Causa: Backend não acessível ou rewrite errado
Solução:
1. Testar backend direto: curl https://seu-backend.com/api/test
2. Se não funciona, backend offline ou firewall
3. Se funciona, atualizar rewrite em vercel.json
4. Se rewrite está ok, ver logs: Dashboard → [Deployment] → Logs
```

#### ❌ CORS Error
```
Causa: Backend não permite origin do Vercel
Solução:
1. Se backend externo, adicionar CORS headers:
   Access-Control-Allow-Origin: https://seu-project.vercel.app
2. Se possível, usar Vercel Proxy em vercel.json
3. Testar com curl antes de tudo:
   curl -H "Origin: https://seu-project.vercel.app" \
        https://seu-backend.com/api/test
```

---

### MONITORAMENTO PÓS-DEPLOY

**Diariamente:**
- [ ] Verificar se deployment está up: https://seu-project.vercel.app
- [ ] Ver analytics do Vercel: Dashboard → Analytics

**Semanalmente:**
- [ ] Revisar error logs no Vercel
- [ ] Validar performance (Lighthouse)
- [ ] Teste em diferentes browsers/devices

**Mensalmente:**
- [ ] Avaliar uso de bandwidth
- [ ] Considerar plano pago se necessário
- [ ] Revisar custos

---

### ROLLBACK (se necessário)

```bash
# Ver histórico de deploys
# Dashboard → Deployments → Ver lista

# Clique em um deploy anterior
# Clique em "..." → "Promote to Production"

# Ou via CLI:
vercel --prod --target=<deployment-id>
```

---

### REFERENCIAS RÁPIDAS

- Docs Vercel SPA: https://vercel.com/docs/frameworks/vite#spa-routing
- Docs Vite: https://vitejs.dev
- Docs Rewrites: https://vercel.com/docs/edge-network/rewrites
- Suporte Vercel: https://vercel.com/help

---

**Tempo total estimado:** 30-45 minutos  
**Dificuldade:** Baixa (tudo já está configurado)  
**Risco:** Mínimo (pode fazer rollback em 1 clique)

### ✅ Próxima ação:
👉 Fazer commit: `git add -A && git commit -m "ready for vercel deploy" && git push`  
👉 Ir para https://vercel.com/dashboard  
👉 Clicar "Add New" → "Project"
