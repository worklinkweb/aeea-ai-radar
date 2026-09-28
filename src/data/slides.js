/* 投影片資料：每頁含 duration（分鐘）、transition、demo、source、builds 與版面 html。
   數字一律從 policySources / courseSources 取用，不寫死在版面裡。 */
window.DECK = window.DECK || {};
(function () {
  const D = window.DECK;
  const P = D.policySources;
  const V = D.VERIFIED_DATE;

  const src = (id, label = '來源') =>
    `<button class="src-btn" type="button" data-src="${id}" aria-label="查看來源：${P[id].agency}"><span class="src-dot ${P[id].status === 'VERIFIED' ? 'ok' : 'warn'}"></span>${label}</button>`;
  const badge = (status) =>
    status === 'VERIFIED'
      ? `<span class="badge ok">VERIFIED · ${V}</span>`
      : `<span class="badge warn">NEEDS VERIFICATION</span>`;
  const demo = (key) => {
    const d = D.demos[key];
    return `<a class="demo-btn" href="${d.url}" target="_blank" rel="noopener">${d.label}<span class="demo-note">${d.note}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
  };
  const partDivider = (n, title, sub, mins) => `
    <div class="divider">
      <div class="divider-num">0${n}</div>
      <div class="divider-body">
        <p class="eyebrow">PART ${n} · 約 ${mins} 分鐘</p>
        <h1 class="h1">${title}</h1>
        ${sub ? `<p class="lead">${sub}</p>` : ''}
      </div>
    </div>`;
  const radarDisc = (size = '') => `
    <div class="radar ${size}" aria-hidden="true">
      <div class="radar-ring r1"></div><div class="radar-ring r2"></div><div class="radar-ring r3"></div>
      <div class="radar-sweep"></div>
      <div class="radar-blip b1"></div><div class="radar-blip b2"></div><div class="radar-blip b3"></div>
      <div class="radar-core">AI</div>
    </div>`;
  D.helpers = { src, badge, demo, radarDisc };

  const map = D.resourceMap;

  D.parts = [
    { id: 'open', label: '開場', short: 'Open', minutes: 2 },
    { id: '1', label: '先用對 AI', short: 'P1', minutes: 8.8 },
    { id: '2', label: 'Agent 時代', short: 'P2', minutes: 5.7 },
    { id: '3', label: '政府 AI 資源', short: 'P3', minutes: 4.6 },
    { id: '4', label: 'AI 課程資源', short: 'P4', minutes: 3.3 },
    { id: '5', label: 'AI 學習雷達', short: 'P5', minutes: 8.2 },
    { id: '6', label: '進階：AI 代理人', short: 'P6', minutes: 4 },
    { id: 'end', label: '帶走', short: 'End', minutes: 3.4 }
  ];

  D.slides = [
    /* ---------------- OPENING ---------------- */
    {
      id: 'cover', part: 'open', title: '封面', duration: 1, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="cover">
        <div class="cover-text">
          ${D.STUDENT ? '' : '<p class="eyebrow">AEEA AI賦能創業協會 · 線上分享</p>'}
          <h1 class="h1 cover-title">AI 最新應用趨勢<br><span class="x">×</span> AI 學習雷達</h1>
          <p class="cover-sub">先用對 AI，再把工作交給 AI。</p>
          <div class="cover-meta">
            <span>沃領客資訊｜教育訓練總監｜<b>Lynn Lin</b></span>
          </div>
        </div>
        <div class="cover-visual">${radarDisc('lg')}</div>
      </div>`
    },
    {
      id: 'thesis', part: 'open', title: '今天要教會什麼', duration: 1, transition: 'fade', source: [], demo: null, builds: 2,
      html: () => `
      <div class="stack center-y">
        <p class="h2 muted-strong">會問 AI，是起點；</p>
        <p class="h1 thesis-main" data-b="1">會把工作交給 AI，<br>才是下一步。</p>
        <div class="route" data-b="2">
          ${[['1', '先用對 AI'], ['2', 'Agent 時代'], ['3', '政府資源'], ['4', 'AI 課程資源'], ['5', 'AI 學習雷達'], ['6', '讓它自己動']]
            .map(([n, t]) => `<div class="route-item glass" data-part-tint="${n}"><span class="route-n">PART ${n}</span><span>${t}</span></div>`).join('<span class="route-arrow">→</span>')}
        </div>
        <p class="kicker" data-b="2">AI 執行，人驗收。</p>
      </div>`
    },

    /* ---------------- PART 1 ---------------- */
    {
      id: 'p1', part: '1', title: 'PART 1 先用對 AI', duration: 0.3, transition: 'fade', source: [], demo: null, divider: true,
      html: () => partDivider(1, 'AI 很強，<br>但先學會安全地用', '資料安全 · 影像使用 · 帳號設定', 9)
    },
    {
      id: 'basics', part: '1', title: 'AI 時代的三個基本功', duration: 0.4, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="stack">
        <p class="eyebrow">1-1 · AI 時代的三個基本功</p>
        <div class="modules">
          <div class="module glass"><span class="module-k">SAFE</span><p class="module-t">安全地用</p><p class="module-d">知道什麼能給、什麼不能給</p></div>
          <div class="module glass"><span class="module-k">RIGHT</span><p class="module-t">正確地用</p><p class="module-d">用對方法，結果才可靠</p></div>
          <div class="module glass module-hero"><span class="module-k">DELEGATE</span><p class="module-t">把工作交給 AI</p><p class="module-d">今天後半段的主角 → Part 2</p></div>
        </div>
      </div>`
    },
    {
      id: 'pause3', part: '1', title: '給 AI 資料前，先停 3 秒', duration: 0.8, transition: 'fade', source: [], demo: null, builds: 3,
      html: () => `
      <div class="pause">
        <div class="pause-num">3</div>
        <div class="pause-body">
          <p class="h2">給 AI 資料前，<br>先停 3 秒。</p>
          <ol class="rules">
            <li data-b="1"><span class="rule-n">01</span><span class="rule-a">不該給</span><span class="rule-arrow">→</span><span class="rule-b">不要給</span></li>
            <li data-b="2"><span class="rule-n">02</span><span class="rule-a">需要分析</span><span class="rule-arrow">→</span><span class="rule-b">先去識別化</span></li>
            <li data-b="3"><span class="rule-n">03</span><span class="rule-a">先知道</span><span class="rule-arrow">→</span><span class="rule-b">自己的資料設定</span></li>
          </ol>
        </div>
      </div>`
    },
    {
      id: 'deid', part: '1', title: '去識別化 Before / After', duration: 0.8, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="stack">
        <p class="eyebrow">1-3 · 去識別化</p>
        <div class="ba" data-deid>
          <div class="ba-card glass">
            <p class="ba-label">BEFORE</p>
            <ul class="ba-list before">
              <li><span>姓名</span><b>王小明</b></li>
              <li><span>電話</span><b>0912-123-456</b></li>
              <li><span>公司</span><b>ABC股份有限公司</b></li>
              <li><span>職稱</span><b>採購主管</b></li>
            </ul>
          </div>
          <button class="ba-go" type="button" data-deid-btn aria-label="示範去識別化轉換"><span>示範轉換</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <div class="ba-card glass after-card">
            <p class="ba-label ok">AFTER</p>
            <ul class="ba-list after">
              <li><span>代號</span><b>客戶 A</b></li>
              <li><span>電話</span><b class="removed">（移除）</b></li>
              <li><span>產業</span><b>製造業</b></li>
              <li><span>職務</span><b>採購職務</b></li>
            </ul>
          </div>
        </div>
        <p class="quote">「AI 需要的是問題脈絡，<br class="br-d">不一定需要真實身分。」</p>
      </div>`
    },
    {
      id: 'settings', part: '1', title: '現場一起做：關閉「為所有人持續加強模型」', duration: 2.5, transition: 'fade',
      source: ['openai-data-controls'], demo: 'chatgpt', builds: 5, buildStyle: 'hl',
      html: () => `
      <div class="settings" data-settings>
        <div class="settings-head">
          <div>
            <p class="eyebrow">1-4 · 30 秒，先把自己的資料設定看一次（手機 App 實際畫面）</p>
            <h2 class="h2">關閉「為所有人持續加強模型」</h2>
          </div>
          <div class="settings-tools">${src('openai-data-controls')}${demo('chatgpt')}</div>
        </div>
        <div class="set-body">
          <div class="phones">
            ${[['gear', '1', '側邊欄左下角', '齒輪（設定）'], ['menu', '2', '往下滑', '資料控制'], ['on', '3', '找到這個開關', '綠色＝開啟中'], ['off', '4', '點一下關閉', '灰色＝已關閉']]
              .map(([k, n, a, b], i) => `<button type="button" class="phone" data-b="${i + 1}" data-step-click="${i + 1}"><span class="phone-img"><img src="${(D.shots || {})[k] || ''}" alt="ChatGPT 手機 App：${b}" loading="lazy"></span><span class="phone-cap"><span class="step4-n">${n}</span><span><small>${a}</small><b>${b}</b></span></span></button>`).join('')}
          </div>
          <div class="set-done" data-b="5">
            <div class="done-l glass">
              <p class="done-t">完成。</p>
              <p class="done-row"><span class="dot ok"></span>新的對話：<b>不會用來訓練模型</b></p>
              <p class="done-row"><span class="dot keep"></span>聊天紀錄：<b>仍然保留</b></p>
            </div>
            <p class="neq">OFF <span>≠</span> 刪除聊天紀錄</p>
            <p class="small">按讚／倒讚送出回饋時，那段對話仍可能被用於改善模型。</p>
            <p class="tiny">電腦版：帳戶選單 → 設定 → 資料控管 → 為所有人改善模型（官方說明用語）。App 介面文字可能隨版本不同。</p>
          </div>
        </div>
      </div>`
    },
    {
      id: 'tempchat', part: '1', title: '進階：臨時聊天 Temporary Chat', duration: 0.4, transition: 'fade', source: ['openai-temp-chat'], demo: null,
      html: () => `
      <div class="stack">
        <div class="row-between"><p class="eyebrow">1-5 · 進階安全小技巧</p>${src('openai-temp-chat')}</div>
        <h2 class="h2">臨時聊天 <span class="en-inline">Temporary Chat</span></h2>
        <div class="facts4">
          <div class="fact glass"><p class="fact-t">不出現在</p><p class="fact-d">一般聊天紀錄</p></div>
          <div class="fact glass"><p class="fact-t">不建立／更新</p><p class="fact-d">記憶 Memory</p></div>
          <div class="fact glass"><p class="fact-t">不用於</p><p class="fact-d">改善模型</p></div>
          <div class="fact glass fact-warn"><p class="fact-t">可能保留</p><p class="fact-d">最多 30 天（安全用途）</p></div>
        </div>
        <p class="small">官方寫的是「可能因安全目的保留最多 30 天」，所以不要說它會「立即刪除」。</p>
      </div>`
    },
    {
      id: 'portrait', part: '1', title: '為什麼 AI 畫的「我」不像我？', duration: 0.7, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="stack">
        <p class="eyebrow">1-6 · 為什麼 AI 畫的「我」不像我？</p>
        <h2 class="h2">生成一個人，跟修改「本人照片」是兩件事</h2>
        <div class="portrait">
          <div class="pcol glass">
            <p class="pcol-k">從零生成</p>
            <div class="faces" aria-hidden="true"><i></i><i></i><i></i></div>
            <p class="pcol-r">結果：像「某一類人」</p>
          </div>
          <div class="pcol glass pcol-good">
            <p class="pcol-k">本人照片 ＋ 指定修改</p>
            <div class="photo" aria-hidden="true"><i></i><span class="pin p1">背景</span><span class="pin p2">服裝</span><span class="pin p3">燈光</span></div>
            <p class="pcol-r">比較能：保留本人樣貌</p>
          </div>
          <ul class="pguide">
            <li><b>自己的臉</b>使用自己的參考照片</li>
            <li><b>別人的臉</b>先有本人同意與使用權</li>
            <li><b>正式商業形象</b>真人保留，AI 改背景、場景、服裝、燈光、構圖</li>
          </ul>
        </div>
        <p class="kicker-sm">尊重本人 · 尊重來源 · 尊重使用情境</p>
      </div>`
    },
    {
      id: 'cardprompt', part: '1', title: '節慶賀卡提示詞：保留我的臉', duration: 1.5, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="cp">
        <div class="cp-l">
          <p class="eyebrow">1-7 · 提示詞教學：節慶賀卡</p>
          <h2 class="h2">放上全家福，<br>人卻不像自己？</h2>
          <p class="small cp-why">因為 AI 預設會「重畫」人物。要明確告訴它：<b>臉不能動，只改其他地方。</b></p>
          <ol class="tips">
            <li><b>照片要清楚</b>正面、光線足、臉不要太小</li>
            <li><b>先講「不能改」</b>臉部特徵、五官比例、髮型、膚色</li>
            <li><b>再講「可以改」</b>背景、服裝、光線、風格</li>
            <li><b>全家福要點名</b>「照片中共 4 人，從左到右…」</li>
            <li><b>不像就退一步</b>「人物保持原樣，只改背景」</li>
          </ol>
        </div>
        <div class="cp-r">
          <div class="cp-card glass">
            <div class="row-between"><p class="sp-k">可直接複製</p><button type="button" class="copy-btn" data-copy-card>複製提示詞</button></div>
            <pre class="cp-pre" data-card-pre tabindex="0"></pre>
          </div>
          <p class="tiny">【】內換成你的節日與內容。別人的照片，請先取得本人同意。</p>
        </div>
      </div>`
    },
    {
      id: 'vendor', part: '1', title: '付費版的資料保存多久？', duration: 1.4, transition: 'fade',
      source: ['openai-retention', 'openai-business', 'anthropic-consumer', 'gemini-privacy', 'workspace-privacy'], demo: null,
      html: () => `
      <div class="stack">
        <div class="row-between"><p class="eyebrow">補充 · 美國大公司重視個資嗎？看條款最準</p><span class="pill warnp">以官方說明為準 · ${V}</span></div>
        <h2 class="h2">付費個人版，資料保存多久？</h2>
        <div class="tbl-wrap"><table class="tbl tbl-ret">
          <thead><tr><th>工具</th><th>個人版（含付費 Plus／Pro／AI Pro）</th><th>企業版（Business／Team／Workspace）</th></tr></thead>
          <tbody>
            <tr><td><b>ChatGPT</b></td><td>聊天紀錄<b>保存到你刪除</b>；刪除後 <b>30 天內</b>永久刪除（法律或安全需要可延長）；是否用於訓練可自己關閉 ${src('openai-retention')}</td><td><b>預設不用於訓練</b>；保存依組織政策 ${src('openai-business')}</td></tr>
            <tr><td><b>Claude</b></td><td>允許用於訓練：保存 <b>5 年</b>；不允許：<b>30 天</b> ${src('anthropic-consumer')}</td><td>適用商業條款，不在上述個人版政策內 ${src('anthropic-consumer')}</td></tr>
            <tr><td><b>Gemini</b></td><td>活動記錄預設 <b>18 個月</b>自動刪除（可改 3／36 個月）；關閉後仍保留 <b>72 小時</b>；經人工審查的對話最多 <b>3 年</b> ${src('gemini-privacy')}</td><td>未經允許<b>不用於訓練</b>、不做人工審查；預設 18 個月（可選 3／18／36 個月） ${src('workspace-privacy')}</td></tr>
          </tbody>
        </table></div>
        <p class="small"><b>付費，不等於不訓練。</b>個人版記得自己關設定；公司資料，用企業版。</p>
      </div>`
    },

    /* ---------------- PART 2 ---------------- */
    {
      id: 'p2', part: '2', title: 'PART 2 Agent 時代開始了', duration: 0.3, transition: 'fade', source: [], demo: null, divider: true,
      html: () => partDivider(2, '不是再問 AI，<br>而是開始交付工作', 'AI Agent · Mission Control · 第一個任務', 6)
    },
    {
      id: 'intern', part: '2', title: 'AI Agent ＝ 很能幹的實習生', duration: 1, transition: 'fade', source: [], demo: null, builds: 2,
      html: () => `
      <div class="stack center-y">
        <p class="eyebrow">2-1 · AI Agent 到底是什麼？</p>
        <p class="h1 intern"><span class="en-big">AI Agent</span> <span class="eq">＝</span><br>「很能幹的實習生」</p>
        <div class="can" data-b="1">
          <span class="can-i glass">會查</span><span class="can-i glass">會整理</span><span class="can-i glass">會執行</span>
        </div>
        <div class="but" data-b="2">
          <span class="but-k">但</span>
          <span class="but-i">需要你<b>交代清楚</b></span>
          <span class="but-i">也需要你<b>驗收</b></span>
        </div>
      </div>`
    },
    {
      id: 'mission', part: '2', title: 'Agent Mission Control', duration: 2.3, transition: 'fade', source: [], demo: null, builds: 5, buildStyle: 'fill',
      html: () => `
      <div class="mc glass" data-mission>
        <div class="mc-top">
          <div class="mc-title"><span class="mc-led"></span>AI Agent Mission Control</div>
          <div class="mc-task">任務範例：幫我找 AI 課程</div>
        </div>
        <div class="mc-body">
          <div class="mc-rows">
            ${[
              ['GOAL', '要完成什麼', '找出 3–5 門現在可報名的免費或政府補助 AI 課程'],
              ['CONTEXT', '它需要知道什麼', '我是中小企業行政人員，會基本 ChatGPT，平日晚間可上課'],
              ['STANDARD', '怎樣算完成', '每門都有官方來源、報名狀態、費用、日期；查不到寫「需人工確認」'],
              ['PERMISSION', '它可以做到哪裡', '可以搜尋、閱讀官方網站、整理成表格'],
              ['BOUNDARY', '哪些事不能自己決定', '不可以幫我報名、不可以填我的個資、不推薦完全自費課程']
            ].map(([k, q, v], i) => `
              <button type="button" class="mc-row" data-b="${i + 1}" data-mc="${i + 1}">
                <span class="mc-k">${k}</span>
                <span class="mc-q">${q}</span>
                <span class="mc-v">${v}</span>
                <span class="mc-check" aria-hidden="true"></span>
              </button>`).join('')}
          </div>
          <div class="mc-side">
            <div class="mc-meter" data-mc-meter style="--p:0"><span data-mc-pct>0%</span><small>任務就緒度</small></div>
            <div class="mc-launch" data-mc-launch>交代清楚後<br>才能出發</div>
          </div>
        </div>
      </div>`
    },
    {
      id: 'firsttask', part: '2', title: '第一次交給 Agent 的工作', duration: 0.7, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="stack center-y">
        <p class="eyebrow">2-3 · 什麼工作最適合第一次交給 Agent？</p>
        <p class="h1 triple">重複 <span>×</span> 規則清楚 <span>×</span> 風險低</p>
        <p class="quote">「先從 AI 做錯，你也看得出來的工作開始。」</p>
        <div class="chips">
          ${['找課', '整理資料', '比較方案', '建立會議摘要', '搜尋公開資訊'].map(t => `<span class="chip glass">${t}</span>`).join('')}
        </div>
      </div>`
    },
    {
      id: 'threesteps', part: '2', title: 'Agent 初學者三步驟', duration: 1.4, transition: 'fade', source: [], demo: null, builds: 3,
      html: () => `
      <div class="stack">
        <p class="eyebrow">2-4 · Agent 初學者三步驟</p>
        <div class="steps3">
          <div class="s3 glass" data-b="1"><span class="s3-n">STEP 1</span><p class="s3-t">定義任務</p><p class="s3-d">一句話說出要完成的事</p></div>
          <div class="s3 glass" data-b="2"><span class="s3-n">STEP 2</span><p class="s3-t">說清楚</p><p class="s3-d">目標 · 標準 · 邊界</p></div>
          <div class="s3 glass s3-loop" data-b="3"><span class="s3-n">STEP 3</span>
            <ol class="loop"><li>AI 先做</li><li>人驗收</li><li>修正</li><li>穩定後再增加權限</li></ol>
          </div>
        </div>
      </div>`
    },

    /* ---------------- PART 3 ---------------- */
    {
      id: 'p3', part: '3', title: 'PART 3 政府 AI 人才資源', duration: 0.3, transition: 'fade', source: [], demo: null, divider: true,
      html: () => partDivider(3, '其實現在學 AI，<br>政府已經準備很多資源', '', 5)
    },
    {
      id: 'year', part: '3', title: '2026 正在執行・2027 規劃中', duration: 0.4, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="stack center-y">
        <p class="h1 year"><span class="en-big">2026</span></p>
        <div class="years">
          <div class="yr glass"><span class="pill mint">2026 年</span><p class="yr-t">正在執行</p><p class="yr-d">今天介紹的課程與方案</p></div>
          <div class="yr glass"><span class="pill lav">2027 年</span><p class="yr-t">預算案／規劃</p><p class="yr-d">需經立法院審議，不是已執行成果</p></div>
        </div>
      </div>`
    },
    {
      id: 'sme200', part: '3', title: '200+ 免費 AI 課程', duration: 0.8, transition: 'fade', source: ['sme-200', 'smelearning'], demo: 'smelearning',
      html: () => `
      <div class="bignum-wrap">
        <div class="bignum-l">
          <p class="eyebrow">3-2 · 經濟部中小及新創企業署</p>
          <p class="bignum" tabindex="0" data-tip="課程數會隨官方平台更新，以最新頁面為準。">${P['sme-200'].figure}</p>
          <p class="h2">免費 AI 課程</p>
          <p class="lead">「超過 200 門免費 AI 主題課程與課程包資源」</p>
          <p class="tiny">課程數會隨官方平台更新，以最新頁面為準。</p>
        </div>
        <div class="bignum-r">
          <div class="src-card glass">${badge(P['sme-200'].status)}<p>${P['sme-200'].agency}</p><p class="tiny">${P['sme-200'].title}</p>${src('sme-200')}</div>
          <div class="src-card glass">${badge(P['smelearning'].status)}<p>中小企業網路大學校</p><p class="tiny">smelearning.sme.gov.tw</p>${demo('smelearning')}</div>
        </div>
      </div>`
    },
    {
      id: 'gcis5w', part: '3', title: '5 萬人次 服務業 AI 人才', duration: 0.8, transition: 'fade', source: ['gcis-5w'], demo: 'gcisWorking',
      html: () => `
      <div class="bignum-wrap">
        <div class="bignum-l">
          <p class="eyebrow">3-3 · 經濟部商業發展署</p>
          <p class="bignum">${P['gcis-5w'].figure.replace(' 萬人次', '<span class="unit">萬人次</span>')}</p>
          <p class="h2">服務業 AI 人才</p>
          <p class="tiny">官方頁面寫「培育 5 萬人次」，未標示年期。</p>
        </div>
        <div class="bignum-r">
          <ul class="prog">
            <li class="glass"><b>在職進修</b>共通性 AI 培訓（CEO 班、iPAS 培訓班、基礎實務班）</li>
            <li class="glass"><b>在職進修</b>次產業培訓（零售、餐飲、物流、批發、生活服務）</li>
            <li class="glass"><b>青年</b>AI 實戰養成班 240 小時</li>
            <li class="glass"><b>企業</b>企業專班，依企業痛點客製</li>
          </ul>
          <div class="row-gap">${src('gcis-5w')}${demo('gcisWorking')}</div>
        </div>
      </div>`
    },
    {
      id: 'map', part: '3', title: 'AI 學習資源地圖', duration: 1.5, transition: 'fade', source: ['smelearning', 'gcis-home', 'ida-aimfg'], demo: null,
      html: () => `
      <div class="stack">
        <p class="eyebrow">3-5 · AI 學習資源地圖</p>
        <h2 class="h2">先看你在哪個產業，再選入口</h2>
        <div class="rmap">
          ${map.map(m => `
            <article class="rm glass">
              <div class="rm-head"><span class="rm-key">${m.key}</span><div><p class="rm-agency">${m.agency}</p><p class="rm-name">${m.name}</p></div></div>
              <dl class="rm-dl">
                <div><dt>適合誰</dt><dd>${m.who}</dd></div>
                <div><dt>課程類型</dt><dd>${m.type}</dd></div>
                <div><dt>免費／補助</dt><dd><span class="pill ${m.feeTone === 'free' ? 'mint' : 'warnp'}">${m.fee}</span></dd></div>
              </dl>
              <div class="rm-foot">${badge(P[m.src].status)}<a class="rm-link" href="${m.url}" target="_blank" rel="noopener">${m.host} ↗</a>${src(m.src)}</div>
            </article>`).join('')}
        </div>
      </div>`
    },
    {
      id: 'y116', part: '3', title: '2027 年：預算案與規劃', duration: 0.8, transition: 'fade', source: ['nstc-116', 'ndc-ai10', 'ida-ipas', 'ida-budget-116'], demo: null,
      html: () => `
      <div class="stack">
        <div class="row-between"><p class="eyebrow">3-6 · 2027 年</p><span class="pill lav big">2027 預算案／規劃</span></div>
        <h2 class="h2">未來方向：看得到規劃，還不是成果</h2>
        <div class="y116">
          <div class="yb glass"><p class="yb-n">1,823<span>億</span></p><p class="yb-t">2027 年科技預算案</p><p class="yb-d">整體科技預算，不等於 AI 人才預算</p>${src('nstc-116')}</div>
          <div class="yb glass"><p class="yb-n">2025–28</p><p class="yb-t">AI 新十大建設</p><p class="yb-d">行政院 2026/1/28 核定，含人才生態系</p>${src('ndc-ai10')}</div>
          <div class="yb glass"><p class="yb-n">½</p><p class="yb-t">iPAS AI 考試費減半</p><p class="yb-d">2026–2027 年，初級每科 400 元</p>${src('ida-ipas')}</div>
        </div>
        <p class="small">人才培育經費分散於不同部會與計畫，本頁不自行加總。${src('ida-budget-116', '產發署 2027 預算案')}</p>
      </div>`
    },

    /* ---------------- PART 4 ---------------- */
    {
      id: 'p4', part: '4', title: 'PART 4 AI 課程資源', duration: 0.3, transition: 'fade', source: [], demo: null, divider: true,
      html: () => partDivider(4, '先學會自己找，<br>才知道怎麼交給 AI', 'AI 課程資源', 3)
    },
    {
      id: 'manual', part: '4', title: '官方找課入口（現場示範）', duration: 3, transition: 'fade', source: ['smelearning', 'gcis-working', 'gcis-youth', 'ida-aimfg'], demo: 'gcisWorking',
      html: () => `
      <div class="stack sites-wrap">
        <div class="row-between"><p class="eyebrow">4-1 · 官方找課入口：點網址，跟著路徑走</p><span class="pill warnp">內容依 ${V} 官方頁面整理</span></div>
        <div class="sites">
          ${(D.courseSites || []).map(x => `
            <article class="site glass">
              <div class="br-bar"><i></i><i></i><i></i><a class="br-url site-url" href="${x.url}" target="_blank" rel="noopener">${x.host}</a></div>
              <div class="site-body">
                <p class="site-org">${x.agency}${P[x.src] && P[x.src].status !== 'VERIFIED' ? ' <span class="badge warn">NEEDS VERIFICATION</span>' : ''}</p>
                <p class="site-t">${x.name}</p>
                <ul class="site-list">${x.items.map(i => `<li><span>${i[0]}</span><em>${i[1]}</em></li>`).join('')}</ul>
                <p class="site-path">${x.path.map(t => `<span>${t}</span>`).join('<i>→</i>')}</p>
                <a class="site-go" href="${x.url}" target="_blank" rel="noopener">開啟網站 ↗</a>
              </div>
            </article>`).join('')}
        </div>
      </div>`
    },

    /* ---------------- PART 5 ---------------- */
    {
      id: 'p5', part: '5', title: 'PART 5 AI 學習雷達', duration: 0.3, transition: 'fade', source: [], demo: null, divider: true,
      html: () => partDivider(5, '把找課，<br>變成你的第一個 Agent 任務', 'AI Learning Radar · Prompt · 人驗收', 8)
    },
    {
      id: 'radar', part: '5', title: 'AI Learning Radar', duration: 0.7, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="radar-stage">
        <div class="radar-copy">
          <p class="eyebrow">5-1 · 產品介紹</p>
          <h1 class="h1">AI Learning Radar</h1>
          <p class="h2 muted-strong">AI 學習雷達</p>
          <p class="lead">不是掃全網路，是用 8 個條件幫你過濾官方課程。</p>
        </div>
        <div class="radar-orbit">
          ${radarDisc('xl')}
          ${['主題', '程度', '資格', '費用', '時間', '地點', '來源', '報名狀態'].map((t, i) => `<span class="orbit-tag glass" style="--i:${i}">${t}</span>`).join('')}
        </div>
      </div>`
    },
    {
      id: 'filter', part: '5', title: '雷達怎麼篩：10 個條件 → 1–2 門', duration: 1.8, transition: 'fade', source: [], demo: null, builds: 5,
      html: () => `
      <div class="flt">
        <div class="flt-l">
          <p class="eyebrow">5-2 · 找課真正要判斷的 10 件事</p>
          <h2 class="h2">人工要看 10 個條件，<br>AI 雷達一次比完</h2>
          <div class="crit crit-sm">
            ${['主題', '程度', '身份', '年齡', '費用', '補助', '時間', '地點', '方式', '可報名'].map((t, i) => `<div class="crit-i glass"><span>${String(i + 1).padStart(2, '0')}</span>${t}</div>`).join('')}
          </div>
        </div>
        <div class="flt-r">
          <div class="funnel">
            <div class="fn f1" data-b="1"><b>20</b> 門<span>搜尋結果</span></div>
            <div class="fn f2" data-b="2"><b>8</b> 門<span>資格符合</span></div>
            <div class="fn f3" data-b="3"><b>3</b> 門<span>時間、費用可以</span></div>
            <div class="fn f4" data-b="4"><b>1–2</b> 門<span>真正適合</span></div>
          </div>
          <p class="flt-q" data-b="5">這整件事，交給 AI。</p>
        </div>
      </div>`
    },
    {
      id: 'howitworks', part: '5', title: '雷達怎麼工作：了解你 → 檢查 → 輸出', duration: 2.4, transition: 'fade', source: [], demo: null, builds: 3,
      html: () => `
      <div class="stack how-wrap">
        <p class="eyebrow">5-3 · 雷達怎麼工作</p>
        <div class="how" data-workflow>
          <section class="how-c glass" data-b="1">
            <p class="how-n">01 先了解你</p>
            <div class="bubble ai">一次問 3–5 題：想學什麼？程度？身份？</div>
            <div class="bubble me">1A+C　2B　3A</div>
            <div class="how-rule"><b>硬規則</b>完全自費＋無政府補助 → 預設排除</div>
          </section>
          <section class="how-c glass" data-b="2">
            <div class="row-between"><p class="how-n">02 逐項檢查</p><button type="button" class="run-btn sm" data-wf-run>執行</button></div>
            <ol class="wf-steps how-steps">
              ${['了解需求', '搜尋官方網站', '確認來源', '檢查資格', '檢查費用', '檢查日期', '檢查地點', '確認仍可報名', '排除', '整理']
                .map((t, i) => `<li class="wf-s" data-wf="${i}"><span class="wf-dot"></span><span class="wf-t">${t}</span></li>`).join('')}
            </ol>
            <div class="wf-log how-log" data-wf-log aria-live="polite"><span class="wf-idle">按「執行」看流程（示意）</span></div>
          </section>
          <section class="how-c glass" data-b="3">
            <p class="how-n">03 輸出三區（最多 5 門）</p>
            <div class="zone-mini best"><b>最適合我</b><span>附官方來源、查核日期</span></div>
            <div class="zone-mini maybe"><b>可以考慮</b><span>寫出適合原因</span></div>
            <div class="zone-mini no"><b>這次先排除</b><span>寫出排除原因</span></div>
            <p class="how-rule"><b>不能猜</b>查不到的欄位寫「<span class="need">需人工確認</span>」</p>
          </section>
        </div>
      </div>`
    },
    {
      id: 'prompt', part: '5', title: 'AI 學習雷達 Prompt', duration: 2.3, transition: 'fade', source: [], demo: 'radar',
      html: () => `
      <div class="pr">
        <div class="pr-main">
          <div class="pr-head">
            <p class="eyebrow">現場實作 · AI 學習雷達 Prompt</p>
            <div class="tabs" role="tablist">
              <button type="button" role="tab" class="tab on" data-ptab="full" aria-selected="true">完整版</button>
              <button type="button" role="tab" class="tab" data-ptab="mobile" aria-selected="false">手機快速版</button>
            </div>
          </div>
          <pre class="pr-pre glass" data-ptext tabindex="0"></pre>
          <div class="row-gap">
            <button type="button" class="copy-btn" data-copy-tab>複製 Prompt</button>
            <button type="button" class="ghost-btn" data-run-radar>不想複製？直接在網頁找課</button>
            <span class="small">貼到 ChatGPT 或 Claude，並開啟「搜尋」。</span>
          </div>
        </div>
        <div class="pr-qr glass">
          <div class="qr" data-qr></div>
          <p class="pr-qr-t">手機掃描<br>開啟 AI 學習雷達</p>
          <p class="tiny qr-url" data-qr-url></p>
        </div>
      </div>`
    },
    {
      id: 'verify', part: '5', title: '人最後還是要驗收', duration: 0.7, transition: 'fade', source: [], demo: null, builds: 4,
      html: () => `
      <div class="stack center-y">
        <p class="eyebrow">5-5 · 人最後還是要驗收</p>
        <ol class="vq">
          <li data-b="1"><span>1</span>來源可信嗎？</li>
          <li data-b="2"><span>2</span>現在還有效嗎？</li>
          <li data-b="3"><span>3</span>真的符合我嗎？</li>
        </ol>
        <p class="kicker big" data-b="4">AI 執行　人驗收</p>
      </div>`
    },

    /* ---------------- PART 6 · 進階 ---------------- */
    {
      id: 'p6', part: '6', title: 'PART 6 進階：AI 代理人', duration: 0.3, transition: 'fade', source: [], demo: null, divider: true,
      html: () => partDivider(6, '雷達建好之後，<br>讓它自己動起來', '排程找課 · 你決定報名 · 寫進行事曆 · 上課提醒', 4)
    },
    {
      id: 'loop', part: '6', title: '從一次找課，到每週替你留意', duration: 1.5, transition: 'fade', source: [], demo: null, builds: 5,
      html: () => `
      <div class="stack">
        <p class="eyebrow">6-1 · 在自己的 AI 建好雷達之後呢？</p>
        <h2 class="h2">把雷達變成代理人：<br class="br-d">每週替你留意機會</h2>
        <ol class="agent-loop">
          <li class="al glass" data-b="1"><span class="al-n">01</span><p class="al-t">排程</p><p class="al-d">每週一 08:00<br>或每月 1 日</p><span class="al-who ai">AI</span></li>
          <li class="al glass" data-b="2"><span class="al-n">02</span><p class="al-t">自動找課</p><p class="al-d">只回報新課程<br>與快截止的課</p><span class="al-who ai">AI</span></li>
          <li class="al al-human" data-b="3"><span class="al-n">03</span><p class="al-t">你決定報名</p><p class="al-d">個資自己填<br>AI 不代報名</p><span class="al-who human">人</span></li>
          <li class="al glass" data-b="4"><span class="al-n">04</span><p class="al-t">寫進行事曆</p><p class="al-d">日曆連結<br>＋課程資訊</p><span class="al-who ai">AI</span></li>
          <li class="al glass" data-b="5"><span class="al-n">05</span><p class="al-t">上課提醒</p><p class="al-d">前一天 20:00<br>上課前 1 小時</p><span class="al-who ai">AI</span></li>
        </ol>
        <p class="small">權限一步一步給：先讓它找，再讓它提醒。<b>報名這一步，留給人。</b></p>
      </div>`
    },
    {
      id: 'tools6', part: '6', title: '三個工具都能排程', duration: 1, transition: 'fade', source: ['openai-tasks', 'gemini-sched', 'gemini-cal', 'claude-sched', 'claude-cal'], demo: null,
      html: () => `
      <div class="stack">
        <div class="row-between"><p class="eyebrow">6-2 · 排程要用哪個工具？</p><span class="pill warnp">功能常更新，以官方說明為準 · ${V}</span></div>
        <h2 class="h2">三個常見工具，都能排程找課</h2>
        <div class="tbl-wrap"><table class="tbl">
          <thead><tr><th>工具</th><th>排程功能</th><th>頻率（官方說明）</th><th>寫進行事曆</th></tr></thead>
          <tbody>
            <tr><td><b>ChatGPT</b></td><td>Scheduled tasks<br><span class="tiny">免費版也可用，最多 3 個</span></td><td>一次性或週期性；免費版最頻繁每天一次 ${src('openai-tasks')}</td><td>官方說明未提到 → 用<b>日曆連結</b></td></tr>
            <tr><td><b>Gemini</b></td><td>Scheduled actions<br><span class="tiny">最多 10 個</span></td><td>每天／每週／每月 ${src('gemini-sched')}</td><td>可建立 Google 日曆活動 ${src('gemini-cal')}</td></tr>
            <tr><td><b>Claude Cowork</b></td><td>排程任務<br><span class="tiny">付費方案</span></td><td>每小時／每天／每週／平日 ${src('claude-sched')}</td><td>日曆連接器可讀不可建 → 用<b>日曆連結</b> ${src('claude-cal')}</td></tr>
          </tbody>
        </table></div>
        <p class="small">每月找一次，選 Gemini；每週找一次，三個都可以。不管哪個工具，<b>日曆連結</b>都能用。</p>
      </div>`
    },
    {
      id: 'schedprompt', part: '6', title: '排程 Prompt ＋ 行事曆提醒', duration: 1.2, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="sp" data-sp>
        <div class="sp-main">
          <div class="pr-head">
            <p class="eyebrow">6-3 · 排程版 Prompt</p>
            <div class="tabs" role="tablist">
              <button type="button" role="tab" class="tab on" data-sfreq="weekly" aria-selected="true">每週</button>
              <button type="button" role="tab" class="tab" data-sfreq="monthly" aria-selected="false">每月</button>
            </div>
          </div>
          <pre class="pr-pre glass" data-sp-pre tabindex="0"></pre>
          <div class="row-gap"><button type="button" class="copy-btn" data-sp-copy>複製排程 Prompt</button><span class="small">貼上後，工具會建立排程並回覆確認。</span></div>
        </div>
        <div class="sp-side">
          <div class="sp-card glass">
            <p class="sp-k">報名之後</p>
            <p class="sp-t">一句話，放進行事曆</p>
            <p class="small">「我已經報名了這門課，請幫我放進行事曆，設定前一天晚上 8 點、上課前 1 小時提醒。」</p>
            <button type="button" class="ghost-btn" data-sp-cal>複製行事曆提醒 Prompt</button>
          </div>
          <div class="sp-card glass">
            <p class="sp-k">網頁內也能做</p>
            <p class="small">雷達找到的每一門課，都有「加入 Google 日曆」按鈕。</p>
            <button type="button" class="ghost-btn" data-run-radar>打開雷達試試</button>
          </div>
        </div>
      </div>`
    },

    /* ---------------- CLOSING ---------------- */
    {
      id: 'closing', part: 'end', title: '進入 Agent 時代', duration: 0.7, transition: 'fade', source: [], demo: null, builds: 3,
      html: () => `
      <div class="stack center-y">
        <p class="h1 closing-t">進入 Agent 時代，<br>先從換一種方式交付工作開始。</p>
        <div class="close3">
          <div class="c3 glass" data-b="1"><span>01</span><p>定義任務</p></div>
          <div class="c3 glass" data-b="2"><span>02</span><p>說清楚<br><small>目標／標準／邊界</small></p></div>
          <div class="c3 glass" data-b="3"><span>03</span><p>AI 執行<br><small>人驗收</small></p></div>
        </div>
      </div>`
    },
    {
      id: 'tomorrow', part: 'end', title: '明天你可以換成', duration: 0.5, transition: 'fade', source: [], demo: null,
      html: () => `
      <div class="stack center-y">
        <p class="h2 muted-strong">今天找的是課。</p>
        <p class="h1">明天你可以換成：</p>
        <div class="chips chips-lg">
          ${['找客戶', '市場研究', '整理報告', '會議追蹤', '內容規劃', '資料分析'].map(t => `<span class="chip glass">${t}</span>`).join('')}
        </div>
      </div>`
    },
    {
      id: 'takeaway', part: 'end', title: '今天帶得走的三樣東西', duration: 1.8, transition: 'fade', source: [], demo: 'radar',
      html: () => `
      <div class="tk">
        <div class="tk-l">
          <p class="eyebrow">帶走</p>
          <h2 class="h2">今天，你帶得走的三樣東西</h2>
          <ol class="tk-list">
            <li><span>1</span><div><b>一個檢查過的資料設定</b><small>資料控制 → 為所有人持續加強模型 → 關閉</small></div></li>
            <li><span>2</span><div><b>一台可以直接執行的 AI 學習雷達</b><small>一句話就找課，也能每週自動找</small></div></li>
            <li><span>3</span><div><b>一套交付工作的方法</b><small>定義任務 → 目標／標準／邊界 → AI 執行，人驗收</small></div></li>
          </ol>
          <div class="run-box glass" data-run-box>
            <label for="run-box-input" class="sr">一句話告訴雷達</label>
            <input id="run-box-input" type="text" placeholder="一句話告訴雷達：我在台南做行政，想學 AI 自動化">
            <button type="button" class="copy-btn" data-run-radar>開始找課 →</button>
          </div>
        </div>
        <div class="pr-qr glass">
          <div class="qr" data-qr></div>
          <p class="pr-qr-t">手機掃描<br>帶走 AI 學習雷達</p>
        </div>
      </div>`
    },
    {
      id: 'final', part: 'end', title: '最後一句話', duration: 0.4, transition: 'fade', source: [], demo: null, builds: 3,
      html: () => `
      <div class="final">
        <div class="final-glow" aria-hidden="true">${radarDisc('xl')}</div>
        <div class="final-text">
          <p class="final-lead" data-b="1">不用等到會寫程式。<br>不用等到完全搞懂 AI。</p>
          <p class="h1 final-h" data-b="2">今天交出第一件工作，<br>你就已經走進 Agent 時代。</p>
          <p class="final-k" data-b="3">下一個被 AI 放大的人，就是你。</p>
          <div class="contact glass">
            <p class="contact-k">聯繫資訊</p>
            <p class="contact-n">沃領客資訊｜教育訓練總監｜<b>Lynn Lin</b></p>
            <p class="contact-l"><span>lynn.lin@worklink.app</span><span class="sep"></span><span>0800-008-135</span></p>
          </div>
        </div>
      </div>`
    }
  ];

  /* 備註掛回每一頁 */
  D.slides.forEach(s => { s.speakerNote = D.speakerNotes[s.id] || ''; });
})();
