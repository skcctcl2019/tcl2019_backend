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

// 2019.10.21 BKMH 변경 - BabyToken.sol 호출을 위한 js import
const babyToken_connect = require('./src/babyTokenApp.js')

const bodyParser = require('body-parser');
const multer = require('multer');
//const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crpyto = require('crypto');
const request = require('request');
const utf8 = require('utf8');

const IS_SAVING_COMPAIRE_IMAGE_DATA = 'N';
const THRESHOLD = 0;

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

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/indexTest.html'));
});

app.get('/imgs', (req, res) => {
  console.log("**** GET /imgs ****");

  var extension = req.query.filename.split('.').pop();
  var isImage, contentType;

  switch(extension){
    case "jpg":
        contentType = 'image/jpg';
        isImage = true;
        break;
    case "png":
        contentType = 'image/png';
        isImage = true;
        break;
    default:
        isImage = false;
        break;
  }

  if(isImage) {
    fs.readFile(path.join(__dirname, '/uploads/')+req.query.filename, function(error, data) {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data, 'binary');
    });
  }
});

// etherApp.js:addBaby로 etherBlock 저장
// upload.single로 이미지파일을 서버에 저장
//app.post('/addBaby', upload.single('filename'), (req, res) => {
app.post('/addBaby', upload.single('imagePath'), (req, res) => {
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

  let types = (req.body.types == undefined) ? 'B' : req.body.types; // 실종 아동:M, 보호 아동:P, 사전 정보 등록:B
  let filename = req.file.filename;// .split('.')[0]; // 이미지 불러올 때 확장자도 필요해서 넘깁니다.
  //let name = (req.body.name == undefined) ? '' : req.body.name;
  let name = (req.body.babyName == undefined) ? '' : req.body.babyName;
  let phoneNumber = (req.body.phoneNumber == undefined) ? '' : req.body.phoneNumber;
  let etcSpfeatr = (req.body.etcSpfeatr == undefined) ? '' : req.body.etcSpfeatr;
  let age = isNaN(parseInt(req.body.age)) ? 0 : parseInt(req.body.age);

  console.log(types);
  console.log(filename);
  console.log(name);
  console.log(phoneNumber);
  console.log(etcSpfeatr);
  console.log(age);

  // Python을 통한 이미지 특징점 가져오기
  // call_python.callTest([req.file.path], function(result) {
  call_python.callPython([req.file.path], function(result) {

    let data = result[0];
    let featuresDir = path.join(__dirname, '/features/');

    !fs.existsSync(featuresDir) && fs.mkdirSync(featuresDir); // 폴더가 없을 경우 생성
    // fs.writeFile(featuresDir+filename, data, 'utf8', function(err) { // Async
    //   console.log('Write File Completed');
    // });
    fs.writeFileSync(featuresDir + filename + '.dat', data, 'utf8'); // Sync

    // addBaby 호출
    addBaby(res, types, filename, name, phoneNumber, etcSpfeatr, age);

  });

   // addBaby를 통해 정상적으로 수행된 후, transfer를 통해 token 전송
   // 전송 token 100
   // 0 account : _mint, 1 account : 받는 account
  babyToken_connect.tokenTransfer("0", "1", 100, function (data) {
    console.log("****** babyToken_connect.tokenTransfer END *****");
    console.log(data);
  });


});

function addBaby(res, types, filename, name, phoneNumber, etcSpfeatr, age) {
  truffle_connect.addBaby(types, filename, name, phoneNumber, etcSpfeatr, age, function(result) {
    console.log("======= truffle.addBaby complete ======");
    console.log(result);
    
    // res.status(200).send('<script type="text/javascript">alert("등록되었습니다.");location.href="/";</script>');
    res.send(result);
  });
}

// etherApp.js:getBabiesCount 호출
app.get('/getBabiesCount', (req, res) => {
  console.log("**** GET /getBabiesCount ****");

  truffle_connect.getBabiesCount(function (length) {

    // 출력양식을 맞추기 위해 숫자형식으로 출력

    let convertLength = showNumComma(length.toString());

    res.send(convertLength);
  });
});

