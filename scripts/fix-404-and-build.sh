#!/bin/bash

# RSV360 - Build e Deploy Helper
# Este script faz o build do frontend e verifica tudo

set -e

echo "================================================"
echo "RSV360 - Build Frontend & Fix 404"
echo "================================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build
echo -e "${BLUE}[1/4]${NC} Compilando frontend com Vite..."
npm run build

echo ""
echo -e "${BLUE}[2/4]${NC} Verificando se build foi criado..."

if [ -f "dist/public/index.html" ]; then
    echo -e "${GREEN}✓${NC} Build criado com sucesso!"
    FILE_SIZE=$(ls -lh dist/public/index.html | awk '{print $5}')
    echo -e "${GREEN}✓${NC} index.html: $FILE_SIZE"
else
    echo -e "${RED}✗${NC} ERRO: dist/public/index.html não encontrado!"
    exit 1
fi

# Step 3: Check assets
echo ""
echo -e "${BLUE}[3/4]${NC} Verificando assets..."

if [ -d "dist/public/assets" ]; then
    ASSET_COUNT=$(find dist/public/assets -type f | wc -l)
    echo -e "${GREEN}✓${NC} Assets criados: $ASSET_COUNT arquivos"
else
    echo -e "${YELLOW}⚠${NC} Pasta assets não encontrada (pode ser normal)"
fi

# Step 4: Summary
echo ""
echo -e "${BLUE}[4/4]${NC} Resumo do build:"
echo "================================================"
du -sh dist/public/
echo "================================================"
echo ""

echo -e "${GREEN}✓ Build concluído com sucesso!${NC}"
echo ""
echo "Próximas ações:"
echo "1. Teste localmente: npm run dev"
echo "2. Se tudo estiver OK, faça push:"
echo "   git add -A && git commit -m 'build: frontend ready' && git push"
echo "3. Vercel detectará e fará deploy automaticamente"
echo ""
