# 第三章：資料模型與狀態持久化規格

> **版本**：v1.0.0  
> **最後更新**：2026-09-11  
> **分類**：資料架構與儲存規格

---

## 3.1 核心資料模型 (Data Types Schema)

定義於 `src/types.ts`：

### 1. 專案 (Project)
```typescript
export type ProjectId = 'PRJ-TEAM' | 'PRJ-001' | 'PRJ-002' | 'PRJ-003' | string;

export interface Project {
  id: ProjectId;
  name: string;        // 專案名稱
  code: string;        // 工程代碼
  location: string;    // 地點資訊
  description: string; // 專案概述
}
```

### 2. 任務看板項目 (KanbanTask)
```typescript
export type TaskDiscipline = '結構工程' | '建築設計' | '機電MEP' | '現場施工';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';

export interface KanbanTask {
  id: string;              // 唯一識別碼，如 "task-1"
  projectId: ProjectId;     // 所屬專案 ID
  title: string;          // 任務標題
  discipline: TaskDiscipline; // 工種專業
  priority: TaskPriority;   // 優先等級
  status: TaskStatus;       // 當前進度狀態
  assigneeId: string;      // 負責人 User ID
  startDate?: string;      // 預計開工日 (YYYY-MM-DD)
  duedate: string;         // 預計完工/截稿日 (YYYY-MM-DD)
  desc: string;            // 詳細說明
  image?: string | null;   // 佐證照片或圖面縮圖 URL
  rfiId?: string | null;   // 關聯之 RFI 編號
  createdAt: string;       // 建立時間戳記
  color?: string;          // 顯示色彩
  progress?: number;       // 施工進度百分比 (0-100)
}
```

### 3. 工程釋疑單 (RfiItem)
```typescript
export type RfiStatus = '待處理' | '審查中' | '已回覆' | '已駁回';

export interface RfiItem {
  id: string;              // RFI 編號，如 "RFI-2026-001"
  projectId: ProjectId;     // 所屬專案 ID
  subject: string;         // 釋疑主旨
  discipline: TaskDiscipline; // 工種專業
  raisedBy: string;        // 提問單位/人員
  assigneeId: string;      // 被指派答覆主管 ID
  deadline: string;        // 答覆截止日
  question: string;        // 疑義說明詳情
  image?: string | null;   // 現況照片或施工圖說截圖
  status: RfiStatus;       // 簽核審查狀態
  impactDays: number;      // 評估工期影響天數
  impactCost: number;      // 評估衍生工程成本 (NTD)
  response?: string | null;// 建築師/工程顧問正式回覆內容
  responseDate?: string | null; // 回覆日期
  linkedTaskId?: string | null; // 關聯工程任務 ID
  createdAt: string;       // 提出時間
}
```

### 4. 人員與角色 (User)
```typescript
export interface User {
  id: string;     // 使用者 ID，如 "usr_1"
  name: string;   // 姓名
  role: string;   // 系統角色，如 "主管 / 審查員"
  title: string;  // 職稱，如 "主任技師"
  avatar: string; // 頭像圖示 URL
  email: string;  // 電子郵件
}
```

---

## 3.2 瀏覽器持久化規格 (LocalStorage Persistence)

系統採用自動雙向綁定機制，當 React 狀態變更時，自動序列化儲存至瀏覽器 `LocalStorage`：

| 儲存 Key | 資料型態 | 預設還原策略 |
| :--- | :--- | :--- |
| `nexuspm_project` | `string (ProjectId)` | 若不存在則預設為 `'PRJ-TEAM'` |
| `nexuspm_tasks` | `JSON array (KanbanTask[])` | 若不存在或為空則從 `INITIAL_TASKS` 初始化 |
| `nexuspm_rfis` | `JSON array (RfiItem[])` | 若不存在則從 `INITIAL_RFIS` 初始化 |
| `nexuspm_users` | `JSON array (User[])` | 若長度不足則從 `INITIAL_USERS` 補齊 |

---

## 3.3 重設與清除機制

- 點擊頂部狀態列的「重設範例資料」將會清除上述 LocalStorage Key，並重新注入 `initialData.ts` 中的乾淨預設工程資料。
