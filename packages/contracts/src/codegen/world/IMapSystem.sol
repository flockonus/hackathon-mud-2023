// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

interface IMapSystem {
  function setupMap() external returns (uint32);

  function joinGame() external;

  function debugTime() external view returns (uint256);

  function movePlayer(uint8 x, uint8 y) external;
}
