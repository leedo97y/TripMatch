# Trip Match

- 믿을 수 있는 여행 동행자를 구하는 사이트
- [링크](https://web-trip-match-1b5xkk2fldeum3x7.gksl2.cloudtype.app/) <br>
  ![QR](https://res.cloudinary.com/dnow6qfd8/image/upload/v1672332941/qr_lpuiw1.png)

## 서비스 구성 안내

## 1. 서비스 소개

[시연영상](https://user-images.githubusercontent.com/102281327/210049115-1b05a2d7-9bfa-48df-a48e-c03cd09b461b.mov)

- 기술 스택
  ![img](https://res.cloudinary.com/dnow6qfd8/image/upload/v1672301273/2022-12-29_17_03_48_eadleu.png)

  - rtk query: redux를 이미 사용하고 있었지만, 이미 작성한 데이터 패치 로직을 분리하고 단순화하고 axios intercepter를 적용하기 위해 rtk query의 기존 fetchBaseQuery를 axiosBaseQuery로 커스텀.
  - bcrypt: 회원 비밀번호를 암호화해서 DB에 보관하기 위해 사용.
  - nanoid: MongoDB CRUD에 \_id 대신 사용하고, 이메일 인증번호 및 임시 비밀번호를 발급하기 위해 사용.
  - request: 공공데이터포털의 open API를 요청하기 위해 사용.
  - yamljs: 스웨거 API 문서를 작성한 .yaml 파일을 불러오기 위해 사용.

- [공공데이터포탈 open API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15101578)

## 2. 서비스 주요 기능 설명

- 주요 기능 및 서브 기능 소개

  - 유저 관련 기능
    - 로그인
      - 비밀번호 찾기
    - 회원가입(필수 값 \* 표시)
      ![회원가입](https://user-images.githubusercontent.com/102281327/209988431-6d0d497a-6793-4f25-a8c0-ae31bc54e486.gif)
    - 마이페이지
      - 유저의 동행 횟수, 점수 조회
      - 유저 정보 수정 및 탈퇴
        ![회원정보](https://user-images.githubusercontent.com/102281327/209990732-e101a5a0-7dfd-427d-87db-ad8d62c85a46.gif)
      - 작성 게시글 내역 조회
        - 모집중, 모집 마감 수정
        - 제목, 지역, 기간, 모집상태 조회
      - 댓글 단 게시글 내역 조회
      - 신청 받은 내역 조회
        - 수락, 거절
      - 신청한 내역 조회
        - 신청 상태(대기중, 거절, 수락) 조회
        - 대기중 시 신청 취소 가능
        - 수락 시 연락 수단 조회 가능
          - 수락 후 여행 기간이 끝난 뒤에 7일 이내 리뷰 작성
          - 모달을 통해 동행자에 대한 별점을 남길 수 있음
  - 위시리스트
    ![좋아요](https://user-images.githubusercontent.com/102281327/209991408-13036f3f-f353-46bb-9559-57f7143be83b.gif)
  - 자유게시판 (자유로운 질문 및 후기 게시판)
    - 지역별 자유게시판 게시글 조회
      - 전체, 지역별 조회
    - 게시글 작성
      - 지역 및 카테고리 설정
      - 게시글 제목 및 내용 작성
    - 게시글 상세 조회
      - 모달을 통해 작성자 상세 정보 조회
      - 댓글 작성, 수정, 삭제 가능
    - 게시글 수정 및 삭제
    - 관리자 - 게시글, 댓글 삭제
  - 동행 게시판 (동행 모집 글 게시판)
    - 지역별 게시글 전체 조회
      - 지역별, 모집 상태별 조회
      - 희망(위시 리스트) 모집글 표시
    - 게시글 작성
      - 지역, 모집 인원, 여행 기간, 희망 성별 및 나이대, 관련 사진 입력 가능
    - 게시글 상세 조회
      - 모달을 통해 작성자 상세 정보 조회
      - 동행 신청
      - 댓글 작성, 수정, 삭제 가능
    - 게시글 수정 및 삭제
    - 관리자 - 게시글, 댓글 삭제
  - 여행 정보 페이지
    ![여행정보](https://user-images.githubusercontent.com/102281327/209991706-0a4c8ffb-56ee-497d-835d-61c401c543d6.gif)
  - 관리자 페이지
    - 회원 전체 목록 조회
      - 회원 클릭 시 모달을 통해 상세 정보 조회
    - 닉네임으로 회원 검색
    - 회원 강제 탈퇴
      - 탈퇴된 회원의 게시글 및 댓글은 그대로 남고, 회원 정보에 ‘탈퇴한 회원입니다’ 표기

- 프로젝트만의 차별점, 기대 효과
  1. 여행 후 상대의 여행 점수를 평가하여 동행자 점수를 채점, 동행자 구인 시 신뢰도 향상
  2. 서로 동행 신청 동의 시, 글 작성 시 작성한 연락 수단을 공개하여 추가적인 정보 교환이 가능하도록 함

## 3. 서비스 구성도

- 피그마 [링크](https://www.figma.com/file/4bLsUoLZ1HW0FUGzgelvmP/figma-flowchart?node-id=0%3A1)
- API 명세 [링크](https://kdt-gitlab.elice.io/sw_track/class_03/web_project_2/team8/team82/-/wikis/API-%EB%AA%85%EC%84%B8)

## 4. 프로젝트 팀원 역할 분담

<table>
  <tr>
    <td align="center"><a href="https://github.com/tokkissi"><img src="https://avatars.githubusercontent.com/u/53216523?v=4" width="100px;" alt=""/><br /><b>김제원</b></a></td>
    <td align="center"><a href="https://github.com/eunbbori"><img src="https://avatars.githubusercontent.com/u/112812483?v=4" width="100px;" alt=""/><br /><b>김은채</b></a></td>
    <td align="center"><a href="https://github.com/Jiyun-Kim-5017"><img src="https://avatars.githubusercontent.com/u/113993379?v=4" width="100px;" alt=""/><br /><b>김지윤</b></a></td>
    <td align="center"><a href="https://github.com/leedo97y"><img src="https://avatars.githubusercontent.com/u/99410440?v=4" width="100px;" alt=""/><br /><b>이도연</b></a></td>
    <td align="center"><a href="https://github.com/Younngg"><img src="https://avatars.githubusercontent.com/u/98656282?v=4" width="100px;" alt=""/><br /><b>정지영</b></a></td>
    <td align="center"><a href="https://github.com/Salmambo"><img src="https://avatars.githubusercontent.com/u/102281327?v=4" width="100px;" alt=""/><br /><b>김지택</b></a></td>
  </tr>
 </table>

- 김제원: 팀장/프론트엔드 담당
  - 기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
  - 개발 단계: 프로젝트 일정관리, 의견 조율 및 위시 리스트와 유저 인증, 정보 수정 관련 페이지 완성
  - 수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비
- 김은채: 프론트엔드 담당
  - 기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
  - 개발 단계: 피그마를 기반으로 프론트 개발
  - 수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비
- 김지윤: 프론트엔드 담당
  - 기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
  - 개발 단계: 메인, 여행정보, 관리자, 검색, 별점 모달, 헤더&푸터 완성
  - 수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비
- 이도연: 프론트엔드 담당
  - 기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
  - 개발 단계: 내가 쓴 게시글 내역, 댓글 내역, 신청 받은 내역, 신청한 내역 완성
  - 수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비
- 정지영: 프론트엔드 담당
  - 기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
  - 개발 단계: 자유게시글 상세, 작성, 동행게시글 상세, 댓글, 공지사항, 기본 모달 완성, RTK query 적용
  - 수정 단계: 기획, 스크럼 진행, 코치님 피드백 반영해서 수정, 발표 준비
- 김지택: 백엔드 담당
  - 기획 단계: API 명세 작성
  - 개발 단계: 피그마를 기반으로 API 완성
  - 수정 단계: 피드백 반영해서 백엔드 설계 수정, 발표 준비

## 5. 폴더 구조

```
├── client
|   ├── public
|   └── src
|       ├── axios
|       ├── components
|       |   ├── AppButton
|       |   ├── AppInputDateRange
|       |   ├── AppInputFile
|       |   ├── AppInputRadioCheck
|       |   ├── AppInputText
|       |   ├── AppSelect
|       |   ├── AppTabContent
|       |   ├── AppTable
|       |   ├── AppTapPanel
|       |   ├── Auth
|       |   ├── Comment
|       |   ├── CommentList
|       |   ├── Editor
|       |   ├── FestivalList
|       |   ├── FreePost
|       |   ├── FreePostPreview
|       |   ├── Layout
|       |   ├── MakeMatchPostList
|       |   ├── MarkdownView
|       |   ├── Modal
|       |   ├── MyFooter
|       |   ├── MyHeader
|       |   ├── NotFound
|       |   ├── Pagination
|       |   ├── PostDetail
|       |   ├── ProfileModal
|       |   ├── Title
|       |   └── UserProfile
|       ├── images
|       ├── pages
|       |   ├── Admin
|       |   ├── FindPassword
|       |   |   └── components
|       |   ├── FreePostDetail
|       |   ├── FreePostList
|       |   ├── FreePostWrite
|       |   |   └── components
|       |   ├── Home
|       |   |   └── components
|       |   ├── Login
|       |   |   └── components
|       |   ├── MatchPostDetail
|       |   |   └── components
|       |   ├── MatchPostList
|       |   ├── MatchPostWrite
|       |   ├── MyComment
|       |   ├── MyEnroll
|       |   ├── MyPage
|       |   |   └── components
|       |   ├── NoticeDetail
|       |   ├── NoticeList
|       |   ├── NoticeWrite
|       |   |   └── components
|       |   ├── ReceivedEnroll
|       |   ├── Register
|       |   |   └── components
|       |   ├── Search
|       |   └── WishList
|       |       └── components
|       ├── slice
|       ├── store
|       ├── styles
|       ├── type
|       └── util
└── server
    └── src
        ├── controllers
        |   ├── admin
        |   └── main
        ├── interfaces
        ├── middlewares
        ├── models
        |   └── schemas
        ├── services
        ├── swagger
        ├── types
        |   └── express
        └── utils
```

## 6. 실행 방법

- 스웨거:
  1. localhost
  ```
    git clone https://kdt-gitlab.elice.io/sw_track/class_03/web_project_2/team8/team82.git
    cd team82/server
    npm install
    npm run dev 혹은 npm run start
    브라우저에서 localhost:3003/api-docs 접속
    Swagger 문서에서 API 선택하여 Try it out
    Request 양식 채워서 Execute
  ```
  2. server
  ```
    브라우저에서 kdt-sw3-team08.elicecoding.com:3003/api-docs 접속
    Swagger 문서의 Servers 탭을 http://34.64.156.80:3003/api로 변경
    API 선택하여 Try it out
    Request 양식 채워서 Execute
  ```

## 7. 버전

- 프로젝트의 버전 1.0.0
