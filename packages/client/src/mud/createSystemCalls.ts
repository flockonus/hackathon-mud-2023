import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, worldContract, txReduced$, singletonEntity }: SetupNetworkResult,
  { Counter, Map, MapLocations }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const setupMap = async () => {
    const tx = await worldSend("setupMap", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Map, singletonEntity);
  }

  const joinGame = async () => {
    const tx = await worldSend("joinGame", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Map, singletonEntity);
  }

  const movePlayer = async (x: number, y: number) => {
    const tx = await worldSend("movePlayer", [x, y]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Map, singletonEntity);
  }

  const getTime = async () => {
    const res = await worldContract.callStatic.debugTime()
    console.log("getTime", res.toNumber())
  }

  return {
    increment,
    setupMap,
    joinGame,
    getTime,
    movePlayer,
  };
}
