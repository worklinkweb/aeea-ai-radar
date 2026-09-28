# AEEA AI 最新應用趨勢 × AI 學習雷達｜Web Presentation

講者：Lynn Lin ・ 2026/09/28 ・ 線上 40 分鐘 ・ 所有官方資料 Last verified 2026/09/28

## 線上版本
- 學員版（無講者模式）：`https://worklinkweb.github.io/aeea-ai-radar/st/`（舊網址 `/student/` 會自動轉到這裡），重建：`STUDENT=1 PAGES=1 python3 build.py`
- GitHub Pages：啟用後網址為 `https://worklinkweb.github.io/aeea-ai-radar/`（QR Code 會自動指向這個網址的 `#radar`，不必重新產生）。
- claude.ai Artifact 版：可使用 Claude 分析找課（需觀眾授權）；GitHub Pages 版使用規則引擎找課。

## 啟動方式
- 線上：直接開啟 claude.ai Artifact（AEEA AI 學習雷達）。
- 本機：直接用瀏覽器開啟根目錄的 `index.html`（單一檔案，不需安裝）。
- 修改內容後重建 GitHub Pages 版（根目錄 `index.html`）：`PAGES=1 python3 build.py`。
- claude.ai 版需要固定 QR：`RADAR_URL="https://…#radar" python3 build.py`（需 `pip install qrcode`）。

## 操作
| 動作 | 按鍵／按鈕 |
|---|---|
| 進入簡報模式 | 右上「▶ 簡報模式」（網址加 `#present` 也可直接進入） |
| 下一步／上一頁 | → / 空白鍵 / PageDown ・ ← / PageUp ・ 手機左右滑 |
| 離開 | Esc |
| 全螢幕 | F |
| 講者模式 | P 或「講者」按鈕；或另開分頁在網址後加 `#presenter`，兩分頁自動同步 |
| AI 學習雷達工具 | 網址加 `#radar`（QR Code 指向這裡）：直接找課／帶走 Prompt／排程自動找 |

## 專案結構
```
src/
  data/policySources.js   官方來源（數字、狀態 VERIFIED / NEEDS VERIFICATION、查核日期）
  data/courseSources.js   AI 學習資源地圖、3 個現場 Demo 入口
  data/courseSnapshot.js  網頁內找課用的官方課程快照（24 門，2026/09/28 查核）
  data/slides.js          38 頁投影片：duration / transition / demo / source / builds / html
  data/speakerNotes.js    講者備註（只在講者模式渲染）
  data/prompts.js         AI 學習雷達 完整版 / 手機版 Prompt、7 題問卷
  styles.css              Liquid glass design system（container query 同時支援 16:9 簡報與手機捲動）
  radar.js                AI 學習雷達：一句話找課（規則引擎＋可選 Claude 分析）、Prompt、排程 Prompt、日曆連結
  app.js                  簡報模式、Builds、講者同步、Source Drawer
build.py                  合併成單一 HTML（dist/index.html、dist/artifact.html）
```
技術選擇：Vanilla JS + 單檔輸出。沒有用 React + Vite，因為內容以資料驅動即可，單檔更容易上傳、離線播放，不需建置環境。

## 時間配置（合計 40:00）
開場 2 ・ Part 1 8.8 ・ Part 2 5.7 ・ Part 3 4.6 ・ Part 4 3.3 ・ Part 5 8.2 ・ Part 6 4 ・ 帶走 3.4（38 頁）（每頁 duration 在 slides.js，可調）

## 網頁內直接找課
- 只從 `courseSnapshot.js` 的官方快照挑選；課程欄位一律由快照帶出，AI 只負責挑選與說明理由。
- 在 claude.ai 開啟且觀眾同意時，使用 Claude（`sample` 能力，花觀眾自己的額度）分析；否則自動用規則引擎，結果一樣分三區。
- 硬規則（額滿、截止、已開課、資格、地區、完全自費）在 AI 回覆後會再檢查一次，AI 放錯區的課一律移到「這次先排除」。
- 快照會過期：課後要更新，請改 `courseSnapshot.js` 後 `python3 build.py`。

## 授權與第三方
- `vendor/qrcode-generator-1.4.4.js`：Kazuhiko Arase，MIT License。
- 官方資料以各機關網站為準，查核日期 2026/09/28。

## 聯繫
沃領客資訊｜教育訓練總監｜Lynn Lin ・ lynn.lin@worklink.app ・ 0800-008-135
