// Contract export 를 위한 javaScript
// server.js 를 통해 initialize
const contract = require('truffle-contract');

const babyChain_artifact = require('../build/contracts/BabyContract.json');
var babyChain = contract(babyChain_artifact);

module.exports = {
  addBaby : function(imagePath, etcSpfeatr, phoneNumber, age, callback) {
    console.log("**** etherApp.addBaby start ****");

    var self = this;
    babyChain.setProvider(self.web3.currentProvider);

    var babyInstance;
    self.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      console.log(account);

      babyChain.deployed().then(function(instance) {
        babyInstance = instance;
        
        return babyInstance.addBaby(imagePath, etcSpfeatr, phoneNumber, age, {from: account});
      }).then(function(result) {
        console.log(result);
        console.log("**** etherApp.addBaby end ****");

        callback(result);
      }).catch(function(e) {
          console.log(e);
      });
    });
  },

  getBabiesCount : function(callback) {
    console.log("**** etherApp.getBabiesCount start ****");

    var self = this;
    babyChain.setProvider(self.web3.currentProvider);
        
    var babyInstance;
    babyChain.deployed().then(function(instance) {
      babyInstance = instance;

      return babyInstance.getBabiesCount.call();
    }).then(function(length) {
      console.log(length);
      console.log("**** etherApp.getBabiesCount end ****");

      callback(length);
    }).catch(function(e) {
        console.log(e);
    });
  },

  getBabyById : function(id, callback) {
    console.log("**** etherApp.getBabyById start ****");

    var self = this;
    babyChain.setProvider(self.web3.currentProvider);

    var babyInstance;
    babyChain.deployed().then(function(instance) {
        babyInstance = instance;

        return babyInstance.getBabyById(id);
    }).then(function(data) {
      console.log(data);
      console.log("**** etherApp.getBabyById end ****");

      var result = module.exports.makeObject(data);
      callback(result);
    }).catch(function(e) {
      console.log(e);
    });
  },

  getBabyByImagePath : function(imagePath, callback) {
    console.log("**** etherApp.getBabyByImagePath start ****");

    var self = this;
    babyChain.setProvider(self.web3.currentProvider);
    
    var babyInstance;
    babyChain.deployed().then(function(instance) {
        babyInstance = instance;

        return babyInstance.getBabyByImagePath(imagePath);
    }).then(function(data) {
      console.log(data);
      console.log("**** etherApp.getBabyByImagePath end ****");

      var result = module.exports.makeObject(data);
      callback(result);
    }).catch(function(e) {
      console.log(e);
    });
  }, 

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
