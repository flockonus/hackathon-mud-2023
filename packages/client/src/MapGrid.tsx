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

type Props = {
  dimension: number;
  onTileClick: (x: number, y: number) => void;
  terrain: {
    x: number;
    y: number;
    emoji: string;
    type: number;
  }[][];
  players?: {
    x: number;
    y: number;
    emoji: string;
    entity: Entity;
  }[];
  encounter?: ReactNode;
};

// initialized from emojimon:GameMap
export const MapGrid = ({
  dimension,
  onTileClick,
  terrain,
  players,
  encounter,
}: Props) => {
  const {
    network: { playerEntity },
  } = useMUD();

//   const rows = new Array(width).fill(0).map((_, i) => i);
//   const columns = new Array(height).fill(0).map((_, i) => i);

  const [showEncounter, setShowEncounter] = useState(false);
  // Reset show encounter when we leave encounter
  useEffect(() => {
    if (!encounter) {
      setShowEncounter(false);
    }
  }, [encounter]);

  function makeTile(t){
    return (
        <div
            className="tile"
            key={`tile${t.x}-${t.y}`}
            onClick={() => onTileClick(t.x, t.y)}
        >
            {t.emoji} / {t.x},{t.y}
        </div>
    )
  }

    const tiles = []
    console.log("this is terrain", terrain);
    

    for (let y = 0; y < dimension; y++) {
        for (let x = 0; x < dimension; x++) {
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
