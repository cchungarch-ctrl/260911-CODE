# 功能開發計畫庫 (`doc/dev/`)

本目錄存放所有新功能或重要模組重構之事前開發計畫。

---

## 📌 開發計畫規範

1. **討論先行**：開發任何新功能前，必須先與使用者討論確認需求、功能範圍與交互細節。
2. **計畫落盤**：討論確認後，必須在此目錄下建立開發計畫文件。
3. **命名規則**：
   - 統一使用 `plan_<功能名稱>.md`。
   - 範例：
     - `plan_export_excel.md`
     - `plan_bim_viewer_integration.md`
     - `plan_user_permission_system.md`
4. **全程參照**：撰寫代碼過程中，嚴格參照此計畫中定義的資料結構、元件拆分與驗收標準。
5. **開發後回寫規格**：完成開發並通過測試後，**必須將實作規格更新回 `doc/spec/` 的對應章節**。

---

## 📄 計畫檔案範本

請參照並複製 [template_plan.md](file:///c:/Users/mail/Documents/AI練習/260911-CODE/doc/dev/template_plan.md) 開始新的計畫撰寫。
