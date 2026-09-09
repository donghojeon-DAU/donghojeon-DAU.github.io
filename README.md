# Jeon Lab — GitHub Pages deployment

This folder is ready to publish as a static GitHub Pages site.

## 가장 쉬운 배포 방법

1. GitHub 계정을 만든다.
2. 새 repository를 만든다.
   - 개인 기본 사이트 주소를 원하면 repository 이름을 `<GitHub사용자명>.github.io` 로 만든다.
   - 예: GitHub ID가 `donghojeon`이면 `donghojeon.github.io`
   - Visibility: Public
3. 이 폴더 안의 파일과 폴더를 repository 최상위(root)에 업로드한다.
   - `index.html`이 repository 첫 화면에 보여야 한다.
   - ZIP 파일 자체를 업로드하지 않는다.
4. Repository → Settings → Pages
5. Build and deployment → Source: `Deploy from a branch`
6. Branch: `main`, Folder: `/(root)` → Save
7. 배포가 완료되면 `https://<GitHub사용자명>.github.io/` 로 접속한다.

## jeonlab.dau.ac.kr 연결

학교에서 `jeonlab.dau.ac.kr` 서브도메인 사용을 승인한 뒤 진행한다.

1. GitHub repository → Settings → Pages → Custom domain
2. `jeonlab.dau.ac.kr` 입력 → Save
3. 동아대학교 DNS 담당자에게 아래 CNAME 레코드 생성을 요청한다.

   - Type: CNAME
   - Host/Name: `jeonlab`
   - Target/Value: `<GitHub사용자명>.github.io`

4. DNS 확인이 완료되면 `Enforce HTTPS`를 켠다.

GitHub Pages에서 custom domain을 설정하면 GitHub가 repository root의 `CNAME` 파일을 관리할 수 있다.
`CNAME.example.txt`는 예시일 뿐이며 실제 배포에는 영향을 주지 않는다.

## 파일 구조

- `index.html` — 사이트 본문
- `assets/css/styles.css` — 디자인
- `assets/js/app.js` — 탭/검색 기능
- `favicon.svg` — 파비콘
- `404.html` — 없는 페이지 안내
- `site.webmanifest` — 웹앱 메타데이터
- `.nojekyll` — Jekyll 처리를 비활성화하여 정적 파일을 그대로 제공

## 사이트 수정

HTML/CSS/JS 파일을 수정한 뒤 GitHub repository에 다시 업로드/commit하면 GitHub Pages가 자동으로 다시 배포한다.
