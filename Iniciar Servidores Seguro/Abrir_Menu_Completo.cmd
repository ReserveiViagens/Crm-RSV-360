@echo off
setlocal
set "ROOT=%~dp0"
set "LOG=%ROOT%menu-completo-cmd.log"
echo [%date% %time%] Abrindo menu completo > "%LOG%"
echo Root: %ROOT%>> "%LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%Menu-Servidores.ps1" >> "%LOG%" 2>&1
set "EXITCODE=%ERRORLEVEL%"
echo [%date% %time%] ExitCode=%EXITCODE%>> "%LOG%"
echo.
echo Menu encerrado com ExitCode=%EXITCODE%
echo Log: "%LOG%"
pause
exit /b %EXITCODE%
