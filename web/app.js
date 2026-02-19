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
  'Generator': {
    label: 'Generator (제너레이터)',
    short: '지속적인 에너지로 실행력을 내는 타입',
    action: '반응이 오는 일부터 시작'
  },
  'Manifesting Generator': {
    label: 'Manifesting Generator (발현하는 제너레이터)',
    short: '빠르게 시도하고 수정하며 결과를 내는 타입',
    action: '반응 후 알리고 빠르게 실행'
  },
  'Projector': {
    label: 'Projector (프로젝터)',
    short: '사람/상황을 읽고 방향을 제시하는 타입',
    action: '인정·요청이 왔을 때 핵심 역량 발휘'
  },
  'Manifestor': {
    label: 'Manifestor (매니페스터)',
    short: '새로운 흐름을 먼저 시작하는 타입',
    action: '중요 이해관계자에게 먼저 알리고 시작'
  },
  'Reflector': {
    label: 'Reflector (리플렉터)',
    short: '환경의 영향을 민감하게 반영하는 타입',
    action: '시간을 두고 충분히 관찰 후 결정'
  }
};

const AUTHORITY_GUIDE = {
  Emotional: {
    label: 'Emotional (감정 권위)',
    short: '감정이 잔잔해진 뒤 결정하는 방식',
    action: '중요 결정은 최소 1박 이상 두기'
  },
  Sacral: {
    label: 'Sacral (천골 권위)',
    short: '몸의 즉각적인 yes/no 반응을 따르는 방식',
    action: '배에서 올라오는 반응을 먼저 체크'
  },
  Splenic: {
    label: 'Splenic (비장 권위)',
    short: '순간적인 직감 신호를 따르는 방식',
    action: '처음 드는 직감 신호를 기록 후 실행'
  },
  Ego: {
    label: 'Ego (의지 권위)',
    short: '정말 내가 원하는지 의지를 기준으로 결정',
    action: '의욕이 생기는 선택부터 우선순위화'
  },
  'Self-Projected': {
    label: 'Self-Projected (자기투사 권위)',
    short: '말로 꺼냈을 때 내 방향이 명확해지는 방식',
    action: '신뢰하는 사람 앞에서 말로 확인'
  },
  Mental: {
    label: 'Mental (멘탈/환경 권위)',
    short: '환경과 대화를 통해 명확해지는 방식',
    action: '성급한 결정보다 환경 바꿔가며 점검'
  },
  Lunar: {
    label: 'Lunar (월 권위)',
    short: '시간 흐름(주기)을 거쳐 명확해지는 방식',
    action: '큰 결정을 서두르지 않고 주기 관찰'
  }
};

const STRATEGY_GUIDE = {
  'Wait to respond': '반응이 올 때까지 기다린 뒤 움직이기',
  'Wait to respond, then inform': '반응 확인 후 주변에 알리고 실행하기',
  'Wait for invitation': '인정·요청(초대)이 왔을 때 핵심 결정하기',
  'Inform before action': '중요 관계자에게 먼저 알리고 시작하기',
  'Wait a lunar cycle': '시간을 충분히 두고 주기를 거쳐 결정하기'
};

const SIGNATURE_GUIDE = {
  Success: '올바른 흐름일 때 느끼는 상태: 성공감',
  Peace: '올바른 흐름일 때 느끼는 상태: 평화로움',
  Surprise: '올바른 흐름일 때 느끼는 상태: 놀라움/신선함',
  Satisfaction: '올바른 흐름일 때 느끼는 상태: 만족감'
};

const NOTSELF_GUIDE = {
  Bitterness: '과하게 애쓰거나 인정받지 못할 때 느끼는 신호: 씁쓸함',
  Anger: '내 리듬이 막힐 때 올라오는 신호: 분노',
  Disappointment: '환경이 맞지 않을 때 느끼는 신호: 실망감',
  Frustration: '억지로 밀어붙일 때 느끼는 신호: 답답함'
};

function setStatus(message, isError = false) {
  const el = document.querySelector('#load-status');
  el.textContent = message;
  el.className = isError ? 'status error' : 'status ok';
}