// etherApp.js:getBabyById 호출(전체 ID 수만큼 호출(etherApp.js:getBabiesCount))
app.get('/getAllBabies', (req, res) => {
  console.log("**** GET /getAllBabies ****");

  var resultArray = [];
  truffle_connect.getBabiesCount(function (length) {
    // etherApp.js:getBabiesCount만큼 반복해서 전체 Babies 내용 가져오기
    if(length < 1) {
      res.send(resultArray);
    } else {
      for(var i=0; i<length; i++) {
        truffle_connect.getBabyById(i, function (data) {
          resultArray.push(data); // i번째 data 저장
  
          if(resultArray.length==length) { // 갯수가 채워지면 결과 반환
            res.send(resultArray);
          }
        });
      }
    }
  });
});

// etherApp.js:getBabyById 호출
app.post('/getBabyById', (req, res) => {
  console.log("**** POST /getBabyById ****");
  console.log(req.body);
  let id = req.body.id;
  let sim = (req.body.sim == undefined) ? '' : req.body.sim;

  truffle_connect.getBabyById(id, function (data) {
    if(sim != '') {
      data['sim'] = sim;
    }
    
    res.send(data);
  });
});

// etherApp.js:getBabyByFilename 호출
app.post('/getBabyByFilename', (req, res) => {
  console.log("**** POST /getBabyByFilename ****");
  console.log(req.body);
  let filename = req.body.filename;
  let sim = (req.body.sim == undefined) ? '' : req.body.sim;

  truffle_connect.getBabyByFilename(filename, function (data) {
    if(sim != '') {
      data['sim'] = sim;
    }
    
    res.send(data);
  });
});

// Market 연계 Sample 처리를 위한 router 분리
app.post('/purchaseMerchandise', (req, res) => {
  console.log("**** POST /purchaseMerchandise ****");
  console.log(req.body);
  console.log(req.body.merchandiseId);
  console.log(req.body.merchandisePrice);

  let merchandiseId = req.body.merchandiseId;
  let merchandisePrice = req.body.merchandisePrice;

  market_connect.purchaseMerchandise(merchandiseId, function (response) {
    // 연속으로 처리하기 위한 함수 선언
    console.log(response);

    // 마켓을 통해 구매를 수행하는 경우에도, transfer를 통해 금액 전달
    // address[1] : 사전등록을 통해 잔고변경
    // address[2] : 물건 판매에 따른 수익증가로 인한 잔액 변경
    babyToken_connect.tokenTransfer("1", "2", merchandisePrice, function (data) {
      res.send(data);
    });

  });

  


});

app.post('/getSimilarity', upload.single('imagePath'), (req, res) => {
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

    // 비교 이미지 특징점 저장 여부에 따라 수행
    if('Y' == IS_SAVING_COMPAIRE_IMAGE_DATA) {
      // 특징점 데이터 저장
      !fs.existsSync(featuresDir) && fs.mkdirSync(featuresDir); // 폴더가 없을 경우 생성
      // fs.writeFile(featuresDir+filename, data, 'utf8', function(err) { // Async
      //   console.log('Write File Completed');
      // });
      fs.writeFileSync(featuresDir + filename + '.dat', data, 'utf8'); // Sync
    } else {
      // 비교한 이미지 삭제
      fs.unlinkSync(req.file.path);
    }

    let resultArray = [];
    var array1;
    var array2;
    var cnt = 0;

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
      if(length < 1) {
        res.send(resultArray);
      } else {
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
            console.log(data.filename + '\'s p:' + p);
  
            resultArray.push([data.filename, p]); // 특징점 비교 결과 저장
            cnt++;
    
            if(cnt==length) { // 갯수가 채워지면 결과 반환
              if(length>1) {
                resultArray.sort(function(a, b) {
                  return b[1] - a[1]; // 내림차순 정렬
                });
              }
              for(var j=0; j<length; j++) { // 기준점 이하 삭제
                if(resultArray[j][1] < THRESHOLD) {
                  resultArray.splice(j, Number.MAX_VALUE);
                  break;
                }
              }
  
              res.send(resultArray);
            }
          });
        }
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

