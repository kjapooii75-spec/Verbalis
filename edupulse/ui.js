// ══════════════════════════════════════════
// ui.js — EduPulse UI 렌더링 모듈
// ══════════════════════════════════════════

import { NEWS_DATA, TREND_DATA, HEATMAP_DATA, BAR_DATA, STAT_DATA } from './data.js';
import { openAIPanel } from './ai.js';

// ── 날짜 초기화 ──
export function initDateTime() {
  const now = new Date();
  document.getElementById('dateText').textContent =
    now.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'short' });
  document.getElementById('updateTime').textContent =
    now.toLocaleTimeString('ko-KR', { hour:'2-digit', minute:'2-digit' });
}

// ── 숫자 카운트 애니메이션 ──
function animateCount(id, target, decimals = 0) {
  const el = document.getElementById(id);
  let start = 0;
  const duration = 1200;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = ease * target;
    el.textContent = decimals ? val.toFixed(decimals) : Math.round(val);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initStats() {
  setTimeout(() => {
    STAT_DATA.forEach((s, i) => {
      animateCount(s.id, s.target, s.decimals);
      const changeEl = document.getElementById('sc' + (i + 1));
      if (changeEl) {
        changeEl.textContent = s.change;
        changeEl.className = 'stat-change ' + s.dir;
      }
    });
  }, 300);
}

// ── 뉴스 리스트 렌더 ──
export function renderNews(filter = 'all') {
  const list = document.getElementById('newsList');
  const filtered = filter === 'all' ? NEWS_DATA : NEWS_DATA.filter(n => n.tag === filter);
  list.innerHTML = filtered.map((n, i) => `
    <div class="news-item" data-title="${n.title}">
      <div class="news-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="news-body">
        <span class="news-tag tag-${n.tag}">${n.label}</span>
        <div class="news-title">${n.title}</div>
        <div class="news-meta">
          <span class="news-time">${n.time}</span>
          <span class="news-sep">·</span>
          <span class="news-source">${n.source}</span>
        </div>
      </div>
      <div class="news-arrow">→</div>
    </div>
  `).join('');

  // 뉴스 클릭 → AI 패널 열기
  list.querySelectorAll('.news-item').forEach(item => {
    item.addEventListener('click', () => openAIPanel(item.dataset.title));
  });
}

// ── 탭 전환 ──
export function setTab(el, filter) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderNews(filter);
}

// ── 트렌드 바 ──
export function initTrends() {
  document.getElementById('trendList').innerHTML = TREND_DATA.map((t, i) => `
    <div class="trend-row">
      <div class="trend-name">${t.name}</div>
      <div class="trend-bar-bg">
        <div class="trend-bar-fill" id="tb${i}" style="background:${t.color}"></div>
      </div>
      <div class="trend-pct">${t.pct}%</div>
    </div>
  `).join('');

  setTimeout(() => {
    TREND_DATA.forEach((t, i) => {
      document.getElementById('tb' + i).style.width = t.pct + '%';
    });
  }, 600);
}

// ── 히트맵 ──
export function initHeatmap() {
  document.getElementById('heatmapGrid').innerHTML =
    HEATMAP_DATA.map(v => `<div class="hm-cell hm-${v}" title="이슈 ${v * 3}건"></div>`).join('');
}

// ── 막대 차트 ──
export function initBarChart() {
  const maxVal = Math.max(...BAR_DATA.map(d => d.val));
  const svg = document.getElementById('barChart');
  const chartH = 80, chartY = 10, barW = 40, gap = 24, startX = 20;
  let html = '';

  BAR_DATA.forEach((d, i) => {
    const x = startX + i * (barW + gap);
    const h = (d.val / maxVal) * chartH;
    const y = chartY + chartH - h;
    const isLast = i === BAR_DATA.length - 1;
    html += `
      <rect x="${x}" y="${chartY + chartH}" width="${barW}" height="0" rx="4"
        fill="${isLast ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}" id="bar${i}"/>
      <text x="${x + barW / 2}" y="${chartY + chartH + 14}" text-anchor="middle"
        font-size="9" fill="rgba(255,255,255,0.3)" font-family="Noto Sans KR">${d.label}</text>
      <text x="${x + barW / 2}" y="${y - 4}" text-anchor="middle"
        font-size="9" fill="${isLast ? 'var(--accent)' : 'rgba(255,255,255,0.4)'}"
        font-family="Syne" font-weight="700">${d.val}</text>
    `;
  });
  svg.innerHTML = html;

  setTimeout(() => {
    BAR_DATA.forEach((d, i) => {
      const bar = document.getElementById('bar' + i);
      const h = (d.val / maxVal) * chartH;
      const y = chartY + chartH - h;
      bar.setAttribute('y', y);
      bar.setAttribute('height', h);
      bar.style.transition = `height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`;
    });
  }, 500);
}

// ── 키워드 클릭 ──
export function initKeywords() {
  document.querySelectorAll('.kw').forEach(kw => {
    kw.addEventListener('click', () => {
      openAIPanel(kw.textContent.trim() + ' 교육 이슈');
    });
  });
}

// ── 퀵 질문 버튼 ──
export function initQuickAsk() {
  document.querySelectorAll('.qa-btn[data-query]').forEach(btn => {
    btn.addEventListener('click', () => openAIPanel(btn.dataset.query));
  });
}
