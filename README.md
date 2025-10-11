# MoneyMakersClub

## 🖥️ 프로젝트 소개

<br>

## 🕰️ 개발 기간

- 24.10.02일 - 진행중

## 📝 규칙

- `커밋 컨벤션`
  - 💄 UI : UI, 스타일 관련 파일 추가 및 수정
  - ✨ feat : 새로운 기능 추가, 기존의 기능을 요구 사항에 맞추어 수정
  - 🐛 fix : 기능에 대한 버그 수정
  - 🫧 perf: 성능 개선
  - 🛠️ build : 빌드 관련 수정
  - 🔧 chore : 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore
  - 👷 ci : CI 관련 설정 수정
  - 📝 docs : 문서 파일 추가 및 수정
  - 🎨 style : 코드 스타일, 포맷팅에 대한 수정
  - ♻️ refactor : 기능의 변화가 아닌 코드 리팩터링 ex) 변수 이름 변경
  - ✅ test : 테스트 코드 추가/수정
  - 🔖 release : 버전 릴리즈
    <br>

- `PR 컨벤션`
  - ### 구현 기능
    - 구현한 기능을 요약하여 정리합니다.

    ### 구현 상태 (선택)
    - img, gif, video...
    - 혹은 내용 정리

    ### Resolve
    - 이슈 태그(ex: #7)

  - PR 체크 리스트
    - PR 제목 형식 : `[Type] PR 제목`
        - ex. `[Chore] 프로젝트 구조 설정`
        - 타입은 대문자로
    - label 설정
    - Code Review 요청 / 작업자 Assign
    - PR 확인한 사람은 확인 코멘트 달기. 작성자 외 1명 확인 후 마지막 사람이 merge
      
- `issue 규칙`

  - ### 1. 제목
    ``` [n주차] 페이지 | 기능 ```


  - ### 2. 본문

    ```
    ## 📜 설명
    간단한 설명을 작성해주세요

    ## ✔️ 작업 내용
    - [ ] 할 일 1
    - [ ] 할 일 2

    ## 🌟 기타
    기타 사항을 작성해주세요
    ```
    ### 3. 설정
    - Assignees : 본인
    - Labels : 작업 유형에 맞게 선택
    - Projects : bookduck-front
   
<br>

- `branch 규칙`
    - 브랜치 네이밍 규칙: `feat/#{issue 번호}`
    - 돌아가면서 리뷰
    - 이슈 생성후, branch에서 추가할 내용(ex. feat, design, refactor, ...)과 이슈번호를 branch 이름으로 생성
    - 예시: `feat/#12`, `design/#27`
    - `feat -> develop -> main(master)` 순으로 merge
    - `feat` : 각 기능을 개발하는 브랜치
    - `develop` : 각 기능의 개발을 완료하고 테스트 완료 후 병합하는 브랜치
    - `main` : 배포 브랜치
    <br>

## 실행 방법

- 0. yarn이 안깔려있다면 yarn 설치: npm을 이용한 yarn 설치
     > npm install -g yarn
- 1. yarn.lock 설치 (의존성 설치): 터미널 창에 yarn 입력
     > yarn
- 2. 실행: 터미털 창에 yarn dev 입력
     > yarn dev
- 3. 각 branch에서 pull받은 이후에는 `yarn` 으로 의존성 업데이트를 반드시 해주세요.

### 🔨 tailwind CSS 사용 참고 링크
https://tailwindcss.com/

- tailwind CSS 사이트에서 ctrl + K를 누르면 원하는 스타일을 검색할 수 있어요!
  ex) Font Style, Flex ..
