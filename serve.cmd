@echo off
cd /d "%~dp0"
set PORT=8100
powershell.exe -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
