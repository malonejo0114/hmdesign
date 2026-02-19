const FALLBACK_REF = {
  pricing_recommendation_krw: {
    basic_report: { min: 9900, max: 19900 },
    premium_report: { min: 49000, max: 99000 },
    subscription_monthly: { min: 5900, max: 12900 }
  }
};

const TYPES = ['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector'];
const AUTHORITIES = ['Emotional', 'Sacral', 'Splenic', 'Ego', 'Self-Projected', 'Mental', 'Lunar'];
const PROFILES = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/1', '4/6', '5/1', '5/2', '6/2', '6/3'];
const DEFINITIONS = ['Single', 'Split', 'Triple Split', 'Quadruple Split'];

const TYPE_GUIDE = {
  Generator: { label: '제너레이터', short: '지속적인 에너지로 실행력을 내는 타입', action: '반응이 오는 일부터 시작' },
  'Manifesting Generator': { label: '발현하는 제너레이터', short: '빠르게 시도하고 수정하며 결과를 내는 타입', action: '반응 후 알리고 빠르게 실행' },
  Projector: { label: '프로젝터', short: '사람/상황을 읽고 방향을 제시하는 타입', action: '인정·요청이 왔을 때 핵심 역량 발휘' },
  Manifestor: { label: '매니페스터', short: '새로운 흐름을 먼저 시작하는 타입', action: '중요 이해관계자에게 먼저 알리고 시작' },
  Reflector: { label: '리플렉터', short: '환경의 영향을 민감하게 반영하는 타입', action: '시간을 두고 충분히 관찰 후 결정' }
};

const AUTHORITY_GUIDE = {
  Emotional: { label: '감정 권위', short: '감정이 잔잔해진 뒤 결정하는 방식', action: '중요 결정은 최소 1박 이상 두기' },
  Sacral: { label: '천골 권위', short: '몸의 즉각적인 yes/no 반응을 따르는 방식', action: '배에서 올라오는 반응을 먼저 체크' },
  Splenic: { label: '비장 권위', short: '순간적인 직감 신호를 따르는 방식', action: '처음 드는 직감 신호를 기록 후 실행' },
  Ego: { label: '의지 권위', short: '정말 내가 원하는지 의지를 기준으로 결정', action: '의욕이 생기는 선택부터 우선순위화' },
  'Self-Projected': { label: '자기투사 권위', short: '말로 꺼냈을 때 내 방향이 명확해지는 방식', action: '신뢰하는 사람 앞에서 말로 확인' },
  Mental: { label: '멘탈/환경 권위', short: '환경과 대화를 통해 명확해지는 방식', action: '성급한 결정보다 환경 바꿔가며 점검' },
  Lunar: { label: '월 권위', short: '시간 흐름(주기)을 거쳐 명확해지는 방식', action: '큰 결정을 서두르지 않고 주기 관찰' }
};

const STRATEGY_GUIDE = {
  'Wait to respond': '반응이 올 때까지 기다린 뒤 움직이기',
  'Wait to respond, then inform': '반응 확인 후 주변에 알리고 실행하기',
  'Wait for invitation': '인정·요청(초대)이 왔을 때 핵심 결정하기',
  'Inform before action': '중요 관계자에게 먼저 알리고 시작하기',
  'Wait a lunar cycle': '시간을 충분히 두고 주기를 거쳐 결정하기'
};

const SIGNATURE_GUIDE = {
  Success: '성공감',
  Peace: '평화로움',
  Surprise: '신선한 놀라움',
  Satisfaction: '만족감'
};

const NOTSELF_GUIDE = {
  Bitterness: '씁쓸함',
  Anger: '분노',
  Disappointment: '실망감',
  Frustration: '답답함'
};

function setStatus(message, isError = false) {
  const el = document.querySelector('#load-status');
  if (!el) return;
  el.textContent = message;
  el.className = isError ? 'status error' : 'status ok';
}

async function fetchReference() {
  const paths = ['./human_design_reference.json', '../data/human_design_reference.json', '/data/human_design_reference.json'];
  for (const path of paths) {
    try {
      const r = await fetch(path);
      if (!r.ok) continue;
      return { data: await r.json(), source: path };
    } catch (_) {
      // continue fallback
    }
  }
  return { data: FALLBACK_REF, source: 'fallback' };
}

function hashString(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0);
}

function pick(list, seed, shift = 0) {
  return list[(seed + shift) % list.length];
}

