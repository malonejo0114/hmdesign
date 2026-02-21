const form = document.getElementById('chartForm');
const button = document.getElementById('ctaButton');
const typing = document.getElementById('typingText');
const sampleMeta = document.getElementById('sampleMeta');
const svg = document.getElementById('bodygraph');
const detailPanel = document.getElementById('detailPanel');
const tabContent = document.getElementById('tabContent');

const samples = [
  ['예시: 중요한 선택일수록 기다림이 당신의 정확도를 높여줍니다.', '전략 가이드 · 반응하기'],
  ['예시: 당신은 타고난 통찰력과 리더십이 강한 타입입니다.', '에너지 타입 · Generator'],
  ['예시: 공통분모를 먼저 실험하고, 변동요소는 후보 비교로 확인하세요.', 'Range 모드 · 후보 비교']
];
let sampleIdx = 0;
let charIdx = 0;

function typeLoop() {
  const [text, meta] = samples[sampleIdx];
  typing.textContent = text.slice(0, charIdx++);
  sampleMeta.textContent = meta;
  if (charIdx <= text.length) return setTimeout(typeLoop, 32);
  setTimeout(() => { sampleIdx = (sampleIdx + 1) % samples.length; charIdx = 0; typeLoop(); }, 1300);
}
typeLoop();

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  button.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 500 });
});

const data = {
  type: '제너레이터', strategy: '반응하기', authority: '천골 권위', profile: '3/6', definition: '스플릿 정의',
  activeCenters: ['HEAD', 'AJNA', 'SACRAL', 'ROOT'],
  designGates: [61, 62, 44, 24, 53, 13, 9, 59, 37, 14],
  personalityGates: [42, 32, 28, 27, 46, 22, 7, 5, 60, 34],
};
const allActiveGates = [...new Set([...data.designGates, ...data.personalityGates])];
const centers = {
  HEAD: { x: 150, y: 70, shape: 'circle', label: '헤드' }, AJNA: { x: 150, y: 130, shape: 'triangle-down', label: '아즈나' },
  THROAT: { x: 150, y: 195, shape: 'square', label: '목' }, G: { x: 150, y: 270, shape: 'diamond', label: 'G' },
  EGO: { x: 95, y: 285, shape: 'triangle-small', label: '에고' }, SPLEEN: { x: 55, y: 365, shape: 'triangle-small', label: '비장' },
  EMO: { x: 245, y: 365, shape: 'triangle-small', label: '감정' }, SACRAL: { x: 150, y: 355, shape: 'square', label: '천골' },
  ROOT: { x: 150, y: 430, shape: 'square', label: '루트' }
};
const channels = [
  { from: 'HEAD', to: 'AJNA', gates: [61, 24] }, { from: 'SACRAL', to: 'ROOT', gates: [42, 53], offsetX: -12 },
  { from: 'SACRAL', to: 'ROOT', gates: [60, 3] }, { from: 'EMO', to: 'SACRAL', gates: [6, 59] }
];
const gatePositions = [{ gate: 61, x: 150, y: 42 }, { gate: 24, x: 150, y: 100 }, { gate: 42, x: 138, y: 398 }, { gate: 53, x: 128, y: 412 }, { gate: 60, x: 150, y: 405 }, { gate: 3, x: 178, y: 378 }, { gate: 59, x: 122, y: 378 }, { gate: 6, x: 225, y: 382 }, { gate: 34, x: 115, y: 355 }];
const gateDesc = { 61: '내면 진실의 게이트', 24: '귀환의 게이트', 42: '성장의 게이트', 53: '시작의 게이트', 60: '수용의 게이트', 3: '질서화의 게이트', 59: '성의 게이트', 6: '갈등의 게이트', 34: '힘의 게이트' };
const centerDesc = { HEAD: '영감과 정신적 압박', AJNA: '개념화와 정신 처리', SACRAL: '생명력과 작업 에너지', ROOT: '압박과 스트레스' };

function drawCenter(name, c) {
  const active = data.activeCenters.includes(name);
  const fill = active ? '#4dd0e1' : '#252a49';
  const stroke = '#8ea2ff';
  if (c.shape === 'circle') return `<circle class="center-shape" data-center="${name}" cx="${c.x}" cy="${c.y}" r="24" fill="${fill}" stroke="${stroke}"/>`;
  if (c.shape === 'triangle-down') return `<polygon class="center-shape" data-center="${name}" points="${c.x - 26},${c.y - 16} ${c.x + 26},${c.y - 16} ${c.x},${c.y + 22}" fill="${fill}" stroke="${stroke}"/>`;
  if (c.shape === 'triangle-small') return `<polygon class="center-shape" data-center="${name}" points="${c.x},${c.y - 14} ${c.x - 17},${c.y + 12} ${c.x + 17},${c.y + 12}" fill="${fill}" stroke="${stroke}"/>`;
  if (c.shape === 'diamond') return `<polygon class="center-shape" data-center="${name}" points="${c.x},${c.y - 24} ${c.x + 28},${c.y} ${c.x},${c.y + 24} ${c.x - 28},${c.y}" fill="${fill}" stroke="${stroke}"/>`;
  return `<rect class="center-shape" data-center="${name}" x="${c.x - 22}" y="${c.y - 17}" width="44" height="34" rx="3" fill="${fill}" stroke="${stroke}"/>`;
}

