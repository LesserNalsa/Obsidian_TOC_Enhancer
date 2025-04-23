# TOC Enhancer

**TOC Enhancer**는 Obsidian 내에서 `목차(TOC)` 목록을 기반으로 각 항목에 대응하는 헤더와 ID를 자동 생성해주는 플러그인입니다.  
또한 각 섹션 끝에는 "목차로 돌아가기" 링크도 자동 삽입됩니다.

---

## ✨ 주요 기능

- `## 목차` 하단의 `- [제목]` 항목을 탐색
- 각 항목에 대응하는 `## 제목 ^section-id` 자동 삽입
- 목차 항목은 자동으로 `[제목](#^section-id)` 형식으로 링크화
- 각 섹션 하단에 `[🔼 목차로](#^목차)` 자동 삽입

---

## 🛠 사용 방법

1. 문서에 다음과 같은 목차를 작성하세요:

    ```markdown
    ## 목차
    - [제안 배경]
    - [문제 정의]
    ```

2. 커맨드 팔레트 (`Ctrl/Cmd + P`)에서 다음을 실행하세요:
    ```
    Generate TOC-linked Sections
    ```

3. 자동으로 다음과 같은 형식이 생성됩니다:

    ```markdown
    ## 제안 배경 ^section-제안-배경

    내용...

    [🔼 목차로](#^목차)
    ```

---

## 🔧 설치 방법

1. 이 플러그인을 다운로드하여 다음 경로에 복사:
    ```
    <your-vault>/.obsidian/plugins/toc-enhancer/
    ```

2. `manifest.json`, `main.js` 파일이 포함되어야 합니다.
3. Obsidian을 재시작한 후, `설정 > 커뮤니티 플러그인`에서 활성화

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