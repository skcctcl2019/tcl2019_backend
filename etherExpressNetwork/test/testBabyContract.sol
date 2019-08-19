pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BabyContract.sol";

contract TestBabyContract {
    BabyContract babyContract = BabyContract(DeployedAddresses.BabyContract());
    address expectedLoginPerson = address(this);

    string IMAGE_PATH = "./image.jpg";
    string ETC_SPFEATR = "특이사항";
    string PHONE_NUMBER = "010-1111-2222";
    uint AGE = 10;
    uint COUNT = 1;

    function testAddBaby() public {
        babyContract.addBaby(IMAGE_PATH, ETC_SPFEATR, PHONE_NUMBER, AGE);
    }

    function testGetBabiesCount() public {
        Assert.equal(babyContract.getBabiesCount(), COUNT, "count!");
    }

    function testGetBabyById() public {
        string memory imagePath;
        string memory etcSpfeatr;
        string memory phoneNumber;
        uint age;
        (imagePath, etcSpfeatr, phoneNumber, age) = babyContract.getBabyById(0);
        Assert.equal(imagePath, IMAGE_PATH, "imagePath!");
        Assert.equal(etcSpfeatr, ETC_SPFEATR, "etcSpfeatr!");
        Assert.equal(phoneNumber, PHONE_NUMBER, "phoneNumber!");
        Assert.equal(age, AGE, "age!");
    }

    function testGetBabyByImagePath() public {
        string memory imagePath;
        string memory etcSpfeatr;
        string memory phoneNumber;
        uint age;
        (imagePath, etcSpfeatr, phoneNumber, age) = babyContract.getBabyByImagePath(IMAGE_PATH);
        Assert.equal(imagePath, IMAGE_PATH, "imagePath!");
        Assert.equal(etcSpfeatr, ETC_SPFEATR, "etcSpfeatr!");
        Assert.equal(phoneNumber, PHONE_NUMBER, "phoneNumber!");
        Assert.equal(age, AGE, "age!");
    }
}