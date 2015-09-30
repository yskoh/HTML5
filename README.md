# HTML5

게임 동작 원리


StickHero라는 유명한 폰게임 동작을 웹게임으로 구현해보기로 했다.


세부사항


- 1.가입을 한다. 닉네임, 사진을 포함 시킨다 
- 2.로그인을 한다. 
- 3.후, 게임화면으로 이동
- 4.배경음악을 재생한다.
- 5.랜덤한 배경목록 중 선택한 배경을 보여준다.
- 6.일정 높이 & 랜덤 너비의 기둥 두 개를 생성한다.
- 7.플레이어를 생성한다. 
- 8.랜덤 디스턴스 차이를 두고 생성한 기둥 두 개를 캔버스 상 위치하게 한다
- 90.기둥[0] 위에 플레이어를 올린다.
- 10.마우스를 누르면 스틱(가지 위의 새 이미지)의 길이가 길어진다 //소리 재생
- 11.마우스업이 되면 스틱이 쓰러진다
- 12.스틱의 길이가 기둥[1] 너비 + 디스턴스보다 작고, 디스턴스보다 큰지 확인한다.


- 13.사이에 속하는 값이면 플레이어가 기둥[1]로 이동한다. 
- 14.기둥[0]을 빼내고, 기둥[1]을 다시 생성
- 15.7번부터 다시 반복

아닐 경우,

- 13.fail
- 14.setTimeout 5,4,3,2,1초를 기다린다. 
- 15.6번 부터 다시 시작
- 랭킹 차트 구현


주차별 개발

2주: online/offline 및 기본 뼈대 코딩하기

3주: canvas layering, image 다루는 방법 공부 후 6,7,8,9,10 구현

4주: web audio api 공부하고 소리 재생 기능 넣기 5,11,14 구현
 
5주: passport.js혹은 session 이용하여 로그인 구현하기 1,2
