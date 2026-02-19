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
    ['타입', chart.type],
    ['전략', chart.strategy],
    ['권위', chart.authority],
    ['프로필', chart.profile],
    ['정의', chart.definition],
    ['시그니처', chart.signature],
    ['Not-Self', chart.notSelf]
  ];
  rows.forEach(([k, v]) => {
    const el = document.createElement('span');
    el.className = 'pill';
    el.textContent = `${k}: ${v}`;
    target.append(el);
  });
}

function buildSummary(chart, name) {
  return `${name}님은 ${chart.type} 타입이며, 의사결정 권위는 ${chart.authority}입니다. ` +
    `프로필 ${chart.profile} 특성상 관계와 경험에서 배움을 얻는 흐름이 강합니다. ` +
    `핵심 전략은 "${chart.strategy}" 입니다.`;
}

function buildFullReport(chart, name) {
  return [
    `${name}님의 에너지 타입은 ${chart.type}으로, 고유한 추진력과 반응 패턴이 삶의 결과를 크게 좌우합니다.`,
    `내적 권위는 ${chart.authority}이므로 중요한 결정은 머리보다 몸의 신호(혹은 감정 파동의 안정 구간)를 우선해야 정확도가 높습니다.`,
    `프로필 ${chart.profile}는 대인관계/학습 방식에서 반복되는 테마를 형성합니다. 이 특성을 의식적으로 사용하면 일과 관계 모두 효율이 상승합니다.`,
    `정의 형태 ${chart.definition}는 문제 해결의 스타일에 영향을 줍니다. 자신의 의사결정 속도와 협업 방식을 인지하면 불필요한 에너지 소모를 줄일 수 있습니다.`,
    `실천 포인트: (1) ${chart.strategy}를 2주간 기록, (2) ${chart.notSelf} 감정이 올라오는 상황 로그화, (3) ${chart.signature} 상태를 만드는 행동을 매일 1개 실행.`
  ].join('\n\n');
}

function analyzeCompatibility(myChart, partnerName, partnerType) {
  const synergy = myChart.type === partnerType ? '동일 타입 공명' : '상호 보완형 조합';
  return `${partnerName}님(${partnerType})과의 조합은 ${synergy}에 가깝습니다.\n` +
    `당신의 전략(${myChart.strategy})을 먼저 지키면 관계 마찰이 줄어듭니다.\n` +
    `관계 팁: 의사결정 속도를 맞추기 위한 체크인 시간을 주 1회 고정하세요.`;
}

function coachByGoal(chart, goalText) {
  return `목표: ${goalText}\n\n` +
    `코칭 제안:\n` +
    `1) ${chart.authority} 권위 기준으로 결정 타이밍을 분리하세요.\n` +
    `2) ${chart.strategy} 원칙에 맞지 않는 요청은 즉시 수락하지 마세요.\n` +
    `3) ${chart.notSelf} 신호가 강할수록 휴식/환경 전환 후 재판단하세요.`;
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
