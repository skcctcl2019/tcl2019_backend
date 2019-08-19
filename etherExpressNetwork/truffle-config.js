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
    }
};