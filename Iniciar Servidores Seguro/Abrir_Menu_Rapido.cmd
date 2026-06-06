@echo off
setlocal
set "ROOT=%~dp0"
set "LOG=%ROOT%menu-rapido-cmd.log"
echo [%date% %time%] Abrindo menu rapido > "%LOG%"
echo Root: %ROOT%>> "%LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%Menu-Servidores-Minimo.ps1" >> "%LOG%" 2>&1
set "EXITCODE=%ERRORLEVEL%"
echo [%date% %time%] ExitCode=%EXITCODE%>> "%LOG%"
echo.
echo Menu encerrado com ExitCode=%EXITCODE%
echo Log: "%LOG%"
pause
exit /b %EXITCODE%
