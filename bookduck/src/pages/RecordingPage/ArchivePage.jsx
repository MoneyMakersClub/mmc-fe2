import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../api/example";
import BottomNavbar from "../../components/common/BottomNavbar";
import BasicHeader from "../../components/common/BasicHeader";
import TotalView from "../../components/RecordingPage/TotalView";
import TabBarComponent from "../../components/common/TabBarComponent";
import ExcerptView from "../../components/RecordingPage/ExcerptView";
import ReviewView from "../../components/RecordingPage/ReviewView";
import { useNavigate, useLocation } from "react-router-dom";
import FloatingRecordButton from "../../components/common/FloatingRecordButton";
import RecordingPage from "./RecordingPage";

const ArchivePage = () => {
  const [tab, setTab] = useState("전체보기");
  const navigate = useNavigate();
  const location = useLocation();
  
  // 쿼리 파라미터 확인
  const searchParams = new URLSearchParams(location.search);
  const isRecording = searchParams.get('recording') === 'true';

  const {
    data: font,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fontSettings"],
    queryFn: async () => {
      const response = await get(`/settings`);
      return response.recordFont;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // 기록하기 모드일 때 RecordingPage 렌더링
  if (isRecording) {
    return <RecordingPage />;
  }

  return (
    <>
      <div className="flex flex-col ">
        <BasicHeader title="기록 아카이브" />
        <TabBarComponent
          tabs={["전체보기", "발췌", "감상평"]}
          activeTab={tab}
          onTabClick={setTab}
          size="small"
          borderWidth="3rem"
        />
        <div className="px-4">
          {tab === "전체보기" && <TotalView font={font} />}
          {tab === "발췌" && <ExcerptView font={font} />}
          {tab === "감상평" && <ReviewView font={font} />}
          <div className="h-[6rem] bg-transparent"></div>
        </div>
        <div className="fixed bottom-[6.38rem] flex justify-end w-[24.5625rem] cursor-pointer">
          <FloatingRecordButton text={false} />
        </div>

        <BottomNavbar />
      </div>
    </>
  );
};
export default ArchivePage;
