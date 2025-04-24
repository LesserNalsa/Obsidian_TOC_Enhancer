# TOC Enhancer

**TOC Enhancer**는 Obsidian 내에서 `목차(TOC)` 목록을 기반으로한 번의 명령으로 **섹션 제목·내부 링크**까지 자동으로 생성/동기화하는 Obsidian 플러그인입니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| **단일 명령 실행** | `Generate TOC-linked Section` 한 번으로 ↓ 모든 작업 자동화 |
| **문서 상단 `## 목차` 인식** | 숫자 목록(ol)·불릿(ul)·다단계(`4.1.`)까지 지원 |
| **내부 링크 자동 생성** | 공백을 `%20` 로 인코딩 → Obsidian에서 100 % 작동 |
| **섹션 삽입 규칙** |  - 최상위 헤더(레벨2) 간 간격 2줄  
  - 하위 헤더 간 간격 1줄  
  - 최상위 내부에서는 간격 0줄 |
| **들여쓰기** | 목차의 탭(`\t`) 수준과 동일한 탭 들여쓰기 유지 |
| **목차 돌아가기** | 각 섹션 하단에 `[🔼 목차로](#^목차)` 자동 삽입 |

---

## 📦 설치 방법
1. 직접 빌드
   1. 소스 빌드  
     ```bash
     npm install
     npm run build   # main.ts → main.js
     ```
   2. 빌드 결과(main.js, manifest.json, styles.css)를
   YOUR_VAULT/.obsidian/plugins/toc-enhancer/ 폴더에 복사

   3. Obsidian → 설정 → 플러그인 → TOC Enhancer 활성화
2. Artifact 다운로드
   1. 이 플러그인을 다운로드하여 다음 경로에 복사:
    ```
    <your-vault>/.obsidian/plugins/toc-enhancer/
    ```
   2. `manifest.json`, `main.js` 파일이 포함되어야 합니다.
   3. Obsidian을 재시작한 후, `설정 > 커뮤니티 플러그인`에서 활성화

## 🚀 사용 방법

1. 노트 최상단에 ## 목차 + 리스트를 작성합니다.
  ```markdown
  ## 목차
  1. 제목 1
    - 하위 항목 1
  ```
2. `Cmd/Ctrl + P` → **Generate TOC-linked Section** 명령 실행

3. 결과
   - TOC 항목이 `[텍스트](#내부링크)` 형식으로 바뀜
   - 대응 섹션 헤더 및 하위 헤더가 자동으로 삽입

---

## ⚙️ 설정 (향후 추가 예정)

옵션 | 기본값 | 설명
들여쓰기 문자 | \t | 스페이스 × 2 등으로 커스터마이즈 예정
링크 인코딩 | %20 | 하이픈(-) 등 선택 예정

---

## 🗂 프로젝트 구조

```bash
src/
 ├─ main.ts      # 플러그인 엔트리
 ├─ parser.ts    # TOC 파서
 ├─ updater.ts   # 섹션·링크 생성 로직
 └─ utils.ts     # 보조 함수
```

---

## 💡 개발 및 기여

GitHub: [LesserNalsa/Obsidian_TOC_Enhancer](https://github.com/LesserNalsa/Obsidian_TOC_Enhancer)

Pull Requests 및 개선 제안 환영합니다 🙌

---

## 📜 라이선스

본 플러그인은 [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)을 기반으로 개발되었으며,  
해당 프로젝트의 BSD 3-Clause 라이선스를 그대로 따릅니다.

- 원 프로젝트 라이선스: BSD-3-Clause  
- 이 프로젝트에 추가된 기능은 원 라이선스 조항을 따릅니다.  
- 상단 LICENSE 파일을 참조하세요