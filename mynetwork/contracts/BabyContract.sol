pragma solidity ^0.5.0;

contract BabyContract {

    event NewBaby(uint babyId, string imagePath, string etcSpfeatr, string phoneNumber, uint age);

    struct Baby {   // 사진경로, 특이사항, 연락처, 나이
        string imagePath;
        string etcSpfeatr;
        string phoneNumber;
        uint8 age;
    }

    Baby[] public babies;

    mapping (uint => address) public babyToOwner;
    mapping (string => uint) public imageToBaby;

    function addBaby(string memory _imagePath, string memory _etcSpfeatr, string memory _phoneNumber, uint _age) public {
        uint8 _age8 = uint8(_age % (2**8-1));
        uint id = babies.push(Baby(_imagePath, _etcSpfeatr, _phoneNumber, _age8)) - 1;
        babyToOwner[id] = msg.sender;
        imageToBaby[_imagePath] = id;
        emit NewBaby(id, _imagePath, _etcSpfeatr, _phoneNumber, _age);
    }

    function getBabiesCount() public view returns (uint count) {
        return babies.length;
    }

    function getBaby(uint _id) public view returns (
        string memory imagePath, string memory etcSpfeatr, string memory phoneNumber, uint age) {
        imagePath = babies[_id].imagePath;
        etcSpfeatr = babies[_id].etcSpfeatr;
        phoneNumber = babies[_id].phoneNumber;
        age = babies[_id].age;
    }

    function getBabyByImagePath(string memory _imagePath) public view returns (
        string memory imagePath, string memory etcSpfeatr, string memory phoneNumber, uint age) {
        uint _id = imageToBaby[_imagePath];
        imagePath = babies[_id].imagePath;
        etcSpfeatr = babies[_id].etcSpfeatr;
        phoneNumber = babies[_id].phoneNumber;
        age = babies[_id].age;
    }
}