import useNav from "@/hooks/useNav";
import { useMount } from "ahooks";

export default function Entry() {
  const { navEntry } = useNav();

  useMount(navEntry);
  return null;
}
