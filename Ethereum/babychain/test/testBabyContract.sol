pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BabyContract.sol";

contract TestBabyContract {
    BabyContract babyContract = BabyContract(DeployedAddresses.BabyContract());
    address expectedLoginPerson = address(this);

    string name = "test";
    uint date = 20190101;
    uint count = 1;

    function testAddBaby() public {
        babyContract.addBaby(name, date);
    }

    function testGetBabiesCount() public {
        Assert.equal(babyContract.getBabiesCount(), count, "count!");
    }

    function testGetBaby() public {
        string memory _name;
        uint _date;
        (,_name, _date) = babyContract.getBaby(0);
        
        Assert.equal(_name, name, "name!");
        Assert.equal(_date, date, "date!");
    }
}