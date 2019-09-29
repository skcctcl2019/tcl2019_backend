pragma solidity ^0.5.0;

contract BabyContract {

    // Baby 등록 이벤트
    event NewBaby(uint babyId, string imagePath, string etcSpfeatr, string phoneNumber, uint age);

    struct Baby {   // 사진경로, 특이사항, 연락처, 나이
        string imagePath;
        string etcSpfeatr;
        string phoneNumber;
        uint8 age;

        // 특장점 추출 결과를 저장하기 위한 추가 변수 또는 저장소 추가 필요
        // AI 호출 수행결과가 특장점 LIST(또는 Array) 로 저장되므로, 해당 저장값을 데이터로 관리해야 함
    }

    // Baby 등록 배열
    Baby[] public babies;

    // babies Index 입력 -> Baby 등록 Address 출력
    mapping (uint => address) public babyToOwner;

    // 이미지경로 입력 -> babies Index 출력
    mapping (string => uint) public imageToBaby;

    // Baby 등록
    function addBaby(string memory _imagePath, string memory _etcSpfeatr, string memory _phoneNumber, uint _age) public {
        uint8 _age8 = uint8(_age % (2**8-1));   // 오버플로우 방지
        uint id = babies.push(Baby(_imagePath, _etcSpfeatr, _phoneNumber, _age8)) - 1;
        babyToOwner[id] = msg.sender;   // babyToOwner 매핑
        imageToBaby[_imagePath] = id;   // imageToBaby 매핑
        emit NewBaby(id, _imagePath, _etcSpfeatr, _phoneNumber, _age);  // 이벤트 발생
    }

    // babies length 출력
    function getBabiesCount() public view returns (uint count) {
        return babies.length;
    }

    // babies Index 입력 ->  Baby 객체 내 전 항목 값 출력
    function getBabyById(uint _id) public view returns (
        string memory imagePath, string memory etcSpfeatr, string memory phoneNumber, uint age) {
        // babies Indes는 babies length 보다 작아야함
        require(_id < babies.length, "Wrong ID value.");
        // 항목 출력
        imagePath = babies[_id].imagePath;
        etcSpfeatr = babies[_id].etcSpfeatr;
        phoneNumber = babies[_id].phoneNumber;
        age = babies[_id].age;
    }

    // 이미지경로 입력 ->  Baby 객체 내 전 항목 값 출력
    function getBabyByImagePath(string memory _imagePath) public view returns (
        string memory imagePath, string memory etcSpfeatr, string memory phoneNumber, uint age) {
        // 입력된 이미지경로와 찾은 이미지경로가 맞는지 확인
        uint _id = imageToBaby[_imagePath];
        require(compareStrings(_imagePath, babies[_id].imagePath), "The ImagePath entered does not exist.");
        // 항목 출력
        imagePath = babies[_id].imagePath;
        etcSpfeatr = babies[_id].etcSpfeatr;
        phoneNumber = babies[_id].phoneNumber;
        age = babies[_id].age;
    }

    // string 값 비교 함수
    function compareStrings (string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }
}