import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    Structures: ["None", "Mine", "Exchange"],
    Colors: ["None", "Red", "Green", "Blue"],
  },
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    // singleton
    Map: {
      keySchema: {},
      schema: {
        uniqueId: "uint64",
        playersIn: "uint8",
        dimension: "uint8",
        locationsInitialized: "bool",
      }
    },
    MapLocations: {
      keySchema: {
        x: "uint8",
        y: "uint8",
      },
      schema: {
        // 0: empty, 1: mine, 2: exchange
        kind: "Structures",
        owner: "address",
        color: "Colors",
        // because indexes are not available as data, which makes it hard to inspect
        x_: "uint8",
        y_: "uint8",
        // cost of the main action to be done there -- no need, each type has their own things
        // cost: "uint32",
      },
    },
    // we'll have 1 Game per contract for now just to keep modeling simpler
    Player: {
      schema: {
        position: "uint8",
        x: "uint8",
        y: "uint8",
        coinR: "uint32",
        coinG: "uint32",
        coinB: "uint32",
        coinSTABLE: "uint32",
        stamina: "uint32",
      }
    }
  },
});
