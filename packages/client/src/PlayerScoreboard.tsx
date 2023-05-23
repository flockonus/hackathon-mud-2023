import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import { ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";

// type Props = {};

const coinAssets = {
  1: 'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Red_Coin.png',
  2: 'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Green_Coin.png',
  3: 'https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Blue_Coin.png',
}

// initialized from emojimon:GameMap
export const PlayerScoreboard = () => {
  const {
    components: { Player },
    network: { playerEntity },
    systemCalls: { joinGame },
  } = useMUD();
  
  let didIJoinYet = false;
  const players = useEntityQuery([Has(Player)]).map((entity) => {
    const player = getComponentValueStrict(Player, entity);
    // console.log({playerEntity, entity});
    if ( // no clue why the whole thing doesn't match, but it's close! lol
      playerEntity?.substring(4) == entity.substring(2)
      || playerEntity == entity
    ) {
      didIJoinYet = true;
      player._self = true
    }
    return player
  });

  function renderPlayerBoardRow(player:any) {
    return (<li key={`board-row-${player.position}`}>
      {player._self ? '⭐️' : '💨'}
      {/* {JSON.stringify(player)} */}
      <img src={coinAssets[1]}></img>: {player.coinR} 
      <img src={coinAssets[2]}></img>: {player.coinG} 
      <img src={coinAssets[3]}></img>: {player.coinB} 
      💸: {player.coinSTABLE} 
    </li>)
  }

  function joinCTAifNotYet() {
    if (!didIJoinYet) {
      return <button onClick={() => joinGame()}>join game</button>
    } else {
      return <button disabled={true}>youre in!</button>
    }
  }


  return (
    <div className="player-scoreboard">
      <>
        {joinCTAifNotYet()}
        <br/>
        <br/>
        <b>Players: {players.length}/4</b>
        <ul>
          {players.map(renderPlayerBoardRow)}
        </ul>
      </>
    </div>
  )
};
