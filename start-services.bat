@echo off
chcp 65001 >nul
echo Starting File Management System Services...
echo.

echo Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "cd /d C:\static-site && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Port 8000)...
start "Frontend Server" cmd /k "cd /d C:\static-site && python -m http.server 8000"

echo.
echo Services Started Successfully!
echo Backend API: http://localhost:3000
echo Frontend Page: http://localhost:8000
echo File Management: http://localhost:8000/files.html
echo.
echo Press any key to close this window...
pause >nul