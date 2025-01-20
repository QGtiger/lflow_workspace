import Workflow from "@/components/Workflow";

export default function Lflow() {
  return (
    <div className=" relative h-full w-full">
      <Workflow
        flowNodes={[
          {
            id: "root",
            next: "1",
          },
          // {
          //   id: "1",
          //   next: "2",
          //   connectorCode: "Path",
          //   children: ["1-1", "1-2", "1-3"],
          // },
          // {
          //   id: "1-1",
          //   connectorCode: PathRuleCode,
          //   next: "Loop",
          // },
          // {
          //   id: "Loop",
          //   connectorCode: "Loop",
          //   children: ["Loop-1"],
          //   next: "Loop.next",
          // },
          // {
          //   id: "Loop-1",
          //   connectorCode: "Path",
          //   children: ["Loop-1.pathRule1", "Loop-1.pathRule2"],
          // },
          // {
          //   id: "Loop-1.pathRule1",
          //   connectorCode: PathRuleCode,
          // },
          // {
          //   id: "Loop-1.pathRule2",
          //   connectorCode: PathRuleCode,
          // },

          // {
          //   id: "Loop.next",
          // },
          // {
          //   id: "1-3",
          //   connectorCode: PathRuleCode,
          // },
          // {
          //   id: "1-2",
          //   connectorCode: PathRuleCode,
          //   next: "1-2-1",
          // },

          // {
          //   id: "1-2-1",
          //   connectorCode: "Path",
          //   children: ["1-2-1-1", "1-2-1-2"],
          // },
          // {
          //   id: "1-2-1-1",
          //   connectorCode: PathRuleCode,
          // },
          // {
          //   id: "1-2-1-2",
          //   connectorCode: PathRuleCode,
          // },
          // {
          //   id: "2",
          //   next: "3",
          // },
          // {
          //   id: "3",
          // },
        ]}
      />
    </div>
  );
}
