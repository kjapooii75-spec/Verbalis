// ══════════════════════════════════════════
// ui.js — EduPulse 의사결정 지원 UI
// ══════════════════════════════════════════

import { NEWS_DATA, TREND_DATA, HEATMAP_DATA, BAR_DATA } from './data.js';
import { openAIPanel } from './ai.js';

// ── 현재 필터 상태 ──
let currentFilter = { tab: 'all', grade: '', track: '', admission: '' };

// ── 날짜 초기화 ──
export function initDateTime() {
  const now = new Date();
  document.getElementById('dateText').textContent =
    now.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'short' });
  document.getElementById('updateTime').textContent =
    now.toLocaleTimeString('ko-KR', { hour:'2-digit', minute:'2-digit' });
}

// ── 개인화 필터 렌더 ──
export function initPersonaFilter() {
  const container = document.getElementById('personaFilter');
  container.innerHTML = `
    <div class="filter-label">내 상황 설정하면 맞춤 정보만 보여줄게요</div>
    <div class="filter-groups">
      <div class="filter-group">
        <div class="filter-group-label">학년</div>
        <div class="filter-chips" id="gradeChips">
          <button class="fchip" data-type="grade" data-val="grade3">고3</button>
          <button class="fchip" data-type="grade" data-val="grade2">고2</button>
          <button class="fchip" data-type="grade" data-val="grade1">고1</button>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-group-label">계열</div>
        <div class="filter-chips" id="trackChips">
          <button class="fchip" data-type="track" data-val="liberal">문과</button>
          <button class="fchip" data-type="track" data-val="science">이과</button>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-group-label">전형</div>
        <div class="filter-chips" id="admissionChips">
          <button class="fchip" data-type="admission" data-val="sutime">수시</button>
          <button class="fchip" data-type="admission" data-val="jeongsi">정시</button>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll('.fchip').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const val  = btn.dataset.val;
      // 같은 그룹 내 토글
      container.querySelectorAll(`.fchip[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
      if (currentFilter[type] === val) {
        currentFilter[type] = '';
      } else {
        btn.classList.add('active');
        currentFilter[type] = val;
      }
      renderNews();
    });
  });
}

// ── 중요도 UI 생성 ──
function renderImportance(score) {
  const colors = { 5: '#ff4444', 4: '#ff7744', 3: '#f5c842', 2: '#8a8f99', 1: '#555c6b' };
  const labels = { 5: '입시 직접', 4: '주요', 3: '참고', 2: '낮음', 1: '무관' };
  const color  = colors[score] || '#555c6b';
  const label  = labels[score] || '';
  const dots   = [1,2,3,4,5].map(i =>
    `<span class="imp-dot" style="background:${i <= score ? color : 'rgba(255,255,255,0.08)'}"></span>`
  ).join('');
  return `<div class="importance-badge" style="color:${color}">
    <div class="imp-dots">${dots}</div>
    <span class="imp-label">${label}</span>
  </div>`;
}

// ── 학생 영향 배지 ──
function renderImpactRow(impact, selectedGrade) {
  const grades = [
    { key: 'grade3', label: '고3' },
    { key: 'grade2', label: '고2' },
    { key: 'grade1', label: '고1' },
  ];
  return grades.map(g => {
    const isSelected = selectedGrade === g.key;
    return `<div class="impact-row${isSelected ? ' impact-selected' : ''}">
      <span class="impact-grade">${g.label}</span>
      <span class="impact-desc">${impact[g.key]}</span>
    </div>`;
  }).join('');
}

// ── 뉴스 필터링 로직 ──
function filterNews() {
  let items = [...NEWS_DATA];

  // 탭 필터
  if (currentFilter.tab !== 'all') {
    items = items.filter(n => n.tag === currentFilter.tab);
  }

  // 학년 필터: 선택된 학년에서 "영향 없음·없음·낮음"이 아닌 것 우선
  if (currentFilter.grade) {
    const grade = currentFilter.grade;
    items.sort((a, b) => {
      const aText = a.impact[grade] || '';
      const bText = b.impact[grade] || '';
      const isLow = t => t.includes('없음') || t.includes('낮음') || t.includes('무관') || t.includes('해당 없음');
      return isLow(aText) - isLow(bText);
    });
  }

  // 중요도 내림차순 (학년 필터 없을 때)
  if (!currentFilter.grade) {
    items.sort((a, b) => b.importance - a.importance);
  }

  return items;
}

// ── 뉴스 카드 렌더 ──
export function renderNews(filter) {
  if (filter !== undefined) currentFilter.tab = filter;

  const list = document.getElementById('newsList');
  const items = filterNews();
  const selectedGrade = currentFilter.grade;

  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state">해당 조건의 이슈가 없습니다</div>`;
    return;
  }

  list.innerHTML = items.map((n) => `
    <div class="news-card imp-${n.importance}" data-title="${n.title}">
      <div class="news-card-top">
        <div class="news-card-meta">
          <span class="news-tag tag-${n.tag}">${n.label}</span>
          <span class="news-time">${n.time}</span>
          <span class="news-sep">·</span>
          <span class="news-source">${n.source}</span>
        </div>
        ${renderImportance(n.importance)}
      </div>

      <div class="news-summary">${n.summary}</div>

      <div class="news-points">
        ${n.points.map(p => `<div class="news-point">${p}</div>`).join('')}
      </div>

      <div class="news-impact-block">
        <div class="news-impact-title">학생 영향</div>
        <div class="news-impact-rows">
          ${renderImpactRow(n.impact, selectedGrade)}
        </div>
      </div>

      <div class="news-action">
        <span class="action-icon">⚡</span>
        <span class="action-text">${n.action}</span>
        <button class="action-ai-btn" data-title="${n.title}">AI 분석 →</button>
      </div>
    </div>
  `).join('');

  // 클릭 이벤트
  list.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('action-ai-btn')) return;
      openAIPanel(card.dataset.title);
    });
  });
  list.querySelectorAll('.action-ai-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openAIPanel(btn.dataset.title);
    });
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
      openAIPanel(kw.textContent.trim() + ' 입시 영향 분석');
    });
  });
}

// ── 퀵 질문 버튼 ──
export function initQuickAsk() {
  document.querySelectorAll('.qa-btn[data-query]').forEach(btn => {
    btn.addEventListener('click', () => openAIPanel(btn.dataset.query));
  });
}
