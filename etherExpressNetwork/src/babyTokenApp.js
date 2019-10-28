// ehterApp.js -> BabyContract.sol 호출
const contract = require('truffle-contract');

const babyToken_artifact = require('../build/contracts/BabyToken.json');

var babyTokenApp = contract(babyToken_artifact);

module.exports = {
    tokenTransfer : function (amount, callback) {

        console.log("**** babyTokenApp.tokenTransfer start ****");

        var self = this;

        babyTokenApp.setProvider(self.web3.currentProvider);

        var babyTokenInstance;

        self.web3.eth.getAccounts(function(error, accounts) {
             // accounts : Ethereum Node에 생성된 계정들의 목록
          if (error) {
            console.log("ERROR:" + error);
          }
    
          var account = accounts[0]; // 0번 계정의 주소

          console.log("ACCOUNT:" + account);
    
          babyTokenApp.deployed().then(function(instance) {
              
            babyTokenInstance = instance;
            
            // BabyContract.sol:addBaby 호출
            // 임의로 0번째 계정에서 1번째 계정으로 처리
            return babyTokenInstance.transfer(accounts[1], amount, {from: account});

          }).then(function(result) {

            console.log("RESULT:" + result);
            console.log("**** babyTokenApp.tokenTransfer end ****");
    
            callback(result);

          }).catch(function(e) {
            // ERROR
            console.log(e);
          });
        });
    },

    getBalanceOf : function(callback) {
        
        console.log("**** babyTokenApp.getBalanceOf start ****");

        var self = this;

        babyTokenApp.setProvider(self.web3.currentProvider);

        var babyTokenInstance;

        self.web3.eth.getAccounts(function(error, accounts) {
             // accounts : Ethereum Node에 생성된 계정들의 목록
          if (error) {
            console.log("ERROR:" + error);
          }
    
          var account = accounts[0]; // 0번 계정의 주소

          console.log("ACCOUNT:" + account);
    
          babyTokenApp.deployed().then(function(instance) {
              
            babyTokenInstance = instance;
            
            // BabyContract.sol:addBaby 호출
            // 임의로 0번째 계정에서 1번째 계정으로 처리
            return babyTokenInstance.balanceOf(accounts[0]);

          }).then(function(result) {

            console.log("RESULT:" + result);
            console.log("**** babyTokenApp.getBalanceOf end ****");
    
            callback(result);

          }).catch(function(e) {
            // ERROR
            console.log(e);
          });
        });
    },

    getTotalSupply : function (callback) {
        console.log("**** babyTokenApp.getTotalSupply start ****");

        var self = this;

        babyTokenApp.setProvider(self.web3.currentProvider);

        var babyTokenInstance;

        self.web3.eth.getAccounts(function(error, accounts) {
             // accounts : Ethereum Node에 생성된 계정들의 목록
          if (error) {
            console.log("ERROR:" + error);
          }
    
          var account = accounts[0]; // 0번 계정의 주소

          console.log("ACCOUNT:" + account);
    
          babyTokenApp.deployed().then(function(instance) {
              
            babyTokenInstance = instance;
            
            // BabyContract.sol:addBaby 호출
            // 임의로 0번째 계정에서 1번째 계정으로 처리
            return babyTokenInstance.totalSupply();

          }).then(function(result) {

            console.log("RESULT:" + result);
            //console.log(typeof(result));
            console.log("**** babyTokenApp.getTotalSupply end ****");

            callback(result);
            //callback(convertAmt);

          }).catch(function(e) {
            // ERROR
            console.log(e);
          });
        });
    }
    
};