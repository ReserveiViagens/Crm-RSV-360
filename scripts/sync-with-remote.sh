#!/bin/bash

echo "[v0] Iniciando sincronização com repositório remoto..."

# Salvar status atual
echo "[v0] Salvando estado atual do projeto..."
git status

# Adicionar todas as mudanças locais
echo "[v0] Preparando mudanças locais..."
git add -A

# Criar um commit com as customizações
if [[ -n $(git status -s) ]]; then
    echo "[v0] Criando commit das customizações v0..."
    git commit -m "chore: customizações v0 - design system, componentes especializados e dashboards admin"
else
    echo "[v0] Nenhuma mudança local para commitar"
fi

# Fazer fetch das mudanças remotas
echo "[v0] Buscando atualizações do repositório remoto..."
git fetch origin

# Exibir o que está diferente
echo "[v0] Comparando com main remoto..."
git log --oneline HEAD..origin/main -n 10

# Fazer merge com estratégia de prefer-ours (manter nossas mudanças em caso de conflito)
echo "[v0] Mesclando atualizações remotas (mantendo customizações locais)..."
git merge -X ours origin/main --no-edit

# Verificar status pós-merge
echo "[v0] Status pós-sincronização:"
git status

echo "[v0] Sincronização completa! Verifique se todos os arquivos estão corretos."
