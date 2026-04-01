import fs from 'fs';
import path from 'path';

console.log('[v0] Starting detailed Vite middleware diagnostic...\n');

// Get the actual working directory
const cwd = process.cwd();
console.log('[v0] Current working directory:', cwd);

// Check key paths
const paths = {
  'client/index.html': path.join(cwd, 'client/index.html'),
  'client/src/main.tsx': path.join(cwd, 'client/src/main.tsx'),
  'vite.config.ts': path.join(cwd, 'vite.config.ts'),
  'server/vite.ts': path.join(cwd, 'server/vite.ts'),
  'server/index.ts': path.join(cwd, 'server/index.ts'),
};

console.log('\n[v0] File existence check:');
Object.entries(paths).forEach(([name, filepath]) => {
  const exists = fs.existsSync(filepath);
  console.log(`  ${exists ? '✓' : '✗'} ${name}`);
  if (!exists) {
    console.log(`    Expected at: ${filepath}`);
  }
});

// Check if we can actually read the vite config
console.log('\n[v0] Vite config import test:');
try {
  const vitePath = path.join(cwd, 'vite.config.ts');
  if (fs.existsSync(vitePath)) {
    const content = fs.readFileSync(vitePath, 'utf-8');
    console.log(`  ✓ vite.config.ts readable (${content.length} bytes)`);
  }
} catch (err) {
  console.log('[v0] Error reading vite.config.ts:', err.message);
}

// Check Node version and npm version
console.log('\n[v0] Environment info:');
console.log(`  Node: ${process.version}`);
try {
  const npmVersion = require('child_process').execSync('npm -v', { encoding: 'utf-8' }).trim();
  console.log(`  npm: ${npmVersion}`);
} catch (err) {
  console.log(`  npm: unable to determine`);
}

// Check if TypeScript is installed
console.log('\n[v0] Build tools check:');
const tools = ['vite', 'typescript', 'react', 'react-dom', 'wouter'];
tools.forEach(tool => {
  const toolPath = path.join(cwd, 'node_modules', tool);
  const exists = fs.existsSync(toolPath);
  console.log(`  ${exists ? '✓' : '✗'} ${tool}`);
});

console.log('\n[v0] Diagnostic complete. If any critical tools are missing, run: npm install');
