@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Stop-Isolated.ps1" %*
