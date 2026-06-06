param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("pms", "ecosystem", "crm")]
  [string]$Stack
)

$ErrorActionPreference = "Stop"

$base = Split-Path -Parent $MyInvocation.MyCommand.Path

switch ($Stack) {
  "pms" { $scriptPath = "D:\Backup rsv36-servidor-oficial 22_11_2025as_08_36\RSV360 Versao Oficial definitivo\PMS-CRM-RSV360-Versao-Oficial-definitivo\PMS-CRM-RSV360-Versao-Oficial-definitivo\Start-Isolated.ps1" }
  "ecosystem" { $scriptPath = "D:\Backup rsv36-servidor-oficial 22_11_2025as_08_36\rsv360-servidor-oficial\Start-Isolated.ps1" }
  "crm" { $scriptPath = "C:\Users\RSV 360\Documents\GitHub\Crm-RSV-360\Start-Isolated.ps1" }
}

if (-not (Test-Path $scriptPath)) { throw "Launcher não encontrado: $scriptPath" }

Write-Host "Iniciando stack: $Stack"
& powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath

