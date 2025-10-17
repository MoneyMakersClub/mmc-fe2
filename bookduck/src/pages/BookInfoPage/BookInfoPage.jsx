import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import BookInfo from "../../components/BookInfoPage/BookInfo";
import TabBarComponent from "../../components/common/TabBarComponent";
import InfoView from "../../components/BookInfoPage/InfoView";
import ArchiveView from "../../components/BookInfoPage/ArchiveView";
import FloatingRecordButton from "../../components/common/FloatingRecordButton";
import MyComment from "../../components/BookInfoPage/MyComment";
import { getBookInfo, getOneLineRatingsInfo } from "../../api/bookinfo";
import SuspenseLoading from "../../components/common/SuspenseLoading";
import RecordingPage from "../RecordingPage/RecordingPage";

const BookInfoPage = () => {
  const { bookinfoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const isRecording = searchParams.get('recording') === 'true';
  
  const [activeTab, setActiveTab] = useState("책 정보");
  const [RatingListData, setRatingListData] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // 데이터 요청 전 로딩 시작
        const res = await getBookInfo({ bookinfoId });
        const res2 = await getOneLineRatingsInfo({ bookinfoId });
        setBookData(res);
        setRatingListData(res2);
      } catch (err) {
        console.error("오류 발생: ", err);
      } finally {
        setIsLoading(false); // 요청 완료 후 로딩 종료
      }
    };
    fetchData();
  }, [bookinfoId]);

  const handleBack = () => {
    // 쿼리 파라미터 제거하여 원래 페이지로 돌아가기
    const currentPath = location.pathname;
    navigate(currentPath);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SuspenseLoading />
      </div>
    );
  }

  // 기록하기 모드일 때 RecordingPage 렌더링
  if (isRecording) {
    return <RecordingPage />;
  }

  return (
    <div className="w-full w-max-[64rem]">
      <NavigationHeader title="" handleBack={handleBack} />
      <div className="flex flex-col pt-[calc(env(safe-area-inset-top)+2.75rem+0.5rem)] gap-5">
        <div className="flex flex-col gap-2 px-4">
          <div className="flex flex-col gap-5">
            <BookInfo bookData={bookData} />
            <MyComment bookData={bookData} />
          </div>
        </div>
        <div className="flex flex-col mt-2 gap-4">
          <TabBarComponent
            tabs={["책 정보", "기록"]}
            activeTab={activeTab}
            onTabClick={setActiveTab}
            size=""
          />
          {activeTab === "책 정보" && (
            <InfoView
              bookData={bookData?.bookInfoDetailDto}
              ratingData={RatingListData}
            />
          )}
          {activeTab === "기록" && <ArchiveView bookinfoId={bookinfoId} />}
          <div className="fixed bottom-[2.625rem] flex justify-end w-[24.5625rem] cursor-pointer">
            <FloatingRecordButton text={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoPage;
