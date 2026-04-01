#!/usr/bin/env node

import fs from "fs";
import path from "path";

const checks = [];

// Check 1: client/index.html exists
const indexPath = path.resolve("client/index.html");
checks.push({
  name: "client/index.html exists",
  status: fs.existsSync(indexPath) ? "✓" : "✗",
});

// Check 2: client/src/main.tsx exists
const mainPath = path.resolve("client/src/main.tsx");
checks.push({
  name: "client/src/main.tsx exists",
  status: fs.existsSync(mainPath) ? "✓" : "✗",
});

// Check 3: client/src/App.tsx exists
const appPath = path.resolve("client/src/App.tsx");
checks.push({
  name: "client/src/App.tsx exists",
  status: fs.existsSync(appPath) ? "✓" : "✗",
});

// Check 4: server/index.ts exists
const serverPath = path.resolve("server/index.ts");
checks.push({
  name: "server/index.ts exists",
  status: fs.existsSync(serverPath) ? "✓" : "✗",
});

// Check 5: vite.config.ts exists
const vitePath = path.resolve("vite.config.ts");
checks.push({
  name: "vite.config.ts exists",
  status: fs.existsSync(vitePath) ? "✓" : "✗",
});

// Check 6: package.json exists
const pkgPath = path.resolve("package.json");
checks.push({
  name: "package.json exists",
  status: fs.existsSync(pkgPath) ? "✓" : "✗",
});

// Check 7: node_modules exists
const nodeModulesPath = path.resolve("node_modules");
checks.push({
  name: "node_modules exists",
  status: fs.existsSync(nodeModulesPath) ? "✓" : "✗",
});

console.log("\n=== PROJECT STRUCTURE DIAGNOSTIC ===\n");
checks.forEach((check) => {
  console.log(`${check.status} ${check.name}`);
});

const allPass = checks.every((c) => c.status === "✓");
console.log(
  `\n${allPass ? "✓ All checks passed!" : "✗ Some checks failed!"}\n`
);

if (!allPass) {
  console.log("ACTIONS NEEDED:");
  console.log(
    "1. npm install (to install node_modules if missing)"
  );
  console.log("2. npm run dev (to start development server)");
}
