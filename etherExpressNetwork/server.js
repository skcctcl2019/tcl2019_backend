const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');

// BabyContract.sol 호출을 위한 js import
const truffle_connect = require('./src/etherApp.js');

// 2019.09.22 BKMH 변경 - python 파일 호출을 위한 js import 추가
const call_python = require('./src/callPython.js');

// 2019.10.08 BKMH 변경 - MarketContract.sol 호출을 위한 js import
const market_connect = require('./src/marketEtherApp.js');

const bodyParser = require('body-parser');
const multer = require('multer');
//const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crpyto = require('crypto');


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
    let dir = path.join(__dirname, '/uploads/');
    !fs.existsSync(dir) && fs.mkdirSync(dir); // 폴더가 없을 경우 생성
    cb(null, dir);
  },

  // 사용자 전송한 파일의 파일명
  // filename 속성을 입력하지 않으면, multer에서 자동으로 파일명을 중복되지 않도록 생성해주나,
  // 파일의 확장자가 없어지므로, 확장자를 함께 입력하면서, 중복되지 않은 파일명을 생성하도록 입력
  filename: function (req, file, cb) {

    // crypto 함수를 통해 18byte의 random 문자열 생성
    let customFileName = crpyto.randomBytes(18).toString('hex');
    
    console.log(file.mimetype);

    if (file.mimetype.split('/')[0] != 'image') {
      throw new Error('This file is not Image');
    }
    
    let extension = file.mimetype.split('/')[1];

    // mimetype 이 image/jpeg인 경우에도 .jpg 파일로 생성
    if (extension == 'jpeg') {
      extension = 'jpg';
    }

    cb(null, customFileName + "." + extension);


    // cb(null, file.originalname);
    //cb(null, new Date().valueOf() + '_' + file.originalname); // 타임스탬프_원본파일명
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
  //res.sendFile(path.join(__dirname, '/public/indexTest.html'));
  res.sendFile(path.join(__dirname, '/public/gallery/index.html'));
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
  // call_python.callTest([req.file.path], function(result) {
  call_python.callPython([req.file.path], function(result) {

    let data = result[0];
    let featuresDir = path.join(__dirname, '/features/');
    let filename = req.file.filename.split('.')[0];
    let etcSpfeatr = req.body.etcSpfeatr;
    let phoneNumber = req.body.phoneNumber;
    let age = req.body.age;

    console.log(filename);
    console.log(etcSpfeatr);
    console.log(phoneNumber);
    console.log(age);

    !fs.existsSync(featuresDir) && fs.mkdirSync(featuresDir); // 폴더가 없을 경우 생성
    // fs.writeFile(featuresDir+filename, data, 'utf8', function(err) { // Async
    //   console.log('Write File Completed');
    // });
    fs.writeFileSync(featuresDir + filename + '.dat', data, 'utf8'); // Sync

    // addBaby 호출
    addBaby(res, filename, etcSpfeatr, phoneNumber, age);
  });
});

function addBaby(res, filename, etcSpfeatr, phoneNumber, age) {
  truffle_connect.addBaby(filename, etcSpfeatr, phoneNumber, age, function(result) {
    console.log("======= truffle.addBaby complete ======");
    console.log(result);
    
    res.status(200).send('<script type="text/javascript">alert("등록되었습니다.");location.href="/";</script>');
  });
}

// etherApp.js:getBabiesCount 호출
app.get('/getBabiesCount', (req, res) => {
  console.log("**** GET /getBabiesCount ****");

  truffle_connect.getBabiesCount(function (length) {
    res.send(length);
  });
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
      });
    }
  });
});

// etherApp.js:getBabyById 호출
app.post('/getBabyById', (req, res) => {
  console.log("**** POST /getBabyById ****");
  console.log(req.body);
  let id = req.body.id;

  truffle_connect.getBabyById(id, function (data) {
    res.send(data);
  });
});

// etherApp.js:getBabyByFilename 호출
app.post('/getBabyByFilename', (req, res) => {
  console.log("**** POST /getBabyByFilename ****");
  console.log(req.body);
  let filename = req.body.filename;

  truffle_connect.getBabyByFilename(filename, function (data) {
    res.send(data);
  });
});

