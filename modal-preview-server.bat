@echo off
echo Starting modal preview server...
cd /d "%~dp0public"
start "" http://localhost:8080/modal-preview.html
npx serve . -p 8080
pause