async function fetchReference() {
  const paths = ['./human_design_reference.json', '../data/human_design_reference.json', '/data/human_design_reference.json'];
  for (const path of paths) {
    try {
      const r = await fetch(path);
      if (!r.ok) continue;
      const data = await r.json();
      return { data, source: path };
    } catch (_) {
      // continue
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

function renderChartCore(chart) {
  const target = document.querySelector('#chart-core');
  target.innerHTML = '';
  const rows = [
    ['타입', TYPE_GUIDE[chart.type].label],
    ['타입 한줄설명', TYPE_GUIDE[chart.type].short],
    ['전략', STRATEGY_GUIDE[chart.strategy]],
    ['권위', AUTHORITY_GUIDE[chart.authority].label],
    ['권위 한줄설명', AUTHORITY_GUIDE[chart.authority].short],
    ['프로필', chart.profile],
    ['정의', chart.definition],
    ['좋은 상태', SIGNATURE_GUIDE[chart.signature]],
    ['주의 신호', NOTSELF_GUIDE[chart.notSelf]]
  ];
  rows.forEach(([k, v]) => {
    const el = document.createElement('span');
    el.className = 'pill';
    el.textContent = `${k}: ${v}`;
    target.append(el);
  });
}

function buildSummary(chart, name) {
  return `${name}님은 ${TYPE_GUIDE[chart.type].label}입니다. ` +
    `${TYPE_GUIDE[chart.type].short}. ` +
    `의사결정 방식은 ${AUTHORITY_GUIDE[chart.authority].label}으로, ${AUTHORITY_GUIDE[chart.authority].short}. ` +
    `핵심 전략은 "${STRATEGY_GUIDE[chart.strategy]}" 입니다.`;
}

function buildFullReport(chart, name) {
  return [
    `${name}님의 기본 성향은 ${TYPE_GUIDE[chart.type].label}에 가깝습니다. ${TYPE_GUIDE[chart.type].short}이라는 점이 일/관계의 핵심 패턴으로 반복됩니다.`,
    `권위(결정 방식)는 ${AUTHORITY_GUIDE[chart.authority].label}입니다. 쉽게 말해 ${AUTHORITY_GUIDE[chart.authority].short}. 실제 행동으로는 '${AUTHORITY_GUIDE[chart.authority].action}'를 먼저 적용해보세요.`,
    `전략은 '${STRATEGY_GUIDE[chart.strategy]}'입니다. 이 전략은 소극적이라는 뜻이 아니라, 내 에너지를 낭비하지 않고 결과가 잘 나오는 타이밍을 고르는 기준입니다.`,
    `프로필 ${chart.profile}, 정의 ${chart.definition} 조합은 사람과 협업할 때 나오는 학습 패턴을 보여줍니다. 맞는 환경을 고르면 성장 속도가 빨라집니다.`,
    `실천 포인트: (1) 하루 끝에 의사결정 로그 3줄 기록, (2) '${NOTSELF_GUIDE[chart.notSelf]}'가 올라올 때 즉시 멈춤, (3) '${SIGNATURE_GUIDE[chart.signature]}'가 느껴지는 행동을 매일 1개 반복.`
  ].join('\n\n');
}

function analyzeCompatibility(myChart, partnerName, partnerType) {
  const synergy = myChart.type === partnerType ? '동일 타입 공명' : '상호 보완형 조합';
  return `${partnerName}님(${TYPE_GUIDE[partnerType].label})과의 조합은 ${synergy}에 가깝습니다.\n` +
    `내 전략은 '${STRATEGY_GUIDE[myChart.strategy]}'입니다. 이 원칙을 먼저 지키면 관계 피로가 줄어듭니다.\n` +
    `관계 팁: 주 1회 20분 체크인(이번 주 고마웠던 점/불편했던 점/다음 주 요청사항)을 고정하세요.`;
}

function coachByGoal(chart, goalText) {
  return `목표: ${goalText}\n\n` +
    `코칭 제안(쉽게):\n` +
    `1) 결정 방식: ${AUTHORITY_GUIDE[chart.authority].label}\n` +
    `   - 뜻: ${AUTHORITY_GUIDE[chart.authority].short}\n` +
    `   - 실천: ${AUTHORITY_GUIDE[chart.authority].action}\n\n` +
    `2) 행동 전략: ${STRATEGY_GUIDE[chart.strategy]}\n` +
    `   - 뜻: 내 에너지가 잘 먹히는 타이밍을 먼저 고르는 것\n\n` +
    `3) 경고 신호: ${NOTSELF_GUIDE[chart.notSelf]}\n` +
    `   - 이 신호가 올라오면 즉시 속도를 늦추고, 잠깐 환경을 바꾼 뒤 다시 판단하세요.`;
}

async function main() {
  const ref = await fetchReference();
  setStatus(`준비 완료 · reference: ${ref.source}`, ref.source === 'fallback');

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
