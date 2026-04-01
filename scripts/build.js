#!/usr/bin/env node

/**
 * Build Script para Reservei Viagens CRM
 * Compila o frontend React com Vite e o backend com esbuild
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const process = require('process');

// Detectar o diretório correto
const cwd = process.cwd();
console.log(`[BUILD] Diretório de trabalho: ${cwd}\n`);

// Verificar se package.json existe
const packageJsonPath = path.join(cwd, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('[BUILD] ERRO: package.json não encontrado em:', packageJsonPath);
  console.error('[BUILD] Diretório atual:', process.cwd());
  console.error('[BUILD] Arquivos no diretório:');
  try {
    const files = fs.readdirSync(process.cwd());
    console.error(files.slice(0, 20).join(', '));
  } catch (e) {
    console.error('Não foi possível listar arquivos');
  }
  process.exit(1);
}

console.log('[BUILD] Iniciando compilação do projeto...\n');

// Executar npm run build
const buildProcess = exec('npm run build', {
  cwd: cwd,
  maxBuffer: 10 * 1024 * 1024  // 10MB buffer
});

// Mostra output em tempo real
buildProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
});

buildProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('\n[BUILD] Erro ao compilar projeto (código:', code, ')');
    process.exit(1);
  }

  console.log('\n[BUILD] Compilação concluída com sucesso!');
  
  // Verificar se dist foi criado
  const distPath = path.join(cwd, 'dist');
  const publicPath = path.join(distPath, 'public');
  
  if (fs.existsSync(distPath)) {
    console.log('[BUILD] Pasta /dist criada');
    
    if (fs.existsSync(publicPath)) {
      const publicFiles = fs.readdirSync(publicPath);
      console.log(`[BUILD] /dist/public criada com ${publicFiles.length} arquivo(s)`);
      const hasIndex = fs.existsSync(path.join(publicPath, 'index.html'));
      console.log(`[BUILD] index.html: ${hasIndex ? '✓ encontrado' : '✗ não encontrado'}`);
    }
    
    const indexFile = path.join(distPath, 'index.cjs');
    if (fs.existsSync(indexFile)) {
      console.log('[BUILD] /dist/index.cjs criado (servidor compilado)');
    }
  }

  console.log('\n[BUILD] Próximo passo: npm run dev');
  process.exit(0);
});

buildProcess.on('error', (err) => {
  console.error('[BUILD] Erro ao executar build:', err.message);
  process.exit(1);
});
