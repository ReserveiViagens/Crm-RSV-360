param(
  [string]$Port = "3200",
  [string]$DatabaseUrl = "postgresql://test:test@localhost:5432/test_db_rsv360_crm"
)

$ErrorActionPreference = "Stop"

$root = "C:\Users\RSV 360\Documents\GitHub\Crm-RSV-360"
Set-Location $root

$env:PORT = $Port
$env:DATABASE_URL = $DatabaseUrl
$env:NODE_ENV = "development"

Write-Host "Iniciando Crm-RSV-360 em $root"
Write-Host "PORT=$env:PORT"
Write-Host "DATABASE_URL=$env:DATABASE_URL"

$process = Start-Process -FilePath "npm" -ArgumentList @("run", "dev") -WorkingDirectory $root -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 8

try {
  $health = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/api/status" -UseBasicParsing -TimeoutSec 5
  Write-Host "Healthcheck OK: http://127.0.0.1:$Port/api/status"
  Write-Host $health.Content
} catch {
  Write-Warning "Healthcheck ainda não respondeu em http://127.0.0.1:$Port/api/status"
}

Write-Host "Processo iniciado com PID $($process.Id)"

