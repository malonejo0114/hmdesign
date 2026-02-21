const svg = document.getElementById('bodygraph');
const detailPanel = document.getElementById('detailPanel');
const tabContent = document.getElementById('tabContent');
const appShell = document.getElementById('appShell');

let skinType = 'free';
let activeTab = 'chart';

const userData = {
  name: 'Jo Hanjin', type: '제너레이터', typeEn: 'Generator', strategy: '반응하기', authority: '천골 권위', profile: '3 / 6',
  definition: '스플릿 정의', signature: '만족', notSelfTheme: '좌절', incarnationCross: '마야의 직각 십자가', crossGates: '42/32 | 61/62'
};

const designGates = [61, 62, 44, 24, 53, 13, 9, 59, 37, 14];
const personalityGates = [42, 32, 28, 27, 46, 22, 7, 5, 60, 34];
const allActiveGates = [...new Set([...designGates, ...personalityGates])];
const activeCenters = ['HEAD', 'AJNA', 'SACRAL', 'ROOT'];

const skins = {
  free: {
    shellBg: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    centerActive: '#e94560', centerInactive: '#2d2d44', centerStroke: '#4a4a6a',
    design: '#e94560', personality: '#6f7488', both: '#ffb000', channelActive: '#e94560', channelInactive: 'rgba(74,74,106,.5)'
  },
  paid: {
    shellBg: 'linear-gradient(180deg, #0d1b2a 0%, #1b263b 50%, #0f1419 100%)',
    centerActive: '#00d4aa', centerInactive: '#1b263b', centerStroke: '#3a5d6e',
    design: '#ff6b6b', personality: '#7a859e', both: '#ffd166', channelActive: '#00d4aa', channelInactive: 'rgba(65, 90, 119, 0.5)'
  }
};

const centers = {
  HEAD: { x: 150, y: 70, shape: 'circle', label: '헤드' }, AJNA: { x: 150, y: 130, shape: 'triangle-down', label: '아즈나' },
  THROAT: { x: 150, y: 195, shape: 'square', label: '목' }, G: { x: 150, y: 270, shape: 'diamond', label: 'G' },
  EGO: { x: 95, y: 285, shape: 'triangle-small', label: '에고' }, SPLEEN: { x: 55, y: 365, shape: 'triangle-small', label: '비장' },
  EMO: { x: 245, y: 365, shape: 'triangle-small', label: '감정' }, SACRAL: { x: 150, y: 355, shape: 'square', label: '천골' },
  ROOT: { x: 150, y: 430, shape: 'square', label: '루트' }
};

const channels = [
  { from: 'HEAD', to: 'AJNA', gates: [61, 24] }, { from: 'HEAD', to: 'AJNA', gates: [64, 47], offsetX: -12 },
  { from: 'HEAD', to: 'AJNA', gates: [63, 4], offsetX: 12 }, { from: 'AJNA', to: 'THROAT', gates: [17, 62], offsetX: -15 },
  { from: 'AJNA', to: 'THROAT', gates: [43, 23] }, { from: 'AJNA', to: 'THROAT', gates: [11, 56], offsetX: 15 },
  { from: 'THROAT', to: 'G', gates: [31, 7], offsetX: -12 }, { from: 'THROAT', to: 'G', gates: [8, 1] },
  { from: 'THROAT', to: 'G', gates: [33, 13], offsetX: 12 }, { from: 'G', to: 'SACRAL', gates: [14, 2] },
  { from: 'G', to: 'SACRAL', gates: [29, 46], offsetX: 12 }, { from: 'SACRAL', to: 'ROOT', gates: [42, 53], offsetX: -12 },
  { from: 'SACRAL', to: 'ROOT', gates: [60, 3] }, { from: 'SACRAL', to: 'ROOT', gates: [52, 9], offsetX: 12 },
  { from: 'THROAT', to: 'SACRAL', gates: [34, 20], offsetX: -30 }, { from: 'G', to: 'EGO', gates: [25, 51] },
  { from: 'EGO', to: 'SPLEEN', gates: [26, 44] }, { from: 'SPLEEN', to: 'SACRAL', gates: [50, 27] },
  { from: 'SPLEEN', to: 'ROOT', gates: [32, 54] }, { from: 'EMO', to: 'SACRAL', gates: [6, 59] },
  { from: 'EMO', to: 'ROOT', gates: [41, 30] }
];

