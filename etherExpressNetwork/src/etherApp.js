// Contract export 를 위한 javaScript
// server.js 를 통해 initialize
const contract = require('truffle-contract');

const babyChain_artifact = require('../build/contracts/BabyContract.json');
var babyChain = contract(babyChain_artifact);

module.exports = {
  addBaby : function(imagePath, etcSpfeatr, phoneNumber, age, callback) {
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
        callback(result);
      }).catch(function(e) {
          console.log(e);
      });
    });
  },

  getBabiesCount : function(callback) {
    var self = this;
    babyChain.setProvider(self.web3.currentProvider);
        
    var babyInstance;
    babyChain.deployed().then(function(instance) {
      babyInstance = instance;

      return babyInstance.getBabiesCount.call();
    }).then(function(length) {
      console.log(length);
      callback(length);
    }).catch(function(e) {
        console.log(e);
    });
  },

  getAllBabies : function(callback) {
    var self = this;
    babyChain.setProvider(self.web3.currentProvider);

    var babyInstance;
    babyChain.deployed().then(function(instance) {
      babyInstance = instance;

      return babyInstance.getBabiesCount.call().then(function(length) {
        for(var i=0; i<length; i++)  {
          module.exports.getBabyById(i, callback);
        }
      });
    }).catch(function(e) {
      console.log(e);
    });
  },

  getBabyById : function(id, callback) {
    var self = this;
    babyChain.setProvider(self.web3.currentProvider);

    var babyInstance;
    babyChain.deployed().then(function(instance) {
        babyInstance = instance;

        return babyInstance.getBabyById(id);
    }).then(function(data) {
      console.log(data);
      callback(data);
    }).catch(function(e) {
      console.log(e);
    });
  },

  getBabyByImagePath : function(imagePath, callback) {
    var self = this;
    babyChain.setProvider(self.web3.currentProvider);
    
    var babyInstance;
    babyChain.deployed().then(function(instance) {
        babyInstance = instance;

        return babyInstance.getBabyByImagePath(imagePath);
    }).then(function(data) {
      console.log(data);
      callback(data);
    }).catch(function(e) {
      console.log(e);
    });
  }
}
