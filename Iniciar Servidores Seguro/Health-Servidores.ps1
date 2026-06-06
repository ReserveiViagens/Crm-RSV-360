param()

$ErrorActionPreference = "Stop"

$checks = @(
  @{ Name = "pms backend"; Url = "http://127.0.0.1:3302/health" },
  @{ Name = "pms site"; Url = "http://127.0.0.1:3300" },
  @{ Name = "pms admin"; Url = "http://127.0.0.1:3304" },
  @{ Name = "pms turismo"; Url = "http://127.0.0.1:3305" },
  @{ Name = "pms guest"; Url = "http://127.0.0.1:3306" },
  @{ Name = "ecosystem guest"; Url = "http://127.0.0.1:3200" },
  @{ Name = "ecosystem admin"; Url = "http://127.0.0.1:3201" },
  @{ Name = "ecosystem api"; Url = "http://127.0.0.1:3210/health" },
  @{ Name = "crm api"; Url = "http://127.0.0.1:3200/api/status" }
)

Write-Host ""
Write-Host "=== Healthchecks ==="
foreach ($check in $checks) {
  try {
    $response = Invoke-WebRequest -Uri $check.Url -UseBasicParsing -TimeoutSec 5
    Write-Host "$($check.Name): OK [$($response.StatusCode)] $($check.Url)"
  } catch {
    Write-Warning "$($check.Name): indisponível $($check.Url)"
  }
}

