import { useFormStore } from "../store";

export default function useEditor(type: string) {
  const _map = useFormStore((state) => state.fieldComponentMap);

  //@ts-expect-error 222
  return _map[type] || _map["Input"];
}