function generateChart(form) {
  const seedKey = `${form.name}|${form.birthDate}|${form.birthTime}|${form.birthPlace}|${form.timezone}`;
  const seed = hashString(seedKey);
  const type = pick(TYPES, seed);
  const authority = pick(AUTHORITIES, seed, 3);
  const profile = pick(PROFILES, seed, 7);
  const definition = pick(DEFINITIONS, seed, 11);

  const strategyMap = {
    Generator: 'Wait to respond',
    'Manifesting Generator': 'Wait to respond, then inform',
    Projector: 'Wait for invitation',
    Manifestor: 'Inform before action',
    Reflector: 'Wait a lunar cycle'
  };

  return {
    seed,
    type,
    authority,
    profile,
    definition,
    strategy: strategyMap[type],
    signature: type === 'Projector' ? 'Success' : type === 'Manifestor' ? 'Peace' : type === 'Reflector' ? 'Surprise' : 'Satisfaction',
    notSelf: type === 'Projector' ? 'Bitterness' : type === 'Manifestor' ? 'Anger' : type === 'Reflector' ? 'Disappointment' : 'Frustration'
  };
}

function bodyGraphSVG(seed = 1) {
  const active = [seed % 9, (seed + 2) % 9, (seed + 4) % 9, (seed + 6) % 9];
  const centers = [
    [95, 15], [95, 56], [95, 102], [95, 148], [95, 194],
    [30, 78], [160, 78], [50, 160], [140, 160]
  ];

  const centerSVG = centers.map(([x, y], idx) => {
    const on = active.includes(idx);
    return `<rect x="${x}" y="${y}" width="30" height="30" rx="6" fill="${on ? '#4dd0e1' : '#212a5f'}" stroke="#6a1b9a"/>`;
  }).join('');

  return `<svg viewBox="0 0 220 240" role="img" aria-label="운명코드 차트 미리보기">
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="1">
          <stop offset="0%" stop-color="#6a1b9a"/><stop offset="100%" stop-color="#4dd0e1"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="218" height="238" rx="10" fill="#0b0f2f" stroke="#384487"/>
      <path d="M110 30 L110 205 M45 92 L175 92 M65 175 L155 175 M45 92 L65 175 M175 92 L155 175" stroke="url(#lineGrad)" stroke-width="2" fill="none"/>
      ${centerSVG}
      <circle cx="110" cy="18" r="4" fill="#4dd0e1"/>
    </svg>`;
}

function renderChartCore(chart) {
  const target = document.querySelector('#chart-core');
  target.innerHTML = '';
  const rows = [
    ['타입', `${TYPE_GUIDE[chart.type].label} · ${TYPE_GUIDE[chart.type].short}`],
    ['권위', `${AUTHORITY_GUIDE[chart.authority].label} · ${AUTHORITY_GUIDE[chart.authority].short}`],
    ['전략', STRATEGY_GUIDE[chart.strategy]],
    ['프로필', chart.profile],
    ['정의', chart.definition],
    ['좋은 상태', SIGNATURE_GUIDE[chart.signature]],
    ['경고 신호', NOTSELF_GUIDE[chart.notSelf]]
  ];

  rows.forEach(([k, v]) => {
    const el = document.createElement('span');
    el.className = 'pill';
    el.textContent = `${k}: ${v}`;
    target.append(el);
  });

  document.querySelector('#chart-svg').innerHTML = bodyGraphSVG(chart.seed);
}

function buildSummary(chart, name) {
  return `${name}님은 ${TYPE_GUIDE[chart.type].label} 타입입니다. ${TYPE_GUIDE[chart.type].short}. ` +
    `결정 방식은 ${AUTHORITY_GUIDE[chart.authority].label}이며, ${AUTHORITY_GUIDE[chart.authority].short}. ` +
    `핵심 전략은 '${STRATEGY_GUIDE[chart.strategy]}'입니다.`;
}

function buildFullReport(chart, name) {
  return [
    `${name}님의 기본 성향은 ${TYPE_GUIDE[chart.type].label}입니다. ${TYPE_GUIDE[chart.type].action}를 우선 원칙으로 두면 성과가 안정됩니다.`,
    `권위는 ${AUTHORITY_GUIDE[chart.authority].label}입니다. 한 줄 요약: ${AUTHORITY_GUIDE[chart.authority].short}. 실천법: ${AUTHORITY_GUIDE[chart.authority].action}.`,
    `전략 '${STRATEGY_GUIDE[chart.strategy]}'는 소극성의 의미가 아니라 타이밍 최적화 원칙입니다.`,
    `프로필 ${chart.profile}, 정의 ${chart.definition}은 관계와 협업에서의 학습 방식입니다. 나에게 맞는 환경을 찾을수록 성장 속도가 빨라집니다.`,
    `경고 신호는 '${NOTSELF_GUIDE[chart.notSelf]}', 좋은 신호는 '${SIGNATURE_GUIDE[chart.signature]}'입니다. 일주일에 1회 신호 점검 루틴을 권장합니다.`
  ].join('\n\n');
}