const gatePositions = [
  { gate: 64, x: 130, y: 52 }, { gate: 61, x: 150, y: 42 }, { gate: 63, x: 170, y: 52 },
  { gate: 47, x: 125, y: 110 }, { gate: 24, x: 150, y: 100 }, { gate: 4, x: 175, y: 110 },
  { gate: 17, x: 120, y: 150 }, { gate: 43, x: 150, y: 158 }, { gate: 11, x: 180, y: 150 },
  { gate: 62, x: 115, y: 180 }, { gate: 23, x: 135, y: 188 }, { gate: 56, x: 165, y: 188 },
  { gate: 35, x: 185, y: 180 }, { gate: 20, x: 115, y: 212 }, { gate: 16, x: 125, y: 200 },
  { gate: 12, x: 185, y: 200 }, { gate: 45, x: 115, y: 225 }, { gate: 21, x: 100, y: 238 },
  { gate: 31, x: 132, y: 230 }, { gate: 8, x: 150, y: 222 }, { gate: 33, x: 168, y: 230 },
  { gate: 7, x: 132, y: 250 }, { gate: 1, x: 150, y: 245 }, { gate: 13, x: 168, y: 250 },
  { gate: 25, x: 118, y: 270 }, { gate: 46, x: 182, y: 270 }, { gate: 2, x: 150, y: 298 },
  { gate: 15, x: 175, y: 285 }, { gate: 10, x: 125, y: 285 }, { gate: 51, x: 105, y: 268 },
  { gate: 26, x: 75, y: 298 }, { gate: 40, x: 92, y: 310 }, { gate: 48, x: 32, y: 348 },
  { gate: 57, x: 52, y: 342 }, { gate: 44, x: 75, y: 352 }, { gate: 50, x: 38, y: 382 },
  { gate: 32, x: 55, y: 395 }, { gate: 28, x: 75, y: 382 }, { gate: 18, x: 42, y: 410 },
  { gate: 36, x: 225, y: 348 }, { gate: 22, x: 248, y: 342 }, { gate: 37, x: 268, y: 352 },
  { gate: 6, x: 225, y: 382 }, { gate: 49, x: 248, y: 395 }, { gate: 55, x: 265, y: 382 },
  { gate: 30, x: 262, y: 410 }, { gate: 5, x: 122, y: 338 }, { gate: 14, x: 150, y: 328 },
  { gate: 29, x: 178, y: 338 }, { gate: 34, x: 115, y: 355 }, { gate: 27, x: 185, y: 355 },
  { gate: 59, x: 122, y: 378 }, { gate: 9, x: 150, y: 385 }, { gate: 3, x: 178, y: 378 },
  { gate: 42, x: 138, y: 398 }, { gate: 53, x: 128, y: 412 }, { gate: 60, x: 150, y: 405 },
  { gate: 52, x: 172, y: 412 }, { gate: 54, x: 122, y: 432 }, { gate: 38, x: 150, y: 458 },
  { gate: 58, x: 132, y: 452 }, { gate: 19, x: 168, y: 452 }, { gate: 39, x: 178, y: 432 },
  { gate: 41, x: 192, y: 448 }
];

