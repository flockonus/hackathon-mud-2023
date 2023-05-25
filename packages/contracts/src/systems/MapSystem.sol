// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Map, MapData, MapLocations, Player, PlayerData} from "../codegen/Tables.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

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

    Map.set(uint64(rand()), 0, 0, 15, true);

    // means.. nothing :D
    return 7;
  }

  function joinGame() public {
    MapData memory mapInfo = Map.get();
    require(mapInfo.locationsInitialized, "map not yet init");

    bytes32 player = addressToEntityKey(address(_msgSender()));
    require(Player.get(player).position == 0, "already joined");

    MapData memory map = Map.get();
    require(map.playersIn < 4, "game already has 4p");
    Map.setPlayersIn(map.playersIn + 1);

    Player.set({
      key: player,
      position: uint8(map.playersIn + 1),
      // simple auto-set for now
      x: uint8(1 + map.playersIn + (uint(map.playersIn) * 60 / 100) * 2),
      y: uint8(2),
      coinR: uint32(100),
      coinG: uint32(100),
      coinB: uint32(100),
      coinSTABLE: uint32(0),
      stamina: uint32(40)
    });
  }

  function debugTime() public view returns (uint256) {
    return block.timestamp;
  }

  function movePlayer(uint8 x, uint8 y) public {
    bytes32 playerKey = addressToEntityKey(address(_msgSender()));
    
    // TODO check for a valid move
    // even cooler would be allow input of a number of steps, so the players can move to a destination within 1 tx
    
    PlayerData memory p = Player.get(playerKey);
    require(p.stamina >= 2, "not enough stamina");
    Player.setX(playerKey, x);
    Player.setY(playerKey, y);
    Player.setStamina(playerKey, p.stamina - 2);
  }

  function rand() internal returns (uint256) {
    seed += 1;
    return uint256(keccak256(abi.encode(blockhash(block.number - 1), seed)));
  }

  function gameEnd() public view returns (uint256) {
    MapData memory mapInfo = Map.get();
    return uint256(mapInfo.startAt) + 60 * 5;
  }

  function gameStart() public returns (uint256 startTime, uint256 endTime) {
    MapData memory mapInfo = Map.get();
    require(mapInfo.locationsInitialized, "map not yet init");
    require(mapInfo.startAt == 0, "startAt is already set");
    require(mapInfo.playersIn > 0, "at least 1 player");

    startTime = block.timestamp;

    Map.setStartAt(uint64(startTime));

    return(startTime, gameEnd());
  }
}
