/* 官方課程資料快照：網頁內「直接找課」只從這份資料挑選，AI 不能自行新增課程或改寫事實。
   查核日期 2026/09/28。來源：官方列表頁實際顯示內容。
   status: 'open'（報名中）| 'check'（列表未標示，需人工確認）| 'full'（已額滿）| 'closed'（已截止）
   audience: 'work'（服務業在職）| 'youth'（18–35 歲待業青年／應屆畢業）| 'all'（線上自學，註冊即可）
   topics 對應 Q1：A 生成式AI B 自動化 C Agent D 行銷 E 行政效率 F 數據分析 G 製造 */
window.DECK = window.DECK || {};
(function () {
  const W = 'https://serv.gcis.nat.gov.tw/AOCAI/courses/working';
  const Y = 'https://serv.gcis.nat.gov.tw/AOCAI/courses/youth';
  const S = 'https://smelearning.sme.gov.tw/class.php?course=';
  const gcisWork = { agency: '經濟部商業發展署', program: '服務業 AI 人才培育｜在職進修', audience: 'work', fee: '免費（政府全額補助）', eligibility: '服務業在職人員（細節需人工確認）', source: W, regUrl: '', timeslot: '需人工確認' };
  const gcisYouth = { agency: '經濟部商業發展署', program: '服務業 AI 人才培育｜青年 AI 實戰養成班', audience: 'youth', fee: '免費；符合出席與測驗條件最高可領 5 萬元', eligibility: '18–35 歲待業青年／應屆畢業，副學士以上', mode: '實體', source: Y, timeslot: '需人工確認（240 小時密集班）' };
  const sme = { agency: '經濟部中小及新創企業署', program: '中小企業網路大學校｜AI 主題專區', audience: 'all', fee: '免費', eligibility: '註冊會員即可（需人工確認）', mode: '錄播', region: '不限', start: '', status: 'open', timeslot: '隨時可看' };

  window.DECK.courseSnapshot = {
    verified: '2026/09/28',
    courses: [
      Object.assign({}, gcisWork, { id: 'w01', title: '科技賦能之服務流程創新：打造AI助手與工作流程自動化實務', start: '2026-10-01', region: '北', city: '臺北', hours: 30, mode: '數位自學＋混成', status: 'check', topics: ['A', 'B', 'C', 'E'], level: 'B', industry: '生活服務業' }),
      Object.assign({}, gcisWork, { id: 'w02', title: 'B2B異界合作拓展：AI助攻商務開發與合作提案', start: '2026-10-02', region: '南', city: '臺南', hours: 30, mode: '數位自學＋混成', status: 'check', topics: ['A', 'D'], level: 'B', industry: '批發業' }),
      Object.assign({}, gcisWork, { id: 'w03', title: 'AI營運決策實戰CEO班', start: '2026-10-05', region: '北', city: '臺北', hours: 15, mode: '實體', status: 'check', topics: ['A', 'F', 'E'], level: 'C', industry: '服務業（CEO 班）', eligibility: '服務業經營者／高階主管（細節需人工確認）' }),
      Object.assign({}, gcisWork, { id: 'w04', title: '商業服務業-AI部署與應用系統導入工作坊', start: '2026-10-13', region: '北', city: '臺北', hours: 40, mode: '實體', status: 'check', topics: ['B', 'C', 'F'], level: 'D', industry: '服務業（中階班）' }),
      Object.assign({}, gcisWork, { id: 'w05', title: 'AI影音行銷推播：用AI打造餐飲品牌全方位行銷力', start: '2026-10-01', region: '北', city: '臺北', hours: 30, mode: '數位自學＋混成', status: 'check', topics: ['A', 'D'], level: 'B', industry: '餐飲業' }),
      Object.assign({}, gcisWork, { id: 'w06', title: 'AI影音行銷推播：打造高轉換數位內容影響力', start: '2026-10-03', region: '北', city: '臺北', hours: 30, mode: '數位自學＋混成', status: 'check', topics: ['A', 'D'], level: 'B', industry: '餐飲業' }),
      Object.assign({}, gcisWork, { id: 'w07', title: 'AI開發新菜單及配方：AI食創力｜從菜單開發到體驗行銷', start: '2026-10-05', region: '北', city: '臺北', hours: 30, mode: '數位自學＋混成', status: 'check', topics: ['A', 'D'], level: 'B', industry: '餐飲業' }),
      Object.assign({}, gcisWork, { id: 'w08', title: '全通路餐飲平臺整合：打造AI應用與導入決策新標準(第二梯)', start: '2026-10-15', region: '北', city: '臺北', hours: 30, mode: '數位自學＋混成', status: 'check', topics: ['B', 'F'], level: 'C', industry: '餐飲業' }),
      Object.assign({}, gcisWork, { id: 'w09', title: '商品新品上架策略：企畫、數據與商業應用', start: '2026-09-29', region: '北', city: '臺北', hours: 30, mode: '數位自學＋混成', status: 'check', topics: ['D', 'F'], level: 'B', industry: '批發業' }),
      Object.assign({}, gcisWork, { id: 'w10', title: 'AI精準個性行銷：利用AI打造品牌行銷策略-實作應用班', start: '2026-10-01', region: '南', city: '高雄', hours: 18, mode: '混成', status: 'full', topics: ['A', 'D'], level: 'B', industry: '服務業' }),
      Object.assign({}, gcisWork, { id: 'w11', title: 'AI廣告投放與精準行銷：降低廣告成本×提升ROAS×個人化促銷', start: '2026-10-07', region: '中', city: '臺中', hours: 30, mode: '數位自學＋混成', status: 'full', topics: ['D', 'F'], level: 'C', industry: '生活服務業' }),
      Object.assign({}, gcisWork, { id: 'w12', title: '生成式AI多媒體轉化與創作：生成式AI影音實作工作流', start: '2026-10-05', region: '東', city: '花蓮', hours: 30, mode: '數位自學＋混成', status: 'full', topics: ['A', 'D'], level: 'B', industry: '生活服務業' }),

      Object.assign({}, gcisYouth, { id: 'y01', title: 'AI 智慧營運實戰養成班(1)｜成功大學', start: '2026-10-01', region: '南', city: '臺南', hours: 240, status: 'open', topics: ['A', 'B', 'C', 'E', 'F'], level: 'A', regUrl: 'https://ncku-ihq-gif.github.io/ncku-ai-class/' }),
      Object.assign({}, gcisYouth, { id: 'y02', title: 'AI 智慧營運實戰養成班(2)｜成功大學', start: '2026-10-30', region: '南', city: '臺南', hours: 240, status: 'open', topics: ['A', 'B', 'C', 'E', 'F'], level: 'A', regUrl: 'https://ncku-ihq-gif.github.io/ncku-ai-class/' }),
      Object.assign({}, gcisYouth, { id: 'y03', title: 'AI智慧營運人才培育班(1)｜國立臺北大學', start: '2026-10-19', region: '北', city: '臺北', hours: 240, status: 'open', topics: ['A', 'B', 'E', 'F'], level: 'A', regUrl: 'https://ai-talent.tw/' }),
      Object.assign({}, gcisYouth, { id: 'y04', title: 'AI智慧營運人才培育班(2)｜國立臺北大學', start: '2026-11-02', region: '北', city: '臺北', hours: 240, status: 'open', topics: ['A', 'B', 'E', 'F'], level: 'A', regUrl: 'https://ai-talent.tw/' }),
      Object.assign({}, gcisYouth, { id: 'y05', title: 'AI餐飲營運與顧客體驗實戰班｜實踐大學', start: '2026-11-02', region: '北', city: '臺北', hours: 240, status: 'open', topics: ['A', 'D', 'F'], level: 'A', regUrl: 'https://usc-sai-youth.github.io/usc-sai-youth/' }),
      Object.assign({}, gcisYouth, { id: 'y06', title: 'AI創意內容行銷實戰班—生活服務產業進擊班(2)｜銘傳大學', start: '2026-11-02', region: '北', city: '臺北', hours: 242, status: 'open', topics: ['A', 'D'], level: 'A', regUrl: '' }),
      Object.assign({}, gcisYouth, { id: 'y07', title: '服務業品牌營運與智慧行銷AI人才培訓班｜中興大學', start: '2026-09-10', region: '中', city: '臺中', hours: 264, status: 'closed', topics: ['A', 'D'], level: 'A', regUrl: '' }),

      Object.assign({}, sme, { id: 's01', title: '人工智慧基礎介紹', hours: '56 分鐘', topics: ['A'], level: 'A', source: S + '16774', regUrl: S + '16774' }),
      Object.assign({}, sme, { id: 's02', title: 'AI輔助經營社群', hours: '60 分鐘', topics: ['A', 'D'], level: 'A', source: S + '17722', regUrl: S + '17722' }),
      Object.assign({}, sme, { id: 's03', title: '用AI打造爆款臉書貼文！行銷文案3秒生成實戰班', hours: '60 分鐘', topics: ['A', 'D'], level: 'A', source: S + '17950', regUrl: S + '17950' }),
      Object.assign({}, sme, { id: 's04', title: '從AI治理到提升企業競爭力', hours: '32 分鐘', topics: ['A', 'E'], level: 'B', source: S + '18562', regUrl: S + '18562' }),
      Object.assign({}, sme, { id: 's05', title: '如何運用AI技術導入AOI系統', hours: '26 分鐘', topics: ['G', 'F'], level: 'C', source: S + '17931', regUrl: S + '17931' })
    ]
  };
})();
