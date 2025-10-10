import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  const mutate = useCallback(
    async ({
      apiCall,
      queryKeys = [],
      onSuccess,
      onError,
      optimisticUpdate,
      rollback,
    }) => {
      // 1. 낙관적 업데이트 (즉시 UI 업데이트)
      if (optimisticUpdate) {
        optimisticUpdate();
      }

      try {
        // 2. API 호출
        const result = await apiCall();

        // 3. React Query 캐시 무효화
        queryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
        });

        // 4. 성공 콜백 실행
        if (onSuccess) {
          onSuccess(result);
        }

        return { success: true, data: result };
      } catch (error) {
        console.error("낙관적 업데이트 실패:", error);

        // 5. 실패 시 롤백
        if (rollback) {
          rollback();
        }

        // 6. 실패 콜백 실행
        if (onError) {
          onError(error);
        }

        return { success: false, error };
      }
    },
    [queryClient]
  );

  return { mutate };
};

