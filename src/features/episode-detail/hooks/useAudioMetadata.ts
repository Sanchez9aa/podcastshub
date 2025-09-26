import { useCallback, useState } from "react";
import type { UseAudioMetadataReturn } from "@/features/episode-detail/types/AudioTypes";

export function useAudioMetadata(): UseAudioMetadataReturn {
  const [hasError, setHasError] = useState(false);

  const onError = useCallback(() => {
    setHasError(true);
  }, []);

  return {
    hasError,
    onError,
  };
}
