# NexusPM 系統正式規格庫 (`doc/spec/`)

本目錄為 NexusPM 營建專案與 RFI 管理系統之正式技術與功能規格庫。  
依據專案維護準則，**所有規格皆採分章節撰寫**，並在功能開發完成後及時回寫更新。

---

## 📚 章節目錄 (Table of Contents)

- **[第一章：系統總體架構與環境規格 (01_system_architecture.md)](file:///c:/Users/mail/Documents/AI練習/260911-CODE/doc/spec/01_system_architecture.md)**
  - 1.1 系統定位與架構理念
  - 1.2 技術棧與執行環境規格
  - 1.3 專案目錄結構規範
  - 1.4 本機執行與建置規格

- **[第二章：核心業務模組規格 (02_core_modules.md)](file:///c:/Users/mail/Documents/AI練習/260911-CODE/doc/spec/02_core_modules.md)**
  - 2.1 專案導覽與頂部狀態列模組
  - 2.2 工程甘特圖排程模組 (Gantt Chart)
  - 2.3 敏捷工程工作看板 (Kanban Board)
  - 2.4 RFI 資訊請求簽核與追蹤模組 (RFI Tracker)
  - 2.5 專案人員與角色權限模組 (Users View)
  - 2.6 工務進度與數據分析模組 (Analytics View)
  - 2.7 模擬 REST API 主控台 (API Console)
  - 2.8 獨立單檔 HTML 靜態匯出引擎 (Standalone Export Engine)

- **[第三章：資料模型與狀態持久化規格 (03_data_models.md)](file:///c:/Users/mail/Documents/AI練習/260911-CODE/doc/spec/03_data_models.md)**
  - 3.1 專案定義 (Project Schema)
  - 3.2 任務定義 (KanbanTask Schema)
  - 3.3 資訊請求定義 (RfiItem Schema)
  - 3.4 人員定義 (User Schema)
  - 3.5 API 日誌模型 (ApiLog Schema)
  - 3.6 LocalStorage 儲存鍵值與同步機制

- **[第四章：介面設計系統與交互規範 (04_ui_ux_standards.md)](file:///c:/Users/mail/Documents/AI練習/260911-CODE/doc/spec/04_ui_ux_standards.md)**
  - 4.1 字型系統 (Typography)
  - 4.2 極簡黑白調色盤 (Minimalist Monochrome Palette)
  - 4.3 零圓角 (Sharp Edges) 與工業工程風格
  - 4.4 模態視窗 (Modals) 與互動元件規範
  - 4.5 響應式佈局 (Responsive Layout) 與自訂滾動條

---

## ✍️ 規格維護與回寫準則

1. **章節歸屬**：新增功能完成後，若牽涉到業務邏輯，更新於「第二章」；若牽涉到資料欄位，更新於「第三章」；若牽涉到設計規範，更新於「第四章」。
2. **格式一致性**：保持 Markdown 清晰階層、表格說明、程式碼區塊標註。
3. **不得脫節**：代碼如有重構或調整欄位名稱，必須同步修正本目錄之規格書。
