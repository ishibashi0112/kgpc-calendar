import { state } from "src/lib/store/valtio";
import { useSnapshot as useValtioSnapshot } from "valtio";

export const useSnapshot = () => {
  const snap = useValtioSnapshot(state);

  return snap;
};
