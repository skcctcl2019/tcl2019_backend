pragma solidity ^0.5.0;

contract Market {
    // 물건 구매 처리를 위한 owners address 정보 입력
    address[16] public owners;

    // purchase merchandise
    function purchase(uint merchandiseId) public returns (uint) {
        // 필요한 항목확인 후, 해당 항목을 기준으로 검증 요건 확인
        //require(merchandiseId >= 0 && merchandiseId <= 15, "Error");

        owners[merchandiseId] = msg.sender;

        return merchandiseId;
    }

    // Retrieving the Owners
    function getOwners() public view returns (address[16] memory) {
        return owners;
    }

}