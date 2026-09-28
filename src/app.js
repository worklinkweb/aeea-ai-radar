/* AEEA AI 學習雷達 — Web Presentation runtime (vanilla JS) */
(function () {
  'use strict';
  const D = window.DECK;
  const SL = D.slides;
  const P = D.policySources;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = n => String(n).padStart(2, '0');
  const TOTAL = SL.length;
  const CHANNEL = 'aeea-radar-deck';
  let bc = null;
  try { bc = D.STUDENT ? null : new BroadcastChannel(CHANNEL); } catch (e) { bc = null; }

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- helpers ---------- */
  function toast(msg) {
    let t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 1800);
  }
  function copyText(text, btn) {
    const ok = () => { toast('已複製，可以貼到 ChatGPT 或 Claude'); if (btn) { const o = btn.textContent; btn.classList.add('done'); btn.textContent = '已複製'; setTimeout(() => { btn.classList.remove('done'); btn.textContent = o; }, 1600); } };
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let done = false; try { done = document.execCommand('copy'); } catch (e) { done = false; }
      document.body.removeChild(ta);
      if (done) ok(); else toast('無法自動複製，請長按文字手動選取');
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }
  const partOf = id => D.parts.find(p => p.id === id);
  const startMinute = (() => { const a = []; let acc = 0; SL.forEach(s => { a.push(acc); acc += s.duration; }); return a; })();
  const fmt = sec => { const s = Math.max(0, Math.round(Math.abs(sec))); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };

  /* ---------- presenter route ---------- */
  if (location.hash === '#presenter' && !D.STUDENT) { renderPresenter(); return; }

  /* ================= AUDIENCE / SCROLL VIEW ================= */
  const state = { idx: 0, build: {}, presenting: false, fsEntered: false };
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>
    <header class="topbar">
      <div class="brand"><span class="brand-mark" aria-hidden="true"></span><span class="brand-t">AEEA × AI 學習雷達</span></div>
      <nav class="partnav" aria-label="章節">${D.parts.map(p => `<button type="button" data-part-go="${p.id}">${p.id === 'open' || p.id === 'end' ? p.label : `P${p.id} ${p.label}`}</button>`).join('')}<button type="button" data-part-go="radar">Prompt 工具</button></nav>
      <div class="tb-actions">
        <button type="button" class="tb-btn" data-open-sources>來源</button>
        ${D.STUDENT ? '' : '<button type="button" class="tb-btn" data-presenter>講者<span class="lbl-long">模式</span></button>'}
        <button type="button" class="tb-btn primary" data-present>▶ 簡報<span class="lbl-long">模式</span></button>
      </div>
      <div class="scrollbar-progress" aria-hidden="true"></div>
    </header>
    <main class="deck" id="deck">
      ${SL.map((s, i) => `
        <section class="slide" id="s-${s.id}" data-i="${i}" data-part="${s.part}" aria-label="${pad(i + 1)} ${s.title}">
          <div class="slide-inner ${s.buildStyle ? 'bs-' + s.buildStyle : ''}">${s.html()}<span class="slide-num">${pad(i + 1)} / ${TOTAL}</span></div>
        </section>`).join('')}
    </main>
    <section class="radar-tool" id="radar" aria-label="AI 學習雷達 Prompt Builder"></section>
    <footer class="site-foot"><div class="inner">
      <div class="foot-contact"><h3>聯繫資訊</h3><p>沃領客資訊｜教育訓練總監｜Lynn Lin</p><p><span>lynn.lin@worklink.app</span>　<span>0800-008-135</span></p></div>
      <h3>官方資料來源（Last verified ${D.VERIFIED_DATE}）</h3>
      <ul>${Object.values(P).filter((v, i, a) => a.findIndex(x => x.url === v.url) === i).map(v => `<li>${v.agency}｜${v.title}｜<a href="${v.url}" target="_blank" rel="noopener">${v.url}</a>${v.status !== 'VERIFIED' ? '（NEEDS VERIFICATION）' : ''}</li>`).join('')}</ul>
      <p class="tiny">操作：▶ 簡報模式後，← → 或空白鍵切換，Esc 離開，F 全螢幕。${D.STUDENT ? '' : '講者模式可在另一個分頁看備註與計時。'}</p>
    </div></footer>
    <div class="pres-ui">
      <div class="pres-line"><i></i></div>
      <div class="pres-count" aria-live="polite"></div>
      <div class="pres-ctrl">
        <button type="button" data-prev aria-label="上一頁">←</button>
        <button type="button" data-next aria-label="下一頁">→</button>
        <button type="button" data-fs>全螢幕</button>
        ${D.STUDENT ? '' : '<button type="button" data-presenter>講者</button>'}
        <button type="button" data-exit>Esc 離開</button>
      </div>
    </div>
    <div class="drawer-scrim"></div>
    <aside class="drawer" aria-label="資料來源" aria-hidden="true">
      <div class="drawer-h"><h3>資料來源</h3><button type="button" class="drawer-x" aria-label="關閉">×</button></div>
      <div class="drawer-body"></div>
    </aside>`;

  const slidesEl = $$('.slide');

  /* ---------- builds ---------- */
  function maxBuild(i) { return SL[i].builds || 0; }
  function applyBuild(i, n) {
    const el = slidesEl[i];
    state.build[i] = n;
    $$('[data-b]', el).forEach(b => b.classList.toggle('b-on', +b.dataset.b <= n));
    el.classList.toggle('building', n < maxBuild(i));
    onBuild(i, n);
  }
  function onBuild(i, n) {
    const s = SL[i];
    if (s.id === 'mission') updateMission(slidesEl[i]);
  }

  /* ---------- per-slide interactions ---------- */
  // De-identification
  $$('[data-deid-btn]').forEach(btn => btn.addEventListener('click', () => {
    const ba = btn.closest('[data-deid]'); ba.classList.remove('run'); void ba.offsetWidth; ba.classList.add('run');
  }));
  // Settings step cards
  $$('[data-step-click]').forEach(btn => btn.addEventListener('click', () => {
    const i = +btn.closest('.slide').dataset.i; const k = +btn.dataset.stepClick;
    applyBuild(i, k === 4 ? 5 : k); broadcast();
  }));
  // Mission control
  function updateMission(el) {
    const rows = $$('.mc-row', el);
    const on = rows.filter(r => r.classList.contains('b-on')).length;
    const pct = on * 20;
    const m = $('[data-mc-meter]', el); m.style.setProperty('--p', pct); $('[data-mc-pct]', el).textContent = pct + '%';
    const l = $('[data-mc-launch]', el); l.classList.toggle('ready', on === 5); l.innerHTML = on === 5 ? '任務就緒 ✓<br>可以交給 Agent' : '交代清楚後<br>才能出發';
  }
  $$('[data-mc]').forEach(row => row.addEventListener('click', () => {
    const slide = row.closest('.slide'); const i = +slide.dataset.i;
    row.classList.toggle('b-on');
    const count = $$('.mc-row.b-on', slide).length;
    state.build[i] = count; slide.classList.toggle('building', count < 5);
    updateMission(slide);
  }));
  // Workspace autoplay
  const ws = { timer: null, step: 0 };
  function wsSet(el, k) {
    ws.step = k;
    $$('[data-ws]', el).forEach(b => { const n = +b.dataset.ws; b.classList.toggle('on', n === k); b.classList.toggle('done', n < k); });
    $$('[data-hl]', el).forEach(h => h.classList.toggle('lit', +h.dataset.hl === k || (k === 9 && +h.dataset.hl === 2)));
  }
  function wsPlay(el) {
    clearInterval(ws.timer); let k = 0; wsSet(el, 0);
    ws.timer = setInterval(() => { k++; if (k > 9) { clearInterval(ws.timer); return; } wsSet(el, k); }, 1700);
  }
  $$('[data-ws]').forEach(b => b.addEventListener('click', () => { clearInterval(ws.timer); wsSet(b.closest('[data-workspace]'), +b.dataset.ws); }));
  // Workflow run
  const WF_LOG = [
    ['需求：AI Agent／生成式 AI｜在職｜平日晚間｜免費或政府補助', ''],
    ['搜尋 smelearning.sme.gov.tw、serv.gcis.nat.gov.tw/AOCAI、ida.gov.tw', ''],
    ['✓ 來源皆為 .gov.tw 官方網域', 'ok'],
    ['✓ 在職人員可參加 4 門｜✗ 限待業青年 1 門', ''],
    ['✗ 完全自費、無政府補助 1 門 → 預設排除', 'x'],
    ['✓ 10–11 月開課 3 門', 'ok'],
    ['✓ 線上或南部 3 門', 'ok'],
    ['? 1 門報名狀態查不到 → 標記「需人工確認」', ''],
    ['排除 3 門（資格、費用、已截止），保留 3 門', ''],
    ['輸出：最適合我 1｜可以考慮 2｜這次先排除 3（示意）', 'ok']
  ];
  $$('[data-wf-run]').forEach(btn => btn.addEventListener('click', () => {
    const el = btn.closest('[data-workflow]'); const log = $('[data-wf-log]', el); const steps = $$('.wf-s', el);
    clearInterval(el._t); log.innerHTML = ''; steps.forEach(s => s.classList.remove('run', 'ok'));
    let k = 0; btn.disabled = true; btn.textContent = '執行中…';
    const tick = () => {
      if (k > 0) steps[k - 1].classList.replace('run', 'ok');
      if (k >= steps.length) { clearInterval(el._t); btn.disabled = false; btn.textContent = '再執行一次'; return; }
      steps[k].classList.add('run');
      const p = document.createElement('p'); p.textContent = `[${pad(k + 1)}] ${WF_LOG[k][0]}`; if (WF_LOG[k][1]) p.className = WF_LOG[k][1];
      log.appendChild(p); log.scrollTop = log.scrollHeight; k++;
    };
    tick(); el._t = setInterval(tick, 650);
  }));
  // Prompt tabs
  const ptext = { full: D.promptFull, mobile: D.promptMobile };
  $$('[data-ptext]').forEach(pre => { pre.textContent = ptext.full; pre.dataset.cur = 'full'; });
  $$('[data-ptab]').forEach(tab => tab.addEventListener('click', () => {
    const root = tab.closest('.pr'); const k = tab.dataset.ptab;
    $$('[data-ptab]', root).forEach(t => { t.classList.toggle('on', t === tab); t.setAttribute('aria-selected', t === tab); });
    const pre = $('[data-ptext]', root); pre.textContent = ptext[k]; pre.dataset.cur = k; pre.scrollTop = 0;
  }));
  $$('[data-copy-tab]').forEach(btn => btn.addEventListener('click', () => {
    const pre = $('[data-ptext]', btn.closest('.pr')); copyText(ptext[pre.dataset.cur], btn);
  }));
  // Holiday card prompt slide
  $$('[data-card-pre]').forEach(pre => { pre.textContent = D.cardPrompt || ''; });
  $$('[data-copy-card]').forEach(b => b.addEventListener('click', () => copyText(D.cardPrompt || '', b)));
  // Schedule prompt slide
  $$('[data-sp]').forEach(sp => {
    const pre = $('[data-sp-pre]', sp); let f = 'weekly';
    const set = k => { f = k; pre.textContent = D.schedulePrompt(k, ''); $$('[data-sfreq]', sp).forEach(t => { t.classList.toggle('on', t.dataset.sfreq === k); t.setAttribute('aria-selected', t.dataset.sfreq === k); }); };
    $$('[data-sfreq]', sp).forEach(t => t.addEventListener('click', () => set(t.dataset.sfreq)));
    $('[data-sp-copy]', sp).addEventListener('click', e => copyText(pre.textContent, e.currentTarget));
    $('[data-sp-cal]', sp).addEventListener('click', e => copyText(D.calendarPrompt, e.currentTarget));
    set('weekly');
  });
  // QR
  if (D.QR_RUNTIME && /^https?:$/.test(location.protocol) && typeof window.qrcode === 'function') {
    try {
      const url = location.origin + location.pathname + '#radar';
      const qg = window.qrcode(0, 'M'); qg.addData(url); qg.make();
      D.QR_SVG = qg.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); D.RADAR_URL = url;
    } catch (e) { /* keep baked QR */ }
  }
  $$('[data-qr]').forEach(q => { q.innerHTML = D.QR_SVG || '<span class="qr-missing">QR Code 於發佈後產生</span>'; if (D.RADAR_URL) q.setAttribute('aria-label', 'QR Code：' + D.RADAR_URL); });
  $$('[data-qr-url]').forEach(u => { u.textContent = D.RADAR_URL || ''; });
  // Open radar tool
  $$('[data-open-radar]').forEach(b => b.addEventListener('click', openRadar));
  function openRadar() {
    if (state.presenting) document.body.classList.add('tool-open');
    else document.getElementById('radar').scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------- Radar tool (runner + prompt + schedule) ---------- */
  const radar = window.RadarTool.mount({ $, $$, copyText, toast, store });
  D.radarApi = radar;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-run-radar]'); if (!b) return;
    const inp = b.closest('[data-run-box]') && b.closest('[data-run-box]').querySelector('input, textarea');
    openRadar(); radar.runWith(inp ? inp.value : '');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-run-box] input')) { e.preventDefault(); e.target.closest('[data-run-box]').querySelector('[data-run-radar]').click(); }
  });
  $$('[data-close-tool]').forEach(b => b.addEventListener('click', () => document.body.classList.remove('tool-open')));

  /* ---------- Source drawer ---------- */
  const drawer = $('.drawer'), scrim = $('.drawer-scrim');
  function openSources(ids) {
    const list = ids && ids.length ? ids : Object.keys(P);
    $('.drawer-body').innerHTML = list.map(id => {
      const s = P[id];
      return `<article class="src-item">
        <div class="src-meta"><span class="badge ${s.status === 'VERIFIED' ? 'ok' : 'warn'}">${s.status}</span><span>Last verified ${s.verified}</span></div>
        <p class="agency">${s.agency}</p>
        <h4>${s.title}</h4>
        <a href="${s.url}" target="_blank" rel="noopener">${s.url}</a>
        ${s.urlAlt ? `<a href="${s.urlAlt}" target="_blank" rel="noopener">${s.urlAlt}</a>` : ''}
        <ul>${s.facts.map(f => `<li>${f}</li>`).join('')}</ul>
      </article>`;
    }).join('');
    drawer.classList.add('on'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden', 'false');
    $('.drawer-x').focus();
  }
  function closeSources() { drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-src]'); if (b) { openSources([b.dataset.src]); return; }
    if (e.target.closest('[data-open-sources]')) openSources(state.presenting ? SL[state.idx].source : null);
  });
  $('.drawer-x').addEventListener('click', closeSources);
  scrim.addEventListener('click', closeSources);

  /* ---------- Part nav + scroll tracking ---------- */
  function firstOfPart(pid) { return SL.findIndex(s => s.part === pid); }
  $$('[data-part-go]').forEach(b => b.addEventListener('click', () => {
    const pid = b.dataset.partGo;
    if (pid === 'radar') { document.getElementById('radar').scrollIntoView({ behavior: 'smooth' }); return; }
    const i = firstOfPart(pid);
    if (state.presenting) go(i, 0); else slidesEl[i].scrollIntoView({ behavior: 'smooth' });
  }));
  function markNav(i) {
    const pid = SL[i].part;
    $$('[data-part-go]').forEach(b => b.classList.toggle('on', b.dataset.partGo === pid));
  }
  const io = new IntersectionObserver(entries => {
    if (state.presenting) return;
    entries.forEach(en => {
      if (en.isIntersecting && en.intersectionRatio > 0.45) {
        const i = +en.target.dataset.i; state.idx = i; markNav(i); onEnter(i);
      }
    });
  }, { threshold: [0.45, 0.6] });
  slidesEl.forEach(el => io.observe(el));
  const bar = $('.scrollbar-progress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  let lastEntered = -1;
  function onEnter(i) {
    if (i === lastEntered) return; lastEntered = i;
    const s = SL[i];
    const wsEl = $('[data-workspace]', slidesEl[i]);
    if (wsEl) wsPlay(wsEl);
    else clearInterval(ws.timer);
  }

  /* ---------- Presentation mode ---------- */
  function renderPresState() {
    slidesEl.forEach((el, i) => el.classList.toggle('current', i === state.idx));
    $('.pres-count').textContent = `${pad(state.idx + 1)} / ${TOTAL}`;
    $('.pres-line i').style.width = ((state.idx + 1) / TOTAL * 100) + '%';
    markNav(state.idx);
  }
  function go(i, build) {
    i = Math.max(0, Math.min(TOTAL - 1, i));
    state.idx = i;
    applyBuild(i, build === 'max' ? maxBuild(i) : (build || 0));
    renderPresState(); onEnter(i); broadcast();
  }
  function next() {
    const i = state.idx, b = state.build[i] || 0;
    if (b < maxBuild(i)) { applyBuild(i, b + 1); broadcast(); return; }
    if (i < TOTAL - 1) go(i + 1, 0);
  }
  function prev() {
    const i = state.idx;
    if (i > 0) go(i - 1, 'max');
  }
  function enterPresent(fromIdx) {
    state.presenting = true;
    document.body.classList.add('presenting');
    const start = typeof fromIdx === 'number' ? fromIdx : state.idx;
    go(start, 0);
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().then(() => { state.fsEntered = true; }).catch(() => { state.fsEntered = false; });
  }
  function exitPresent() {
    state.presenting = false;
    document.body.classList.remove('presenting', 'tool-open');
    slidesEl.forEach((el, i) => { el.classList.remove('current'); applyBuild(i, maxBuild(i)); });
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    state.fsEntered = false;
    slidesEl[state.idx].scrollIntoView({ behavior: 'auto' });
    broadcast();
  }
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().then(() => { state.fsEntered = true; }).catch(() => toast('此環境不支援全螢幕，可使用瀏覽器全螢幕'));
  }
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && state.presenting && state.fsEntered) { state.fsEntered = false; exitPresent(); }
  });
  $$('[data-present]').forEach(b => b.addEventListener('click', () => enterPresent()));
  $$('[data-exit]').forEach(b => b.addEventListener('click', exitPresent));
  $$('[data-next]').forEach(b => b.addEventListener('click', next));
  $$('[data-prev]').forEach(b => b.addEventListener('click', prev));
  $$('[data-fs]').forEach(b => b.addEventListener('click', toggleFs));

  document.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'input') return;
    if (e.key === 'Escape') {
      if (drawer.classList.contains('on')) { closeSources(); return; }
      if (document.body.classList.contains('tool-open')) { document.body.classList.remove('tool-open'); return; }
      if (state.presenting) { exitPresent(); return; }
    }
    if (!state.presenting) return;
    if (document.body.classList.contains('tool-open')) return;
    if (['ArrowRight', 'PageDown', ' ', 'Spacebar'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0, 0);
    else if (e.key === 'End') go(TOTAL - 1, 'max');
    else if (e.key === 'f' || e.key === 'F') toggleFs();
    else if ((e.key === 'p' || e.key === 'P') && !D.STUDENT) openPresenter();
  });
  // swipe
  let tx = null, ty = null;
  document.addEventListener('touchstart', e => { if (!state.presenting) return; tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!state.presenting || tx === null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { dx < 0 ? next() : prev(); }
    tx = ty = null;
  }, { passive: true });

  /* ---------- Presenter sync ---------- */
  function broadcast() {
    if (bc) bc.postMessage({ type: 'state', idx: state.idx, build: state.build[state.idx] || 0, presenting: state.presenting });
  }
  if (bc) bc.onmessage = ev => {
    const m = ev.data || {};
    if (m.type === 'hello') broadcast();
    if (m.type === 'cmd') {
      if (!state.presenting && m.action !== 'hello') enterPresent(state.idx);
      if (m.action === 'next') next();
      if (m.action === 'prev') prev();
      if (m.action === 'goto') go(m.idx, 0);
    }
  };
  function openPresenter() {
    let w = null;
    try { w = window.open(location.href.split('#')[0] + '#presenter', 'aeea-presenter', 'width=1280,height=800'); } catch (e) { w = null; }
    if (w) { toast('講者視窗已開啟'); return; }
    const box = document.createElement('div'); box.className = 'presenter-help';
    box.innerHTML = `<div class="box" role="dialog" aria-label="開啟講者模式">
      <h3>開啟講者模式</h3>
      <p>1. 在另一個瀏覽器分頁，開啟這份簡報的同一個網址，並在網址最後加上 <b>#presenter</b>。</p>
      <p>2. 講者分頁會顯示：目前頁、下一頁、剩餘時間、講者備註。兩個分頁會自動同步翻頁。</p>
      <p>3. 線上分享時，只分享「觀眾」這個分頁或視窗。觀眾畫面不會出現備註。</p>
      <div class="row-gap"><button type="button" class="copy-btn" data-help-copy>複製「#presenter」</button><button type="button" class="ghost-btn" data-help-close>知道了</button></div>
    </div>`;
    document.body.appendChild(box);
    $('[data-help-copy]', box).addEventListener('click', e => copyText('#presenter', e.currentTarget));
    $('[data-help-close]', box).addEventListener('click', () => box.remove());
    box.addEventListener('click', e => { if (e.target === box) box.remove(); });
  }
  $$('[data-presenter]').forEach(b => b.addEventListener('click', openPresenter));

  /* ---------- init ---------- */
  slidesEl.forEach((el, i) => applyBuild(i, maxBuild(i)));
  markNav(0);
  const h = location.hash.replace('#', '');
  if (h === 'radar') setTimeout(() => document.getElementById('radar').scrollIntoView(), 60);
  else if (h === 'present') enterPresent(0);
  else if (h && document.getElementById(h)) setTimeout(() => document.getElementById(h).scrollIntoView(), 60);

  /* ================= PRESENTER VIEW ================= */
  function renderPresenter() {
    document.title = '講者模式 · AEEA AI 學習雷達';
    const root = document.getElementById('app');
    const ps = { idx: 0, build: 0, running: false, elapsed: 0, t0: 0 };
    try { const s = JSON.parse(store.get('aeea-presenter-timer') || 'null'); if (s) { ps.elapsed = s.elapsed || 0; } } catch (e) { /* ignore */ }
    const totalMin = SL.reduce((a, s) => a + s.duration, 0);
    root.innerHTML = `
      <div class="ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>
      <div class="pv">
        <div class="pv-top">
          <div><b style="font-size:18px">講者模式</b> <span class="pv-plan">只在這個分頁看得到 · 共 ${TOTAL} 頁 · 規劃 ${totalMin} 分鐘</span></div>
          <div class="pv-timers">
            <div class="pv-t"><small>已進行</small><b data-el>0:00</b></div>
            <div class="pv-t"><small>剩餘（40 分）</small><b data-rem>40:00</b></div>
            <div class="pv-t"><small>本頁建議</small><b data-dur>0:00</b></div>
            <div class="pv-t" data-pace-box><small>進度</small><b data-pace>—</b></div>
          </div>
        </div>
        <div class="pv-cur"><span class="pv-label" data-cur-label>目前</span><div class="pv-frame" data-cur></div></div>
        <div class="pv-side">
          <div class="pv-next"><span class="pv-label" data-next-label>下一頁</span><div class="pv-frame" data-next-f></div></div>
          <div class="pv-notes"><h4>講者備註</h4><div data-notes></div></div>
        </div>
        <div class="pv-bottom">
          <button type="button" data-p-prev>← 上一頁</button>
          <button type="button" class="primary" data-p-next>下一步 →</button>
          <button type="button" data-p-timer>開始計時</button>
          <button type="button" data-p-reset>重設計時</button>
          <span class="pv-plan" data-sync>等待觀眾分頁連線…（在觀眾分頁按「▶ 簡報模式」）</span>
        </div>
      </div>`;
    const frame = (i) => {
      if (i < 0 || i >= TOTAL) return '<div style="display:grid;place-items:center;height:100%;color:#8A8D9A">（最後一頁）</div>';
      const s = SL[i];
      return `<div class="pv-scale"><div class="slide" data-part="${s.part}" style="height:900px;max-width:none"><div class="slide-inner">${s.html()}</div></div></div>`;
    };
    function fitFrames() { $$('.pv-frame').forEach(f => { const sc = f.querySelector('.pv-scale'); if (sc) sc.style.transform = `scale(${f.clientWidth / 1600})`; }); }
    window.addEventListener('resize', fitFrames);
    function draw() {
      const s = SL[ps.idx];
      $('[data-cur]').innerHTML = frame(ps.idx);
      $('[data-next-f]').innerHTML = frame(ps.idx + 1);
      $('[data-cur-label]').textContent = `目前 ${pad(ps.idx + 1)} / ${TOTAL} · ${partOf(s.part).label} · ${s.title}${s.builds ? ` · 動畫 ${ps.build}/${s.builds}` : ''}`;
      $('[data-next-label]').textContent = ps.idx + 1 < TOTAL ? `下一頁 · ${SL[ps.idx + 1].title}` : '下一頁 · 無';
      $('[data-notes]').textContent = s.speakerNote;
      $('[data-dur]').textContent = fmt(s.duration * 60);
      $$('[data-qr]', root).forEach(q => { q.innerHTML = D.QR_SVG || ''; });
      $$('[data-ptext]', root).forEach(p => { p.textContent = D.promptFull; });
      fitFrames();
      tickTimers();
    }
    function tickTimers() {
      const el = ps.elapsed + (ps.running ? (Date.now() - ps.t0) / 1000 : 0);
      $('[data-el]').textContent = fmt(el);
      const rem = 40 * 60 - el;
      $('[data-rem]').textContent = (rem < 0 ? '-' : '') + fmt(rem);
      const plan = startMinute[ps.idx] * 60; const diff = el - plan;
      const box = $('[data-pace-box]');
      box.classList.toggle('late', diff > 60); box.classList.toggle('ahead', diff < -60);
      $('[data-pace]').textContent = el === 0 ? '—' : (Math.abs(diff) < 60 ? '準時' : (diff > 0 ? '落後 ' : '超前 ') + fmt(diff));
    }
    setInterval(() => { tickTimers(); if (ps.running) store.set('aeea-presenter-timer', JSON.stringify({ elapsed: ps.elapsed + (Date.now() - ps.t0) / 1000 })); }, 500);
    const send = (action, extra) => { if (bc) bc.postMessage(Object.assign({ type: 'cmd', action }, extra || {})); };
    function localNext() { const s = SL[ps.idx]; if (ps.build < (s.builds || 0)) ps.build++; else if (ps.idx < TOTAL - 1) { ps.idx++; ps.build = 0; } draw(); }
    function localPrev() { if (ps.idx > 0) { ps.idx--; ps.build = SL[ps.idx].builds || 0; } draw(); }
    let connected = false;
    $('[data-p-next]').addEventListener('click', () => { if (connected) send('next'); else localNext(); });
    $('[data-p-prev]').addEventListener('click', () => { if (connected) send('prev'); else localPrev(); });
    $('[data-p-timer]').addEventListener('click', e => {
      if (ps.running) { ps.elapsed += (Date.now() - ps.t0) / 1000; ps.running = false; e.currentTarget.textContent = '繼續計時'; }
      else { ps.t0 = Date.now(); ps.running = true; e.currentTarget.textContent = '暫停計時'; }
    });
    $('[data-p-reset]').addEventListener('click', () => { ps.elapsed = 0; ps.t0 = Date.now(); store.set('aeea-presenter-timer', '{"elapsed":0}'); tickTimers(); });
    document.addEventListener('keydown', e => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); $('[data-p-next]').click(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); $('[data-p-prev]').click(); }
    });
    if (bc) {
      bc.onmessage = ev => {
        const m = ev.data || {};
        if (m.type === 'state') {
          connected = true; $('[data-sync]').textContent = m.presenting ? '已與觀眾分頁同步 ✓' : '已連線，觀眾分頁目前是捲動模式';
          const changed = m.idx !== ps.idx; ps.idx = m.idx; ps.build = m.build;
          if (changed) draw(); else $('[data-cur-label]').textContent = `目前 ${pad(ps.idx + 1)} / ${TOTAL} · ${partOf(SL[ps.idx].part).label} · ${SL[ps.idx].title}${SL[ps.idx].builds ? ` · 動畫 ${ps.build}/${SL[ps.idx].builds}` : ''}`;
        }
      };
      bc.postMessage({ type: 'hello' });
    } else {
      $('[data-sync]').textContent = '此瀏覽器不支援分頁同步，講者頁可獨立翻頁使用';
    }
    draw();
  }
})();
