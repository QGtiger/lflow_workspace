import { EndflowEdge } from "./EndflowEdge";
import LoopCloseEdge from "./LoopCloseEdge";
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
  loopCloseEdge: LoopCloseEdge,
};

export default edgeTypes;
