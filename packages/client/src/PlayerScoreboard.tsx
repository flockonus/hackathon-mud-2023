import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import { ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useMUD } from "./MUDContext";

// type Props = {};

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
      🔴: {player.coinR} 
      🟢: {player.coinG} 
      🔵: {player.coinB} 
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
