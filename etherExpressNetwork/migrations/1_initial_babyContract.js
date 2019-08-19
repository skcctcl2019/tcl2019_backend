/*
var BabyContract = artifacts.require("BabyContract");

module.exports = function(deployer) {
  deployer.deploy(BabyContract);
};
*/

var BabyContract = artifacts.require("../contracts/BabyContract.sol");

module.exports = function(deployer) {
  deployer.deploy(BabyContract);
};