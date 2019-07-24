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

        Assert.equal(babyContract.getBabiesCount(), 1, "count!");

        string memory _name;
        uint _date;
        (,_name, _date) = babyContract.getBaby(0);
        
        Assert.equal(_name, name, "name!");
        Assert.equal(_date, date, "date!");
    }
}