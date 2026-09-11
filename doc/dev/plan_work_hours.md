# 開發計畫：工時計算模組 (Work Hours Tracking Module)

> **計畫檔案命名**：`plan_work_hours.md`  
> **建立日期**：2026-09-11  
> **分支名稱**：`feat/work-hours`  
> **負責人 / Agent**：Antigravity  
> **狀態**：[x] 驗收完成，規格已回寫 spec

---

## 1. 需求背景與目標 (Background & Goals)

### 現狀分析
- NexusPM 目前已具備甘特圖排程、看板任務管理、RFI 簽核追蹤、數據分析等模組。
- 現有 `KanbanTask` 僅有 `startDate`、`duedate` 與 `progress` 百分比，缺乏**實際工時記錄**與**人工成本核算**能力。
- 營建專案中，工時管理是計算承包商請款、評估專案盈虧、人力資源調度的核心需求。

### 改造目標
1. **任務工時記錄**：記錄每個任務的「預估工時」與「實際工時」，支援逐日/逐週填報。
2. **人員工時統計**：統計每位成員的工時分佈、加班時數、各專案投入工時。
3. **工時成本核算**：結合時薪費率計算人工成本，產出工時成本報表。
4. **獨立新分頁**：在 Sidebar 新增「工時管理 (Work Hours)」Tab，建立 `WorkHoursView.tsx`。

---

## 2. 討論要點與共識 (Discussion & Alignment)

- [x] 與使用者確認的關鍵要點：
  1. 功能範圍：包含任務工時、人員統計、成本核算完整模組。
  2. UI 位置：獨立新分頁，Sidebar 新增導航按鈕。
  3. 資料儲存：LocalStorage 持久化（與現有模組一致），後續可擴展至 SQLite。
- [ ] 尚待確認或彈性調整項目：
  1. 時薪費率預設值（可先以角色預設，後續開放手動調整）。
  2. 工時填報粒度：日報 vs 週報（建議先做日報，再彙整週報）。

---

## 3. 系統影響與架構設計 (Architecture & Impact)

### 3.1 新增資料模型

```typescript
// 單筆工時記錄
export interface WorkLog {
  id: string;
  taskId: string;         // 關聯 KanbanTask.id
  userId: string;         // 關聯 User.id
  projectId: ProjectId;   // 所屬專案
  date: string;           // YYYY-MM-DD 工時日期
  hours: number;          // 當日投入工時（小時），可含小數
  overtimeHours: number;  // 加班時數
  note: string;           // 工作內容摘要
  createdAt: string;
}

// 人員費率設定
export interface UserRate {
  userId: string;
  hourlyRate: number;     // 每小時費率 (NTD)
  overtimeMultiplier: number; // 加班費率倍數（預設 1.5）
}
```

### 3.2 擴展 KanbanTask

在 `KanbanTask` 新增：
```typescript
estimatedHours?: number;   // 預估總工時（小時）
```

### 3.3 擴展 TabType

```typescript
export type TabType = 'gantt' | 'kanban' | 'rfi' | 'workhours' | 'users' | 'analytics' | 'api';
```

### 3.4 LocalStorage 持久化

| 儲存 Key | 資料型態 | 說明 |
| :--- | :--- | :--- |
| `nexuspm_worklogs` | `JSON array (WorkLog[])` | 所有工時紀錄 |
| `nexuspm_user_rates` | `JSON array (UserRate[])` | 人員費率設定 |

---

## 4. 具體修改清單 (Proposed Changes)

### 4.1 型別與資料層

- [x] `[MODIFY]` `src/types.ts`：新增 `WorkLog`、`UserRate` interface，`KanbanTask` 加入 `estimatedHours`，`TabType` 加入 `'workhours'`。

### 4.2 初始資料

- [x] `[MODIFY]` `src/data/initialData.ts`：新增 `INITIAL_WORKLOGS`（範例工時紀錄）、`INITIAL_USER_RATES`（各角色預設費率）。

### 4.3 核心元件

- [x] `[NEW]` `src/components/WorkHoursView.tsx`：工時管理主視圖，包含三大區塊：
  1. **工時填報區**：選擇任務 → 填入日期/工時/備註 → 送出。
  2. **人員工時統計面板**：依人員彙總工時、加班、費率、總成本。
  3. **工時成本報表**：依專案/工種/月份彙總，顯示預估 vs 實際成本對比。

### 4.4 彈窗元件

- [x] `[NEW]` `src/components/Modals/LogWorkHoursModal.tsx`：工時填報彈窗（選任務、填工時、填備註）。
- [x] `[NEW]` `src/components/Modals/EditUserRateModal.tsx`：人員費率設定彈窗。

### 4.5 導航與佈局

- [x] `[MODIFY]` `src/components/Sidebar.tsx`：在「團隊成員」與分隔線之間，新增「工時管理」導航按鈕（使用 `Clock` lucide icon），tooltip 為「06. 工時管理 (Work Hours)」。
- [x] `[MODIFY]` `src/components/Header.tsx`：新增 Tab「[04] 工時管理 (WORK HOURS)」。

### 4.6 主狀態管理

- [x] `[MODIFY]` `src/App.tsx`：
  - 新增 `worklogs` state + LocalStorage 同步。
  - 新增 `userRates` state + LocalStorage 同步。
  - 新增 `handleCreateWorkLog`、`handleDeleteWorkLog`、`handleUpdateUserRate` 處理函式。
  - 於主區域加入 `{activeTab === 'workhours' && <WorkHoursView ... />}`。
  - 將 `worklogs`、`userRates`、新增 handler 作為 props 傳入。

### 4.7 HTML 匯出引擎

- [x] `[MODIFY]` `src/utils/generateHtml.ts`：將 `worklogs`、`userRates` 資料序列化嵌入匯出 HTML。

---

## 5. 測試與驗證計畫 (Verification Plan)

- **本機啟動測試**：執行 `start_dev.bat` 確認無報錯。
- **功能測試步驟**：
  1. 點擊 Sidebar「工時管理」進入 WorkHoursView。
  2. 點擊「填報工時」按鈕，選一筆任務，輸入 8 小時、備註「澆置作業」，送出。
  3. 確認工時紀錄出現在列表，且 LocalStorage `nexuspm_worklogs` 已更新。
  4. 重整頁面，確認資料持久化。
  5. 檢視人員統計面板：該人員工時正確累加。
  6. 檢視成本報表：金額 = 工時 × 費率 + 加班費。
  7. 修改人員費率後，成本報表即時更新。
- **例外情境檢查**：
  - 無任務時填報：應提示「請先建立任務」。
  - 工時為 0 或負數：應前端驗證攔截。
  - 未設定費率時：使用預設費率 900 NTD/hr。

---

## 6. 規格回寫確認清單 (Spec Sync Checklist)

開發與測試完成後，必須確認以下規格文件已同步更新：
- [x] `doc/spec/01_system_architecture.md`：已補入 WorkHoursView 於目錄結構。
- [x] `doc/spec/02_core_modules.md`：已新增「2.9 工時計算與成本核算模組」章節。
- [x] `doc/spec/03_data_models.md`：已新增 `WorkLog`、`UserRate`、`estimatedHours` 與 LocalStorage Key。
- [x] `doc/spec/04_ui_ux_standards.md`：無額外樣式規則異動，維持既有極簡黑白風。
