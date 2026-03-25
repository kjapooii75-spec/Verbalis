// ══════════════════════════════════════════
// data.js — EduPulse 정적 데이터 모듈
// ══════════════════════════════════════════

export const NEWS_DATA = [
  { tag:'policy', label:'정책', title:'AI 디지털교과서 2학기 전면 도입 — 현장 교사 찬반 논란 고조', time:'32분 전', source:'교육부' },
  { tag:'issue',  label:'이슈', title:'학령인구 급감 — 지방 소규모 학교 통폐합 2026년 최대치', time:'1시간 전', source:'한국교육개발원' },
  { tag:'policy', label:'정책', title:'교원 양성 체계 개편안 입법예고 — 사범대 정원 조정 본격화', time:'2시간 전', source:'교육부' },
  { tag:'tech',   label:'EdTech', title:'국내 EdTech 스타트업 1분기 투자 유치 전년 대비 40% 급증', time:'3시간 전', source:'스타트업얼라이언스' },
  { tag:'data',   label:'데이터', title:'2028 수능 개편 공청회 — 통합사회·과학 분리 논의 재점화', time:'4시간 전', source:'한국교육과정평가원' },
  { tag:'global', label:'글로벌', title:'EU, 학교 AI 사용 가이드라인 확정 — 한국 정책 벤치마크 주목', time:'5시간 전', source:'연합뉴스' },
  { tag:'issue',  label:'이슈', title:'기초학력 미달 학생 비율 3년 연속 증가 — 코로나 후 회복 지연', time:'6시간 전', source:'교육부' },
  { tag:'tech',   label:'EdTech', title:'AI 맞춤형 학습 플랫폼, 서울시 공립학교 전면 도입 MOU 체결', time:'8시간 전', source:'서울시교육청' },
];

export const TREND_DATA = [
  { name: 'AI·디지털교육', pct: 92, color: 'var(--accent)' },
  { name: '입시·수능',     pct: 78, color: 'var(--accent2)' },
  { name: '학령인구 감소', pct: 71, color: 'var(--accent3)' },
  { name: '교원 정책',     pct: 55, color: 'var(--accent4)' },
  { name: '사교육·학원',  pct: 48, color: 'var(--yellow)' },
  { name: '기초학력',      pct: 39, color: '#aaa' },
];

export const HEATMAP_DATA = [
  0,0,1,2,1,3,2,
  1,2,3,4,2,1,0,
  2,3,2,1,3,2,1,
  3,4,3,2,1,0,0,
  0,2,3,4,
];

export const BAR_DATA = [
  { label:'2/24', val: 142 },
  { label:'3/3',  val: 189 },
  { label:'3/10', val: 167 },
  { label:'3/17', val: 221 },
  { label:'3/24', val: 247 },
];

export const STAT_DATA = [
  { id:'s1', target: 247, decimals: 0, change: '▲ 12% 어제 대비', dir: 'up' },
  { id:'s2', target: 18,  decimals: 0, change: '▲ 3건 신규',      dir: 'up' },
  { id:'s3', target: 64,  decimals: 0, change: '▼ 5% 이번 주',    dir: 'down' },
  { id:'s4', target: 8.4, decimals: 1, change: '▲ 0.6 상승',      dir: 'up' },
];
