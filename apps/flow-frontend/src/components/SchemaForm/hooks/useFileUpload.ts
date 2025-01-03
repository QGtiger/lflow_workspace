import { useFormStore } from '../store';

export default function useFileUpload() {
  return useFormStore((state) => state.onFileUpload);
}
