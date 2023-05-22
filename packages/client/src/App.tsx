import { useComponentValue } from "@latticexyz/react";
import "./app.css";
import { useMUD } from "./MUDContext";
import { MapGrid } from "./MapGrid";
const DIMENSION = 15;

export const App = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
    network: { singletonEntity },
  } = useMUD();

  function buildTerrain() {
    const board: any[][] = Array.from(Array(DIMENSION), () => new Array(DIMENSION));
    for (let x = 0; x < DIMENSION; x++) {
      for (let y = 0; y < DIMENSION; y++) {
        board[x][y] = {
          x,
          y,
          emoji: `${x},${y}`,
          type: 0,
        }
      }
    }
    return board;
  }
  
  return (
    <>
      <div className="stage">
        <div className="left-panel">left</div>
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
