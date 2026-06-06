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
  param(
    [string]$ScriptPath,
    [string]$Arguments = ""
  )

  if (-not (Test-Path $ScriptPath)) {
    throw "Script não encontrado: $ScriptPath"
  }

  $argList = @(
    "-NoProfile"
    "-ExecutionPolicy", "Bypass"
    "-File", $ScriptPath
  )

  if ($Arguments) {
    $argList += $Arguments.Split(" ")
  }

  Start-Process -FilePath "powershell" -ArgumentList $argList -WindowStyle Hidden | Out-Null
}

Start-IsolatedScript -ScriptPath (Join-Path $pmsRoot "Start-Isolated.ps1")
Start-IsolatedScript -ScriptPath (Join-Path $ecosystemRoot "Start-Isolated.ps1")
Start-IsolatedScript -ScriptPath (Join-Path $crmRoot "Start-Isolated.ps1")

Write-Host "Launchers isolados disparados."
Write-Host ""
Write-Host "Stack 1:"
Write-Host "  root: $pmsRoot"
Write-Host "  project: $PmsProjectName"
Write-Host "  portas remapeadas pelo script individual"
Write-Host ""
Write-Host "Stack 2:"
Write-Host "  root: $ecosystemRoot"
Write-Host "  guest:  $EcosystemGuestPort"
Write-Host "  admin:  $EcosystemAdminPort"
Write-Host "  api:    $EcosystemApiPort"
Write-Host ""
Write-Host "Stack 3:"
Write-Host "  root: $crmRoot"
Write-Host "  port: $CrmPort"
Write-Host "  database: $CrmDatabaseUrl"
Write-Host ""
Write-Host "Se você quiser parar tudo, feche os processos PowerShell que foram abertos ou use docker ps / Get-Process para encerrar manualmente."
