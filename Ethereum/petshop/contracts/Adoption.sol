pragma solidity ^0.5.0;

contract Adoption {
    address[16] public adopters;
    // public variables have automatic getter methods

    // Adopting a pet
    function adopt(uint petId) public returns (uint) {

        // checking to make sure petId is in range of Adopters
        require(petId >= 0 && petId <= 15, "petId is not between 0 and 15");

        adopters[petId] = msg.sender;

        return petId;
    }

    // Retrieving the adopters
    // memory gives the data location for the variable
    // The view keyword in the function declaration means that the function will not
    // modify the state of the contract
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }




}