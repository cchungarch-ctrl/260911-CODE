# NexusPM 系統設計文件 (System Design Document)

本文件定義 NexusPM 營建專案與 RFI 管理系統之系統設計理念、整體架構、核心技術決策與設計原則。

---

## 1. 系統願景與產品定位 (Product Vision)

傳統大型營造工程專案面臨兩大核心痛點：
1. **排程與工務脫節**：進度排程（甘特圖）往往停留在工務所電腦，而現場工班與工程師使用的是敏捷看板與即時通訊，導致時程落差。
2. **資訊請求 (RFI) 簽核冗長**：現場圖說衝突或結構疑義時，紙本或 Email 釋疑單追蹤不易，導致工期延誤與額外變更設計成本。

**NexusPM** 定位為高敏捷、高透明、可完全離線執行的輕量化營建專案管理中樞，完美融合甘特圖排程、四象限敏捷看板、工程 RFI 釋疑追蹤、數據分析與單檔可攜式 HTML 匯出能力。

---

## 2. 總體架構 (System Architecture)

NexusPM 採用**現代純前端單頁應用程式 (Single Page Application, SPA)** 架構，具備零後端相依、極速響應與全離線持久化特性：

```mermaid
graph TD
    A[使用者瀏覽器] --> B[App.tsx 狀態核心中樞]
    B --> C[LocalStorage 瀏覽器持久化儲存]
    B --> D[Header / Sidebar 導航中樞]
    B --> E[GanttChart 甘特圖排程模組]
    B --> F[KanbanBoard 敏捷工作看板模組]
    B --> G[RfiTracker 資訊請求審查模組]
    B --> H[UsersView 人員權限模組]
    B --> I[AnalyticsView 數據分析模組]
    B --> J[ApiConsole 模擬 REST 主控台]
    B --> K[generateHtml 獨立單檔匯出引擎]
    K --> L[自包含獨立 HTML 檔案 (可離線傳閱)]
```

---

## 3. 核心設計模式與原則 (Design Patterns)

### 3.1 狀態提升與單一真相來源 (Single Source of Truth)
- 全域核心狀態（`currentProject`, `tasks`, `rfis`, `users`, `apiLogs`）集中管理於 `App.tsx`。
- 子視圖元件（`GanttChart`, `KanbanBoard`, `RfiTracker` 等）採宣告式接收 Props 與 Event Callbacks，確保狀態變更可即時跨元件連動（例如在看板建立關聯 RFI 的任務時，甘特圖與 RFI 列表同步反應）。

### 3.2 響應式本機持久化 (Automatic LocalStorage Sync)
- 透過 React `useEffect` 監聽狀態變化，自動將陣列資料同步寫入 `localStorage`。
- 初始化時具備容錯修復機制（若儲存格式損毀或舊資料缺少特定專案任務，自動從 `initialData.ts` 補齊或復原）。

### 3.3 獨立單檔匯出引擎 (Standalone Self-Contained Engine)
- 透過 `src/utils/generateHtml.ts`，能將當前專案的所有任務、釋疑單與人員狀態序列化，組裝為單一 `.html` 檔案。
- 產生的單檔內嵌 Tailwind CDN 與完整 Vanilla JS 互動功能，無需任何本機 Node.js 環境即可供外部業主、監造或建築師在任何設備上開啟。

---

## 4. 介面視覺設計系統 (Design System)

NexusPM 貫徹**工業工程極簡黑白風（Minimalist Industrial Monochrome）**，杜絕花俏裝飾，回歸建築工程藍圖的嚴謹：

### 4.1 核心視覺規範
- **零圓角 (`border-radius: 0`)**：全域無圓角直角設計，體現結構力學的俐落幾何。
- **高對比幾何邊框**：使用黑色邊框線條 (`#000000`) 與方塊實體陰影 (`shadow-[4px_4px_0px_0px_#000]`)。
- **微工程網格背景**：純白底圖帶有細微方格印刷質感。

### 4.2 字型階層
- **標題**：`Playfair Display`（高雅襯線體，凸顯專案里程碑重大感）。
- **正文**：`Source Serif 4`（閱讀舒適的工務內文體）。
- **代碼與數值**：`JetBrains Mono`（精準等寬字體，用於工料、工期、金額、代碼與 API Log）。

---

## 5. 本機執行與維運架構 (Local Execution Architecture)

為確保使用者在無命令列經驗下也能在個人電腦輕鬆運行本系統，架構特別設計了 Windows 批次檔與 PowerShell 自動化體系：

1. **開發版本 (Dev Server)**：
   - 腳本：`start_dev.bat` / `start.bat`
   - 機制：自動檢測 Node.js、自動安裝套件、啟動 Vite Dev Server (HMR) 並自動於預設瀏覽器開啟 `http://localhost:3000`。
2. **生產預覽版本 (Production Preview)**：
   - 腳本：`start_prod.bat`
   - 機制：自動打包 (`npm run build`)，並以 Vite Preview 伺服器提供最高效能之離線展示。
3. **優雅關閉伺服器**：
   - 腳本：`stop_server.bat` / `stop.bat` / `stop.ps1`
   - 機制：掃描 Port 3000 行程 PID 並強制釋放，杜絕通訊埠衝突。

---

## 6. 安全性與擴充性考量 (Security & Extensibility)

- **防範 XSS**：所有使用者自訂輸入（任務標題、說明、RFI 釋疑內容）在 React 與 HTML 匯出模組中均經過防逸出過濾。
- **後端 API 擴充規劃**：`ApiConsole.tsx` 定義了標準 RESTful 規格（`/api/v1/projects/:id/tasks`, `/api/v1/rfis`），未來若需接入實體 Node.js/Express 或 Python 後端時，可直接替換資料取得層。
