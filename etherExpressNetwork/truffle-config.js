// BKMH ropsten 연계 처리를 위한 값 - 현재 미사용
//var HDWalletProvider = require("./node_modules/@truffle/hdwallet-provider");

//var INFURA_API_KEY = "ropsten.infura.io/v3/2c579c796b2043bca7b422b9e584f31c";

// address : 0xCddb7c85BEfdFbC9906692116EAf3213cfCaEa94
//var privateKeys = "efb1b74e037b4baa32711677a8d8fc6f9f827538c6bd1aedb7a8facf6b8adafa";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
    networks: {
      development: {
        host: '127.0.0.1',
        // port의 경우, ganache - metamask 연계시 입력된 port를 사용할 것.
        port: 7545,
        network_id: '*'// '666'
      }
      // test를 위한 ropsten testnet 연결
//      ropsten: {
//        provider: () => new HDWalletProvider(privateKeys,"https://ropsten.infura.io/" + INFURA_API_KEY), network_id: 3, gas: 4700000
//      }
    }
};