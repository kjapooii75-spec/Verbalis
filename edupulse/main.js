// ══════════════════════════════════════════
// main.js — EduPulse 진입점
// ══════════════════════════════════════════

import { initDateTime, initStats, renderNews, setTab, initTrends, initHeatmap, initBarChart, initKeywords, initQuickAsk } from './ui.js';
import { closeAIPanel } from './ai.js';

// 탭·패널 닫기를 전역에 노출 (HTML onclick 속성용)
window.setTab      = setTab;
window.closeAIPanel = closeAIPanel;

// ── 초기화 ──
initDateTime();
initStats();
renderNews();
initTrends();
initHeatmap();
initBarChart();
initKeywords();
initQuickAsk();

// 오버레이 클릭 → 패널 닫기
document.getElementById('aiOverlay').addEventListener('click', closeAIPanel);
