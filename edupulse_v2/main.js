// ══════════════════════════════════════════
// main.js — EduPulse 진입점
// ══════════════════════════════════════════

import { initDateTime, renderNews, setTab, initTrends, initHeatmap, initBarChart, initKeywords, initQuickAsk, initPersonaFilter } from './ui.js';
import { closeAIPanel, openAIPanel } from './ai.js';

window.setTab       = setTab;
window.closeAIPanel = closeAIPanel;
window.openAIPanel  = openAIPanel;

initDateTime();
initPersonaFilter();
renderNews();
initTrends();
initHeatmap();
initBarChart();
initKeywords();
initQuickAsk();

document.getElementById('aiOverlay').addEventListener('click', closeAIPanel);
