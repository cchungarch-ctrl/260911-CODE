# 第一章：系統總體架構與環境規格

> **版本**：v1.0.0  
> **最後更新**：2026-09-11  
> **分類**：系統架構規格

---

## 1.1 系統定位與架構理念

NexusPM 是專為大型營造、公共工程與建築營建專案設計的敏捷專案管理與 RFI (Request for Information) 資訊請求簽核系統。  
核心理念在於提供：
1. **高敏捷性**：結合工期甘特圖（排程視角）與看板（執行視角）。
2. **全離線可用性**：基於純前端 SPA 架構，資料持久化於瀏覽器 LocalStorage，無需強制連線遠端資料庫即可運作。
3. **單檔可攜性**：提供一鍵產生自包含（Self-Contained）獨立 HTML 檔案功能，包含所有樣式與目前專案資料，可離線以 Email 或 USB 傳閱審閱。
4. **本機開箱即用**：提供 Windows 雙點擊批次檔與 PowerShell 腳本，無縫啟動與關閉伺服器。

---

## 1.2 技術棧規格

| 範疇 | 技術選型 | 版本 | 用途說明 |
| :--- | :--- | :--- | :--- |
| **前端框架** | React | `^19.0.1` | 核心 UI 狀態驅動框架，使用函數元件與 Hooks |
| **程式語言** | TypeScript | `~5.8.2` | 強型別檢查與介面定義 |
| **建置工具** | Vite | `^6.2.3` | 開發伺服器 (HMR) 與正式打包工具 |
| **樣式引擎** | Tailwind CSS | `^4.1.14` | 極簡工業工程風格實用優先 CSS 引擎 |
| **動畫庫** | Motion | `^12.23.24` | 視窗切換與平滑交互動畫 |
| **圖示庫** | Lucide React | `^0.546.0` | 簡約幾何向量圖示 |
| **跨平台執行** | Node.js | `>= 18.0.0` | 本機開發與預覽運行環境 |

---

## 1.3 專案目錄結構規範

```
├── .env                       # 本機環境變數配置
├── doc/                       # 專案文件庫
│   ├── spec/                  # 系統規格書（分章節維護）
│   └── dev/                   # 功能開發計畫庫 (plan_<名稱>.md)
├── src/                       # 原始碼根目錄
│   ├── components/            # UI 視圖與組件
│   │   ├── Modals/            # 彈出對話框組件群
│   │   ├── AnalyticsView.tsx  # 數據統計視圖
│   │   ├── ApiConsole.tsx     # REST API 模擬主控台
│   │   ├── GanttChart.tsx     # 工程甘特圖
│   │   ├── Header.tsx         # 頂部狀態與操作列
│   │   ├── KanbanBoard.tsx    # 敏捷工作看板
│   │   ├── RfiTracker.tsx     # RFI 追蹤與審查模組
│   │   ├── Sidebar.tsx        # 側邊導航列
│   │   └── UsersView.tsx      # 人員角色視圖
│   ├── data/
│   │   └── initialData.ts     # 初始預設專案、人員、任務與 RFI 資料
│   ├── utils/
│   │   └── generateHtml.ts    # 獨立單檔 HTML 匯出引擎
│   ├── App.tsx                # 應用程式主入口與狀態中樞
│   ├── index.css              # 全域樣式與字型設定
│   ├── main.tsx               # React 根掛載點
│   └── types.ts               # 全域型別定義
├── index.html                 # 應用程式 HTML 範本
├── package.json               # 專案套件配置與 scripts
├── vite.config.ts             # Vite 建置配置
├── start.bat / stop.bat       # 本機快速啟動與關閉批次檔
└── start.ps1 / stop.ps1       # 本機快速啟動與關閉 PowerShell 腳本
```

---

## 1.4 本機執行與建置規格

- **開發伺服器**：`npm run dev` 監聽於 `http://localhost:3000`，具備 HMR 熱重載。
- **正式預覽伺服器**：`npm run preview` 監聽於 `http://localhost:3000`。
- **跨平台清理**：`npm run clean` 使用 Node 原生 `fs.rmSync`，相容 Windows、Linux 與 macOS。
- **連接埠規範**：預設使用 `3000` 埠。
