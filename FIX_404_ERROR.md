# Como Corrigir o Erro 404

## Problema Identificado

O erro 404 ocorre porque o servidor Express está tentando servir arquivos do build em `/dist/public`, mas essa pasta está **vazia** (o build do frontend ainda não foi feito).

```
Erro no servidor: 
"Could not find the build directory: /dist/public, make sure to build the client first"
```

## Solução: 3 Passos Rápidos

### 1. Fazer o build do frontend

Execute este comando na raiz do projeto:

```bash
npm run build
```

**O que isso faz:**
- Compila o React com Vite
- Gera todos os arquivos otimizados em `/dist/public`
- Cria chunks separados (react-vendor, radix-vendor, etc)

**Tempo esperado:** ~30-60 segundos

### 2. Verificar se o build funcionou

Depois do comando acima, verifique se a pasta foi criada:

```bash
ls -la dist/public/
```

Você deve ver:
- `index.html`
- `assets/` (com .js, .css, .map files)

### 3. Iniciar o servidor

```bash
npm run dev
```

O servidor agora vai servir o frontend corretamente.

---

## Fluxo Completo para Produção

```bash
# 1. Build frontend
npm run build

# 2. Verificar resultado
ls dist/public/index.html

# 3. No Vercel: apenas fazer push
git add -A
git commit -m "build: frontend ready for deployment"
git push
```

## O que Mudou no Projeto

**Estrutura de build:**
```
/dist/public/          ← Build output do Vite (frontend compilado)
├── index.html         ← SPA entry point
├── assets/            ← JS, CSS, images, fonts
└── ...
```

**Como funciona:**
1. Vite compila `client/src/**` → `/dist/public/`
2. Express serve arquivos estáticos de `/dist/public/`
3. Qualquer rota desconhecida fallback para `index.html` (SPA routing)

---

## Checklist

- [ ] Executei `npm run build`
- [ ] Pasta `/dist/public/` agora existe
- [ ] Arquivo `/dist/public/index.html` existe
- [ ] Servidor inicia sem erros
- [ ] Home carrega sem 404

---

## Debug Adicional

Se ainda tiver problema:

```bash
# Ver o conteúdo da pasta
ls -laR dist/

# Ver últimas linhas do log
npm run dev 2>&1 | tail -20

# Verificar permissões
ls -la dist/public/index.html
```

## Próximo Passo

Após confirmar que funciona localmente, você pode fazer deploy no Vercel! 🚀
