param()

$ErrorActionPreference = "Stop"

$ports = @(3000,3002,3004,3005,3006,3200,3201,3210,3300,3302,3304,3305,3306,3307,6432,7379,9090,9093,9190,9193)

Write-Host ""
Write-Host "=== Portas Escutando ==="
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $ports -contains $_.LocalPort } |
  Sort-Object LocalPort |
  Select-Object LocalPort, LocalAddress, OwningProcess |
  Format-Table -AutoSize

Write-Host ""
Write-Host "=== Docker ==="
try {
  docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
} catch {
  Write-Warning "Docker não disponível ou sem acesso."
}

