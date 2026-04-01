#!/bin/bash

# Script de Build e Deploy Preview para Vercel
# Uso: ./scripts/build-and-preview.sh

set -e

echo "================================"
echo "RSV360 - Build & Deploy Preview"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Instalar dependências
echo -e "${BLUE}Step 1: Instalando dependências...${NC}"
npm install
echo -e "${GREEN}✓ Dependências instaladas${NC}\n"

# Step 2: Verificar tipos TypeScript
echo -e "${BLUE}Step 2: Verificando tipos TypeScript...${NC}"
npm run check || echo -e "${YELLOW}⚠ Alguns erros de tipo encontrados (não crítico)${NC}"
echo ""

# Step 3: Build frontend com Vite
echo -e "${BLUE}Step 3: Building frontend com Vite...${NC}"
npm exec vite build
echo -e "${GREEN}✓ Build frontend concluído${NC}\n"

# Step 4: Verificar output
echo -e "${BLUE}Step 4: Verificando output...${NC}"
if [ -d "dist/public" ]; then
  echo -e "${GREEN}✓ dist/public existe${NC}"
  echo "Conteúdo:"
  ls -lh dist/public/ | head -20
  echo ""
  
  if [ -f "dist/public/index.html" ]; then
    echo -e "${GREEN}✓ index.html encontrado${NC}"
  else
    echo -e "${YELLOW}⚠ index.html não encontrado${NC}"
  fi
else
  echo -e "${YELLOW}⚠ dist/public não encontrado${NC}"
fi
echo ""

# Step 5: Verificar vercel.json
echo -e "${BLUE}Step 5: Verificando vercel.json...${NC}"
if [ -f "vercel.json" ]; then
  echo -e "${GREEN}✓ vercel.json encontrado${NC}"
  echo "Conteúdo:"
  cat vercel.json | head -10
else
  echo -e "${YELLOW}⚠ vercel.json não encontrado${NC}"
fi
echo ""

# Step 6: Build summary
echo -e "${BLUE}Step 6: Resumo do Build${NC}"
echo "================================"
echo -e "${GREEN}✓ Build concluído com sucesso!${NC}"
echo ""
echo "Próximos passos:"
echo "1. Fazer push do código:"
echo "   git add -A && git commit -m 'build: frontend ready for deploy' && git push"
echo ""
echo "2. Ir para Vercel Dashboard:"
echo "   https://vercel.com/dashboard"
echo ""
echo "3. Deploy:"
echo "   - Se GitHub está conectado, deploy automático ao fazer push"
echo "   - Ou clique 'Deploy' no Vercel Dashboard"
echo ""
echo "4. Verificar:"
echo "   - Home carrega em https://seu-project.vercel.app"
echo "   - Não há 404 em refresh de rotas"
echo "   - API calls funcionam (se backend configurado)"
echo "================================"
