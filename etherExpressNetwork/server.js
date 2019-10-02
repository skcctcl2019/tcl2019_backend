const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');

// BabyContract.sol 호출을 위한 js import
const truffle_connect = require('./src/etherApp.js');

// 2019.09.22 BKMH 변경 - python 파일 호출을 위한 js import 추가
const call_python = require('./src/callPython.js');

const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');


// For ENOENT Error Debugging
// 해당 함수를 통해 실제 누락되는 부분에 대해 확인 가능함
(function() {
  var childProcess = require("child_process");
  var oldSpawn = childProcess.spawn;
  function mySpawn() {
      console.log('spawn called');
      console.log(arguments);
      var result = oldSpawn.apply(this, arguments);
      return result;
  }
  childProcess.spawn = mySpawn;
})();

// multer storage setup
var _storage = multer.diskStorage({
  // 사용자가 전송한 파일의 저장위치
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '/uploads/'));
  },

  // 사용자 전송한 파일의 파일명
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: _storage });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public'));

// ROOT Page 호출
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/indexTest.html'));
  // res.sendFile(path.join(__dirname, '/public/gallery/index.html'));
});

// etherApp.js:addBaby로 etherBlock 저장
// upload.single로 이미지파일을 서버에 저장
app.post('/addBaby', upload.single('filename'), (req, res) => {
  // BKMH - post 방식을 통해 호출할 때 multer middleware를 통해 자동으로 파일이 저장되는 구조로
  // 변경했습니다 - 기존 upload.single('filename') 가 파일 저장을 자동으로 처리합니다.

  console.log("**** POST /addBaby ****");
  console.log(req.body);
  console.log(req.file);

  // multer를 이용하여 파일 처리를 수행하면 file의 경로를 기준으로 처리할 것.
  // 처리 시 만약 오류가 발생하는 경우, 파일 핸들링에 대해서도 롤백처리하는 로직 필요함.
  if(req.file == null) {
    return;
  }

  // Python을 통한 이미지 특징점 가져오기
  // call_python.callPython();

  // addBaby 호출
  let filename = req.file.filename.split('.')[0];
  let etcSpfeatr = req.body.etcSpfeatr;
  let phoneNumber = req.body.phoneNumber;
  let age = req.body.age;

  console.log(filename);
  console.log(etcSpfeatr);
  console.log(phoneNumber);
  console.log(age);

  // addBaby(filename, etcSpfeatr, phoneNumber, age);
});

function addBaby(filename, etcSpfeatr, phoneNumber, age) {
  truffle_connect.addBaby(filename, etcSpfeatr, phoneNumber, age, function(result) {
    console.log("======= truffle.addBaby complete ======");
    console.log(result);
    
    res.send('<script type="text/javascript">alert("등록되었습니다.");</script>');
  });
}

// etherApp.js:getBabiesCount 호출
app.get('/getBabiesCount', (req, res) => {
  console.log("**** GET /getBabiesCount ****");

  truffle_connect.getBabiesCount(function (length) {
    res.send(length);
  })
});

// etherApp.js:getBabyById 호출(전체 ID 수만큼 호출(etherApp.js:getBabiesCount))
app.get('/getAllBabies', (req, res) => {
  console.log("**** GET /getAllBabies ****");

  var arr = [];
  truffle_connect.getBabiesCount(function (length) {
    // etherApp.js:getBabiesCount만큼 반복해서 전체 Babies 내용 가져오기
    for(var i=0; i<length; i++) {
      truffle_connect.getBabyById(i, function (data) {
        arr.push(data); // i번째 data 저장

        if(arr.length==length) { // 갯수가 채워지면 결과 반환
          res.send(arr);
        }
      })
    }
  })
});

// etherApp.js:getBabyById 호출
app.post('/getBabyById', (req, res) => {
  console.log("**** POST /getBabyById ****");
  console.log(req.body);
  let id = req.body.id;

  truffle_connect.getBabyById(id, function (data) {
    res.send(data);
  })
});

// etherApp.js:getBabyByFilename 호출
app.post('/getBabyByFilename', (req, res) => {
  console.log("**** POST /getBabyByFilename ****");
  console.log(req.body);
  let filename = req.body.filename;

  truffle_connect.getBabyByFilename(filename, function (data) {
    res.send(data);
  })
});

// node.js 서버 생성(PORT:3000)
app.listen(port, () => {
  // Ganache 서버 연결(PORT:7545)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  console.log("Express Listening at http://localhost:" + port);
});
