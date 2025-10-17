import React from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { get, patch } from "../../api/example";
import NotificationItemComponent from "./NotificationItemComponent";
import { useSSE } from "../../context/SSEProvider";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

/* API - 일반 알람 읽음 처리 */
export const patchAlarm = async (alarmId) => {
  await patch(`/alarms/common`, { alarmId });
};

/* API - 알람 리스트 받기 */
export const getAlarmList = async ({ pageParam = 0 }) => {
  const DATA_LIMIT = 10;
  const response = await get(
    `/alarms/common?page=${pageParam}&size=${DATA_LIMIT}`
  );
  console.log("알람데이터", response);
  const { pageContent, totalPages } = response;

  return {
    pageContent,
    nextPage: pageParam + 1,
    totalPages: totalPages || 1,
  };
};

const GeneralNotiComponent = () => {
  const queryClient = useQueryClient();
  const { sseData } = useSSE();

  // React Query - 알람 리스트 가져오기
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["alarmList"],
      queryFn: getAlarmList,
      getNextPageParam: (lastPage) =>
        lastPage.nextPage < lastPage.totalPages ? lastPage.nextPage : undefined,
    });

  // 무한 스크롤 훅 사용
  const { loaderRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  // React Query - 알람 읽음 처리
  const { mutate: markAsRead } = useMutation({
    mutationFn: patchAlarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alarmList"] });
    },
  });

  // SSE 데이터 처리
  React.useEffect(() => {
    if (!sseData.isCommonAlarmChecked) {
      queryClient.invalidateQueries({ queryKey: ["alarmList"] });
    }
  }, [sseData, queryClient]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      {data.pages.map((page, pageIndex) =>
        page.pageContent.map((notification, index) => (
          <div key={`${pageIndex}-${index}`}>
            <NotificationItemComponent
              alarmId={notification.alarmId}
              alarmType={notification.alarmType}
              boldText={notification.boldText}
              isRead={notification.isRead}
              createdTime={notification.createdTime}
              resourceId={notification.resourceId}
              onMarkAsRead={() => markAsRead(notification.alarmId)}
            />
          </div>
        ))
      )}
      <div ref={loaderRef}>{isFetchingNextPage && <div>로딩 중...</div>}</div>
    </>
  );
};

export default GeneralNotiComponent;
