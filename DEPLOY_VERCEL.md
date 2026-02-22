# Vercel 배포/404 트러블슈팅

## 왜 404가 뜨나?
정적 사이트에서 Vercel이 파일 경로를 직접 찾지 못하면 `404: NOT_FOUND`가 발생합니다.
특히 다음 경우가 흔합니다.
- 프로젝트 Root Directory를 잘못 지정한 경우
- 정적 라우팅 fallback(`index.html`)이 없는 경우
- Production에서 다른 브랜치/다른 프로젝트를 보고 있는 경우

이 저장소는 `index.html` 기반 정적 사이트이며, `vercel.json`으로 non-file 경로를 `index.html`로 rewrite 하도록 설정했습니다.

## 필수 파일
- `index.html`
- `styles.css`
- `script.js`
- `vercel.json`

## Vercel 설정 권장값
- Framework Preset: **Other**
- Root Directory: **/** (리포 루트)
- Build Command: 비움
- Output Directory: 비움

## 중요한 UI 차이 (진짜 자주 헷갈림)
Vercel UI 버전에 따라 `Production Branch` 항목이 보이는 위치가 다릅니다.

- 어떤 계정/버전에서는 `Settings > Git`에 없음 (정상)
- 이 경우 `Settings > Build and Deployment`에서 확인/변경
- 그래도 없으면 기본값은 `main`인 경우가 많으며, 아래 우회로로 확인 가능

### Production Branch가 안 보일 때 확인법
1. `Deployments`에서 **Production 배포 하나 클릭**
2. 배포 상세의 `Source` 또는 `Git Branch`가 `main`인지 확인
3. `main`이 아니면, GitHub에서 `main`에 머지 후 새 커밋 푸시
4. Vercel에서 **Redeploy**

## CLI 배포(메뉴 꼬일 때 가장 확실)
```bash
vercel
vercel --prod
```

## 점검 순서
1. Vercel Project Settings에서 Root Directory가 `/`인지 확인
2. Production 배포 상세의 Source Branch가 최신 커밋/브랜치인지 확인
3. 배포 URL에서 `/` 접속 확인
4. `/styles.css`, `/script.js`가 200 응답인지 확인
5. 필요한 경우 Redeploy(캐시 무시) 수행
