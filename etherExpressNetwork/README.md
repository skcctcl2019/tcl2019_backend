# Document
* 실행방법
  - 선행설치내역<br>
    npm install을 통해 package.json 내의 dependencies의 설치 필요<br>
    ganache-cli 또는 ganache winapp 설치 필요<br>
    chrome 또는 firefox를 통해 구동되는 meta-mask 설치<br>
  - 수행방법<br>
    1. 파일 동기화<br>
    2. ganache & metamask 구동<br>
    3. truffle compile<br>
    4. truffle migrate<br>
    4.1. solidity 파일이 변경되거나, 정상적으로 migrate가 수행되지 않는 경우 truffle migrate --reset 명령으로 구동
    5. nodemon server.js
    6. http://localhost:3000 접속(metamask가 구동되고 있는 browser를 통한 접속)

***

# MODIFIED BY BKMH 2019.08.19