const gateDescriptions = {
  61: '내면 진실의 게이트', 62: '세부사항의 게이트', 44: '경계의 게이트', 24: '귀환의 게이트', 53: '시작의 게이트', 13: '청취자의 게이트',
  9: '집중의 게이트', 59: '성의 게이트', 37: '가족의 게이트', 14: '권력 기술의 게이트', 42: '성장의 게이트', 32: '연속성의 게이트',
  28: '게임 플레이어의 게이트', 27: '양육의 게이트', 46: '육체의 게이트', 22: '열린 마음의 게이트', 7: '자아의 역할 게이트', 5: '기다림의 게이트',
  60: '수용의 게이트', 34: '힘의 게이트'
};
const centerDescriptions = {
  HEAD: '영감과 정신적 압박', AJNA: '개념화와 정신 처리', THROAT: '표현과 현실화', G: '정체성, 방향, 사랑',
  EGO: '의지력과 자아 가치', SPLEEN: '본능, 직관, 건강', EMO: '감정, 느낌, 욕망', SACRAL: '생명력과 작업 에너지', ROOT: '스트레스와 압박'
};

function gateColor(gate) {
  const s = skins[skinType];
  const inD = designGates.includes(gate);
  const inP = personalityGates.includes(gate);
  if (inD && inP) return s.both;
  if (inD) return s.design;
  if (inP) return s.personality;
  return 'rgba(255,255,255,0.2)';
}

function centerShape(name, c) {
  const s = skins[skinType];
  const fill = activeCenters.includes(name) ? s.centerActive : s.centerInactive;
  if (c.shape === 'circle') return `<circle class="center-shape" data-center="${name}" cx="${c.x}" cy="${c.y}" r="24" fill="${fill}" stroke="${s.centerStroke}" stroke-width="1.5" />`;
  if (c.shape === 'triangle-down') return `<polygon class="center-shape" data-center="${name}" points="${c.x - 26},${c.y - 16} ${c.x + 26},${c.y - 16} ${c.x},${c.y + 22}" fill="${fill}" stroke="${s.centerStroke}" stroke-width="1.5" />`;
  if (c.shape === 'triangle-small') return `<polygon class="center-shape" data-center="${name}" points="${c.x},${c.y - 14} ${c.x - 17},${c.y + 12} ${c.x + 17},${c.y + 12}" fill="${fill}" stroke="${s.centerStroke}" stroke-width="1.5" />`;
  if (c.shape === 'diamond') return `<polygon class="center-shape" data-center="${name}" points="${c.x},${c.y - 24} ${c.x + 28},${c.y} ${c.x},${c.y + 24} ${c.x - 28},${c.y}" fill="${fill}" stroke="${s.centerStroke}" stroke-width="1.5" />`;
  return `<rect class="center-shape" data-center="${name}" x="${c.x - 22}" y="${c.y - 17}" width="44" height="34" rx="3" fill="${fill}" stroke="${s.centerStroke}" stroke-width="1.5" />`;
}

