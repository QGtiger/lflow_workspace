import { EndflowEdge } from "./EndflowEdge";
import LoopInnerEdge from "./LoopInnerEdge";
import { PathsEdge } from "./PathsEdge";
import PlaceholderEdge from "./PlaceholderEdge";
import StepflowEdge from "./StepflowEdge";

export const edgeTypes = {
  endflowEdge: EndflowEdge,
  pathsEdge: PathsEdge,
  stepflowEdge: StepflowEdge,
  loopInnerEdge: LoopInnerEdge,
  placeholderEdge: PlaceholderEdge,
};

export default edgeTypes;
