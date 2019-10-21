/*
var BabyContract = artifacts.require("BabyContract");

module.exports = function(deployer) {
  deployer.deploy(BabyContract);
};
*/

//var BabyContract = artifacts.require("./BabyContract.sol");
var MarketContract = artifacts.require("MarketContract");

module.exports = function(deployer, network) {

  if (network == "development") {
    deployer.deploy(MarketContract);
  }
};