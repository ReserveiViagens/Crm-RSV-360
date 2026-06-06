param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("pms", "ecosystem", "crm")]
  [string]$Stack
)

$ErrorActionPreference = "Stop"

switch ($Stack) {
  "pms" {
    docker compose -p rsv360_pms down
    Write-Host "Stack pms parada."
  }
  "ecosystem" {
    $ports = 3200,3201,3210
    foreach ($port in $ports) {
      Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique |
        ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    }
    Write-Host "Processos da stack ecosystem encerrados."
  }
  "crm" {
    $ports = 3200
    foreach ($port in $ports) {
      Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique |
        ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    }
    Write-Host "Processos da stack crm encerrados."
  }
}

