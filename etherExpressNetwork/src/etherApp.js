// Contract export 를 위한 javaScript
// server.js 를 통해 initialize

// ehterApp.js -> BabyContract.sol 호출
const contract = require('truffle-contract');

const babyChain_artifact = require('../build/contracts/BabyContract.json');
var babyChain = contract(babyChain_artifact);

module.exports = {
  // Baby 등록 호출
  addBaby : function(imagePath, etcSpfeatr, phoneNumber, age, callback) {
    console.log("**** etherApp.addBaby start ****");

    var self = this;
    babyChain.setProvider(self.web3.currentProvider);
    var babyInstance;
    self.web3.eth.getAccounts(function(error, accounts) { // accounts : Ethereum Node에 생성된 계정들의 목록
      if (error) {
        console.log("ERROR:"+error);
      }

      var account = accounts[0]; // 0번 계정의 주소
      console.log("ACCOUNT:"+account);

      babyChain.deployed().then(function(instance) {
        babyInstance = instance;
        
        // BabyContract.sol:addBaby 호출
        return babyInstance.addBaby(imagePath, etcSpfeatr, phoneNumber, age, {from: account});
      }).then(function(result) {
        console.log("RESULT:"+result);
        console.log("**** etherApp.addBaby end ****");

        callback(result);
      }).catch(function(e) {
        // ERROR
        console.log(e);
      });
    });
  },

  // babies length 출력
  getBabiesCount : function(callback) {
    console.log("**** etherApp.getBabiesCount start ****");

    var self = this;
    babyChain.setProvider(self.web3.currentProvider);
        
    var babyInstance;
    babyChain.deployed().then(function(instance) {
      babyInstance = instance;

      // BabyContract.sol:getBabiesCount 호출
      return babyInstance.getBabiesCount.call();
    }).then(function(length) {
      console.log("LENGTH:"+length);
      console.log("**** etherApp.getBabiesCount end ****");

      callback(length);
    }).catch(function(e) {
      // ERROR 
      console.log(e);
    });
  },

  // babies Index 입력 ->  Baby 객체 내 전 항목 값 출력
  getBabyById : function(id, callback) {
    console.log("**** etherApp.getBabyById start ****");

    var self = this;
    babyChain.setProvider(self.web3.currentProvider);

    var babyInstance;
    babyChain.deployed().then(function(instance) {
        babyInstance = instance;

        // BabyContract.sol:getBabyById 호출
        return babyInstance.getBabyById(id);
    }).then(function(data) {
      console.log("DATA:"+JSON.stringify(data));
      console.log("**** etherApp.getBabyById end ****");

      var result = module.exports.makeObject(data);
      
      callback(result);
    }).catch(function(e) {
      // ERROR
      console.log(e);
    });
  },

  // 이미지경로 입력 ->  Baby 객체 내 전 항목 값 출력
  getBabyByImagePath : function(imagePath, callback) {
    console.log("**** etherApp.getBabyByImagePath start ****");

    var self = this;
    babyChain.setProvider(self.web3.currentProvider);
    
    var babyInstance;
    babyChain.deployed().then(function(instance) {
        babyInstance = instance;

        // BabyContract.sol:getBabyByImagePath 호출
        return babyInstance.getBabyByImagePath(imagePath);
    }).then(function(data) {
      console.log("DATA:"+JSON.stringify(data));
      console.log("**** etherApp.getBabyByImagePath end ****");

      var result = module.exports.makeObject(data);

      callback(result);
    }).catch(function(e) {
      // ERROR
      console.log(e);
    });
  }, 

  // Baby 구조체 내용 출력
  makeObject : function(data) {
    var result = {
      'imagePath' : data.imagePath,
      'etcSpfeatr' : data.etcSpfeatr,
      'phoneNumber' : data.phoneNumber,
      'age' : data.age.toNumber()
    };

    return result;
  }
}
