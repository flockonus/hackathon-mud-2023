import { ReactNode, useEffect, useState } from "react";
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
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Mine_01.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Mine_02.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Mine_03.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Mine_04.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Mine_05.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Mine_06.png',
];
export const exchangeAssets = [
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/ExchangeHouse_01.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/ExchangeHouse_02.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/ExchangeHouse_03.png',
];
export const nftAssets = [
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/nft1.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/nft3.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/nft4.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/nft2.png',
];
export const coinAssets = [
  'none',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Red_Coin.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Green_Coin.png',
  'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Blue_Coin.png',
  '/assets/Stable_Coin.png'
];

type Props = {
  dimension: number;
  terrain: {
    x: number;
    y: number;
    tileType: number;
    playerPos: number;
    // true if the local player is adjancet to the tiles
    playerAdjacent?: boolean;
    _original?: any;
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

  let mineAssetPointer = -1;
  let exchangeAssetPointer = 1;
  function makeTile(t:any){
    let classAdd = ""
    if (t.playerAdjacent) classAdd += "player-adjacent"
    if (t.tileType === StructuresType.Mine) {
      mineAssetPointer = (mineAssetPointer + 1) % 6
      console.log({mine: t._original});
      
      return (
        <div
            className={`tile structrure-mine ${classAdd}`}
            key={`tile${t.x}-${t.y}`}
            onClick={() => alert('TODO: structrure-mine screen')}
        >
            <img src={mineAssets[mineAssetPointer]}></img>
            <img className="coin-badge" src={coinAssets[t._original.color]}></img>
        </div>
      )
    }
    if (t.tileType === StructuresType.Exchange) {
      exchangeAssetPointer = (exchangeAssetPointer + 1) % 4
      return (
        <div
            className={`tile structrure-exchange ${classAdd}`}
            key={`tile${t.x}-${t.y}`}
            onClick={() => alert('TODO: structrure-exchange screen')}
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
            <img className="img-player" src={nftAssets[t.playerPos-1]}></img>
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
