# NexusPM 營建專案與 RFI 管理系統 (本地端執行版)

營建工程敏捷甘特圖/工作看板、RFI 資訊請求簽核、圖檔變更追蹤與前後端 REST API 模擬系統。  
本專案已完全重構成支援 Windows 本地電腦開箱即用、一鍵雙擊啟動與關閉的完整版本。

---

## 🚀 快速開始（一鍵啟動與關閉）

本系統提供 **兩種執行模式** 以及 **Windows 批次檔 (.bat)** 與 **PowerShell (.ps1)** 兩種腳本版本：

### 🌟 方式一：Windows 批次檔（推薦，直接滑鼠雙擊即可）

| 腳本檔案 | 說明 | 特點 |
| :--- | :--- | :--- |
| **`start.bat`** 或 **`start_dev.bat`** | **開發模式 (Dev Mode)** 啟動 | 支援代碼即時熱重載 (HMR)，修改原始碼畫面自動更新。首次執行會自動安裝套件。 |
| **`start_prod.bat`** | **正式預覽模式 (Production Preview)** 啟動 | 自動執行最佳化編譯打包 (`npm run build`) 並以正式預覽伺服器運行，速度最快最穩定。 |
| **`stop.bat`** 或 **`stop_server.bat`** | **一鍵關閉伺服器** | 自動尋找並關閉佔用 Port 3000 的伺服器處理程序，乾淨釋放連接埠。 |

> 💡 **小撇步**：
> - 只要在檔案總管中對著 **`start.bat`** 點擊兩下，就會自動檢查 Node.js、自動安裝缺少的套件、啟動伺服器，並自動在瀏覽器中開啟 `http://localhost:3000`！
> - 想要完全關閉背景伺服器時，對著 **`stop.bat`** 點擊兩下即可。

---

### 💻 方式二：PowerShell 腳本（適合終端機使用者）

在專案目錄開啟 PowerShell 終端機：

```powershell
# 1. 啟動開發模式（預設）
.\start.ps1

# 2. 啟動正式預覽模式
.\start.ps1 -Mode prod

# 3. 關閉伺服器
.\stop.ps1
```

---

### 🛠️ 方式三：標準 npm 指令

```bash
# 1. 安裝相依套件（初次使用需執行）
npm install

# 2. 啟動開發伺服器
npm run dev
# 或
npm start

# 3. 編譯打包正式版本
npm run build

# 4. 預覽正式版本
npm run preview

# 5. 清理編譯快取
npm run clean
```

---

## 📋 環境需求

- **作業系統**：Windows 10 / 11、macOS、Linux
- **Node.js**：建議版本 `v18.0.0` 或 `v20.0.0` 以上 LTS 版本（[前往 Node.js 官網下載](https://nodejs.org/)）
- **瀏覽器**：Google Chrome、Microsoft Edge、Firefox 等現代瀏覽器

---

## ⚙️ 專案架構與技術棧

- **核心框架**：React 19, TypeScript
- **建置工具**：Vite 6
- **CSS 樣式**：TailwindCSS 4, Motion 動畫庫
- **圖示庫**：Lucide React
- **本機連接埠**：預設使用 `3000` 連接埠 (`http://localhost:3000`)

---

## ❓ 常見問題排除 (FAQ)

### Q1: 點擊 `start.bat` 出現「系統中未偵測到 Node.js」？
> **解答**：您的電腦尚未安裝 Node.js，或者安裝後尚未重開終端機。請至 [nodejs.org](https://nodejs.org/) 下載安裝 LTS 版本，安裝完成後再雙擊 `start.bat`。

### Q2: 提示「連接埠 3000 已被佔用」？
> **解答**：直接雙擊執行 **`stop.bat`**，它會自動搜尋並終止佔用 3000 埠的程序，接著再重新執行 `start.bat` 即可。

### Q3: 想更換成其他連接埠（如 5173 或 8080）？
> **解答**：至 `vite.config.ts` 與 `package.json` 將 `3000` 改為您想要的埠號即可。
