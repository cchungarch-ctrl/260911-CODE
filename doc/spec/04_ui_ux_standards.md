# 第四章：介面設計系統與交互規範

> **版本**：v1.0.0  
> **最後更新**：2026-09-11  
> **分類**：UI/UX 設計系統規格

---

## 4.1 設計哲學：工業工程極簡黑白風 (Minimalist Industrial Monochrome)

NexusPM 捨棄一般 SaaS 常見的圓滑糖果色調，採取嚴肅、專注且兼具精確感的營造工程圖面風格：
1. **零圓角原則 (Zero Radius)**：
   全域套用 `* { border-radius: 0 !important; }`，所有按鈕、卡片、對話框、標籤皆為乾淨俐落的直角，呈現工程藍圖的幾何理性感。
2. **高對比黑白基調 (Monochrome Base)**：
   主背景採用純白 `#ffffff`，搭配純黑邊框 `#000000` 與低反差中性灰 `#f5f5f5`，確保在各種工地強光螢幕下皆清晰易讀。
3. **微紋理底圖 (Subtle Grid Texture)**：
   背景採用 4px 間距之微細水平工程隔線，模擬工程方格繪圖紙質感。

---

## 4.2 字型系統 (Typography)

| 類別 | 字型名稱 | CSS Class | 應用場景 |
| :--- | :--- | :--- | :--- |
| **標題 / 專案名** | `Playfair Display`, Georgia, serif | `.font-display` | 系統主標題、重大里程碑、報表大字標記 |
| **正文 / 描述** | `Source Serif 4`, Georgia, serif | `.font-body` | 內文段落、任務說明、RFI 釋疑提問與回覆 |
| **代碼 / 編號** | `JetBrains Mono`, monospace | `.font-mono` | 專案代碼 (`PRJ-001`)、RFI 編號、日期、金額數值、API Log |

---

## 4.3 專業工種識別色彩標記 (Discipline Badges)

為在黑白主調中快速區分工種，設定固定且低飽和之工種邊框與文字配色：
- **結構工程 (Structure)**：深海軍藍 / 礦石深色標籤
- **建築設計 (Architecture)**：翡翠深綠標籤
- **機電MEP (Mechanical & Electrical)**：琥珀暖橘標籤
- **現場施工 (Site Construction)**：深石板灰標籤

---

## 4.4 模態視窗與彈跳元件 (Modal Components)

所有彈出視窗（`Modals/`）必須符合以下規範：
1. **背景遮罩**：半透明黑色毛玻璃遮罩 (`bg-black/60 backdrop-blur-xs`)。
2. **邊框與陰影**：外層包覆 `border-2 border-black`，搭配銳利的實體陰影 (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`)。
3. **鍵盤與點擊控制**：按 `ESC` 鍵或點擊遮罩外部可關閉視窗。
4. **即時表單驗證**：必填欄位（如標題、主旨、工種）未輸入時，按鈕呈現反灰且無法提交。

---

## 4.5 自訂工程滾動條 (Custom Scrollbars)

採用自訂寬度 6px 黑色實心滾動條，軌道具備 `1px solid #000000` 邊界分隔線，維持整體圖面繪圖風格之整齊劃一。
