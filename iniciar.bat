@echo off
echo =================================
echo   Instalando dependencias...
echo =================================
call npm install

echo.
echo =================================
echo   Abrindo Cypress...
echo =================================
call npx cypress open
pause
