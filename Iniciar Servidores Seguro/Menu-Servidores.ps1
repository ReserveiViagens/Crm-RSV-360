$ErrorActionPreference = "Stop"

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$logPath = Join-Path $base "menu-debug.log"

Start-Transcript -Path $logPath -Append | Out-Null

try {
  function Write-Header {
    Clear-Host
    Write-Host "========================================" -ForegroundColor DarkCyan
    Write-Host "         RSV360 SERVIDORES             " -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor DarkCyan
    Write-Host ""
  }

  function Show-Menu {
    Write-Header
    Write-Host "[1] Iniciar stack" -ForegroundColor Green
    Write-Host "[2] Parar stack" -ForegroundColor Yellow
    Write-Host "[3] Limpar tudo" -ForegroundColor Red
    Write-Host "[4] Ver portas" -ForegroundColor Cyan
    Write-Host "[5] Ver healthchecks" -ForegroundColor Magenta
    Write-Host "[6] Sair" -ForegroundColor Gray
    Write-Host ""
  }

  function Pick-Stack {
    Write-Host ""
    Write-Host "Selecione a stack:" -ForegroundColor Cyan
    Write-Host "  [1] pms" -ForegroundColor Green
    Write-Host "  [2] ecosystem" -ForegroundColor Green
    Write-Host "  [3] crm" -ForegroundColor Green
    Write-Host ""
    return Read-Host "Escolha uma stack"
  }

  while ($true) {
    Show-Menu
    $choice = Read-Host "Escolha uma opcao"

    switch ($choice) {
      "1" {
        $stackChoice = Pick-Stack
        switch ($stackChoice) {
          "1" { & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Start-One-Isolated.ps1") -Stack pms }
          "2" { & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Start-One-Isolated.ps1") -Stack ecosystem }
          "3" { & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Start-One-Isolated.ps1") -Stack crm }
          default { Write-Host "Stack invalida." -ForegroundColor Red }
        }
        Read-Host "Pressione Enter para continuar"
      }
      "2" {
        $stackChoice = Pick-Stack
        switch ($stackChoice) {
          "1" { & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Stop-Isolated.ps1") -Stack pms }
          "2" { & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Stop-Isolated.ps1") -Stack ecosystem }
          "3" { & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Stop-Isolated.ps1") -Stack crm }
          default { Write-Host "Stack invalida." -ForegroundColor Red }
        }
        Read-Host "Pressione Enter para continuar"
      }
      "3" {
        & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Clean-Isolated.ps1")
        Read-Host "Pressione Enter para continuar"
      }
      "4" {
        & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Status-Servidores.ps1")
        Read-Host "Pressione Enter para continuar"
      }
      "5" {
        & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $base "Health-Servidores.ps1")
        Read-Host "Pressione Enter para continuar"
      }
      "6" {
        break
      }
      default {
        Write-Host "Opcao invalida." -ForegroundColor Red
        Start-Sleep -Seconds 1
      }
    }
  }
}
catch {
  Write-Host ""
  Write-Host "ERRO NO MENU:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host ""
  Read-Host "Pressione Enter para fechar"
}
finally {
  Stop-Transcript | Out-Null
}
