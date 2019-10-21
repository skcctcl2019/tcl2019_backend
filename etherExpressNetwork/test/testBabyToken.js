//const { expectThrow } = require("./helpers/expectThrow");
//const { EVMRevert } = require("./helpers/EVMRevert");
//const web3 = require("web3");

//const BigNumber = web3.BigNumber;
/*
require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

*/

// Import all required modules from @openzeppelin/test-helpers
const {
  BN, constants, expectEvent, shouldFail
  } = require('@openzeppelin/test-helpers');

// Import preferred chai flavor: both expect and should are supported
const {
  chai 
} = require('chai');

const BabyToken = artifacts.require("BabyToken");

contract("BabyToken", function([_, owner, investor]) {

  let token;

  const _name = "BabyToken";
  const _symbol = "BBT";
  const _decimals = 18;
  const _total_supply = new BN(1);
  //const _total_supply = new BN(1);
  const _over_total_supply = new BN(110000000000);
  //const _over_total_supply = new BN(11000000);

  beforeEach(async function() {
    token = await BabyToken.new(_name, _symbol, _decimals, _total_supply, {
      from: owner
    });
  });

  describe("[Testcase 1 : check if the smart contract has been created as set in the variables]", () => {
    it("1.1. Is the token name the same as set in the variable?", async function() {
      //(await token.name()).should.eq(_name);
      //(await token.name()).should(_name);

      // (intermediate value)(function) is not a function
      // test를 처리하는 과정에서 함수를 수행하기 위한 변수가 정상적으로 입력되지 않거나,
      // async - await 방식으로 구성된 경우에는 정상적으로 처리가 되지 않는 것 같으므로, 구성을 변경하여
      // 변수에 저장하고 비교하는 방식을 채택
      const tokenName = await token.name();

      expect(tokenName).to.equal(_name);

    });

    it("1.2. Is the token symbol is the same as set in the variable?", async function() {
      //(await token.symbol()).should.eq(_symbol);
      const tokenSymbol = await token.symbol();

      expect(tokenSymbol).to.equal(_symbol);

    });

    it("1.3. Is the token decimals is the same as set in the variable?", async function() {
      //(await token.decimals()).should.be.bignumber.equal(_decimals);
      const tokenDecimal = await token.decimals();
      // solidity 를 통해 전달되는 uint 는 javascript에서 사용가능한 datatype을 벗어날 수 있으므로
      // BN객체를 통해 비교처리해야 함.
      //expect(tokenDecimal).to.deep.equal(new BN(_decimals));
      assert.equal(tokenDecimal, new BN(_decimals));

    });

    it("1.4. Is the total supply of the token the same as set in the variable total supply?", async function() {
      //(await token.totalSupply()).should.be.bignumber.equal(
        //1000000000000000000000000
      //);

      const tokenTotalSupply = await token.totalSupply();

      //expect(tokenTotalSupply).to.be.a(BN).equal(10000000);

      assert.equal(tokenTotalSupply, new BN(_total_supply));

    });
  });

  describe("[Testcase 2 : check if the amount of the token supply has been transffered to the token owner]", () => {
    it("2.1. Is the total token amount issued are the same as that of the balance of the token owner?", async function() {
      const totalSupply  = await token.totalSupply();
      const ownerBalance = await token.balanceOf(owner);

      //ownerBalance.should.be.bignumber.equal(totalSupply);

      assert.equal(ownerBalance, totalSupply);

    });
  });

  describe("[Testcase 3: check if the features implemented work as intended]", () => {
    it("3.1. Transfer feature: after transferring some tokens to a certain address, is the amount of the token transferred the same as that of the address that has received?", async function() {

      await token.transfer(investor, 1000, { from: owner });

      const investorBalance = await token.balanceOf(investor);

      //investorBalance.should.be.bignumber.equal(1000);

      assert.equal(investorBalance, new BN(1000));

    });

    it("3.2. When trying to transferring more tokens than the token supply, is it properly ‘reverted’? ", async function() {
      await expectEvent (
        token.transfer(investor, _over_total_supply, {
          from: owner
        }),
        //EVMRevert
        shouldFail
      );
    });
  });
});