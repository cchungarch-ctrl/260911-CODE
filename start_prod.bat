@echo off
chcp 65001 >nul
title NexusPM 營建專案管理系統 - 正式預覽伺服器
cd /d "%~dp0"

echo ====================================================================
echo   NexusPM 營建專案與 RFI 管理系統 - [正式預覽模式 Production Mode]
echo ====================================================================
echo.

:: 1. 檢查 Node.js 是否已安裝
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 系統中未偵測到 Node.js！
    echo 請前往 Node.js 官方網站下載並安裝 (建議 LTS 版本):
    echo https://nodejs.org/
    echo.
    echo 安裝完成後，請重新執行此腳本。
    pause
    exit /b 1
)

:: 2. 檢查是否已安裝 node_modules 相依套件
if not exist "node_modules\" (
    echo [提示] 偵測到尚未安裝專案相依套件，正在為您自動執行安裝 (npm install)...
    echo 此步驟初次執行需耗時約 1~2 分鐘，請稍候...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [錯誤] npm install 安裝相依套件失敗，請檢查網路連線或權限。
        pause
        exit /b 1
    )
    echo.
    echo [成功] 相依套件安裝完成！
    echo.
)

:: 3. 檢查 Port 3000 是否已被佔用
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    if not "%%a"=="" (
        echo [警告] 連接埠 3000 目前已被處理程序 PID %%a 佔用。
        echo 正在嘗試自動清理舊伺服器處理程序...
        taskkill /F /PID %%a >nul 2>&1
        timeout /t 1 >nul
    )
)

:: 4. 執行生產環境編譯打包
echo [狀態] 正在進行專案生產環境編譯打包 (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [錯誤] 專案編譯失敗，請檢查終端機訊息。
    pause
    exit /b 1
)

echo.
echo [狀態] 正在啟動 Vite 預覽正式伺服器 (Production Preview)...
echo [網址] 預設伺服器網址: http://localhost:3000
echo [提示] 將自動在您的預設瀏覽器中開啟頁面。
echo [提示] 若要關閉伺服器，可直接關閉此視窗，或雙擊執行 stop.bat。
echo ====================================================================
echo.

call npm run preview

pause
