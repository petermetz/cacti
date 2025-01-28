// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.28;

import {IAny2EVMMessageReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IAny2EVMMessageReceiver.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CactiCcip} from "./CactiCcip.sol";

abstract contract CactiCcipReceiver is CCIPReceiver {

  event CactiCcipMsgReceivedV1(uint64 cactiMsgId);

  /// @notice Constructor initializes the contract with the router address.
  /// @param router The address of the router contract.
  constructor(address router) CCIPReceiver(router) {}

  /// @inheritdoc CCIPReceiver
  function ccipReceive(
    Client.Any2EVMMessage calldata any2EvmMessage
  ) external virtual override onlyRouter {
    _ccipReceive(any2EvmMessage);
    CactiCcip.Msg memory cactiCcipMsg = abi.decode(any2EvmMessage.data, (CactiCcip.Msg));
    emit CactiCcipMsgReceivedV1(cactiCcipMsg.id);
  }
}
