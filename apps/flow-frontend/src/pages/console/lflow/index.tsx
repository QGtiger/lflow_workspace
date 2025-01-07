import Workflow from "@/components/Workflow";

export default function Lflow() {
  return (
    <Workflow
      flowNodes={[
        {
          id: "1",
          next: "2",
        },
        {
          id: "2",
        },
      ]}
    />
  );
}