function renderChart() {
  const s = skins[skinType];
  appShell.style.background = s.shellBg;
  const markup = [
    '<defs><filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>',
    '<g opacity="0.5"><circle cx="150" cy="70" r="42" fill="rgba(255,255,255,0.04)" stroke="#4a4a6a" stroke-width="1"/>',
    '<path d="M 130 108 Q 110 110 75 130 Q 50 150 45 185 Q 42 220 50 260 Q 58 310 65 360 L 75 400" fill="none" stroke="#3f4a74" stroke-width="1.5"/>',
    '<path d="M 170 108 Q 190 110 225 130 Q 250 150 255 185 Q 258 220 250 260 Q 242 310 235 360 L 225 400" fill="none" stroke="#3f4a74" stroke-width="1.5"/>',
    '<path d="M 45 185 Q 30 240 35 310 Q 40 370 55 420 Q 68 450 85 465" fill="none" stroke="#29325f" stroke-width="7" stroke-linecap="round" opacity="0.4"/>',
    '<path d="M 255 185 Q 270 240 265 310 Q 260 370 245 420 Q 232 450 215 465" fill="none" stroke="#29325f" stroke-width="7" stroke-linecap="round" opacity="0.4"/>',
    '<path d="M 95 125 L 80 140 Q 68 175 72 225 Q 76 285 80 340 Q 84 390 92 430 Q 105 465 130 480 Q 145 488 150 490 Q 155 488 170 480 Q 195 465 208 430 Q 216 390 220 340 Q 224 285 228 225 Q 232 175 220 140 L 205 125 Z" fill="rgba(255,255,255,0.03)" stroke="#4a4a6a" stroke-width="1"/></g>',
    ...channels.map((ch) => {
      const from = centers[ch.from];
      const to = centers[ch.to];
      const on = ch.gates.every((g) => allActiveGates.includes(g));
      const offsetX = ch.offsetX || 0;
      let x1 = from.x + offsetX, y1 = from.y + 18, x2 = to.x + offsetX, y2 = to.y - 18;
      if (['EGO', 'SPLEEN', 'EMO'].includes(ch.from) || ['EGO', 'SPLEEN', 'EMO'].includes(ch.to)) { x1 = from.x; x2 = to.x; }
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on ? s.channelActive : s.channelInactive}" stroke-width="${on ? 3 : 1.5}" stroke-linecap="round" ${on ? 'filter="url(#glow)"' : ''} />`;
    }),
    ...Object.entries(centers).flatMap(([name, center]) => [centerShape(name, center), `<text x="${center.x}" y="${center.y + 3}" fill="#fff" font-size="8" font-weight="600" text-anchor="middle">${center.label}</text>`]),
    ...gatePositions.map(({ gate, x, y }) => `<text class="gate" data-gate="${gate}" x="${x}" y="${y}" fill="${gateColor(gate)}" font-size="${allActiveGates.includes(gate) ? 9 : 7}" font-weight="${allActiveGates.includes(gate) ? '700' : '400'}" text-anchor="middle">${gate}</text>`)
  ].join('');
  svg.innerHTML = markup;

  svg.querySelectorAll('.gate').forEach((el) => el.addEventListener('click', () => {
    const gate = Number(el.dataset.gate);
    detailPanel.textContent = `${gate}번 게이트 · ${gateDescriptions[gate] || '설명 준비중'} · ${allActiveGates.includes(gate) ? '활성 게이트' : '비활성 게이트'}`;
  }));
  svg.querySelectorAll('.center-shape').forEach((el) => el.addEventListener('click', () => {
    const c = el.dataset.center;
    detailPanel.textContent = `${centers[c].label} 센터 · ${activeCenters.includes(c) ? '정의됨' : '오픈'} · ${centerDescriptions[c]}`;
  }));
}

function renderTab() {
  if (activeTab === 'chart') {
    tabContent.innerHTML = `<article class="info-card"><h4>기본 정보</h4><p>타입: ${userData.type} / 전략: ${userData.strategy} / 권위: ${userData.authority}</p><p>프로필: ${userData.profile} / 정의: ${userData.definition}</p></article>`;
  }
  if (activeTab === 'info') {
    tabContent.innerHTML = `<article class="info-card"><h4>전략 & 권위</h4><p>전략은 Type으로 결정되고, 의사결정은 Authority를 따릅니다.</p></article><article class="info-card"><h4>인카네이션 크로스</h4><p>${userData.incarnationCross} (${userData.crossGates})</p></article><article class="info-card"><h4>Range 모드</h4><p>출생시간 모름 사용자에게 후보별 Authority/Profile/Definition 비교를 제공합니다.</p></article>`;
  }
  if (activeTab === 'gates') {
    tabContent.innerHTML = allActiveGates.sort((a, b) => a - b).map((g) => `<article class="info-card"><h4>${g}번 게이트</h4><p>${gateDescriptions[g] || '게이트 설명 준비중'}</p></article>`).join('');
  }
  if (activeTab === 'centers') {
    tabContent.innerHTML = Object.entries(centers).map(([key, val]) => `<article class="info-card"><h4>${val.label}</h4><p>${activeCenters.includes(key) ? '정의됨' : '오픈'} · ${centerDescriptions[key]}</p></article>`).join('');
  }
}

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab;
    renderTab();
  });
});

document.querySelectorAll('.skin-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skin-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    skinType = btn.dataset.skin;
    renderChart();
  });
});

renderChart();
renderTab();
