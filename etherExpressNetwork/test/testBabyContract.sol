pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BabyContract.sol";

contract TestBabyContract {
    BabyContract babyContract = BabyContract(DeployedAddresses.BabyContract());
    address expectedLoginPerson = address(this);

    string FILENAME = "imageFileName";
    string ETC_SPFEATR = "특이사항";
    string PHONE_NUMBER = "010-1111-2222";
    uint AGE = 10;
    uint COUNT = 1;

    // Baby 등록 Test
    function testAddBaby() public {
        babyContract.addBaby(FILENAME, ETC_SPFEATR, PHONE_NUMBER, AGE);
    }

    // babies length 출력 테스트
    function testGetBabiesCount() public {
        Assert.equal(babyContract.getBabiesCount(), COUNT, "count!");
    }

    // babies Index 입력 ->  Baby 객체 내 전 항목 값 출력 테스트
    function testGetBabyById() public {
        string memory filename;
        string memory etcSpfeatr;
        string memory phoneNumber;
        uint age;
        (filename, etcSpfeatr, phoneNumber, age) = babyContract.getBabyById(0);
        Assert.equal(babyContract.compareStrings(filename, FILENAME), true, "filename!");
        Assert.equal(babyContract.compareStrings(etcSpfeatr, ETC_SPFEATR), true, "etcSpfeatr!");
        Assert.equal(babyContract.compareStrings(phoneNumber, PHONE_NUMBER), true, "phoneNumber!");
        Assert.equal(age, AGE, "age!");
    }

    // 이미지경로 입력 ->  Baby 객체 내 전 항목 값 출력 테스트
    function testGetBabyByFilename() public {
        string memory filename;
        string memory etcSpfeatr;
        string memory phoneNumber;
        uint age;
        (filename, etcSpfeatr, phoneNumber, age) = babyContract.getBabyByFilename(FILENAME);
        Assert.equal(babyContract.compareStrings(filename, FILENAME), true, "filename!");
        Assert.equal(babyContract.compareStrings(etcSpfeatr, ETC_SPFEATR), true, "etcSpfeatr!");
        Assert.equal(babyContract.compareStrings(phoneNumber, PHONE_NUMBER), true, "phoneNumber!");
        Assert.equal(age, AGE, "age!");
    }
}