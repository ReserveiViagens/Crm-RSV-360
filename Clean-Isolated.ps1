param()

$ErrorActionPreference = "Stop"

$ports = @(3000,3002,3004,3005,3006,3200,3201,3210,3300,3302,3304,3305,3306,3307,6432,7379,9090,9093,9190,9193)

foreach ($port in $ports) {
  $conns = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
  if ($conns) {
    $conns | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Porta liberada: $port"
  }
}

try {
  docker compose -p rsv360_pms down | Out-Null
} catch {}

Write-Host "Limpeza concluída."
