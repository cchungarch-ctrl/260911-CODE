# NexusPM 伺服器關閉腳本 (PowerShell)
# 使用方式:
#   .\stop.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  NexusPM 營建專案管理系統 - PowerShell 伺服器關閉程式" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$stopped = 0

if ($connections) {
    foreach ($conn in $connections) {
        $pId = $conn.OwningProcess
        if ($pId -and $pId -gt 0) {
            Write-Host "[處理中] 正在終止佔用 Port 3000 之程序 (PID: $pId)..." -ForegroundColor Yellow
            try {
                Stop-Process -Id $pId -Force -ErrorAction SilentlyContinue
                Write-Host "[成功] 已結束程序 PID: $pId" -ForegroundColor Green
                $stopped++
            } catch {
                Write-Host "[提示] 無法結束程序 PID: $pId 或該程序已自行結束。" -ForegroundColor Gray
            }
        }
    }
}

if ($stopped -gt 0) {
    Write-Host ""
    Write-Host "====================================================================" -ForegroundColor Green
    Write-Host "  NexusPM 伺服器已成功關閉，連接埠 3000 已釋放！" -ForegroundColor Green
    Write-Host "====================================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "====================================================================" -ForegroundColor Gray
    Write-Host "  目前未偵測到佔用 Port 3000 的伺服器程序，伺服器未在運行中。" -ForegroundColor Gray
    Write-Host "====================================================================" -ForegroundColor Gray
}

Write-Host ""
