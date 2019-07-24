pragma solidity ^0.5.0;

contract BabyContract {
    struct Baby {
        address addr;
        string name;
        uint date;
    }

    address public loginPerson;
    Baby[] public babies;

    constructor() public {
        loginPerson = msg.sender;
    }

    function addBaby(string memory _name, uint _date) public {
        babies.push(Baby({
            addr: loginPerson,
            name: _name,
            date: _date
        }));
    }

    function getBaby(uint index) public view returns (address addr, string memory name, uint date) {
        Baby memory b = babies[index];

        return (b.addr, b.name, b.date);
    }

    function getBabiesCount() public view returns (uint count) {
        return babies.length;
    }
}