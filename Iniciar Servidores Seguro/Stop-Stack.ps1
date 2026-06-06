$ErrorActionPreference = "Stop"

$base = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "=== RSV360 Stop Stack ==="
Write-Host "1) pms"
Write-Host "2) ecosystem"
Write-Host "3) crm"
Write-Host ""

$choice = Read-Host "Escolha uma stack para parar"

switch ($choice) {
  "1" {
    & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Stop-Isolated.ps1") -Stack pms
  }
  "2" {
    & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Stop-Isolated.ps1") -Stack ecosystem
  }
  "3" {
    & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Stop-Isolated.ps1") -Stack crm
  }
  default {
    Write-Host "Opção inválida. Nenhuma stack foi parada."
    exit 1
  }
}
