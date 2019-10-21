var BabyToken = artifacts.require("BabyToken");
const _name = "BabyToken";
const _symbol = "BBT";
const _decimals = 18;
const _total_supply = 10000000000;

module.exports = function(deployer, network) {

    // BKMH - 실제 token 을 테스트넷에 올리기 위해 network 명칭 분리
    if (network == "development") {
        deployer.deploy(BabyToken, _name, _symbol, _decimals, _total_supply);
    }
};