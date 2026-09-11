# NexusPM - AI Agent 行為規範與開發工作守則 (AGENTS.md)

本文件定義所有 AI Agent（包括 Antigravity、語音代理、代碼審查員等）在本專案工作時**必須絕對遵守的核心規範與生命週期流程**。

---

## 🧭 核心開發生命週期五步驟 (Mandatory Lifecycle)

所有功能開發、重大重構或架構調整，**絕對禁止直接未經規劃就修改原始碼**。必須嚴格遵循以下五個階段：

```
[階段 1: 討論釐清] ──> [階段 2: 撰寫計畫] ──> [階段 3: 參照實作] ──> [階段 4: 測試驗收] ──> [階段 5: 規格回寫]
```

### 階段 1：開發前討論 (Discussion & Alignment)
- 與使用者確認需求目標、邊界範圍、技術可行性與 UI 交互體驗。
- 主動釐清模糊事項，切忌臆測關鍵業務邏輯。

### 階段 2：撰寫開發計畫至 `doc/dev/` (Plan Creation)
- **存放位置**：`doc/dev/` 目錄。
- **命名規範**：必須嚴格以 `plan_<功能名稱>.md` 命名（例如：`doc/dev/plan_export_excel.md`）。
- **計畫內容**：
  1. 需求背景與驗收目標
  2. 討論要點與共識
  3. 系統架構影響分析（受影響的檔案與元件）
  4. 具體修改清單（循序漸進的修改檔案與重點代碼）
  5. 驗證與測試流程
  6. 規格回寫確認清單（預計更新的 `doc/spec/` 章節）

### 階段 3：嚴格參照計畫進行開發 (Implementation)
- 進入寫代碼階段時，**必須以 `doc/dev/plan_<功能名稱>.md` 為唯一執行藍圖**。
- 遵循最小修改原則，保持代碼簡潔與型別安全。

### 階段 4：本機驗證與測試 (Verification)
- 確保本機啟動腳本正常（`start_dev.bat`、`npm run dev`）。
- 確保 TypeScript 型別檢查無誤 (`npm run lint` 或 `tsc --noEmit`)。
- 驗證畫面無報錯、互動流暢。

### 階段 5：功能完成後回寫正式規格 (Spec Synchronization)
- **核心鐵律**：功能開發驗收完成後，**必須回寫至 `doc/spec/` 目錄中**！
- **分章節撰寫規範**：
  - 系統層級與技術棧調整 ➡️ 更新 `doc/spec/01_system_architecture.md`
  - 業務功能、畫面行為或新模組 ➡️ 更新 `doc/spec/02_core_modules.md`
  - 資料結構、欄位型別或 LocalStorage ➡️ 更新 `doc/spec/03_data_models.md`
  - 樣式規範、字型或視覺標準 ➡️ 更新 `doc/spec/04_ui_ux_standards.md`
- 確保正式規格書永遠反映專案最新現況。

---

## 👁️ Code Reviewer 品質審查規範 (Code Review Standards)

Agent 在審查代碼或提出修改建議時，必須扮演專業導師（Mentor）而非單純挑錯者：

### 審查五大維度
1. **正確性 (Correctness)**：功能是否符合營建業務邏輯？有無邊界情境（如無任務、空白 RFI）未處理？
2. **安全性 (Security)**：使用者輸入是否經過過濾？有無 XSS 風險？
3. **可維護性 (Maintainability)**：組件職責是否單一？型別是否精確完整？6 個月後其他開發者能否理解？
4. **效能 (Performance)**：有無不必要的 React 重繪或超大迴圈？
5. **測試與驗證 (Testing)**：關鍵路徑是否具備明確的驗證方案？

### 優先級標記法
所有審查反饋必須依照嚴重性清楚標記：
- 🔴 **Blockers（阻擋性問題，必須修正）**：如嚴重崩潰、資料遺失風險、型別衝突、安全性漏洞。
- 🟡 **Suggestions（強烈建議改善）**：如未做防禦性檢查、重複程式碼未抽取、命名模糊。
- 💭 **Nits（瑣碎細節 / 錦上添花）**：如微小註解補充、替代方案建議。

---

## 🛠️ 技術棧與環境限制守則

1. **視覺風格保證**：
   - 保持工業工程極簡黑白風（`Minimalist Industrial Monochrome`）。
   - 嚴格遵守零圓角原則（`border-radius: 0`），不可自行加入 Rounded 邊角。
   - 嚴格維持三大字型階層：`Playfair Display`、`Source Serif 4`、`JetBrains Mono`。
2. **Windows 跨平台相容性**：
   - 不得在 `package.json` 或代碼中引入僅限 Linux/macOS 的原生 Shell 指令（如 `rm -rf`）。
   - 保留現有之 Windows 批次檔 (`start.bat`, `stop.bat`, `start_dev.bat`, `stop_server.bat`, `start_prod.bat`) 與 PowerShell 腳本 (`start.ps1`, `stop.ps1`) 之可用性。
3. **資料模型嚴謹度**：
   - 所有資料變更必須於 `src/types.ts` 定義明確的 TypeScript Interface，禁止濫用 `any`。
