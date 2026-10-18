# Edson W. 的觀察筆記

記錄技術學習、旅行、美食與日常的個人部落格。

網站：https://edweidev.github.io/

## 網站檔案

- `index.html`：首頁、分類導覽、自我介紹與文章規劃。
- `style.css`：米色／深色外觀，以及桌面和手機排版。
- `script.js`：外觀設定、搜尋、分類篩選、側欄與文章規劃視窗。
- `.nojekyll`：以一般靜態檔案發布，不使用 Jekyll 建置。
- `blog/foodie/index.html`：美食分類頁（`/blog/foodie/`）。
- `blog/travel/index.html`：旅行分類頁（`/blog/travel/`）。
- `blog/tech/index.html`：技術分類頁（`/blog/tech/`）。

分類頁共用根目錄的 CSS 與 JavaScript。未來單篇文章可放在對應分類資料夾，例如 `blog/travel/tokyo/index.html`，網址就是 `/blog/travel/tokyo/`。新增文章後需手動更新首頁及分類頁的文章列表。

目前已發布《你看不見的網路》序章；旅行與美食卡片仍為文章規劃。卡片插圖以 SVG 製作並包含在 HTML 中。字型透過 Google Fonts 載入；無法連線時會使用系統備用字型。

## 預覽與發布

在此資料夾啟動靜態網頁伺服器，即可預覽。將變更提交並 Push 至 `main` 後，由既有的 GitHub Pages 設定發布（`main` / 根目錄）。

外觀模式預設跟隨系統，也可以在左側手動切換淺色／深色；選擇會保存在讀者自己的瀏覽器中。

## 寫作與公開檔案

此儲存庫公開。請只加入準備公開的檔案；私人草稿、工作資料與金鑰不應加入版本紀錄。`.gitignore` 不會移除先前已提交的檔案或歷史紀錄。

序章文章位於 `blog/tech/invisible-network/prologue/index.html`，文章排版使用共用的 `article.css`。

## 流量統計

所有公開頁面透過 `analytics.js` 連接 GA4 資源 `G-S80PVVEQZD`，只在 `edweidev.github.io` 網域執行。本機預覽不載入 Google 統計程式。網站不顯示計數器，報表需登入具權限的 Google Analytics 帳戶查看；衡量 ID 本身不是密碼，也不授予報表存取權。

本站關閉 Google signals 與廣告個人化訊號，初始頁面及來源網址不傳送查詢字串或錨點；加強型評估依 GA4 資源設定運作。Do Not Track 或 Global Privacy Control 訊號啟用時不載入統計。相關說明位於 `/privacy/`。
