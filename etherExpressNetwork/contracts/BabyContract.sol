pragma solidity ^0.5.0;

contract BabyContract {

    // Baby 등록 이벤트
    event NewBaby(uint babyId, string types, string filename, string name, string phoneNumber, string etcSpfeatr, uint age);

    struct Baby {   // 분류, 파일명(이미지, 특징점), 이름, 연락처, 특이사항, 나이
        string types; // 실종 아동:M, 보호 아동:P, 사전 정보 등록:B
        string filename;
        string name;
        string phoneNumber;
        string etcSpfeatr;
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
    mapping (string => uint) public filenameToBaby;

    // Baby 등록
    function addBaby(string memory _t, string memory _f, string memory _n, string memory _p, string memory _e, uint _a) public {
        uint8 _age8 = uint8(_a % (2**8-1));   // 오버플로우 방지
        uint id = babies.push(Baby(_t, _f, _n, _p, _e, _age8)) - 1;
        babyToOwner[id] = msg.sender;   // babyToOwner 매핑
        filenameToBaby[_f] = id;   // imageToBaby 매핑
        emit NewBaby(id, _t, _f, _n, _p, _e, _a);  // 이벤트 발생
    }

    // babies length 출력
    function getBabiesCount() public view returns (uint count) {
        return babies.length;
    }

    // babies Index 입력 ->  Baby 객체 내 전 항목 값 출력
    function getBabyById(uint _id) public view returns (
        string memory types, string memory filename, string memory name, string memory phoneNumber, string memory etcSpfeatr, uint age) {
        // babies Indes는 babies length 보다 작아야함
        require(_id < babies.length, "Wrong ID value.");
        // 항목 출력
        types = babies[_id].types;
        filename = babies[_id].filename;
        name = babies[_id].name;
        phoneNumber = babies[_id].phoneNumber;
        etcSpfeatr = babies[_id].etcSpfeatr;
        age = babies[_id].age;
    }

    // 파일명 입력 ->  Baby 객체 내 전 항목 값 출력
    function getBabyByFilename(string memory _filename) public view returns (
        string memory types, string memory filename, string memory name, string memory phoneNumber, string memory etcSpfeatr, uint age) {
        // 입력된 파일명과 찾은 파일명이 맞는지 확인
        uint _id = filenameToBaby[_filename];
        require(compareStrings(_filename, babies[_id].filename), "The filename entered does not exist.");
        // 항목 출력
        types = babies[_id].types;
        filename = babies[_id].filename;
        name = babies[_id].name;
        phoneNumber = babies[_id].phoneNumber;
        etcSpfeatr = babies[_id].etcSpfeatr;
        age = babies[_id].age;
    }

    // string 값 비교 함수
    function compareStrings (string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
}