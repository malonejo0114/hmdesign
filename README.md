# Design Insight MVP (Human Design)

Human Design 기반 개인화 리딩 SaaS의 웹 MVP입니다.

## 현재 구현 범위

- 출생 정보 입력 → 차트 생성(데모 알고리즘)
- 무료 요약 리포트 노출
- 유료 언락 UX(단건/구독 버튼, 데모 플로우)
- 궁합 분석 입력/결과
- 목표 기반 코칭 입력/결과
- JSON 참조 데이터 로드 실패 시 fallback 처리

## 디렉토리

- `data/human_design_reference.json`: HD 기준 데이터(규칙/채널/AI 입출력 계약)
- `data/sample_chart.json`: 샘플 차트 JSON
- `db/schema.sql`: 사용자/차트/리포트/궁합/코칭 저장 스키마
- `web/*`: 단일 페이지 MVP UI
- `scripts/dev-serve.sh`: 로컬 실행 스크립트 (python3 우선)

## 실행 (권장)

```bash
cd /workspace/hmdesign
./scripts/dev-serve.sh
```

접속:
- `http://localhost:8000/web/`

포트 변경:
```bash
./scripts/dev-serve.sh 9000
```

## 수동 실행

### 루트에서 실행

```bash
cd /workspace/hmdesign
python3 -m http.server 8000
```

접속:
- `http://localhost:8000/web/`

### web 디렉토리에서 실행

```bash
cd /workspace/hmdesign/web
python3 -m http.server 8000
```

접속:
- `http://localhost:8000`

## 주의

현재 웹앱의 차트 계산은 **데모용 결정론 로직**이며, 실제 Swiss Ephemeris 계산 엔진 연동 전 단계입니다.
운영 배포 전에는 반드시 서버에서 천문 계산 기반으로 타입/권위/프로필을 계산하도록 교체해야 합니다.


## Vercel 배포 팁

- 이 프로젝트는 정적 파일이 `web/` 아래에 있으므로 Vercel에서 404가 날 수 있습니다.
- 레포에 포함된 `vercel.json`이 `/` 요청을 `/web/index.html`로 rewrite 하도록 설정되어 있습니다.
- Vercel에서 **Redeploy**(최신 커밋 반영)하면 루트 URL에서 바로 앱이 열립니다.

문제가 계속되면 Project Settings에서 아래를 확인하세요.
- Framework Preset: `Other`
- Root Directory: `./`
- Build Command: 비움
- Output Directory: 비움 (또는 사용하지 않음)
