#!/usr/bin/env node

/**
 * Script de diagnóstico para entender o erro de build
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== DIAGNÓSTICO DE BUILD ===\n');

// 1. Verificar estrutura de diretórios
console.log('1. Verificando estrutura:\n');
const projectRoot = path.resolve(__dirname, '..');
const dirs = [
  'client',
  'server',
  'script',
  'scripts',
  'node_modules'
];

dirs.forEach(dir => {
  const fullPath = path.join(projectRoot, dir);
  const exists = fs.existsSync(fullPath);
  console.log(`   ${dir}: ${exists ? '✓ existe' : '✗ não existe'}`);
});

// 2. Verificar arquivos importantes
console.log('\n2. Arquivos importantes:\n');
const files = [
  'package.json',
  'vite.config.ts',
  'client/index.html',
  'client/src/main.tsx',
  'server/index.ts',
  'script/build.ts'
];

files.forEach(file => {
  const fullPath = path.join(projectRoot, file);
  const exists = fs.existsSync(fullPath);
  console.log(`   ${file}: ${exists ? '✓' : '✗'}`);
});

// 3. Tentar executar npm run build com saída completa
console.log('\n3. Executando npm run build:\n');
try {
  const output = execSync('npm run build', {
    cwd: projectRoot,
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  console.log(output);
} catch (error) {
  console.error('ERRO:', error.message);
  console.error('\nSTDOUT:', error.stdout);
  console.error('\nSTDERR:', error.stderr);
}
