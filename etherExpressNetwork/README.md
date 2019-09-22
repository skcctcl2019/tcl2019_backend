# Source
* Directory
  - etherExpressNetwork [root]<br>
    + /build/contracts : Compile 된 Solidity(JSON Format)<br>
    + /contracts : Solidity File<br>
    + /migrations : truffle을 통해 구성된 TestNetwork에 Solidity File을 Migrate 할 때 사용 하는 Javascript<br>
    + /node_modules : 서비스 구성을 위한 node Library<br>
    + /public/gallery : Web Site Source<br>
    + /public/lib : Web Site 구성에서 필요한 node Library<br>
    + /src : server.js 에서 import 를 위해 구성되고 있는 Javascript<br>
    + /src/pythonAI : AI이미지인식모델 구성을 위한 Python Library<br>
    + /test : truffle을 이용하여, Solidity Test시 사용되는 test Solidity<br>
    + /uploads : upload된 사진파일 저장소(임시)<br>
    + /server.js : EntryPoint로 사용되는 JavaScript - Route 및 Express Load를 모두 처리 중<br>
    + /truffle-config.js : truffle 연계를 위한 config File<br>
         
# Document
* 실행방법
  - 선행설치내역<br>
    npm install을 통해 package.json 내의 dependencies의 설치 필요<br>
    (추가)python 호출을 위한 python-shell 추가<br>
    ganache-cli 또는 ganache winapp 설치 필요<br>
    chrome 또는 firefox를 통해 구동되는 meta-mask 설치<br>
  - 수행방법<br>
    + 파일 동기화<br>
    + ganache & metamask 구동<br>
    + truffle compile<br>
    + truffle migrate<br>
      + solidity 파일이 변경되거나, 정상적으로 migrate가 수행되지 않는 경우 truffle migrate --reset 명령으로 구동<br>
    + nodemon server.js<br>
    + http://localhost:3000 접속(metamask가 구동되고 있는 browser를 통한 접속)<br>


***

# LAST MODIFIED BY BKMH 2019.09.22
