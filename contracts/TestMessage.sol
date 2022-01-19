//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TestMessage {
    string private testMessage;

    constructor(string memory _message) {
        console.log("Deploying a Message with message:", _message);
        testMessage = _message;
    }

    function getTestMessage() public view returns (string memory) {
        return testMessage;
    }

    function setTestMessage(string memory _message) public {
        console.log("Changing greeting from '%s' to '%s'", testMessage, _message);
        testMessage = _message;
    }
}
