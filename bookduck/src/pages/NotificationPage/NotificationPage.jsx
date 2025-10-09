import React, { useState, useEffect } from "react";
import NavigationHeader from "../../components/common/NavigationHeader";
import TabBarComponent from "../../components/common/TabBarComponent";
import GeneralNotiComponent from "../../components/NotificationPage/GeneralNotiComponent";
import AnnounceNotiComponent from "../../components/NotificationPage/AnnounceNotiComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSSE } from "../../context/SSEProvider";
import { patch } from "../../api/example";

export const patchAllAlarm = async () => {
  await patch(`/alarms/common/all`);
};
const NotificationPage = () => {
  const [tab, setTab] = useState("일반");
  const { sseData } = useSSE();
  const queryClient = useQueryClient();
  const [dotStates, setDotStates] = useState([false, false]);

  const { mutate: markAsAllRead } = useMutation({
    mutationFn: patchAllAlarm,
    onSuccess: () => {
      console.log("다읽기성공");
      queryClient.invalidateQueries({ queryKey: ["alarmList"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (sseData) {
      const newDotStates = [
        sseData.isCommonAlarmChecked === null
          ? null
          : !sseData.isCommonAlarmChecked,
        sseData.isAnnouncementChecked === null
          ? null
          : !sseData.isAnnouncementChecked,
      ];
      console.log("업데이트된 dotStates:", newDotStates);
      setDotStates(newDotStates);
    }
  }, [sseData]);

  return (
    <div className="relative">
      <NavigationHeader title="알림" edit={false} />
      <div>
        <TabBarComponent
          tabs={["일반", "공지"]}
          activeTab={tab}
          onTabClick={setTab}
          size="small"
          handleNotiClick={markAsAllRead}
          isNoti={true}
          borderWidth="3rem"
          dotStates={dotStates}
        />
      </div>

      {tab === "일반" && <GeneralNotiComponent />}
      {tab === "공지" && <AnnounceNotiComponent />}
    </div>
  );
};

export default NotificationPage;
