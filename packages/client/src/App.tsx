import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import "./app.css";
import { useMUD } from "./MUDContext";
import { MapGrid } from "./MapGrid";
import { PlayerScoreboard } from "./PlayerScoreboard";
const DIMENSION = 15;

export const App = () => {
  const {
    components: { Counter, MapLocations, Map, Player },
    systemCalls: { increment, setupMap },
    network: { singletonEntity },
  } = useMUD();

  const locations = useEntityQuery([Has(MapLocations)]).map((entity) => {
    const loc = getComponentValueStrict(MapLocations, entity);
    // console.log({loc});
    return loc
  });

  const players = useEntityQuery([Has(Player)]).map((entity) => {
    const p = getComponentValueStrict(Player, entity);
    console.log({p});
    return p
  });


  function buildTerrain() {
    const board: any[][] = Array.from(Array(DIMENSION), () => new Array(DIMENSION));
    for (let x = 0; x < DIMENSION; x++) {
      for (let y = 0; y < DIMENSION; y++) {
        board[x][y] = {
          x,
          y,
          emoji: `empty`,
          type: 0,
          player: 0,
        }
      }
    }
    
    // fill up structures
    locations.forEach(loc => {
      board[loc.x_][loc.y_] = {
        x: loc.x_,
        y: loc.y_,
        emoji: `🏭:${loc.kind}`,
        type: loc.kind,
        player: 0,
      }
    })

    // fill up players
    players.forEach(p => {
      board[p.x][p.y].emoji = `👨‍🎤:${p.position}`;
      board[p.x][p.y].player = p.position;
    })

    return board;
  }

  const mapConfig = useComponentValue(Map, singletonEntity);
  // if (mapConfig == null) {
  //   throw new Error(
  //     "map config not set or not ready, only use this hook after loading state === LIVE"
  //   );
  // }

  function initGame() {
    if (mapConfig == null) {
      return (
        <button onClick={() => setupMap()}>
          Initialize Game
        </button>
      )
    } else {
      return (
        <button onClick={() => console.log('TODO lol')}>
          Game Start!
        </button>
      )
    }
  }
  
  return (
    <>
      <div className="stage">
        <div className="left-panel">
          <div className="admin-panel">
            {initGame()}
          </div>
          <div className="avatar">
            NFTs img goes here
          </div>
          <PlayerScoreboard />
        </div>
        <div className="right-panel">
          <MapGrid dimension={DIMENSION} terrain={buildTerrain()} onTileClick={console.log.bind(console, "click!")}/>
        </div>
      </div>
    </>
  );
};

{/*
const counter = useComponentValue(Counter, singletonEntity);


 <div>
  Counter: <span>{counter?.value ?? "??"}</span>
</div>
<button
  type="button"
  onClick={async (event) => {
    event.preventDefault();
    console.log("new counter value:", await increment());
  }}
>
  Increment
</button> */}
