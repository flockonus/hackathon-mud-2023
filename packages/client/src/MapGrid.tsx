import { ReactNode, useEffect, useState } from "react";
import { Entity } from "@latticexyz/recs";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";

export enum ColorsType {
  None,
  Red,
  Green,
  Blue,
}

export enum StructuresType {
  None,
  Mine,
  Exchange,
}

export const mineAssets = [
  '/assets/Mine_01.png',
  '/assets/Mine_02.png',
  '/assets/Mine_03.png',
  '/assets/Mine_04.png',
  '/assets/Mine_05.png',
  '/assets/Mine_06.png',
];
export const exchangeAssets = [
  '/assets/ExchangeHouse_01.png',
  '/assets/ExchangeHouse_02.png',
  '/assets/ExchangeHouse_03.png',
];
export const nftAssets = [
  '/assets/nft1.png',
  '/assets/nft2.png',
  '/assets/nft3.png',
  '/assets/nft4.png',
]

type Props = {
  dimension: number;
  terrain: {
    x: number;
    y: number;
    tileType: number;
    playerPos: number
    // true if the local player is adjancet to the tiles
    playerAdjacent?: boolean;
  }[][];
  players?: {
    position: number;
    x: number;
    y: number;
    coinR: number;
    coinG: number;
    coinB: number;
    coinSTABLE: number;
    stamina: number;
    _self?: boolean;
  }[];
  encounter?: ReactNode;
};

// inspired from emojimon:GameMap
export const MapGrid = ({
  dimension,
  // onTileClick,
  terrain,
  players,
  encounter,
}: Props) => {
  const {
    network: { playerEntity },
    systemCalls: { movePlayer }
  } = useMUD();

  // "self" player has clicked this tile
  function playerActionIntent(tile: any) {
    if (!tile.playerAdjacent) {
      console.log("cant move player to tile", tile);
      return;
    }
    console.log("moving player");
    movePlayer(tile.x, tile.y);
  }

//   const rows = new Array(width).fill(0).map((_, i) => i);
//   const columns = new Array(height).fill(0).map((_, i) => i);

  // const [showEncounter, setShowEncounter] = useState(false);
  // // Reset show encounter when we leave encounter
  // useEffect(() => {
  //   if (!encounter) {
  //     setShowEncounter(false);
  //   }
  // }, [encounter]);

  let mineAssetPointer = 1;
  let exchangeAssetPointer = 1;
  function makeTile(t:any){
    let classAdd = ""
    if (t.playerAdjacent) classAdd += "player-adjacent"
    if (t.tileType === StructuresType.Mine) {
      mineAssetPointer = (mineAssetPointer + 1) % 7
      return (
        <div
            className={`tile structrure-mine ${classAdd}`}
            key={`tile${t.x}-${t.y}`}
            onClick={() => console.log({x:t.x, y:t.y, obj: "click mine"})}
        >
            <img src={mineAssets[mineAssetPointer]}></img>
        </div>
      )
    }
    if (t.tileType === StructuresType.Exchange) {
      exchangeAssetPointer = (exchangeAssetPointer + 1) % 4
      return (
        <div
            className={`tile structrure-exchange ${classAdd}`}
            key={`tile${t.x}-${t.y}`}
            onClick={() => console.log({x:t.x, y:t.y, obj: "click exchange"})}
        >
            <img className="img-exchange" src={exchangeAssets[exchangeAssetPointer]}></img>
        </div>
      )
    }
    if (t.playerPos > 0) { // a player is in this cell
      return (
        <div
            className={`tile ${classAdd}`}
            key={`tile${t.x}-${t.y}`}
            // onClick={() => onTileClick(t.x, t.y)} -- nothing, can't move to another player's cell
        >
            <img className="img-exchange" src={nftAssets[t.playerPos-1]}></img>
        </div>
      )
    }

    return (
        <div
            className={`tile ${classAdd}`}
            key={`tile${t.x}-${t.y}`}
            onClick={() => playerActionIntent(t)}
        >
            {""}
        </div>
    )
  }

  function markAdjancentToPlayer() {
    let myLoc:any = undefined
    players?.forEach(p => {
      if (p._self === true) {
        myLoc = {
          x: p.x,
          y: p.y
        };
      }
    })
    if (myLoc == undefined) {
      console.log("my player not in this board, no adjacents");
      return;
    }
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        if (0 <= myLoc.y + j && myLoc.y + j < terrain.length && 0 <= myLoc.x + i && myLoc.x + i < terrain[0].length) {
          const cell = terrain[myLoc.x + i][myLoc.y + j];
          if (cell) {
            cell.playerAdjacent = true;
          }
        }
      }
    }
  }
  markAdjancentToPlayer();

  const tiles = []
  // console.log("this is terrain", terrain);
  for (let y = 0; y < dimension; y++) {
    for (let x = 0; x < dimension; x++) {
      // TODO: mark adjacent cells to player
      // flatten to array, wrap around rows
      tiles.push(makeTile(terrain !== undefined ? terrain[x][y] : {} ))
    }
  }


  return (
    <div className="map-grid">
      {tiles.concat()}
    </div>
  )
};
