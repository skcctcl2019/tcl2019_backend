// Contract export 를 위한 javaScript
// server.js 를 통해 initialize

// ehterApp.js -> BabyContract.sol 호출
const contract = require('truffle-contract');

const MarketContract_artifact = require('../build/contracts/MarketContract.json');

var marketApp = contract(MarketContract_artifact);

module.exports = {

    purchaseMerchandise: function (merchandiseId, callback) {
        //marketApp.purchase(merchandiseId);

        console.log("**** marketEtherApp.purchaseMerchandise start ****");

        var self = this;
        marketApp.setProvider(self.web3.currentProvider);

        var marketInstance;

        self.web3.eth.getAccounts(function(error, accounts) { // accounts : Ethereum Node에 생성된 계정들의 목록
          if (error) {
            console.log("ERROR:"+error);
          }
    
          var account = accounts[0]; // 0번 계정의 주소

          console.log("ACCOUNT:" + account);
    
          marketApp.deployed().then(function(instance) {
            marketInstance = instance;
            
            // BabyContract.sol:addBaby 호출
            return marketInstance.purchaseMerchandise(merchandiseId, {from: account});

          }).then(function(result) {

            console.log("RESULT:" + result);
            console.log("**** marketEtherApp.purchaseMerchandise end ****");
    
            callback(result);

          }).catch(function(e) {
            // ERROR
            console.log(e);
          });
        });

    },

    getOwners: function () {
        let ownersList = marketApp.getOwners();

        console.log(ownersList);
    }


};