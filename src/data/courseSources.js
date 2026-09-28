/* AI 學習資源地圖 + 現場 Demo 入口 */
window.DECK = window.DECK || {};

window.DECK.resourceMap = [
  {
    key: 'A',
    agency: '中企署',
    agencyFull: '經濟部中小及新創企業署',
    name: '中小企業網路大學校',
    who: '中小企業員工、主管、想先自學的人',
    type: '線上錄播課、AI 主題專區、課程包',
    fee: '免費',
    feeTone: 'free',
    url: 'https://smelearning.sme.gov.tw/',
    host: 'smelearning.sme.gov.tw',
    src: 'smelearning'
  },
  {
    key: 'B',
    agency: '商發署',
    agencyFull: '經濟部商業發展署',
    name: '服務業 AI 人才培育專區',
    who: '服務業在職者、18–35 歲待業青年、服務業企業',
    type: '在職班、青年實戰班（240 小時）、企業專班',
    fee: '免費（政府全額補助）',
    feeTone: 'free',
    url: 'https://serv.gcis.nat.gov.tw/AOCAI/',
    host: 'serv.gcis.nat.gov.tw/AOCAI',
    src: 'gcis-home'
  },
  {
    key: 'C',
    agency: '產發署',
    agencyFull: '經濟部產業發展署',
    name: '製造業 AI 升級引擎',
    who: '製造業企業與從業人員',
    type: '產業 AI 線上課程',
    fee: '需人工確認',
    feeTone: 'check',
    url: 'https://eii.nat.gov.tw/aimfg/',
    host: 'eii.nat.gov.tw/aimfg',
    src: 'ida-aimfg'
  },
  {
    key: 'D',
    agency: '勞動部',
    agencyFull: '勞動部勞動力發展署',
    name: '產業人才投資方案',
    who: '有勞保、就保、職保或農保的在職勞工（各行業）',
    type: '各分署在職課程，含生成式 AI、智慧製造',
    fee: '補助 80%；45 歲以上等 100%；3 年最高 10 萬',
    feeTone: 'free',
    url: 'https://ojt.wda.gov.tw/',
    host: 'ojt.wda.gov.tw',
    src: 'mol-news'
  }
];

/* 現場 Demo：只留 3 個，皆為不需登入即可瀏覽的官方頁（ChatGPT 需使用者自己的帳號） */
window.DECK.demos = {
  chatgpt: { label: '開啟 ChatGPT 設定', url: 'https://chatgpt.com/', note: '需登入自己的帳號' },
  smelearning: { label: '開啟中小企業網路大學校', url: 'https://smelearning.sme.gov.tw/', note: '免登入可瀏覽' },
  gcisWorking: { label: '開啟商發署在職 AI 課程', url: 'https://serv.gcis.nat.gov.tw/AOCAI/courses/working', note: '免登入可瀏覽' }
};

/* Part 4 官方找課入口（現場示範用；內容依 2026/09/28 官方頁面整理） */
window.DECK.courseSites = [
  {
    agency: '經濟部中小及新創企業署', name: '中小企業網路大學校｜AI 主題專區', src: 'smelearning',
    url: 'https://smelearning.sme.gov.tw/classes_zone.php?zid=45', host: 'smelearning.sme.gov.tw/classes_zone.php?zid=45',
    items: [['人工智慧基礎介紹', '56 分鐘・免費'], ['AI輔助經營社群', '60 分鐘・免費'], ['用AI打造爆款臉書貼文！', '60 分鐘・免費']],
    path: ['首頁', 'AI主題專區', '點課程', '註冊後免費線上看']
  },
  {
    agency: '經濟部商業發展署', name: '服務業 AI 人才培育｜在職課程', src: 'gcis-working',
    url: 'https://serv.gcis.nat.gov.tw/AOCAI/courses/working', host: 'serv.gcis.nat.gov.tw/AOCAI/courses/working',
    items: [['科技賦能之服務流程創新', '10/01・臺北・30h'], ['B2B異界合作拓展：AI助攻商務開發', '10/02・臺南・30h'], ['AI營運決策實戰CEO班', '10/05・臺北・15h']],
    path: ['首頁', '在職進修課程', '看開課日與地點', '前往課程連結報名']
  },
  {
    agency: '經濟部商業發展署', name: '青年 AI 實戰養成班（18–35 歲待業）', src: 'gcis-youth',
    url: 'https://serv.gcis.nat.gov.tw/AOCAI/courses/youth', host: 'serv.gcis.nat.gov.tw/AOCAI/courses/youth',
    items: [['成功大學｜AI 智慧營運實戰養成班', '臺南・10/01・報名中'], ['國立臺北大學｜AI智慧營運人才培育班', '臺北・10/19・報名中'], ['實踐大學｜AI餐飲營運與顧客體驗', '臺北・11/02・報名中']],
    path: ['首頁', '青年 AI 實戰養成班', '選梯次', '到各校報名頁']
  },
  {
    agency: '經濟部產業發展署', name: '製造業 AI 升級引擎｜課程列表', src: 'ida-aimfg',
    url: 'https://eii.nat.gov.tw/aimfg/course/list', host: 'eii.nat.gov.tw/aimfg/course/list',
    items: [['製造業 AI 線上課程', '費用、資格需人工確認'], ['適合製造業企業與從業人員', '上台前請手動開啟確認']],
    path: ['首頁', '課程列表', '點課程看資格與費用']
  }
];
