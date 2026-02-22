# Vercel 배포/404 트러블슈팅

## 왜 404가 뜨나?
정적 사이트에서 Vercel이 파일 경로를 직접 찾지 못하면 `404: NOT_FOUND`가 발생합니다.
특히 다음 경우가 흔합니다.
- 프로젝트 Root Directory를 잘못 지정한 경우
- 정적 라우팅 fallback(`index.html`)이 없는 경우

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

## CLI 배포
```bash
vercel
vercel --prod
```

## 점검 순서
1. Vercel Project Settings → General → Root Directory가 `/`인지 확인
2. Deployment의 Source Branch가 최신 커밋인지 확인
3. 배포 URL에서 `/` 접속 확인
4. `/styles.css`, `/script.js`가 200 응답인지 확인
5. 필요한 경우 Redeploy(캐시 무시) 수행
