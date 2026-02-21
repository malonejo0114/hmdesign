const form = document.getElementById('chartForm');
const button = document.getElementById('ctaButton');
const typing = document.getElementById('typingText');
const sampleMeta = document.getElementById('sampleMeta');

const samples = [
  {
    text: '예시: 당신은 타고난 통찰력과 리더십이 강한 타입입니다.',
    meta: '에너지 타입 · Generator'
  },
  {
    text: '예시: 중요한 선택일수록 기다림이 당신의 정확도를 높여줍니다.',
    meta: '전략 가이드 · 반응하기'
  },
  {
    text: '예시: 당신의 강점은 사람과 기회를 연결하는 촉입니다.',
    meta: '핵심 재능 · 연결과 조율'
  }
];

let sampleIndex = 0;
let charIndex = 0;

function typeLoop() {
  if (!typing || !sampleMeta) return;

  const active = samples[sampleIndex];
  typing.textContent = active.text.slice(0, charIndex);
  sampleMeta.textContent = active.meta;
  charIndex += 1;

  if (charIndex <= active.text.length) {
    setTimeout(typeLoop, 38);
    return;
  }

  setTimeout(() => {
    sampleIndex = (sampleIndex + 1) % samples.length;
    charIndex = 0;
    typeLoop();
  }, 1800);
}

typeLoop();

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  button?.classList.remove('pulse');
  requestAnimationFrame(() => button?.classList.add('pulse'));

  const teaser = document.getElementById('chartTeaser');
  teaser?.animate(
    [
      { transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(1.03)', filter: 'brightness(1.15)' },
      { transform: 'scale(1)', filter: 'brightness(1)' }
    ],
    { duration: 720, easing: 'ease-out' }
  );
});
