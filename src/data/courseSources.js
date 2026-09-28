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
  }
];

/* 現場 Demo：只留 3 個，皆為不需登入即可瀏覽的官方頁（ChatGPT 需使用者自己的帳號） */
window.DECK.demos = {
  chatgpt: { label: '開啟 ChatGPT 設定', url: 'https://chatgpt.com/', note: '需登入自己的帳號' },
  smelearning: { label: '開啟中小企業網路大學校', url: 'https://smelearning.sme.gov.tw/', note: '免登入可瀏覽' },
  gcisWorking: { label: '開啟商發署在職 AI 課程', url: 'https://serv.gcis.nat.gov.tw/AOCAI/courses/working', note: '免登入可瀏覽' }
};
