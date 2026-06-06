param(
  [string]$PmsProjectName = "rsv360_pms",
  [string]$EcosystemGuestPort = "3200",
  [string]$EcosystemAdminPort = "3201",
  [string]$EcosystemApiPort = "3210",
  [string]$CrmPort = "3200",
  [string]$CrmDatabaseUrl = "postgresql://test:test@localhost:5432/test_db_rsv360_crm"
)

$ErrorActionPreference = "Stop"

$pmsRoot = "D:\Backup rsv36-servidor-oficial 22_11_2025as_08_36\RSV360 Versao Oficial definitivo\PMS-CRM-RSV360-Versao-Oficial-definitivo\PMS-CRM-RSV360-Versao-Oficial-definitivo"
$ecosystemRoot = "D:\Backup rsv36-servidor-oficial 22_11_2025as_08_36\rsv360-servidor-oficial"
$crmRoot = "C:\Users\RSV 360\Documents\GitHub\Crm-RSV-360"

function Start-IsolatedScript {
  param([string]$ScriptPath)
  if (-not (Test-Path $ScriptPath)) { throw "Script não encontrado: $ScriptPath" }
  Start-Process -FilePath "powershell" -ArgumentList @("-NoProfile","-ExecutionPolicy","Bypass","-File",$ScriptPath) -WindowStyle Hidden | Out-Null
}

Start-IsolatedScript -ScriptPath (Join-Path $pmsRoot "Start-Isolated.ps1")
Start-IsolatedScript -ScriptPath (Join-Path $ecosystemRoot "Start-Isolated.ps1")
Start-IsolatedScript -ScriptPath (Join-Path $crmRoot "Start-Isolated.ps1")

Write-Host "Launchers isolados disparados."