// Market 연계 Sample 처리를 위한 router 분리
app.post('/purchaseMerchandise', (req, res) => {
  console.log("**** POST /purchaseMerchandise ****");
  console.log(req.body.merchandiseId);

  let merchandiseId = req.body.merchandiseId;

  market_connect.purchaseMerchandise(merchandiseId, function (data) {
    res.send(data);
  });


});

app.post('/getSimilarity', upload.single('filename'), (req, res) => {
  console.log("**** POST /getSimilarity ****");
  console.log(req.body);
  console.log(req.file);

  // multer를 이용하여 파일 처리를 수행하면 file의 경로를 기준으로 처리할 것.
  // 처리 시 만약 오류가 발생하는 경우, 파일 핸들링에 대해서도 롤백처리하는 로직 필요함.
  if(req.file == null) {
    return;
  }

  // Python을 통한 이미지 특징점 가져오기
  call_python.callPython([req.file.path], function(result) {

    let data = result[0];
    let featuresDir = path.join(__dirname, '/features/');
    let filename = req.file.filename.split('.')[0];

    !fs.existsSync(featuresDir) && fs.mkdirSync(featuresDir); // 폴더가 없을 경우 생성
    // fs.writeFile(featuresDir+filename, data, 'utf8', function(err) { // Async
    //   console.log('Write File Completed');
    // });
    fs.writeFileSync(featuresDir + filename + '.dat', data, 'utf8'); // Sync

    let resultArray = [];
    var array1;
    var array2;

    // 입력된 image 특징점 배열화
    var featureData1 = data.replace(/\s/gi, "");
    if('[' == featureData1.charAt(0)) {
      featureData1 = featureData1.substring(1);
    }
    if(']' == featureData1.charAt(featureData1.length-1)) {
      featureData1 = featureData1.slice(0,-1);
    }
    array1 = featureData1.split(',');

    truffle_connect.getBabiesCount(function (length) {
      // etherApp.js:getBabiesCount만큼 반복해서 전체 Babies 내용 가져오기
      for(var i=0; i<length; i++) {
        truffle_connect.getBabyById(i, function (data) {

          // 저장된 image 특징점 배열화
          var featureData2 = fs.readFileSync(featuresDir + data.filename + ".dat", 'utf8');
          featureData2 = featureData2.replace(/\s/gi, "");
          if('[' == featureData2.charAt(0)) {
            featureData2 = featureData2.substring(1);
          }
          if(']' == featureData2.charAt(featureData2.length-1)) {
            featureData2 = featureData2.slice(0,-1);
          }
          array2 = featureData2.split(',');

          var p = cosinesim(array1,array2); // 특징점 비교
          console.log(i + '\'s p:' + p);

          resultArray.push([data.filename,p]); // i번째 data 저장
  
          if(resultArray.length==length) { // 갯수가 채워지면 결과 반환
            // TO-DO 결과 출력용 페이지가 필요
            var val = '';
            for(var j=0; j<resultArray.length; j++) {
              val += resultArray[j][0] + " : [ " + resultArray[j][1] + ' ]\\n';
            }
            
            res.status(200).send(
              '<script type="text/javascript">'
              +'alert(\''+val+'\');'
              +'location.href="/";'
              +'</script>'
            );
          }
        });
      }
    });
  });
});

function cosinesim(A,B){
  var dotproduct=0;
  var mA=0;
  var mB=0;
  for(i = 0; i < A.length; i++){ // here you missed the i++
      dotproduct += (A[i] * B[i]);
      mA += (A[i]*A[i]);
      mB += (B[i]*B[i]);
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  var similarity = (dotproduct)/((mA)*(mB)) // here you needed extra brackets
  return similarity;
}

// node.js 서버 생성(PORT:3000)
app.listen(port, () => {
  // Ganache 서버 연결(PORT:7545)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  console.log("Express Listening at http://localhost:" + port);
});
