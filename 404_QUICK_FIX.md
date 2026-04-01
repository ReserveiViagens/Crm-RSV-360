# Erro 404 - Solução Rápida

## Problema
O servidor está retornando 404 porque o build do frontend não foi feito.

## Solução (1 comando)

```bash
npm run build
```

Pronto! O erro 404 será resolvido.

## O que acontece

1. Vite compila o React
2. Gera `/dist/public/` com todos os arquivos
3. Servidor Express serve esses arquivos
4. 404 desaparece ✓

## Tempo: 30-60 segundos

## Próximas ações

```bash
# Teste localmente
npm run dev

# Se OK, faça push para Vercel
git add -A
git commit -m "build: frontend ready"
git push
```

## Detalhes técnicos

- **Servidor espera:** `/dist/public/index.html`
- **Vite cria:** `/dist/public/` (com build otimizado)
- **Express serve:** Arquivos estáticos + SPA fallback
- **Resultado:** Frontend funciona, rotas funcionam, backend pronto

## Mais informações

Veja `FIX_404_ERROR.md` para guia completo.
