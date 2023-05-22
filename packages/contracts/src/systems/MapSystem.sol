// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Map, MapData, MapLocations } from "../codegen/Tables.sol";

import { Structures, Colors } from "../codegen/Types.sol";

contract MapSystem is System {
  // it's stateful but doesn't matter if re-shuffled at deployment
  uint256 private seed = uint256(blockhash(block.number - 1));

  function setupMap() public returns (uint32) {
    MapData memory mapInfo = Map.get();
    // consider if we want to be able to override the map to restart the match?
    require(mapInfo.locationsInitialized == false, "map can only be setup once");

    MapLocations.set(2,4,   Structures.Mine, address(0), Colors.Red, 2,4);
    MapLocations.set(4,8,   Structures.Mine, address(0), Colors.Green, 4,8);
    MapLocations.set(4,4,   Structures.Mine, address(0), Colors.Blue, 4,4);
    MapLocations.set(10,10, Structures.Mine, address(0), Colors.Red, 10,10);
    MapLocations.set(10,7,  Structures.Mine, address(0), Colors.Green, 10,7);
    MapLocations.set(10,1,  Structures.Mine, address(0), Colors.Blue, 10,1);
    MapLocations.set(1,10,  Structures.Mine, address(0), Colors.Red, 1,10);
    MapLocations.set(12,12, Structures.Mine, address(0), Colors.Green, 12,12);
    MapLocations.set(3,12,  Structures.Mine, address(0), Colors.Blue, 3,12);
    MapLocations.set(7,7,   Structures.Exchange, address(1), Colors.None, 7,7);

    Map.set(uint64(rand()), 15, true);

    return 0;
  }

  function joinGame() public {
    
  }

  function debugTime() public view returns (uint256) {
    return block.timestamp;
  }

  function rand() internal returns (uint256) {
    seed += 1;
    return uint256(keccak256(abi.encode(blockhash(block.number - 1), seed)));
  }
}
