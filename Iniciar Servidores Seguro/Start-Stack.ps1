$ErrorActionPreference = "Stop"

$base = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "=== RSV360 Start Stack ==="
Write-Host "1) pms"
Write-Host "2) ecosystem"
Write-Host "3) crm"
Write-Host ""

$choice = Read-Host "Escolha uma stack"

$stackName = switch ($choice) {
  "1" { "pms" }
  "2" { "ecosystem" }
  "3" { "crm" }
  default { $null }
}

if (-not $stackName) {
  Write-Host "Opcao invalida. Nenhuma stack foi iniciada."
  exit 1
}

$stackScript = Join-Path $base "Start-One-Isolated.ps1"

if (-not (Test-Path $stackScript)) {
  Write-Host "Launcher nao encontrado: $stackScript"
  exit 1
}

Write-Host "Iniciando stack: $stackName"
Start-Process powershell -WindowStyle Normal -ArgumentList @(
  "-NoProfile",
  "-ExecutionPolicy",
  "Bypass",
  "-NoExit",
  "-File",
  $stackScript,
  "-Stack",
  $stackName
)
