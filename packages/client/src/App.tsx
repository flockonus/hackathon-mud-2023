import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Entity, Has, getComponentValueStrict } from "@latticexyz/recs";
import "./app.css";
import { useMUD } from "./MUDContext";
import { MapGrid, nftAssets } from "./MapGrid";
import { PlayerScoreboard } from "./PlayerScoreboard";
const DIMENSION = 15;

export const App = () => {
  const {
    components: { Counter, MapLocations, Map, Player },
    systemCalls: { increment, setupMap },
    network: { singletonEntity, playerEntity },
  } = useMUD();

  const locations = useEntityQuery([Has(MapLocations)]).map((entity) => {
    const loc = getComponentValueStrict(MapLocations, entity);
    // console.log({loc});
    return loc
  });

  let me:any;
  const players = useEntityQuery([Has(Player)]).map((entity) => {
    const player = getComponentValueStrict(Player, entity);
  
    if ( // no clue why the whole thing doesn't match, but it's close! lol
      playerEntity?.substring(4) == entity.substring(2)
      || playerEntity == entity
    ) {
      me = player;
      player._self = true
    }
    return player
  });


  function buildTerrain() {
    const board: any[][] = Array.from(Array(DIMENSION), () => new Array(DIMENSION));
    for (let x = 0; x < DIMENSION; x++) {
      for (let y = 0; y < DIMENSION; y++) {
        board[x][y] = {
          x,
          y,
          tileType: 0,
          playerPos: 0,
        }
      }
    }
    
    // fill up structures
    locations.forEach(loc => {
      board[loc.x_][loc.y_] = {
        x: loc.x_,
        y: loc.y_,
        //`🏭:${loc.kind}`,
        tileType: loc.kind,
        playerPos: 0,
      }
    })

    // fill up players
    players.forEach(p => {
      //`👨‍🎤:${p.position}`;
      board[p.x][p.y].playerPos = p.position;
    })

    return board;
  }

  const mapConfig = useComponentValue(Map, singletonEntity);

  function initGame() {
    if (mapConfig == null) {
      return (
        // <button onClick={() => setupMap()}>
        //   Initialize Game
        // </button>
        <span>Loading...</span>
      )
    } else {
      return (
        // <button onClick={() => console.log('TODO lol')}>
        //   Game Start!
        // </button>
        <>
          <div>ℹ️ After joining, your character has 40 stamina, moving costs 2. Most core mechanics are still missing, more coming soon!</div>
        </>
      )
    }
  }

  function drawMyAvatar() {
    if (me != undefined) {
      return(
        <div>
          <center>
          <img src={nftAssets[me.position-1]}></img>
            <span>
              <img src="https://bafybeifnerfsia2vtqyqlmndjyhwb3tectskhfahughankqtxyoyk5afou.ipfs.nftstorage.link/Stamina_Coin.png" style={{maxHeight: '50px'}}></img>
              <br/>
              {me.stamina}/40
            </span>
          </center>
        </div>
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
            {drawMyAvatar()}
          </div>
          {/* TODO should pass players down to board to avoid loading 2x */}
          <PlayerScoreboard />
        </div>
        <div className="right-panel">
          <MapGrid
            dimension={DIMENSION}
            terrain={buildTerrain()}
            onTileClick={console.log.bind(console, "click!")}
            players={players}
          />
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
