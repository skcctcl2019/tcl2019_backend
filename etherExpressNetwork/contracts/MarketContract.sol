pragma solidity ^0.5.0;

contract MarketContract {

    // Solidity에는 storage와 memory라는 변수를 저장할 수 있는 두가지 공간이 있다.
    // Storage는 블록체인 상에 영구적으로 저장되는 변수를 의미하고,
    // Memory는 임시적으로 저장되는 변수이며 컨트랙트 함수에 대한 외부 호출들이 일어나는 사이에 지워진다.
    // 컨트랙트 내의 상태 변수(함수 외부에 선언된 변수)는 storage로 초기화 해주고
    // 함수 내에 선언된 변수는 memory로 자동적으로 초기화해준다.

    // 물건 구매 처리를 위한 owners address 정보 입력
    address[16] public owners;

    // BabyChain Contract와 동일하게 event 및 emit 처리를 통해 contract event를 생성할 필요가 있음.
    // Event는 Contract가 Blockchain 상에서 사용자 단의 앱에서 액션이 발생할 경우 귀를 기울이고 있는 상황을 의미한다.
    // 이렇게 이벤트를 설정하면 특정 이벤트가 발생하면 블록체인 상에서 행동을 취하게 된다.
    event purchaseMerchandise(uint mId, address newOwner);

    // purchase merchandise
    function purchase(uint merchandiseId) public returns (uint mId, address newOwners) {
        // 필요한 항목확인 후, 해당 항목을 기준으로 검증 요건 확인
        //require(merchandiseId >= 0 && merchandiseId <= 15, "Error");

        // msg.sender 현재 함수를 호출한 사람(혹은 스마트 컨트랙트)의 주소를 가리킨다.
        // msg.sender를 활용하면 이더리움 블록체인의 보안성을 높일 수 있다.
        // 개인키 역할을 하기에 누군가 다른 사람의 데이터를 변경하려면 해당 이더리움 주소와 관련된 개인키를
        // 훔치지 않는 이상 해킹을 당하지 않게 된다.
        owners[merchandiseId] = msg.sender;

        // BabyChain Contract와 동일하게 event 및 emit 처리를 통해 contract event를 생성할 필요가 있음.
        emit purchaseMerchandise(merchandiseId, msg.sender);

        return (merchandiseId, owners[merchandiseId]);

    }

    // Retrieving the Owners
    function getOwners() public view returns (address[16] memory) {
        return owners;
    }

}