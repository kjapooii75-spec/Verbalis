// ══════════════════════════════════════════
// ai.js — EduPulse Claude API 연동 모듈
// ══════════════════════════════════════════

const panel   = () => document.getElementById('aiPanel');
const overlay = () => document.getElementById('aiOverlay');
const content = () => document.getElementById('aiContent');
const topicEl = () => document.getElementById('aiTopicTitle');

// ── 패널 열기 ──
export function openAIPanel(topic) {
  topicEl().textContent = topic;
  panel().classList.add('open');
  overlay().classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchAnalysis(topic);
}

// ── 패널 닫기 ──
export function closeAIPanel() {
  panel().classList.remove('open');
  overlay().classList.remove('open');
  document.body.style.overflow = '';
}

// ── Claude API 호출 ──
async function fetchAnalysis(topic) {
  content().innerHTML = `
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      <div class="ai-loading-text">AI가 분석 중입니다…</div>
    </div>
  `;

  const prompt = `
당신은 한국 교육 정책 전문 분석가입니다.
다음 교육 이슈를 분석하고 아래 JSON 형식으로만 응답하세요. 마크다운이나 코드블록 없이 순수 JSON만 반환하세요.

이슈: "${topic}"

{
  "summary": "2~3문장 핵심 요약",
  "points": ["주요 쟁점 1", "주요 쟁점 2", "주요 쟁점 3"],
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4"],
  "sentiment": {
    "positive": 40,
    "negative": 35,
    "neutral": 25,
    "label": "혼재"
  },
  "outlook": "향후 전망 1~2문장"
}
`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    const raw  = data.content.map(b => b.text || '').join('');
    const json = JSON.parse(raw.replace(/```json|```/g, '').trim());
    renderAnalysis(json);
  } catch (err) {
    content().innerHTML = `
      <div class="ai-error">
        분석 중 오류가 발생했습니다.<br>
        <small style="opacity:.6;margin-top:6px;display:block">${err.message}</small>
      </div>
    `;
  }
}

// ── 분석 결과 렌더 ──
function renderAnalysis(d) {
  const posW = d.sentiment.positive;
  const negW = d.sentiment.negative;

  content().innerHTML = `
    <div class="ai-section">
      <div class="ai-section-label">요약</div>
      <div class="ai-text">${d.summary}</div>
    </div>

    <div class="ai-section">
      <div class="ai-section-label">주요 쟁점</div>
      <div class="ai-points">
        ${d.points.map(p => `<div class="ai-point">${p}</div>`).join('')}
      </div>
    </div>

    <div class="ai-section">
      <div class="ai-section-label">키워드</div>
      <div class="ai-chips">
        ${d.keywords.map(k => `<span class="ai-chip">${k}</span>`).join('')}
      </div>
    </div>

    <div class="ai-section">
      <div class="ai-section-label">여론 온도</div>
      <div class="ai-sentiment">
        <span style="font-size:11px;color:var(--accent);width:32px">긍정</span>
        <div class="ai-sentiment-bar-bg">
          <div class="ai-sentiment-bar" id="sentPos"
            style="width:0%;background:var(--accent)"></div>
        </div>
        <span class="ai-sentiment-label">${posW}%</span>
      </div>
      <div class="ai-sentiment" style="margin-top:6px">
        <span style="font-size:11px;color:var(--accent3);width:32px">부정</span>
        <div class="ai-sentiment-bar-bg">
          <div class="ai-sentiment-bar" id="sentNeg"
            style="width:0%;background:var(--accent3)"></div>
        </div>
        <span class="ai-sentiment-label">${negW}%</span>
      </div>
    </div>

    <div class="ai-section">
      <div class="ai-section-label">전망</div>
      <div class="ai-text">${d.outlook}</div>
    </div>
  `;

  // 애니메이션
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('sentPos').style.width = posW + '%';
      document.getElementById('sentNeg').style.width = negW + '%';
    }, 100);
  });
}
