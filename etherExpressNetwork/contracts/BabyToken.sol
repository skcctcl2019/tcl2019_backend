pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract BabyToken is ERC20Detailed, ERC20, Ownable {

    // Define constants
	// string public constant _name = "BabyToken";
	// string public constant _symbol = "BBT";
	// uint8  public constant _decimals = 18;
	// uint256 public constant _totalSupply = 10000000000 * (10 ** uint(_decimals));

    //constructor () ERC20Detailed(_name, _symbol, _decimals) public {
    constructor (string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) ERC20Detailed(name, symbol, decimals) public {

        // solidity 에서 string 비교는 불가하므로 두 string의 hash값을 비교하는 방식도 좋음
        //require(name != "", "Name is not input");
        //require(symbol != "", "Symbol is not input");

        // mint -> 해당 token의 발행
        _mint(owner(), totalSupply * 10 ** uint(decimals));
    }

}