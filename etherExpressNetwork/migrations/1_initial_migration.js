
// Migrations.sol 파일은 실제 truffle migrate를 위해 반드시 필요한 파일로 수정이 필요하지 않음.
// 다만, 삭제하는 경우 정상적으로 truffle migrate 명령이 수행되지 않음.
const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
