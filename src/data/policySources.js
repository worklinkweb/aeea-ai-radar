/* 官方來源資料：所有數字、政策、設定說明都從這裡取用。
   status: VERIFIED | NEEDS VERIFICATION
   verified: 最後查核日期 */
window.DECK = window.DECK || {};
window.DECK.VERIFIED_DATE = '2026/09/28';

window.DECK.policySources = {
  'openai-data-controls': {
    agency: 'OpenAI',
    title: 'OpenAI Help Center — Data controls in ChatGPT（ChatGPT 資料控管）',
    url: 'https://help.openai.com/zh-hant/articles/7730893-data-controls-in-chatgpt',
    urlAlt: 'https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '網頁版：帳戶選單 → 設定 → 資料控管 → 為所有人改善模型 → 關閉（英文介面：Settings → Data controls → Improve the model for everyone → Off → Done）。',
      '行動版：側邊欄 → 個人圖示（設定）→ 資料控管 → 關閉「為所有人改善模型」。',
      '關閉後：新的對話不會用於訓練 OpenAI 模型；已儲存的聊天紀錄不會因此被刪除或隱藏。',
      '若對回覆按讚／倒讚提供意見回饋，該段對話可能會用於訓練模型。',
      '官方繁體中文介面用語為「資料控管」。'
    ]
  },
  'openai-temp-chat': {
    agency: 'OpenAI',
    title: 'OpenAI Help Center — Data controls in ChatGPT（Temporary Chat 段落）',
    url: 'https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '臨時聊天不會出現在聊天紀錄中。',
      '不會建立或更新記憶（Memory）。',
      '不會用於改善 OpenAI 模型。',
      '可能因安全目的保留最多 30 天（官方並未說「立即刪除」）。',
      '若把臨時聊天存檔，會變成一般對話並依帳戶設定處理。'
    ]
  },
  'sme-200': {
    agency: '經濟部中小及新創企業署',
    title: '115年度企業專區AI人才培育輔導計畫（頁面更新 2026-06-09）',
    url: 'https://www.sme.gov.tw/article-tw-2974-14712',
    verified: '2026/09/28',
    status: 'VERIFIED',
    figure: '200+',
    facts: [
      '官方文字：「超過 200 門免費 AI 主題課程與課程包資源」。',
      '課程數會隨官方平台更新，本頁不寫死確切數字，以最新頁面為準。'
    ]
  },
  'sme-apply-115': {
    agency: '經濟部中小及新創企業署',
    title: '公告115年度「中小企業網路大學校計畫」企業專區AI人才培育輔導申請須知（2026-04-02）',
    url: 'https://www.sme.gov.tw/article-tw-2275-14429',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '單一企業：政府輔導款最高新臺幣 15 萬元（含稅）。',
      '聯合型：最高新臺幣 30 萬元（含稅）。',
      '單一企業資格：最近 6 個月內任 1 月份勞保投保人數 10 人以上。',
      '申請期限：自公告日起至 115 年 7 月 31 日下午 5 時止。以 2026/09/28 查核，115 年度申請已截止。',
      '這是企業辦理 AI 人才培訓的輔導款，不是發給個人的補助。'
    ]
  },
  'smelearning': {
    agency: '經濟部中小及新創企業署',
    title: '中小企業網路大學校（AI 主題專區）',
    url: 'https://smelearning.sme.gov.tw/',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '網站說明：提供超過六百門以上的免費網路學習課程，設有「AI主題專區」。',
      '課程列表不需登入即可瀏覽；上課與取得紀錄需註冊會員（現場請再確認）。'
    ]
  },
  'gcis-5w': {
    agency: '經濟部商業發展署',
    title: '服務業 AI 人才培育專區 — 關於計畫',
    url: 'https://serv.gcis.nat.gov.tw/AOCAI/about',
    verified: '2026/09/28',
    status: 'VERIFIED',
    figure: '5 萬人次',
    facts: [
      '官方文字：「培育 5 萬人次服務業 AI 人才」。',
      '官方頁面未標示年期，因此本簡報只寫「5 萬人次」，不寫「5 年」。',
      '四大方案：在職進修－共通性 AI 培訓、在職進修－次產業培訓、青年 AI 實戰養成班、企業專班。'
    ]
  },
  'gcis-home': {
    agency: '經濟部商業發展署',
    title: '服務業 AI 人才培育專區（首頁）',
    url: 'https://serv.gcis.nat.gov.tw/AOCAI/',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '課程免費，由政府全額補助。',
      '對象：服務業在職人士、18–35 歲待業青年、申請專班的企業／學校。',
      '客服專線：02-2701-0303。'
    ]
  },
  'gcis-working': {
    agency: '經濟部商業發展署',
    title: '服務業 AI 人才培育專區 — 在職課程',
    url: 'https://serv.gcis.nat.gov.tw/AOCAI/courses/working',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '課程卡片顯示：課名、開課日、地點、時數、課程方式，並有「前往課程連結」。',
      '查核當日可見範例：「商品新品上架策略：企畫、數據與商業應用」開課日 2026-09-29，臺北，30 小時。',
      '課程卡片未直接顯示費用與資格細節，需點進課程確認。'
    ]
  },
  'gcis-youth': {
    agency: '經濟部商業發展署',
    title: '服務業 AI 人才培育專區 — 青年 AI 實戰養成班',
    url: 'https://serv.gcis.nat.gov.tw/AOCAI/courses/youth',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '對象：年滿 18–35 歲待業青年／應屆畢業生，副學士以上學歷。',
      '240–264 小時，北中南東多區開班。',
      '符合出席與測驗條件，最高可領 5 萬元（AI 課程 2 萬＋實作專題 3 萬）。',
      '部分梯次已顯示「報名已截止」。'
    ]
  },
  'gcis-enterprise': {
    agency: '經濟部商業發展署',
    title: '服務業 AI 人才培育專區 — 企業專班',
    url: 'https://serv.gcis.nat.gov.tw/AOCAI/enterprise',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '服務業企業單一申請或 2–5 家聯合申請，參訓人數至少 30 人。',
      '每班至多 75 萬元，每企業至多可申請 2 班。',
      '申請期間：自即日起至 116 年 07 月 31 日（依官方頁面）。',
      '出席達總時數 80% 才能取得結訓證明。'
    ]
  },
  'ida-aimfg': {
    agency: '經濟部產業發展署',
    title: '製造業 AI 升級引擎（課程列表）',
    url: 'https://eii.nat.gov.tw/aimfg/',
    verified: '2026/09/28',
    status: 'NEEDS VERIFICATION',
    facts: [
      '搜尋結果顯示課程列表頁存在（/aimfg/course/list），多個公協會轉知其線上課程已上架。',
      '自動查核工具無法讀取該網站內容；費用、資格、是否需登入，請上台前手動開啟確認。'
    ]
  },
  'ida-ipas': {
    agency: '經濟部產業發展署',
    title: '政府支持 AI 人才培育，iPAS AI 鑑定考試費用減半（2026-03-23）',
    url: 'https://www.ida.gov.tw/ctlr?PRO=news.rwdNewsView&id=43140',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '115–116 年度 iPAS AI 鑑定考試費用減半：初級每科 400 元、中級每科 500 元。',
      '不限是否參與政府人培課程。'
    ]
  },
  'ida-budget-116': {
    agency: '經濟部產業發展署',
    title: '主計資訊 — 116年度公務預算案（發布 2026-09-17）',
    url: 'https://www.ida.gov.tw/ctlr?PRO=executive.ExecutiveInfoList&cate=1118',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '產發署已公開 116 年度公務預算案文件（PDF／Excel）。',
      '屬「預算案」，需經立法院審議；本簡報未從中擷取個別計畫金額。'
    ]
  },
  'nstc-116': {
    agency: '國家科學及技術委員會',
    title: '116年行政院科技預算編列1,823億創新高（2026-08-05）',
    url: 'https://www.nstc.gov.tw/folksonomy/detail/d6fe2704-39be-449b-b7d4-32264f018f8b?l=CH',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '116 年科技預算案編列 1,823 億元，較 115 年成長約 9.47%。',
      '狀態：預算案，尚需立法院審議。',
      '這是整體科技預算，不等於 AI 人才培育預算。'
    ]
  },
  'ndc-ai10': {
    agency: '國家發展委員會',
    title: 'AI新十大建設推動方案（114~117年）',
    url: 'https://www.ndc.gov.tw/Content_List.aspx?n=EF80A54FA6A63200',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '行政院已於 115 年 1 月 28 日核定。',
      '三大方向：智慧應用、關鍵技術、數位基磐（含人才生態系）。',
      '官方頁面未列出單一的「全國 AI 人才培育總預算」。'
    ]
  },
  'openai-tasks': {
    agency: 'OpenAI',
    title: 'OpenAI Help Center — Scheduled tasks in ChatGPT',
    url: 'https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      'Free、Go、Plus、Pro、Business、Enterprise、Edu 皆可使用排程任務。',
      '免費版：一次性或週期性任務，最頻繁每天一次；付費方案最頻繁可到每小時。',
      '同時啟用的任務上限：Free/Go 3 個、Plus 5 個、Business/Edu 10 個、Pro/Enterprise 15 個。',
      '通知可選 Push、Email 或兩者（設定 → 通知）。',
      '官方說明未提到直接寫入行事曆。'
    ]
  },
  'gemini-sched': {
    agency: 'Google',
    title: 'Gemini Apps Help — Schedule actions in Gemini Apps',
    url: 'https://support.google.com/gemini/answer/16316416?hl=en&co=GENIE.Platform%3DDesktop',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '可設定每天、每週、每月的例行動作。',
      '最多同時 10 個排定動作。',
      '需開啟「Gemini 應用程式活動記錄（Keep Activity）」；公司／學校帳號需符合 Workspace 版本。'
    ]
  },
  'gemini-cal': {
    agency: 'Google',
    title: 'Gemini Apps Help — Create & manage your calendar events with Gemini Apps',
    url: 'https://support.google.com/gemini/answer/15305236?hl=en&co=GENIE.Platform%3DDesktop',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '官方說明頁標題即為「用 Gemini 建立與管理日曆活動」。',
      '實際可用範圍依帳號類型與設定而定，使用前請確認已連結 Google 日曆。'
    ]
  },
  'claude-sched': {
    agency: 'Anthropic',
    title: 'Claude Help Center — Schedule recurring tasks in Claude Cowork',
    url: 'https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '付費方案（Pro、Max、Team、Enterprise）可用。',
      '頻率：每小時、每天、每週、平日，或手動執行（官方說明未列每月）。',
      '在雲端執行，電腦不需要保持開機；需要本機檔案的任務例外。'
    ]
  },
  'claude-cal': {
    agency: 'Anthropic',
    title: 'Claude Docs — Google Calendar integration',
    url: 'https://claude.com/docs/connectors/google/calendar',
    verified: '2026/09/28',
    status: 'VERIFIED',
    facts: [
      '可查詢行事曆內容（Pro、Max、Team、Enterprise）。',
      '官方限制：Claude 不能建立、修改或刪除日曆活動，也不能寄送邀請。'
    ]
  }
};
