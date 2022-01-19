//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TestMessage {
    string private testMessage;

    constructor(string memory _testmessage) {
        console.log("Deploying a Message with message:", _testmessage);
        testMessage = _testmessage;
    }

    function getTestMessage() public view returns (string memory) {
        return testMessage;
    }

    function setTestMessage(string memory _testmessage) public {
        console.log("Changing greeting from '%s' to '%s'", testMessage, _testmessage);
        testMessage = _testmessage;
    }
}
