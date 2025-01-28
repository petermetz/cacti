// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.28;

import {IAny2EVMMessageReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IAny2EVMMessageReceiver.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

import {CactiCcipReceiver} from "../../main/solidity/CactiCcipReceiver.sol";
import {CactiCcip} from "../../main/solidity/CactiCcip.sol";

contract TestCactiCcipReceiver is CactiCcipReceiver {

  /// @notice Constructor initializes the contract with the router address.
  /// @param router The address of the router contract.
  constructor(address router) CactiCcipReceiver(router) {}

  // Event emitted when a message is received from another chain.
  // event MessageReceived(
  //   bytes32 indexed messageId, // The unique ID of the message.
  //   uint64 indexed sourceChainSelector, // The chain selector of the source chain.
  //   address sender, // The address of the sender from the source chain.
  //   string text // The text that was received.
  // );

  bytes32 private s_lastReceivedMessageId; // Store the last received messageId.
  CactiCcip.Msg private s_lastReceivedMsg; // Store the last received text.

  /// handle a received message
  function _ccipReceive(
    Client.Any2EVMMessage memory any2EvmMessage
  ) internal override {
    s_lastReceivedMessageId = any2EvmMessage.messageId; // fetch the messageId
    s_lastReceivedMsg = abi.decode(any2EvmMessage.data, (CactiCcip.Msg)); // abi-decoding of the sent text
    
    // emit MessageReceived(
    //   any2EvmMessage.messageId,
    //   any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
    //   abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
    //   abi.decode(any2EvmMessage.data, (string))
    // );
  }

  /// @notice Fetches the details of the last received message.
  /// @return messageId The ID of the last received message.
  /// @return text The last received text.
  function getLastReceivedMessageDetails()
    external
    view
    returns (bytes32 messageId, CactiCcip.Msg memory text)
  {
    return (s_lastReceivedMessageId, s_lastReceivedMsg);
  }
}
