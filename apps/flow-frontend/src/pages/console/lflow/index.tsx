import Workflow from "@/components/Workflow";

export default function Lflow() {
  return (
    <div className=" relative h-full w-full">
      <Workflow
        flowNodes={[
          {
            id: "1",
            next: "2",
            connectorCode: "Path",
            children: ["1-1", "1-2", "1-3"],
          },
          {
            id: "1-1",
            connectorCode: "PathRule",
          },
          {
            id: "1-3",
            connectorCode: "PathRule",
          },
          {
            id: "1-2",
            connectorCode: "PathRule",
            next: "1-2-1",
          },

          {
            id: "1-2-1",
            connectorCode: "Path",
            children: ["1-2-1-1", "1-2-1-2"],
          },
          {
            id: "1-2-1-1",
            connectorCode: "PathRule",
          },
          {
            id: "1-2-1-2",
            connectorCode: "PathRule",
          },
          {
            id: "2",
            next: "3",
          },
          {
            id: "3",
          },
        ]}
      />
      <div className=" absolute w-[300px] h-[500px] top-0">
        <Workflow
          flowNodes={[
            {
              id: "1",
              next: "2",
              connectorCode: "Path",
              children: ["1-1", "1-2", "1-3"],
            },
            {
              id: "1-1",
              connectorCode: "PathRule",
            },
            {
              id: "1-3",
              connectorCode: "PathRule",
            },
            {
              id: "1-2",
              connectorCode: "PathRule",
              next: "1-2-1",
            },

            {
              id: "1-2-1",
              connectorCode: "Path",
              children: ["1-2-1-1", "1-2-1-2"],
            },
            {
              id: "1-2-1-1",
              connectorCode: "PathRule",
            },
            {
              id: "1-2-1-2",
              connectorCode: "PathRule",
            },
            {
              id: "2",
              next: "3",
            },
            {
              id: "3",
            },
          ]}
        />
      </div>
    </div>
  );
}