// 경찰청 DB 조회
app.get('/getSafe182', (req, res) => {
  console.log("**** GET /getSafe182 ****");
  console.log(req.query);

  var esntlId = '10000278'; // 고유아이디
  var authKey = 'a8385e01c218421c'; //인증키
  var rowSize = '100';  // 게시물 수(숫자만 100개 까지)
  // var page = '1'; // 페이징처리 필요(숫자만)

  var url = 'http://www.safe182.go.kr/api/lcm/findChildList.do';
  url += '?esntlId='
  url += esntlId;
  url += '&authKey='
  url += authKey;
  url += '&rowSize='
  url += rowSize;
  // url += '&page='
  // url += page;

  if(undefined != req.query.writngTrgetDscds) { // 대상구분
    if(Array.isArray(req.query.writngTrgetDscds)) {
      for(var i=0; i<req.query.writngTrgetDscds.length; i++) {
        url += '&writngTrgetDscds=';
        url += req.query.writngTrgetDscds[i];
      }
    } else {
      url += '&writngTrgetDscds=';
        url += req.query.writngTrgetDscds;
    }
  }
  if(undefined != req.query.sexdstnDscd) {  // 성별(남자:1, 여자:2)
    url += '&sexdstnDscd=';
    url += req.query.sexdstnDscd;
  }
  if(undefined != req.query.nm) {  // 성명
    url += '&nm=';
    url += req.query.nm;
  }
  if(undefined != req.query.detailDate1) {  // 발생일(2012-08-17)
    url += '&detailDate1=';
    url += req.query.detailDate1;
  }
  if(undefined != req.query.detailDate2) {  // 발생일(2012-08-18)
    url += '&detailDate2=';
    url += req.query.detailDate2;
  }
  if(undefined != req.query.age1) {  // 나이(숫자만)
    url += '&age1=';
    url += req.query.age1;
  }
  if(undefined != req.query.age2) {  // 나이(숫자만)
    url += '&age2=';
    url += req.query.age2;
  }
  if(undefined != req.query.etcSpfeatr) {  // 특이사항
    url += '&etcSpfeatr=';
    url += req.query.etcSpfeatr;
  }
  if(undefined != req.query.occrAdres) {  // 발생장소
    url += '&occrAdres=';
    url += req.query.occrAdres;
  }
  
  console.log("url:"+url);
  console.log("url:"+utf8.encode(url));
  
  request.get({
    url: utf8.encode(url)
  }, function(error, response, body) {
    res.json(body);
  });
  
});

// Token 연계 테스트를 위한 Router 분리
// token 을 실제로 metamask를 이용하여 연결하려면, 테스트넷에 연계하고, 해당 정보를 기준으로
// web3를 따로 연결할 필요가 있음.
app.post('/tokenTransfer', (req, res) => {
  console.log("**** POST /tokenTransfer ****");
  console.log(req.body.amount);

  let fromAccountIdx = req.body.fromAccountIdx;
  let toAccountIdx   = req.body.toAccountIdx;
  let transferAmount = req.body.amount;

  babyToken_connect.tokenTransfer(fromAccountIdx, toAccountIdx, transferAmount, function (data) {

    res.send(data);
  });

});

app.get('/getBalance', (req, res) => {

  console.log("**** GET /getBalance ****");

  console.log(req.query.tgtAccountIdx);

  let tgtAccountIdx = req.query.tgtAccountIdx;

  console.log("tgtAccountIdx : " + tgtAccountIdx);

  babyToken_connect.getBalanceOf(tgtAccountIdx, function (data) {
    
    let convertAmt = showNumComma(data.toString() / 1E18);

    res.send(convertAmt);
  });
  
});

app.get('/getTotalSupply', (req, res) => {
  console.log("**** GET /getTotalSupply ****");

  babyToken_connect.getTotalSupply(function (data) {
    console.log(data);

    // on decimal Points is 18
    //let convertAmt = Web3.fromWei(data.toNumber(), "ether") / 1E18;
    let convertAmt = showNumComma(data.toString() / 1E18);

    res.send(convertAmt);
  });
});


// 금액 표시 2 (ex) 10000 -> 10,000) 
function showNumComma(data) {
  var pattern = /(-?[0-9]+)([0-9]{3})/;
  var value = String(data).replace(/[^0-9\,]/g, "");

  value = value.replace(/,/g, '');

  while(pattern.test(value)) {
    value = value.replace(pattern,"$1,$2"); 
  }
  
  return value; 
}

// node.js 서버 생성(PORT:3000)
app.listen(port, () => {
  // Ganache 서버 연결(PORT:7545)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  market_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  babyToken_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

  console.log("Express Listening at http://localhost:" + port);
});