function renderChart() {
  const skinType = document.querySelector('.skin-btn.active')?.dataset.skin || 'free';
  const activeColor = skinType === 'paid' ? '#00d4aa' : '#e94560';
  const html = [
    '<defs><filter id="glow"><feGaussianBlur stdDeviation="2"/></filter></defs>',
    '<path d="M95 125 L205 125 L220 140 Q232 175 228 225 Q220 390 208 430 Q195 465 170 480 Q155 488 150 490 Q145 488 130 480 Q105 465 92 430 Q80 390 72 225 Q68 175 80 140 Z" fill="#ffffff0b" stroke="#8ea2ff55"/>',
    ...channels.map((ch) => {
      const f = centers[ch.from], t = centers[ch.to], off = ch.offsetX || 0;
      const on = ch.gates.every((g) => allActiveGates.includes(g));
      return `<line x1="${f.x + off}" y1="${f.y + 16}" x2="${t.x + off}" y2="${t.y - 16}" stroke="${on ? activeColor : '#7883a855'}" stroke-width="${on ? 3 : 1.5}"/>`;
    }),
    ...Object.entries(centers).flatMap(([name, c]) => [drawCenter(name, c), `<text x="${c.x}" y="${c.y + 3}" fill="#fff" font-size="8" text-anchor="middle">${c.label}</text>`]),
    ...gatePositions.map(({ gate, x, y }) => {
      const active = allActiveGates.includes(gate);
      return `<text class="gate" data-gate="${gate}" x="${x}" y="${y}" fill="${active ? '#ffd166' : '#a6b2de77'}" font-size="${active ? 9 : 7}" text-anchor="middle">${gate}</text>`;
    })
  ].join('');
  svg.innerHTML = html;

  svg.querySelectorAll('.gate').forEach((el) => el.addEventListener('click', () => {
    const g = Number(el.dataset.gate);
    detailPanel.textContent = `${g}번 게이트 · ${gateDesc[g] || '상세 해석 준비중'} · ${allActiveGates.includes(g) ? '활성' : '비활성'}`;
  }));
  svg.querySelectorAll('.center-shape').forEach((el) => el.addEventListener('click', () => {
    const c = el.dataset.center;
    const state = data.activeCenters.includes(c) ? '정의됨' : '오픈';
    detailPanel.textContent = `${c} 센터 (${state}) · ${centerDesc[c] || '센터 설명 준비중'}`;
  }));
}

function renderTab(tab) {
  if (tab === 'chart') {
    tabContent.innerHTML = `<div class="info-card"><h4>기본 정보</h4><p>타입: ${data.type} · 전략: ${data.strategy} · 권위: ${data.authority}</p><p>정의: ${data.definition} · 프로필: ${data.profile}</p></div>`;
  }
  if (tab === 'info') {
    tabContent.innerHTML = `<div class="info-card"><h4>전략 & 권위</h4><p>Strategy는 Type에 의해 결정되며, 의사결정은 권위(Authority)를 따릅니다.</p></div><div class="info-card"><h4>Range 모드</h4><p>출생시간 모름 사용자에게 후보별 Authority/Profile/Definition 비교표를 제공합니다.</p></div>`;
  }
  if (tab === 'gates') {
    tabContent.innerHTML = allActiveGates.sort((a,b)=>a-b).map((g)=>`<div class="info-card"><h4>${g}번 게이트</h4><p>${gateDesc[g] || '설명 준비중'}</p></div>`).join('');
  }
  if (tab === 'centers') {
    tabContent.innerHTML = Object.keys(centers).map((c)=>`<div class="info-card"><h4>${c}</h4><p>${data.activeCenters.includes(c) ? '정의됨' : '오픈'}</p></div>`).join('');
  }
}

document.querySelectorAll('.tab-btn').forEach((btn) => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  renderTab(btn.dataset.tab);
}));

document.querySelectorAll('.skin-btn').forEach((btn) => btn.addEventListener('click', () => {
  document.querySelectorAll('.skin-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  renderChart();
}));

renderChart();
renderTab('chart');
