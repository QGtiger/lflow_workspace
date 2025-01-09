import { EndflowEdge } from "./EndflowEdge";
import LoopInnerEdge from "./LoopInnerEdge";
import { PathsEdge } from "./PathsEdge";
import StepflowEdge from "./StepflowEdge";

export const edgeTypes = {
  endflowEdge: EndflowEdge,
  pathsEdge: PathsEdge,
  stepflowEdge: StepflowEdge,
  LoopInnerEdge,
};

export default edgeTypes;
