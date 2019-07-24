pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BabyContract.sol";

contract TestBabyContract {
    BabyContract babyContract = BabyContract(DeployedAddresses.BabyContract());
    address expectedLoginPerson = address(this);

    function testAddBaby() public {
        string memory name = "test";
        uint date = 20190101;

        babyContract.addBaby(name, date);
        
        Assert.equal(babyContract.getBaby(0).name, name, "name!");
        Assert.equal(babyContract.getBaby(0).date, date, "date!");
    }
}