# NexusPM 伺服器啟動腳本 (PowerShell)
# 使用方式:
#   .\start.ps1           (預設開發模式)
#   .\start.ps1 -Mode dev (開發模式，支援熱重載)
#   .\start.ps1 -Mode prod (正式預覽模式，自動打包並預覽)

param(
    [ValidateSet("dev", "prod")]
    [string]$Mode = "dev"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  NexusPM 營建專案與 RFI 管理系統 - PowerShell 啟動程式" -ForegroundColor Cyan
Write-Host "  執行模式: $(if ($Mode -eq 'dev') { '開發模式 (Development)' } else { '正式預覽模式 (Production Preview)' })" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. 檢查 Node.js 是否已安裝
try {
    $nodeVersion = node -v
    Write-Host "[環境] Node.js 偵測成功: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[錯誤] 系統中未偵測到 Node.js！" -ForegroundColor Red
    Write-Host "請前往官方網站下載並安裝 Node.js (建議 LTS 版本): https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 2. 檢查 node_modules
if (-not (Test-Path "$ScriptDir\node_modules")) {
    Write-Host "[提示] 偵測到尚未安裝套件，正在自動執行 npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[錯誤] npm install 失敗！" -ForegroundColor Red
        exit 1
    }
    Write-Host "[成功] 套件安裝完成！" -ForegroundColor Green
}

# 3. 檢查連接埠 3000
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "[警告] 連接埠 3000 已被佔用 (PID: $($portInUse.OwningProcess))，正在嘗試結束該程序..." -ForegroundColor Yellow
    try {
        Stop-Process -Id $portInUse.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    } catch {}
}

# 4. 根據模式啟動
if ($Mode -eq "prod") {
    Write-Host "[狀態] 正在進行生產環境編譯 (npm run build)..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[錯誤] 專案編譯失敗！" -ForegroundColor Red
        exit 1
    }
    Write-Host "[狀態] 啟動正式預覽伺服器: http://localhost:3000" -ForegroundColor Green
    npm run preview
} else {
    Write-Host "[狀態] 啟動 Vite 開發伺服器 (HMR): http://localhost:3000" -ForegroundColor Green
    npm run dev
}
