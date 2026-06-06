$ErrorActionPreference = "Stop"

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$logPath = Join-Path $base "menu-minimo-debug.log"

New-Item -ItemType File -Path $logPath -Force | Out-Null

Start-Transcript -Path $logPath -Append | Out-Null

try {
  Write-Host "Menu minimo ativo em: $base" -ForegroundColor DarkGray
  Write-Host "RSV360" -ForegroundColor Cyan
  Write-Host "1) Start" -ForegroundColor Green
  Write-Host "2) Stop" -ForegroundColor Yellow
  Write-Host "3) Clean" -ForegroundColor Red
  Write-Host "4) Status" -ForegroundColor Cyan
  Write-Host "5) Health" -ForegroundColor Magenta
  Write-Host "6) Exit" -ForegroundColor Gray
  Write-Host ""

  $choice = Read-Host "Opcao"

  switch ($choice) {
    "1" {
      $stack = Read-Host "Stack (pms/ecosystem/crm)"
      & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Start-One-Isolated.ps1") -Stack $stack
    }
    "2" {
      $stack = Read-Host "Stack (pms/ecosystem/crm)"
      & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Stop-Isolated.ps1") -Stack $stack
    }
    "3" {
      & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Clean-Isolated.ps1")
    }
    "4" {
      & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Status-Servidores.ps1")
    }
    "5" {
      & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Health-Servidores.ps1")
    }
    default {
      Write-Host "Encerrado." -ForegroundColor Gray
    }
  }
}
catch {
  Write-Host ""
  Write-Host "ERRO NO MENU MINIMO:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host ""
  Read-Host "Pressione Enter para fechar"
}
finally {
  Stop-Transcript | Out-Null
}
