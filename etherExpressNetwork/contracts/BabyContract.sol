pragma solidity ^0.5.0;

contract BabyContract {

    // Baby 등록 이벤트
    event NewBaby(uint babyId, string filename, string etcSpfeatr, string phoneNumber, uint age);

    struct Baby {   // 파일명(이미지, 특징점), 특이사항, 연락처, 나이
        string filename;
        string etcSpfeatr;
        string phoneNumber;
        uint8 age;

        // 특장점 추출 결과를 저장하기 위한 추가 변수 또는 저장소 추가 필요
        // AI 호출 수행결과가 특장점 LIST(또는 Array) 로 저장되므로, 해당 저장값을 데이터로 관리해야 함
        // -> 파일로 저장, 파일명은 upload image 파일명과 동일하게 저장
    }

    // Baby 등록 배열
    Baby[] public babies;

    // babies Index 입력 -> Baby 등록 Address 출력
    mapping (uint => address) public babyToOwner;

    // 파일명 입력 -> babies Index 출력
    mapping (string => uint) public FilenameToBaby;

    // Baby 등록
    function addBaby(string memory _filename, string memory _etcSpfeatr, string memory _phoneNumber, uint _age) public {
        uint8 _age8 = uint8(_age % (2**8-1));   // 오버플로우 방지
        uint id = babies.push(Baby(_filename, _etcSpfeatr, _phoneNumber, _age8)) - 1;
        babyToOwner[id] = msg.sender;   // babyToOwner 매핑
        FilenameToBaby[_filename] = id;   // imageToBaby 매핑
        emit NewBaby(id, _filename, _etcSpfeatr, _phoneNumber, _age);  // 이벤트 발생
    }

    // babies length 출력
    function getBabiesCount() public view returns (uint count) {
        return babies.length;
    }

    // babies Index 입력 ->  Baby 객체 내 전 항목 값 출력
    function getBabyById(uint _id) public view returns (
        string memory filename, string memory etcSpfeatr, string memory phoneNumber, uint age) {
        // babies Indes는 babies length 보다 작아야함
        require(_id < babies.length, "Wrong ID value.");
        // 항목 출력
        filename = babies[_id].filename;
        etcSpfeatr = babies[_id].etcSpfeatr;
        phoneNumber = babies[_id].phoneNumber;
        age = babies[_id].age;
    }

    // 파일명 입력 ->  Baby 객체 내 전 항목 값 출력
    function getBabyByFilename(string memory _filename) public view returns (
        string memory filename, string memory etcSpfeatr, string memory phoneNumber, uint age) {
        // 입력된 파일명과 찾은 파일명이 맞는지 확인
        uint _id = FilenameToBaby[_filename];
        require(compareStrings(_filename, babies[_id].filename), "The filename entered does not exist.");
        // 항목 출력
        filename = babies[_id].filename;
        etcSpfeatr = babies[_id].etcSpfeatr;
        phoneNumber = babies[_id].phoneNumber;
        age = babies[_id].age;
    }

    // string 값 비교 함수
    function compareStrings (string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
}