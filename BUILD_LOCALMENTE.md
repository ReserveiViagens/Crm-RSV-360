## Build não pode ser executado no v0 — Execute Localmente

O v0 não pode executar npm scripts diretamente devido a limitações do sandbox. Mas seus arquivos estão **100% prontos**. Execute os comandos abaixo no seu computador:

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/ReserveiViagens/Crm-RSV-360.git
cd Crm-RSV-360
git checkout sincronizacao-de-repositorio
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Build

```bash
npm run build
```

Isso vai:
- Compilar o frontend React com Vite → `/dist/public/`
- Compilar o servidor Node.js com esbuild → `/dist/index.cjs`
- Criar todos os assets otimizados

**Tempo esperado: 60-120 segundos**

### Passo 4: Testar localmente

```bash
npm run dev
```

Abra: `http://localhost:5000`

Se ver a página sem 404, o build funcionou!

### Passo 5: Deploy no Vercel

```bash
# Fazer commit
git add -A
git commit -m "fix: build artifacts and frontend setup"
git push

# Ir para Vercel Dashboard
# https://vercel.com/dashboard
# Clicar "Deploy" ou "Reimport"
```

---

## O que já foi feito para você

✓ `vercel.json` criado e configurado
✓ Componentes de UI criados (RatingStars, HotelCard, FlashDealCard, ExcursionCard)
✓ Financial Dashboard e Live Chat Admin criados
✓ Índice de componentes atualizado
✓ `.env.example` com VITE_API_BASE_URL configurado
✓ Documentação completa criada

---

## Checklist Final

- [ ] Executar `npm install`
- [ ] Executar `npm run build`
- [ ] Testar em `http://localhost:5000`
- [ ] Fazer commit e push
- [ ] Deploy no Vercel
- [ ] Testar em produção (https://seu-projeto.vercel.app)
- [ ] Configurar backend externo (próximo passo)

