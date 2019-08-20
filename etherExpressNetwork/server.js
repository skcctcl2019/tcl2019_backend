const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./src/etherApp.js');

const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

app.post('/addBaby', (req, res) => {
  // 이미지는 경로값만 블록에 쌓아서 upload.single('imagePath')은 필요없어 보입니다.
  // 블록 쌓기 전 따로 이미지 저장하는 함수를 만들어서 호출하는 방향이 나을거 같습니다.

  console.log("**** POST /addBaby ****");
  console.log(req.body);
  console.log(req.body.filename);
  let imagePath = req.body.imagePath;
  let etcSpfeatr = req.body.etcSpfeatr;
  let phoneNumber = req.body.phoneNumber;
  let age = req.body.age;

  truffle_connect.addBaby(imagePath, etcSpfeatr, phoneNumber, age, function(result) {
    res.send(result);
  });
});

app.get('/getBabiesCount', (req, res) => {
  console.log("**** GET /getBabiesCount ****");

  truffle_connect.getBabiesCount(function (length) {
    res.send(length);
  })
});

app.get('/getAllBabies', (req, res) => {
  console.log("**** GET /getAllBabies ****");

  var arr = [];
  truffle_connect.getBabiesCount(function (length) {
    for(var i=0; i<length; i++) {
      truffle_connect.getBabyById(i, function (data) {
        arr.push(data);

        if(arr.length==length) {
          res.send(arr);
        }
      })
    }
  })
});

app.post('/getBabyById', (req, res) => {
  console.log("**** POST /getBabyById ****");
  console.log(req.body);
  let id = req.body.id;

  truffle_connect.getBabyById(id, function (data) {
    res.send(data);
  })
});

app.post('/getBabyByImagePath', (req, res) => {
  console.log("**** POST /getBabyByImagePath ****");
  console.log(req.body);
  let imagePath = req.body.imagePath;

  truffle_connect.getBabyByImagePath(imagePath, function (data) {
    res.send(data);
  })
});

app.listen(port, () => {
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  console.log("Express Listening at http://localhost:" + port);
});