function renderReportPages(chart, name) {
  const target = document.querySelector('#report-pages');
  const sections = [
    '서비스 안내 & 차트 요약',
    `타입 해석: ${TYPE_GUIDE[chart.type].label}`,
    `권위 해석: ${AUTHORITY_GUIDE[chart.authority].label}`,
    `전략 해석: ${STRATEGY_GUIDE[chart.strategy]}`,
    `프로필 ${chart.profile} 심층`,
    `정의 ${chart.definition} 심층`,
    '강점 사용법',
    '주의 패턴 관리법',
    '관계/일 적용 가이드',
    `${name}님 4주 실행 플랜`
  ];

  target.innerHTML = sections.map((title, idx) => `
    <article class="page-card">
      <strong>${idx + 1}p</strong>
      <span>${title}</span>
    </article>
  `).join('');
}

function analyzeCompatibility(myChart, partnerName, partnerType) {
  const synergy = myChart.type === partnerType ? '동일 타입 공명' : '상호 보완형 조합';
  return `${partnerName}님(${TYPE_GUIDE[partnerType].label})과의 조합은 ${synergy}에 가깝습니다.\n` +
    `내 전략 '${STRATEGY_GUIDE[myChart.strategy]}'를 우선 지키면 관계 피로가 줄어듭니다.\n` +
    `주 1회 20분 체크인(고마운 점/불편한 점/다음 주 요청)을 고정해보세요.`;
}

function coachByGoal(chart, goalText) {
  return `목표: ${goalText}\n\n` +
    `1) 결정 방식(권위): ${AUTHORITY_GUIDE[chart.authority].label}\n` +
    `   - 뜻: ${AUTHORITY_GUIDE[chart.authority].short}\n` +
    `   - 실천: ${AUTHORITY_GUIDE[chart.authority].action}\n\n` +
    `2) 행동 전략: ${STRATEGY_GUIDE[chart.strategy]}\n` +
    `   - 뜻: 내 에너지가 잘 먹히는 타이밍을 먼저 고르는 것\n\n` +
    `3) 경고 신호: ${NOTSELF_GUIDE[chart.notSelf]}\n` +
    `   - 이 신호가 강해지면 속도를 늦추고 환경을 바꾼 뒤 재판단하세요.`;
}

async function main() {
  const ref = await fetchReference();
  setStatus(`준비 완료 · reference: ${ref.source}`, ref.source === 'fallback');

  document.querySelector('#hero-svg').innerHTML = bodyGraphSVG(12);

  const chartSection = document.querySelector('#chart-section');
  const birthForm = document.querySelector('#birth-form');
  const summaryReport = document.querySelector('#summary-report');
  const fullReport = document.querySelector('#full-report');
  const lockWrap = document.querySelector('.lock-wrap');
  const paywall = document.querySelector('#paywall');
  const compatForm = document.querySelector('#compat-form');
  const compatResult = document.querySelector('#compat-result');
  const goalForm = document.querySelector('#goal-form');
  const goalResult = document.querySelector('#goal-result');

  let currentChart = null;
  let currentName = '사용자';

  birthForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(birthForm).entries());
    currentName = form.name;
    currentChart = generateChart(form);

    renderChartCore(currentChart);
    summaryReport.textContent = buildSummary(currentChart, currentName);
    fullReport.textContent = buildFullReport(currentChart, currentName);
    renderReportPages(currentChart, currentName);

    lockWrap.classList.remove('unlocked');
    paywall.style.display = 'block';
    chartSection.classList.remove('hidden');
    setStatus(`차트 생성 완료 · seed ${currentChart.seed}`);
  });

  function unlock(mode) {
    if (!currentChart) return;
    lockWrap.classList.add('unlocked');
    paywall.style.display = 'none';
    setStatus(`결제 성공(데모) · ${mode} 언락 완료`);
  }

  document.querySelector('#unlock-once').addEventListener('click', () => unlock('단건'));
  document.querySelector('#unlock-sub').addEventListener('click', () => unlock('구독'));

  compatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentChart) {
      compatResult.textContent = '먼저 본인 차트를 생성해주세요.';
      return;
    }
    const form = Object.fromEntries(new FormData(compatForm).entries());
    compatResult.textContent = analyzeCompatibility(currentChart, form.partnerName, form.partnerType);
  });

  goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentChart) {
      goalResult.textContent = '먼저 본인 차트를 생성해주세요.';
      return;
    }
    const form = Object.fromEntries(new FormData(goalForm).entries());
    goalResult.textContent = coachByGoal(currentChart, form.goal);
  });
}

main().catch((err) => {
  console.error(err);
  setStatus('앱 초기화 중 오류가 발생했습니다.', true);
});
