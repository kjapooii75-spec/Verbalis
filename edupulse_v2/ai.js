// ══════════════════════════════════════════
// ai.js — EduPulse 학생 맞춤 AI 분석
// ══════════════════════════════════════════

const panel   = () => document.getElementById('aiPanel');
const overlay = () => document.getElementById('aiOverlay');
const content = () => document.getElementById('aiContent');
const topicEl = () => document.getElementById('aiTopicTitle');

export function openAIPanel(topic) {
  topicEl().textContent = topic;
  panel().classList.add('open');
  overlay().classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchAnalysis(topic);
}

export function closeAIPanel() {
  panel().classList.remove('open');
  overlay().classList.remove('open');
  document.body.style.overflow = '';
}

async function fetchAnalysis(topic) {
  content().innerHTML = `
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      <div class="ai-loading-text">입시 영향 분석 중…</div>
    </div>
  `;

  const prompt = `
당신은 한국 고등학생을 위한 입시 전략 전문가입니다.
다음 교육 이슈를 고등학생 입장에서 분석하고 아래 JSON 형식으로만 응답하세요. 마크다운이나 코드블록 없이 순수 JSON만 반환하세요.

이슈: "${topic}"

{
  "oneline": "10자 이내 핵심 한 줄 (예: 고1 선택과목 전략 재검토 필요)",
  "summary": "고등학생 눈높이로 2~3문장 요약. 어렵지 않게.",
  "impact_grade3": "고3에게 미치는 실질적 영향 한 줄",
  "impact_grade2": "고2에게 미치는 실질적 영향 한 줄",
  "impact_grade1": "고1에게 미치는 실질적 영향 한 줄",
  "action": "지금 당장 해야 할 단 하나의 행동 (구체적으로)",
  "importance": 5,
  "points": ["핵심 사실 1", "핵심 사실 2", "핵심 사실 3"],
  "outlook": "6개월 이내 전망 한 줄"
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

function renderAnalysis(d) {
  const impColors = { 5:'#ff4444', 4:'#ff7744', 3:'#f5c842', 2:'#8a8f99', 1:'#555c6b' };
  const impLabels = { 5:'입시 직접 영향', 4:'주요 이슈', 3:'참고 수준', 2:'낮음', 1:'무관' };
  const impColor  = impColors[d.importance] || '#8a8f99';
  const impLabel  = impLabels[d.importance] || '';

  content().innerHTML = `
    <div class="ai-oneline">${d.oneline}</div>

    <div class="ai-imp-row" style="color:${impColor}">
      <div class="imp-dots-sm">
        ${[1,2,3,4,5].map(i => `<span class="imp-dot-sm" style="background:${i <= d.importance ? impColor : 'rgba(255,255,255,0.1)'}"></span>`).join('')}
      </div>
      <span>${impLabel}</span>
    </div>

    <div class="ai-section">
      <div class="ai-section-label">요약</div>
      <div class="ai-text">${d.summary}</div>
    </div>

    <div class="ai-section">
      <div class="ai-section-label">학년별 영향</div>
      <div class="ai-impact-rows">
        <div class="ai-impact-row"><span class="ai-grade-badge g3">고3</span><span class="ai-impact-text">${d.impact_grade3}</span></div>
        <div class="ai-impact-row"><span class="ai-grade-badge g2">고2</span><span class="ai-impact-text">${d.impact_grade2}</span></div>
        <div class="ai-impact-row"><span class="ai-grade-badge g1">고1</span><span class="ai-impact-text">${d.impact_grade1}</span></div>
      </div>
    </div>

    <div class="ai-action-block">
      <div class="ai-action-label">⚡ 지금 할 행동</div>
      <div class="ai-action-text">${d.action}</div>
    </div>

    <div class="ai-section">
      <div class="ai-section-label">핵심 사실</div>
      <div class="ai-points">
        ${d.points.map(p => `<div class="ai-point">${p}</div>`).join('')}
      </div>
    </div>

    <div class="ai-section">
      <div class="ai-section-label">전망</div>
      <div class="ai-text">${d.outlook}</div>
    </div>
  `;
}
