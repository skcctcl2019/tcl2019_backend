var BabyContract = artifacts.require("BabyContract");

module.exports = function(deployer) {
  deployer.deploy(BabyContract);
};