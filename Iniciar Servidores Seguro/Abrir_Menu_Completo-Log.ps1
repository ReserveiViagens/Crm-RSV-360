param(
  [string]$LogPath = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\menu-completo-ps.log"
)

$ErrorActionPreference = "Stop"

New-Item -ItemType File -Path $LogPath -Force | Out-Null
Start-Transcript -Path $LogPath -Append | Out-Null

try {
  & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "Menu-Servidores.ps1")
}
finally {
  Stop-Transcript | Out-Null
}
