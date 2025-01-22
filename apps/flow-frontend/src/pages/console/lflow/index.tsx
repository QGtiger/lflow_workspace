import Workflow from "@/components/Workflow";

import cacheDataV2 from "./cache.json";

export default function Lflow() {
  return (
    <div className=" relative h-full w-full">
      <Workflow flowNodes={cacheDataV2} />
    </div>
  );
}
