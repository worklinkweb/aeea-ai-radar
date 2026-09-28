/* AI 學習雷達工具：直接找課（網頁內執行）＋ 帶走 Prompt ＋ 排程自動找課 */
window.RadarTool = (function () {
  'use strict';
  const D = window.DECK;
  const SNAP = D.courseSnapshot;
  const Q = D.radarQuestions;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CHECKS = ['了解需求', '搜尋官方網站', '確認來源', '檢查資格', '檢查費用', '檢查日期', '檢查地點', '確認是否仍可報名', '排除', '整理'];
  const REGION_NAME = { A: '北', B: '中', C: '南', D: '不限' };

  function mount(ctx) {
    const { $, $$, copyText, toast, store } = ctx;
    const answers = {};
    const rt = document.getElementById('radar');
    let sample = null, running = null, freq = 'weekly', lastProfile = null;

    rt.innerHTML = `
    <div class="rt">
      <div class="rt-head">
        <div>
          <p class="eyebrow rt-eyebrow">AI Learning Radar</p>
          <h2>AI 學習雷達</h2>
          <p>不想複製貼上？一句話告訴雷達，直接在這個網頁找課。想每週自動找，就帶走排程 Prompt。</p>
        </div>
        <button type="button" class="ghost-btn rt-close" data-close-tool>回到簡報</button>
      </div>

      <div class="rt-q glass">
        <div class="ask">
          <label for="extra">一句話告訴雷達<small>可以只填這一格</small></label>
          <textarea id="extra" rows="3" placeholder="例如：我在台南做行政，想學 AI 自動化，平日晚上有空，只要免費的課"></textarea>
          <div class="ask-eg">
            ${['我在台南做行政，想學 AI 自動化，只要免費', '待業中，住台北，想學 AI 行銷', '我是老闆，想學 AI 營運決策'].map(t => `<button type="button" class="eg" data-eg="${esc(t)}">${esc(t)}</button>`).join('')}
          </div>
        </div>
        <details class="more" data-more>
          <summary>或用選擇題（簡碼）</summary>
          ${Q.map(q => `
            <div class="q" role="group" aria-labelledby="q${q.n}t">
              <p class="q-t" id="q${q.n}t"><span class="q-n">Q${q.n}</span>${q.q}${q.multi ? '<small>可複選</small>' : ''}</p>
              <div class="opts">${q.opts.map(([k, t]) => `<button type="button" class="opt" id="opt-${q.n}${k}" data-q="${q.n}" data-k="${k}" aria-pressed="false"><b>${k}</b>${t}</button>`).join('')}</div>
            </div>`).join('')}
          <label class="selfpay" for="selfpay"><input type="checkbox" id="selfpay"> 我接受自費課程（不勾選＝自費且無補助的課程預設排除）</label>
        </details>
      </div>

      <div class="rt-out glass">
        <div class="tabs rt-tabs" role="tablist">
          <button type="button" role="tab" class="tab on" data-rtab="run" aria-selected="true">直接找課</button>
          <button type="button" role="tab" class="tab" data-rtab="prompt" aria-selected="false">帶走 Prompt</button>
          <button type="button" role="tab" class="tab" data-rtab="sched" aria-selected="false">排程自動找</button>
        </div>

        <div class="pane" data-pane="run">
          <p class="small rt-label">你的條件</p>
          <p class="code" data-code></p>
          <div class="run-row">
            <button type="button" class="copy-btn run-go" data-run>開始找課</button>
            <button type="button" class="ghost-btn" data-stop hidden>停止</button>
            <span class="mode-badge" data-mode>規則模式</span>
          </div>
          <label class="ai-toggle" data-ai-wrap hidden for="use-ai"><input type="checkbox" id="use-ai" checked> 讓 Claude 分析（會先詢問授權，使用你自己的 Claude 額度）</label>
          <ol class="chk" data-chk>${CHECKS.map((c, i) => `<li data-c="${i}">${c}</li>`).join('')}</ol>
          <p class="tiny">只從 ${SNAP.verified} 查核的官方課程快照挑選（${SNAP.courses.length} 門）。AI 只能挑選與說明理由，課程資料一律由官方快照帶出，不讓 AI 改寫。</p>
        </div>

        <div class="pane" data-pane="prompt" hidden>
          <pre class="rt-pre" data-rt-pre tabindex="0"></pre>
          <div class="rt-btns">
            <button type="button" class="copy-btn" data-copy-mine>複製我的 Prompt</button>
            <button type="button" class="ghost-btn" data-copy-mobile>複製手機快速版</button>
            <button type="button" class="ghost-btn" data-reset>清除選擇</button>
          </div>
          <ol class="howto">
            <li>打開 ChatGPT、Gemini 或 Claude，開啟「搜尋」。</li>
            <li>貼上 Prompt，送出。AI 會即時搜尋最新課程。</li>
            <li>回官方網站確認：來源可信、現在有效、真的符合我。</li>
          </ol>
        </div>

        <div class="pane" data-pane="sched" hidden>
          <div class="freq" role="radiogroup" aria-label="排程頻率">
            <button type="button" class="opt" data-freq="weekly" aria-pressed="true">每週一 08:00</button>
            <button type="button" class="opt" data-freq="monthly" aria-pressed="false">每月 1 日 08:00</button>
          </div>
          <pre class="rt-pre" data-sched-pre tabindex="0"></pre>
          <div class="rt-btns">
            <button type="button" class="copy-btn" data-copy-sched>複製排程 Prompt</button>
            <button type="button" class="ghost-btn" data-copy-cal>複製行事曆提醒 Prompt</button>
          </div>
          <p class="tiny">貼到 ChatGPT「排程任務」、Gemini「排定動作」或 Claude Cowork「排程任務」。各工具支援的頻率不同，簡報上有對照表。</p>
        </div>
      </div>

      <section class="rt-results" data-results aria-live="polite">
        <div class="res-empty">
          <p class="res-empty-t">結果會出現在這裡</p>
          <p class="small">分成三區：最適合我、可以考慮、這次先排除。每門課都附官方來源與查核日期，查不到的欄位寫「需人工確認」。</p>
        </div>
      </section>
    </div>`;

    /* ---------- profile ---------- */
    function parseText(t) {
      const p = { topics: [], time: [] };
      if (!t) return p;
      const has = re => re.test(t);
      if (has(/台北|臺北|新北|桃園|基隆|新竹|北部/)) p.area = 'A';
      else if (has(/台中|臺中|彰化|苗栗|南投|中部/)) p.area = 'B';
      else if (has(/台南|臺南|高雄|嘉義|屏東|南部/)) p.area = 'C';
      if (has(/待業|找工作|失業|剛畢業|應屆/)) p.role = 'D';
      else if (has(/學生|在學/)) p.role = 'E';
      else if (has(/老闆|企業主|創業|負責人|經營者|CEO/i)) p.role = 'A';
      else if (has(/主管|HR|人資|經理/i)) p.role = 'C';
      else if (has(/自由工作|接案|SOHO/i)) p.role = 'F';
      else if (has(/上班|在職|行政|行銷人員|員工|業務/)) p.role = 'B';
      [[/生成式|ChatGPT|GPT|生成/i, 'A'], [/自動化|流程/, 'B'], [/agent|代理/i, 'C'], [/行銷|社群|廣告|文案|影音/, 'D'], [/行政|效率|文書/, 'E'], [/數據|分析|資料|決策/, 'F'], [/製造|生產|工廠/, 'G']]
        .forEach(([re, k]) => { if (re.test(t)) p.topics.push(k); });
      if (has(/晚上|晚間|下班/)) p.time.push('B');
      if (has(/白天|上午|下午/)) p.time.push('A');
      if (has(/週末|周末|假日|六日/)) p.time.push('C');
      if (has(/錄播|自學|隨時/)) p.mode = 'B';
      else if (has(/線上|遠距/)) p.mode = 'A';
      else if (has(/實體|現場/)) p.mode = 'C';
      if (has(/只要免費|免費的|只接受免費/)) p.fee = 'A';
      if (has(/接受自費|自費也可以|自費可/)) p.selfpay = true;
      return p;
    }
    function profile() {
      const text = $('#extra').value.trim();
      const t = parseText(text);
      const a = k => answers[k] && answers[k].length ? answers[k] : null;
      return {
        text,
        topics: Array.from(new Set([...(a(1) || []), ...t.topics])),
        level: (a(2) || [])[0] || null,
        role: (a(3) || [])[0] || t.role || null,
        time: Array.from(new Set([...(a(4) || []), ...t.time])),
        mode: (a(5) || [])[0] || t.mode || null,
        area: (a(6) || [])[0] || t.area || null,
        fee: (a(7) || [])[0] || t.fee || null,
        selfpay: $('#selfpay').checked || !!t.selfpay
      };
    }
    const optLabel = (n, k) => { const q = Q.find(x => x.n === n); const o = q && q.opts.find(x => x[0] === k); return o ? o[1] : k; };
    function describe(p) {
      const out = [];
      if (p.topics.length) out.push('想學：' + p.topics.map(k => optLabel(1, k)).join('、'));
      if (p.level) out.push('程度：' + optLabel(2, p.level));
      if (p.role) out.push('身份：' + optLabel(3, p.role));
      if (p.time.length) out.push('時間：' + p.time.map(k => optLabel(4, k)).join('、'));
      if (p.mode) out.push('方式：' + optLabel(5, p.mode));
      if (p.area) out.push('地區：' + optLabel(6, p.area));
      if (p.fee) out.push('費用：' + optLabel(7, p.fee));
      out.push('自費課程：' + (p.selfpay ? '接受' : '不接受'));
      return out;
    }
    function codeString() {
      return Q.filter(q => answers[q.n] && answers[q.n].length).map(q => `${q.n}${answers[q.n].join('+')}`).join(' ');
    }

    /* ---------- rule engine ---------- */
    const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
    function evaluate(c, p) {
      const hard = [], soft = [];
      if (c.status === 'full') hard.push('已額滿');
      if (c.status === 'closed') hard.push('已截止報名');
      if (c.start && c.start < today) hard.push('已開課');
      if (c.audience === 'youth' && p.role && !['D', 'E'].includes(p.role)) hard.push('資格不符：限 18–35 歲待業青年');
      if (c.audience === 'youth' && p.role === 'E') soft.push('學生需確認是否符合「應屆畢業」');
      if (c.audience === 'work' && ['D', 'E'].includes(p.role)) hard.push('資格不符：限服務業在職人員');
      if (c.audience === 'work' && p.role === 'F') soft.push('自由工作者需確認是否算服務業在職');
      if (c.audience === 'insured' && p.role === 'D') hard.push('資格不符：限具勞保／就保／職保／農保的在職勞工');
      if (c.audience === 'insured' && ['E', 'F'].includes(p.role)) soft.push('需確認有勞保、就保、職保或農保身分');
      if (c.audience === 'insured' && p.fee === 'A') soft.push('一般身分需自付 20%（45 歲以上等特定對象全額補助）');
      const online = c.mode === '錄播';
      if (!online && c.region !== '不限' && p.area && p.area !== 'D' && REGION_NAME[p.area] !== c.region) hard.push(`地區不符：在${c.city}上課`);
      if (p.mode === 'B' && !online) soft.push('有實體或混成課程，需到現場');
      if (p.mode === 'C' && online) soft.push('這是線上錄播，不是實體課');
      if (!p.selfpay && /自費/.test(c.fee) && !/補助|免費/.test(c.fee)) hard.push('完全自費且無政府補助');
      if (c.start && c.start <= addDays(today, 2) && !hard.length) soft.push('即將開課，報名可能已截止');
      if (c.status === 'check') soft.push('報名狀態需人工確認');
      const overlap = p.topics.length ? c.topics.filter(t => p.topics.includes(t)).length : 1;
      if (p.topics.length && !overlap) soft.push('主題不完全符合');
      let score = overlap * 3 + (c.status === 'open' ? 2 : 0) - soft.length;
      if (p.level && c.level) score -= Math.abs('ABCD'.indexOf(p.level) - 'ABCD'.indexOf(c.level)) * 0.8;
      if (p.time.includes('D') && online) score += 1;
      return { c, hard, soft, overlap, score };
    }
    function ymdOf(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
    function addDays(ymd, n) { const [y, m, dd] = ymd.split('-').map(Number); const d = new Date(y, m - 1, dd); d.setDate(d.getDate() + n); return ymdOf(d); }
    function whyRule(e, p) {
      const bits = [];
      const hit = e.c.topics.filter(t => p.topics.includes(t)).map(k => optLabel(1, k));
      if (hit.length) bits.push('主題符合：' + hit.join('、'));
      if (e.c.mode === '錄播') bits.push('免費錄播，隨時可看');
      else if (p.area && p.area !== 'D') bits.push(`在${e.c.city}，符合地區`);
      if (e.c.audience === 'youth') bits.push('青年班完訓可領獎勵');
      if (e.c.audience === 'insured') bits.push('有勞保／就保就能用政府補助，3 年最高 10 萬');
      if (e.c.status === 'open') bits.push('官方列表顯示報名中');
      return bits.join('；') || '符合目前條件';
    }
    function runRules(p) {
      const ev = SNAP.courses.map(c => evaluate(c, p));
      const pass = ev.filter(e => !e.hard.length && e.overlap > 0).sort((a, b) => b.score - a.score);
      const best = pass.filter(e => e.soft.filter(s => s !== '報名狀態需人工確認').length === 0).slice(0, 3);
      const consider = pass.filter(e => !best.includes(e)).slice(0, 5 - best.length);
      const exclude = ev.filter(e => e.hard.length && (e.overlap > 0 || !p.topics.length)).sort((a, b) => b.overlap - a.overlap).slice(0, 4);
      return {
        best: best.map(e => ({ id: e.c.id, why: whyRule(e, p), notes: e.soft })),
        consider: consider.map(e => ({ id: e.c.id, why: whyRule(e, p), notes: e.soft })),
        exclude: exclude.map(e => ({ id: e.c.id, reason: e.hard.join('；') })),
        advice: best.length + consider.length < 2 ? '符合的課不多：可以放寬地區或方式，或用「排程自動找」每週幫你盯新課。' : ''
      };
    }

    /* ---------- AI mode ---------- */
    function aiPrompt(p, ruleDraft) {
      const data = SNAP.courses.map(c => ({ id: c.id, title: c.title, agency: c.agency, program: c.program, audience: c.audience, eligibility: c.eligibility, fee: c.fee, start: c.start || '隨時', city: c.city || '線上', mode: c.mode, hours: c.hours, status: c.status, topics: c.topics, level: c.level }));
      return `你是「AI 學習雷達」，幫一位台灣學員從官方課程快照中挑課。今天是 ${today}。

【學員條件】
${describe(p).join('\n')}
學員原話：${p.text || '（沒有填）'}

【硬規則】
1. 只能從下方 JSON 的課程中挑選，用 id 指定，不可以自己新增課程或改寫課程資料。
2. status 為 full（額滿）或 closed（截止）、已開課、資格不符（audience: work＝服務業在職；youth＝18–35 歲待業青年；insured＝具勞保／就保／職保／農保的在職勞工；all＝任何人）、地區不符（錄播與全台課程除外）的課程，放進 exclude 並寫原因。
2-1. 勞動部產業人才投資方案屬於政府補助（80%，45 歲以上等特定對象 100%），不是自費課程；學員只接受免費時，放在 consider 並說明需自付 20%。
3. 完全自費且無政府補助的課程預設排除，除非學員說接受自費。
4. best＋consider 合計最多 5 門；best 最多 3 門。
5. status 為 check 代表官方列表沒標示報名狀態，不能說「報名中」。
6. 用繁體中文，why 與 reason 各 40 字以內，要具體對應學員條件。

【規則引擎初稿（可參考，可調整）】
${JSON.stringify({ best: ruleDraft.best.map(x => x.id), consider: ruleDraft.consider.map(x => x.id) })}

【課程快照 JSON（查核日 ${SNAP.verified}）】
${JSON.stringify(data)}

只回傳一個 JSON 物件：
{"best":[{"id":"w01","why":"…"}],"consider":[{"id":"s01","why":"…"}],"exclude":[{"id":"w10","reason":"…"}],"advice":"給學員的一句下一步建議（30 字內）"}`;
    }
    function sanitizeAI(r, p) {
      const byId = Object.fromEntries(SNAP.courses.map(c => [c.id, c]));
      const seen = new Set();
      const clean = (arr, key) => (Array.isArray(arr) ? arr : []).filter(x => x && byId[x.id] && !seen.has(x.id) && seen.add(x.id)).map(x => ({ id: x.id, [key]: String(x[key] || '').slice(0, 80) }));
      let best = clean(r.best, 'why'), consider = clean(r.consider, 'why'), exclude = clean(r.exclude, 'reason');
      // 硬規則再檢查一次：AI 放錯區的課程一律移到排除
      const moveOut = [];
      [best, consider].forEach(list => list.forEach(x => { const e = evaluate(byId[x.id], p); if (e.hard.length) moveOut.push({ id: x.id, reason: e.hard.join('；') }); }));
      const outIds = new Set(moveOut.map(x => x.id));
      best = best.filter(x => !outIds.has(x.id)).slice(0, 3);
      consider = consider.filter(x => !outIds.has(x.id)).slice(0, 5 - best.length);
      exclude = [...moveOut, ...exclude].slice(0, 5);
      const withNotes = x => Object.assign(x, { notes: evaluate(byId[x.id], p).soft });
      return { best: best.map(withNotes), consider: consider.map(withNotes), exclude, advice: String(r.advice || '').slice(0, 60) };
    }

    /* ---------- render ---------- */
    function gcalLink(c) {
      const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
      const details = `官方來源：${c.source}\n報名／課程頁：${c.regUrl || '需人工確認'}\n上課時段：${c.timeslot}\n提醒：上課前一天晚上 8 點、上課前 1 小時\n（由 AEEA AI 學習雷達產生，資料查核日 ${SNAP.verified}，請回官方確認）`;
      let dates;
      if (c.start) {
        const s = c.start.replace(/-/g, ''); const e = addDays(c.start, 1).replace(/-/g, '');
        dates = `${s}/${e}`;
      } else {
        const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
        const ymd = ymdOf(d).replace(/-/g, '');
        dates = `${ymd}T100000/${ymd}T110000&ctz=Asia/Taipei`;
      }
      const title = (c.start ? '上課：' : '學習時間：') + c.title;
      return `${base}&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(c.city || '線上')}`;
    }
    const need = v => /需人工確認/.test(String(v)) || v === '' ? `<span class="need">${esc(v || '需人工確認')}</span>` : esc(v);
    function card(item, zone) {
      const c = SNAP.courses.find(x => x.id === item.id); if (!c) return '';
      const statusTxt = { open: '報名中（官方列表）', check: '需人工確認', full: '已額滿', closed: '已截止' }[c.status];
      const link = (u, t) => u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>` : '<span class="need">需人工確認</span>';
      return `<article class="rc glass zone-${zone}">
        <p class="rc-org">${esc(c.agency)}｜${esc(c.program)}</p>
        <h4 class="rc-t">${esc(c.title)}</h4>
        <p class="rc-why">${zone === 'no' ? '排除原因：' + esc(item.reason) : esc(item.why)}</p>
        ${zone !== 'no' ? `<dl class="rc-dl">
          <div><dt>資格</dt><dd>${need(c.eligibility)}</dd></div>
          <div><dt>費用／補助</dt><dd>${esc(c.fee)}</dd></div>
          <div><dt>日期</dt><dd>${c.start ? esc(c.start) + ' 開課' : '隨時可看'}</dd></div>
          <div><dt>上課時段</dt><dd>${need(c.timeslot)}</dd></div>
          <div><dt>方式</dt><dd>${esc(c.mode)}${c.hours ? '・' + esc(c.hours) + (typeof c.hours === 'number' ? ' 小時' : '') : ''}</dd></div>
          <div><dt>地點</dt><dd>${esc(c.city || '線上')}</dd></div>
          <div><dt>報名狀態</dt><dd>${c.status === 'open' ? esc(statusTxt) : need(statusTxt)}</dd></div>
          <div><dt>官方來源</dt><dd>${link(c.source, '官方頁面 ↗')}</dd></div>
          <div><dt>報名網址</dt><dd>${link(c.regUrl, '報名／課程頁 ↗')}</dd></div>
          <div><dt>最後查核</dt><dd>${esc(SNAP.verified)}</dd></div>
        </dl>
        ${item.notes && item.notes.length ? `<p class="rc-notes">${item.notes.map(esc).join('・')}</p>` : ''}
        <div class="rc-act"><a class="cal-btn" href="${esc(gcalLink(c))}" target="_blank" rel="noopener">${c.start ? '加入 Google 日曆' : '排一小時學習時間'}</a><button type="button" class="ghost-btn sm" data-cal-copy="${c.id}">複製提醒 Prompt</button></div>` : ''}
      </article>`;
    }
    function render(res, p, mode) {
      const zone = (key, title, cls, arr, field) => `
        <div class="zone">
          <p class="zone-t ${cls}">${title}<span>${arr.length}</span></p>
          ${arr.length ? arr.map(x => card(x, cls)).join('') : `<p class="small zone-empty">${key === 'best' ? '沒有完全符合的課。可以放寬地區或方式，或用「帶走 Prompt」即時搜尋。' : '無'}</p>`}
        </div>`;
      $('[data-results]').innerHTML = `
        <div class="res-head">
          <div><p class="res-k">${mode === 'ai' ? 'Claude 分析結果' : '規則引擎結果'}・官方快照 ${SNAP.verified}</p>
          <p class="res-p">${describe(p).map(esc).join('｜')}</p></div>
          ${res.advice ? `<p class="res-adv">${esc(res.advice)}</p>` : ''}
        </div>
        <div class="zones">
          ${zone('best', '最適合我', 'best', res.best)}
          ${zone('consider', '可以考慮', 'maybe', res.consider)}
          ${zone('exclude', '這次先排除', 'no', res.exclude)}
        </div>
        <div class="res-foot">
          <p><b>AI 執行，人驗收：</b>來源可信嗎？現在還有效嗎？真的符合我嗎？報名前請回官方網站確認。</p>
          <p class="tiny">這份結果只涵蓋 ${SNAP.verified} 的官方快照。要找最新課程，請到「帶走 Prompt」或「排程自動找」。</p>
        </div>`;
      $$('[data-cal-copy]', rt).forEach(b => b.addEventListener('click', () => {
        const c = SNAP.courses.find(x => x.id === b.dataset.calCopy);
        const t = D.calendarPrompt.replace('・課名：【】', `・課名：${c.title}`).replace('・日期與時間：【】', `・日期與時間：${c.start || '（自己安排）'}（時段：${c.timeslot}）`).replace('・地點或線上連結：【】', `・地點或線上連結：${c.city || '線上'}`).replace('・官方課程頁：【】', `・官方課程頁：${c.regUrl || c.source}`);
        copyText(t, b);
      }));
    }

    /* ---------- run ---------- */
    function setChecks(k) { $$('[data-c]', rt).forEach(li => { const n = +li.dataset.c; li.className = n < k ? 'ok' : n === k ? 'run' : ''; }); }
    async function run() {
      if (running) return;
      const p = profile(); lastProfile = p;
      const btn = $('[data-run]'), stop = $('[data-stop]');
      const useAI = sample && $('#use-ai').checked;
      const draft = runRules(p);
      const ctl = new AbortController(); running = ctl;
      btn.disabled = true; btn.textContent = useAI ? 'Claude 思考中…' : '找課中…'; stop.hidden = !useAI;
      let k = 0; setChecks(0);
      const timer = setInterval(() => { k = Math.min(k + 1, CHECKS.length - 1); setChecks(k); }, useAI ? 1600 : 230);
      $('[data-results]').innerHTML = `<div class="res-empty"><p class="res-empty-t">${useAI ? 'Claude 正在比對官方快照…' : '雷達掃描中…'}</p><p class="small">${useAI ? '第一次使用會先詢問授權。通常 10–40 秒。' : ''}</p></div>`;
      $('[data-results]').scrollIntoView({ behavior: 'smooth', block: 'start' });
      let res = draft, mode = 'rules';
      try {
        if (useAI) {
          const r = await sample.json(aiPrompt(p, draft), { signal: ctl.signal, cache: false });
          res = sanitizeAI(r || {}, p); mode = 'ai';
        } else {
          await new Promise(ok => setTimeout(ok, 2400));
        }
      } catch (e) {
        const code = e && e.code;
        if (code === 'not_granted' || code === 'sampling_disabled' || code === 'not_declared' || code === 'capability_disabled' || code === 'capability_removed') {
          sample = null; $('[data-ai-wrap]').hidden = true; $('[data-mode]').textContent = '規則模式';
          toast('未取得 Claude 授權，已改用規則模式');
        } else if (code === 'cancelled') {
          toast('已停止，先顯示規則引擎結果');
        } else if (code === 'rate_limited') {
          toast('Claude 使用量已達上限，先顯示規則引擎結果');
        } else {
          toast('Claude 暫時沒有回應，先顯示規則引擎結果');
        }
        res = draft; mode = 'rules';
      }
      clearInterval(timer); setChecks(CHECKS.length);
      running = null; btn.disabled = false; btn.textContent = '再找一次'; stop.hidden = true;
      render(res, p, mode);
    }
    $('[data-run]').addEventListener('click', run);
    $('[data-stop]').addEventListener('click', () => { if (running) running.abort(); });

    /* ---------- prompt panes ---------- */
    function conditionsBlock() {
      const p = profile(); const code = codeString();
      const lines = describe(p).map(x => '・' + x);
      if (p.text) lines.push('・我的描述：' + p.text);
      return (code ? '簡碼：' + code + '\n' : '') + lines.join('\n');
    }
    function myPrompt() {
      const p = profile();
      if (!codeString() && !p.text && !p.selfpay) return D.promptFull;
      const block = `【我的條件（已回答，請不要重問）】\n${conditionsBlock()}\n`;
      return D.promptFull.replace('【搜尋範圍】', block + '\n【搜尋範圍】')
        .replace('現在，請從第一步開始，先問我問題。', '我已回答上面的條件。請只補問仍會影響資格、費用、時間、地點的問題（沒有就直接開始），然後開始搜尋。');
    }
    function refresh() {
      const p = profile(); const code = codeString(); const d = describe(p);
      const hasAny = code || p.text || p.topics.length || p.area || p.role;
      $('[data-code]').innerHTML = hasAny ? `${code ? esc(code) + '<br>' : ''}<span class="code-sub">${d.map(esc).join('｜')}</span>` : '<span class="code-empty">還沒填。可以直接按「開始找課」，先看全部官方快照。</span>';
      $('[data-rt-pre]').textContent = myPrompt();
      $('[data-sched-pre]').textContent = D.schedulePrompt(freq, hasAny ? conditionsBlock() : '');
      store.set('aeea-radar-answers', JSON.stringify({ answers, self: $('#selfpay').checked, extra: $('#extra').value }));
    }
    $$('.opt[data-q]', rt).forEach(b => b.addEventListener('click', () => {
      const q = Q.find(x => x.n === +b.dataset.q); const k = b.dataset.k;
      let cur = answers[q.n] || [];
      if (q.multi) cur = cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k].sort();
      else cur = cur[0] === k ? [] : [k];
      answers[q.n] = cur;
      $$(`.opt[data-q="${q.n}"]`, rt).forEach(o => o.setAttribute('aria-pressed', cur.includes(o.dataset.k)));
      refresh();
    }));
    $$('[data-eg]', rt).forEach(b => b.addEventListener('click', () => { $('#extra').value = b.dataset.eg; refresh(); }));
    $$('[data-freq]', rt).forEach(b => b.addEventListener('click', () => {
      freq = b.dataset.freq; $$('[data-freq]', rt).forEach(o => o.setAttribute('aria-pressed', o === b)); refresh();
    }));
    $$('[data-rtab]', rt).forEach(tab => tab.addEventListener('click', () => {
      const k = tab.dataset.rtab;
      $$('[data-rtab]', rt).forEach(t => { t.classList.toggle('on', t === tab); t.setAttribute('aria-selected', t === tab); });
      $$('[data-pane]', rt).forEach(pn => { pn.hidden = pn.dataset.pane !== k; });
    }));
    $('#selfpay').addEventListener('change', refresh);
    $('#extra').addEventListener('input', refresh);
    $('[data-copy-mine]').addEventListener('click', e => copyText(myPrompt(), e.currentTarget));
    $('[data-copy-mobile]').addEventListener('click', e => copyText(D.promptMobile, e.currentTarget));
    $('[data-copy-sched]').addEventListener('click', e => copyText($('[data-sched-pre]').textContent, e.currentTarget));
    $('[data-copy-cal]').addEventListener('click', e => copyText(D.calendarPrompt, e.currentTarget));
    $('[data-reset]').addEventListener('click', () => {
      Object.keys(answers).forEach(k => delete answers[k]); $$('.opt[data-q]', rt).forEach(o => o.setAttribute('aria-pressed', 'false'));
      $('#selfpay').checked = false; $('#extra').value = ''; refresh();
    });
    try {
      const saved = JSON.parse(store.get('aeea-radar-answers') || 'null');
      if (saved) {
        Object.assign(answers, saved.answers || {}); $('#selfpay').checked = !!saved.self; $('#extra').value = saved.extra || '';
        Object.entries(answers).forEach(([n, ks]) => (ks || []).forEach(k => { const o = document.getElementById(`opt-${n}${k}`); if (o) o.setAttribute('aria-pressed', 'true'); }));
        if (Object.values(answers).some(v => v && v.length)) $('[data-more]').open = true;
      }
    } catch (e) { /* ignore */ }
    refresh();

    /* ---------- Claude sample (optional) ---------- */
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('sample').then(s => {
        if (!s) return;
        sample = s; $('[data-ai-wrap]').hidden = false; $('[data-mode]').textContent = 'AI 模式可用';
      }).catch(() => {});
    }

    return {
      runWith(text) {
        if (typeof text === 'string' && text.trim()) { $('#extra').value = text.trim(); refresh(); }
        $$('[data-rtab]', rt)[0].click();
        run();
      },
      setText(text) { $('#extra').value = text; refresh(); }
    };
  }
  return { mount };
})();
