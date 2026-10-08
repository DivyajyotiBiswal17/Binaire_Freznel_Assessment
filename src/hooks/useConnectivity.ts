import { useSyncExternalStore } from "react";
import { connectivity } from "../offline/ConnectivityMonitor";

export const useConnectivity = () =>
  useSyncExternalStore(connectivity.subscribe, connectivity.getStatus);